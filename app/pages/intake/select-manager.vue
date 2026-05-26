<template>
  <RoleDashboardFrame
    title="Choose Your Print Manager"
    badge="Client"
    :name="displayName"
    :initials="initials"
    subtitle="Select a manager before Printy opens your quote request."
    breadcrumb-root="Dashboard"
    :nav-items="navItems"
    support-title="Manager selection"
    support-copy="Your manager handles pricing, production coordination, and updates. Shops stay hidden until dispatch."
    support-action="Back to quotes"
    support-to="/dashboard/client/quotes"
    @logout="auth.logout()"
  >
    <BaseAlert v-if="pageError" variant="error" title="Manager selection could not load." :message="pageError" />
    <BaseAlert v-else-if="submitError" variant="error" title="Request could not be sent." :message="submitError" />

    <div v-if="!pageError" class="space-y-6">
      <DashboardSection title="Choose your print manager" subtitle="Your manager handles everything - pricing, production, and quality. You pay only once they send you an exact quote.">
        <div class="rounded-2xl border border-[#e4e7ec] bg-white p-5">
          <p class="text-sm font-semibold text-[#101828]">{{ draftTitle }}</p>
          <p class="mt-2 text-sm text-[#667085]">{{ draftSummary }}</p>
        </div>
      </DashboardSection>

      <DashboardSection v-if="loading" title="Recommended managers" subtitle="Loading real manager options for this spec.">
        <div class="grid gap-4">
          <div v-for="index in 3" :key="index" class="h-36 animate-pulse rounded-2xl border border-[#e4e7ec] bg-[#f9fafb]" />
        </div>
      </DashboardSection>

      <DashboardSection v-else-if="managerCards.length" title="Recommended managers" subtitle="Real manager signals only. No markup or shop pricing is shown here.">
        <article
          class="rounded-2xl border p-5 transition-colors"
          :class="selectedManagerId === null ? 'border-[#101828] bg-[#f8fafc]' : 'border-[#e4e7ec] bg-white hover:border-[#101828]'"
        >
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div class="flex flex-wrap items-center gap-2">
                <span class="rounded-full bg-[#101828] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white">Auto-assign</span>
              </div>
              <h2 class="mt-3 text-xl font-extrabold text-[#101828]">Let Printy choose for me</h2>
              <p class="mt-2 text-sm text-[#475467]">We'll assign the best available Print Manager for your job.</p>
              <p class="mt-3 text-sm text-[#667085]">This keeps your request manager-led without exposing production options, shop names, or pricing details at this stage.</p>
            </div>
            <div class="min-w-[220px] rounded-2xl border border-[#e4e7ec] bg-white p-4 text-sm text-[#475467]">
              <p>Best for clients who want Printy to route the request quickly.</p>
              <p class="mt-2">A manager will review your spec and return an exact quote.</p>
            </div>
          </div>
          <div class="mt-4">
            <BaseButton variant="secondary" size="sm" :loading="submitLoading && selectedManagerId === null" @click="submitForManager(null)">
              Auto-assign
            </BaseButton>
          </div>
        </article>

        <button
          type="button"
          class="w-full rounded-2xl border p-5 text-left transition-colors"
          :class="selectedManagerId === managerCards[0].id ? 'border-[#e13515] bg-[#fff6f3]' : 'border-[#fda497] bg-[#fff8f7] hover:border-[#e13515]'"
          @click="selectedManagerId = Number(managerCards[0].id)"
        >
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div class="flex flex-wrap items-center gap-2">
                <span class="rounded-full bg-[#e13515] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white">Most Recommended</span>
                <span v-if="managerCards[0].is_previous_manager" class="rounded-full bg-[#101828] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white">Previous manager</span>
              </div>
              <h2 class="mt-3 text-xl font-extrabold text-[#101828]">{{ managerCards[0].display_name }}</h2>
              <p class="mt-1 text-sm text-[#667085]">{{ managerCards[0].brand_name || 'Print Manager' }}</p>
              <p v-if="managerCards[0].specializations?.length" class="mt-3 text-sm text-[#475467]">Specializations: {{ managerCards[0].specializations.join(', ') }}</p>
              <p class="mt-3 text-sm text-[#667085]">{{ managerCards[0].recommendation_reason }}</p>
            </div>
            <div class="min-w-[180px] rounded-2xl border border-[#e4e7ec] bg-white p-4 text-sm text-[#475467]">
              <p v-if="managerCards[0].avg_response_hours !== null">Responds in ~{{ formatHours(managerCards[0].avg_response_hours) }}</p>
              <p class="mt-2">{{ managerCards[0].completed_jobs }} jobs completed</p>
              <p v-if="managerCards[0].satisfaction_rating !== null" class="mt-2">★ {{ managerCards[0].satisfaction_rating.toFixed(1) }}</p>
              <p v-if="managerCards[0].distance_km !== null" class="mt-2">{{ managerCards[0].distance_km.toFixed(1) }} km away</p>
            </div>
          </div>
          <div class="mt-4">
            <BaseButton variant="primary" size="sm" :loading="submitLoading && selectedManagerId === managerCards[0].id" @click.stop="submitForManager(managerCards[0].id)">
              Request quote
            </BaseButton>
          </div>
        </button>

        <div v-if="managerCards.length > 1" class="grid gap-4 lg:grid-cols-2">
          <article
            v-for="manager in managerCards.slice(1)"
            :key="manager.id"
            class="rounded-2xl border border-[#e4e7ec] bg-white p-5"
          >
            <div class="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div class="flex flex-wrap items-center gap-2">
                  <span class="rounded-full bg-[#f2f4f7] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#475467]">Other Option</span>
                  <span v-if="manager.badge" class="rounded-full bg-[#ecfdf3] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#027a48]">{{ badgeLabel(manager.badge) }}</span>
                </div>
                <h3 class="mt-3 text-lg font-bold text-[#101828]">{{ manager.display_name }}</h3>
                <p class="mt-1 text-sm text-[#667085]">{{ manager.brand_name || 'Print Manager' }}</p>
              </div>
              <div class="text-right text-sm text-[#667085]">
                <p v-if="manager.avg_response_hours !== null">~{{ formatHours(manager.avg_response_hours) }}</p>
                <p>{{ manager.completed_jobs }} jobs</p>
              </div>
            </div>
            <p v-if="manager.specializations?.length" class="mt-3 text-sm text-[#475467]">{{ manager.specializations.join(', ') }}</p>
            <p class="mt-3 text-sm text-[#667085]">{{ manager.recommendation_reason }}</p>
            <div class="mt-4">
              <BaseButton variant="secondary" size="sm" :loading="submitLoading && selectedManagerId === manager.id" @click="submitForManager(manager.id)">
                Request quote
              </BaseButton>
            </div>
          </article>
        </div>
      </DashboardSection>

      <DashboardSection v-else title="Printy fallback" subtitle="No manager is available for this spec yet.">
        <div class="rounded-2xl border border-[#fdb022] bg-[#fffaeb] p-5">
          <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-[#b54708]">Printy managed</p>
          <h2 class="mt-3 text-xl font-extrabold text-[#101828]">Printy will manage your job</h2>
          <p class="mt-3 text-sm text-[#475467]">{{ emptyMessage }}</p>
          <div class="mt-4 grid gap-3 md:grid-cols-3">
            <div class="rounded-2xl border border-[#fedf89] bg-white p-4 text-sm text-[#475467]">Same pricing guarantee</div>
            <div class="rounded-2xl border border-[#fedf89] bg-white p-4 text-sm text-[#475467]">Proof approval before completion</div>
            <div class="rounded-2xl border border-[#fedf89] bg-white p-4 text-sm text-[#475467]">M-Pesa payment protection</div>
          </div>
          <div class="mt-4">
            <BaseButton variant="primary" size="sm" :loading="submitLoading" @click="submitForManager(fallbackManagerId)">
              Continue with Printy
            </BaseButton>
          </div>
        </div>
      </DashboardSection>
    </div>
  </RoleDashboardFrame>
</template>

<script setup lang="ts">
import BaseAlert from '~/components/base/BaseAlert.vue'
import BaseButton from '~/components/base/BaseButton.vue'
import DashboardSection from '~/components/dashboard/DashboardSection.vue'
import RoleDashboardFrame from '~/components/dashboard/RoleDashboardFrame.vue'
import { fetchCalculatorDraftDetail, fetchRecommendedPrintManagers, submitIntakeRequest } from '~/services/quotes'
import { getApiErrorMessage } from '~/shared/api'

definePageMeta({ layout: false, middleware: 'auth' })

const auth = useAuthStore()
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
    })
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

await loadPage()
</script>
