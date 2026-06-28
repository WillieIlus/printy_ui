

<script setup lang="ts">
import { callWithNuxt } from '#app'
import BaseAlert from '~/components/base/BaseAlert.vue'
import BaseBadge from '~/components/base/BaseBadge.vue'
import BaseButton from '~/components/base/BaseButton.vue'
import BaseInput from '~/components/base/BaseInput.vue'
import BaseSelect from '~/components/base/BaseSelect.vue'
import BaseTable from '~/components/base/BaseTable.vue'
import BaseTextarea from '~/components/base/BaseTextarea.vue'
import DashboardEmptyState from '~/components/dashboard/DashboardEmptyState.vue'
import DashboardPageHeader from '~/components/dashboard/DashboardPageHeader.vue'
import DashboardSection from '~/components/dashboard/DashboardSection.vue'
import StatusBadge from '~/components/dashboard/StatusBadge.vue'
import RoleDashboardFrame from '~/components/dashboard/RoleDashboardFrame.vue'
import { fetchCalculatorConfig } from '~/services/calculator'
import { useDashboardApi } from '~/services/dashboard'
import { createAssignedManagerQuote, createPartnerClient, createPartnerQuote, fetchAssignedRequestShopOptions, fetchManagerQuotePrefill, fetchPartnerProductionMatches, getPartnerQuoteDetail, getPartnerQuotes, previewManagerQuotePricing, previewPartnerQuote, searchPartnerClients, sendPartnerQuoteToClient } from '~/services/partner'
import { getApiErrorMessage, normalizeApiList } from '~/shared/api'

definePageMeta({ layout: false, middleware: 'auth' })

const nuxtApp = useNuxtApp()
const auth = useAuthStore()
const router = useRouter()
const { fetchDashboardSection } = useDashboardApi()
if (!auth.canAccessPartnerDashboard) {
  await callWithNuxt(nuxtApp, navigateTo, [auth.homeRoute])
}

const route = useRoute()
const hasId = computed(() => !!route.params.id)
const section = computed(() => String(route.params.section || 'quotes'))
const displayName = computed(() => auth.user?.name || auth.user?.email || 'Partner')
const initials = computed(() => displayName.value.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase() || 'PT')
const loading = ref(true)
const quotesLoading = ref(true)
const pageError = ref('')
const toastMessage = ref('')
const payload = ref<any>(null)
const rows = ref<Array<Record<string, any>>>([])
const quoteRows = ref<Array<Record<string, any>>>([])
const quotePanelOpen = ref(false)
const quotePanelStep = ref(1)
const panelError = ref('')
const config = ref<Record<string, any> | null>(null)
const previewLoading = ref(false)
const sendLoading = ref(false)
const clientCreateLoading = ref(false)
const draftSaveLoading = ref(false)
const previewData = ref<Record<string, any> | null>(null)
const rawPricingPreview = ref<Record<string, any> | null>(null)
const managerPricingBreakdown = ref<Record<string, any> | null>(null)
const productionMatches = ref<Array<Record<string, any>>>([])
const selectedPreviewShop = ref<Record<string, any> | null>(null)
const previewRefreshToken = ref(0)
const previewWarning = ref('')
const assignedRequestContext = ref<Record<string, any> | null>(null)
const clientSearchQuery = ref('')
const clientSearchResults = ref<Array<Record<string, any>>>([])
const clientSearchError = ref('')
const selectedClient = ref<Record<string, any> | null>(null)
const showNewClientForm = ref(false)
const searchLoading = ref(false)
const markupRate = ref('75')
const newClientForm = reactive({
  name: '',
  phone: '',
  email: '',
  company: '',
})
const quoteSpecs = reactive({
  product_type: 'business_card',
  finished_size: '',
  quantity: '100',
  paper_stock: '',
  print_sides: 'SIMPLEX',
  color_mode: 'COLOR',
  lamination: 'none',
  urgency_type: 'standard',
  note: '',
})
let searchTimer: ReturnType<typeof setTimeout> | null = null
let previewRefreshTimer: ReturnType<typeof setTimeout> | null = null

const quoteColumns = [
  { key: 'client', label: 'Client' },
  { key: 'product', label: 'Product' },
  { key: 'client_pays', label: 'Client pays' },
  { key: 'your_margin', label: 'Your margin' },
  { key: 'status', label: 'Status' },
  { key: 'date', label: 'Date' },
  { key: 'next_action', label: 'Action' },
]

const quoteStepPills = [
  { value: 1, label: '1. Specs + Price' },
  { value: 2, label: '2. Client' },
  { value: 3, label: '3. Review + Send' },
]

