/**
 * B1.3 — the homepage "Verified managers" strip's single "Request a quote"
 * button has to remember the visitor's choice for signed-out users: they are
 * routed to the quote flow, and the choice must survive the navigation and the
 * sign-up that may follow.
 *
 * The strip deliberately exposes no manager ids (the featured payload is four
 * fields), so the saved choice is the intent itself — the visitor picked
 * "request a quote" from the verified managers — not a specific manager. The
 * quote page reads it once and clears it, so a later visit starts clean.
 *
 * Pure and SSR-safe: no storage access unless there is a window.
 */

export const VERIFIED_MANAGERS_CHOICE_KEY = 'printy:verified-managers-choice'

export interface VerifiedManagersChoice {
  at: string
}

export interface ChoiceStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

function browserStorage(): ChoiceStorage | null {
  if (typeof window === 'undefined') {
    return null
  }
  try {
    return window.localStorage
  } catch {
    return null
  }
}

export function saveVerifiedManagersChoice(
  storage: ChoiceStorage | null = browserStorage(),
  now: Date = new Date(),
): VerifiedManagersChoice | null {
  if (!storage) {
    return null
  }
  const choice: VerifiedManagersChoice = { at: now.toISOString() }
  try {
    storage.setItem(VERIFIED_MANAGERS_CHOICE_KEY, JSON.stringify(choice))
  } catch {
    return null
  }
  return choice
}

export function readVerifiedManagersChoice(
  storage: ChoiceStorage | null = browserStorage(),
): VerifiedManagersChoice | null {
  if (!storage) {
    return null
  }
  try {
    const raw = storage.getItem(VERIFIED_MANAGERS_CHOICE_KEY)
    if (!raw) {
      return null
    }
    const parsed = JSON.parse(raw) as { at?: unknown }
    return typeof parsed.at === 'string' ? { at: parsed.at } : { at: '' }
  } catch {
    return null
  }
}

export function clearVerifiedManagersChoice(storage: ChoiceStorage | null = browserStorage()): void {
  if (!storage) {
    return
  }
  try {
    storage.removeItem(VERIFIED_MANAGERS_CHOICE_KEY)
  } catch {
    /* storage must never break the product */
  }
}
