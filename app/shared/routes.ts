export const ROUTES = {
  home: '/',
  trackJob: '/track-job',
  forPartners: '/for-partners',
  shopSignup: '/auth/signup',
  shopLogin: '/auth/login',
  clientWorkspace: '/dashboard/client',
  clientJobs: '/dashboard/client/jobs',
  partnerWorkspace: '/dashboard/partner',
  shopWorkspace: '/dashboard/shop',
  shopSetup: '/dashboard/shop/setup',
  shopPricing: '/dashboard/shop/pricing',
  forShops: '/for-shops',
} as const

export const SHOP_OWNER_AUTH_QUERY = {
  role: 'shop_owner',
  next: ROUTES.shopSetup,
} as const

export const PENDING_RATE_CARD_DRAFT_KEY = 'printy_pending_rate_card'
export const LEGACY_PENDING_RATE_CARD_DRAFT_KEY = 'printy-for-shops-rate-card-draft-v2'

export function buildShopOwnerSignupRoute() {
  return {
    path: ROUTES.shopSignup,
    query: {
      role: SHOP_OWNER_AUTH_QUERY.role,
      next: SHOP_OWNER_AUTH_QUERY.next,
    },
  }
}

export function buildClientSignupRoute(redirect = '/quote-draft') {
  return {
    path: ROUTES.shopSignup,
    query: {
      role: 'client',
      next: redirect,
    },
  }
}

export function buildPartnerSignupRoute() {
  return {
    path: ROUTES.shopSignup,
    query: {
      role: 'partner',
      next: ROUTES.partnerWorkspace,
    },
  }
}

export function normalizeAuthRedirect(value: string | undefined): string {
  if (!value || !value.startsWith('/')) return ROUTES.home
  if (value.startsWith('//') || value.startsWith('/auth')) return ROUTES.home
  return value
}
