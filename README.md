# NyayaRTI: Citizen Rights & RTI Drafting Platform

> **Submission for OOSC 4.0 Hackathon (Unstop) | Problem Statement 3 (Citizen Rights & Legal Technology)**

NyayaRTI is an end-to-end civic-tech platform that translates everyday citizen grievances into legally structured, statutory inquiries under India's **Right to Information (RTI) Act, 2005**.

Citizens frequently face rejection or bureaucratic non-responsiveness because informal grievances (*"the road in my colony has potholes", "scholarship disbursement delayed 10 months", "EPFO claim is pending"*) are rarely formulated as concrete requests for certified official records. NyayaRTI guides citizens through statutory fact-finding, identifies the competent Public Information Officer (PIO), embeds mandatory statutory clauses (Section 6(1), Section 6(3), Section 7(1)), and generates an instantly downloadable, compliant Form 'A' dossier or Section 19(1) First Appeal memorandum — while actively tracking every statutory clock and escalation path until the citizen actually receives a resolution.

---

## Problem Context & Institutional Need

- **The Challenge**: Over 1.5 crore RTI applications are filed in India annually, yet more than 40% face rejection, delay, or jurisdictional misdirection due to non-admissible phrasing (asking conversational "why" questions rather than demanding certified documents), missing statutory declarations, or failure to escalate via First Appeals after the 30-day statutory window.
- **The Solution**: An intelligent legal intake and case-management system that:
  1. Accepts citizen inputs in plain English, Hindi, or Hinglish.
  2. Synthesizes admissible inquiries under **Section 6(1)** (work orders, measurement books, daily progress logs, reasons on record).
  3. Formats an official **Form 'A' Legal Dossier** with live real-time split-screen synchronization.
  4. Generates single-click **PDF export** and direct formatted text for **`rtionline.gov.in`**.
  5. Provides statutory escalation tools: **Section 19(1) First Appeals** and **Section 2(j) On-Site Inspections**.
  6. Forecasts statutory deadlines and flags urgent, life-and-liberty-critical cases automatically.
  7. Tracks every application's status across its full legal lifecycle, from draft to resolution.

---

## Core Capabilities

### Drafting & Compliance
- **Conversational Intake**: Structured dialogue identifying missing jurisdictional details (ward number, registration ID, date of submission).
- **12 Standard Precedent Catalogs**: Pre-configured templates grounded in statutory law and Supreme Court rulings:
  - *Civic Works & Road Tenders (PWD / Municipal)*
  - *Answer Script Certified Copies (Supreme Court in CBSE vs Aditya Bandopadhyay)*
  - *Police Complaint Non-Registration & General Diary Status*
  - *Student Scholarship & Direct Benefit Transfer Pendency*
  - *EPFO Claim Settlement & Pension Delays (Citizens' Charter)*
  - *Govt Hospital Medicine Inventory & Doctor Attendance Audits*
  - *RTO Driving License & RC Dispatch Delays*
  - *Smart Meter Calibration & Power Outage Logs*
  - *Land Mutation & Revenue Record Delays*
  - *Public Distribution System (PDS) Grain Allocations*
  - *Section 19(1) First Appeals for 30-Day Non-Response (Free of Cost under Sec 7(6))*
  - *Section 2(j) Physical On-Site Inspection & Certified Sample Extraction*
- **Live Legal Dossier Synchronization**: A4 format preview updating in real time as particulars are entered.
- **Statutory Legal Compliance**:
  - **Section 6(1)**: Explicit request for certified public records.
  - **Section 6(3)**: Mandatory 5-day transfer clause for misdirected applications.
  - **Section 7(1)**: 30-day response timeline mandate (48 hours for life and liberty).
  - **Section 7(6)**: Demand for information free of cost upon 30-day default.
  - **Section 8/9**: Affirmative non-exemption declarations.
- **Dual Export Options**:
  - **Download PDF**: Formatted formal letter with official header, signature block, and fee details.
  - **Copy Portal Text**: Plain-text output optimized for Central and State online RTI portals.

### Deadline Forecasting
- Automatically computes every statutory clock the moment an application is drafted — the **30-day Section 7(1) response window**, the **5-day Section 6(3)** transfer deadline, and the **30-day Section 19(1)** First Appeal filing window.
- Surfaces a forward-looking timeline showing exactly when a citizen becomes eligible to escalate, so no statutory deadline is missed by accident.
- Proactively nudges the citizen as a deadline approaches, and auto-drafts the First Appeal the moment the PIO's response window lapses without a reply.

### Life & Liberty Tracker
- Detects grievance categories that statutorily qualify for the accelerated **48-hour response mandate** under the proviso to Section 7(1) (matters concerning the life or liberty of a person).
- Flags and visually prioritizes such applications above the standard 30-day queue, with a dedicated countdown instead of the default deadline forecast.
- Ensures these time-critical cases are never buried under routine civic-grievance filings.

### App Lifecycle Dashboard
- Gives citizens a single view of every application they've filed, from **Draft → Submitted → PIO Response Pending → First Appeal → Second Appeal → Resolved**.
- Surfaces at-a-glance status, days remaining/elapsed, and the next recommended statutory action for each case.
- Maintains a running history of all correspondence and generated documents per case, so citizens can revisit and reuse past filings without re-entering jurisdictional details.

---

## Technical Stack

- **Framework**: Next.js 14 (App Router), React 18, TypeScript
- **Styling & Components**: Tailwind CSS, Lucide React Icons
- **Document Generation**: jsPDF (client-side A4 legal formatting)
- **Extraction Layer**: Groq Cloud (Llama-3.3-70B) / Google Gemini 2.5 Flash with built-in statutory legal heuristic engine

---

## Quickstart

### 1. Install Dependencies
```bash
git clone <repository-url>
cd rti-drafting-agent
npm install
```

### 2. Configure Environment (Optional)
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Add an API key if available (`GROQ_API_KEY` or `GEMINI_API_KEY`). The application automatically operates in statutory heuristic mode if keys are not configured.

### 3. Run Development Server
```bash
npm run dev
```
Access the application at [http://localhost:3000](http://localhost:3000).

### 4. Production Build
```bash
npm run build
npm run start
```

---

## License
MIT License. Open-source civic technology for citizen empowerment.
