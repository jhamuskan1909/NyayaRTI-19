import { ExtractionResponse, RtiApplicationData, RtiStage } from "@/types/rti";
import { sampleScenarios } from "./rti-template";

const SYSTEM_PROMPT = `
You are an expert Legal AI Assistant specialized in the Right to Information Act, 2005 (India).
Your goal is to assist Indian citizens in drafting powerful, precise, legally admissible RTI applications, First Appeals under Section 19(1), and On-Site Inspection Notices under Section 2(j).

Supported Stages:
1. "section6_application": Standard RTI request seeking certified copies of records, work orders, measurement books, daily progress logs, reasons on record.
2. "first_appeal_19_1": First Appeal before First Appellate Authority (FAA) when PIO fails to respond within 30 days, gives misleading info, or wrongfully cites Section 8. Under Section 7(6), info must be provided FREE OF COST after 30 days.
3. "inspection_2_j": Notice seeking physical on-site inspection of records, public works, or certified sample extraction.

When analyzing the user's grievance:
1. Determine if this is a fresh inquiry ("section6_application"), a follow-up appeal ("first_appeal_19_1"), or an inspection notice ("inspection_2_j").
2. Formulate a polite, conversational reply acknowledging the issue and explaining the legal angle.
3. Formulate 2-4 pinpoint RTI questions under legal conventions or prepare First Appeal grounds.
4. Identify the Public Authority, Department, and PIO Designation.
5. Suggest clarifying questions.

You must respond STRICTLY with a valid JSON object matching this schema:
{
  "replyMessage": "A clear, empathetic conversational response explaining what information we can legally demand from the department.",
  "stageSuggested": "section6_application" | "first_appeal_19_1" | "inspection_2_j",
  "clarifyingQuestions": ["Question 1", "Question 2"],
  "updatedRti": {
    "stage": "section6_application" | "first_appeal_19_1" | "inspection_2_j",
    "publicAuthority": "Name of public authority / body",
    "department": "Specific department or division",
    "pioDesignation": "Designation of PIO",
    "pioAddress": "Office address of PIO",
    "subject": "Formal subject line",
    "timePeriod": "Time range relevant to the inquiry",
    "queries": [
      "Numbered, legally structured query 1",
      "Numbered, legally structured query 2"
    ],
    "firstAppeal": {
      "originalRtiRegNo": "Registration number if known",
      "originalRtiDate": "Filing date if known",
      "groundOfAppeal": "no_response_30_days",
      "groundDescription": "Detailed grounds",
      "reliefSought": "Relief sought from FAA"
    }
  },
  "missingFields": ["list of key missing details"],
  "categoryDetected": "Civic / Education / Police / Health / Labor / Utilities / Revenue / Appeals"
}
`;

export async function processGrievanceWithAI(
  userMessage: string,
  history: Array<{ sender: 'user' | 'agent'; text: string }>,
  currentRti: RtiApplicationData
): Promise<ExtractionResponse> {
  const groqKey = process.env.GROQ_API_KEY?.trim();
  const geminiKey = process.env.GEMINI_API_KEY?.trim();

  // 1. Try Groq if key exists
  if (groqKey) {
    try {
      const groqRes = await callGroqApi(userMessage, history, currentRti, groqKey);
      if (groqRes) return groqRes;
    } catch (err) {
      console.warn("Groq API call failed, falling back to next provider...", err);
    }
  }

  // 2. Try Gemini if key exists
  if (geminiKey) {
    try {
      const geminiRes = await callGeminiApi(userMessage, history, currentRti, geminiKey);
      if (geminiRes) return geminiRes;
    } catch (err) {
      console.warn("Gemini API call failed, falling back to smart heuristic engine...", err);
    }
  }

  // 3. Smart Heuristic Engine (Offline / Demo Mode)
  return fallbackHeuristicExtraction(userMessage, currentRti);
}