const sectionTitleMap: Record<string, string> = {
  jobs: 'Jobs in progress',
  clients: 'Managed clients',
  'production-shops': 'Production shops',
  payments: 'Partner payments',
  markups: 'Markups',
  samples: 'Samples',
  settings: 'Settings',
}
const sectionTitle = computed(() => sectionTitleMap[section.value] || 'Partner Section')
const isUiOnly = computed(() => !payload.value)
const sectionEyebrow = computed(() => section.value === 'jobs' ? 'Production follow-up' : 'Partner workspace')
const sectionSubtitle = computed(() => {
  if (section.value === 'jobs') return 'Track paid work, dispatch status, and production follow-up from the manager view.'
  if (section.value === 'clients') return 'Client records available to the partner workspace.'
  if (section.value === 'production-shops') return 'Production options visible to partner quoting.'
  if (section.value === 'payments') return 'Payment and commission records visible to the partner role.'
  return 'This partner section is available when backend data exists.'
})
const sectionTableTitle = computed(() => {
  if (section.value === 'jobs') return 'Dispatch and production queue'
  if (section.value === 'clients') return 'Client list'
  if (section.value === 'production-shops') return 'Shop list'
  if (section.value === 'payments') return 'Payment records'
  return sectionTitle.value
})
const sectionTableSubtitle = computed(() => {
  if (section.value === 'jobs') return 'Rows open the related manager quote detail when a quote reference is available.'
  if (section.value === 'payments') return 'Payment status is read-only here; payment actions stay in the payment workflow.'
  return 'Records from the existing partner dashboard endpoint.'
})
const emptyText = computed(() => {
  if (isUiOnly.value) return 'This section is UI-only right now.'
  if (section.value === 'jobs') return 'No jobs in progress. Accepted and paid quotes will become jobs here.'
  if (section.value === 'clients') return 'No managed clients yet. Clients are added through the quote workflow.'
  if (section.value === 'production-shops') return 'No production shops are visible to this workspace yet.'
  if (section.value === 'payments') return 'No partner payment records yet.'
  return `No ${section.value} yet.`
})
const columns = computed(() => {
  if (section.value === 'clients') return [{ key: 'name', label: 'Client' }]
  if (section.value === 'production-shops') return [{ key: 'name', label: 'Shop' }, { key: 'slug', label: 'Slug' }]
  if (section.value === 'payments') return [{ key: 'reference', label: 'Reference' }, { key: 'partner_commission', label: 'Partner Commission' }, { key: 'status', label: 'Status' }]
  if (section.value === 'jobs') return [{ key: 'reference', label: 'Reference' }, { key: 'client_name', label: 'Client' }, { key: 'status', label: 'Status' }, { key: 'next_action', label: 'Action' }]
  return [{ key: 'reference', label: 'Reference' }, { key: 'status', label: 'Status' }, { key: 'client_name', label: 'Client' }]
})
const displayRows = computed(() => rows.value.map(row => ({
  ...row,
  next_action: section.value === 'jobs' ? jobNextAction(row) : row.next_action,
})))
const quoteBuckets = computed(() => [
  {
    key: 'draft',
    title: 'Drafts and new requests',
    subtitle: 'Prepare pricing and send the client-facing quote.',
    emptyText: 'No quote drafts or new requests need pricing.',
    rows: quoteRows.value.filter(row => ['draft', 'awaiting_response', 'submitted'].includes(String(row.status || '').toLowerCase()) && row.next_action === 'Review request'),
  },
  {
    key: 'waiting-client',
    title: 'Waiting on client',
    subtitle: 'Quotes already sent; follow up or review the client response.',
    emptyText: 'No sent quotes are waiting on the client.',
    rows: quoteRows.value.filter(row => ['sent', 'awaiting_response'].includes(String(row.status || '').toLowerCase()) && row.next_action !== 'Review request'),
  },
  {
    key: 'dispatch',
    title: 'Approved or paid',
    subtitle: 'Accepted or paid work that may need dispatch.',
    emptyText: 'No approved or paid quotes need dispatch.',
    rows: quoteRows.value.filter(row => ['accepted', 'paid'].includes(String(row.status || '').toLowerCase())),
  },
  {
    key: 'production',
    title: 'In production or complete',
    subtitle: 'Work already dispatched or closed.',
    emptyText: 'No dispatched or completed quotes in this view.',
    rows: quoteRows.value.filter(row => ['dispatched', 'complete'].includes(String(row.status || '').toLowerCase())),
  },
  {
    key: 'other',
    title: 'Other quotes',
    subtitle: 'Quotes that do not match the primary workflow states.',
    emptyText: 'No other quotes.',
    rows: quoteRows.value.filter(row => !['draft', 'submitted', 'sent', 'awaiting_response', 'accepted', 'paid', 'dispatched', 'complete'].includes(String(row.status || '').toLowerCase())),
  },
].filter(bucket => bucket.rows.length > 0))
const navItems = computed(() => [
  { label: 'Overview', to: '/dashboard/partner' },
  { label: 'Quotes', to: '/dashboard/partner/quotes', active: section.value === 'quotes' },
  { label: 'Jobs', to: '/dashboard/partner/jobs', active: section.value === 'jobs' },
  { label: 'Clients', to: '/dashboard/partner/clients', active: section.value === 'clients' },
  { label: 'Shops', to: '/dashboard/partner/production-shops', active: section.value === 'production-shops' },
  { label: 'Rate Card', to: '/dashboard/partner/rate-card' },
  { label: 'Messages', to: '/dashboard/partner/messages' },
])

