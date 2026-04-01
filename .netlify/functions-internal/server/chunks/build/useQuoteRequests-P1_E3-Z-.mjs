import { h as useApi, A as API } from './server.mjs';

function useQuoteRequests() {
  const api = useApi();
  async function list() {
    const data = await api(API.quoteRequests());
    return Array.isArray(data) ? data : data.results ?? [];
  }
  async function get(id) {
    return api(API.quoteRequestDetail(id));
  }
  async function submit(id) {
    return api(API.quoteRequestSubmit(id), { method: "POST", body: {} });
  }
  async function accept(id, sentQuoteId) {
    return api(API.quoteRequestAccept(id), {
      method: "POST",
      body: { sent_quote_id: sentQuoteId }
    });
  }
  async function reply(id, payload) {
    return api(API.quoteRequestReply(id), {
      method: "POST",
      body: payload
    });
  }
  async function cancel(id) {
    return api(API.quoteRequestCancel(id), { method: "POST", body: {} });
  }
  return { list, get, submit, accept, reply, cancel };
}

export { useQuoteRequests as u };
//# sourceMappingURL=useQuoteRequests-P1_E3-Z-.mjs.map