async function callGroqApi(
  userMessage: string,
  history: Array<{ sender: 'user' | 'agent'; text: string }>,
  currentRti: RtiApplicationData,
  apiKey: string
): Promise<ExtractionResponse | null> {
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history.slice(-4).map(h => ({
      role: h.sender === 'user' ? 'user' : 'assistant',
      content: h.text
    })),
    {
      role: "user",
      content: `Current RTI Draft State: ${JSON.stringify(currentRti)}\n\nCitizen's Latest Input: "${userMessage}"\n\nGenerate structured JSON adhering to the schema.`
    }
  ];

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages,
      response_format: { type: "json_object" },
      temperature: 0.2,
      max_tokens: 1800
    })
  });

  if (!response.ok) {
    throw new Error(`Groq API error: ${response.statusText}`);
  }

  const data = await response.json();
  const rawContent = data.choices?.[0]?.message?.content;
  if (!rawContent) return null;

  const parsed = JSON.parse(rawContent);
  return {
    ...parsed,
    modelUsed: "Groq (Llama-3.3-70B)"
  };
}

async function callGeminiApi(
  userMessage: string,
  history: Array<{ sender: 'user' | 'agent'; text: string }>,
  currentRti: RtiApplicationData,
  apiKey: string
): Promise<ExtractionResponse | null> {
  const prompt = `${SYSTEM_PROMPT}\n\nExisting RTI Draft: ${JSON.stringify(currentRti)}\nUser Grievance: "${userMessage}"\n\nRespond ONLY with a valid JSON string adhering to the specified schema.`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.2
        }
      })
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) return null;

  const parsed = JSON.parse(text);
  return {
    ...parsed,
    modelUsed: "Google Gemini 2.5 Flash"
  };
}

