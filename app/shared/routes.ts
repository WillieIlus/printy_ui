export const ROUTES = {
  home: '/',
  login: '/sign-in',
  register: '/sign-up',
  confirmEmail: '/auth/confirm-email',
  track: '/track',
  appAdmin: '/app/admin',
  appBuyer: '/app/buyer',
  appManager: '/app/manager',
  appPrinter: '/app/printer',
} as const

export function normalizeAuthRedirect(value?: string | null) {
  if (!value || !value.startsWith('/')) {
    return '/app'
  }
  return value
}

export function buildShopOwnerSignupRoute() {
  return '/sign-up?mode=printer'
}