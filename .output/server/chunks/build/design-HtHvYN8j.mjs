const PRINTY_EMPTY_STATE = {
  card: "rounded-2xl border border-slate-200 bg-slate-50 px-5 py-8 text-center"
};
const PRINTY_SHELLS = {
  topbar: {
    light: "bg-white border-b border-slate-200",
    dark: "bg-[#0f172a] border-b border-white/10"
  },
  sidebar: {
    light: "bg-white border-r border-slate-200",
    dark: "bg-[#0f172a]"
  }
};
const PRINTY_STATUS_VARIANTS = {
  draft: "bg-slate-50 text-slate-700 border-slate-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  assigned: "bg-blue-50 text-blue-700 border-blue-200",
  quoted: "bg-amber-50 text-amber-700 border-amber-200",
  accepted: "bg-green-50 text-green-700 border-green-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  in_production: "bg-amber-50 text-amber-700 border-amber-200",
  ready: "bg-green-50 text-green-700 border-green-200",
  delivered: "bg-blue-50 text-blue-700 border-blue-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
  verified: "bg-green-50 text-green-700 border-green-200",
  unverified: "bg-slate-50 text-slate-600 border-slate-200",
  failed: "bg-red-50 text-red-700 border-red-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  completed: "bg-blue-50 text-blue-700 border-blue-200",
  active: "bg-[#fff4ed] text-[#c4471a] border-[#fed7b5]",
  paid: "bg-green-50 text-green-700 border-green-200",
  unpaid: "bg-slate-50 text-slate-700 border-slate-200",
  overdue: "bg-red-50 text-red-700 border-red-200",
  uploaded: "bg-blue-50 text-blue-700 border-blue-200",
  missing: "bg-slate-50 text-slate-700 border-slate-200"
};
function printyStatusKey(status) {
  const normalized = String(status || "").toLowerCase();
  if (!normalized) return "pending";
  if (normalized.includes("overdue")) return "overdue";
  if (normalized.includes("unverified")) return "unverified";
  if (normalized.includes("verified")) return "verified";
  if (normalized.includes("unpaid")) return "unpaid";
  if (normalized.includes("paid") || normalized.includes("confirm")) return "paid";
  if (normalized.includes("missing")) return "missing";
  if (normalized.includes("upload") || normalized.includes("attach")) return "uploaded";
  if (normalized.includes("warn")) return "warning";
  if (normalized.includes("fail") || normalized.includes("error") || normalized.includes("issue")) return "failed";
  if (normalized.includes("deliver")) return "delivered";
  if (normalized.includes("complete")) return "completed";
  if (normalized.includes("ready") || normalized.includes("approve")) return "ready";
  if (normalized.includes("production") || normalized.includes("printing") || normalized.includes("progress")) return "in_production";
  if (normalized.includes("accept")) return "accepted";
  if (normalized.includes("assign")) return "assigned";
  if (normalized.includes("quote") || normalized.includes("review") || normalized.includes("view") || normalized.includes("submit")) return "quoted";
  if (normalized.includes("reject")) return "rejected";
  if (normalized.includes("cancel")) return "cancelled";
  if (normalized.includes("draft")) return "draft";
  if (normalized.includes("active")) return "active";
  return "pending";
}
function printyStatusVariant(status) {
  return PRINTY_STATUS_VARIANTS[printyStatusKey(status)];
}
function printyStatusDot(status) {
  switch (printyStatusKey(status)) {
    case "accepted":
    case "ready":
    case "verified":
    case "paid":
      return "bg-green-500";
    case "assigned":
    case "uploaded":
    case "delivered":
    case "completed":
      return "bg-blue-500";
    case "quoted":
    case "pending":
    case "warning":
    case "in_production":
    case "active":
      return "bg-amber-500";
    case "rejected":
    case "cancelled":
    case "failed":
    case "overdue":
      return "bg-red-500";
    default:
      return "bg-slate-500";
  }
}

export { PRINTY_EMPTY_STATE as P, PRINTY_SHELLS as a, printyStatusVariant as b, printyStatusDot as p };
//# sourceMappingURL=design-HtHvYN8j.mjs.map