const productTypeOptions = computed(() => (config.value?.products || config.value?.product_types || []).map((item: Record<string, any>) => ({
  label: item.label,
  value: item.key,
})))
const selectedProduct = computed(() => (config.value?.products || config.value?.product_types || []).find((item: Record<string, any>) => item.key === quoteSpecs.product_type) || null)
const sizeOptions = computed(() => ((selectedProduct.value?.size_options || selectedProduct.value?.sizes || []) as Array<Record<string, any>>).map(item => ({
  label: item.label,
  value: item.id || item.value,
})))
const paperOptions = computed(() => ((selectedProduct.value?.paper_stocks || selectedProduct.value?.paper_options || config.value?.paper_stocks || []) as Array<Record<string, any>>).map(item => ({
  label: item.label || item.display_name || item.paper_name,
  value: item.key || item.id || item.value,
})))
const colorModeOptions = computed(() => ((selectedProduct.value?.color_mode_options || config.value?.color_modes || [
  { label: 'Full color', value: 'COLOR' },
  { label: 'Black & white', value: 'BW' },
]) as Array<Record<string, any>>).map(item => ({
  label: item.label,
  value: item.value,
})))
const sideOptions = [
  { label: 'Single-sided', value: 'SIMPLEX' },
  { label: 'Double-sided', value: 'DUPLEX' },
]
const finishingOptions = [
  { label: 'None', value: 'none' },
  { label: 'Matt lamination', value: 'matt-lamination' },
  { label: 'Gloss lamination', value: 'gloss-lamination' },
]
const turnaroundOptions = [
  { label: 'Standard', value: 'standard' },
  { label: 'Express', value: 'express' },
  { label: 'Same day', value: 'same_day' },
]
const MARKUP_FLOOR = 30
const MARKUP_DEFAULT = 75
const MARKUP_CEILING = 75
const MANAGER_CALCULATOR_CONTEXT = 'manager_dashboard'
const SOURCE_PRODUCTION_INTENT = 'source_production'
const markupPresets = [
  { label: 'Floor 30%', value: MARKUP_FLOOR },
  { label: 'Default 75%', value: MARKUP_DEFAULT },
  { label: 'Ceiling 75%', value: MARKUP_CEILING },
]

const productionBase = computed(() => Number(previewData.value?.production_estimate || 0))
const platformFeePercent = computed(() => Number(previewData.value?.platform_service_percent || 30))
const markupRateNumber = computed(() =>
  Math.min(MARKUP_CEILING, Math.max(MARKUP_FLOOR, Number(markupRate.value || MARKUP_DEFAULT)))
)
const markupAmount = computed(() => roundMoney(productionBase.value * markupRateNumber.value / 100))
const grossMarginAmount = computed(() => moneyFromPreview('gross_margin', markupAmount.value))
const platformFeeAmount = computed(() => moneyFromPreview('printy_fee', productionBase.value * platformFeePercent.value / 100))
const managerPayoutAmount = computed(() => moneyFromPreview('broker_payout', markupAmount.value))
const clientTotalAmount = computed(() => moneyFromPreview('client_price', productionBase.value + markupAmount.value + platformFeeAmount.value))
const brokerClientPriceAmount = computed(() => productionBase.value + grossMarginAmount.value)
const maxBrokerClientPriceAmount = computed(() => roundMoney(productionBase.value * 1.75))
const exceedsPolicyCap = computed(() => hasValidProductionBase.value && brokerClientPriceAmount.value > maxBrokerClientPriceAmount.value)
const markupHighWarning = computed(() => exceedsPolicyCap.value ? 'Client price exceeds the maximum allowed markup. Reduce the markup before sending.' : '')
const isAssignedRequestMode = computed(() => Boolean(assignedRequestContext.value?.id))
const selectedPreviewShopLabel = computed(() => selectedPreviewShop.value?.shop_display_name || selectedPreviewShop.value?.shop_slug || '')
const newClientHasAnyValue = computed(() => Boolean(
  newClientForm.name.trim()
  || newClientForm.phone.trim()
  || newClientForm.email.trim()
  || newClientForm.company.trim(),
))
const previewShopOptions = computed(() => (productionMatches.value as Array<Record<string, any>>)
  .filter(shop => shop?.shop_id)
  .map(shop => ({
    label: shop.shop_display_name || shop.shop_slug || `Shop #${shop.shop_id}`,
    value: String(shop.shop_id),
  })))
