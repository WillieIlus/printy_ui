import { API } from '~/shared/api-paths'
import { normalizeApiList } from '~/shared/api'

const CLIENT_DRAFT_FORBIDDEN_FIELDS = new Set([
  'shops',
  'shop',
  'shop_id',
  'selected_shop',
  'selected_shop_id',
  'selected_shop_ids',
  'production_option',
  'production_cost',
  'production_base_price',
  'broker_markup',
  'broker_payout',
  'broker_margin',
  'broker_margin_amount',
  'broker_margin_percent',
  'gross_margin',
  'printy_fee',
  'platform_service_amount',
  'platform_service_percent',
  'shop_payout',
  'internal_pricing_snapshot',
  'internal_sourcing_snapshot',
])

function stripClientDraftForbiddenFields(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(item => stripClientDraftForbiddenFields(item))
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([key]) => !CLIENT_DRAFT_FORBIDDEN_FIELDS.has(key))
        .map(([key, child]) => [key, stripClientDraftForbiddenFields(child)]),
    )
  }
  return value
}

function sanitizeClientDraftPayload(payload: Record<string, any>) {
  return stripClientDraftForbiddenFields(payload) as Record<string, any>
}

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
    body: sanitizeClientDraftPayload(payload),
  })
}

export async function updateCalculatorDraft(id: number | string, payload: Record<string, any>) {
  const { api } = useApi()
  return api<Record<string, any>>(API.quoteDrafts.detail(id), {
    method: 'PATCH',
    body: sanitizeClientDraftPayload(payload),
  })
}

export async function fetchCalculatorDraftDetail(id: number | string) {
  const { api } = useApi()
  return api<Record<string, any>>(API.quoteDrafts.detail(id))
}

export async function saveGuestCalculatorDraft(payload: Record<string, any>) {
  const { publicApi } = useApi()
  return publicApi<Record<string, any>>(API.quoteDrafts.guest, {
    method: 'POST',
    body: sanitizeClientDraftPayload(payload),
    auth: false,
  })
}

export async function claimGuestCalculatorDraft(sessionKey: string) {
  const { api } = useApi()
  return api<Record<string, any>>(API.quoteDrafts.claim, {
    method: 'POST',
    body: { session_key: sessionKey },
  })
}

export async function uploadGuestCalculatorArtwork(file: File, sessionKey: string) {
  const { publicApi } = useApi()
  const formData = new FormData()
  formData.append('file', file)
  formData.append('session_key', sessionKey)
  return publicApi<Record<string, any>>(API.calculatorArtwork.upload, {
    method: 'POST',
    body: formData,
    auth: false,
  })
}

export async function fetchGuestCalculatorArtworkDetail(token: string) {
  const { publicApi } = useApi()
  return publicApi<Record<string, any>>(API.calculatorArtwork.detail(token), {
    auth: false,
  })
}

export async function fetchRecommendedPrintManagers(params: Record<string, any>) {
  const { api } = useApi()
  const query = new URLSearchParams()
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') {
      return
    }
    query.set(key, String(value))
  })
  const suffix = query.toString()
  return api<Record<string, any>>(suffix ? `${API.intake.recommendedManagers}?${suffix}` : API.intake.recommendedManagers)
}

export async function submitIntakeRequest(payload: Record<string, any>) {
  const { api } = useApi()
  return api<Record<string, any>>(API.intake.submit, {
    method: 'POST',
    body: payload,
  })
}

export async function fetchClientQuoteRequests() {
  const { api } = useApi()
  return normalizeApiList(await api<Array<Record<string, any>>>(API.dashboard.clientQuotes))
}

export async function fetchClientQuoteRequestDetail(id: number | string) {
  const { api } = useApi()
  return api<Record<string, any>>(API.workflow.clientRequestDetail(id))
}

export async function acceptClientQuoteResponse(id: number | string) {
  const { api } = useApi()
  return api<Record<string, any>>(API.payments.quoteAccept(id), {
    method: 'POST',
    body: {},
  })
}

export async function initiateQuotePayment(quoteId: number | string, phoneNumber: string) {
  const { api } = useApi()
  return api<Record<string, any>>(API.payments.stkPush, {
    method: 'POST',
    body: { quote_id: quoteId, phone_number: phoneNumber },
  })
}

export async function rejectClientQuoteResponse(id: number | string, reason: string, message = '') {
  const { api } = useApi()
  return api<Record<string, any>>(API.workflow.clientRejectResponse(id), {
    method: 'POST',
    body: { reason, message },
  })
}
