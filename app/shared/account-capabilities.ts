export function getAccountCapabilities(user?: { capabilities?: Record<string, unknown> | null } | null) {
  return user?.capabilities ?? {}
}
