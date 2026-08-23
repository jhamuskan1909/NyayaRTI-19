"use client";

import { useEffect, useMemo, useState } from "react";
import { TrackedApplication, TrackedStatus } from "@/types/tracker";
import {
  refreshOverdueStatuses,
  markFiled,
  markResponded,
  markAppealed,
  deleteTrackedApplication,
  daysUntil,
} from "@/lib/rtiTrackerStore";
import { Clock, AlertTriangle, CheckCircle2, FileText, Scale, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";

const STATUS_META: Record<TrackedStatus, { label: string; color: string }> = {
  drafted: { label: "Drafted", color: "bg-slate-100 text-slate-700 border-slate-200" },
  filed: { label: "Filed", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  overdue: { label: "Overdue — Appeal Eligible", color: "bg-rose-50 text-rose-700 border-rose-200" },
  responded: { label: "Responded", color: "bg-cyan-50 text-cyan-700 border-cyan-200" },
  appealed: { label: "First Appeal Filed", color: "bg-slate-900 text-amber-400 border-slate-800" },
  closed: { label: "Closed", color: "bg-slate-100 text-slate-500 border-slate-200" },
};

const STAGE_LABEL: Record<string, string> = {
  section6_application: "Sec 6(1) Application",
  first_appeal_19_1: "Sec 19(1) First Appeal",
  inspection_2_j: "Sec 2(j) Inspection",
};

export default function RTIDashboard() {
  const [apps, setApps] = useState<TrackedApplication[]>([]);
  const [filter, setFilter] = useState<TrackedStatus | "all">("all");

  useEffect(() => {
    setApps(refreshOverdueStatuses());
  }, []);

  const filtered = useMemo(
    () => (filter === "all" ? apps : apps.filter((a) => a.status === filter)),
    [apps, filter]
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: apps.length };
    apps.forEach((a) => (c[a.status] = (c[a.status] || 0) + 1));
    return c;
  }, [apps]);

  function refresh() {
    setApps(refreshOverdueStatuses());
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-300 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Drafter
          </Link>
          <div className="h-5 w-px bg-slate-700" />
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-amber-400" />
            <span className="font-serif font-bold text-amber-400">My RTI Applications</span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <div className="flex flex-wrap gap-1.5 mb-6">
          {(["all", "drafted", "filed", "overdue", "responded", "appealed", "closed"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                filter === s
                  ? "bg-slate-900 text-amber-400 border-slate-900"
                  : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
              }`}
            >
              {s === "all" ? "All" : STATUS_META[s].label} ({counts[s] || 0})
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400 bg-white rounded-xl border border-slate-200">
            <FileText className="mx-auto mb-3 opacity-40" size={40} />
            <p className="text-sm">
              {apps.length === 0
                ? "No applications tracked yet. Draft one on the main page, then download the PDF to save it here."
                : "Nothing in this category yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((app) => {
              const meta = STATUS_META[app.status];
              const daysLeft = daysUntil(app.responseDeadline);
              const appealDaysLeft = daysUntil(app.appealDeadline);

              return (
                <div key={app.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-serif font-semibold text-slate-900 truncate">{app.title}</h3>
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium border ${meta.color}`}>
                          {meta.label}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-500 font-mono">
                          {STAGE_LABEL[app.stage] || app.stage}
                        </span>
                        {app.isLifeOrLiberty && (
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 font-medium border border-rose-200">
                            48hr clause
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{app.publicAuthority}</p>

                      {app.status === "filed" && daysLeft !== null && (
                        <p className={`text-xs mt-2 flex items-center gap-1 ${daysLeft <= 5 ? "text-rose-600" : "text-emerald-700"}`}>
                          <Clock size={13} />
                          {daysLeft >= 0 ? `${daysLeft} days left to respond` : "Response window closed"}
                        </p>
                      )}
                      {app.status === "overdue" && (
                        <p className="text-xs mt-2 flex items-center gap-1 text-rose-600">
                          <AlertTriangle size={13} />
                          Statutory deadline passed — eligible for Section 19(1) First Appeal, free of cost under Sec 7(6)
                        </p>
                      )}
                      {app.status === "appealed" && appealDaysLeft !== null && (
                        <p className="text-xs mt-2 flex items-center gap-1 text-slate-700">
                          <Scale size={13} />
                          Appeal decision expected within {appealDaysLeft >= 0 ? `${appealDaysLeft} days` : "the statutory window"}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5 shrink-0">
                      {app.status === "drafted" && (
                        <button
                          onClick={() => {
                            markFiled(app.id, app.isLifeOrLiberty);
                            refresh();
                          }}
                          className="text-xs px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-medium"
                        >
                          Mark as Filed
                        </button>
                      )}
                      {app.status === "filed" && (
                        <button
                          onClick={() => {
                            markResponded(app.id);
                            refresh();
                          }}
                          className="text-xs px-3 py-1.5 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 font-medium flex items-center gap-1 justify-center"
                        >
                          <CheckCircle2 size={12} /> Response Received
                        </button>
                      )}
                      {app.status === "overdue" && (
                        <button
                          onClick={() => {
                            markAppealed(app.id);
                            refresh();
                          }}
                          className="text-xs px-3 py-1.5 rounded-lg bg-slate-900 text-amber-400 hover:bg-slate-800 font-medium"
                        >
                          File First Appeal
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (confirm("Delete this application permanently?")) {
                            deleteTrackedApplication(app.id);
                            refresh();
                          }
                        }}
                        className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:border-rose-300 hover:text-rose-600 flex items-center gap-1 justify-center"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}