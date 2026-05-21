export const ROUTES = {
  home: '/',
  login: '/auth/login',
  register: '/auth/register',
  forgotPassword: '/auth/forgot-password',
  resetPassword: '/auth/reset-password',
  confirmEmail: '/auth/confirm-email',
  dashboard: '/dashboard',
  dashboardAdmin: '/dashboard/admin',
  dashboardClient: '/dashboard/client',
  dashboardPartner: '/dashboard/partner',
  dashboardProduction: '/dashboard/production',
  shopIncomingJobs: '/dashboard/production/jobs',
  forShops: '/for-shops',
} as const

export function normalizeAuthRedirect(value?: string | null) {
  if (!value || !value.startsWith('/')) {
    return ROUTES.dashboard
  }
  return value
}

export function buildShopOwnerSignupRoute() {
  return '/auth/register?role=production'
}

export const PENDING_RATE_CARD_DRAFT_KEY = 'printy:pending-rate-card-draft'
export const LEGACY_PENDING_RATE_CARD_DRAFT_KEY = 'pendingRateCardDraft'