const selectedPreviewShopId = computed({
  get: () => selectedPreviewShop.value?.shop_id ? String(selectedPreviewShop.value.shop_id) : '',
  set: (value: string) => {
    const nextShop = productionMatches.value
      .find(shop => String(shop?.shop_id || '') === String(value))
    selectedPreviewShop.value = isSelectableProductionShop(nextShop) ? nextShop || null : null
  },
})
const hasValidProductionBase = computed(() => productionBase.value > 0)
const hasPricedSelectedShop = computed(() => isSelectableProductionShop(selectedPreviewShop.value))
const canContinueFromPreview = computed(() => Boolean(previewData.value && hasValidProductionBase.value && clientTotalAmount.value > 0 && hasPricedSelectedShop.value))
const canContinueStepOne = computed(() => canContinueFromPreview.value)
const canSaveDraft = computed(() => !isAssignedRequestMode.value && canContinueFromPreview.value)
const hasClientForSend = computed(() => Boolean(
  isAssignedRequestMode.value
  || selectedClient.value?.id
  || newClientForm.email.trim(),
))
const canSendQuote = computed(() => Boolean(
  hasClientForSend.value
  && rawPricingPreview.value
  && previewData.value
  && selectedPreviewShop.value?.shop_id
  && hasValidProductionBase.value
  && clientTotalAmount.value > 0
  && !exceedsPolicyCap.value,
))
const missingSpecFields = computed(() => Array.isArray(rawPricingPreview.value?.missing_fields) ? rawPricingPreview.value.missing_fields : [])
const noPricedShopOptions = computed(() => productionMatches.value.length > 0 && !productionMatches.value.some(shop => shop?.price_status === 'priced'))
const productionActionLabel = computed(() => isAssignedRequestMode.value ? 'Find production options' : 'Get production prices')
const reviewShopLabel = computed(() => selectedPreviewShop.value?.shop_display_name || 'No production shop selected')
const quoteSendBlockReason = computed(() => {
  if (!isAssignedRequestMode.value) return ''
  if (previewLoading.value || sendLoading.value) return ''
  if (missingSpecFields.value.length) return `Complete missing specs first: ${missingSpecFields.value.map(specFieldLabel).join(', ')}.`
  if (!productionMatches.value.length) return 'Find production options before sending the quote.'
  if (noPricedShopOptions.value) return 'No eligible shop has a production price yet.'
  if (!hasPricedSelectedShop.value) return 'Choose a priced production shop before sending.'
  if (!previewData.value || !hasValidProductionBase.value) return 'Refresh the markup preview before sending.'
  if (exceedsPolicyCap.value) return 'Client price exceeds the maximum allowed markup. Reduce the markup before sending.'
  return ''
})
const reviewClientLabel = computed(() => {
  if (assignedRequestContext.value) {
    return assignedRequestContext.value.client_label || 'Assigned client'
  }
  if (selectedClient.value) {
    return `${selectedClient.value.name || 'Client'} · ${selectedClient.value.phone || selectedClient.value.email || `Client #${selectedClient.value.id}`}`
  }
  if (newClientHasAnyValue.value) {
    return `${newClientForm.name.trim() || newClientForm.company.trim() || 'New client'} · ${newClientForm.phone.trim() || newClientForm.email.trim() || 'Draft details'}`
  }
  return 'No client selected'
})
const reviewJobLabel = computed(() => {
  const productLabel = productTypeOptions.value.find((option: { label: string; value: string | number }) => option.value === quoteSpecs.product_type)?.label || quoteSpecs.product_type
  const sizeLabel = sizeOptions.value.find((option: { label: string; value: string | number }) => option.value === quoteSpecs.finished_size)?.label || quoteSpecs.finished_size
  return `${productLabel} · ${quoteSpecs.quantity} qty · ${sizeLabel}`
})
const reviewSpecsLabel = computed(() => {
  const paperLabel = paperOptions.value.find((option: { label: string; value: string | number }) => option.value === quoteSpecs.paper_stock)?.label || quoteSpecs.paper_stock
  const colorLabel = colorModeOptions.value.find((option: { label: string; value: string | number }) => option.value === quoteSpecs.color_mode)?.label || quoteSpecs.color_mode
  const finishingLabel = finishingOptions.find((option: { label: string; value: string }) => option.value === quoteSpecs.lamination)?.label || 'None'
  return `${quoteSpecs.print_sides === 'DUPLEX' ? 'Double-sided' : 'Single-sided'} · ${colorLabel} · ${paperLabel} · ${finishingLabel}`
})

function roundMoney(value: number) {
  return Number(Number(value || 0).toFixed(2))
}

function moneyFromPreview(key: string, fallback: number) {
  const value = Number(previewData.value?.[key])
  return Number.isFinite(value) ? roundMoney(value) : roundMoney(fallback)
}

