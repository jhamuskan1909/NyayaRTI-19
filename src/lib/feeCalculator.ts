export interface FeeBreakdown {
  applicationFee: number;
  copyingCharge: number;
  inspectionCharge: number;
  total: number;
  isExempt: boolean;
  summary: string;
}

interface FeeInput {
  isBpl: boolean;
  pages?: number;          // pages of records requested (₹2/page beyond first)
  inspectionHours?: number; // hours of on-site inspection (first hour free)
}

// Based on the Central RTI (Regulation of Fee and Cost) Rules, 2005 — ₹10 application fee,
// ₹2/page copying, ₹5/hour inspection after the first free hour, BPL fully exempt under Sec 7(5).
// Most States mirror this; a few states prescribe different amounts — always confirm on the
// specific State RTI portal before paying, since state notifications can change.
export function calculateRtiFee(input: FeeInput): FeeBreakdown {
  const { isBpl, pages = 0, inspectionHours = 0 } = input;

  if (isBpl) {
    return {
      applicationFee: 0,
      copyingCharge: 0,
      inspectionCharge: 0,
      total: 0,
      isExempt: true,
      summary: "Exempt — BPL applicants pay no fee under Section 7(5) of the RTI Act, 2005 (attach valid BPL proof).",
    };
  }

  const applicationFee = 10;
  const copyingCharge = pages > 0 ? pages * 2 : 0;
  const extraInspectionHours = Math.max(0, inspectionHours - 1); // first hour free
  const inspectionCharge = extraInspectionHours * 5;
  const total = applicationFee + copyingCharge + inspectionCharge;

  const parts = [`₹${applicationFee} application fee`];
  if (copyingCharge > 0) parts.push(`₹${copyingCharge} copying charge (${pages} pages @ ₹2)`);
  if (inspectionCharge > 0) parts.push(`₹${inspectionCharge} inspection charge (${extraInspectionHours} hrs beyond free first hour)`);

  return {
    applicationFee,
    copyingCharge,
    inspectionCharge,
    total,
    isExempt: false,
    summary: `${parts.join(" + ")} = ₹${total} total. Rates per Central RTI Rules — some States charge differently, confirm on your State RTI portal.`,
  };
}