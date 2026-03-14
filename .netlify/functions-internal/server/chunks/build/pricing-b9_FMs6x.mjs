import { defineStore } from 'pinia';
import { s as useNuxtApp, A as API } from './server.mjs';
import { p as parseApiError } from './api-error-D1IYk86E.mjs';

const usePricingStore = defineStore("pricing", {
  state: () => ({
    rateCard: null,
    printingPrices: [],
    paperPrices: [],
    materialPrices: [],
    finishingServices: [],
    volumeDiscounts: [],
    calculationResult: null,
    loading: false,
    error: null,
    defaultPrinting: [],
    defaultPapers: [],
    defaultMaterials: [],
    defaultFinishing: []
  }),
  getters: {
    /**
     * Get paper prices grouped by GSM
     */
    paperPricesByGSM: (state) => {
      const grouped = {};
      for (const price of state.paperPrices) {
        (grouped[price.gsm] ??= []).push(price);
      }
      return grouped;
    },
    /**
     * Get finishing services by category
     */
    finishingByCategory: (state) => {
      const grouped = {};
      for (const service of state.finishingServices) {
        (grouped[service.category] ??= []).push(service);
      }
      return grouped;
    },
    /**
     * Check if shop has pricing configured
     */
    hasPricing: (state) => {
      return state.printingPrices.length > 0 || state.paperPrices.length > 0 || state.materialPrices.length > 0 || state.finishingServices.length > 0;
    },
    /**
     * Check if any pricing row needs review
     */
    hasNeedsReview: (state) => {
      const printing = state.printingPrices.some((p) => p.needs_review);
      const paper = state.paperPrices.some((p) => p.needs_review);
      const material = state.materialPrices.some((p) => p.needs_review);
      const finishing = state.finishingServices.some((s) => s.needs_review);
      return printing || paper || material || finishing;
    }
  },
  actions: {
    /**
     * Fetch public rate card for a shop
     */
    async fetchRateCard(slug) {
      this.loading = true;
      this.error = null;
      try {
        const { $publicApi } = useNuxtApp();
        this.rateCard = await $publicApi(API.shopRateCard(slug));
      } catch (err) {
        this.error = parseApiError(err, "Failed to fetch rate card");
        throw err;
      } finally {
        this.loading = false;
      }
    },
    /**
     * Calculate price for a print job
     */
    async calculatePrice(slug, input) {
      this.loading = true;
      this.error = null;
      try {
        const { $api } = useNuxtApp();
        this.calculationResult = await $api(
          API.shopCalculatePrice(slug),
          {
            method: "POST",
            body: input
          }
        );
        return this.calculationResult;
      } catch (err) {
        this.error = parseApiError(err, "Failed to calculate price");
        throw err;
      } finally {
        this.loading = false;
      }
    },
    // =========== Shop Owner Management ===========
    /**
     * Fetch all printing prices for a shop
     */
    async fetchPrintingPrices(slug) {
      this.loading = true;
      try {
        const { $api } = useNuxtApp();
        this.printingPrices = await $api(API.shopPrintingPrices(slug));
      } catch (err) {
        this.error = parseApiError(err, "Failed");
        throw err;
      } finally {
        this.loading = false;
      }
    },
    /**
     * Create a printing price
     */
    async createPrintingPrice(slug, data) {
      const { $api } = useNuxtApp();
      const created = await $api(API.shopPrintingPrices(slug), {
        method: "POST",
        body: data
      });
      this.printingPrices.push(created);
      return created;
    },
    /**
     * Update a printing price
     */
    async updatePrintingPrice(slug, pk, data) {
      const { $api } = useNuxtApp();
      const updated = await $api(API.shopPrintingPriceDetail(slug, pk), {
        method: "PATCH",
        body: data
      });
      const index = this.printingPrices.findIndex((p) => p.id === pk);
      if (index !== -1) {
        this.printingPrices[index] = updated;
      }
      return updated;
    },
    /**
     * Delete a printing price
     */
    async deletePrintingPrice(slug, pk) {
      const { $api } = useNuxtApp();
      await $api(API.shopPrintingPriceDetail(slug, pk), { method: "DELETE" });
      this.printingPrices = this.printingPrices.filter((p) => p.id !== pk);
    },
    /**
     * Fetch all paper prices for a shop
     */
    async fetchPaperPrices(slug) {
      this.loading = true;
      try {
        const { $api } = useNuxtApp();
        this.paperPrices = await $api(API.shopPaper(slug));
      } catch (err) {
        this.error = parseApiError(err, "Failed");
        throw err;
      } finally {
        this.loading = false;
      }
    },
    /**
     * Create a paper price
     */
    async createPaperPrice(slug, data) {
      const { $api } = useNuxtApp();
      const created = await $api(API.shopPaper(slug), {
        method: "POST",
        body: data
      });
      this.paperPrices.push(created);
      return created;
    },
    /**
     * Update a paper price
     */
    async updatePaperPrice(slug, pk, data) {
      const { $api } = useNuxtApp();
      const updated = await $api(API.shopPaperDetail(slug, pk), {
        method: "PATCH",
        body: data
      });
      const index = this.paperPrices.findIndex((p) => p.id === pk);
      if (index !== -1) {
        this.paperPrices[index] = updated;
      }
      return updated;
    },
    /**
     * Delete a paper price
     */
    async deletePaperPrice(slug, pk) {
      const { $api } = useNuxtApp();
      await $api(API.shopPaperDetail(slug, pk), { method: "DELETE" });
      this.paperPrices = this.paperPrices.filter((p) => p.id !== pk);
    },
    /**
     * Fetch all material prices for a shop
     */
    async fetchMaterialPrices(slug) {
      this.loading = true;
      try {
        const { $api } = useNuxtApp();
        this.materialPrices = await $api(API.shopMaterialPrices(slug));
      } catch (err) {
        this.error = parseApiError(err, "Failed");
        throw err;
      } finally {
        this.loading = false;
      }
    },
    /**
     * Create a material price
     */
    async createMaterialPrice(slug, data) {
      const { $api } = useNuxtApp();
      const created = await $api(API.shopMaterialPrices(slug), {
        method: "POST",
        body: data
      });
      this.materialPrices.push(created);
      return created;
    },
    /**
     * Update a material price
     */
    async updateMaterialPrice(slug, pk, data) {
      const { $api } = useNuxtApp();
      const updated = await $api(API.shopMaterialPriceDetail(slug, pk), {
        method: "PATCH",
        body: data
      });
      const index = this.materialPrices.findIndex((p) => p.id === pk);
      if (index !== -1) {
        this.materialPrices[index] = updated;
      }
      return updated;
    },
    /**
     * Delete a material price
     */
    async deleteMaterialPrice(slug, pk) {
      const { $api } = useNuxtApp();
      await $api(API.shopMaterialPriceDetail(slug, pk), { method: "DELETE" });
      this.materialPrices = this.materialPrices.filter((p) => p.id !== pk);
    },
    /**
     * Fetch all finishing services for a shop
     */
    async fetchFinishingServices(slug) {
      this.loading = true;
      try {
        const { $api } = useNuxtApp();
        this.finishingServices = await $api(API.shopFinishingServices(slug));
      } catch (err) {
        this.error = parseApiError(err, "Failed");
        throw err;
      } finally {
        this.loading = false;
      }
    },
    /**
     * Create a finishing service
     */
    async createFinishingService(slug, data) {
      const { $api } = useNuxtApp();
      const created = await $api(API.shopFinishingServices(slug), {
        method: "POST",
        body: data
      });
      this.finishingServices.push(created);
      return created;
    },
    /**
     * Update a finishing service
     */
    async updateFinishingService(slug, pk, data) {
      const { $api } = useNuxtApp();
      const updated = await $api(API.shopFinishingServiceDetail(slug, pk), {
        method: "PATCH",
        body: data
      });
      const index = this.finishingServices.findIndex((s) => s.id === pk);
      if (index !== -1) {
        this.finishingServices[index] = updated;
      }
      return updated;
    },
    /**
     * Delete a finishing service
     */
    async deleteFinishingService(slug, pk) {
      const { $api } = useNuxtApp();
      await $api(API.shopFinishingServiceDetail(slug, pk), { method: "DELETE" });
      this.finishingServices = this.finishingServices.filter((s) => s.id !== pk);
    },
    /**
     * Fetch all volume discounts for a shop
     */
    async fetchVolumeDiscounts(slug) {
      this.loading = true;
      try {
        const { $api } = useNuxtApp();
        this.volumeDiscounts = await $api(API.shopVolumeDiscounts(slug));
      } catch (err) {
        this.error = parseApiError(err, "Failed");
        throw err;
      } finally {
        this.loading = false;
      }
    },
    /**
     * Create a volume discount
     */
    async createVolumeDiscount(slug, data) {
      const { $api } = useNuxtApp();
      const created = await $api(API.shopVolumeDiscounts(slug), {
        method: "POST",
        body: data
      });
      this.volumeDiscounts.push(created);
      return created;
    },
    /**
     * Update a volume discount
     */
    async updateVolumeDiscount(slug, pk, data) {
      const { $api } = useNuxtApp();
      const updated = await $api(API.shopVolumeDiscountDetail(slug, pk), {
        method: "PATCH",
        body: data
      });
      const index = this.volumeDiscounts.findIndex((d) => d.id === pk);
      if (index !== -1) {
        this.volumeDiscounts[index] = updated;
      }
      return updated;
    },
    /**
     * Delete a volume discount
     */
    async deleteVolumeDiscount(slug, pk) {
      const { $api } = useNuxtApp();
      await $api(API.shopVolumeDiscountDetail(slug, pk), { method: "DELETE" });
      this.volumeDiscounts = this.volumeDiscounts.filter((d) => d.id !== pk);
    },
    /**
     * Clear all pricing data
     */
    clearPricing() {
      this.rateCard = null;
      this.printingPrices = [];
      this.paperPrices = [];
      this.materialPrices = [];
      this.finishingServices = [];
      this.volumeDiscounts = [];
      this.calculationResult = null;
      this.error = null;
    },
    /**
     * Fetch default pricing templates (read-only)
     */
    async fetchPricingDefaults() {
      const { $api } = useNuxtApp();
      try {
        const [printing, papers, materials, finishing] = await Promise.all([
          $api(API.pricingDefaultsPrinting()),
          $api(API.pricingDefaultsPapers()),
          $api(API.pricingDefaultsMaterials()),
          $api(API.pricingDefaultsFinishing())
        ]);
        this.defaultPrinting = printing ?? [];
        this.defaultPapers = papers ?? [];
        this.defaultMaterials = materials ?? [];
        this.defaultFinishing = finishing ?? [];
      } catch (err) {
        this.error = parseApiError(err, "Failed to fetch defaults");
        throw err;
      }
    },
    /**
     * Seed shop with default pricing (POST)
     */
    async seedShopDefaults(slug) {
      const { $api } = useNuxtApp();
      await $api(API.shopPricingSeedDefaults(slug), { method: "POST" });
      await Promise.all([
        this.fetchPrintingPrices(slug),
        this.fetchPaperPrices(slug),
        this.fetchMaterialPrices(slug),
        this.fetchFinishingServices(slug),
        this.fetchVolumeDiscounts(slug)
      ]);
    },
    /**
     * Fetch shop pricing status (if backend provides)
     */
    async fetchPricingStatus(slug) {
      try {
        const { $api } = useNuxtApp();
        return await $api(API.shopPricingStatus(slug));
      } catch {
        return null;
      }
    }
  }
});

export { usePricingStore as u };
//# sourceMappingURL=pricing-b9_FMs6x.mjs.map