function formatMoney(value: number | string | null | undefined) {
  const amount = Number(value || 0)
  if (!Number.isFinite(amount) || amount <= 0) {
    return 'KES 0.00'
  }
  return `KES ${amount.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function productionStatusTone(row: Record<string, any>) {
  if (row?.can_produce && row?.price_available) return 'border-green-200 bg-green-50/60'
  if (row?.can_produce) return 'border-amber-200 bg-amber-50/60'
  return 'border-slate-200 bg-slate-50'
}

function missingRequirementsText(row: Record<string, any>) {
  const values = Array.isArray(row?.missing_requirements) ? row.missing_requirements : []
  if (!values.length) return 'No missing requirements'
  return values.map((value: string) => String(value).replace(/_/g, ' ')).join(', ')
}

function specFieldLabel(value: unknown) {
  return String(value || '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())
}

function shopSelectLabel(row: Record<string, any>) {
  if (row?.price_status === 'priced') return 'Select this shop'
  if (row?.price_status === 'missing_specs') return 'Missing specs'
  if (row?.price_status === 'missing_pricing') return 'Needs pricing setup'
  return 'Unavailable'
}

function isSelectableProductionShop(row: Record<string, any> | null | undefined) {
  return Boolean(row?.shop_id && row?.can_produce && row?.price_available && row?.price_status === 'priced')
}

function selectProductionShop(row: Record<string, any>) {
  if (!isSelectableProductionShop(row)) {
    previewWarning.value = row?.reason || 'This shop cannot be selected until production pricing is available.'
    return
  }
  selectedPreviewShop.value = row
}

function productSummary(row: Record<string, any>) {
  const latestSnapshot = row.latest_response?.response_snapshot || row.detail?.latest_response?.response_snapshot || {}
  const requestSnapshot = row.request_snapshot || row.detail?.request_snapshot || row.detail?.latest_response?.quote_request?.request_snapshot || {}
  const calculatorInputs = requestSnapshot.calculator_inputs && typeof requestSnapshot.calculator_inputs === 'object'
    ? requestSnapshot.calculator_inputs
    : {}
  return latestSnapshot.product_label
    || requestSnapshot.product_label
    || requestSnapshot.product_type
    || calculatorInputs.product_type
    || row.reference
    || 'Quote'
}

function derivePartnerStatus(detail: Record<string, any> | null, listRow: Record<string, any>) {
  const job = detail?.managed_job || null
  const paymentStatus = String(job?.payment_status || '').toLowerCase()
  const assignmentStatus = String(job?.assignment_status || '').toLowerCase()
  const jobStatus = String(job?.status || '').toLowerCase()
  if (['completed', 'delivered'].includes(jobStatus)) return 'complete'
  if (job?.dispatched_at || assignmentStatus === 'assignment_pending' || assignmentStatus === 'assigned' || assignmentStatus === 'accepted') return 'dispatched'
  if (['confirmed', 'release_ready', 'paid'].includes(paymentStatus)) return 'paid'
  if (job?.id) return 'accepted'
  if (!hasListResponse(detail || listRow)) return 'awaiting_response'
  return String(listRow.status || 'draft').toLowerCase()
}

function openQuoteDetail(row: Record<string, any>) {
  navigateTo(`/dashboard/partner/quotes/${row.quote_request_id || row.id}`)
}

function openGenericDetail(row: Record<string, any>) {
  const id = row.id || row.quote_request_id
  if (!id) return
  if (section.value === 'jobs') {
    navigateTo(`/dashboard/partner/quotes/${id}`)
  }
}

function jobNextAction(row: Record<string, any>) {
  const paymentStatus = String(row.payment_status || '').toLowerCase()
  const assignmentStatus = String(row.assignment_status || '').toLowerCase()
  const status = String(row.status || '').toLowerCase()
  if (['completed', 'delivered'].includes(status)) return 'View completed job'
  if (row.dispatched_at || ['assignment_pending', 'assigned', 'accepted'].includes(assignmentStatus)) return 'Track production'
  if (['confirmed', 'release_ready', 'paid'].includes(paymentStatus)) return 'Confirm dispatch'
  return 'View job'
}

function hasListResponse(row: Record<string, any> | null) {
  return Boolean(row?.latest_response?.id)
}

async function prepareAssignedRequest(requestId: string | number) {
  panelError.value = ''
  previewWarning.value = ''
  toastMessage.value = ''
  await loadCalculatorConfig()
  const payload = await getPartnerQuoteDetail(requestId)
  const prefill = await fetchManagerQuotePrefill(requestId)
  const detail = payload?.quote || null
  if (!detail) {
    throw new Error('Assigned request could not be loaded.')
  }
  const snapshot = detail.request_snapshot && typeof detail.request_snapshot === 'object' ? detail.request_snapshot : {}
  const calculatorInputs = snapshot.calculator_inputs && typeof snapshot.calculator_inputs === 'object'
    ? snapshot.calculator_inputs as Record<string, any>
    : {}
  assignedRequestContext.value = {
    id: detail.id,
    client_label: detail.client_name
      ? `${detail.client_name} · ${detail.client_phone || detail.client_email || detail.request_reference || `Request #${detail.id}`}`
      : detail.request_reference || `Request #${detail.id}`,
    artwork_label: snapshot.artwork_filename || snapshot.artwork_reference || calculatorInputs.artwork_filename || calculatorInputs.artwork_reference || 'Not confirmed yet',
    deadline_label: snapshot.requested_deadline || snapshot.requested_delivery_time || calculatorInputs.requested_deadline || calculatorInputs.requested_delivery_time || '',
  }
  selectedClient.value = null
  showNewClientForm.value = false
  const builderPayload = prefill?.builder_payload && typeof prefill.builder_payload === 'object' ? prefill.builder_payload as Record<string, any> : {}
  const prefillSize = prefill?.size?.width_mm && prefill?.size?.height_mm ? `${prefill.size.width_mm}x${prefill.size.height_mm}mm` : ''
  quoteSpecs.product_type = String(builderPayload.product_type || prefill?.product_type || quoteSpecs.product_type)
  quoteSpecs.finished_size = String(builderPayload.finished_size || prefillSize || snapshot.finished_size || snapshot.size_label || calculatorInputs.finished_size || '')
  quoteSpecs.quantity = String(builderPayload.quantity || prefill?.quantity || quoteSpecs.quantity)
  quoteSpecs.paper_stock = String(builderPayload.paper_stock || snapshot.paper_stock || calculatorInputs.paper_stock || '')
  quoteSpecs.print_sides = String(builderPayload.print_sides || snapshot.print_sides || calculatorInputs.print_sides || 'SIMPLEX')
  quoteSpecs.color_mode = String(builderPayload.color_mode || snapshot.color_mode || calculatorInputs.color_mode || 'COLOR')
  quoteSpecs.lamination = String(builderPayload.lamination || prefill?.finishing?.[0]?.slug || 'none')
  quoteSpecs.urgency_type = String(builderPayload.urgency_type || prefill?.turnaround || 'standard')
  quoteSpecs.note = String(prefill?.client_notes || snapshot.custom_brief || detail.notes || '')
  rawPricingPreview.value = null
  managerPricingBreakdown.value = null
  previewData.value = null
  productionMatches.value = []
  selectedPreviewShop.value = null
  markupRate.value = String(MARKUP_DEFAULT)
  quotePanelOpen.value = true
  quotePanelStep.value = 1
  await loadProductionPreview()
}

