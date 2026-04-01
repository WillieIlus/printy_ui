import { c as useAuthStore, e as useToast, n as navigateTo } from './server.mjs';
import { u as useQuoteInboxStore } from './quoteInbox-CT7a8yeE.mjs';

function useQuoteRequestBlast() {
  const authStore = useAuthStore();
  const quoteInboxStore = useQuoteInboxStore();
  const toast = useToast();
  async function saveAndSend(payload) {
    if (!payload.selectedShopIds.length) {
      toast.add({ title: "No shops selected", description: "Select at least one shop before sending.", color: "warning" });
      return null;
    }
    if (!authStore.isAuthenticated) {
      await navigateTo({
        path: "/auth/login",
        query: { redirect: payload.loginRedirectPath || "/quote-draft" }
      });
      return null;
    }
    if (!authStore.isClient) {
      toast.add({ title: "Client account required", description: "Only client accounts can send quote requests to shops.", color: "warning" });
      return null;
    }
    const draft = await quoteInboxStore.saveDraft({
      title: payload.title,
      shop: payload.shop ?? null,
      selected_product: payload.selectedProduct ?? null,
      calculator_inputs_snapshot: payload.calculatorInputsSnapshot,
      pricing_snapshot: payload.pricingSnapshot ?? null,
      custom_product_snapshot: payload.customProductSnapshot ?? null,
      request_details_snapshot: payload.requestDetailsSnapshot ?? {}
    });
    return await quoteInboxStore.sendDraft(
      draft.id,
      payload.selectedShopIds,
      payload.requestDetailsSnapshot ?? {}
    );
  }
  async function sendSavedDraft(draftId, selectedShopIds, requestDetailsSnapshot) {
    if (!selectedShopIds.length) {
      toast.add({ title: "No shops selected", description: "Select at least one shop before sending.", color: "warning" });
      return null;
    }
    return await quoteInboxStore.sendDraft(draftId, selectedShopIds, requestDetailsSnapshot ?? {});
  }
  return {
    saveAndSend,
    sendSavedDraft
  };
}

export { useQuoteRequestBlast as u };
//# sourceMappingURL=useQuoteRequestBlast-BX_QZhbB.mjs.map
