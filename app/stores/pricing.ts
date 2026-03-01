import { defineStore } from 'pinia'
import { API } from '~/shared/api-paths'
import { parseApiError } from '~/utils/api-error'
import type {
  RateCard,
  PriceCalculationInput,
  PriceCalculationResult,
  PrintingPrice,
  PaperPrice,
  MaterialPrice,
  FinishingService,
  VolumeDiscount,
  PrintingPriceForm,
  PaperPriceForm,
  MaterialPriceForm,
  FinishingServiceForm,
  VolumeDiscountForm,
  DefaultPrintingPriceTemplate,
  DefaultPaperPriceTemplate,
  DefaultMaterialPriceTemplate,
  DefaultFinishingServiceTemplate,
} from '~/shared/types'

interface PricingState {
  rateCard: RateCard | null
  printingPrices: PrintingPrice[]
  paperPrices: PaperPrice[]
  materialPrices: MaterialPrice[]
  finishingServices: FinishingService[]
  volumeDiscounts: VolumeDiscount[]
  calculationResult: PriceCalculationResult | null
  loading: boolean
  error: string | null
  defaultPrinting: DefaultPrintingPriceTemplate[]
  defaultPapers: DefaultPaperPriceTemplate[]
  defaultMaterials: DefaultMaterialPriceTemplate[]
  defaultFinishing: DefaultFinishingServiceTemplate[]
}

