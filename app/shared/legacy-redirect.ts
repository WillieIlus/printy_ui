/**
 * Legacy deep-link resolver.
 *
 * Frontend dashboard routes live under `/app/*` (single-page dashboards). Links
 * from the pre-`/app` frontend (e.g.
 * `/dashboard/client/requests/2/quote/1`) and old public share links
 * (`/track-job/{token}`) do not match any page, so they are translated to their
 * routed equivalent before the router falls through to a 404. The mapping is
 * kept in lock-step with the backend's `api/frontend_links.py`.
 */
const _LEGACY_PATTERNS: ReadonlyArray<[RegExp, string]> = [
  [/^\/dashboard\/client\/requests\/\d+\/quote\/\d+$/, '/app/buyer?tab=quote'],
  [/^\/dashboard\/client\/requests\/\d+$/, '/app/buyer?tab=quote'],
  [/^\/dashboard\/client\/quotes\/\d+$/, '/app/buyer?tab=quote'],
  [/^\/dashboard\/client\/jobs\/\d+$/, '/app/buyer'],
  [/^\/dashboard\/client/, '/app/buyer'],
  [/^\/dashboard\/partner/, '/app/manager'],
  [/^\/dashboard\/(production|printshop|shop)/, '/app/printer'],
  [/^\/dashboard\/admin/, '/app/admin'],
]

export function resolveLegacyRoute(path: string): string | null {
  if (!path) {
    return null
  }
  if (path.startsWith('/track-job/')) {
    return `/track/${path.slice('/track-job/'.length)}`
  }
  const normalized = path.replace(/[?#].*$/, '').replace(/\/+$/, '')
  if (!normalized.startsWith('/dashboard')) {
    return null
  }
  for (const [pattern, routed] of _LEGACY_PATTERNS) {
    if (pattern.test(normalized)) {
      return routed
    }
  }
  return '/'
}