function formatDate(value) {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString(void 0, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}
function normalizeCurrencyCode(currency) {
  const normalized = String(currency ?? "").trim().toUpperCase();
  if (!normalized) return "KES";
  if (normalized === "KSH") return "KES";
  if (/^[A-Z]{3}$/.test(normalized)) return normalized;
  return "KES";
}
function parseCurrencyAmount(value) {
  if (value === null || value === void 0) return { amount: null, currency: null };
  if (typeof value === "number") {
    return { amount: Number.isFinite(value) ? value : null, currency: null };
  }
  const raw = String(value).trim();
  if (!raw) return { amount: null, currency: null };
  const prefixMatch = raw.match(/^([A-Za-z]{3})\s+/);
  const suffixMatch = raw.match(/\s+([A-Za-z]{3})$/);
  const numericPart = raw.replace(/^([A-Za-z]{3})\s+/, "").replace(/\s+([A-Za-z]{3})$/, "").replace(/,/g, "").trim();
  const parsed = Number.parseFloat(numericPart);
  return {
    amount: Number.isFinite(parsed) ? parsed : null,
    currency: prefixMatch || suffixMatch ? normalizeCurrencyCode(prefixMatch?.[1] ?? suffixMatch?.[1] ?? null) : null
  };
}
function formatCurrency(value, currency = "KES", fallback = "N/A") {
  if (value === null || value === void 0) return fallback;
  const parsed = parseCurrencyAmount(value);
  if (parsed.amount === null) return typeof value === "string" && !value.trim() ? fallback : String(value);
  const code = normalizeCurrencyCode(parsed.currency ?? currency);
  if (code === "KES") {
    return `KES ${parsed.amount.toLocaleString("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return new Intl.NumberFormat(void 0, { style: "currency", currency: code }).format(parsed.amount);
}
function formatCurrencyRange(minValue, maxValue, currency) {
  if (minValue === null || minValue === void 0) return null;
  const low = formatCurrency(minValue, currency ?? "KES");
  if (maxValue === null || maxValue === void 0) return low;
  const high = formatCurrency(maxValue, currency ?? "KES");
  return low === high ? low : `${low} - ${high}`;
}
function formatItemPrice(value, currency) {
  if (value === null || value === void 0) return "N/A";
  const str = String(value).trim();
  if (!str) return "N/A";
  const parsed = parseCurrencyAmount(str);
  const resolvedCurrency = normalizeCurrencyCode(parsed.currency ?? currency);
  const rangeMatch = str.match(/^(?:([A-Za-z]{3})\s+)?([\d,.\s]+)\s*[â€“-]\s*[\d,.\s]+(?:\s+([A-Za-z]{3}))?$/);
  if (rangeMatch) {
    const first = parseFloat((rangeMatch[2] ?? "").replace(/,/g, "").trim());
    const rangeCurrency = rangeMatch[1] ?? rangeMatch[3] ?? resolvedCurrency;
    if (!Number.isNaN(first)) return formatCurrency(first, rangeCurrency);
  }
  if (parsed.amount !== null) return formatCurrency(parsed.amount, resolvedCurrency);
  return str;
}

export { formatItemPrice as a, formatCurrencyRange as b, formatCurrency as c, formatDate as f, normalizeCurrencyCode as n };
//# sourceMappingURL=formatters-Cc_7PG6h.mjs.map
