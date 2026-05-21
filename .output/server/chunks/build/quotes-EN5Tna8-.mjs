import { u as useApi, A as API, k as normalizeApiList } from './server.mjs';

async function replyToQuoteResponse(responseId, role, body) {
  const { api } = useApi();
  const endpoint = API.workflow.clientReplyResponse(responseId);
  return api(endpoint, {
    method: "POST",
    body: { body }
  });
}
async function fetchClientQuoteRequests() {
  const { api } = useApi();
  return normalizeApiList(await api(API.workflow.quoteRequests));
}
async function fetchClientQuoteRequestDetail(id) {
  const { api } = useApi();
  return api(API.workflow.clientRequestDetail(id));
}
async function acceptClientQuoteResponse(id) {
  const { api } = useApi();
  return api(API.workflow.clientAcceptResponse(id), {
    method: "POST",
    body: {}
  });
}
async function rejectClientQuoteResponse(id, reason, message = "") {
  const { api } = useApi();
  return api(API.workflow.clientRejectResponse(id), {
    method: "POST",
    body: { reason, message }
  });
}

export { acceptClientQuoteResponse as a, fetchClientQuoteRequests as b, replyToQuoteResponse as c, fetchClientQuoteRequestDetail as f, rejectClientQuoteResponse as r };
//# sourceMappingURL=quotes-EN5Tna8-.mjs.map
