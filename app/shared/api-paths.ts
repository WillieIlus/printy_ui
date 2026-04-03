/**
 * API path segments relative to runtimeConfig.public.apiBase.
 * apiBase is derived from NUXT_PUBLIC_API_BASE_URL + '/api' (single source of truth).
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
  analyticsEvents: () => 'analytics/events/',
  adminAnalyticsSummary: () => 'admin/analytics/summary/',
  adminAnalyticsTimeSeries: () => 'admin/analytics/timeseries/',
  adminAnalyticsTopMetrics: () => 'admin/analytics/top-metrics/',
  adminAnalyticsFunnel: () => 'admin/analytics/funnel/',
  adminAnalyticsLocations: () => 'admin/analytics/locations/',
  adminAnalyticsErrors: () => 'admin/analytics/errors/',
  // Users
  users: () => 'users/',
  userMe: () => 'users/me/',
  userDetail: (pk: string | number) => `users/${pk}/`,
  // Profiles
  profiles: () => 'profiles/',
  profileMe: () => 'profiles/me/',
  profileAvatarUpload: () => 'profiles/me/avatar/',
  // Notifications (me)
  notifications: () => 'me/notifications/',
  notificationDetail: (id: number) => `me/notifications/${id}/`,
  notificationMarkRead: (id: number) => `me/notifications/${id}/mark-read/`,
  notificationMarkAllRead: () => 'me/notifications/mark-all-read/',
  notificationUnreadCount: () => 'me/notifications/unread-count/',
  notificationActivitySummary: () => 'me/notifications/activity-summary/',
  profileDetail: (pk: string | number) => `profiles/${pk}/`,
  profileSocialLinks: (profileId: number) => `profiles/${profileId}/social-links/`,
  // Social links (global)
  socialLinks: () => 'social-links/',
  socialLinkDetail: (pk: number) => `social-links/${pk}/`,
  // Demo calculator — try real shop rate card first, fallback to static
  shopRateCardForCalculator: (slug: string) => `shops/${slug}/rate-card-for-calculator/`,
  // Legacy demo endpoints (may 404 if demo app not deployed)
  demoTemplates: () => 'demo/templates/',
  demoQuote: () => 'demo/quote/',
  // Public (Printy_API buyer browsing)
  publicShops: () => 'public/shops/',
  publicShopBySlug: (slug: string) => `public/shops/${slug}/`,
  publicShopCatalog: (slug: string) => `public/shops/${slug}/catalog/`,
  publicShopCustomOptions: (slug: string) => `public/shops/${slug}/custom-options/`,
  publicShopCalculatorPreview: (slug: string) => `public/shops/${slug}/calculator-preview/`,
  publicAllProducts: () => 'public/products/',
  publicMatchShops: () => 'public/match-shops/',
  // SEO (public, no auth — for sitemap and dynamic pages)
  seoLocations: () => 'seo/locations/',
  seoLocationDetail: (slug: string) => `seo/locations/${slug}/`,
  seoLocationProducts: (slug: string) => `seo/locations/${slug}/products/`,
  seoProducts: () => 'seo/products/',
  seoProductDetail: (slug: string) => `seo/products/${slug}/`,
  seoLocationProduct: (locationSlug: string, productSlug: string) =>
    `seo/locations/${locationSlug}/products/${productSlug}/`,
  seoRoutes: () => 'seo/routes/',
  /** Product gallery — categories with products (grouped) */
  productsGallery: () => 'products/gallery/',
  /** Gallery product calculate-price (shop-scoped; may require auth) */
  galleryProductCalculatePrice: (shopSlug: string, productSlug: string) =>
    `shops/${shopSlug}/gallery/products/${productSlug}/calculate-price/`,
  // Quote drafts (Printy_API buyer — cart-like draft per shop)
  quoteDraftsActive: (shopSlug: string, fileId?: number | null) => `quote-drafts/active/?shop=${encodeURIComponent(shopSlug)}${fileId ? `&file=${encodeURIComponent(String(fileId))}` : ''}`,
  calculatorPreview: () => 'calculator/preview/',
  calculatorBookletPreview: () => 'calculator/booklet-preview/',
  calculatorDrafts: () => 'calculator/drafts/',
  calculatorDraftDetail: (id: number) => `calculator/drafts/${id}/`,
  calculatorDraftSend: (id: number) => `calculator/drafts/${id}/send/`,
  quoteDraftItems: (draftId: number) => `quote-drafts/${draftId}/items/`,
  quoteDraftItemDetail: (draftId: number, itemId: number) => `quote-drafts/${draftId}/items/${itemId}/`,
  quoteDraftPreviewPrice: (draftId: number) => `quote-drafts/${draftId}/preview-price/`,
  quoteDraftRequestQuote: (draftId: number) => `quote-drafts/${draftId}/request-quote/`,
  quoteDraftDownloadPdf: (draftId: number) => `quote-drafts/${draftId}/download-pdf/`,
  quoteDraftFiles: () => 'quote-draft-files/',
  quoteDraftFileDetail: (fileId: number) => `quote-draft-files/${fileId}/`,
  quoteDraftFileDownloadPdf: (fileId: number) => `quote-draft-files/${fileId}/download-pdf/`,
  quoteDraftFileWhatsappPreview: (fileId: number) => `quote-draft-files/${fileId}/whatsapp-preview/`,
  quoteDraftTweakAndAdd: (draftId: number) => `quote-drafts/${draftId}/tweak-and-add/`,
  tweakedItemDetail: (itemId: number) => `tweaked-items/${itemId}/`,
  publicProductOptions: (pk: number) => `public/products/${pk}/options/`,
  // Setup status (printer onboarding)
  setupStatus: () => 'setup-status/',
  shopSetupStatus: (slug: string) => `shops/${slug}/setup-status/`,
  dashboardShopHome: () => 'dashboard/shop-home/',
  // Staff quotes API (staff-only)
  staffQuotes: () => 'quotes/',
  staffQuoteDetail: (id: number) => `quotes/${id}/`,
  staffQuoteItems: (quoteId: number) => `quotes/${quoteId}/items/`,
  staffQuoteItemDetail: (quoteId: number, itemId: number) => `quotes/${quoteId}/items/${itemId}/`,
  staffQuoteSend: (quoteId: number) => `quotes/${quoteId}/send/`,
  staffQuoteWhatsappPreview: (quoteId: number) => `quotes/${quoteId}/whatsapp-preview/`,
  staffQuoteShare: (quoteId: number) => `quotes/${quoteId}/share/`,
  // Job requests (JobShare / overflow work)
  jobRequests: () => 'job-requests/',
  jobRequestDetail: (id: number) => `job-requests/${id}/`,
  jobRequestWhatsappShare: (id: number) => `job-requests/${id}/whatsapp-share/`,
  jobRequestClaims: (id: number) => `job-requests/${id}/claims/`,
  jobClaims: () => 'job-claims/',
  jobClaimDetail: (id: number) => `job-claims/${id}/`,
  jobClaimAccept: (id: number) => `job-claims/${id}/accept/`,
  jobClaimReject: (id: number) => `job-claims/${id}/reject/`,
  publicJob: (token: string) => `public/job/${token}/`,
  // Quote calculator (staff-only, live preview)
  calculatorQuoteItem: () => 'calculator/quote-item/',
  // Quote requests (customer flow)
  quoteRequests: () => 'quote-requests/',
  quoteRequestDetail: (id: number) => `quote-requests/${id}/`,
  quoteRequestSubmit: (id: number) => `quote-requests/${id}/submit/`,
  quoteRequestResponses: (id: number) => `quote-requests/${id}/responses/`,
  quoteRequestAccept: (id: number) => `quote-requests/${id}/accept/`,
  quoteRequestReply: (id: number) => `quote-requests/${id}/reply/`,
  quoteRequestCancel: (id: number) => `quote-requests/${id}/cancel/`,
  // Shops
  shops: () => 'shops/',
  shopsPublic: () => 'shops/public/',
  shopsMyShops: () => 'shops/my_shops/',
  shopDetail: (slug: string) => `shops/${slug}/`,
  // Incoming requests (shop flow)
  incomingRequests: (shopSlug: string) => `shops/${shopSlug}/incoming-requests/`,
  incomingRequestDetail: (shopSlug: string, requestId: number) =>
    `shops/${shopSlug}/incoming-requests/${requestId}/`,
  incomingRequestSendQuote: (shopSlug: string, requestId: number) =>
    `shops/${shopSlug}/incoming-requests/${requestId}/send-quote/`,
  incomingRequestAccept: (shopSlug: string, requestId: number) =>
    `shops/${shopSlug}/incoming-requests/${requestId}/accept-request/`,
  incomingRequestAskQuestion: (shopSlug: string, requestId: number) =>
    `shops/${shopSlug}/incoming-requests/${requestId}/ask-question/`,
  incomingRequestReject: (shopSlug: string, requestId: number) =>
    `shops/${shopSlug}/incoming-requests/${requestId}/reject-request/`,
  incomingRequestMarkViewed: (shopSlug: string, requestId: number) =>
    `shops/${shopSlug}/incoming-requests/${requestId}/mark-viewed/`,
  incomingRequestDecline: (shopSlug: string, requestId: number) =>
    `shops/${shopSlug}/incoming-requests/${requestId}/decline/`,
  // Sent quotes (shop flow)
  sentQuotes: () => 'sent-quotes/',
  sentQuoteDetail: (id: number) => `sent-quotes/${id}/`,
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
  // Slug-based seller resources (prefer over id-based; id returns 404 when shop IDs differ across envs)
  shopProducts: (slug: string) => `shops/${slug}/products/`,
  shopProductDetail: (slug: string, pk: number) => `shops/${slug}/products/${pk}/`,
  shopProductCategories: (slug: string) => `shops/${slug}/products/categories/`,
  shopProductCategoryDetail: (slug: string, categorySlug: string) =>
    `shops/${slug}/products/categories/${encodeURIComponent(categorySlug)}/`,
  shopPapers: (slug: string) => `shops/${slug}/papers/`,
  shopPapersDetail: (slug: string, pk: number) => `shops/${slug}/papers/${pk}/`,
  shopMaterials: (slug: string) => `shops/${slug}/materials/`,
  shopMaterialDetail: (slug: string, pk: number) => `shops/${slug}/materials/${pk}/`,
  shopFinishingRates: (slug: string) => `shops/${slug}/finishing-rates/`,
  shopFinishingRateDetail: (slug: string, pk: number) => `shops/${slug}/finishing-rates/${pk}/`,
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
  // Finishing categories (global)
  finishingCategories: () => 'finishing-categories/',
  finishingCategoryDetail: (slug: string) => `finishing-categories/${slug}/`,
  // Product images
  shopProductImages: (shopSlug: string, productPk: number) => `shops/${shopSlug}/products/${productPk}/images/`,
  shopProductImageDetail: (shopSlug: string, productPk: number, imagePk: number) => `shops/${shopSlug}/products/${productPk}/images/${imagePk}/`,
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
  // Favorites (buyer) — use me/favorites/ for add, me/favorites/{id}/ for remove
  meFavorites: () => 'me/favorites/',
  meFavoriteDetail: (shopId: number) => `me/favorites/${shopId}/`,
  // Ratings
  shopRate: (shopId: number) => `shops/${shopId}/rate/`,
  publicShopRatingSummary: (slug: string) => `public/shops/${slug}/rating-summary/`,
  // Templates (catalog) — public
  templates: () => 'templates/',
  templateCategories: () => 'templates/categories/',
  templateDetail: (slug: string) => `templates/${slug}/`,
  templateCalculatePrice: (slug: string) => `templates/${slug}/calculate-price/`,
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
  // Paper (unified: inventory - backend uses papers/)
  shopPaper: (slug: string) => `shops/${slug}/papers/`,
  shopPaperDetail: (slug: string, pk: number) => `shops/${slug}/papers/${pk}/`,
  shopPaperAdjust: (slug: string, pk: number) => `shops/${slug}/papers/${pk}/adjust/`,
  // Uses finishing-rates (backend has no pricing/finishing route)
  shopFinishingServices: (slug: string) => `shops/${slug}/finishing-rates/`,
  shopFinishingServiceDetail: (slug: string, pk: number) => `shops/${slug}/finishing-rates/${pk}/`,
  // Materials (backend uses materials/ - large-format pricing)
  shopMaterialPrices: (slug: string) => `shops/${slug}/materials/`,
  shopMaterialPriceDetail: (slug: string, pk: number) => `shops/${slug}/materials/${pk}/`,
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
