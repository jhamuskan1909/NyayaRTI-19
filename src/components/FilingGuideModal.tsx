"use client";

import React, { useState } from "react";
import { X, Globe, Mail, Clock, HelpCircle, ExternalLink, CheckCircle2 } from "lucide-react";

interface FilingGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FilingGuideModal: React.FC<FilingGuideModalProps> = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState<'online' | 'offline' | 'timeline'>('online');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-slate-100">
                Citizen RTI Filing Guide
              </h3>
              <p className="text-xs text-slate-400">
                Step-by-step instructions to file your generated RTI in India
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs sm:text-sm font-medium">
          <button
            onClick={() => setTab('online')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition ${
              tab === 'online'
                ? 'border-amber-600 text-amber-900 bg-white font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Online Portal (rtionline)</span>
          </button>

          <button
            onClick={() => setTab('offline')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition ${
              tab === 'offline'
                ? 'border-amber-600 text-amber-900 bg-white font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Speed Post / Offline</span>
          </button>

          <button
            onClick={() => setTab('timeline')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition ${
              tab === 'timeline'
                ? 'border-amber-600 text-amber-900 bg-white font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Timelines & Appeals</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-700">
          {tab === 'online' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3.5 text-xs text-amber-900 flex items-start gap-2">
                <span className="font-bold">Portal:</span>
                <div>
                  Use{" "}
                  <a
                    href="https://rtionline.gov.in"
                    target="_blank"
                    rel="noreferrer"
                    className="underline font-semibold inline-flex items-center gap-1 text-amber-800 hover:text-amber-950"
                  >
                    rtionline.gov.in <ExternalLink className="w-3 h-3" />
                  </a>{" "}
                  for Central Govt Ministries, or respective State RTI portals (e.g., rtionline.delhi.gov.in, rtionline.maharashtra.gov.in).
                </div>
              </div>

              <ol className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
                  <div>
                    <strong className="text-slate-900 font-semibold">Click &apos;Submit Request&apos;</strong> on the portal and accept the declaration guidelines.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
                  <div>
                    <strong className="text-slate-900 font-semibold">Select Ministry / Department:</strong> Choose the Public Authority identified in the right panel.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
                  <div>
                    <strong className="text-slate-900 font-semibold">Paste Extracted Inquiries:</strong> Click the &quot;Copy for RTI Online&quot; button in NyayaRTI and paste directly into the &quot;Text for RTI Request application&quot; box.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">4</span>
                  <div>
                    <strong className="text-slate-900 font-semibold">Pay ₹10 Fee:</strong> Pay via UPI, Net Banking, or Debit Card (fee is waived if you hold a BPL card). Save the Registration Number!
                  </div>
                </li>
              </ol>
            </div>
          )}

          {tab === 'offline' && (
            <div className="space-y-4">
              <div className="bg-slate-100 border border-slate-200 rounded-lg p-3.5 text-xs text-slate-800">
                <strong>Offline Application Procedure:</strong> Ideal for local ward offices, police stations, gram panchayats, and municipal zones without an online portal.
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-1 shrink-0" />
                  <div>
                    <strong>Print the Generated PDF:</strong> Download and print the formal application generated in the right panel.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-1 shrink-0" />
                  <div>
                    <strong>Attach ₹10 Indian Postal Order (IPO):</strong> Purchase a ₹10 Postal Order from any Post Office payable to &quot;Accounts Officer, [Department Name]&quot;, or affix a ₹10 Court Fee Stamp.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-1 shrink-0" />
                  <div>
                    <strong>Send via Registered / Speed Post:</strong> Dispatch to the Public Information Officer (PIO) address on the letterhead. Retain the postal tracking receipt for proof of delivery!
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'timeline' && (
            <div className="space-y-3">
              <div className="border border-slate-200 rounded-lg p-3 bg-white">
                <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider text-amber-800">
                  Statutory 30-Day Clock (Section 7(1))
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  The Public Information Officer is legally mandated to provide the information or reject with reasons within <strong>30 days</strong> (or <strong>48 hours</strong> if the inquiry concerns life or liberty).
                </p>
              </div>

              <div className="border border-slate-200 rounded-lg p-3 bg-white">
                <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider text-amber-800">
                  Section 6(3) Transfer
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  If the application is sent to the wrong department, the receiving PIO must transfer it to the correct authority within <strong>5 days</strong> and notify you.
                </p>
              </div>

              <div className="border border-slate-200 rounded-lg p-3 bg-white">
                <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider text-amber-800">
                  First Appeal (Section 19(1))
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  If you receive no reply within 30 days or the reply is incomplete/misleading, you can file a <strong>First Appeal</strong> before the First Appellate Authority (FAA) of the same department within 30 days.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
          >
            Got it, Back to Drafter
          </button>
        </div>
      </div>
    </div>
  );
};
