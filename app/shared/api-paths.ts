export const API = {
  notifications: {
    list: '/me/notifications/',
    unreadCount: '/me/notifications/unread-count/',
    markRead: (id: number | string) => `/me/notifications/${id}/mark-read/`,
    markAllRead: '/me/notifications/mark-all-read/',
  },
  auth: {
    register: '/auth/register/',
    login: '/auth/login/',
    refresh: '/auth/token/refresh/',
    me: '/auth/me/',
    confirmEmail: '/auth/confirm-email/',
    resendConfirmation: '/auth/resend-confirmation/',
    forgotPassword: '/auth/password-reset/',
    resetConfirm: '/auth/password-reset/confirm/',
    changePassword: '/auth/password-change/',
  },
  jobs: {
    publicManagedTrack: (token: string) => `/public/managed-jobs/track/${token}/`,
  },
  rateCard: {
    setup: '/shops/rate-card/setup/',
    complete: '/shops/rate-card/onboarding-complete/',
    publicConfig: '/for-shops/rate-card/public-config/',
    publicPreview: '/for-shops/rate-card/public-preview/',
  },
  quoteDrafts: {
    list: '/calculator/drafts/',
    detail: (id: number | string) => `/calculator/drafts/${id}/`,
    send: (id: number | string) => `/calculator/drafts/${id}/send/`,
    guest: '/calculator/guest-drafts/',
    claim: '/calculator/drafts/claim/',
    buyerQuotes: '/calculator/buyer-quotes/',
  },
  payments: {
    mpesaStkPush: '/payments/mpesa/stk-push/',
    mpesaDetail: (id: number | string) => `/payments/mpesa/${id}/`,
  },
  contact: {
    submit: '/contact/submit/',
  },
} as const