function openQuotePanel() {
  toastMessage.value = ''
  panelError.value = ''
  previewWarning.value = ''
  clientSearchError.value = ''
  assignedRequestContext.value = null
  quotePanelOpen.value = true
  quotePanelStep.value = 1
}

function closeQuotePanel() {
  quotePanelOpen.value = false
  quotePanelStep.value = 1
  panelError.value = ''
  selectedClient.value = null
  showNewClientForm.value = false
  clientSearchQuery.value = ''
  clientSearchError.value = ''
  clientSearchResults.value = []
  previewData.value = null
  rawPricingPreview.value = null
  managerPricingBreakdown.value = null
  productionMatches.value = []
  selectedPreviewShop.value = null
  assignedRequestContext.value = null
  markupRate.value = String(MARKUP_DEFAULT)
  Object.assign(newClientForm, {
    name: '',
    phone: '',
    email: '',
    company: '',
  })
}

function goToStep(step: number) {
  if (step <= quotePanelStep.value || (step === 2 && canContinueStepOne.value) || (step === 3 && canContinueStepOne.value)) {
    quotePanelStep.value = step
  }
}

function selectClient(client: Record<string, any>) {
  selectedClient.value = {
    ...client,
    id: client.client_id || client.id,
    client_id: client.client_id || client.id,
  }
  showNewClientForm.value = false
  panelError.value = ''
}

async function continueFromClientStep() {
  panelError.value = ''
  quotePanelStep.value = 3
}

function applySpecDefaults() {
  if (!quoteSpecs.finished_size && sizeOptions.value[0]) {
    quoteSpecs.finished_size = String(sizeOptions.value[0].value)
  }
  if (!quoteSpecs.paper_stock && paperOptions.value[0]) {
    quoteSpecs.paper_stock = String(paperOptions.value[0].value)
  }
}

async function loadQuotesSection() {
  quotesLoading.value = true
  pageError.value = ''
  try {
    const list = await getPartnerQuotes()
    const detailedRows = list.map((row) => {
      const pricing = row.latest_response?.response_snapshot?.customer_pricing || {}
      const derivedStatus = derivePartnerStatus(row, row)
      return {
        id: row.id,
        quote_request_id: row.id,
        client: row.customer_name || 'Client',
        product: productSummary(row),
        client_pays: hasListResponse(row)
          ? formatMoney(pricing.final_client_price || pricing.estimated_total || row.managed_job?.pricing?.client_total || 0)
          : 'Awaiting quote',
        your_margin: hasListResponse(row)
          ? formatMoney(pricing.broker_margin_amount || 0)
          : 'Pending',
        status: derivedStatus,
        date: formatDate(row.created_at || row.updated_at),
        next_action: hasListResponse(row) ? 'Open quote' : 'Review request',
      }
    })
    quoteRows.value = detailedRows
  } catch (error: unknown) {
    pageError.value = getApiErrorMessage(error, 'Partner quotes are unavailable right now.')
  } finally {
    quotesLoading.value = false
    loading.value = false
  }
}

async function loadGenericSection() {
  loading.value = true
  pageError.value = ''
  try {
    payload.value = await fetchDashboardSection('partner', section.value)
    rows.value = normalizeApiList(payload.value?.results || [])
  } catch (error: unknown) {
    pageError.value = getApiErrorMessage(error, 'Partner dashboard section is unavailable right now.')
  } finally {
    loading.value = false
  }
}

async function loadCalculatorConfig() {
  if (config.value) {
    return
  }
  config.value = await fetchCalculatorConfig()
  applySpecDefaults()
}

async function loadProductionPreview() {
  panelError.value = ''
  previewWarning.value = ''
  try {
    previewLoading.value = true
    await loadCalculatorConfig()
    const payload = {
      product_type: quoteSpecs.product_type,
      quantity: Number(quoteSpecs.quantity || 0),
      finished_size: quoteSpecs.finished_size,
      print_sides: quoteSpecs.print_sides,
      color_mode: quoteSpecs.color_mode,
      paper_stock: quoteSpecs.paper_stock,
      lamination: quoteSpecs.lamination,
      urgency_type: quoteSpecs.urgency_type,
      note: quoteSpecs.note,
    }
    const matchResponse = assignedRequestContext.value?.id
      ? await fetchAssignedRequestShopOptions(assignedRequestContext.value.id, payload)
      : await fetchPartnerProductionMatches({
          ...payload,
          calculator_context: MANAGER_CALCULATOR_CONTEXT,
          intent: SOURCE_PRODUCTION_INTENT,
        })
    productionMatches.value = Array.isArray(matchResponse?.results) ? matchResponse.results : []
    rawPricingPreview.value = matchResponse?.pricing_snapshot || null
    managerPricingBreakdown.value = null
    selectedPreviewShop.value = productionMatches.value.find(shop => shop?.is_recommended && isSelectableProductionShop(shop))
      || productionMatches.value.find(shop => isSelectableProductionShop(shop))
      || productionMatches.value[0]
      || null
    if (Array.isArray(matchResponse?.missing_fields) && matchResponse.missing_fields.length) {
      previewWarning.value = `Complete these specs to unlock exact pricing: ${matchResponse.missing_fields.map(specFieldLabel).join(', ')}`
    }
    if (!selectedPreviewShop.value?.shop_id) {
      previewWarning.value = matchResponse?.summary || 'The production preview did not return a selectable shop.'
      previewData.value = null
      return
    }
    if (!selectedPreviewShop.value?.can_produce || !selectedPreviewShop.value?.price_available) {
      previewWarning.value = selectedPreviewShop.value?.reason || 'Production price is not available yet. Choose a shop with pricing or adjust specs.'
      previewData.value = null
      return
    }
    await refreshPartnerPreview()
  } catch (error: unknown) {
    panelError.value = getApiErrorMessage(error, 'We could not fetch the production preview.')
  } finally {
    previewLoading.value = false
  }
}

