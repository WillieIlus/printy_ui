
<script setup lang="ts">
import { callWithNuxt } from '#app'
import BaseAlert from '~/components/base/BaseAlert.vue'
import BaseBadge from '~/components/base/BaseBadge.vue'
import BaseButton from '~/components/base/BaseButton.vue'
import BaseCard from '~/components/base/BaseCard.vue'
import BaseInput from '~/components/base/BaseInput.vue'
import BaseSelect from '~/components/base/BaseSelect.vue'
import BaseTable from '~/components/base/BaseTable.vue'
import DashboardEmptyState from '~/components/dashboard/DashboardEmptyState.vue'
import DashboardSection from '~/components/dashboard/DashboardSection.vue'
import StatusBadge from '~/components/dashboard/StatusBadge.vue'
import RoleDashboardFrame from '~/components/dashboard/RoleDashboardFrame.vue'
import { printyDueStatus, printyStatusBadgeVariant, printyStatusLabel, type PrintyBadgeVariant } from '~/constants/design'
import { useForShopsApi } from '~/services/for-shops'
import { useDashboardApi } from '~/services/dashboard'
import { fetchManagedJobSettlement } from '~/services/jobs'
import { getAssignments } from '~/services/production'
import { useShopsApi, type FinishingRateRecord, type PaperRecord } from '~/services/shops'
import { getApiErrorMessage } from '~/shared/api'

definePageMeta({ layout: false, middleware: 'auth' })

const nuxtApp = useNuxtApp()
const auth = useAuthStore()
const { fetchForShopsConfig, previewForShops } = useForShopsApi()
const { fetchDashboardSection } = useDashboardApi()
const {
  createShopFinishingRate,
  createShopPaper,
  fetchMyShops,
  fetchShopPricingSetup,
  listShopFinishingRates,
  listShopPapers,
  saveShopPricingSetup,
  updateShopFinishingRate,
  updateShopPaper,
  adjustShopPaper,
} = useShopsApi()
if (!auth.canAccessProductionDashboard) {
  await callWithNuxt(nuxtApp, navigateTo, [auth.homeRoute])
}

const route = useRoute()
const section = computed(() => String(route.params.section || 'jobs'))
const displayName = computed(() => auth.user?.name || auth.user?.email || 'Production')
const initials = computed(() => displayName.value.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase() || 'PD')
const loading = ref(true)
const pageError = ref('')
const payload = ref<any>(null)
const currentShopSlug = ref('')
const sectionSuccess = ref('')

const sheetSizeOptions = [
  { label: 'SRA3', value: 'SRA3' },
  { label: 'A3', value: 'A3' },
  { label: 'A4', value: 'A4' },
  { label: 'A5', value: 'A5' },
  { label: 'Custom', value: 'Custom' },
]

const finishingPricingOptions = [
  { label: 'Per side', value: 'per_side' },
  { label: 'Per piece', value: 'per_piece' },
  { label: 'Per job', value: 'per_job' },
]

const isManagedSection = computed(() => ['paper-stock', 'pricing', 'finishings'].includes(section.value))
const sectionTitleMap: Record<string, string> = {
  assignments: 'Production Assignments',
  jobs: 'Production Jobs',
  pricing: 'Production Pricing',
  'paper-stock': 'Paper Stock',
  finishings: 'Finishings',
  payments: 'Production Payments',
}
const sectionTitle = computed(() => sectionTitleMap[section.value] || 'Production Section')
const sectionSubtitle = computed(() => {
  if (section.value === 'jobs') return 'Production jobs visible to your shop. Rows open the assignment workflow when possible.'
  if (section.value === 'payments') return 'Production payout and payment-readiness records only.'
  return 'Role-specific production view.'
})

