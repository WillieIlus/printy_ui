function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(void 0, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}
function formatDateTime(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString(void 0, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function formatCurrency(value, currency = "KES") {
  if (value === null || value === void 0) return "—";
  const num = typeof value === "string" ? parseFloat(String(value).replace(/,/g, "")) : value;
  if (Number.isNaN(num)) return String(value);
  const c = (currency || "KES").toUpperCase();
  if (c === "KES" || c === "KSH") {
    return `KES ${num.toLocaleString("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return new Intl.NumberFormat(void 0, { style: "currency", currency: c }).format(num);
}
function formatKES(value) {
  if (value === null || value === void 0) return "—";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (Number.isNaN(num)) return "—";
  return `KES ${num.toLocaleString("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export { formatDateTime as a, formatKES as b, formatDate as c, formatCurrency as f };
//# sourceMappingURL=formatters-C39vX7Ji.mjs.map
