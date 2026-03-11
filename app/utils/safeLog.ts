/**
 * Deduplicated error logging. Prevents the same error from being logged multiple times
 * (e.g. when ofetch throws and Vue/Pinia also surfaces it).
 */
const SEEN_TTL_MS = 5000
const seen = new Map<string, number>()

function fingerprint(err: unknown): string {
  if (err instanceof Error) {
    const stack = err.stack ?? ''
    const msg = err.message ?? ''
    return `${msg}|${stack.slice(0, 200)}`
  }
  return String(err)
}

function prune() {
  const now = Date.now()
  for (const [key, ts] of seen) {
    if (now - ts > SEEN_TTL_MS) seen.delete(key)
  }
}

/**
 * Log an error to console.error only if we haven't logged the same error recently.
 * Use instead of console.error for API/store errors to avoid duplicate stack traces.
 */
export function safeLogError(err: unknown, context?: string): void {
  const key = fingerprint(err)
  const now = Date.now()
  prune()
  if (seen.has(key)) return
  seen.set(key, now)
  const prefix = context ? `[${context}] ` : ''
  if (err instanceof Error) {
    console.error(prefix + err.message, err)
  } else {
    console.error(prefix + String(err))
  }
}
