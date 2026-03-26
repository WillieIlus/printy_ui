function normalizeTextValue(value) {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value).trim();
  if (value && typeof value === "object") {
    const record = value;
    if (typeof record.value === "string" || typeof record.value === "number") {
      return normalizeTextValue(record.value);
    }
    if (typeof record.label === "string") {
      return record.label.trim();
    }
  }
  return "";
}
function normalizeOptionalText(value) {
  const normalized = normalizeTextValue(value);
  return normalized ? normalized : null;
}
function normalizeNumberValue(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const normalized = normalizeTextValue(value);
  if (!normalized) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}
function normalizeSelectValue(value) {
  if (typeof value === "string" || typeof value === "number") return value;
  if (value && typeof value === "object") {
    const record = value;
    if (typeof record.value === "string" || typeof record.value === "number") {
      return record.value;
    }
    if (typeof record.id === "string" || typeof record.id === "number") {
      return record.id;
    }
  }
  return null;
}

export { normalizeOptionalText as a, normalizeSelectValue as b, normalizeNumberValue as n };
//# sourceMappingURL=payload-B09QCjlG.mjs.map
