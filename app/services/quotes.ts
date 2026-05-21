import { API } from '~/shared/api-paths'
import { normalizeApiList } from '~/shared/api'

export async function fetchWorkflowQuoteRequests() {
  const { api } = useApi()
  return normalizeApiList(await api<Array<Record<string, any>>>(API.workflow.quoteRequests))
}

export async function fetchClientResponses() {
  const { api } = useApi()
  return normalizeApiList(await api<Array<Record<string, any>>>(API.workflow.clientResponses))
}

export async function fetchQuoteRequestDetail(id: number | string, role: 'client' | 'shop') {
  const { api } = useApi()
  return api<Record<string, any>>(role === 'shop' ? API.workflow.shopRequestDetail(id) : API.workflow.clientRequestDetail(id))
}

export async function fetchQuoteResponses(id: number | string) {
  const { api } = useApi()
  return normalizeApiList(await api<Array<Record<string, any>>>(API.workflow.requestResponses(id)))
}

export async function replyToQuoteResponse(responseId: number | string, role: 'client' | 'shop', body: string) {
  const { api } = useApi()
  const endpoint = role === 'shop' ? API.workflow.shopReplyResponse(responseId) : API.workflow.clientReplyResponse(responseId)
  return api<Record<string, any>>(endpoint, {
    method: 'POST',
    body: { body },
  })
}

export async function fetchClientInbox() {
  const { api } = useApi()
  return normalizeApiList(await api<Array<Record<string, any>>>(API.messages.client))
}

export async function fetchShopInbox() {
  const { api } = useApi()
  return normalizeApiList(await api<Array<Record<string, any>>>(API.messages.shop))
}

export async function createCalculatorDraft(payload: Record<string, any>) {
  const { api } = useApi()
  return api<Record<string, any>>(API.quoteDrafts.list, {
    method: 'POST',
    body: payload,
  })
}

export async function updateCalculatorDraft(id: number | string, payload: Record<string, any>) {
  const { api } = useApi()
  return api<Record<string, any>>(API.quoteDrafts.detail(id), {
    method: 'PATCH',
    body: payload,
  })
}

export async function sendCalculatorDraft(id: number | string, payload: Record<string, any>) {
  const { api } = useApi()
  return api<Array<Record<string, any>>>(API.quoteDrafts.send(id), {
    method: 'POST',
    body: payload,
  })
}

export async function fetchClientQuoteRequests() {
  const { api } = useApi()
  return normalizeApiList(await api<Array<Record<string, any>>>(API.workflow.quoteRequests))
}

export async function fetchClientQuoteRequestDetail(id: number | string) {
  const { api } = useApi()
  return api<Record<string, any>>(API.workflow.clientRequestDetail(id))
}

export async function acceptClientQuoteResponse(id: number | string) {
  const { api } = useApi()
  return api<Record<string, any>>(API.workflow.clientAcceptResponse(id), {
    method: 'POST',
    body: {},
  })
}

export async function rejectClientQuoteResponse(id: number | string, reason: string, message = '') {
  const { api } = useApi()
  return api<Record<string, any>>(API.workflow.clientRejectResponse(id), {
    method: 'POST',
    body: { reason, message },
  })
}

export async function listPublicShops() {
  const { publicApi } = useApi()
  return normalizeApiList(await publicApi<Array<Record<string, any>>>('/public/shops/', { auth: false }))
}