const paperRows = ref<PaperRecord[]>([])
const pricingRows = ref<Array<Record<string, any>>>([])
const finishingRows = ref<Array<Record<string, any>>>([])
const productionAssignments = ref<Array<Record<string, any>>>([])
const productionJobs = ref<Array<Record<string, any>>>([])
const assignmentSettlements = ref<Record<string, Record<string, any> | null>>({})
const assignmentError = ref('')
const setupState = ref<Record<string, any> | null>(null)
const builderConfig = ref<Record<string, any> | null>(null)
const existingFinishings = ref<FinishingRateRecord[]>([])
const previewState = ref<Record<string, any> | null>(null)
const previewLoading = ref(false)
const previewError = ref('')
const savingPricing = ref(false)
const savingFinishings = ref(false)
const savingPaperDraft = ref(false)
const updatingPaperId = ref<number | null>(null)
const adjustingPaperId = ref<number | null>(null)
const adjustingStock = ref(false)
const stockAdjustment = ref('0')
const showAddPaperForm = ref(false)
const editingPaperId = ref<number | null>(null)

const paperDraft = reactive({
  name: '',
  gsm: '',
  sheet_size: 'SRA3',
  cost: '',
  quantity: '',
  is_active: true,
})
const paperDraftErrors = reactive<Record<string, string>>({})
const paperEditDraft = reactive({
  name: '',
  gsm: '',
  sheet_size: 'SRA3',
  cost: '',
  quantity: '',
  is_active: true,
})
const paperEditErrors = reactive<Record<string, string>>({})

let previewTimer: ReturnType<typeof setTimeout> | null = null

function clearObject(object: Record<string, string>) {
  for (const key of Object.keys(object)) {
    delete object[key]
  }
}

function inferPaperCategory(name: string, gsm: number | string) {
  const normalized = `${name} ${gsm}`.toLowerCase()
  if (normalized.includes('sticker') || normalized.includes('tictac')) return 'sticker'
  if (normalized.includes('ivory')) return 'ivory'
  if (normalized.includes('board')) return 'cover_board'
  if (normalized.includes('art card') || normalized.includes('artcard')) return 'artcard'
  if (normalized.includes('gloss')) return 'gloss'
  return 'matt'
}

function inferPaperType(name: string) {
  const normalized = name.toLowerCase()
  if (normalized.includes('gloss')) return 'GLOSS'
  if (normalized.includes('sticker') || normalized.includes('tictac')) return 'STICKER'
  if (normalized.includes('bond')) return 'BOND'
  return 'MATTE'
}

function normalizePricingRows() {
  pricingRows.value = JSON.parse(JSON.stringify(setupState.value?.paper_rows || builderConfig.value?.paper_rows || []))
}

function normalizeFinishingRows() {
  const rows = JSON.parse(JSON.stringify(setupState.value?.finishing_rows || builderConfig.value?.finishing_rows || []))
  const persistedByName = new Map(existingFinishings.value.map(item => [item.name.toLowerCase(), item]))
  finishingRows.value = rows.map((row: Record<string, any>) => ({
    ...row,
    pricing_type: inferFinishingPricingType(row, persistedByName.get(String(row.name || row.label || '').toLowerCase()) || null),
  }))
}

function inferFinishingPricingType(row: Record<string, any>, persisted?: Record<string, any> | null) {
  const source = persisted || row
  const name = String(source?.name || row?.name || row?.label || '').toLowerCase()
  const billingBasis = String(source?.billing_basis || row?.billing_basis || row?.pricing_mode || '').toLowerCase()
  const sideMode = String(source?.side_mode || row?.side_mode || '').toLowerCase()
  const chargeUnit = String(source?.charge_unit || row?.charge_unit || '').toUpperCase()
  if (sideMode === 'per_selected_side' || chargeUnit === 'PER_SIDE' || chargeUnit === 'PER_SIDE_PER_SHEET' || name.includes('lamination')) {
    return 'per_side'
  }
  if (billingBasis.startsWith('flat_') || chargeUnit === 'FLAT' || name.includes('cutting')) {
    return 'per_job'
  }
  return 'per_piece'
}

function finishingPricingLabel(row: Record<string, any>) {
  if (row.pricing_type === 'per_side') return 'Priced per side'
  if (row.pricing_type === 'per_job') return 'Priced per job'
  return 'Priced per piece'
}

function finishingPreviewLabel(row: Record<string, any>) {
  return String(row.pricing_mode || row.unit || finishingPricingLabel(row)).replace(/_/g, ' ')
}

