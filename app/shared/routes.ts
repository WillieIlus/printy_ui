export const ROUTES = {
  home: '/',
  shopSignup: '/auth/signup',
  shopLogin: '/auth/login',
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

export function normalizeAuthRedirect(value: string | undefined): string {
  if (!value || !value.startsWith('/')) return ROUTES.home
  if (value.startsWith('//') || value.startsWith('/auth')) return ROUTES.home
  return value
}
