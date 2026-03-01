/**
 * API path segments relative to runtimeConfig.public.apiBase (derived from NUXT_PUBLIC_API_BASE_URL + '/api').
 * Local: http://localhost:8000/api. Production: https://amazingace00.pythonanywhere.com/api
 */
export const API = {
  // Auth (SimpleJWT / Printy_API)
  auth: {
    token: 'auth/token/',
    tokenRefresh: 'auth/token/refresh/',
    me: 'auth/me/',
    // Legacy / optional
    register: 'auth/register/',
    signup: 'auth/signup/',
    verifyEmail: 'auth/email/verify/',
    resendVerification: 'auth/email/resend/',
    forgotPassword: 'auth/password/reset/',
    resetConfirm: 'auth/password/reset/confirm/',
  },
  // Users
  users: () => 'users/',
  userMe: () => 'users/me/',
  userDetail: (pk: string | number) => `users/${pk}/`,
  // Profiles
  profiles: () => 'profiles/',
  profileMe: () => 'profiles/me/',
  profileDetail: (pk: string | number) => `profiles/${pk}/`,
  profileSocialLinks: (profileId: number) => `profiles/${profileId}/social-links/`,
  // Social links (global)
  socialLinks: () => 'social-links/',
  socialLinkDetail: (pk: number) => `social-links/${pk}/`,
  // Public (Printy_API buyer browsing)
  publicShops: () => 'public/shops/',
  publicShopCatalog: (slug: string) => `public/shops/${slug}/catalog/`,
  publicAllProducts: () => 'public/products/',
  // Quote drafts (Printy_API buyer — cart-like draft per shop)
  quoteDraftsActive: (shopSlug: string) => `quote-drafts/active/?shop=${encodeURIComponent(shopSlug)}`,
  quoteDraftItems: (draftId: number) => `quote-drafts/${draftId}/items/`,
  quoteDraftItemDetail: (draftId: number, itemId: number) => `quote-drafts/${draftId}/items/${itemId}/`,
  quoteDraftPreviewPrice: (draftId: number) => `quote-drafts/${draftId}/preview-price/`,
  quoteDraftRequestQuote: (draftId: number) => `quote-drafts/${draftId}/request-quote/`,
  // Quote requests (read-only after submission)
  quoteRequests: () => 'quote-requests/',
  quoteRequestDetail: (id: number) => `quote-requests/${id}/`,
  quoteRequestSubmit: (draftId: number) => `quote-requests/${draftId}/submit/`,
  // Shops
  shops: () => 'shops/',
  shopsPublic: () => 'shops/public/',
  shopsMyShops: () => 'shops/my_shops/',
  shopDetail: (slug: string) => `shops/${slug}/`,
  // Seller (Printy_API) — shop-scoped by id
  sellerShopDetail: (id: number) => `shops/${id}/`,
  sellerShopMachines: (shopId: number) => `shops/${shopId}/machines/`,
  sellerShopMachineDetail: (shopId: number, pk: number) => `shops/${shopId}/machines/${pk}/`,
  sellerShopPapers: (shopId: number) => `shops/${shopId}/papers/`,
  sellerShopPaperDetail: (shopId: number, pk: number) => `shops/${shopId}/papers/${pk}/`,
  sellerShopFinishingRates: (shopId: number) => `shops/${shopId}/finishing-rates/`,
  sellerShopFinishingRateDetail: (shopId: number, pk: number) => `shops/${shopId}/finishing-rates/${pk}/`,
  sellerShopMaterials: (shopId: number) => `shops/${shopId}/materials/`,
  sellerShopMaterialDetail: (shopId: number, pk: number) => `shops/${shopId}/materials/${pk}/`,
  sellerShopProducts: (shopId: number) => `shops/${shopId}/products/`,
  sellerShopProductDetail: (shopId: number, pk: number) => `shops/${shopId}/products/${pk}/`,
  sellerMachinePrintingRates: (machineId: number) => `machines/${machineId}/printing-rates/`,
  sellerMachinePrintingRateDetail: (machineId: number, pk: number) => `machines/${machineId}/printing-rates/${pk}/`,
  shopTransferOwnership: (slug: string) => `shops/${slug}/transfer_ownership/`,
  shopMembers: (slug: string) => `shops/${slug}/members/`,
  shopMemberDetail: (slug: string, pk: number) => `shops/${slug}/members/${pk}/`,
  shopHours: (slug: string) => `shops/${slug}/hours/`,
  shopHoursBulk: (slug: string) => `shops/${slug}/hours/bulk/`,
  shopHoursDetail: (slug: string, pk: number) => `shops/${slug}/hours/${pk}/`,
  shopSocialLinks: (slug: string) => `shops/${slug}/social-links/`,
  shopSocialLinkDetail: (slug: string, pk: number) => `shops/${slug}/social-links/${pk}/`,
  shopsNearby: () => 'shops-nearby/',
  // Product templates
  productTemplates: (slug: string) => `shops/${slug}/product-templates/`,
  productTemplateDetail: (slug: string, pk: number) => `shops/${slug}/product-templates/${pk}/`,
  // Quotes
  shopQuotes: (slug: string) => `shops/${slug}/quotes/`,
  shopQuoteDetail: (slug: string, pk: number) => `shops/${slug}/quotes/${pk}/`,
  shopQuoteCalculate: (slug: string, pk: number) => `shops/${slug}/quotes/${pk}/calculate/`,
  shopQuoteUpdateStatus: (slug: string, pk: number) => `shops/${slug}/quotes/${pk}/update-status/`,
  shopQuoteDuplicate: (slug: string, pk: number) => `shops/${slug}/quotes/${pk}/duplicate/`,
  shopQuoteItems: (slug: string, quoteId: number) => `shops/${slug}/quotes/${quoteId}/items/`,
  shopQuoteItemDetail: (slug: string, quoteId: number, pk: number) =>
    `shops/${slug}/quotes/${quoteId}/items/${pk}/`,
  requestQuote: (slug: string) => `shops/${slug}/request-quote/`,
  myQuotes: () => 'my-quotes/',
  // Favorites (buyer)
  shopFavorite: (shopId: number) => `shops/${shopId}/favorite/`,
  meFavorites: () => 'me/favorites/',
  // Ratings
  shopRate: (shopId: number) => `shops/${shopId}/rate/`,
  publicShopRatingSummary: (slug: string) => `public/shops/${slug}/rating-summary/`,
  // Templates (catalog) — public
  templates: () => 'templates/',
  templateCategories: () => 'templates/categories/',
  templateDetail: (slug: string) => `templates/${slug}/`,
  templateCalculatePrice: (slug: string) => `templates/${slug}/calculate-price/`,
  // Shop-scoped templates (gallery)
  shopTemplateCategories: (slug: string) => `shops/${slug}/template-categories/`,
  shopTemplates: (slug: string) => `shops/${slug}/templates/`,
  shopTemplateDetail: (slug: string, templateSlug: string) => `shops/${slug}/templates/${templateSlug}/`,
  shopTemplateCalculatePrice: (slug: string, templateSlug: string) =>
    `shops/${slug}/templates/${templateSlug}/calculate-price/`,
  // Claims
  claims: () => 'claims/',
  claimDetail: (pk: number) => `claims/${pk}/`,
  claimVerify: () => 'claims/verify/',
  claimReview: (pk: number) => `claims/${pk}/review/`,
  
  // Pricing - Public (no auth required)
  shopRateCard: (slug: string) => `shops/${slug}/rate-card/`,
  shopCalculatePrice: (slug: string) => `shops/${slug}/calculate-price/`,
  
  // Pricing defaults (read-only templates)
  pricingDefaultsPrinting: () => 'pricing/defaults/printing/',
  pricingDefaultsPapers: () => 'pricing/defaults/papers/',
  pricingDefaultsMaterials: () => 'pricing/defaults/materials/',
  pricingDefaultsFinishing: () => 'pricing/defaults/finishing/',
  // Shop pricing seed & status
  shopPricingSeedDefaults: (slug: string) => `shops/${slug}/pricing/seed-defaults/`,
  shopPricingStatus: (slug: string) => `shops/${slug}/pricing/status/`,
  
  // Pricing - Management (shop owner)
  shopPrintingPrices: (slug: string) => `shops/${slug}/pricing/printing-prices/`,
  shopPrintingPriceDetail: (slug: string, pk: number) => `shops/${slug}/pricing/printing-prices/${pk}/`,
  // Paper (unified: inventory - was paper-stock + paper-prices)
  shopPaper: (slug: string) => `shops/${slug}/paper/`,
  shopPaperDetail: (slug: string, pk: number) => `shops/${slug}/paper/${pk}/`,
  shopPaperAdjust: (slug: string, pk: number) => `shops/${slug}/paper/${pk}/adjust/`,
  shopFinishingServices: (slug: string) => `shops/${slug}/pricing/finishing/`,
  shopFinishingServiceDetail: (slug: string, pk: number) => `shops/${slug}/pricing/finishing/${pk}/`,
  shopMaterialPrices: (slug: string) => `shops/${slug}/pricing/material-prices/`,
  shopMaterialPriceDetail: (slug: string, pk: number) => `shops/${slug}/pricing/material-prices/${pk}/`,
  shopVolumeDiscounts: (slug: string) => `shops/${slug}/pricing/discounts/`,
  shopVolumeDiscountDetail: (slug: string, pk: number) => `shops/${slug}/pricing/discounts/${pk}/`,
  // Inventory (machines, materials, paper stock)
  shopMachines: (slug: string) => `shops/${slug}/machines/`,
  shopMachineDetail: (slug: string, id: number) => `shops/${slug}/machines/${id}/`,
  // Legacy material/stock routes removed (use pricing/material-prices for large-format)
  shopPricing: (slug: string) => `shops/${slug}/pricing/`,

  // Subscription & payments
  shopSubscription: (slug: string) => `shops/${slug}/subscription/`,
  shopStkPush: (slug: string) => `shops/${slug}/payments/mpesa/stk-push/`,
  plans: () => 'plans/',
  paymentStatus: (id: number) => `payments/${id}/status/`,
} as const
