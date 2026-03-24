import { defineStore } from 'pinia';
import { x as useNuxtApp, A as API, w as parseApiError } from './server.mjs';

function mapPrintingRateToPrice(r, machineId) {
  return {
    id: r.id,
    machine: machineId,
    sheet_size: r.sheet_size,
    color_mode: r.color_mode,
    selling_price_per_side: String(r.single_price),
    selling_price_duplex_per_sheet: r.double_price ? String(r.double_price) : void 0,
    buying_price_per_side: null,
    profit_per_side: String(r.single_price),
    is_active: r.is_active
  };
}
function mapFinishingRateToService(r) {
  const chargeByMap = {
    PER_PIECE: "PER_PIECE",
    PER_SHEET: "PER_SHEET",
    PER_SIDE: "PER_PIECE",
    PER_SIDE_PER_SHEET: "PER_SHEET",
    PER_SQM: "PER_PIECE",
    FLAT: "PER_JOB"
  };
  const categorySlug = r.category_detail?.slug?.toUpperCase() ?? "OTHER";
  const chargeBy = chargeByMap[r.charge_unit] ?? "PER_PIECE";
  return {
    id: r.id,
    name: r.name,
    category: categorySlug,
    charge_by: chargeBy,
    buying_price: "0",
    selling_price: String(r.price),
    profit: String(r.price),
    is_default: false,
    is_active: r.is_active
  };
}
async function resolveCategoryId(category) {
  const { $api } = useNuxtApp();
  const data = await $api(
    API.finishingCategories()
  );
  const list = Array.isArray(data) ? data : data?.results ?? [];
  const slug = category.toLowerCase();
  const found = list.find((c) => c.slug === slug);
  return found?.id ?? null;
}
function mapPaperToPaperPrice(p) {
  const buy = parseFloat(p.buying_price) || 0;
  const sell = parseFloat(p.selling_price) || 0;
  const profit = Math.max(0, sell - buy);
  const marginPercent = sell > 0 ? (profit / sell * 100).toFixed(2) : "0";
  return {
    id: p.id,
    sheet_size: p.sheet_size,
    gsm: p.gsm,
    paper_type: p.paper_type,
    buying_price: p.buying_price,
    selling_price: p.selling_price,
    profit: String(profit),
    margin_percent: marginPercent,
    is_active: p.is_active
  };
}
function mapMaterialToMaterialPrice(m) {
  const name = m.material_type ? m.material_type.charAt(0).toUpperCase() + m.material_type.slice(1).toLowerCase() : "";
  return {
    id: m.id,
    material_type: m.material_type?.toUpperCase() ?? "BANNER",
    unit: m.unit ?? "SQM",
    selling_price: m.selling_price,
    buying_price: m.buying_price ?? null,
    is_active: m.is_active,
    material_name: name || m.material_type
  };
}
function mapFinishingServiceFormToApi(data, categoryId) {
  const chargeUnitMap = {
    PER_PIECE: "PER_PIECE",
    PER_SHEET: "PER_SHEET",
    PER_SIDE_PER_SHEET: "PER_SIDE_PER_SHEET",
    PER_JOB: "FLAT"
  };
  const body = {
    name: data.name,
    charge_unit: data.charge_by ? chargeUnitMap[data.charge_by] ?? data.charge_by : void 0,
    price: data.selling_price,
    is_active: true
  };
  if (categoryId != null) body.category = categoryId;
  return body;
}
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
     * Fetch all printing prices for a shop (aggregates from machines' printing-rates)
     */
    async fetchPrintingPrices(slug) {
      this.loading = true;
      try {
        const { $api } = useNuxtApp();
        const machines = await $api(API.shopMachines(slug));
        const list = Array.isArray(machines) ? machines : machines?.results ?? [];
        const all = [];
        for (const m of list) {
          const rawRates = await $api(API.sellerMachinePrintingRates(m.id));
          const rates = Array.isArray(rawRates) ? rawRates : rawRates?.results ?? [];
          for (const r of rates) {
            all.push(mapPrintingRateToPrice(r, m.id));
          }
        }
        this.printingPrices = all;
      } catch (err) {
        this.error = parseApiError(err, "Failed");
        throw err;
      } finally {
        this.loading = false;
      }
    },
    /**
     * Create a printing price (uses machines/<id>/printing-rates/)
     */
    async createPrintingPrice(_slug, data) {
      const { $api } = useNuxtApp();
      const payload = {
        sheet_size: data.sheet_size,
        color_mode: data.color_mode,
        single_price: data.selling_price_per_side,
        double_price: data.selling_price_duplex_per_sheet ?? null
      };
      const created = await $api(API.sellerMachinePrintingRates(data.machine), {
        method: "POST",
        body: payload
      });
      const mapped = mapPrintingRateToPrice(created, data.machine);
      this.printingPrices.push(mapped);
      return mapped;
    },
    /**
     * Update a printing price (uses machines/<id>/printing-rates/<pk>/)
     */
    async updatePrintingPrice(_slug, pk, data) {
      const { $api } = useNuxtApp();
      const price = this.printingPrices.find((p) => p.id === pk);
      if (!price) throw new Error("Printing price not found");
      const payload = {};
      if (data.sheet_size != null) payload.sheet_size = data.sheet_size;
      if (data.color_mode != null) payload.color_mode = data.color_mode;
      if (data.selling_price_per_side != null) payload.single_price = data.selling_price_per_side;
      if (data.selling_price_duplex_per_sheet !== void 0) payload.double_price = data.selling_price_duplex_per_sheet || null;
      const updated = await $api(
        API.sellerMachinePrintingRateDetail(price.machine, pk),
        { method: "PATCH", body: payload }
      );
      const index = this.printingPrices.findIndex((p) => p.id === pk);
      if (index !== -1) {
        this.printingPrices[index] = mapPrintingRateToPrice(updated, price.machine);
      }
      return this.printingPrices[index];
    },
    /**
     * Delete a printing price (uses machines/<id>/printing-rates/<pk>/)
     */
    async deletePrintingPrice(_slug, pk) {
      const { $api } = useNuxtApp();
      const price = this.printingPrices.find((p) => p.id === pk);
      if (!price) throw new Error("Printing price not found");
      await $api(API.sellerMachinePrintingRateDetail(price.machine, pk), { method: "DELETE" });
      this.printingPrices = this.printingPrices.filter((p) => p.id !== pk);
    },
    /**
     * Fetch all paper prices for a shop (uses papers/ API)
     */
    async fetchPaperPrices(slug) {
      this.loading = true;
      try {
        const { $api } = useNuxtApp();
        const raw = await $api(API.shopPaper(slug));
        const list = Array.isArray(raw) ? raw : raw?.results ?? [];
        this.paperPrices = list.map(mapPaperToPaperPrice);
      } catch (err) {
        this.error = parseApiError(err, "Failed");
        throw err;
      } finally {
        this.loading = false;
      }
    },
    /**
     * Create a paper price (uses papers/ API)
     */
    async createPaperPrice(slug, data) {
      const { $api } = useNuxtApp();
      const created = await $api(API.shopPaper(slug), {
        method: "POST",
        body: data
      });
      const mapped = mapPaperToPaperPrice(created);
      this.paperPrices.push(mapped);
      return mapped;
    },
    /**
     * Update a paper price (uses papers/ API)
     */
    async updatePaperPrice(slug, pk, data) {
      const { $api } = useNuxtApp();
      const updated = await $api(API.shopPaperDetail(slug, pk), {
        method: "PATCH",
        body: data
      });
      const index = this.paperPrices.findIndex((p) => p.id === pk);
      if (index !== -1) {
        this.paperPrices[index] = mapPaperToPaperPrice(updated);
      }
      return this.paperPrices[index];
    },
    /**
     * Delete a paper price (uses papers/ API)
     */
    async deletePaperPrice(slug, pk) {
      const { $api } = useNuxtApp();
      await $api(API.shopPaperDetail(slug, pk), { method: "DELETE" });
      this.paperPrices = this.paperPrices.filter((p) => p.id !== pk);
    },
    /**
     * Fetch all material prices for a shop (uses materials/ API)
     */
    async fetchMaterialPrices(slug) {
      this.loading = true;
      try {
        const { $api } = useNuxtApp();
        const raw = await $api(API.shopMaterialPrices(slug));
        const list = Array.isArray(raw) ? raw : raw?.results ?? [];
        this.materialPrices = list.map(mapMaterialToMaterialPrice);
      } catch (err) {
        this.error = parseApiError(err, "Failed");
        throw err;
      } finally {
        this.loading = false;
      }
    },
    /**
     * Create a material price (uses materials/ API)
     */
    async createMaterialPrice(slug, data) {
      const { $api } = useNuxtApp();
      const payload = {
        material_type: data.material_type,
        unit: data.unit,
        selling_price: data.selling_price,
        buying_price: data.buying_price ?? null,
        is_active: data.is_active ?? true
      };
      const created = await $api(API.shopMaterialPrices(slug), {
        method: "POST",
        body: payload
      });
      const mapped = mapMaterialToMaterialPrice(created);
      this.materialPrices.push(mapped);
      return mapped;
    },
    /**
     * Update a material price (uses materials/ API)
     */
    async updateMaterialPrice(slug, pk, data) {
      const { $api } = useNuxtApp();
      const payload = {};
      if (data.material_type != null) payload.material_type = data.material_type;
      if (data.unit != null) payload.unit = data.unit;
      if (data.selling_price != null) payload.selling_price = data.selling_price;
      if (data.buying_price !== void 0) payload.buying_price = data.buying_price ?? null;
      if (data.is_active !== void 0) payload.is_active = data.is_active;
      const updated = await $api(API.shopMaterialPriceDetail(slug, pk), {
        method: "PATCH",
        body: payload
      });
      const index = this.materialPrices.findIndex((p) => p.id === pk);
      if (index !== -1) {
        this.materialPrices[index] = mapMaterialToMaterialPrice(updated);
      }
      return this.materialPrices[index];
    },
    /**
     * Delete a material price (uses materials/ API)
     */
    async deleteMaterialPrice(slug, pk) {
      const { $api } = useNuxtApp();
      await $api(API.shopMaterialPriceDetail(slug, pk), { method: "DELETE" });
      this.materialPrices = this.materialPrices.filter((p) => p.id !== pk);
    },
    /**
     * Fetch all finishing services for a shop (uses finishing-rates API)
     */
    async fetchFinishingServices(slug) {
      this.loading = true;
      try {
        const { $api } = useNuxtApp();
        const rawData = await $api(API.shopFinishingServices(slug));
        const raw = Array.isArray(rawData) ? rawData : rawData?.results ?? [];
        this.finishingServices = raw.map(mapFinishingRateToService);
      } catch (err) {
        this.error = parseApiError(err, "Failed");
        throw err;
      } finally {
        this.loading = false;
      }
    },
    /**
     * Create a finishing service (uses finishing-rates API)
     */
    async createFinishingService(slug, data) {
      const { $api } = useNuxtApp();
      const categoryId = data.category ? await resolveCategoryId(data.category) : null;
      const payload = mapFinishingServiceFormToApi(data, categoryId);
      const created = await $api(API.shopFinishingServices(slug), {
        method: "POST",
        body: payload
      });
      this.finishingServices.push(mapFinishingRateToService(created));
      return this.finishingServices[this.finishingServices.length - 1];
    },
    /**
     * Update a finishing service (uses finishing-rates API)
     */
    async updateFinishingService(slug, pk, data) {
      const { $api } = useNuxtApp();
      const categoryId = data.category ? await resolveCategoryId(data.category) : void 0;
      const payload = mapFinishingServiceFormToApi(data, categoryId);
      const updated = await $api(API.shopFinishingServiceDetail(slug, pk), {
        method: "PATCH",
        body: payload
      });
      const index = this.finishingServices.findIndex((s) => s.id === pk);
      if (index !== -1) {
        this.finishingServices[index] = mapFinishingRateToService(updated);
      }
      return this.finishingServices[index];
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
//# sourceMappingURL=pricing-BwHzPGP8.mjs.map
