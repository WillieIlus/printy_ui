<script setup lang="ts">
import BaseAlert from '~/components/base/BaseAlert.vue'
import BaseButton from '~/components/base/BaseButton.vue'
import DashboardSection from '~/components/dashboard/DashboardSection.vue'
import RoleDashboardFrame from '~/components/dashboard/RoleDashboardFrame.vue'
import { fetchCalculatorDraftDetail, fetchRecommendedPrintManagers, submitIntakeRequest } from '~/services/quotes'
import { getApiErrorMessage } from '~/shared/api'
import type { CalculatorHint } from '~/stores/calculatorHint'

definePageMeta({ layout: false, middleware: 'auth' })

const auth = useAuthStore()
const pendingClientQuote = usePendingClientQuote()
const calculatorHint = useCalculatorHintStore()
if (!auth.canAccessClientDashboard) {
  await navigateTo(auth.homeRoute)
}

const route = useRoute()
const draftId = computed(() => Number(route.query.draft || 0))
const loading = ref(true)
const submitLoading = ref(false)
const pageError = ref('')
const submitError = ref('')
const draft = ref<Record<string, any> | null>(null)
const managerResponse = ref<Record<string, any>>({ results: [], message: '' })
const selectedManagerId = ref<number | null>(null)
const appliedHint = ref<CalculatorHint>({ ...calculatorHint.$state })

const displayName = computed(() => auth.user?.name || auth.user?.email || 'Client')
const initials = computed(() => displayName.value.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase() || 'CL')
const navItems = computed(() => [
  { label: 'Client Dashboard', to: '/dashboard/client' },
  { label: 'Quotes', to: '/dashboard/client/quotes' },
  { label: 'Choose Manager', to: route.fullPath, active: true },
])

const draftTitle = computed(() => String(draft.value?.title || 'Quote draft'))
const calculatorInputs = computed(() => (draft.value?.calculator_inputs_snapshot || {}) as Record<string, any>)
const draftSummary = computed(() => {
  const product = String(calculatorInputs.value.product_type || '').replaceAll('_', ' ') || 'print job'
  const quantity = calculatorInputs.value.quantity || 0
  const size = calculatorInputs.value.finished_size || 'size to confirm'
  return `${product} · Qty ${quantity} · ${size}`
})
const managerCards = computed(() => Array.isArray(managerResponse.value.results) ? managerResponse.value.results : [])
const fallbackManager = computed(() => {
  const value = managerResponse.value.fallback
  return value && typeof value === 'object' ? value as Record<string, any> : null
})
const fallbackManagerId = computed<number | null>(() => {
  const value = Number(fallbackManager.value?.id || 0)
  return Number.isFinite(value) && value > 0 ? value : null
})
const emptyMessage = computed(() => String(managerResponse.value.message || 'No managers available for this spec yet. Printy will handle your job directly.'))

function formatHours(value: number | null) {
  if (value === null || value === undefined) {
    return 'time to confirm'
  }
  return `${Number(value).toFixed(1)} hrs`
}

function badgeLabel(value: string) {
  if (value === 'fast_responder') return 'Fast responder'
  if (value === 'experienced') return 'Experienced'
  if (value === 'most_recommended') return 'Most recommended'
  return startCase(value || '')
}

function startCase(value: string) {
  return String(value || '')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-KE').format(value)
}

function formatCurrency(value: number | null) {
  const amount = Number(value || 0)
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: appliedHint.value.currency || 'KES',
  }).format(Number.isFinite(amount) ? amount : 0)
}

function consumeCalculatorHint() {
  appliedHint.value = { ...calculatorHint.$state }
  calculatorHint.clearHint()
}

async function loadPage() {
  if (!draftId.value) {
    pageError.value = 'Draft reference is missing.'
    loading.value = false
    return
  }
  loading.value = true
  pageError.value = ''
  try {
    draft.value = await fetchCalculatorDraftDetail(draftId.value)
    managerResponse.value = await fetchRecommendedPrintManagers({
      product_type: calculatorInputs.value.product_type,
      quantity: calculatorInputs.value.quantity,
      paper_gsm: calculatorInputs.value.requested_gsm,
      size: calculatorInputs.value.finished_size,
      client_id: auth.user?.id,
    })
    selectedManagerId.value = managerCards.value[0] ? Number(managerCards.value[0].id) : null
  } catch (error: unknown) {
    pageError.value = getApiErrorMessage(error, 'Printy could not load manager recommendations right now.')
  } finally {
    loading.value = false
  }
}

async function submitForManager(managerId: number | null) {
  if (!draftId.value) {
    submitError.value = 'Draft reference is missing.'
    return
  }
  submitLoading.value = true
  submitError.value = ''
  selectedManagerId.value = managerId
  try {
    const response = await submitIntakeRequest({
      draft_id: draftId.value,
      selected_manager_id: managerId,
      manager_selection_mode: managerId === null ? 'printy_auto' : 'client_selected',
    })
    pendingClientQuote.clear()
    if (managerId === null) {
      await navigateTo('/dashboard/client/quotes?notice=quote-request-sent&autoAssign=1')
      return
    }
    const managerName = encodeURIComponent(String(response.manager_name || 'Printy'))
    await navigateTo(`/dashboard/client/quotes?notice=quote-request-sent&manager=${managerName}`)
  } catch (error: unknown) {
    submitError.value = getApiErrorMessage(error, 'Printy could not submit this intake request.')
  } finally {
    submitLoading.value = false
  }
}

consumeCalculatorHint()
await loadPage()
</script>

<template>
  <main class="min-h-screen bg-slate-50 px-6 py-8">
    <section class="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p class="text-sm font-semibold uppercase tracking-[0.2em] text-[#e13515]">Intake</p>
      <h1 class="mt-3 text-2xl font-bold text-slate-900">Select a manager</h1>
      <p class="mt-2 text-sm text-slate-600">Choose the Printy manager who should handle this quote request.</p>
    </section>
  </main>
</template>
