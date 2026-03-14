function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(void 0, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}
function formatKES(value) {
  if (value === null || value === void 0) return "—";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (Number.isNaN(num)) return "—";
  return `KES ${num.toLocaleString("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
function formatItemPrice(value) {
  if (value === null || value === void 0) return "—";
  const str = String(value).trim();
  if (!str) return "—";
  const rangeMatch = str.match(/^([\d,.\s]+)\s*[–\-]\s*[\d,.\s]+/);
  if (rangeMatch) {
    const first = parseFloat(rangeMatch[1].replace(/,/g, "").trim());
    if (!Number.isNaN(first)) return formatKES(first);
  }
  const cleaned = str.replace(/,/g, "").replace(/\s*USD\s*$/i, "").trim();
  const num = parseFloat(cleaned);
  if (!Number.isNaN(num)) return formatKES(num);
  return str;
}

export { formatDate as a, formatKES as b, formatItemPrice as f };
//# sourceMappingURL=formatters-C4IR8tCh.mjs.map