function buildCalculatorInputsSnapshot() {
  return {
    product_type: quoteSpecs.product_type,
    quantity: Number(quoteSpecs.quantity || 0),
    finished_size: quoteSpecs.finished_size,
    paper_stock: quoteSpecs.paper_stock,
    print_sides: quoteSpecs.print_sides,
    color_mode: quoteSpecs.color_mode,
    lamination: quoteSpecs.lamination,
    urgency_type: quoteSpecs.urgency_type,
  }
}

function buildPartnerQuotePayload(overrides: Record<string, any> = {}) {
  return {
    shop: selectedPreviewShop.value?.shop_id,
    title: `${reviewJobLabel.value} for ${selectedClient.value?.name || newClientForm.name.trim() || 'client'}`,
    client_id: selectedClient.value?.client_id || selectedClient.value?.id || null,
    client_name: selectedClient.value?.name || newClientForm.name.trim(),
    client_email: selectedClient.value?.email || newClientForm.email.trim(),
    client_phone: selectedClient.value?.phone || newClientForm.phone.trim(),
    client_company: selectedClient.value?.company || newClientForm.company.trim(),
    calculator_inputs_snapshot: buildCalculatorInputsSnapshot(),
    pricing_snapshot: rawPricingPreview.value,
    partner_markup: markupAmount.value.toFixed(2),
    note: quoteSpecs.note,
    ...overrides,
  }
}

async function ensureSelectedClientForSend() {
  if (assignedRequestContext.value || selectedClient.value?.id) {
    return selectedClient.value
  }
  if (!newClientForm.email.trim()) {
    throw new Error('Client email is required before sending this quote.')
  }
  clientCreateLoading.value = true
  try {
    const createdClient = await createPartnerClient({
      name: newClientForm.name.trim(),
      phone: newClientForm.phone.trim(),
      email: newClientForm.email.trim(),
      company: newClientForm.company.trim(),
    })
    selectClient(createdClient)
    clientSearchError.value = ''
    return createdClient
  } finally {
    clientCreateLoading.value = false
  }
}

async function savePartnerQuoteDraft() {
  if (!selectedPreviewShop.value?.shop_id || !rawPricingPreview.value || !hasValidProductionBase.value || clientTotalAmount.value <= 0) {
    panelError.value = 'Production price is not available yet. Choose a shop with pricing or adjust specs.'
    return
  }

  panelError.value = ''
  draftSaveLoading.value = true
  try {
    await createPartnerQuote(buildPartnerQuotePayload({ save_as_draft: true }))
    toastMessage.value = 'Draft quote saved'
    closeQuotePanel()
    await loadQuotesSection()
  } catch (error: unknown) {
    panelError.value = getApiErrorMessage(error, 'We could not save this draft yet.')
  } finally {
    draftSaveLoading.value = false
  }
}

function getSelectedShopSubtotal() {
  const shopPreview = ((rawPricingPreview.value?.selected_shops || []) as Array<Record<string, any>>)
    .find(shop => String(shop?.id || '') === String(selectedPreviewShop.value?.shop_id || ''))
  return Number(
    shopPreview?.preview?.totals?.shop_total
    || shopPreview?.preview?.totals?.grand_total
    || selectedPreviewShop.value?.production_cost
    || 0,
  )
}

async function refreshPartnerPreview() {
  if (!rawPricingPreview.value || !selectedPreviewShop.value?.shop_id) {
    previewData.value = null
    return
  }

  if (!selectedPreviewShop.value?.can_produce || !selectedPreviewShop.value?.price_available) {
    previewData.value = null
    previewWarning.value = selectedPreviewShop.value?.reason || 'Production price is not available yet. Choose a shop with pricing or adjust specs.'
    return
  }

  const productionSubtotal = getSelectedShopSubtotal()
  if (!(productionSubtotal > 0)) {
    previewData.value = null
    previewWarning.value = 'Production price is not available yet. Choose a shop with pricing or adjust specs.'
    return
  }

  const requestToken = ++previewRefreshToken.value
  previewWarning.value = ''
  const markupAmountValue = roundMoney(productionSubtotal * markupRateNumber.value / 100)
  const response = await previewPartnerQuote({
    shop: selectedPreviewShop.value.shop_id,
    pricing_snapshot: rawPricingPreview.value,
    partner_markup: markupAmountValue.toFixed(2),
  })

  if (requestToken !== previewRefreshToken.value) {
    return
  }

  previewData.value = response
  if (assignedRequestContext.value?.id) {
    const managerPreview = await previewManagerQuotePricing(assignedRequestContext.value.id, {
      specs: buildCalculatorInputsSnapshot(),
      shop_id: selectedPreviewShop.value.shop_id,
      markup_pct: markupRateNumber.value,
    })
    managerPricingBreakdown.value = managerPreview?.breakdown || null
  }
  if (Number(response?.production_estimate || 0) <= 0) {
    previewWarning.value = 'Production price is not available yet. Choose a shop with pricing or adjust specs.'
  }
}

