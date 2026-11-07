export interface GuestRedirectAuthState {
  isAuthenticated: boolean
  homeRoute: string
}

/**
 * Decision behind the `guest` middleware: an already-authenticated user hitting a
 * guest-only page (sign-in / sign-up) is sent to their role dashboard; anyone else
 * passes through untouched. Kept as a pure function so the redirect behaviour is
 * unit-testable without a Nuxt route/middleware harness.
 */
export function resolveGuestRedirect(auth: GuestRedirectAuthState): string | null {
  return auth.isAuthenticated ? auth.homeRoute : null
}