export const usePricingStore = defineStore('pricing', {
  state: (): PricingState => ({
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
    defaultFinishing: [],
  }),

  getters: {
    /**
     * Get paper prices grouped by GSM
     */
    paperPricesByGSM: (state) => {
      const grouped: Record<number, PaperPrice[]> = {}
      for (const price of state.paperPrices) {
        (grouped[price.gsm] ??= []).push(price)
      }
      return grouped
    },

    /**
     * Get finishing services by category
     */
    finishingByCategory: (state) => {
      const grouped: Record<string, FinishingService[]> = {}
      for (const service of state.finishingServices) {
        (grouped[service.category] ??= []).push(service)
      }
      return grouped
    },

    /**
     * Check if shop has pricing configured
     */
    hasPricing: (state) => {
      return (
        state.printingPrices.length > 0 ||
        state.paperPrices.length > 0 ||
        state.materialPrices.length > 0 ||
        state.finishingServices.length > 0
      )
    },

    /**
     * Check if any pricing row needs review
     */
    hasNeedsReview: (state) => {
      const printing = state.printingPrices.some((p) => p.needs_review)
      const paper = state.paperPrices.some((p) => p.needs_review)
      const material = state.materialPrices.some((p) => p.needs_review)
      const finishing = state.finishingServices.some((s) => s.needs_review)
      return printing || paper || material || finishing
    },
  },

  actions: {
    /**
     * Fetch public rate card for a shop
     */
    async fetchRateCard(slug: string) {
      this.loading = true
      this.error = null
      try {
        const { $api } = useNuxtApp()
        this.rateCard = await $api<RateCard>(API.shopRateCard(slug))
      } catch (err: unknown) {
        this.error = parseApiError(err, 'Failed to fetch rate card')
        throw err
      } finally {
        this.loading = false
      }
    },

    /**
     * Calculate price for a print job
     */
    async calculatePrice(slug: string, input: PriceCalculationInput) {
      this.loading = true
      this.error = null
      try {
        const { $api } = useNuxtApp()
        this.calculationResult = await $api<PriceCalculationResult>(
          API.shopCalculatePrice(slug),
          {
            method: 'POST',
            body: input,
          }
        )
        return this.calculationResult
      } catch (err: unknown) {
        this.error = parseApiError(err, 'Failed to calculate price')
        throw err
      } finally {
        this.loading = false
      }
    },

    // =========== Shop Owner Management ===========

    /**
     * Fetch all printing prices for a shop
     */
    async fetchPrintingPrices(slug: string) {
      this.loading = true
      try {
        const { $api } = useNuxtApp()
        this.printingPrices = await $api<PrintingPrice[]>(API.shopPrintingPrices(slug))
      } catch (err: unknown) {
        this.error = parseApiError(err, 'Failed')
        throw err
      } finally {
        this.loading = false
      }
    },

    /**
     * Create a printing price
     */
    async createPrintingPrice(slug: string, data: PrintingPriceForm) {
      const { $api } = useNuxtApp()
      const created = await $api<PrintingPrice>(API.shopPrintingPrices(slug), {
        method: 'POST',
        body: data,
      })
      this.printingPrices.push(created)
      return created
    },

    /**
     * Update a printing price
     */
    async updatePrintingPrice(slug: string, pk: number, data: Partial<PrintingPriceForm>) {
      const { $api } = useNuxtApp()
      const updated = await $api<PrintingPrice>(API.shopPrintingPriceDetail(slug, pk), {
        method: 'PATCH',
        body: data,
      })
      const index = this.printingPrices.findIndex((p) => p.id === pk)
      if (index !== -1) {
        this.printingPrices[index] = updated
      }
      return updated
    },

    /**
     * Delete a printing price
     */
    async deletePrintingPrice(slug: string, pk: number) {
      const { $api } = useNuxtApp()
      await $api(API.shopPrintingPriceDetail(slug, pk), { method: 'DELETE' })
      this.printingPrices = this.printingPrices.filter((p) => p.id !== pk)
    },

    /**
     * Fetch all paper prices for a shop
     */
    async fetchPaperPrices(slug: string) {
      this.loading = true
      try {
        const { $api } = useNuxtApp()
        this.paperPrices = await $api<PaperPrice[]>(API.shopPaper(slug))
      } catch (err: unknown) {
        this.error = parseApiError(err, 'Failed')
        throw err
      } finally {
        this.loading = false
      }
    },

    /**
     * Create a paper price
     */
    async createPaperPrice(slug: string, data: PaperPriceForm) {
      const { $api } = useNuxtApp()
      const created = await $api<PaperPrice>(API.shopPaper(slug), {
        method: 'POST',
        body: data,
      })
      this.paperPrices.push(created)
      return created
    },

    /**
     * Update a paper price
     */
    async updatePaperPrice(slug: string, pk: number, data: Partial<PaperPriceForm>) {
      const { $api } = useNuxtApp()
      const updated = await $api<PaperPrice>(API.shopPaperDetail(slug, pk), {
        method: 'PATCH',
        body: data,
      })
      const index = this.paperPrices.findIndex((p) => p.id === pk)
      if (index !== -1) {
        this.paperPrices[index] = updated
      }
      return updated
    },

    /**
     * Delete a paper price
     */
    async deletePaperPrice(slug: string, pk: number) {
      const { $api } = useNuxtApp()
      await $api(API.shopPaperDetail(slug, pk), { method: 'DELETE' })
      this.paperPrices = this.paperPrices.filter((p) => p.id !== pk)
    },

    /**
     * Fetch all material prices for a shop
     */
    async fetchMaterialPrices(slug: string) {
      this.loading = true
      try {
        const { $api } = useNuxtApp()
        this.materialPrices = await $api<MaterialPrice[]>(API.shopMaterialPrices(slug))
      } catch (err: unknown) {
        this.error = parseApiError(err, 'Failed')
        throw err
      } finally {
        this.loading = false
      }
    },

    /**
     * Create a material price
     */
    async createMaterialPrice(slug: string, data: MaterialPriceForm) {
      const { $api } = useNuxtApp()
      const created = await $api<MaterialPrice>(API.shopMaterialPrices(slug), {
        method: 'POST',
        body: data,
      })
      this.materialPrices.push(created)
      return created
    },

    /**
     * Update a material price
     */
    async updateMaterialPrice(slug: string, pk: number, data: Partial<MaterialPriceForm>) {
      const { $api } = useNuxtApp()
      const updated = await $api<MaterialPrice>(API.shopMaterialPriceDetail(slug, pk), {
        method: 'PATCH',
        body: data,
      })
      const index = this.materialPrices.findIndex((p) => p.id === pk)
      if (index !== -1) {
        this.materialPrices[index] = updated
      }
      return updated
    },

    /**
     * Delete a material price
     */
    async deleteMaterialPrice(slug: string, pk: number) {
      const { $api } = useNuxtApp()
      await $api(API.shopMaterialPriceDetail(slug, pk), { method: 'DELETE' })
      this.materialPrices = this.materialPrices.filter((p) => p.id !== pk)
    },

    /**
     * Fetch all finishing services for a shop
     */
    async fetchFinishingServices(slug: string) {
      this.loading = true
      try {
        const { $api } = useNuxtApp()
        this.finishingServices = await $api<FinishingService[]>(API.shopFinishingServices(slug))
      } catch (err: unknown) {
        this.error = parseApiError(err, 'Failed')
        throw err
      } finally {
        this.loading = false
      }
    },

    /**
     * Create a finishing service
     */
    async createFinishingService(slug: string, data: FinishingServiceForm) {
      const { $api } = useNuxtApp()
      const created = await $api<FinishingService>(API.shopFinishingServices(slug), {
        method: 'POST',
        body: data,
      })
      this.finishingServices.push(created)
      return created
    },

    /**
     * Update a finishing service
     */
    async updateFinishingService(slug: string, pk: number, data: Partial<FinishingServiceForm>) {
      const { $api } = useNuxtApp()
      const updated = await $api<FinishingService>(API.shopFinishingServiceDetail(slug, pk), {
        method: 'PATCH',
        body: data,
      })
      const index = this.finishingServices.findIndex((s) => s.id === pk)
      if (index !== -1) {
        this.finishingServices[index] = updated
      }
      return updated
    },

    /**
     * Delete a finishing service
     */
    async deleteFinishingService(slug: string, pk: number) {
      const { $api } = useNuxtApp()
      await $api(API.shopFinishingServiceDetail(slug, pk), { method: 'DELETE' })
      this.finishingServices = this.finishingServices.filter((s) => s.id !== pk)
    },

    /**
     * Fetch all volume discounts for a shop
     */
    async fetchVolumeDiscounts(slug: string) {
      this.loading = true
      try {
        const { $api } = useNuxtApp()
        this.volumeDiscounts = await $api<VolumeDiscount[]>(API.shopVolumeDiscounts(slug))
      } catch (err: unknown) {
        this.error = parseApiError(err, 'Failed')
        throw err
      } finally {
        this.loading = false
      }
    },

    /**
     * Create a volume discount
     */
    async createVolumeDiscount(slug: string, data: VolumeDiscountForm) {
      const { $api } = useNuxtApp()
      const created = await $api<VolumeDiscount>(API.shopVolumeDiscounts(slug), {
        method: 'POST',
        body: data,
      })
      this.volumeDiscounts.push(created)
      return created
    },

    /**
     * Update a volume discount
     */
    async updateVolumeDiscount(slug: string, pk: number, data: Partial<VolumeDiscountForm>) {
      const { $api } = useNuxtApp()
      const updated = await $api<VolumeDiscount>(API.shopVolumeDiscountDetail(slug, pk), {
        method: 'PATCH',
        body: data,
      })
      const index = this.volumeDiscounts.findIndex((d) => d.id === pk)
      if (index !== -1) {
        this.volumeDiscounts[index] = updated
      }
      return updated
    },

    /**
     * Delete a volume discount
     */
    async deleteVolumeDiscount(slug: string, pk: number) {
      const { $api } = useNuxtApp()
      await $api(API.shopVolumeDiscountDetail(slug, pk), { method: 'DELETE' })
      this.volumeDiscounts = this.volumeDiscounts.filter((d) => d.id !== pk)
    },

    /**
     * Clear all pricing data
     */
    clearPricing() {
      this.rateCard = null
      this.printingPrices = []
      this.paperPrices = []
      this.materialPrices = []
      this.finishingServices = []
      this.volumeDiscounts = []
      this.calculationResult = null
      this.error = null
    },

    /**
     * Fetch default pricing templates (read-only)
     */
    async fetchPricingDefaults() {
      const { $api } = useNuxtApp()
      try {
        const [printing, papers, materials, finishing] = await Promise.all([
          $api<DefaultPrintingPriceTemplate[]>(API.pricingDefaultsPrinting()),
          $api<DefaultPaperPriceTemplate[]>(API.pricingDefaultsPapers()),
          $api<DefaultMaterialPriceTemplate[]>(API.pricingDefaultsMaterials()),
          $api<DefaultFinishingServiceTemplate[]>(API.pricingDefaultsFinishing()),
        ])
        this.defaultPrinting = printing ?? []
        this.defaultPapers = papers ?? []
        this.defaultMaterials = materials ?? []
        this.defaultFinishing = finishing ?? []
      } catch (err: unknown) {
        this.error = parseApiError(err, 'Failed to fetch defaults')
        throw err
      }
    },

    /**
     * Seed shop with default pricing (POST)
     */
    async seedShopDefaults(slug: string) {
      const { $api } = useNuxtApp()
      await $api(API.shopPricingSeedDefaults(slug), { method: 'POST' })
      await Promise.all([
        this.fetchPrintingPrices(slug),
        this.fetchPaperPrices(slug),
        this.fetchMaterialPrices(slug),
        this.fetchFinishingServices(slug),
        this.fetchVolumeDiscounts(slug),
      ])
    },

    /**
     * Fetch shop pricing status (if backend provides)
     */
    async fetchPricingStatus(slug: string) {
      try {
        const { $api } = useNuxtApp()
        return await $api<{ has_pricing: boolean; needs_review: boolean }>(API.shopPricingStatus(slug))
      } catch {
        return null
      }
    },

  },
})
