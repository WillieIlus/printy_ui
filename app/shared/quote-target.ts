import type { ProtoRole } from '~/shared/workspace'

/**
 * Destination of the header "Quote" chip: an authenticated buyer lands on their
 * "My quotes" tab (`/app/buyer`, with `buyerTab` set to `'quote'` by the caller);
 * everyone else lands on the public instant-quote calculator at `/`.
 */
export function quoteNavTarget(authed: boolean, role: ProtoRole): string {
  return authed && role === 'buyer' ? '/app/buyer' : '/'
}