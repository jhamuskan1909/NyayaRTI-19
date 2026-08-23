"use client";

import React from "react";
import { Scale, BookOpen, RotateCcw, ShieldCheck, LayoutGrid, CheckCircle2, ClipboardList } from "lucide-react";
import Link from "next/link";
import { RtiStage } from "@/types/rti";

interface HeaderProps {
  stage: RtiStage;
  modelUsed?: string;
  onOpenLibrary: () => void;
  onOpenGuide: () => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  stage,
  onOpenLibrary,
  onOpenGuide,
  onReset,
}) => {
  const getStageBadge = (st: RtiStage) => {
    switch (st) {
      case "first_appeal_19_1":
        return {
          label: "Section 19(1) First Appeal",
          color: "bg-rose-900/60 text-rose-200 border-rose-700/60",
        };
      case "inspection_2_j":
        return {
          label: "Section 2(j) Inspection Notice",
          color: "bg-cyan-900/60 text-cyan-200 border-cyan-700/60",
        };
      default:
        return {
          label: "Section 6(1) Application",
          color: "bg-emerald-900/60 text-emerald-200 border-emerald-700/60",
        };
    }
  };

  const stageBadge = getStageBadge(stage);

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Emblem */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-600 flex items-center justify-center shadow-inner border border-amber-400/40">
            <Scale className="w-5 h-5 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-lg tracking-wide text-amber-400">
                NyayaRTI
              </span>
              <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-mono ${stageBadge.color}`}>
                {stageBadge.label}
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Citizen Legal Aid & RTI Drafting Portal
            </p>
          </div>
        </div>

        {/* Center / Hackathon Badge */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-xs text-slate-300 font-medium">
            RTI Act 2005 Compliance Standards
          </span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenLibrary}
            className="flex items-center gap-1.5 text-xs sm:text-sm bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-1.5 rounded-lg font-semibold transition shadow-sm cursor-pointer"
            title="Browse all 12 pre-configured legal templates"
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Templates (12)</span>
          </button>

          
            <Link
  href="/dashboard"
  className="flex items-center gap-1.5 text-xs sm:text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition font-medium"
  title="View tracked RTI applications"
>
  <ClipboardList className="w-4 h-4 text-amber-400" />
  <span className="hidden sm:inline">My Applications</span>
</Link>
            <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 text-xs sm:text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition font-medium cursor-pointer"
            title="How to submit RTI online or offline"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Filing Guide</span>
          </button>

          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 px-2.5 py-1.5 rounded-lg border border-transparent transition cursor-pointer"
            title="Clear and start new RTI draft"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
};
