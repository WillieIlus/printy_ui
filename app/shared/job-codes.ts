/**
 * Law 10.1 / 7.7 — the job code chip and its tracking link.
 *
 * The code is the item's backend identity: the quote reference (`QR-...`) that
 * becomes the job code on acceptance, or the managed reference (`MJ-...`). The
 * share link carries the code only; it never embeds a secret token. These
 * helpers compose what the backend already decided — they never invent a code
 * or a link.
 */

export function normalizeJobCode(code: string | null | undefined): string {
  return String(code ?? '').trim()
}

/** In-app route to the track page for a code (law 7.7). */
export function trackPath(code: string): string {
  return `/track/${encodeURIComponent(normalizeJobCode(code))}`
}

/**
 * The shareable tracking link. Prefer the backend-provided `tracking_url`;
 * otherwise build the same code-only link on the current origin.
 */
export function trackShareUrl(code: string, trackingUrl?: string | null): string {
  const given = String(trackingUrl ?? '').trim()
  if (given) {
    return given
  }
  const path = trackPath(code)
  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}${path}`
  }
  return path
}

export type ShareOutcome = 'shared' | 'copied' | 'failed'

/** Copy text to the clipboard, returning whether it succeeded. */
export async function copyToClipboard(text: string): Promise<boolean> {
  const value = String(text ?? '')
  if (!value) {
    return false
  }
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value)
      return true
    }
  } catch {
    /* fall through — nothing else to try here */
  }
  return false
}

/**
 * Share a tracking link (WhatsApp/SMS via the OS share sheet). Falls back to
 * copying the link when the Web Share API is unavailable, and reports which
 * path was taken so the chip can confirm it to the user.
 */
export async function shareTrackLink(opts: {
  code: string
  trackingUrl?: string | null
  title?: string
  text?: string
}): Promise<ShareOutcome> {
  const url = trackShareUrl(opts.code, opts.trackingUrl)
  const title = opts.title ?? 'Track this Printy job'
  const text = opts.text ?? `Follow this print job: ${url}`
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      await navigator.share({ title, text, url })
      return 'shared'
    }
  } catch (error) {
    // A user-cancelled share sheet is not a failure of the copy fallback.
    if ((error as { name?: string } | null)?.name === 'AbortError') {
      return 'shared'
    }
  }
  return (await copyToClipboard(url)) ? 'copied' : 'failed'
}
