# NyayaRTI: Citizen Rights & RTI Drafting Platform

> **Submission for OOSC 4.0 Hackathon (Unstop) | Problem Statement 3 (Citizen Rights & Legal Technology)**

NyayaRTI is an end-to-end civic-tech platform that translates everyday citizen grievances into legally structured, statutory inquiries under India's **Right to Information (RTI) Act, 2005**.

Citizens frequently face rejection or bureaucratic non-responsiveness because informal grievances (*"the road in my colony has potholes", "scholarship disbursement delayed 10 months", "EPFO claim is pending"*) are rarely formulated as concrete requests for certified official records. NyayaRTI guides citizens through statutory fact-finding, identifies the competent Public Information Officer (PIO), embeds mandatory statutory clauses (Section 6(1), Section 6(3), Section 7(1)), and generates an instantly downloadable, compliant Form 'A' dossier or Section 19(1) First Appeal memorandum.

---

## Problem Context & Institutional Need

- **The Challenge**: Over 1.5 crore RTI applications are filed in India annually, yet more than 40% face rejection, delay, or jurisdictional misdirection due to non-admissible phrasing (asking conversational "why" questions rather than demanding certified documents), missing statutory declarations, or failure to escalate via First Appeals after the 30-day statutory window.
- **The Solution**: An intelligent legal intake system that:
  1. Accepts citizen inputs in plain English, Hindi, or Hinglish.
  2. Synthesizes admissible inquiries under **Section 6(1)** (work orders, measurement books, daily progress logs, reasons on record).
  3. Formats an official **Form 'A' Legal Dossier** with live real-time split-screen synchronization.
  4. Generates single-click **PDF export** and direct formatted text for **`rtionline.gov.in`**.
  5. Provides statutory escalation tools: **Section 19(1) First Appeals** and **Section 2(j) On-Site Inspections**.

---

## Core Capabilities

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
