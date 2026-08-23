"use client";

import { FeeCalculator } from "@/components/FeeCalculator";
import { trackApplication } from "@/lib/rtiTrackerStore";
import React, { useState } from "react";
import { RtiApplicationData, RtiStage, AppealGround } from "@/types/rti";
import { generateRtiPlainText } from "@/lib/rti-template";
import {
  Download,
  Copy,
  Check,
  FileText,
  Edit3,
  Globe,
  Printer,
  Plus,
  Trash2,
  Building2,
  User,
  Scale,
  Search,
  AlertTriangle,
  FileSearch,
  Calendar,
  Layers
} from "lucide-react";

interface RtiPreviewPanelProps {
  rtiData: RtiApplicationData;
  onUpdateRti: (newData: Partial<RtiApplicationData>) => void;
}

export const RtiPreviewPanel: React.FC<RtiPreviewPanelProps> = ({
  rtiData,
  onUpdateRti,
}) => {
  const [activeTab, setActiveTab] = useState<"dossier" | "onlineText" | "editor">("dossier");
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [newQueryInput, setNewQueryInput] = useState("");

  const currentStage: RtiStage = rtiData.stage || "section6_application";

  const handleStageChange = (stage: RtiStage) => {
    onUpdateRti({ stage });
  };

  const handleCopyText = async () => {
    const text = generateRtiPlainText(rtiData);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const plainText = generateRtiPlainText(rtiData);

      doc.setFont("times", "normal");
      doc.setFontSize(11);

      const splitLines = doc.splitTextToSize(plainText, 170);
      let cursorY = 20;
      const pageHeight = doc.internal.pageSize.height;

      // Header watermark/seal title
      doc.setFont("times", "bold");
      doc.setFontSize(12.5);

      const headerTitle =
        currentStage === "first_appeal_19_1"
          ? "MEMORANDUM OF FIRST APPEAL — SECTION 19(1) RTI ACT 2005"
          : currentStage === "inspection_2_j"
          ? "NOTICE FOR PHYSICAL INSPECTION UNDER SECTION 2(j) RTI ACT 2005"
          : "APPLICATION UNDER SECTION 6(1) — RIGHT TO INFORMATION ACT 2005";

      doc.text(headerTitle, 105, 12, { align: "center" });
      doc.setLineWidth(0.3);
      doc.line(20, 15, 190, 15);

      doc.setFont("times", "normal");
      doc.setFontSize(10.5);

      for (let i = 0; i < splitLines.length; i++) {
        if (cursorY > pageHeight - 20) {
          doc.addPage();
          cursorY = 20;
        }
        doc.text(splitLines[i], 20, cursorY);
        cursorY += 5.5;
      }

      const stageSlug = currentStage.replace(/_/g, "-");
      doc.save(`RTI_${stageSlug}_${(rtiData.applicantName || "Draft").replace(/\s+/g, "_")}.pdf`);
      trackApplication(rtiData);
    } catch (err) {
      console.error("PDF generation error, fallback to print:", err);
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  const handleAddQuery = () => {
    if (!newQueryInput.trim()) return;
    onUpdateRti({
      queries: [...rtiData.queries, newQueryInput.trim()],
    });
    setNewQueryInput("");
  };

  const handleRemoveQuery = (index: number) => {
    const updated = rtiData.queries.filter((_, idx) => idx !== index);
    onUpdateRti({ queries: updated });
  };

  const handleQueryChange = (index: number, val: string) => {
    const updated = [...rtiData.queries];
    updated[index] = val;
    onUpdateRti({ queries: updated });
  };

  return (
    <div className="flex flex-col h-full bg-slate-100 overflow-hidden">
      {/* Top Action Bar & Stage Switcher */}
      <div className="bg-white border-b border-slate-200 p-2.5 space-y-2 shrink-0">
        {/* Stage Switcher Pills */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-0.5">
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => handleStageChange("section6_application")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition font-medium ${
                currentStage === "section6_application"
                  ? "bg-slate-900 text-amber-400 font-bold shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Sec 6(1) Application</span>
            </button>

            <button
              onClick={() => handleStageChange("first_appeal_19_1")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition font-medium ${
                currentStage === "first_appeal_19_1"
                  ? "bg-rose-900 text-rose-200 font-bold shadow-xs"
                  : "text-slate-600 hover:text-rose-900"
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Sec 19(1) First Appeal</span>
            </button>

            <button
              onClick={() => handleStageChange("inspection_2_j")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition font-medium ${
                currentStage === "inspection_2_j"
                  ? "bg-cyan-900 text-cyan-200 font-bold shadow-xs"
                  : "text-slate-600 hover:text-cyan-900"
              }`}
            >
              <FileSearch className="w-3.5 h-3.5" />
              <span>Sec 2(j) Inspection</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopyText}
              className="flex items-center gap-1.5 text-xs bg-white hover:bg-slate-50 text-slate-700 px-2.5 py-1.5 rounded-lg border border-slate-300 font-medium transition shadow-2xs"
              title="Copy RTI text to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy Text</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="flex items-center gap-1.5 text-xs bg-slate-900 hover:bg-slate-800 text-amber-400 px-3 py-1.5 rounded-lg font-semibold transition shadow-md cursor-pointer"
              title="Download formatted PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isDownloading ? "Generating..." : "Download PDF"}</span>
            </button>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex items-center justify-between text-xs border-t border-slate-100 pt-2">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab("dossier")}
              className={`px-3 py-1 rounded-md transition font-medium ${
                activeTab === "dossier"
                  ? "bg-slate-200 text-slate-900 font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Official Dossier View
            </button>
            <button
              onClick={() => setActiveTab("onlineText")}
              className={`px-3 py-1 rounded-md transition font-medium ${
                activeTab === "onlineText"
                  ? "bg-slate-200 text-slate-900 font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Online Portal (rtionline)
            </button>
            <button
              onClick={() => setActiveTab("editor")}
              className={`px-3 py-1 rounded-md transition font-medium ${
                activeTab === "editor"
                  ? "bg-slate-200 text-slate-900 font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Edit Fields
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="hidden sm:flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800"
          >
            <Printer className="w-3 h-3" />
            <span>Print Sheet</span>
          </button>
        </div>
      </div>

      {/* Main Document View Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex justify-center">
        {/* TAB 1: OFFICIAL DOSSIER */}
        {activeTab === "dossier" && (
          <div
            id="printable-rti-dossier"
            className="bg-white max-w-3xl w-full p-8 sm:p-12 shadow-dossier rounded-xl border border-slate-200/80 font-serif text-slate-900 leading-relaxed text-sm relative"
          >
            {/* STAGE 1: SECTION 6(1) RTI APPLICATION */}
            {currentStage === "section6_application" && (
              <>
                {/* Watermark / Seal Banner */}
                <div className="text-center pb-5 border-b-2 border-slate-800 mb-6">
                  <div className="text-xs uppercase tracking-widest font-mono text-amber-800 font-bold mb-1">
                    FORM &apos;A&apos; — RIGHT TO INFORMATION ACT, 2005
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold font-serif tracking-tight text-slate-950">
                    APPLICATION UNDER SECTION 6(1)
                  </h2>
                  <div className="text-xs text-slate-500 mt-1 font-sans">
                    Prescribed Format for Seeking Official Records from Public Authorities
                  </div>
                </div>

                {/* Date & Location */}
                <div className="flex justify-between items-center text-xs font-sans text-slate-600 mb-3 pb-2 border-b border-slate-100">
                  <span>Jurisdiction: <strong>{rtiData.stateOrCentral} ({rtiData.stateName || 'Central'})</strong></span>
                  <span>Date: <strong>{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</strong></span>
                </div>

                {/* Statutory Response Deadline Forecast */}
                <div className={`flex items-center justify-between text-xs font-sans mb-6 px-3 py-2 rounded-lg border ${
                  rtiData.isLifeOrLiberty
                    ? "bg-rose-50 border-rose-200 text-rose-700"
                    : "bg-emerald-50 border-emerald-200 text-emerald-700"
                }`}>
                  <span className="font-medium">
                    {rtiData.isLifeOrLiberty
                      ? "Life/liberty matter — Section 7(1) 48-hour response clock"
                      : "Statutory response window — Section 7(1), 30 days"}
                  </span>
                  <span>
                    If filed today, due by{" "}
                    <strong>
                      {(() => {
                        const d = new Date();
                        if (rtiData.isLifeOrLiberty) {
                          d.setHours(d.getHours() + 48);
                          return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                        }
                        d.setDate(d.getDate() + 30);
                        return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
                      })()}
                    </strong>
                  </span>
                </div>

                {/* To Addressee */}
                <div className="mb-6 space-y-1 bg-slate-50 p-4 rounded-lg border border-slate-200/70 font-sans text-xs">
                  <div className="font-bold text-slate-900 uppercase tracking-wide text-[11px] text-amber-800">
                    To: The Public Authority
                  </div>
                  <div className="font-semibold text-slate-900 text-sm">{rtiData.pioDesignation}</div>
                  <div className="text-slate-700">{rtiData.department}</div>
                  <div className="text-slate-800 font-medium">{rtiData.publicAuthority}</div>
                  <div className="text-slate-600">{rtiData.pioAddress}</div>
                </div>

                {/* Subject */}
                <div className="mb-6">
                  <span className="font-bold uppercase tracking-wide text-xs text-slate-900 font-sans block mb-1">
                    SUBJECT:
                  </span>
                  <p className="bg-amber-50/50 p-3 rounded border border-amber-200/60 text-slate-900 text-xs sm:text-sm font-semibold">
                    {rtiData.subject}
                  </p>
                </div>

                <p className="mb-4 text-xs font-sans text-slate-700">
                  Sir / Madam,
                </p>
                <p className="mb-4 text-xs font-sans text-slate-700">
                  I am a citizen of India. I hereby request you to kindly furnish the following specific public information and certified records under Section 6(1) of the Right to Information Act, 2005:
                </p>

                {/* Inquiries */}
                <div className="mb-6">
                  <div className="text-xs font-bold font-sans uppercase tracking-wider text-slate-900 bg-slate-100 px-3 py-1.5 rounded border border-slate-200 mb-3 flex items-center justify-between">
                    <span>1. Specific Particulars of Information Sought</span>
                    <span className="text-[10px] text-slate-500 font-normal font-mono">
                      {rtiData.timePeriod}
                    </span>
                  </div>

                  <div className="space-y-3 pl-2">
                    {rtiData.queries.map((query, idx) => (
                      <div key={idx} className="flex gap-3 text-xs sm:text-sm items-start">
                        <span className="font-bold font-mono text-amber-700 bg-amber-50 w-6 h-6 rounded flex items-center justify-center shrink-0 border border-amber-200">
                          {idx + 1}
                        </span>
                        <p className="flex-1 text-slate-800 leading-normal">{query}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Statutory Clauses */}
                <div className="mb-6">
                  <div className="text-xs font-bold font-sans uppercase tracking-wider text-slate-900 bg-slate-100 px-3 py-1.5 rounded border border-slate-200 mb-3">
                    2. Mandatory Statutory Clauses & Declarations
                  </div>
                  <ul className="text-xs space-y-2 text-slate-700 font-sans list-disc pl-5">
                    <li>
                      <strong>Citizenship:</strong> The applicant is a bona fide Citizen of India.
                    </li>
                    <li>
                      <strong>Non-Exempt Category:</strong> The requested information does not fall within the exemptions specified under Section 8 or Section 9 of the RTI Act, 2005.
                    </li>
                    <li>
                      <strong>Section 6(3) Transfer Mandate:</strong> In case any portion of this information pertains to another Public Authority, kindly transfer this application or relevant parts thereof within 5 days under Section 6(3) of the Act and notify the applicant.
                    </li>
                    <li>
                      <strong>Section 7(1) Response Clock:</strong> The information is requested within the statutory 30-day period (or 48 hours if concerning life or liberty).
                    </li>
                  </ul>
                </div>

                {/* Fee Details */}
                <div className="mb-6">
                  <div className="text-xs font-bold font-sans uppercase tracking-wider text-slate-900 bg-slate-100 px-3 py-1.5 rounded border border-slate-200 mb-2">
                    3. Application Fee Details
                  </div>
                  <div className="text-xs font-sans text-slate-800 bg-slate-50 p-3 rounded border border-slate-200">
                    Mode of Payment: <strong>{rtiData.applicationFeeMode}</strong>
                    <div className="text-slate-600 mt-1">{rtiData.isBpl ? `BPL Card Holder (Exempt from application fee, Ref: ${rtiData.bplCardNo || 'Enclosed'})` : rtiData.feeDetails}</div>
                  </div>
                </div>
              </>
            )}

            {/* STAGE 2: SECTION 19(1) FIRST APPEAL MEMORANDUM */}
            {currentStage === "first_appeal_19_1" && (
              <>
                <div className="text-center pb-5 border-b-2 border-rose-900 mb-6">
                  <div className="text-xs uppercase tracking-widest font-mono text-rose-800 font-bold mb-1">
                    FORM &apos;B&apos; — STATUTORY FIRST APPEAL
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold font-serif tracking-tight text-rose-950">
                    MEMORANDUM OF FIRST APPEAL UNDER SECTION 19(1)
                  </h2>
                  <div className="text-xs text-slate-500 mt-1 font-sans">
                    Before the First Appellate Authority (FAA) for Deemed Refusal / Default by PIO
                  </div>
                </div>

                {/* Appeal Decision Deadline Forecast */}
                <div className="flex items-center justify-between text-xs font-sans mb-4 px-3 py-2 rounded-lg border bg-amber-50 border-amber-200 text-amber-800">
                  <span className="font-medium">Section 19(6) decision window — 30 days (extendable to 45)</span>
                  <span>
                    If filed today, decision due by{" "}
                    <strong>
                      {(() => {
                        const d = new Date();
                        d.setDate(d.getDate() + 30);
                        return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
                      })()}
                    </strong>
                  </span>
                </div>

                {/* Court / Forum Header */}
                <div className="mb-6 bg-rose-50/60 p-4 rounded-lg border border-rose-200 font-sans text-xs space-y-1">
                  <div className="font-bold uppercase tracking-wider text-rose-900 text-[11px]">
                    BEFORE THE FIRST APPELLATE AUTHORITY (FAA):
                  </div>
                  <div className="font-semibold text-slate-900 text-sm">
                    {rtiData.firstAppeal?.firstAppellateAuthority || "The First Appellate Authority (FAA) / Additional Commissioner"}
                  </div>
                  <div className="text-slate-800">{rtiData.publicAuthority}</div>
                  <div className="text-slate-600">{rtiData.pioAddress}</div>
                </div>

                {/* Cause Title */}
                <div className="mb-6 border-y border-slate-200 py-3 font-serif text-xs sm:text-sm space-y-1">
                  <div className="flex justify-between">
                    <strong>{rtiData.applicantName}</strong>
                    <span className="font-sans text-xs text-slate-500">... APPELLANT</span>
                  </div>
                  <div className="text-center text-slate-400 font-sans text-xs italic">VERSUS</div>
                  <div className="flex justify-between">
                    <strong>{rtiData.pioDesignation}, {rtiData.publicAuthority}</strong>
                    <span className="font-sans text-xs text-slate-500">... RESPONDENT (PIO)</span>
                  </div>
                </div>

                {/* Subject */}
                <div className="mb-6">
                  <span className="font-bold uppercase tracking-wide text-xs text-slate-900 font-sans block mb-1">
                    SUBJECT OF APPEAL:
                  </span>
                  <p className="bg-rose-50/40 p-3 rounded border border-rose-200 text-slate-900 text-xs sm:text-sm font-semibold">
                    First Appeal under Section 19(1) against deemed refusal and failure of the PIO to furnish certified records within 30 days under Section 7(1).
                  </p>
                </div>

                {/* Original RTI Details */}
                <div className="mb-6 font-sans text-xs bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                    1. Particulars of Original Section 6(1) Application
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                    <div>Original Ref / Reg No: <strong>{rtiData.firstAppeal?.originalRtiRegNo || "RTI/2024/09812"}</strong></div>
                    <div>Original Date of Filing: <strong>{rtiData.firstAppeal?.originalRtiDate || "30+ days prior"}</strong></div>
                    <div className="sm:col-span-2">Original Subject: <em>{rtiData.subject}</em></div>
                  </div>
                </div>

                {/* Grounds of Appeal */}
                <div className="mb-6 font-sans text-xs space-y-3">
                  <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px] bg-slate-100 px-3 py-1.5 rounded border border-slate-200">
                    2. Grounds for Appeal
                  </div>
                  <div className="p-3.5 bg-white border border-rose-200 rounded-lg text-slate-800 leading-relaxed">
                    <p className="font-semibold text-rose-900 mb-2">
                      Primary Ground: Failure to respond within statutory 30-day timeline (Deemed Refusal under Sec 7(2))
                    </p>
                    <p>{rtiData.firstAppeal?.groundDescription || "The appellant submitted a valid Section 6(1) application. More than 30 days have elapsed without any reply from the PIO, violating Section 7(1) of the Act."}</p>
                  </div>
                </div>

                {/* Prayer / Relief */}
                <div className="mb-6 font-sans text-xs space-y-2">
                  <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px] bg-slate-100 px-3 py-1.5 rounded border border-slate-200">
                    3. Relief / Prayer Sought
                  </div>
                  <ul className="list-decimal pl-5 space-y-2 text-slate-800">
                    <li>
                      <strong>Immediate Supply of Records:</strong> Direct the Respondent PIO to immediately furnish all certified records requested in the original Section 6(1) application.
                    </li>
                    <li>
                      <strong>Supply Information Free of Cost (Section 7(6)):</strong> As the PIO failed to provide information within 30 days, mandate that all certified photocopies, CD/DVD, and reports be provided <strong>FREE OF COST</strong> under Section 7(6) of the RTI Act, 2005.
                    </li>
                    <li>
                      <strong>Disciplinary Action Recommendation:</strong> Recommend proceedings against the erring PIO under Section 20(1) and 20(2) for willful non-compliance.
                    </li>
                  </ul>
                </div>
              </>
            )}

            {/* STAGE 3: SECTION 2(j) PHYSICAL INSPECTION NOTICE */}
            {currentStage === "inspection_2_j" && (
              <>
                <div className="text-center pb-5 border-b-2 border-cyan-900 mb-6">
                  <div className="text-xs uppercase tracking-widest font-mono text-cyan-800 font-bold mb-1">
                    NOTICE UNDER SECTION 2(j)(i) & 2(j)(iii) OF RTI ACT, 2005
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold font-serif tracking-tight text-cyan-950">
                    APPLICATION FOR PHYSICAL ON-SITE INSPECTION & SAMPLES
                  </h2>
                  <div className="text-xs text-slate-500 mt-1 font-sans">
                    Statutory Right to Inspect Public Works, Measurement Books & Collect Certified Material Samples
                  </div>
                </div>

                {/* To Addressee */}
                <div className="mb-6 space-y-1 bg-cyan-50/40 p-4 rounded-lg border border-cyan-200 font-sans text-xs">
                  <div className="font-bold text-slate-900 uppercase tracking-wide text-[11px] text-cyan-900">
                    To: The Public Authority
                  </div>
                  <div className="font-semibold text-slate-900 text-sm">{rtiData.pioDesignation}</div>
                  <div className="text-slate-700">{rtiData.department}</div>
                  <div className="text-slate-800 font-medium">{rtiData.publicAuthority}</div>
                  <div className="text-slate-600">{rtiData.pioAddress}</div>
                </div>

                {/* Inspection Particulars */}
                <div className="mb-6 font-sans text-xs space-y-3">
                  <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px] bg-slate-100 px-3 py-1.5 rounded border border-slate-200">
                    1. Inspection Particulars & Proposed Schedule
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2 text-slate-800">
                    <div>
                      <strong>Works / Files to Inspect:</strong>
                      <p className="mt-1 text-slate-700">{rtiData.inspection?.specificWorksOrFiles || "Original measurement books, tender registers, and completed civil site work."}</p>
                    </div>
                    <div>
                      <strong>Proposed Dates:</strong>
                      <p className="mt-1 text-slate-700">{rtiData.inspection?.proposedDates || "Within 15 days of receipt of this notice on any official working day."}</p>
                    </div>
                    <div>
                      <strong>Certified Sample Extraction (Section 2(j)(iii)):</strong>
                      <p className="mt-1 text-slate-700">{rtiData.inspection?.sampleDescription || "The applicant intends to take certified physical samples of road bitumen, concrete mix, and steel reinforcement for laboratory audit."}</p>
                    </div>
                  </div>
                </div>

                {/* Statutory Inspection Rights */}
                <div className="mb-6 font-sans text-xs space-y-2">
                  <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px] bg-slate-100 px-3 py-1.5 rounded border border-slate-200">
                    2. Statutory Mandate under Section 2(j)
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    As stipulated under Section 2(j)(i) and Section 2(j)(iii) of the RTI Act, 2005, the citizen is entitled to inspect physical works, take notes, and extract certified samples. Please communicate the designated date and coordinating officer within 7 days.
                  </p>
                </div>
              </>
            )}

            {/* Applicant Signature & Verification Block */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between gap-6 font-sans text-xs">
              <div>
                <span className="font-bold text-slate-900 block mb-1 uppercase tracking-wider text-[11px] text-amber-800">
                  {currentStage === "first_appeal_19_1" ? "Appellant Particulars:" : "Applicant Particulars:"}
                </span>
                <div className="text-slate-800 font-semibold">{rtiData.applicantName}</div>
                <div className="text-slate-600">{rtiData.applicantAddress}</div>
                <div className="text-slate-600">Ph: {rtiData.applicantPhone}</div>
                <div className="text-slate-600">{rtiData.applicantEmail}</div>
              </div>

              <div className="sm:text-right space-y-4">
                <div className="text-slate-500 italic">Respectfully Submitted,</div>
                <div className="pt-6 border-t border-slate-400 inline-block min-w-[160px] text-center">
                  <div className="font-semibold text-slate-900">{rtiData.applicantName}</div>
                  <div className="text-[10px] text-slate-500">
                    {currentStage === "first_appeal_19_1" ? "(Appellant Signature)" : "(Applicant Signature)"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ONLINE PORTAL TEXT */}
        {activeTab === "onlineText" && (
          <div className="bg-white max-w-3xl w-full p-6 shadow-md rounded-xl border border-slate-200 flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Format for RTI Online Portal (rtionline.gov.in)
                </h3>
                <p className="text-xs text-slate-500">
                  Ready to copy and paste directly into the Central / State RTI web portal.
                </p>
              </div>
              <button
                onClick={handleCopyText}
                className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy to Clipboard"}</span>
              </button>
            </div>

            <textarea
              readOnly
              value={generateRtiPlainText(rtiData)}
              className="flex-1 w-full bg-slate-50 border border-slate-300 rounded-lg p-4 font-mono text-xs text-slate-800 leading-relaxed outline-hidden resize-none min-h-[450px]"
            />
          </div>
        )}

        {/* TAB 3: EDIT FIELDS */}
        {activeTab === "editor" && (
          <div className="bg-white max-w-3xl w-full p-6 shadow-md rounded-xl border border-slate-200 space-y-6">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-emerald-600" />
                  <span>Customize RTI Application Fields</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Fine-tune any legal detail, question, or authority address before exporting.
                </p>
              </div>
            </div>

            {/* Target Authority */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-amber-600" />
                <span>Target Public Authority / PIO</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-600 mb-1">Public Authority / Body</label>
                  <input
                    type="text"
                    value={rtiData.publicAuthority}
                    onChange={(e) => onUpdateRti({ publicAuthority: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-md p-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Department / Division</label>
                  <input
                    type="text"
                    value={rtiData.department}
                    onChange={(e) => onUpdateRti({ department: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-md p-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">PIO Designation</label>
                  <input
                    type="text"
                    value={rtiData.pioDesignation}
                    onChange={(e) => onUpdateRti({ pioDesignation: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-md p-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">PIO Office Address</label>
                  <input
                    type="text"
                    value={rtiData.pioAddress}
                    onChange={(e) => onUpdateRti({ pioAddress: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-md p-2 text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Subject & Time Period */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subject Line
                </label>
                <input
                  type="text"
                  value={rtiData.subject}
                  onChange={(e) => onUpdateRti({ subject: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-md p-2 text-xs text-slate-900 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Time Period Relevant to Inquiries
                </label>
                <input
                  type="text"
                  value={rtiData.timePeriod}
                  onChange={(e) => onUpdateRti({ timePeriod: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-md p-2 text-xs text-slate-900"
                />
              </div>
            </div>

            {/* Specific Questions List (for Section 6(1)) */}
            {currentStage === "section6_application" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Specific RTI Questions ({rtiData.queries.length})
                  </label>
                </div>

                <div className="space-y-2">
                  {rtiData.queries.map((q, idx) => (
                    <div key={idx} className="flex gap-2 items-start">
                      <span className="text-xs font-mono font-bold bg-slate-100 p-2 rounded border border-slate-200 text-slate-600">
                        {idx + 1}
                      </span>
                      <textarea
                        rows={2}
                        value={q}
                        onChange={(e) => handleQueryChange(idx, e.target.value)}
                        className="flex-1 text-xs bg-white border border-slate-300 rounded-md p-2 text-slate-900 resize-none"
                      />
                      <button
                        onClick={() => handleRemoveQuery(idx)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition"
                        title="Remove question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add query input */}
                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Type an additional question to include in the RTI..."
                    value={newQueryInput}
                    onChange={(e) => setNewQueryInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddQuery()}
                    className="flex-1 text-xs bg-white border border-slate-300 rounded-md p-2"
                  />
                  <button
                    onClick={handleAddQuery}
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3 py-2 rounded-md flex items-center gap-1 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            )}

            {/* First Appeal Details (for Section 19(1)) */}
            {currentStage === "first_appeal_19_1" && (
              <div className="space-y-3 bg-rose-50/50 p-4 rounded-lg border border-rose-200">
                <div className="text-xs font-bold text-rose-900 uppercase tracking-wide flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-rose-700" />
                  <span>First Appeal Metadata (Section 19(1))</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 mb-1">Original RTI Registration / Reg No</label>
                    <input
                      type="text"
                      value={rtiData.firstAppeal?.originalRtiRegNo || ""}
                      onChange={(e) =>
                        onUpdateRti({
                          firstAppeal: {
                            ...rtiData.firstAppeal!,
                            originalRtiRegNo: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-white border border-slate-300 rounded-md p-2 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">Original Date of Submission</label>
                    <input
                      type="text"
                      value={rtiData.firstAppeal?.originalRtiDate || ""}
                      onChange={(e) =>
                        onUpdateRti({
                          firstAppeal: {
                            ...rtiData.firstAppeal!,
                            originalRtiDate: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-white border border-slate-300 rounded-md p-2 text-slate-900"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-slate-600 mb-1">Grounds of Appeal</label>
                    <textarea
                      rows={3}
                      value={rtiData.firstAppeal?.groundDescription || ""}
                      onChange={(e) =>
                        onUpdateRti({
                          firstAppeal: {
                            ...rtiData.firstAppeal!,
                            groundDescription: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-white border border-slate-300 rounded-md p-2 text-slate-900 resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Applicant Information */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>Applicant Particulars</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={rtiData.applicantName}
                    onChange={(e) => onUpdateRti({ applicantName: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-md p-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={rtiData.applicantPhone}
                    onChange={(e) => onUpdateRti({ applicantPhone: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-md p-2 text-slate-900"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-slate-600 mb-1">Postal Address</label>
                  <input
                    type="text"
                    value={rtiData.applicantAddress}
                    onChange={(e) => onUpdateRti({ applicantAddress: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-md p-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Email Address</label>
                  <input
                    type="text"
                    value={rtiData.applicantEmail}
                    onChange={(e) => onUpdateRti({ applicantEmail: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-md p-2 text-slate-900"
                  />
                </div>
                <div className="flex items-center gap-2 pt-4">
                  <input
                    type="checkbox"
                    id="bplCheck"
                    checked={rtiData.isBpl}
                    onChange={(e) => onUpdateRti({ isBpl: e.target.checked })}
                    className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                  />
                  <label htmlFor="bplCheck" className="text-xs font-semibold text-slate-700">
                    Applicant belongs to Below Poverty Line (BPL) - Fee Exempt
                  </label>
                </div>
                <div className="flex items-center gap-2 pt-4">
                  <input
                    type="checkbox"
                    id="lifeOrLibertyCheck"
                    checked={rtiData.isLifeOrLiberty}
                    onChange={(e) => onUpdateRti({ isLifeOrLiberty: e.target.checked })}
                    className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
                  />
                  <label htmlFor="lifeOrLibertyCheck" className="text-xs font-semibold text-slate-700">
                    Concerns life or liberty — 48-hour response clock (Sec 7(1) proviso)
                  </label>
                </div>
              </div>
            </div>

            <FeeCalculator rtiData={rtiData} onUpdateRti={onUpdateRti} />
          </div>
        )}
      </div>
    </div>
  );
};