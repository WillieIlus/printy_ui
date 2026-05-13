export function safeParticipantLabel(value: string | null | undefined, fallback: string): string {
  const normalized = typeof value === 'string' ? value.trim() : ''
  return normalized || fallback
}
