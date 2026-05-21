import { u as useApi, A as API } from './server.mjs';

const endpointMap = {
  super_admin: API.dashboard.adminHome,
  client: API.dashboard.clientHome,
  partner: API.dashboard.partnerHome,
  production: API.dashboard.productionHome
};
const sectionEndpointMap = {
  client: {
    quotes: API.dashboard.clientQuotes,
    jobs: API.dashboard.clientJobs,
    payments: API.dashboard.clientPayments
  },
  partner: {
    quotes: API.dashboard.partnerQuotes,
    jobs: API.dashboard.partnerJobs,
    clients: API.dashboard.partnerClients,
    "production-shops": API.dashboard.partnerProductionShops,
    payments: API.dashboard.partnerPayments
  },
  production: {
    jobs: API.dashboard.productionJobs,
    pricing: API.dashboard.productionPricing,
    "paper-stock": API.dashboard.productionPaperStock,
    finishings: API.dashboard.productionFinishings,
    payments: API.dashboard.productionPayments
  }
};
function useDashboardApi() {
  const { api } = useApi();
  return {
    fetchDashboardHome: (role) => api(endpointMap[role]),
    fetchAdminDashboard: () => api(API.dashboard.adminHome),
    fetchDashboardSection: (role, section) => {
      const endpoint = sectionEndpointMap[role][section];
      if (!endpoint) {
        return Promise.resolve(null);
      }
      return api(endpoint);
    },
    fetchDashboardDetail: (role, section, id) => {
      const endpoint = role === "client" ? section === "quotes" ? API.dashboard.clientQuoteDetail(id) : section === "jobs" ? API.dashboard.clientJobDetail(id) : null : role === "partner" ? section === "quotes" ? API.dashboard.partnerQuoteDetail(id) : section === "jobs" ? API.dashboard.partnerJobDetail(id) : null : section === "jobs" ? API.dashboard.productionJobDetail(id) : null;
      if (!endpoint) {
        return Promise.resolve(null);
      }
      return api(endpoint);
    },
    fetchClientQuoteRequestDetail: (id) => api(API.workflow.clientRequestDetail(id)),
    sendPartnerQuoteToClient: (id, payload) => api(API.dashboard.partnerQuoteSendToClient(id), {
      method: "POST",
      body: payload
    })
  };
}

export { useDashboardApi as u };
//# sourceMappingURL=dashboard-CEbEdesF.mjs.map
