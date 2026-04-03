export function formatWorkingHours(hours?: number | null): string {
  if (!hours || hours <= 0) return 'On request'
  return `${hours} working hour${hours === 1 ? '' : 's'}`
}

export function formatTurnaroundBadge(hours?: number | null, label?: string | null): string {
  if (!hours || hours <= 0) return label || 'On request'
  return label ? `${label} | ${formatWorkingHours(hours)}` : formatWorkingHours(hours)
}

export function formatReadySummary(hours?: number | null, readyText?: string | null): string {
  if (readyText) return readyText
  return formatWorkingHours(hours)
}
