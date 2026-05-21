import { API } from '~/shared/api-paths'
import { normalizeApiList } from '~/shared/api'

export async function searchPartnerClients(query = '') {
  const { api } = useApi()
  const results = normalizeApiList(await api<Array<Record<string, any>>>(API.partner.clients))
  const normalizedQuery = String(query || '').trim().toLowerCase()
  if (!normalizedQuery) {
    return results
  }
  return results.filter((client) => {
    const haystack = [
      client.name,
      client.phone,
      client.email,
      client.company,
    ].map(value => String(value || '').toLowerCase()).join(' ')
    return haystack.includes(normalizedQuery)
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

export async function createPartnerQuote(payload: Record<string, any>) {
  const { api } = useApi()
  return api<Record<string, any>>(API.partner.quoteCreate, {
    method: 'POST',
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
  return normalizeApiList(await api<Array<Record<string, any>>>(API.partner.quotes))
}

export async function getPartnerQuoteDetail(id: number | string) {
  const { api } = useApi()
  return api<Record<string, any>>(API.dashboard.partnerQuoteDetail(id))
}

export async function dispatchPartnerJob(jobId: number | string) {
  const { api } = useApi()
  return api<Record<string, any>>(API.dashboard.partnerJobDispatch(jobId), {
    method: 'POST',
  })
}
