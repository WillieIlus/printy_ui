import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'
import { API } from '~/shared/api-paths'
import { normalizeApiList, getApiErrorMessage } from '~/shared/api'
import type {
  ArtworkWorkflow,
  CanonicalJobResult,
  JobOverrideRequest,
  JobOverrideResult,
  ManagerClientLinkResult,
  ManagerClientLinkStatus,
  ManagerClientRequestResult,
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
  ServerListMeta,
} from '~/shared/types'
import { FUNNEL_EVENTS, trackFunnel } from '~/shared/funnel'

interface ShopOptionResult extends ManagerPricingShop {
  shop_id: number
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
    activeJobCanonical: null as CanonicalJobResult | null,
    overridePreview: null as JobOverrideResult | null,
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
        this.markReadLocally('quotes', id, this.activeQuote)
        return this.activeQuote
      } catch (error) {
        this.error = getApiErrorMessage(error, "We couldn't load that quote.")
        return null
      } finally {
        this.detailLoading = false
      }
    },
    /* law 7.11 — opening a row fetches its detail, which marks it read for this
       viewer on the backend. Mirror that cleared state onto the list row so the
       unread marker disappears without losing the row's group or attention flag. */
    markReadLocally(collection: 'quotes' | 'jobs', id: number, source: ServerListMeta | null) {
      const list = collection === 'quotes' ? this.quotes : this.jobs
      const row = list.find((item) => item.id === id)
      if (!row) return
      row.unread = source?.unread ?? false
      row.viewer_read_at = source?.viewer_read_at ?? row.viewer_read_at ?? null
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
    async prepare(id: number, body: { shop: number; pricing_snapshot: Record<string, unknown>; markup_pct: number | string }) {
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
        trackFunnel(FUNNEL_EVENTS.QUOTE_SENT, { quote_id: id })
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
    /* law 10.5 — add a client inside request creation. A manager enters the
       client's name and phone and confirms the client permits contact; the
       request is recorded as originated by the manager. */
    async createClientRequest(body: {
      name: string
      phone: string
      contact_permitted: boolean
      email?: string
      company?: string
      notes?: string
      delivery_preference?: string
      details?: Record<string, unknown>
    }) {
      const { api } = useApi()
      this.saving = true
      this.error = ''
      try {
        return await api<ManagerClientRequestResult>(API.clientPortal.managerCreateRequest, {
          method: 'POST',
          body,
        })
      } catch (error) {
        this.error = getApiErrorMessage(error, "We couldn't create that client's request.")
        return null
      } finally {
        this.saving = false
      }
    },
    /* law 10.6 — create (or replace) the signed single-job link and deliver it.
       Calling this again is the manager's "resend". */
    async createClientLink(id: number) {
      const { api } = useApi()
      this.saving = true
      this.error = ''
      try {
        return await api<ManagerClientLinkResult>(API.clientPortal.managerLink(id), { method: 'POST', body: {} })
      } catch (error) {
        this.error = getApiErrorMessage(error, "We couldn't create the client link.")
        return null
      } finally {
        this.saving = false
      }
    },
    /* law 10.6 — read the current link's status (sent/viewed/expired/revoked)
       from backend fields; nothing is derived client-side. */
    async fetchClientLinkStatus(id: number) {
      const { api } = useApi()
      try {
        return await api<ManagerClientLinkStatus>(API.clientPortal.managerLink(id))
      } catch {
        return null
      }
    },
    async revokeClientLink(linkId: number) {
      const { api } = useApi()
      this.saving = true
      this.error = ''
      try {
        return await api<{ detail: string; link_id: number; revoked_at: string }>(
          API.clientPortal.managerRevokeLink(linkId),
          { method: 'POST', body: {} },
        )
      } catch (error) {
        this.error = getApiErrorMessage(error, "We couldn't revoke the client link.")
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
        this.activeJobCanonical = (payload as ManagerJobDetailPayload).canonical ?? null
        this.markReadLocally('jobs', id, this.activeJob)
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
    async artworkWorkflow(
      id: number,
      action: 'manager_accept' | 'manager_holds' | 'manager_decline',
      body: { note?: string; reason?: string } = {},
    ) {
      const { api } = useApi()
      this.saving = true
      this.error = ''
      try {
        const payload = await api<{ artwork_workflow: ArtworkWorkflow }>(
          API.managedJobs.artworkWorkflow(id),
          { method: 'POST', body: { action, ...body } },
        )
        const row = this.jobs.find((job) => job.id === id)
        if (row && payload?.artwork_workflow) row.artwork_workflow = payload.artwork_workflow
        if (this.activeJob?.id === id && payload?.artwork_workflow) {
          this.activeJob.artwork_workflow = payload.artwork_workflow
        }
        return true
      } catch (error) {
        this.error = getApiErrorMessage(error, "We couldn't update the artwork status.")
        return false
      } finally {
        this.saving = false
      }
    },
    async previewJobOverride(id: number, body: JobOverrideRequest) {
      const { api } = useApi()
      this.saving = true
      this.error = ''
      try {
        this.overridePreview = await api<JobOverrideResult>(API.partner.jobOverridePreview(id), {
          method: 'POST',
          body,
        })
        return this.overridePreview
      } catch (error) {
        this.error = getApiErrorMessage(error, "We couldn't preview that adjustment.")
        return null
      } finally {
        this.saving = false
      }
    },
    async saveJobOverride(id: number, body: JobOverrideRequest) {
      const { api } = useApi()
      this.saving = true
      this.error = ''
      try {
        const result = await api<JobOverrideResult>(API.partner.jobOverride(id), { method: 'POST', body })
        if (result?.manager) {
          this.activeJobCanonical = result.manager
        }
        return result
      } catch (error) {
        this.error = getApiErrorMessage(error as Error, "We couldn't save that adjustment.")
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