function serializePaperRows(rows: Array<Record<string, any>>) {
  return rows.map(row => ({
    key: row.key,
    id: row.id,
    label: row.label,
    paper_name: row.paper_name,
    gsm: row.gsm,
    paper_type: row.paper_type,
    category: row.category,
    size: row.size,
    paper_base_price: row.paper_base_price,
    single_print_base: row.single_print_base,
    double_print_base: row.double_print_base,
    heavy_paper_surcharge: row.heavy_paper_surcharge,
    surcharge_threshold_gsm: row.surcharge_threshold_gsm,
    active: Boolean(row.active),
  }))
}

function serializeFinishingRows(rows: Array<Record<string, any>>) {
  return rows.map(row => ({
    key: row.key,
    id: row.id,
    label: row.label,
    name: row.name,
    pricing_mode: row.pricing_mode,
    unit: row.unit,
    price: row.price,
    minimum_charge: row.minimum_charge,
    active: Boolean(row.active),
  }))
}

function paperPreviewRow(row: Record<string, any>) {
  const source = Array.isArray(previewState.value?.paper_rows) ? previewState.value?.paper_rows : setupState.value?.paper_rows
  return source?.find((item: Record<string, any>) => item.key === row.key) || row
}

function finishingPreviewRow(row: Record<string, any>) {
  const source = Array.isArray(previewState.value?.finishing_rows) ? previewState.value?.finishing_rows : setupState.value?.finishing_rows
  return source?.find((item: Record<string, any>) => item.key === row.key) || row
}

function schedulePreview() {
  if (previewTimer) {
    clearTimeout(previewTimer)
  }
  previewTimer = setTimeout(() => {
    void refreshPreview()
  }, 600)
}

async function refreshPreview() {
  previewLoading.value = true
  previewError.value = ''
  try {
    previewState.value = await previewForShops({
      paper_rows: serializePaperRows(pricingRows.value),
      finishing_rows: serializeFinishingRows(finishingRows.value),
    })
  } catch (error: unknown) {
    previewError.value = getApiErrorMessage(error, 'Live capability preview is unavailable right now.')
  } finally {
    previewLoading.value = false
  }
}

function paperPayloadFromDraft(source: typeof paperDraft | typeof paperEditDraft) {
  return {
    name: source.name.trim(),
    sheet_size: source.sheet_size,
    gsm: Number(source.gsm),
    category: inferPaperCategory(source.name, source.gsm),
    paper_type: inferPaperType(source.name),
    buying_price: Number(source.cost || 0).toFixed(2),
    selling_price: Number(source.cost || 0).toFixed(2),
    quantity_in_stock: source.quantity === '' ? 0 : Number(source.quantity),
    is_active: source.is_active,
    available_for_quoting: source.is_active,
  }
}

function validatePaperDraft(source: typeof paperDraft | typeof paperEditDraft, target: Record<string, string>) {
  clearObject(target)
  if (!source.name.trim()) target.name = 'Paper name is required.'
  if (!source.gsm || Number(source.gsm) <= 0) target.gsm = 'Enter a valid GSM.'
  if (!source.sheet_size.trim()) target.sheet_size = 'Choose a size.'
  if (source.cost === '' || Number(source.cost) < 0) target.cost = 'Enter a valid cost.'
  return Object.keys(target).length === 0
}

function toggleAddPaperForm() {
  showAddPaperForm.value = !showAddPaperForm.value
  if (!showAddPaperForm.value) {
    clearObject(paperDraftErrors)
  }
}

