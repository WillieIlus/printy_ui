import { u as useApi, k as normalizeApiList, A as API } from './server.mjs';

async function searchPartnerClients(query = "") {
  const { api } = useApi();
  const results = normalizeApiList(await api(API.partner.clients));
  const normalizedQuery = String(query || "").trim().toLowerCase();
  if (!normalizedQuery) {
    return results;
  }
  return results.filter((client) => {
    const haystack = [
      client.name,
      client.phone,
      client.email,
      client.company
    ].map((value) => String(value || "").toLowerCase()).join(" ");
    return haystack.includes(normalizedQuery);
  });
}
async function createPartnerClient(payload) {
  const { api } = useApi();
  return api(API.partner.clients, {
    method: "POST",
    body: payload
  });
}
async function previewPartnerQuote(payload) {
  const { api } = useApi();
  return api(API.partner.quotePreview, {
    method: "POST",
    body: payload
  });
}
async function createPartnerQuote(payload) {
  const { api } = useApi();
  return api(API.partner.quoteCreate, {
    method: "POST",
    body: payload
  });
}
async function sendPartnerQuoteToClient(quoteId, payload) {
  const { api } = useApi();
  return api(API.dashboard.partnerQuoteSendToClient(quoteId), {
    method: "POST",
    body: payload
  });
}
async function getPartnerQuotes() {
  const { api } = useApi();
  return normalizeApiList(await api(API.partner.quotes));
}
async function getPartnerQuoteDetail(id) {
  const { api } = useApi();
  return api(API.dashboard.partnerQuoteDetail(id));
}
async function dispatchPartnerJob(jobId) {
  const { api } = useApi();
  return api(API.dashboard.partnerJobDispatch(jobId), {
    method: "POST"
  });
}

export { createPartnerQuote as a, getPartnerQuotes as b, createPartnerClient as c, dispatchPartnerJob as d, sendPartnerQuoteToClient as e, getPartnerQuoteDetail as g, previewPartnerQuote as p, searchPartnerClients as s };
//# sourceMappingURL=partner-CVYG73qe.mjs.map
