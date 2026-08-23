import { RtiApplicationData, RtiStage, AppealGround } from "@/types/rti";

export const initialRtiData: RtiApplicationData = {
  stage: "section6_application",
  applicantName: "A Citizen of India",
  applicantAddress: "Address line 1, City, State, PIN Code",
  applicantPhone: "+91 98765 43210",
  applicantEmail: "citizen@example.com",
  isBpl: false,
  bplCardNo: "",
  isLifeOrLiberty: false,
  publicAuthority: "Public Works Department / Municipal Corporation",
  department: "Engineering & Public Works Division",
  pioDesignation: "The Public Information Officer (PIO)",
  pioAddress: "Office of the PIO, Civic Centre, Municipal Division",
  subject: "Application under Section 6(1) of the Right to Information Act, 2005 seeking specific public records",
  timePeriod: "Past 2 Fiscal Years (2023 - Present)",
  queries: [
    "Please provide certified copies of all sanctioned estimates, work orders, and completion certificates for the designated work.",
    "Please provide the names, designations, and official contact details of the Junior Engineer and Executive Engineer responsible for quality inspection.",
    "Please provide certified copies of the measurement book (MB) and quality audit/material testing reports for the aforementioned project.",
    "If the work was delayed beyond the contracted timeline, please provide the daily progress register and reasons on record for non-completion."
  ],
  applicationFeeMode: "Online Portal Payment",
  feeDetails: "Application fee of ₹10/- deposited via prescribed mode (RTI Portal Payment / IPO / Court Fee Stamp).",
  declarations: {
    isCitizen: true,
    nonExemptSec8: true,
    sec6Clause3Transfer: true,
  },
  stateOrCentral: "State Government",
  stateName: "Delhi / NCT",
  firstAppeal: {
    originalRtiRegNo: "RTI/2024/09812",
    originalRtiDate: "01/05/2024",
    originalPioName: "Public Information Officer",
    originalPioAddress: "Office of the PIO",
    groundOfAppeal: "no_response_30_days",
    groundDescription: "More than 30 days have elapsed since the submission of the original Section 6(1) application, but no response or certified records have been received from the PIO in violation of Section 7(1).",
    reliefSought: "Direction to the PIO to provide all certified information immediately free of cost under Section 7(6) of the RTI Act, 2005 and recommend penal proceedings under Section 20(1).",
    firstAppellateAuthority: "The First Appellate Authority (FAA) / Additional Commissioner"
  },
  inspection: {
    proposedDates: "Within 15 days of receipt of this notice on any working day",
    specificWorksOrFiles: "Original measurement book, tender file, quality test registers, and physical site inspection",
    samplesRequested: true,
    sampleDescription: "Certified samples of road bitumen, concrete core, and sub-base material as per Section 2(j)(iii) of RTI Act."
  }
};

export function generateRtiPlainText(data: RtiApplicationData): string {
  if (data.stage === "first_appeal_19_1") {
    return generateFirstAppealPlainText(data);
  }
  if (data.stage === "inspection_2_j") {
    return generateInspectionPlainText(data);
  }
  return generateSection6PlainText(data);
}

function generateSection6PlainText(data: RtiApplicationData): string {
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const queryItems = data.queries.length > 0 
    ? data.queries.map((q, idx) => `${idx + 1}. ${q}`).join('\n\n')
    : "1. Details of actions taken on the grievance filed by the applicant.";

  return `FORM 'A'
FORMAT OF APPLICATION UNDER SECTION 6(1) OF THE RIGHT TO INFORMATION ACT, 2005

Date: ${currentDate}

To,
${data.pioDesignation}
${data.department ? data.department + '\n' : ''}${data.publicAuthority}
${data.pioAddress}

SUBJECT: Application seeking information under Section 6(1) of the Right to Information Act, 2005.

Sir / Madam,

I am a citizen of India and I hereby seek the following information under Section 6(1) of the Right to Information Act, 2005:

1. PARTICULARS OF INFORMATION SOUGHT:
----------------------------------------------------------------------
Subject Matter / Context:
${data.subject}

Time Period Pertaining to Information:
${data.timePeriod || 'As per records maintained by the department'}

Specific Inquiries:
${queryItems}
----------------------------------------------------------------------

2. STATUTORY CLAUSES & DECLARATIONS:
(i) Citizenship: I hereby confirm that I am a Citizen of India.
(ii) Section 8 & 9 Non-Exemption: To the best of my knowledge, the information sought does not fall within the exemptions specified under Section 8 and Section 9 of the RTI Act, 2005.
(iii) Section 6(3) Transfer Request: If the information requested above or any part thereof is held by or more closely related to another Public Authority, please transfer this application or relevant parts to the concerned Public Authority within 5 days as mandated under Section 6(3) of the Act and inform the undersigned accordingly.
(iv) Section 7(1) Timeline: Kindly provide the certified information within the statutory period of 30 days (or 48 hours if concerning life or liberty) as prescribed under Section 7(1) of the Act.

3. APPLICATION FEE DETAILS:
Mode of Payment: ${data.applicationFeeMode}
Fee Status: ${data.isBpl ? `Exempt under BPL category (BPL Card No: ${data.bplCardNo || 'Enclosed herewith'})` : data.feeDetails}

4. PARTICULARS OF THE APPLICANT:
Name: ${data.applicantName}
Postal Address: ${data.applicantAddress}
Contact Number: ${data.applicantPhone}
Email Address: ${data.applicantEmail}

Yours faithfully,

(Signature / Name of Applicant)
${data.applicantName}
`;
}

