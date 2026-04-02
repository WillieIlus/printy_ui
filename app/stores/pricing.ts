import { defineStore } from 'pinia'
import { API } from '~/shared/api-paths'
import { parseApiError } from '~/utils/api-error'
import type { FinishingCategory,
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
  DefaultFinishingServiceTemplate } from '~/shared/types'


/** Backend printing-rates API response (per machine) */
interface PrintingRateApiResponse {
  id: number
  sheet_size: string
  color_mode: string
  single_price: string
  double_price?: string | null
  duplex_surcharge?: string
  duplex_surcharge_enabled?: boolean
  duplex_surcharge_min_gsm?: number | null
  is_active: boolean
  is_default?: boolean
}

function mapPrintingRateToPrice(r: PrintingRateApiResponse, machineId: number): PrintingPrice {
  return {
    id: r.id,
    machine: machineId,
    sheet_size: r.sheet_size as PrintingPrice['sheet_size'],
    color_mode: r.color_mode as PrintingPrice['color_mode'],
    selling_price_per_side: String(r.single_price),
    selling_price_duplex_per_sheet: r.double_price ? String(r.double_price) : undefined,
    duplex_surcharge: r.duplex_surcharge ? String(r.duplex_surcharge) : '0',
    duplex_surcharge_enabled: Boolean(r.duplex_surcharge_enabled),
    duplex_surcharge_min_gsm: r.duplex_surcharge_min_gsm ?? null,
    buying_price_per_side: null,
    profit_per_side: String(r.single_price),
    is_active: r.is_active,
  }
}

/** Backend finishing-rates API response */
interface FinishingRateApiResponse {
  id: number
  name: string
  category: number | null
  category_detail?: { slug: string; name: string; description?: string }
  charge_unit: string
  billing_basis: string
  side_mode: string
  price: string
  double_side_price?: string | null
  setup_fee?: string | null
  min_qty?: number | null
  minimum_charge?: string | null
  display_unit_label?: string
  help_text?: string
  is_active: boolean
}

function mapFinishingRateToService(r: FinishingRateApiResponse): FinishingService {
  const categorySlug = r.category_detail?.slug?.toUpperCase() ?? 'OTHER'
  return {
    id: r.id,
    name: r.name,
    category: categorySlug as FinishingService['category'],
    charge_unit: r.charge_unit as FinishingService['charge_unit'],
    billing_basis: r.billing_basis as FinishingService['billing_basis'],
    side_mode: r.side_mode as FinishingService['side_mode'],
    price: String(r.price),
    double_side_price: r.double_side_price ?? null,
    setup_fee: r.setup_fee ?? null,
    minimum_charge: r.minimum_charge ?? null,
    min_qty: r.min_qty ?? null,
    display_unit_label: r.display_unit_label ?? '',
    help_text: r.help_text ?? '',
    is_active: r.is_active,
  }
}

async function resolveCategoryId(category: FinishingCategory): Promise<number | null> {
  const { $api } = useNuxtApp()
  const data = await $api<{ id: number; slug: string }[] | { results: { id: number; slug: string }[] }>(
    API.finishingCategories()
  )
  const list = Array.isArray(data) ? data : (data as { results?: { id: number; slug: string }[] })?.results ?? []
  const slug = category.toLowerCase()
  const found = list.find((c) => c.slug === slug)
  return found?.id ?? null
}

/** Backend Paper API response (papers/) */
interface PaperApiResponse {
  id: number
  sheet_size: string
  gsm: number
  paper_type: string
  buying_price: string
  selling_price: string
  is_active: boolean
}

function mapPaperToPaperPrice(p: PaperApiResponse): PaperPrice {
  const buy = parseFloat(p.buying_price) || 0
  const sell = parseFloat(p.selling_price) || 0
  const profit = Math.max(0, sell - buy)
  const marginPercent = sell > 0 ? ((profit / sell) * 100).toFixed(2) : '0'
  return {
    id: p.id,
    sheet_size: p.sheet_size as PaperPrice['sheet_size'],
    gsm: p.gsm,
    paper_type: p.paper_type as PaperPrice['paper_type'],
    buying_price: p.buying_price,
    selling_price: p.selling_price,
    profit: String(profit),
    margin_percent: marginPercent,
    is_active: p.is_active,
  }
}

