"use client";

import React, { useMemo, useState } from "react";
import { calculateRtiFee } from "@/lib/feeCalculator";
import { RtiApplicationData } from "@/types/rti";
import { Calculator, IndianRupee, Sparkles } from "lucide-react";

interface FeeCalculatorProps {
  rtiData: RtiApplicationData;
  onUpdateRti: (newData: Partial<RtiApplicationData>) => void;
}

export const FeeCalculator: React.FC<FeeCalculatorProps> = ({ rtiData, onUpdateRti }) => {
  const [pages, setPages] = useState(0);
  const [inspectionHours, setInspectionHours] = useState(0);
  const [inserted, setInserted] = useState(false);

  const breakdown = useMemo(
    () => calculateRtiFee({ isBpl: rtiData.isBpl, pages, inspectionHours }),
    [rtiData.isBpl, pages, inspectionHours]
  );

  const handleInsert = () => {
    onUpdateRti({ feeDetails: breakdown.summary });
    setInserted(true);
    setTimeout(() => setInserted(false), 2000);
  };

  return (
    <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
      <div className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
        <Calculator className="w-3.5 h-3.5 text-blue-600" />
        <span>RTI Fee Calculator</span>
      </div>

      {rtiData.isBpl ? (
        <div className="text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md p-2.5">
          BPL status is checked above — the application fee is fully exempt under Section 7(5). No further calculation needed.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-600 mb-1">Pages of records requested</label>
              <input
                type="number"
                min={0}
                value={pages}
                onChange={(e) => setPages(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-white border border-slate-300 rounded-md p-2 text-slate-900"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1">Inspection hours (if any)</label>
              <input
                type="number"
                min={0}
                value={inspectionHours}
                onChange={(e) => setInspectionHours(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-white border border-slate-300 rounded-md p-2 text-slate-900"
              />
            </div>
          </div>

          <div className="flex items-center justify-between bg-white border border-slate-200 rounded-md p-3">
            <div className="flex items-center gap-1.5 text-slate-700 text-sm font-semibold">
              <IndianRupee className="w-4 h-4 text-amber-600" />
              Total: ₹{breakdown.total}
            </div>
            <button
              onClick={handleInsert}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-400 font-medium flex items-center gap-1"
            >
              {inserted ? (
                <>
                  <Sparkles className="w-3.5 h-3.5" /> Inserted
                </>
              ) : (
                "Insert into Fee Details"
              )}
            </button>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">{breakdown.summary}</p>
        </>
      )}
    </div>
  );
};