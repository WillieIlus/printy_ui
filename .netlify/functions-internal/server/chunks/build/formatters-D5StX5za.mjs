function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(void 0, {
    year: "numeric",
    month: "short",
    day: "numeric"
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

export { formatKES as a, formatDate as b, formatCurrency as f };
//# sourceMappingURL=formatters-D5StX5za.mjs.map
