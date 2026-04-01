function asRecord(value) {
  return value && typeof value === "object" ? value : null;
}
function asString(value) {
  if (value === null || value === void 0 || value === "") return "";
  return String(value);
}
function pickFirst(...values) {
  return values.find((value) => value !== null && value !== void 0 && value !== "");
}
function extractProductionDetails(source) {
  const record = asRecord(source);
  const breakdown = asRecord(record?.breakdown);
  const imposition = asRecord(breakdown?.imposition);
  const piecesPerSheet = asString(pickFirst(
    record?.copies_per_sheet,
    imposition?.copies_per_sheet,
    imposition?.per_sheet
  ));
  const sheetsNeeded = asString(pickFirst(
    record?.parent_sheets_required,
    record?.good_sheets,
    imposition?.parent_sheets_required,
    imposition?.good_sheets,
    imposition?.sheets_needed
  ));
  const parentSheetName = asString(pickFirst(
    record?.parent_sheet_name,
    imposition?.parent_sheet_name,
    imposition?.sheet_size,
    asRecord(breakdown?.paper)?.sheet_size
  ));
  const rotatedValue = pickFirst(record?.rotated, imposition?.orientation);
  const rotated = typeof rotatedValue === "boolean" ? rotatedValue ? "Yes" : "No" : String(rotatedValue ?? "").toLowerCase() === "rotated" ? "Yes" : "";
  const explanationLinesRaw = pickFirst(record?.explanation_lines, record?.explanations);
  const explanationLines = Array.isArray(explanationLinesRaw) ? explanationLinesRaw.map((line) => asString(line)).filter(Boolean) : [];
  return {
    piecesPerSheet,
    sheetsNeeded,
    parentSheetName,
    rotated,
    rollWidthMm: asString(record?.roll_width_mm),
    rollLengthMm: asString(record?.roll_length_mm),
    tilesX: asString(record?.tiles_x),
    tilesY: asString(record?.tiles_y),
    totalTiles: asString(record?.total_tiles),
    explanationLines
  };
}

export { extractProductionDetails as e };
//# sourceMappingURL=productionDetails-ByImjBQh.mjs.map
