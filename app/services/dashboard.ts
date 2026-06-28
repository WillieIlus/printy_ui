import { API } from '~/shared/api-paths'
import type { AdminDashboardResponse, ApiListResponse, DashboardCollectionResponse, DashboardDetailResponse, DashboardRole, PrintyNotification } from '~/shared/types'

const endpointMap: Record<DashboardRole, string> = {
  super_admin: API.dashboard.adminHome,
  client: API.dashboard.clientHome,
  partner: API.dashboard.partnerHome,
  production: API.dashboard.productionHome,
}

const sectionEndpointMap = {
  client: {
    quotes: API.dashboard.clientQuotes,
    jobs: API.dashboard.clientJobs,
    payments: API.dashboard.clientPayments,
  },
  partner: {
    quotes: API.dashboard.managerRequests,
    jobs: API.dashboard.partnerJobs,
    clients: API.dashboard.partnerClients,
    'production-shops': API.dashboard.partnerProductionShops,
    payments: API.dashboard.partnerPayments,
  },
  production: {
    jobs: API.dashboard.productionJobs,
    pricing: API.dashboard.productionPricing,
    'paper-stock': API.dashboard.productionPaperStock,
    finishings: API.dashboard.productionFinishings,
    payments: API.dashboard.productionPayments,
  },
} as const

export function useDashboardApi() {
  const { api } = useApi()
  return {
    fetchDashboardCounts: () => api<Record<string, any>>(API.dashboard.counts),
    fetchNotifications: (params?: Record<string, unknown>) => api<ApiListResponse<PrintyNotification> | PrintyNotification[]>(API.notifications.list, {
      query: params,
    }),
    fetchUnreadNotificationCount: () => api<Record<string, unknown>>(API.notifications.unreadCount),
    markNotificationRead: (id: number | string) => api<Record<string, unknown>>(API.notifications.markRead(id), {
      method: 'PATCH',
    }),
    markAllNotificationsRead: () => api<Record<string, unknown>>(API.notifications.markAllRead, {
      method: 'PATCH',
    }),
    fetchDashboardHome: (role: DashboardRole) => api<Record<string, any>>(endpointMap[role]),
    fetchAdminDashboard: () => api<AdminDashboardResponse>(API.dashboard.adminHome),
    fetchDashboardSection: (role: 'client' | 'partner' | 'production', section: string) => {
      const endpoint = sectionEndpointMap[role][section as keyof typeof sectionEndpointMap[typeof role]]
      if (!endpoint) {
        return Promise.resolve(null)
      }
      return api<DashboardCollectionResponse>(endpoint)
    },
    fetchDashboardDetail: (role: 'client' | 'partner' | 'production', section: string, id: number | string) => {
      const endpoint = role === 'client'
        ? (section === 'quotes' ? API.dashboard.clientQuoteDetail(id) : section === 'jobs' ? API.dashboard.clientJobDetail(id) : null)
        : role === 'partner'
          ? (section === 'quotes' ? API.dashboard.partnerQuoteDetail(id) : section === 'jobs' ? API.dashboard.partnerJobDetail(id) : null)
          : (section === 'jobs' ? API.dashboard.productionJobDetail(id) : null)
      if (!endpoint) {
        return Promise.resolve(null)
      }
      return api<DashboardDetailResponse>(endpoint)
    },
    fetchClientQuoteRequestDetail: (id: number | string) => api<Record<string, any>>(API.workflow.clientRequestDetail(id)),
    sendPartnerQuoteToClient: (
      id: number | string,
      payload: { broker_margin_type: 'percent' | 'fixed'; broker_margin_value: string; platform_service_percent: string },
    ) => api<Record<string, any>>(API.dashboard.partnerQuoteSendToClient(id), {
      method: 'POST',
      body: payload,
    }),
  }
}
