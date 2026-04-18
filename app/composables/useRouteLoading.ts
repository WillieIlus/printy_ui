type RouteLoadingKind = 'auth' | 'workspace' | 'dashboard' | 'marketplace' | 'generic'

interface RouteLoadingCopy {
  kind: RouteLoadingKind
  title: string
  subtitle: string
}

const SHOW_DELAY_MS = 120
const MIN_VISIBLE_MS = 240

let showTimer: ReturnType<typeof setTimeout> | null = null
let hideTimer: ReturnType<typeof setTimeout> | null = null

function clearTimers() {
  if (showTimer) clearTimeout(showTimer)
  if (hideTimer) clearTimeout(hideTimer)
  showTimer = null
  hideTimer = null
}

export function getRouteLoadingCopy(path?: string | null): RouteLoadingCopy {
  const normalizedPath = (path || '').toLowerCase()

  if (normalizedPath.startsWith('/auth/login')) {
    return {
      kind: 'auth',
      title: 'Loading sign in',
      subtitle: 'Preparing your secure login screen.',
    }
  }

  if (normalizedPath.startsWith('/auth/signup')) {
    return {
      kind: 'auth',
      title: 'Loading account setup',
      subtitle: 'Preparing the account creation flow.',
    }
  }

  if (normalizedPath.startsWith('/auth')) {
    return {
      kind: 'auth',
      title: 'Loading authentication',
      subtitle: 'Preparing your authentication flow.',
    }
  }

  if (normalizedPath.startsWith('/dashboard')) {
    return {
      kind: 'dashboard',
      title: 'Loading workspace',
      subtitle: 'Preparing your Printy admin workspace.',
    }
  }

  if (
    normalizedPath.startsWith('/quote-draft')
    || normalizedPath.startsWith('/quotes')
    || normalizedPath.startsWith('/inbox')
    || normalizedPath.startsWith('/account')
    || normalizedPath.startsWith('/me')
  ) {
    return {
      kind: 'workspace',
      title: 'Loading workspace',
      subtitle: 'Preparing your requests, quotes, and account details.',
    }
  }

  if (
    normalizedPath.startsWith('/shops')
    || normalizedPath.startsWith('/gallery')
    || normalizedPath.startsWith('/pricing')
  ) {
    return {
      kind: 'marketplace',
      title: 'Loading Printy',
      subtitle: 'Preparing shops, products, and pricing details.',
    }
  }

  return {
    kind: 'generic',
    title: 'Loading',
    subtitle: 'Preparing the next page.',
  }
}

export function isAuthSensitiveRoute(path?: string | null) {
  const normalizedPath = (path || '').toLowerCase()
  return (
    normalizedPath.startsWith('/auth')
    || normalizedPath.startsWith('/dashboard')
    || normalizedPath.startsWith('/quote-draft')
    || normalizedPath.startsWith('/quotes')
    || normalizedPath.startsWith('/inbox')
    || normalizedPath.startsWith('/account')
    || normalizedPath.startsWith('/me')
  )
}

export function useRouteLoading() {
  const active = useState('route-loading:active', () => false)
  const visible = useState('route-loading:visible', () => false)
  const targetPath = useState<string | null>('route-loading:path', () => null)
  const visibleSince = useState('route-loading:visible-since', () => 0)

  function start(path?: string | null) {
    clearTimers()
    active.value = true
    targetPath.value = path ?? null

    showTimer = setTimeout(() => {
      visible.value = true
      visibleSince.value = Date.now()
    }, SHOW_DELAY_MS)
  }

  function finish() {
    active.value = false
    if (showTimer) {
      clearTimeout(showTimer)
      showTimer = null
    }

    if (!visible.value) {
      targetPath.value = null
      return
    }

    const elapsed = Date.now() - visibleSince.value
    const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed)

    hideTimer = setTimeout(() => {
      visible.value = false
      targetPath.value = null
      hideTimer = null
    }, remaining)
  }

  function fail() {
    clearTimers()
    active.value = false
    visible.value = false
    targetPath.value = null
  }

  return {
    active: readonly(active),
    visible: readonly(visible),
    targetPath: readonly(targetPath),
    start,
    finish,
    fail,
  }
}
