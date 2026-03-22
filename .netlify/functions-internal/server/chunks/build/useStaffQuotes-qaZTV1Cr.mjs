import { v as useNuxtApp, A as API } from './server.mjs';

function useStaffQuotes() {
  const { $api } = useNuxtApp();
  async function list(params) {
    return $api(API.staffQuotes(), { params });
  }
  async function get(id) {
    return $api(API.staffQuoteDetail(id));
  }
  async function create(payload) {
    return $api(API.staffQuotes(), { method: "POST", body: payload });
  }
  async function addItem(quoteId, payload) {
    return $api(API.staffQuoteItems(quoteId), { method: "POST", body: payload });
  }
  async function updateItem(quoteId, itemId, payload) {
    return $api(API.staffQuoteItemDetail(quoteId, itemId), {
      method: "PATCH",
      body: payload
    });
  }
  async function deleteItem(quoteId, itemId) {
    return $api(API.staffQuoteItemDetail(quoteId, itemId), { method: "DELETE" });
  }
  async function send(quoteId) {
    return $api(API.staffQuoteSend(quoteId), {
      method: "POST",
      body: {}
    });
  }
  async function whatsappPreview(quoteId) {
    return $api(API.staffQuoteWhatsappPreview(quoteId), {
      method: "POST",
      body: {}
    });
  }
  return {
    list,
    get,
    create,
    addItem,
    updateItem,
    deleteItem,
    send,
    whatsappPreview
  };
}

export { useStaffQuotes as u };
//# sourceMappingURL=useStaffQuotes-qaZTV1Cr.mjs.map