async function submitPartnerQuote() {
  if (!selectedPreviewShop.value?.shop_id || !rawPricingPreview.value || !hasValidProductionBase.value || clientTotalAmount.value <= 0) {
    panelError.value = 'Production price is not available yet. Choose a shop with pricing or adjust specs.'
    return
  }

  panelError.value = ''
  sendLoading.value = true
  try {
    if (assignedRequestContext.value?.id) {
      await createAssignedManagerQuote(assignedRequestContext.value.id, {
        shop: selectedPreviewShop.value.shop_id,
        pricing_snapshot: rawPricingPreview.value,
        partner_markup: markupAmount.value.toFixed(2),
        note: quoteSpecs.note,
      })
      toastMessage.value = 'Quote sent to the assigned client'
      closeQuotePanel()
      await loadQuotesSection()
      return
    }
    const clientRecord = await ensureSelectedClientForSend()
    const draftResponse = await createPartnerQuote(buildPartnerQuotePayload({
      save_as_draft: true,
      client_id: clientRecord?.client_id || clientRecord?.id || null,
    }))
    await sendPartnerQuoteToClient(draftResponse.quote_request_id, {
      broker_margin_type: 'fixed',
      broker_margin_value: markupAmount.value.toFixed(2),
      note: quoteSpecs.note,
    })
    toastMessage.value = `Quote sent to ${clientRecord?.name || 'client'}`
    closeQuotePanel()
    await loadQuotesSection()
  } catch (error: unknown) {
    panelError.value = getApiErrorMessage(error, 'We could not send this partner quote.')
  } finally {
    sendLoading.value = false
  }
}

function formatDate(value: unknown) {
  if (!value) {
    return 'Recent'
  }
  const date = new Date(String(value))
  if (Number.isNaN(date.getTime())) {
    return 'Recent'
  }
  return new Intl.DateTimeFormat('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

watch(selectedProduct, () => {
  applySpecDefaults()
})

watch(() => selectedPreviewShop.value?.shop_id, async (shopId, previousShopId) => {
  if (!shopId || shopId === previousShopId || !rawPricingPreview.value || previousShopId === undefined) {
    return
  }
  previewLoading.value = true
  panelError.value = ''
  try {
    await refreshPartnerPreview()
  } catch (error: unknown) {
    panelError.value = getApiErrorMessage(error, 'We could not refresh the production preview.')
  } finally {
    previewLoading.value = false
  }
})

watch(markupRate, () => {
  // Do not clamp here; let the user type freely. Clamp only when computing amounts.
  if (!rawPricingPreview.value || !selectedPreviewShop.value?.shop_id) {
    return
  }
  if (previewRefreshTimer) {
    clearTimeout(previewRefreshTimer)
  }
  previewRefreshTimer = setTimeout(async () => {
    previewLoading.value = true
    panelError.value = ''
    try {
      await refreshPartnerPreview()
    } catch (error: unknown) {
      panelError.value = getApiErrorMessage(error, 'We could not refresh the production preview.')
    } finally {
      previewLoading.value = false
    }
  }, 250)
})

watch(clientSearchQuery, (value) => {
  if (searchTimer) {
    clearTimeout(searchTimer)
  }
  clientSearchError.value = ''
  const normalizedQuery = String(value || '').trim()
  if (section.value !== 'quotes' || !quotePanelOpen.value || normalizedQuery.length < 2) {
    clientSearchResults.value = []
    searchLoading.value = false
    return
  }
  searchTimer = setTimeout(async () => {
    searchLoading.value = true
    try {
      clientSearchResults.value = await searchPartnerClients(normalizedQuery)
    } catch (error: unknown) {
      clientSearchResults.value = []
      clientSearchError.value = getApiErrorMessage(error, 'Partner clients could not load.')
    } finally {
      searchLoading.value = false
    }
  }, 400)
})

watch(
  () => [section.value, quotePanelOpen.value, route.query.prepare, hasId.value] as const,
  async ([currentSection, panelOpen, prepareId, isDetailRoute]) => {
    if (currentSection !== 'quotes' || panelOpen || isDetailRoute || typeof prepareId !== 'string' || !prepareId) {
      return
    }
    panelError.value = ''
    try {
      await prepareAssignedRequest(prepareId)
      await router.replace({ query: { ...route.query, prepare: undefined } })
    } catch (error: unknown) {
      panelError.value = getApiErrorMessage(error, 'Assigned request could not be prepared.')
    }
  },
  { immediate: true },
)

onMounted(async () => {
  try {
    if (section.value === 'quotes') {
      await loadCalculatorConfig()
      await loadQuotesSection()
    } else {
      await loadGenericSection()
    }
  } catch (error: unknown) {
    pageError.value = getApiErrorMessage(error, 'Partner workspace could not load.')
    loading.value = false
    quotesLoading.value = false
  }
})
</script>

<template>
  <main class="min-h-screen bg-slate-50 px-6 py-8">
    <section class="mx-auto max-w-7xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p class="text-sm font-semibold uppercase tracking-[0.2em] text-purple-600">Partner</p>
      <h1 class="mt-3 text-2xl font-bold text-slate-900">Dashboard section</h1>
      <p class="mt-2 text-sm text-slate-600">This partner section is available in the restored dashboard shell.</p>
    </section>
  </main>
</template>