async function loadManagedContext() {
  if (section.value === 'assignments') {
    assignmentError.value = ''
    const assignments = await getAssignments()
    const jobsPayload = await fetchDashboardSection('production', 'jobs')
    productionAssignments.value = assignments
    productionJobs.value = Array.isArray(jobsPayload?.results) ? jobsPayload.results : []
    const settlementEntries = await Promise.all(
      assignments.map(async (assignment) => {
        try {
          const settlement = await fetchManagedJobSettlement(assignment.managed_job)
          return [String(assignment.managed_job), settlement] as const
        } catch {
          return [String(assignment.managed_job), null] as const
        }
      }),
    )
    assignmentSettlements.value = Object.fromEntries(settlementEntries)
    return
  }

  const shops = await fetchMyShops()
  currentShopSlug.value = shops.find(shop => shop?.is_active !== false)?.slug || shops[0]?.slug || ''
  if (!currentShopSlug.value) {
    return
  }

  if (section.value === 'paper-stock') {
    paperRows.value = await listShopPapers(currentShopSlug.value)
    return
  }

  if (section.value === 'pricing' || section.value === 'finishings') {
    const [setup, config, finishings] = await Promise.all([
      fetchShopPricingSetup(currentShopSlug.value),
      fetchForShopsConfig(),
      listShopFinishingRates(currentShopSlug.value),
    ])
    setupState.value = setup
    builderConfig.value = config
    existingFinishings.value = finishings
    normalizePricingRows()
    normalizeFinishingRows()
    await refreshPreview()
    return
  }

  payload.value = await fetchDashboardSection('production', section.value)
}

onMounted(async () => {
  try {
    await loadManagedContext()
  } catch (error: unknown) {
    pageError.value = getApiErrorMessage(error, 'Production dashboard section is unavailable right now.')
  } finally {
    loading.value = false
  }
})

watch(
  () => section.value === 'pricing' ? JSON.stringify(pricingRows.value) : section.value === 'finishings' ? JSON.stringify(finishingRows.value) : '',
  () => {
    if (section.value === 'pricing' || section.value === 'finishings') {
      schedulePreview()
    }
  },
)

const isUiOnly = computed(() => !payload.value)
const rows = computed(() => Array.isArray(payload.value?.results) ? payload.value.results : [])
const emptyText = computed(() => {
  if (isUiOnly.value) return 'This section is UI-only right now.'
  if (section.value === 'jobs') return 'No production jobs are assigned right now.'
  if (section.value === 'payments') return 'No production payment records yet.'
  return `No ${section.value} yet.`
})
const columns = computed(() => {
  if (section.value === 'payments') return [{ key: 'reference', label: 'Reference' }, { key: 'production_amount', label: 'Production Amount' }, { key: 'status', label: 'Status' }]
  return [{ key: 'reference', label: 'Reference' }, { key: 'status', label: 'Status' }, { key: 'payment_status', label: 'Payment' }]
})

const navItems = computed(() => [
  { label: 'Overview', to: '/dashboard/production' },
  { label: 'Onboarding', to: '/dashboard/production/onboarding' },
  { label: 'Assignments', to: '/dashboard/production/assignments', active: section.value === 'assignments' },
  { label: 'Jobs', to: '/dashboard/production/jobs', active: section.value === 'jobs' },
  { label: 'Paper', to: '/dashboard/production/paper-stock', active: section.value === 'paper-stock' },
  { label: 'Pricing', to: '/dashboard/production/pricing', active: section.value === 'pricing' },
  { label: 'Finishings', to: '/dashboard/production/finishings', active: section.value === 'finishings' },
  { label: 'Messages', to: '/dashboard/production/messages' },
])

const previewProducts = computed(() => {
  const summary = (previewState.value?.summary || setupState.value?.summary || {}) as Record<string, any>
  return Array.isArray(summary.unlocked_products) ? summary.unlocked_products.slice(0, 6) : []
})

const exampleQuoteMessage = computed(() => {
  const exampleQuote = (previewState.value?.example_quote || setupState.value?.example_quote || null) as Record<string, any> | null
  return exampleQuote?.status_text || ''
})

