import { toValue } from 'vue';
import { o as useApi, A as API } from './server.mjs';

function useIncomingRequests(shopSlug) {
  const api = useApi();
  const getSlug = () => typeof shopSlug === "function" ? shopSlug() : toValue(shopSlug);
  async function list() {
    const slug = getSlug();
    const data = await api(
      API.incomingRequests(slug)
    );
    return Array.isArray(data) ? data : data.results ?? [];
  }
  async function get(requestId) {
    return api(API.incomingRequestDetail(getSlug(), requestId));
  }
  async function sendQuote(requestId, payload) {
    return api(API.incomingRequestSendQuote(getSlug(), requestId), {
      method: "POST",
      body: payload
    });
  }
  async function acceptRequest(requestId) {
    return api(API.incomingRequestAccept(getSlug(), requestId), {
      method: "POST",
      body: {}
    });
  }
  async function askQuestion(requestId, payload) {
    return api(API.incomingRequestAskQuestion(getSlug(), requestId), {
      method: "POST",
      body: payload
    });
  }
  async function rejectRequest(requestId, payload) {
    return api(API.incomingRequestReject(getSlug(), requestId), {
      method: "POST",
      body: payload
    });
  }
  async function markViewed(requestId) {
    return api(API.incomingRequestMarkViewed(getSlug(), requestId), {
      method: "POST",
      body: {}
    });
  }
  async function decline(requestId, payload = { reason: "" }) {
    return api(API.incomingRequestDecline(getSlug(), requestId), {
      method: "POST",
      body: payload
    });
  }
  return { list, get, sendQuote, acceptRequest, askQuestion, rejectRequest, markViewed, decline };
}
function useSentQuotes() {
  const api = useApi();
  async function list() {
    const data = await api(API.sentQuotes());
    return Array.isArray(data) ? data : data.results ?? [];
  }
  async function get(id) {
    return api(API.sentQuoteDetail(id));
  }
  async function revise(sentQuoteId, payload) {
    return api(API.sentQuoteDetail(sentQuoteId), {
      method: "PATCH",
      body: payload
    });
  }
  return { list, get, revise };
}

export { useSentQuotes as a, useIncomingRequests as u };
//# sourceMappingURL=useIncomingRequests-Dj9ppvKn.mjs.map