/** Backend Material API response (materials/) */
interface MaterialApiResponse {
  id: number
  material_type: string
  unit: string
  buying_price: string
  selling_price: string
  is_active: boolean
}

function mapMaterialToMaterialPrice(m: MaterialApiResponse): MaterialPrice {
  const name = m.material_type ? m.material_type.charAt(0).toUpperCase() + m.material_type.slice(1).toLowerCase() : ''
  return {
    id: m.id,
    material_type: (m.material_type?.toUpperCase() ?? 'BANNER') as MaterialPrice['material_type'],
    unit: (m.unit ?? 'SQM') as MaterialPrice['unit'],
    selling_price: m.selling_price,
    buying_price: m.buying_price ?? null,
    is_active: m.is_active,
    material_name: name || m.material_type,
  }
}

function mapFinishingServiceFormToApi(
  data: FinishingServiceForm | Partial<FinishingServiceForm>,
  categoryId?: number | null
): Record<string, unknown> {
  const body: Record<string, unknown> = {
    name: data.name,
    charge_unit: data.charge_unit,
    billing_basis: data.billing_basis,
    side_mode: data.side_mode,
    price: data.price,
    double_side_price: data.double_side_price ?? null,
    setup_fee: data.setup_fee ?? null,
    minimum_charge: data.minimum_charge ?? null,
    min_qty: data.min_qty ?? null,
    help_text: data.help_text ?? '',
    is_active: true,
  }
  if (categoryId != null) body.category = categoryId
  return body
}

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
        const { $publicApi } = useNuxtApp()
        this.rateCard = await $publicApi<RateCard>(API.shopRateCard(slug))
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
     * Fetch all printing prices for a shop (aggregates from machines' printing-rates)
     */
    async fetchPrintingPrices(slug: string) {
      this.loading = true
      try {
        const { $api } = useNuxtApp()
        const machines = await $api<{ id: number }[] | { results: { id: number }[] }>(API.shopMachines(slug))
        const list = Array.isArray(machines) ? machines : (machines as { results?: { id: number }[] })?.results ?? []
        const all: PrintingPrice[] = []
        for (const m of list) {
          const rawRates = await $api<PrintingRateApiResponse[] | { results?: PrintingRateApiResponse[] }>(API.sellerMachinePrintingRates(m.id))
          const rates = Array.isArray(rawRates) ? rawRates : (rawRates as { results?: PrintingRateApiResponse[] })?.results ?? []
          for (const r of rates) {
            all.push(mapPrintingRateToPrice(r, m.id))
          }
        }
        this.printingPrices = all
      } catch (err: unknown) {
        this.error = parseApiError(err, 'Failed')
        throw err
      } finally {
        this.loading = false
      }
    },

    /**
     * Create a printing price (uses machines/<id>/printing-rates/)
     */
    async createPrintingPrice(_slug: string, data: PrintingPriceForm) {
      const { $api } = useNuxtApp()
      const payload = {
        sheet_size: data.sheet_size,
        color_mode: data.color_mode,
        single_price: data.selling_price_per_side,
        double_price: data.selling_price_duplex_per_sheet ?? null,
        duplex_surcharge: data.duplex_surcharge ?? '0',
        duplex_surcharge_enabled: data.duplex_surcharge_enabled ?? false,
        duplex_surcharge_min_gsm: data.duplex_surcharge_min_gsm ?? null,
      }
      const created = await $api<PrintingRateApiResponse>(API.sellerMachinePrintingRates(data.machine), {
        method: 'POST',
        body: payload,
      })
      const mapped = mapPrintingRateToPrice(created, data.machine)
      this.printingPrices.push(mapped)
      return mapped
    },

    /**
     * Update a printing price (uses machines/<id>/printing-rates/<pk>/)
     */
    async updatePrintingPrice(_slug: string, pk: number, data: Partial<PrintingPriceForm>) {
      const { $api } = useNuxtApp()
      const price = this.printingPrices.find((p) => p.id === pk)
      if (!price) throw new Error('Printing price not found')
      const payload: Record<string, unknown> = {}
      if (data.sheet_size != null) payload.sheet_size = data.sheet_size
      if (data.color_mode != null) payload.color_mode = data.color_mode
      if (data.selling_price_per_side != null) payload.single_price = data.selling_price_per_side
      if (data.selling_price_duplex_per_sheet !== undefined) payload.double_price = data.selling_price_duplex_per_sheet || null
      if (data.duplex_surcharge != null) payload.duplex_surcharge = data.duplex_surcharge
      if (data.duplex_surcharge_enabled !== undefined) payload.duplex_surcharge_enabled = data.duplex_surcharge_enabled
      if (data.duplex_surcharge_min_gsm !== undefined) payload.duplex_surcharge_min_gsm = data.duplex_surcharge_min_gsm ?? null
      const updated = await $api<PrintingRateApiResponse>(
        API.sellerMachinePrintingRateDetail(price.machine, pk),
        { method: 'PATCH', body: payload }
      )
      const index = this.printingPrices.findIndex((p) => p.id === pk)
      if (index !== -1) {
        this.printingPrices[index] = mapPrintingRateToPrice(updated, price.machine)
      }
      return this.printingPrices[index]
    },

    /**
     * Delete a printing price (uses machines/<id>/printing-rates/<pk>/)
     */
    async deletePrintingPrice(_slug: string, pk: number) {
      const { $api } = useNuxtApp()
      const price = this.printingPrices.find((p) => p.id === pk)
      if (!price) throw new Error('Printing price not found')
      await $api(API.sellerMachinePrintingRateDetail(price.machine, pk), { method: 'DELETE' })
      this.printingPrices = this.printingPrices.filter((p) => p.id !== pk)
    },

    /**
     * Fetch all paper prices for a shop (uses papers/ API)
     */
    async fetchPaperPrices(slug: string) {
      this.loading = true
      try {
        const { $api } = useNuxtApp()
        const raw = await $api<PaperApiResponse[] | { results?: PaperApiResponse[] }>(API.shopPaper(slug))
        const list = Array.isArray(raw) ? raw : (raw as { results?: PaperApiResponse[] })?.results ?? []
        this.paperPrices = list.map(mapPaperToPaperPrice)
      } catch (err: unknown) {
        this.error = parseApiError(err, 'Failed')
        throw err
      } finally {
        this.loading = false
      }
    },

    /**
     * Create a paper price (uses papers/ API)
     */
    async createPaperPrice(slug: string, data: PaperPriceForm) {
      const { $api } = useNuxtApp()
      const created = await $api<PaperApiResponse>(API.shopPaper(slug), {
        method: 'POST',
        body: data,
      })
      const mapped = mapPaperToPaperPrice(created)
      this.paperPrices.push(mapped)
      return mapped
    },

    /**
     * Update a paper price (uses papers/ API)
     */
    async updatePaperPrice(slug: string, pk: number, data: Partial<PaperPriceForm>) {
      const { $api } = useNuxtApp()
      const updated = await $api<PaperApiResponse>(API.shopPaperDetail(slug, pk), {
        method: 'PATCH',
        body: data,
      })
      const index = this.paperPrices.findIndex((p) => p.id === pk)
      if (index !== -1) {
        this.paperPrices[index] = mapPaperToPaperPrice(updated)
      }
      return this.paperPrices[index]
    },

    /**
     * Delete a paper price (uses papers/ API)
     */
    async deletePaperPrice(slug: string, pk: number) {
      const { $api } = useNuxtApp()
      await $api(API.shopPaperDetail(slug, pk), { method: 'DELETE' })
      this.paperPrices = this.paperPrices.filter((p) => p.id !== pk)
    },

    /**
     * Fetch all material prices for a shop (uses materials/ API)
     */
    async fetchMaterialPrices(slug: string) {
      this.loading = true
      try {
        const { $api } = useNuxtApp()
        const raw = await $api<MaterialApiResponse[] | { results?: MaterialApiResponse[] }>(API.shopMaterialPrices(slug))
        const list = Array.isArray(raw) ? raw : (raw as { results?: MaterialApiResponse[] })?.results ?? []
        this.materialPrices = list.map(mapMaterialToMaterialPrice)
      } catch (err: unknown) {
        this.error = parseApiError(err, 'Failed')
        throw err
      } finally {
        this.loading = false
      }
    },

    /**
     * Create a material price (uses materials/ API)
     */
    async createMaterialPrice(slug: string, data: MaterialPriceForm) {
      const { $api } = useNuxtApp()
      const payload = {
        material_type: data.material_type,
        unit: data.unit,
        selling_price: data.selling_price,
        buying_price: data.buying_price ?? null,
        is_active: data.is_active ?? true,
      }
      const created = await $api<MaterialApiResponse>(API.shopMaterialPrices(slug), {
        method: 'POST',
        body: payload,
      })
      const mapped = mapMaterialToMaterialPrice(created)
      this.materialPrices.push(mapped)
      return mapped
    },

    /**
     * Update a material price (uses materials/ API)
     */
    async updateMaterialPrice(slug: string, pk: number, data: Partial<MaterialPriceForm>) {
      const { $api } = useNuxtApp()
      const payload: Record<string, unknown> = {}
      if (data.material_type != null) payload.material_type = data.material_type
      if (data.unit != null) payload.unit = data.unit
      if (data.selling_price != null) payload.selling_price = data.selling_price
      if (data.buying_price !== undefined) payload.buying_price = data.buying_price ?? null
      if (data.is_active !== undefined) payload.is_active = data.is_active
      const updated = await $api<MaterialApiResponse>(API.shopMaterialPriceDetail(slug, pk), {
        method: 'PATCH',
        body: payload,
      })
      const index = this.materialPrices.findIndex((p) => p.id === pk)
      if (index !== -1) {
        this.materialPrices[index] = mapMaterialToMaterialPrice(updated)
      }
      return this.materialPrices[index]
    },

    /**
     * Delete a material price (uses materials/ API)
     */
    async deleteMaterialPrice(slug: string, pk: number) {
      const { $api } = useNuxtApp()
      await $api(API.shopMaterialPriceDetail(slug, pk), { method: 'DELETE' })
      this.materialPrices = this.materialPrices.filter((p) => p.id !== pk)
    },

    /**
     * Fetch all finishing services for a shop (uses finishing-rates API)
     */
    async fetchFinishingServices(slug: string) {
      this.loading = true
      try {
        const { $api } = useNuxtApp()
        const rawData = await $api<FinishingRateApiResponse[] | { results?: FinishingRateApiResponse[] }>(API.shopFinishingServices(slug))
        const raw = Array.isArray(rawData) ? rawData : (rawData as { results?: FinishingRateApiResponse[] })?.results ?? []
        this.finishingServices = raw.map(mapFinishingRateToService)
      } catch (err: unknown) {
        this.error = parseApiError(err, 'Failed')
        throw err
      } finally {
        this.loading = false
      }
    },

    /**
     * Create a finishing service (uses finishing-rates API)
     */
    async createFinishingService(slug: string, data: FinishingServiceForm) {
      const { $api } = useNuxtApp()
      const categoryId = data.category ? await resolveCategoryId(data.category) : null
      const payload = mapFinishingServiceFormToApi(data, categoryId)
      const created = await $api<FinishingRateApiResponse>(API.shopFinishingServices(slug), {
        method: 'POST',
        body: payload,
      })
      this.finishingServices.push(mapFinishingRateToService(created))
      return this.finishingServices[this.finishingServices.length - 1]
    },

    /**
     * Update a finishing service (uses finishing-rates API)
     */
    async updateFinishingService(slug: string, pk: number, data: Partial<FinishingServiceForm>) {
      const { $api } = useNuxtApp()
      const categoryId = data.category ? await resolveCategoryId(data.category) : undefined
      const payload = mapFinishingServiceFormToApi(data, categoryId)
      const updated = await $api<FinishingRateApiResponse>(API.shopFinishingServiceDetail(slug, pk), {
        method: 'PATCH',
        body: payload,
      })
      const index = this.finishingServices.findIndex((s) => s.id === pk)
      if (index !== -1) {
        this.finishingServices[index] = mapFinishingRateToService(updated)
      }
      return this.finishingServices[index]
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