function generateFirstAppealPlainText(data: RtiApplicationData): string {
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const appeal = data.firstAppeal || initialRtiData.firstAppeal!;

  const groundsMap: Record<AppealGround, string> = {
    no_response_30_days: "No response or information received from the PIO within the statutory 30-day period (Section 7(1) violation).",
    incomplete_misleading_info: "Incomplete, vague, or misleading information provided by the PIO.",
    unlawful_exemption_sec8: "Information wrongfully and arbitrarily denied by citing Section 8 exemptions without reasoned justification.",
    excessive_fee_demanded: "Unreasonable or excessive additional fee demanded after the 30-day timeline in violation of Section 7(6).",
    refusal_to_accept_application: "Public Information Officer / Assistant PIO refused to receive the Section 6(1) application."
  };

  return `FORM 'B'
MEMORANDUM OF FIRST APPEAL UNDER SECTION 19(1) OF THE RIGHT TO INFORMATION ACT, 2005

Date: ${currentDate}

BEFORE THE FIRST APPELLATE AUTHORITY (FAA)
${appeal.firstAppellateAuthority}
${data.publicAuthority}
${data.pioAddress}

IN THE MATTER OF:
${data.applicantName}                                 ... APPELLANT
vs.
${data.pioDesignation}, ${data.publicAuthority}       ... RESPONDENT (CPIO / SPIO)

SUBJECT: First Appeal under Section 19(1) of the RTI Act, 2005 against the default/order of the PIO.

1. PARTICULARS OF THE APPELLANT:
Name: ${data.applicantName}
Address: ${data.applicantAddress}
Phone: ${data.applicantPhone}
Email: ${data.applicantEmail}

2. PARTICULARS OF THE RESPONDENT (PIO):
Designation: ${data.pioDesignation}
Department / Office: ${data.department}, ${data.publicAuthority}
Address: ${data.pioAddress}

3. DETAILS OF ORIGINAL RTI APPLICATION UNDER SECTION 6(1):
Registration / Reference Number: ${appeal.originalRtiRegNo || 'Enclosed in Annexure A'}
Date of Filing Original RTI: ${appeal.originalRtiDate || '30+ days prior'}
Subject of Original RTI: ${data.subject}

4. GROUNDS FOR FIRST APPEAL:
Primary Legal Ground: ${groundsMap[appeal.groundOfAppeal] || groundsMap.no_response_30_days}

Detailed Facts & Submission:
${appeal.groundDescription || 'The appellant submitted a valid Section 6(1) RTI application with prescribed fee. The statutory period of 30 days under Section 7(1) of the RTI Act, 2005 has lapsed without any communication or supply of certified records.'}

5. PRAYER / RELIEF SOUGHT:
The Appellant respectfully prays that the Hon'ble First Appellate Authority may be pleased to:
(i) Direct the Respondent Public Information Officer to furnish complete, certified copies of the information sought under Section 6(1) forthwith.
(ii) As per Section 7(6) of the RTI Act, 2005, direct that all requested information be provided FREE OF COST due to the failure to respond within 30 days.
(iii) Issue an advisory to the PIO for timely compliance and recommend disciplinary action under Section 20 if default was deliberate.

VERIFICATION:
I, ${data.applicantName}, do hereby verify that the contents of this Appeal Memorandum are true to my personal knowledge and belief.

Yours faithfully,

(Signature of Appellant)
${data.applicantName}
`;
}

