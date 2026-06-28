import { API } from '~/shared/api-paths'
import { normalizeApiList } from '~/shared/api'

export async function searchPartnerClients(query = '') {
  const { api } = useApi()
  const normalizedQuery = String(query || '').trim()
  const results = normalizeApiList(await api<Array<Record<string, any>>>(API.partner.clients, {
    query: normalizedQuery ? { search: normalizedQuery } : undefined,
  }))
  if (!normalizedQuery) {
    return results
  }
  const localQuery = normalizedQuery.toLowerCase()
  return results.filter((client) => {
    const haystack = [
      client.name,
      client.email,
    ].map(value => String(value || '').toLowerCase()).join(' ')
    return haystack.includes(localQuery)
  })
}

export async function createPartnerClient(payload: Record<string, any>) {
  const { api } = useApi()
  return api<Record<string, any>>(API.partner.clients, {
    method: 'POST',
    body: payload,
  })
}

export async function previewPartnerQuote(payload: Record<string, any>) {
  const { api } = useApi()
  return api<Record<string, any>>(API.partner.quotePreview, {
    method: 'POST',
    body: payload,
  })
}

export async function fetchPartnerProductionMatches(payload: Record<string, any>) {
  const { api } = useApi()
  return api<Record<string, any>>(API.partner.productionMatches, {
    method: 'POST',
    body: payload,
  })
}

export async function createPartnerQuote(payload: Record<string, any>) {
  const { api } = useApi()
  return api<Record<string, any>>(API.partner.quoteCreate, {
    method: 'POST',
    body: payload,
  })
}

export async function attachPartnerQuoteClient(quoteId: number | string, payload: Record<string, any>) {
  const { api } = useApi()
  return api<Record<string, any>>(API.dashboard.partnerQuoteAttachClient(quoteId), {
    method: 'PATCH',
    body: payload,
  })
}

export async function sendPartnerQuoteToClient(quoteId: number | string, payload: Record<string, any>) {
  const { api } = useApi()
  return api<Record<string, any>>(API.dashboard.partnerQuoteSendToClient(quoteId), {
    method: 'POST',
    body: payload,
  })
}

export async function getPartnerQuotes() {
  const { api } = useApi()
  return normalizeApiList(await api<Array<Record<string, any>>>(API.dashboard.partnerQuotes))
}

export async function getPartnerQuoteDetail(id: number | string) {
  const { api } = useApi()
  return api<Record<string, any>>(API.dashboard.partnerQuoteDetail(id))
}

export async function fetchPartnerMarketRates() {
  const { api } = useApi()
  return api<Record<string, any>>(API.dashboard.partnerMarketRates)
}

export async function updatePartnerDefaultMarkupRate(defaultMarkupRate: string) {
  const { api } = useApi()
  return api<Record<string, any>>(API.dashboard.partnerProfile, {
    method: 'PATCH',
    body: { default_markup_rate: defaultMarkupRate },
  })
}

export async function fetchAssignedRequestShopOptions(requestId: number | string, payload: Record<string, any>) {
  const { api } = useApi()
  return api<Record<string, any>>(API.dashboard.partnerQuoteShopOptions(requestId), {
    method: 'POST',
    body: payload,
  })
}

export async function fetchManagerQuotePrefill(requestId: number | string) {
  const { api } = useApi()
  return api<Record<string, any>>(API.dashboard.managerQuotePrefill(requestId))
}

export async function previewManagerQuotePricing(requestId: number | string, payload: Record<string, any>) {
  const { api } = useApi()
  return api<Record<string, any>>(API.dashboard.managerQuotePreviewPricing(requestId), {
    method: 'POST',
    body: payload,
  })
}

export async function dispatchPartnerJob(jobId: number | string) {
  const { api } = useApi()
  return api<Record<string, any>>(API.dashboard.partnerJobDispatch(jobId), {
    method: 'POST',
  })
}

export async function createAssignedManagerQuote(requestId: number | string, payload: Record<string, any>) {
  const { api } = useApi()
  return api<Record<string, any>>(API.dashboard.partnerQuotePrepare(requestId), {
    method: 'POST',
    body: payload,
  })
}