const assignmentCards = computed(() => productionAssignments.value.map((assignment) => {
  const job = productionJobs.value.find(item => String(item.id) === String(assignment.managed_job)) || null
  const settlement = assignmentSettlements.value[String(assignment.managed_job)] || null
  const status = normalizedStatus(assignment.status)
  const proofStatus = normalizedStatus(assignment.latest_proof_status || assignment.proof_status)
  const fileMissing = assignment.artwork_available === false || assignment.files_available === false || assignment.artwork_missing === true
  const urgency = printyDueStatus(assignment.requested_deadline || assignment.due_at || job?.requested_deadline)
  return {
    id: assignment.id,
    managedJobId: assignment.managed_job,
    reference: job?.reference || assignment.managed_reference || `Assignment ${assignment.id}`,
    title: job?.title || 'Managed print job',
    specSummary: assignmentSpecSummary(assignment, job),
    productionAmount: formatMoney(assignment.payout_amount || settlement?.production_amount || job?.pricing?.production_total),
    deadline: urgency.label,
    urgencyClass: urgency.className,
    paymentBadge: assignment.payment_confirmed ? 'Payment cleared' : 'Payment pending',
    proofLabel: printyStatusLabel(proofStatus || 'needed', 'proof'),
    fileLabel: fileMissing ? 'Files missing' : 'Files available',
    nextAction: nextAssignmentAction(status, proofStatus, fileMissing),
    statusLabel: printyStatusLabel(status, 'production'),
    badgeVariant: printyStatusBadgeVariant(status, 'production'),
    stage: assignmentStage(status, proofStatus, fileMissing, assignment),
    completed: ['ready', 'completed', 'delivered'].includes(status),
  }
}))
const assignmentQueueGroups = computed(() => [
  {
    key: 'needs-attention',
    title: 'Needs Attention',
    subtitle: 'Proof rejected, files missing, or an issue needs shop review.',
    badgeVariant: 'red' as PrintyBadgeVariant,
    cards: assignmentCards.value.filter(card => card.stage === 'needs-attention'),
  },
  {
    key: 'ready-to-print',
    title: 'Ready to Print',
    subtitle: 'Accepted work that can move onto the floor.',
    badgeVariant: 'yellow' as PrintyBadgeVariant,
    cards: assignmentCards.value.filter(card => card.stage === 'ready-to-print'),
  },
  {
    key: 'in-progress',
    title: 'In Progress',
    subtitle: 'Printing or finishing work already underway.',
    badgeVariant: 'blue' as PrintyBadgeVariant,
    cards: assignmentCards.value.filter(card => card.stage === 'in-progress'),
  },
  {
    key: 'incoming',
    title: 'Incoming',
    subtitle: 'Newly dispatched work awaiting review.',
    badgeVariant: 'default' as PrintyBadgeVariant,
    cards: assignmentCards.value.filter(card => card.stage === 'incoming'),
  },
  {
    key: 'completed',
    title: 'Completed',
    subtitle: 'Ready or completed assignments, visually de-emphasized.',
    badgeVariant: 'green' as PrintyBadgeVariant,
    cards: assignmentCards.value.filter(card => card.stage === 'completed'),
  },
].filter(group => group.cards.length > 0))

function normalizedStatus(value: unknown) {
  return String(value || '').toLowerCase().replace(/[\s-]+/g, '_')
}

function assignmentStage(status: string, proofStatus: string, fileMissing: boolean, assignment: Record<string, any>) {
  if (proofStatus === 'revision_requested' || fileMissing || assignment.action_required) return 'needs-attention'
  if (['in_production', 'finishing'].includes(status)) return 'in-progress'
  if (['ready', 'completed', 'delivered'].includes(status)) return 'completed'
  if (status === 'accepted') return 'ready-to-print'
  return 'incoming'
}

function nextAssignmentAction(status: string, proofStatus: string, fileMissing: boolean) {
  if (fileMissing) return 'Review files'
  if (proofStatus === 'revision_requested') return 'Upload revised proof'
  if (['pending', 'assigned'].includes(status)) return 'Review job'
  if (status === 'accepted') return 'Start production'
  if (status === 'in_production') return 'Upload proof'
  if (status === 'finishing') return 'Mark ready'
  return 'View details'
}

function assignmentSpecSummary(assignment: Record<string, any>, job: Record<string, any> | null) {
  const specs = job?.specs || {}
  const quantity = specs.quantity || assignment.quantity
  const product = specs.product || specs.product_type || job?.title
  const paper = specs.paper || assignment.paper_label
  return [quantity ? `${Number(quantity).toLocaleString('en-KE')} qty` : '', product, paper].filter(Boolean).join(' / ')
    || String(assignment.assignment_notes || '').trim()
    || 'Specs are attached on the detail page.'
}