function generateInspectionPlainText(data: RtiApplicationData): string {
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const insp = data.inspection || initialRtiData.inspection!;

  return `NOTICE & APPLICATION FOR PHYSICAL INSPECTION OF RECORDS & WORKS
UNDER SECTION 2(j)(i), 2(j)(ii) & 2(j)(iii) OF THE RIGHT TO INFORMATION ACT, 2005

Date: ${currentDate}

To,
${data.pioDesignation}
${data.department ? data.department + '\n' : ''}${data.publicAuthority}
${data.pioAddress}

SUBJECT: Request for on-site physical inspection of public works and certified sample collection under Section 2(j) of the RTI Act, 2005.

Sir / Madam,

Under Section 2(j)(i) [inspection of work, documents, records], Section 2(j)(ii) [taking notes, extracts or certified copies], and Section 2(j)(iii) [taking certified samples of material] of the RTI Act, 2005:

1. DETAILS OF INSPECTION REQUESTED:
Subject Matter: ${data.subject}
Specific Works / Files to Inspect:
${insp.specificWorksOrFiles}

Proposed Inspection Date & Schedule:
${insp.proposedDates}

Sample Extraction Request:
${insp.samplesRequested ? `YES — The applicant seeks to take certified samples of materials under Section 2(j)(iii):\n${insp.sampleDescription}` : 'NO — Document and on-site visual inspection only.'}

2. STATUTORY RIGHTS UNDER SECTION 2(j):
As established under the RTI Act, the citizen has the right to inspect public files, measurement books, and ongoing or completed public works. Please intimate the designated date, time, and coordinating officer within 7 days.

3. APPLICANT DETAILS:
Name: ${data.applicantName}
Address: ${data.applicantAddress}
Phone: ${data.applicantPhone}

Yours faithfully,

(Signature of Applicant)
${data.applicantName}
`;
}

export interface ScenarioTemplate {
  id: string;
  title: string;
  category: string;
  badge: string;
  shortDesc: string;
  legalCitation?: string;
  stage: RtiStage;
  initialPrompt: string;
  sampleData: Partial<RtiApplicationData>;
}