function fallbackHeuristicExtraction(
  message: string,
  currentRti: RtiApplicationData
): ExtractionResponse {
  const lower = message.toLowerCase();

  // 1. Check for First Appeal (30 days, appeal, no reply to past rti)
  if (lower.includes("appeal") || (lower.includes("30 days") && lower.includes("filed")) || lower.includes("no reply") || lower.includes("no response") || lower.includes("faa")) {
    const sc = sampleScenarios.find(s => s.id === "first-appeal-nonresponse") || sampleScenarios[10];
    return {
      replyMessage: "Under Section 19(1) of the RTI Act, 2005, if a Public Information Officer fails to provide a decision within 30 days or unlawfully rejects the request, you have the statutory right to file a First Appeal before the First Appellate Authority (FAA). Furthermore, under Section 7(6), all requested information MUST now be provided to you FREE OF COST!",
      stageSuggested: "first_appeal_19_1",
      clarifyingQuestions: [
        "What was the original RTI Registration / Reference Number?",
        "On what exact date was your original Section 6(1) RTI application submitted?"
      ],
      updatedRti: {
        ...sc.sampleData,
        stage: "first_appeal_19_1",
        subject: `First Appeal under Section 19(1) regarding non-compliance and deemed refusal by PIO`
      },
      missingFields: ["Original RTI Reference Number", "Original Date of Submission"],
      categoryDetected: "First Appeals (Section 19)",
      modelUsed: "Smart Legal Heuristic Engine (Demo Mode)"
    };
  }

  // 2. Physical Inspection
  if (lower.includes("inspect") || lower.includes("sample") || lower.includes("site visit") || lower.includes("physical check")) {
    const sc = sampleScenarios.find(s => s.id === "physical-inspection-works") || sampleScenarios[11];
    return {
      replyMessage: "Section 2(j)(i) gives every Indian citizen the statutory power to physically inspect government works and records, and Section 2(j)(iii) grants the power to take certified physical samples of materials (such as asphalt or concrete). I have generated a formal Section 2(j) Inspection Notice for you.",
      stageSuggested: "inspection_2_j",
      clarifyingQuestions: [
        "Which specific public site, flyover, building, or file do you wish to inspect?",
        "Do you intend to take material samples for certified laboratory testing?"
      ],
      updatedRti: {
        ...sc.sampleData,
        stage: "inspection_2_j",
        subject: `Notice & Request for physical on-site inspection and sample extraction under Section 2(j) of RTI Act`
      },
      missingFields: ["Specific Site Location", "Proposed Inspection Dates"],
      categoryDetected: "Physical Inspection (Section 2(j))",
      modelUsed: "Smart Legal Heuristic Engine (Demo Mode)"
    };
  }

  // 3. Police & FIR
  if (lower.includes("police") || lower.includes("fir") || lower.includes("thana") || lower.includes("complaint") || lower.includes("chowki") || lower.includes("general diary") || lower.includes("gd entry")) {
    const sc = sampleScenarios.find(s => s.id === "police-fir-delay") || sampleScenarios[2];
    return {
      replyMessage: "Non-registration of FIRs and lack of updates on written complaints can be challenged under Section 6(1) of the RTI Act. As affirmed in Delhi High Court precedents, citizens are entitled to certified copies of General Diary (GD) entries and Action Taken Reports (ATRs).",
      stageSuggested: "section6_application",
      clarifyingQuestions: [
        "What is the name and jurisdiction of the Police Station where you submitted your complaint?",
        "Do you have the Diary Reference Number or the date on the receiving stamp?"
      ],
      updatedRti: {
        ...sc.sampleData,
        stage: "section6_application",
        subject: `Application under Section 6(1) seeking General Diary entry, investigation status, and Action Taken Report on citizen complaint`
      },
      missingFields: ["Police Station Name", "Date of Complaint"],
      categoryDetected: "Police & Law Enforcement",
      modelUsed: "Smart Legal Heuristic Engine (Demo Mode)"
    };
  }

  // 4. Exam & Answer Sheets
  if (lower.includes("exam") || lower.includes("answer sheet") || lower.includes("marks") || lower.includes("result") || lower.includes("upsc") || lower.includes("ssc") || lower.includes("board") || lower.includes("roll no")) {
    const sc = sampleScenarios.find(s => s.id === "exam-answersheet") || sampleScenarios[1];
    return {
      replyMessage: "In the landmark judgment *CBSE vs Aditya Bandopadhyay (2011)*, the Supreme Court ruled that an examinee has the fundamental right under the RTI Act to inspect and obtain certified photocopies of their evaluated answer scripts, along with official model keys.",
      stageSuggested: "section6_application",
      clarifyingQuestions: [
        "What is your Examination Roll Number and Center Code?",
        "Which specific subjects or papers do you want certified answer scripts for?"
      ],
      updatedRti: {
        ...sc.sampleData,
        stage: "section6_application",
        subject: `Seeking certified copies of evaluated answer scripts, model keys, and cutoff marks under Supreme Court ruling in CBSE vs Aditya Bandopadhyay`
      },
      missingFields: ["Roll Number", "Subject / Paper Codes"],
      categoryDetected: "Education & Competitive Exams",
      modelUsed: "Smart Legal Heuristic Engine (Demo Mode)"
    };
  }

  // 5. Hospital & Health
  if (lower.includes("hospital") || lower.includes("medicine") || lower.includes("doctor") || lower.includes("patient") || lower.includes("health") || lower.includes("treatment") || lower.includes("ayushman")) {
    const sc = sampleScenarios.find(s => s.id === "hospital-medicine") || sampleScenarios[5];
    return {
      replyMessage: "Government hospitals are public authorities bound by Section 4(1)(b) proactive disclosure. You have the right to inspect essential drug registers, procurement expenditure, and doctor duty attendance logs under Section 6(1).",
      stageSuggested: "section6_application",
      clarifyingQuestions: [
        "What is the exact name and location of the Government Civil Hospital or CHC/PHC?",
        "Which specific medicines or departments (e.g. OPD, Emergency) were found deficient?"
      ],
      updatedRti: {
        ...sc.sampleData,
        stage: "section6_application",
        subject: `Application under Section 6(1) seeking essential drug inventory logs, procurement records, and doctor attendance logs`
      },
      missingFields: ["Hospital Name", "Target Medical Department"],
      categoryDetected: "Public Health & Hospitals",
      modelUsed: "Smart Legal Heuristic Engine (Demo Mode)"
    };
  }

  // 6. RTO & Driving License
  if (lower.includes("license") || lower.includes("rto") || lower.includes("driving") || lower.includes("vehicle") || lower.includes("rc") || lower.includes("challan")) {
    const sc = sampleScenarios.find(s => s.id === "rto-license-delay") || sampleScenarios[6];
    return {
      replyMessage: "Delays in printing and dispatching smart-card Driving Licenses and Vehicle RCs violate State Public Service Guarantee Acts. I have formulated an RTI demanding the desk-to-desk file movement log and vendor penalty status.",
      stageSuggested: "section6_application",
      clarifyingQuestions: [
        "What is your DL Application Reference Number or Learner License number?",
        "Which RTO / District Transport Office has jurisdiction over your application?"
      ],
      updatedRti: {
        ...sc.sampleData,
        stage: "section6_application",
        subject: `Seeking file movement history, smart card printing status, and dispatch records for DL/RC Application`
      },
      missingFields: ["DL / RC Application Number", "RTO Division"],
      categoryDetected: "Transport & RTO Services",
      modelUsed: "Smart Legal Heuristic Engine (Demo Mode)"
    };
  }

  // 7. Electricity & Smart Meter
  if (lower.includes("electricity") || lower.includes("meter") || lower.includes("power") || lower.includes("discom") || lower.includes("bijli") || lower.includes("bill") || lower.includes("voltage")) {
    const sc = sampleScenarios.find(s => s.id === "electricity-meter-bills") || sampleScenarios[7];
    return {
      replyMessage: "Disputed smart meter bills and frequent unannounced power cuts can be legally audited by demanding certified NABL laboratory calibration certificates, MRI data dumps, and feeder outage registers under Section 6(1).",
      stageSuggested: "section6_application",
      clarifyingQuestions: [
        "What is your Electricity Consumer Account (CA) Number and Meter Serial Number?",
        "Which specific billing months show abnormal surge in units?"
      ],
      updatedRti: {
        ...sc.sampleData,
        stage: "section6_application",
        subject: `Application seeking meter lab calibration report, MRI data dump, and power outage log for Consumer CA Number`
      },
      missingFields: ["Consumer CA Number", "Meter Serial Number"],
      categoryDetected: "Utilities & Electricity (DISCOM)",
      modelUsed: "Smart Legal Heuristic Engine (Demo Mode)"
    };
  }

  // 8. Land & Mutation
  if (lower.includes("land") || lower.includes("mutation") || lower.includes("dakhil") || lower.includes("kharij") || lower.includes("patwari") || lower.includes("tehsil") || lower.includes("jamabandi") || lower.includes("khasra")) {
    const sc = sampleScenarios.find(s => s.id === "land-mutation-revenue") || sampleScenarios[8];
    return {
      replyMessage: "Revenue authorities and Patwaris are accountable for timely entry in Mutation registers (Dakhil Kharij). An RTI application under Section 6(1) compels the Tehsildar to place the daily progress log and field inspection report on record.",
      stageSuggested: "section6_application",
      clarifyingQuestions: [
        "What is the Mutation Application / Case Registration Number and Village/Tehsil name?",
        "On what date was the sale deed registered or mutation filed?"
      ],
      updatedRti: {
        ...sc.sampleData,
        stage: "section6_application",
        subject: `Seeking daily progress, Patwari field verification report, and status of Mutation Case in Tehsil records`
      },
      missingFields: ["Mutation Case Number", "Tehsil / Village Name"],
      categoryDetected: "Land Records & Revenue",
      modelUsed: "Smart Legal Heuristic Engine (Demo Mode)"
    };
  }

  // 9. Roads & Civic Potholes
  if (lower.includes("road") || lower.includes("pothole") || lower.includes("gaddha") || lower.includes("sadak") || lower.includes("drain") || lower.includes("street")) {
    const sc = sampleScenarios[0];
    return {
      replyMessage: "Under Section 6(1) and Section 2(j)(i) of the RTI Act, citizens have the legal right to inspect public civil works, obtain certified copies of contracts/tenders, and demand measurement book (MB) records from the PWD or Municipal Corporation.",
      stageSuggested: "section6_application",
      clarifyingQuestions: [
        "Do you have a specific street/locality name or municipal ward number?",
        "Would you also like to request physical sample inspection of road materials under Section 2(j)(i)?"
      ],
      updatedRti: {
        ...sc.sampleData,
        stage: "section6_application",
        subject: `Application under Section 6(1) regarding tender, sanctioned expenditure, and delayed repair of road`
      },
      missingFields: ["Specific Ward Number", "Contractor Tender Number (if known)"],
      categoryDetected: "Civic Infrastructure & Public Works",
      modelUsed: "Smart Legal Heuristic Engine (Demo Mode)"
    };
  }

  // 10. Scholarship
  if (lower.includes("scholarship") || lower.includes("college") || lower.includes("university") || lower.includes("student") || lower.includes("fees") || lower.includes("dbt")) {
    const sc = sampleScenarios[3];
    return {
      replyMessage: "Delayed educational scholarship disbursements violate student entitlements. I have structured an RTI directed to the Directorate of Higher Education / Social Welfare Department requesting desk-to-desk file movement and reasons on record.",
      stageSuggested: "section6_application",
      clarifyingQuestions: [
        "What is your Scholarship Application / Registration Reference ID?",
        "Which academic year or financial period does this pending amount belong to?"
      ],
      updatedRti: {
        ...sc.sampleData,
        stage: "section6_application",
        subject: `Seeking file movement history, approval logs, and reasons on record for delay in scholarship disbursement`
      },
      missingFields: ["Scholarship Application Number", "Institutional Verification Date"],
      categoryDetected: "Higher Education & Social Welfare",
      modelUsed: "Smart Legal Heuristic Engine (Demo Mode)"
    };
  }

  // 11. EPFO / PF
  if (lower.includes("pf") || lower.includes("epfo") || lower.includes("pension") || lower.includes("provident") || lower.includes("uan")) {
    const sc = sampleScenarios[4];
    return {
      replyMessage: "As per the EPFO Citizen Charter, claims are required to be settled within 20 days. Prolonged pendency without explanation violates service norms. I have drafted an RTI under Section 6(1) demanding the official daily processing log.",
      stageSuggested: "section6_application",
      clarifyingQuestions: [
        "Do you have your Universal Account Number (UAN) and Claim Tracking ID?",
        "Which Regional PF Office (city/jurisdiction) does your establishment belong to?"
      ],
      updatedRti: {
        ...sc.sampleData,
        stage: "section6_application",
        subject: `Application under Section 6(1) regarding pendency, file movement, and reasons for delay in settling PF Claim`
      },
      missingFields: ["UAN Number", "Regional PF Office Division"],
      categoryDetected: "Labor & Social Security (EPFO)",
      modelUsed: "Smart Legal Heuristic Engine (Demo Mode)"
    };
  }

  // 12. Ration / PDS
  if (lower.includes("ration") || lower.includes("pds") || lower.includes("grain") || lower.includes("wheat") || lower.includes("rice")) {
    const sc = sampleScenarios[9];
    return {
      replyMessage: "Irregularities in Public Distribution System (PDS) food grain distribution can be investigated through Section 6(1) and physical inspection under Section 2(j). I have drafted an application demanding monthly allotment logs and e-PoS transaction records.",
      stageSuggested: "section6_application",
      clarifyingQuestions: [
        "What is the Fair Price Shop (FPS) License / Shop Number or dealer name?",
        "Which specific months were you denied your full subsidized entitlement?"
      ],
      updatedRti: {
        ...sc.sampleData,
        stage: "section6_application",
        subject: `Application under Section 6(1) seeking grain allocation orders, stock lifting challans, and distribution records for Fair Price Shop`
      },
      missingFields: ["Fair Price Shop Number", "Ration Card Number"],
      categoryDetected: "Food & Civil Supplies (PDS)",
      modelUsed: "Smart Legal Heuristic Engine (Demo Mode)"
    };
  }

  // Generic grievance fallback
  const synthesizedQueries = [
    `Please provide certified copies of all file notings, orders, and correspondence regarding the grievance: "${message.slice(0, 100)}..."`,
    "Please provide the daily progress report and list of officials (with names and designations) before whom this matter has been pending.",
    "Please specify the maximum time frame prescribed under the Citizen's Charter or departmental rules for resolving such public grievances.",
    "Please provide certified copies of any inquiry reports, inspection notes, or action taken reports (ATRs) generated to date."
  ];

  return {
    replyMessage: `I have analyzed your grievance regarding "${message.slice(0, 80)}...". I have converted your concern into structured, legally sound questions requesting certified copies, file movement records, and official timelines under Section 6(1) of the RTI Act, 2005.`,
    stageSuggested: "section6_application",
    clarifyingQuestions: [
      "Do you know the exact name of the government department or municipal office that handles this matter?",
      "Do you have a previous complaint reference number or date of filing?"
    ],
    updatedRti: {
      stage: "section6_application",
      publicAuthority: "Concerned Public Authority / Department",
      department: "Grievance & Public Relations Division",
      pioDesignation: "The Public Information Officer (PIO)",
      pioAddress: "Office of the Public Information Officer, Concerned Government Office",
      subject: `Application under Section 6(1) of the RTI Act, 2005 seeking information and certified records regarding: ${message.slice(0, 90)}`,
      timePeriod: "Last 1 Year to Present",
      queries: synthesizedQueries
    },
    missingFields: ["Concerned Department Name", "Jurisdiction / City / Ward"],
    categoryDetected: "General Citizen Rights & Grievances",
    modelUsed: "Smart Legal Heuristic Engine (Demo Mode)"
  };
}
