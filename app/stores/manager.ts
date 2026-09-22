import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'
import { API } from '~/shared/api-paths'
import { normalizeApiList, getApiErrorMessage } from '~/shared/api'
import type {
  ManagerDispatchResult,
  ManagerJobDetailPayload,
  ManagerJobRow,
  ManagerMarketRate,
  ManagerPricingShop,
  ManagerQuotePrefill,
  ManagerQuotePricingPreview,
  ManagerQuoteRow,
  ManagerPrepareResult,
  ManagerSendToClientResult,
  PartnerClientRow,
  PartnerProductionShopRow,
  PartnerProfileRecord,
} from '~/shared/types'

interface ShopOptionResult extends ManagerPricingShop {
  shop_id: number
  preview_snapshot?: Record<string, unknown> | null
}

interface ShopOptionsResponse {
  product_type?: string
  summary?: string
  missing_fields?: string[]
  results?: ShopOptionResult[]
  matched_count?: number
  results_count?: number
  pricing_snapshot?: Record<string, unknown> | null
  spec_snapshot?: Record<string, unknown> | null
}

/**
 * Print-manager (partner) quote-prep workspace.
 *
 * Managers broker a client's quote request to production shops, preview the
 * margin, then prepare and send the priced offer back to the client.
 */
export const useManagerStore = defineStore('manager', {
  state: () => ({
    quotes: [] as ManagerQuoteRow[],
    activeQuote: null as ManagerQuoteRow | null,
    prefill: null as ManagerQuotePrefill | null,
    shopOptions: null as ShopOptionsResponse | null,
    pricingPreview: null as ManagerQuotePricingPreview | null,
    marketRates: [] as ManagerMarketRate[],
    profile: null as PartnerProfileRecord | null,
    defaultMarkupRate: 0.75 as number,
    jobs: [] as ManagerJobRow[],
    activeJob: null as ManagerJobRow | null,
    activeJobSettlement: null as Record<string, unknown> | null,
    clients: [] as PartnerClientRow[],
    productionShops: [] as PartnerProductionShopRow[],
    loading: false,
    detailLoading: false,
    saving: false,
    error: '' as string,
  }),
  getters: {
    hasQuotes: (state) => state.quotes.length > 0,
    hasJobs: (state) => state.jobs.length > 0,
    dispatchableJobs: (state): ManagerJobRow[] =>
      state.jobs.filter((job) => job.payment_confirmed && !job.dispatched_at),
    eligibleShops: (state): ManagerPricingShop[] =>
      (state.pricingPreview?.eligible_shops ?? state.shopOptions?.results ?? []).filter(
        (shop) => shop.eligible !== false,
      ),
  },
  actions: {
    async fetchQuotes() {
      const { api } = useApi()
      this.loading = true
      this.error = ''
      try {
        const payload = await api<{ results?: ManagerQuoteRow[] } | ManagerQuoteRow[]>(API.partner.quotes)
        this.quotes = normalizeApiList(payload) as ManagerQuoteRow[]
      } catch (error) {
        this.error = getApiErrorMessage(error, "We couldn't load the quote workload.")
      } finally {
        this.loading = false
      }
    },
    async fetchQuote(id: number) {
      const { api } = useApi()
      this.detailLoading = true
      this.error = ''
      try {
        const payload = await api<{ quote?: ManagerQuoteRow } | ManagerQuoteRow>(API.partner.quote(id))
        const row = (payload && !Array.isArray(payload) && 'quote' in payload ? payload.quote : payload) as ManagerQuoteRow
        this.activeQuote = row ?? null
        return this.activeQuote
      } catch (error) {
        this.error = getApiErrorMessage(error, "We couldn't load that quote.")
        return null
      } finally {
        this.detailLoading = false
      }
    },
    async fetchPrefill(id: number) {
      const { api } = useApi()
      this.error = ''
      try {
        this.prefill = await api<ManagerQuotePrefill>(API.partner.prefill(id))
        return this.prefill
      } catch (error) {
        this.error = getApiErrorMessage(error, "We couldn't load the request details.")
        return null
      }
    },
    async fetchShopOptions(id: number, body: Record<string, unknown> = {}) {
      const { api } = useApi()
      this.saving = true
      this.error = ''
      try {
        this.shopOptions = await api<ShopOptionsResponse>(API.partner.shopOptions(id), {
          method: 'POST',
          body,
        })
        return this.shopOptions
      } catch (error) {
        this.error = getApiErrorMessage(error, "We couldn't fetch production options.")
        return null
      } finally {
        this.saving = false
      }
    },
    async previewPricing(id: number, body: Record<string, unknown>) {
      const { api } = useApi()
      this.saving = true
      this.error = ''
      try {
        this.pricingPreview = await api<ManagerQuotePricingPreview>(API.partner.previewPricing(id), {
          method: 'POST',
          body,
        })
        return this.pricingPreview
      } catch (error) {
        this.error = getApiErrorMessage(error, "We couldn't calculate the margin.")
        return null
      } finally {
        this.saving = false
      }
    },
    async prepare(id: number, body: { shop: number; pricing_snapshot: Record<string, unknown>; partner_markup: number | string }) {
      const { api } = useApi()
      this.saving = true
      this.error = ''
      try {
        const result = await api<ManagerPrepareResult>(API.partner.prepare(id), { method: 'POST', body })
        return result
      } catch (error) {
        this.error = getApiErrorMessage(error, "We couldn't prepare the quote.")
        return null
      } finally {
        this.saving = false
      }
    },
    async sendToClient(id: number, body: Record<string, unknown> = {}) {
      const { api } = useApi()
      this.saving = true
      this.error = ''
      try {
        const result = await api<ManagerSendToClientResult>(API.partner.sendToClient(id), {
          method: 'POST',
          body,
        })
        const row = this.quotes.find((quote) => quote.id === id)
        if (row) row.status = 'sent'
        return result
      } catch (error) {
        this.error = getApiErrorMessage(error, "We couldn't send the quote to the client.")
        return null
      } finally {
        this.saving = false
      }
    },
    async attachClient(id: number, body: Record<string, unknown>) {
      const { api } = useApi()
      this.saving = true
      this.error = ''
      try {
        return await api(API.partner.attachClient(id), { method: 'POST', body })
      } catch (error) {
        this.error = getApiErrorMessage(error, "We couldn't attach the offline client.")
        return null
      } finally {
        this.saving = false
      }
    },
    async fetchMarketRates() {
      const { api } = useApi()
      this.error = ''
      try {
        const payload = await api<{ results?: ManagerMarketRate[]; default_markup_rate?: string | number | null } | ManagerMarketRate[]>(API.partner.marketRates)
        this.marketRates = normalizeApiList(payload) as ManagerMarketRate[]
        const rate = payload && !Array.isArray(payload) ? Number(payload.default_markup_rate) : NaN
        if (Number.isFinite(rate)) {
          this.defaultMarkupRate = rate
        }
      } catch (error) {
        this.error = getApiErrorMessage(error, "We couldn't load market rates.")
      }
    },
    async fetchProfile() {
      const { api } = useApi()
      this.error = ''
      try {
        const payload = await api<PartnerProfileRecord>(API.partner.profile)
        this.profile = payload ?? null
        const rate = Number(payload?.default_markup_rate)
        if (Number.isFinite(rate)) {
          this.defaultMarkupRate = rate
        }
      } catch (error) {
        this.error = getApiErrorMessage(error, "We couldn't load your manager profile.")
      }
    },
    async saveDefaultMarkup(rate: number) {
      const { api } = useApi()
      this.saving = true
      this.error = ''
      try {
        const payload = await api<PartnerProfileRecord>(API.partner.profile, {
          method: 'PATCH',
          body: { default_markup_rate: (Number(rate) / 100).toFixed(4) },
        })
        const saved = Number(payload?.default_markup_rate)
        if (Number.isFinite(saved)) {
          this.defaultMarkupRate = saved
        }
        return payload
      } catch (error) {
        this.error = getApiErrorMessage(error, "We couldn't save your default markup.")
        return null
      } finally {
        this.saving = false
      }
    },
    async fetchJobs() {
      const { api } = useApi()
      this.loading = true
      this.error = ''
      try {
        const payload = await api<{ results?: ManagerJobRow[] } | ManagerJobRow[]>(API.partner.jobs)
        this.jobs = normalizeApiList(payload) as ManagerJobRow[]
        return this.jobs
      } catch (error) {
        this.error = getApiErrorMessage(error, "We couldn't load jobs in progress.")
        return []
      } finally {
        this.loading = false
      }
    },
    async fetchJob(id: number) {
      const { api } = useApi()
      this.detailLoading = true
      this.error = ''
      try {
        const payload = await api<ManagerJobDetailPayload | ManagerJobRow>(API.partner.job(id))
        const row = (payload && !Array.isArray(payload) && 'job' in payload ? payload.job : payload) as ManagerJobRow
        this.activeJob = row ?? null
        this.activeJobSettlement = (payload as ManagerJobDetailPayload).settlement ?? null
        return this.activeJob
      } catch (error) {
        this.error = getApiErrorMessage(error, "We couldn't load that job.")
        return null
      } finally {
        this.detailLoading = false
      }
    },
    async dispatchJob(id: number) {
      const { api } = useApi()
      this.saving = true
      this.error = ''
      try {
        const result = await api<ManagerDispatchResult>(API.partner.dispatch(id), { method: 'POST' })
        const row = this.jobs.find((job) => job.id === id)
        if (row && result?.dispatched) {
          row.dispatched_at = result.dispatched_at ?? null
          row.assignment_status = result.assignment_status ?? row.assignment_status
          row.assigned_shop_name = result.shop_name ?? row.assigned_shop_name
        }
        return result
      } catch (error) {
        this.error = getApiErrorMessage(error as Error, "We couldn't dispatch that job.")
        return null
      } finally {
        this.saving = false
      }
    },
    async fetchClients(search = '') {
      const { api } = useApi()
      this.loading = true
      this.error = ''
      try {
        const payload = await api<{ results?: PartnerClientRow[] } | PartnerClientRow[]>(API.partner.clients, {
          query: search ? { search } : undefined,
        })
        this.clients = normalizeApiList(payload) as PartnerClientRow[]
        return this.clients
      } catch (error) {
        this.error = getApiErrorMessage(error, "We couldn't load your clients.")
        return []
      } finally {
        this.loading = false
      }
    },
    async createClient(body: { name: string; phone?: string; email?: string; company?: string }) {
      const { api } = useApi()
      this.saving = true
      this.error = ''
      try {
        const created = await api<PartnerClientRow>(API.partner.clients, { method: 'POST', body })
        this.clients.unshift(created)
        return created
      } catch (error) {
        this.error = getApiErrorMessage(error, "We couldn't create that client.")
        return null
      } finally {
        this.saving = false
      }
    },
    async fetchProductionShops() {
      const { api } = useApi()
      this.loading = true
      this.error = ''
      try {
        const payload = await api<{ results?: PartnerProductionShopRow[] } | PartnerProductionShopRow[]>(API.partner.productionShops)
        this.productionShops = normalizeApiList(payload) as PartnerProductionShopRow[]
        return this.productionShops
      } catch (error) {
        this.error = getApiErrorMessage(error, "We couldn't load production shops.")
        return []
      } finally {
        this.loading = false
      }
    },
  },
})