export const sampleScenarios: ScenarioTemplate[] = [
  {
    id: "road-potholes",
    title: "Potholed Road & Delayed Municipal Repair",
    category: "Civic & Infrastructure",
    badge: "PWD / Municipal",
    shortDesc: "Demand tender copies, contractor MB records, and expenditure for broken roads.",
    legalCitation: "Sec 6(1) & Sec 2(j)(i) RTI Act 2005",
    stage: "section6_application",
    initialPrompt: "The main road in Sector 14 has had massive potholes for 18 months despite multiple complaints to the municipal ward. I want to file an RTI to find out who the contractor was, how much money was sanctioned, and why repair hasn't begun.",
    sampleData: {
      stage: "section6_application",
      publicAuthority: "Municipal Corporation / Public Works Department",
      department: "Road Maintenance & Civil Engineering Division",
      pioDesignation: "The Public Information Officer (Executive Engineer, Roads)",
      pioAddress: "Zonal Municipal Office, Ward Division",
      subject: "Information regarding sanction, tender allotment, expenditure, and status of road reconstruction in Sector 14",
      timePeriod: "01/01/2023 to Present",
      queries: [
        "Please provide certified copies of the sanctioned budget, tender notification, and work order issued for road repair/construction in Sector 14.",
        "Please provide the full name, registered address, and contract value of the contractor awarded the repair contract.",
        "Please provide certified copies of the measurement book (MB) entries and quality inspection reports submitted by the supervising engineer.",
        "Please specify the scheduled completion date as per contract terms and provide certified copies of penalty notices issued (if any) for delays.",
        "Please provide the daily progress register and certified copies of citizen complaints logged regarding this road along with Action Taken Reports (ATRs)."
      ]
    }
  },
  {
    id: "exam-answersheet",
    title: "Answer Sheet Certified Copy & Evaluation",
    category: "Education & Exams",
    badge: "University / Board",
    shortDesc: "Obtain evaluated answer scripts and model answer keys under Supreme Court landmark rulings.",
    legalCitation: "Supreme Court in CBSE vs Aditya Bandopadhyay (2011) 8 SCC 497",
    stage: "section6_application",
    initialPrompt: "I appeared for the state public service / university semester exam (Roll No. 882194). I suspect erroneous grading. I want a certified copy of my evaluated answer script and the official model answer key under RTI.",
    sampleData: {
      stage: "section6_application",
      publicAuthority: "State Public Service Commission / Central Examination Board",
      department: "Examination & Evaluation Confidential Division",
      pioDesignation: "The Central / State Public Information Officer (Examinations)",
      pioAddress: "Office of the Controller of Examinations, Board HQ",
      subject: "Seeking certified copies of evaluated answer sheet and model answer key for Roll No. 882194 as per Supreme Court precedent in CBSE vs Aditya Bandopadhyay",
      timePeriod: "Examination Cycle 2023-2024",
      queries: [
        "As per the law laid down by the Hon'ble Supreme Court of India in CBSE vs Aditya Bandopadhyay (2011), please provide certified photocopies of the evaluated answer scripts of the applicant for Subject: General Studies & Paper II (Roll No: 882194).",
        "Please provide certified copies of the official question paper with model answer key and marking scheme utilized by examiners.",
        "Please provide the total marks awarded question-wise, including moderator/head examiner revision marks if any.",
        "Please provide the cutoff marks for each category (General, OBC, SC, ST, EWS) in the preliminary/mains stage."
      ]
    }
  },
  {
    id: "police-fir-delay",
    title: "Police Complaint Non-Registration & GD Status",
    category: "Police & Law",
    badge: "Police Department",
    shortDesc: "Track stalled police complaints, Station General Diary (GD) entries, and investigation logs.",
    legalCitation: "Section 6(1) & Delhi HC in DCP vs Bhagat Singh",
    stage: "section6_application",
    initialPrompt: "I submitted a written police complaint regarding theft/harassment at the local Police Station 2 months ago. Neither has an FIR been registered nor have I received any update. I want an RTI to get the General Diary entry and investigation report.",
    sampleData: {
      stage: "section6_application",
      publicAuthority: "State Police Department / Office of Commissioner of Police",
      department: "District Police / Station House Officer Division",
      pioDesignation: "The Public Information Officer (Assistant Commissioner of Police / DSP)",
      pioAddress: "Office of the Deputy Commissioner of Police (District HQ)",
      subject: "Information regarding daily progress, General Diary entry, and action taken on citizen complaint dated 15/03/2024",
      timePeriod: "15/03/2024 to Present",
      queries: [
        "Please provide certified copies of the Station General Diary (GD) / Daily Diary (DD) entry recording the receipt of the complaint filed by the applicant on 15/03/2024.",
        "Please provide the name and designation of the Investigating Officer (IO) assigned to conduct preliminary inquiry on the said complaint.",
        "Please provide certified copies of all inquiry reports, witness statements, and Action Taken Reports (ATR) submitted by the IO to date.",
        "If no FIR has been registered, please provide certified copies of the official reasons recorded on file under Section 154 CrPC / BNSS for non-registration."
      ]
    }
  },
  {
    id: "scholarship-delay",
    title: "Pending Student Scholarship & DBT Funds",
    category: "Education & Exams",
    badge: "Higher Education",
    shortDesc: "Track stalled merit/social welfare scholarship disbursements and reason on record.",
    legalCitation: "Section 6(1) RTI Act 2005",
    stage: "section6_application",
    initialPrompt: "I applied for the Post-Matric State Scholarship in August 2023. My application was verified by the college, but funds have not been credited to my bank account for 10 months. I want an RTI to trace the file status.",
    sampleData: {
      stage: "section6_application",
      publicAuthority: "Department of Social Welfare / Higher Education Directorate",
      department: "Scholarship & Direct Benefit Transfer (DBT) Cell",
      pioDesignation: "The Central Public Information Officer (Scholarships Division)",
      pioAddress: "Directorate of Higher Education, Vikas Bhawan",
      subject: "Status of disbursement, file processing records, and reasons for delay in Post-Matric Scholarship (Ref App No. SCH-2023-9941)",
      timePeriod: "August 2023 to Present Date",
      queries: [
        "Please provide the daily progress report and file movement history (from desk to desk with officer designations) for Scholarship Application Ref: SCH-2023-9941.",
        "Please provide certified copies of any objections, remarks, or audit queries raised against the applicant's file.",
        "Please provide the sanctioned budget allocation and total amount disbursed under this scholarship scheme during the current financial year.",
        "Please specify the expected timeline for disbursement to the applicant's verified bank account as per Citizen's Charter standards."
      ]
    }
  },
  {
    id: "pf-pension-delay",
    title: "EPFO Claim Settlement & Pension Delay",
    category: "Labor & Benefits",
    badge: "EPFO / Labor",
    shortDesc: "Inquire about pending PF transfer/withdrawal claims past the 20-day service charter.",
    legalCitation: "EPFO Citizens' Charter & Sec 6(1) RTI Act",
    stage: "section6_application",
    initialPrompt: "I submitted my EPFO Form 19 for Provident Fund settlement 4 months ago after leaving my job. Online status shows 'Under Process' with no update. Help me draft an RTI.",
    sampleData: {
      stage: "section6_application",
      publicAuthority: "Employees' Provident Fund Organisation (EPFO)",
      department: "Regional Provident Fund Office",
      pioDesignation: "The Central Public Information Officer (CPIO), EPFO",
      pioAddress: "Regional EPFO Office, Bhavishya Nidhi Bhawan",
      subject: "Information regarding non-settlement and prolonged pendency of PF Final Settlement Claim Form 19 (UAN: 100987654321)",
      timePeriod: "Last 6 Months",
      queries: [
        "Please provide the exact daily progress and file processing log regarding Form 19 claim submitted under UAN: 100987654321.",
        "As per EPFO Citizen Charter, PF claims are mandated to be settled within 20 days. Please provide reasons recorded on file for non-disbursement within the stipulated time.",
        "Please provide the names and designations of the officials before whom this claim file was pending during each stage.",
        "Please provide certified copies of any internal communication or clarification sought between EPFO and the former employer regarding this claim."
      ]
    }
  },
  {
    id: "hospital-medicine",
    title: "Govt Hospital Medicine Stock & Doctor Absence",
    category: "Public Health",
    badge: "Health & Hospitals",
    shortDesc: "Audit free medicine availability, Jan Aushadhi stock, and doctor roster attendance.",
    legalCitation: "Section 6(1) & Section 4(1)(b) Proactive Disclosure",
    stage: "section6_application",
    initialPrompt: "The district government hospital constantly claims essential medicines like insulin and antibiotics are out of stock and forces patients to buy from private pharmacies. Also doctors are routinely missing during OPD hours. Help me draft an RTI.",
    sampleData: {
      stage: "section6_application",
      publicAuthority: "Directorate of Health Services / District Civil Hospital",
      department: "Pharmacy & Medical Supplies Division",
      pioDesignation: "The Public Information Officer (Medical Superintendent)",
      pioAddress: "Office of the Medical Superintendent, District Civil Hospital",
      subject: "Information regarding essential drug procurement, inventory register, and doctor biometric attendance logs",
      timePeriod: "Past 6 Months (October 2023 - Present)",
      queries: [
        "Please provide certified copies of the Essential Drug List (EDL) mandated for this hospital and the monthly stock registers for Insulin and critical Antibiotics.",
        "Please provide the total budget allocated and expenditure incurred on medicine procurement during the last financial year.",
        "Please provide certified copies of the doctor duty roster and biometric attendance logs for the OPD department for the last 30 days.",
        "Please provide certified copies of complaints received from patients regarding medicine shortage and corresponding Action Taken Reports."
      ]
    }
  },
  {
    id: "rto-license-delay",
    title: "RTO Driving License & RC Dispatch Delay",
    category: "Transport & RTO",
    badge: "Transport Department",
    shortDesc: "Inquire about stalled smart card Driving Licenses and RC registrations past SLA.",
    legalCitation: "Motor Vehicles Act Rules & Sec 6(1) RTI",
    stage: "section6_application",
    initialPrompt: "I passed my driving test 4 months ago at the RTO (Application No: DL-889123). Online portal shows 'Card Printing Pending'. Help me draft an RTI to track why smart card issuance is stalled.",
    sampleData: {
      stage: "section6_application",
      publicAuthority: "Regional Transport Office (RTO) / Transport Department",
      department: "Driving License & Smart Card Issuance Division",
      pioDesignation: "The Public Information Officer (Motor Licensing Officer)",
      pioAddress: "Office of the RTO / District Transport Office",
      subject: "Information regarding delayed printing and postal dispatch of Driving License (Ref: DL-889123)",
      timePeriod: "Past 4 Months",
      queries: [
        "Please provide the daily status and file movement report for Driving License Application No: DL-889123 from test passing date to present.",
        "Please state the standard time limit prescribed under the Public Service Guarantee Act for printing and dispatching driving licenses.",
        "Please provide the total number of driving license applications pending printing at this RTO for more than 30 days.",
        "Please provide the name of the smart card printing vendor and certified copies of vendor delay penalty clauses."
      ]
    }
  },
  {
    id: "electricity-meter-bills",
    title: "Faulty Smart Meter & Power Outage Logs",
    category: "Utilities & Power",
    badge: "DISCOM / Electricity",
    shortDesc: "Inspect electricity meter lab test reports, power outage duration logs, and transformer loads.",
    legalCitation: "Electricity Regulatory Commission Regulations & RTI Act",
    stage: "section6_application",
    initialPrompt: "Our electricity discom installed a new electronic smart meter and our monthly bill jumped by 300% without increased usage. Discom refuses to test the meter. I want an RTI to get meter test records and tariff computation.",
    sampleData: {
      stage: "section6_application",
      publicAuthority: "State Power Distribution Corporation (DISCOM)",
      department: "Metering, Billing & Consumer Grievance Cell",
      pioDesignation: "The Public Information Officer (Executive Engineer, Commercial)",
      pioAddress: "Office of the Executive Engineer (Electricity Distribution Division)",
      subject: "Information regarding meter accuracy testing, MRI download data, and tariff calculation for Consumer CA No: 10098234",
      timePeriod: "Last 12 Months",
      queries: [
        "Please provide certified copies of the factory calibration certificate and NABL accredited laboratory test report for Smart Meter Serial No: MTR-9821.",
        "Please provide the complete electronic Meter Reading Instrument (MRI) data dump including tamper logs and hourly load survey for the past 6 months.",
        "Please provide certified copies of the feeder outage log book and interruption duration records for Transformer TR-4 covering our locality.",
        "Please provide the detailed mathematical formula and slab tariff breakdown applied to calculate bills for the disputed period."
      ]
    }
  },
  {
    id: "land-mutation-revenue",
    title: "Land Mutation & Jamabandi Record Delay",
    category: "Land & Revenue",
    badge: "Revenue / Tehsildar",
    shortDesc: "Demand mutation file progress, Patwari field reports, and revenue entry registers.",
    legalCitation: "State Land Revenue Code & Section 6(1) RTI",
    stage: "section6_application",
    initialPrompt: "I purchased agricultural land and applied for mutation (Dakhil Kharij) in the Tehsil 8 months ago. Patwari keeps delaying the report. I want an RTI to obtain the mutation register entries and file movement.",
    sampleData: {
      stage: "section6_application",
      publicAuthority: "Revenue Department / Office of the Sub-Divisional Magistrate",
      department: "Land Records & Tehsil Office",
      pioDesignation: "The Public Information Officer (Tehsildar / Naib Tehsildar)",
      pioAddress: "Office of the Tehsildar, Tehsil Complex",
      subject: "Information regarding pendency, Patwari field verification report, and status of Mutation Application (Case No: MUT-2023-441)",
      timePeriod: "Past 8 Months",
      queries: [
        "Please provide the daily progress report and date-wise file movement history for Mutation Case No: MUT-2023-441.",
        "Please provide certified copies of the field verification report and site inspection notes submitted by the Halqa Patwari / Revenue Inspector.",
        "Please provide certified copies of any written objections or claims registered against the said mutation.",
        "Please specify the statutory maximum time limit prescribed under the State Right to Public Services Act for completing uncontested mutations."
      ]
    }
  },
  {
    id: "ration-pds",
    title: "Ration Card & Food Grain Quota Diversion",
    category: "Civil Supplies",
    badge: "PDS / Food Supplies",
    shortDesc: "Inspect stock registers, grain allocations, and e-PoS shop distribution records.",
    legalCitation: "National Food Security Act (NFSA) 2013 & RTI Act",
    stage: "section6_application",
    initialPrompt: "Our local fair price ration shop dealer refuses to give the full monthly quota of wheat and rice, claiming government supply is short. I want to draft an RTI to verify actual grain allotted to that shop.",
    sampleData: {
      stage: "section6_application",
      publicAuthority: "Department of Food, Civil Supplies & Consumer Affairs",
      department: "Public Distribution System (PDS) Division",
      pioDesignation: "The Public Information Officer / Food & Supply Officer (FSO)",
      pioAddress: "Office of the Assistant Commissioner (Food & Supplies), Sub-Division Office",
      subject: "Information regarding grain allocation, stock lifting, and e-PoS distribution registers for Fair Price Shop No. 4412",
      timePeriod: "Past 6 Months",
      queries: [
        "Please provide certified copies of monthly food grain (wheat, rice, sugar) allotment orders issued to Fair Price Shop (FPS) No. 4412.",
        "Please provide certified copies of the stock lifting register and truck challans showing actual quantities received by the said FPS dealer.",
        "Please provide electronic sales records / daily transaction logs generated from the electronic Point of Sale (e-PoS) machine at the said shop.",
        "Please state the procedure and officer contact for requesting on-site inspection of sample grains and stock registers under Section 2(j)(i) of the RTI Act, 2005."
      ]
    }
  },
  {
    id: "first-appeal-nonresponse",
    title: "RTI First Appeal (No Response in 30 Days)",
    category: "First Appeals (Sec 19)",
    badge: "First Appellate Authority",
    shortDesc: "File statutory appeal when PIO fails to furnish information within 30 days.",
    legalCitation: "Section 19(1) & Section 7(6) (Information Free of Cost)",
    stage: "first_appeal_19_1",
    initialPrompt: "I filed an RTI application regarding municipal expenditure on 01/05/2024 (Reg No: RTI/2024/09812). It has been over 35 days and the PIO has not provided any reply. I want to draft a First Appeal to the First Appellate Authority.",
    sampleData: {
      stage: "first_appeal_19_1",
      publicAuthority: "Municipal Corporation / Public Authority",
      department: "Office of the First Appellate Authority",
      pioDesignation: "The Public Information Officer (Respondent PIO)",
      pioAddress: "Zonal Municipal Office",
      subject: "First Appeal under Section 19(1) of the RTI Act, 2005 against total deemed refusal by PIO",
      firstAppeal: {
        originalRtiRegNo: "RTI/2024/09812",
        originalRtiDate: "01/05/2024",
        originalPioName: "The Public Information Officer",
        originalPioAddress: "Zonal Municipal Office",
        groundOfAppeal: "no_response_30_days",
        groundDescription: "The appellant submitted an application under Section 6(1) on 01/05/2024. Over 35 days have elapsed, but the Respondent PIO has failed to provide any information, amounting to deemed refusal under Section 7(2).",
        reliefSought: "Direct the PIO to immediately supply all requested certified records FREE OF COST as per Section 7(6) of the RTI Act, 2005.",
        firstAppellateAuthority: "The First Appellate Authority / Additional Municipal Commissioner"
      }
    }
  },
  {
    id: "physical-inspection-works",
    title: "Section 2(j) Physical On-Site Inspection",
    category: "Civic & Infrastructure",
    badge: "Inspection Notice",
    shortDesc: "Notice to physically inspect ongoing/completed public works and extract certified samples.",
    legalCitation: "Section 2(j)(i), 2(j)(ii) & 2(j)(iii) RTI Act 2005",
    stage: "inspection_2_j",
    initialPrompt: "I want to physically inspect the newly constructed public park / bridge and take physical samples of the concrete for lab testing under Section 2(j) of the RTI Act.",
    sampleData: {
      stage: "inspection_2_j",
      publicAuthority: "Public Works Department / Municipal Corporation",
      department: "Quality Control & Infrastructure Cell",
      pioDesignation: "The Public Information Officer (Chief Engineer)",
      pioAddress: "PWD Infrastructure Division, Central Zone",
      subject: "Request for physical on-site inspection of public works and certified sample extraction under Section 2(j)",
      inspection: {
        proposedDates: "Within 15 days on any mutually agreeable working day",
        specificWorksOrFiles: "Original site of Flyover / Bridge construction at Sector 18, including foundation concrete and reinforcement steel registers.",
        samplesRequested: true,
        sampleDescription: "Certified core samples of concrete mix and asphalt surface layer under Section 2(j)(iii) for independent laboratory quality testing."
      }
    }
  }
];