function openJobRow(row: Record<string, any>) {
  const assignment = productionAssignments.value.find(item => String(item.managed_job) === String(row.id || row.managed_job_id))
  if (assignment?.id) {
    navigateTo(`/dashboard/production/assignments/${assignment.id}`)
  }
}

function humanizeStatus(value: unknown) {
  return String(value || 'pending')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, letter => letter.toUpperCase())
}

function formatMoney(value: unknown) {
  const amount = Number(value)
  if (!Number.isFinite(amount) || amount <= 0) {
    return 'Awaiting payout total'
  }
  return `KES ${amount.toLocaleString('en-KE', { maximumFractionDigits: 2 })}`
}

function formatDateTime(value: unknown) {
  if (!value) return 'No deadline set'
  const date = new Date(String(value))
  if (Number.isNaN(date.getTime())) return 'No deadline set'
  return new Intl.DateTimeFormat('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

function summarizePaymentState(value: unknown) {
  const status = String(value || 'pending').toLowerCase()
  if (status.includes('hold')) return 'On hold'
  if (status === 'release_ready') return 'Settlement pending release'
  if (status === 'confirmed' || status === 'paid') return 'Paid'
  return printyStatusLabel(status, 'payment')
}

async function saveNewPaper() {
  if (!currentShopSlug.value) return
  if (!validatePaperDraft(paperDraft, paperDraftErrors)) return
  savingPaperDraft.value = true
  sectionSuccess.value = ''
  try {
    await createShopPaper(currentShopSlug.value, paperPayloadFromDraft(paperDraft))
    paperRows.value = await listShopPapers(currentShopSlug.value)
    paperDraft.name = ''
    paperDraft.gsm = ''
    paperDraft.sheet_size = 'SRA3'
    paperDraft.cost = ''
    paperDraft.quantity = ''
    paperDraft.is_active = true
    showAddPaperForm.value = false
    sectionSuccess.value = 'Paper row added.'
  } catch (error: unknown) {
    pageError.value = getApiErrorMessage(error, 'Paper could not be added.')
  } finally {
    savingPaperDraft.value = false
  }
}

function startPaperEdit(paper: PaperRecord) {
  editingPaperId.value = paper.id
  paperEditDraft.name = paper.name || paper.display_name || ''
  paperEditDraft.gsm = paper.gsm ? String(paper.gsm) : ''
  paperEditDraft.sheet_size = paper.sheet_size || 'SRA3'
  paperEditDraft.cost = String(paper.buying_price ?? paper.selling_price ?? '')
  paperEditDraft.quantity = paper.quantity_in_stock === undefined || paper.quantity_in_stock === null ? '' : String(paper.quantity_in_stock)
  paperEditDraft.is_active = Boolean(paper.is_active)
  clearObject(paperEditErrors)
}

function cancelPaperEdit() {
  editingPaperId.value = null
  clearObject(paperEditErrors)
}

async function savePaperEdit(paperId: number) {
  if (!currentShopSlug.value) return
  if (!validatePaperDraft(paperEditDraft, paperEditErrors)) return
  updatingPaperId.value = paperId
  sectionSuccess.value = ''
  try {
    await updateShopPaper(currentShopSlug.value, paperId, paperPayloadFromDraft(paperEditDraft))
    paperRows.value = await listShopPapers(currentShopSlug.value)
    editingPaperId.value = null
    sectionSuccess.value = 'Paper row updated.'
  } catch (error: unknown) {
    pageError.value = getApiErrorMessage(error, 'Paper could not be updated.')
  } finally {
    updatingPaperId.value = null
  }
}

function openAdjustPaper(paperId: number) {
  adjustingPaperId.value = paperId
  stockAdjustment.value = '0'
}

function closeAdjustPaper() {
  adjustingPaperId.value = null
  stockAdjustment.value = '0'
}

async function saveStockAdjustment(paperId: number) {
  if (!currentShopSlug.value) return
  adjustingStock.value = true
  sectionSuccess.value = ''
  try {
    await adjustShopPaper(currentShopSlug.value, paperId, Number(stockAdjustment.value || 0))
    paperRows.value = await listShopPapers(currentShopSlug.value)
    sectionSuccess.value = 'Stock adjusted.'
    closeAdjustPaper()
  } catch (error: unknown) {
    pageError.value = getApiErrorMessage(error, 'Stock adjustment failed.')
  } finally {
    adjustingStock.value = false
  }
}

async function savePricing() {
  if (!currentShopSlug.value) return
  savingPricing.value = true
  sectionSuccess.value = ''
  try {
    setupState.value = await saveShopPricingSetup({
      paper_rows: serializePaperRows(pricingRows.value),
      finishing_rows: serializeFinishingRows(finishingRows.value),
      shop_details: setupState.value?.shop_details || {},
    }, currentShopSlug.value)
    sectionSuccess.value = 'Pricing saved.'
  } catch (error: unknown) {
    pageError.value = getApiErrorMessage(error, 'Pricing could not be saved.')
  } finally {
    savingPricing.value = false
  }
}

function finishingPayload(row: Record<string, any>) {
  const base = {
    name: row.label || row.name,
    price: Number(row.price || 0).toFixed(2),
    is_active: Boolean(row.active),
  }
  if (row.pricing_type === 'per_side') {
    const price = Number(row.price || 0)
    return {
      ...base,
      charge_unit: 'PER_SHEET',
      billing_basis: 'per_sheet',
      side_mode: 'per_selected_side',
      double_side_price: (price * 2).toFixed(2),
      minimum_charge: '0.00',
      setup_fee: '0.00',
    }
  }
  if (row.pricing_type === 'per_piece') {
    return {
      ...base,
      charge_unit: 'PER_PIECE',
      billing_basis: 'per_piece',
      side_mode: 'ignore_sides',
      minimum_charge: '0.00',
      setup_fee: '0.00',
    }
  }
  return {
    ...base,
    charge_unit: 'FLAT',
    billing_basis: 'flat_per_job',
    side_mode: 'ignore_sides',
    minimum_charge: '0.00',
    setup_fee: '0.00',
  }
}

async function saveFinishings() {
  if (!currentShopSlug.value) return
  savingFinishings.value = true
  sectionSuccess.value = ''
  try {
    const byName = new Map(existingFinishings.value.map(item => [item.name.toLowerCase(), item]))
    for (const row of finishingRows.value) {
      row.errorMessage = ''
      const match = byName.get(String(row.name || row.label || '').toLowerCase())
      try {
        if (match) {
          await updateShopFinishingRate(currentShopSlug.value, match.id, finishingPayload(row))
        } else if (row.active) {
          await createShopFinishingRate(currentShopSlug.value, finishingPayload(row))
        }
      } catch (error: unknown) {
        row.errorMessage = getApiErrorMessage(error, 'This finishing could not be saved.')
      }
    }
    if (finishingRows.value.some(row => row.active && row.errorMessage)) {
      throw new Error('One or more finishing rows failed to save.')
    }
    existingFinishings.value = await listShopFinishingRates(currentShopSlug.value)
    setupState.value = await saveShopPricingSetup({
      paper_rows: serializePaperRows(pricingRows.value),
      finishing_rows: serializeFinishingRows(finishingRows.value),
      shop_details: setupState.value?.shop_details || {},
    }, currentShopSlug.value)
    sectionSuccess.value = 'Finishings saved.'
  } catch (error: unknown) {
    pageError.value = getApiErrorMessage(error, 'Finishings could not be saved.')
  } finally {
    savingFinishings.value = false
  }
}

onUnmounted(() => {
  if (previewTimer) {
    clearTimeout(previewTimer)
  }
})
</script>

<template>
  <main class="min-h-screen bg-slate-50 px-6 py-8">
    <section class="mx-auto max-w-7xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p class="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Production</p>
      <h1 class="mt-3 text-2xl font-bold text-slate-900">Dashboard section</h1>
      <p class="mt-2 text-sm text-slate-600">This production section is available in the restored dashboard shell.</p>
    </section>
  </main>
</template>
