function formatWorkingHours(hours) {
  if (!hours || hours <= 0) return "On request";
  return `${hours} working hour${hours === 1 ? "" : "s"}`;
}
function formatTurnaroundBadge(hours, label) {
  if (!hours || hours <= 0) return label || "On request";
  return label ? `${label} | ${formatWorkingHours(hours)}` : formatWorkingHours(hours);
}
function formatReadySummary(hours, readyText) {
  if (readyText) return readyText;
  return formatWorkingHours(hours);
}

export { formatWorkingHours as a, formatReadySummary as b, formatTurnaroundBadge as f };
//# sourceMappingURL=turnaround-D4yRvJpV.mjs.map
