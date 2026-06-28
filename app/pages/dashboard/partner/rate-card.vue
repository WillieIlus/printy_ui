<script setup lang="ts">
import DashboardPageHeader from '~/components/dashboard/DashboardPageHeader.vue'
import DashboardSection from '~/components/dashboard/DashboardSection.vue'
import RoleDashboardFrame from '~/components/dashboard/RoleDashboardFrame.vue'
import { fetchPartnerMarketRates, updatePartnerDefaultMarkupRate } from '~/services/partner'
import { getApiErrorMessage } from '~/shared/api'

definePageMeta({ layout: false, middleware: 'auth' })

const auth = useAuthStore()
if (!auth.canAccessPartnerDashboard) {
  await navigateTo(auth.homeRoute)
}

const loading = ref(true)
const savingMarkup = ref(false)
const pageError = ref('')
const saveMessage = ref('')
const marketRows = ref<Array<Record<string, any>>>([])
const markupPercent = ref(30)
const lastUpdatedRaw = ref('')

const displayName = computed(() => auth.user?.name || auth.user?.email || 'Partner')
const initials = computed(() => displayName.value.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase() || 'PT')
const navItems = computed(() => [
  { label: 'Overview', to: '/dashboard/partner' },
  { label: 'Quotes', to: '/dashboard/partner/quotes' },
  { label: 'Jobs', to: '/dashboard/partner/jobs' },
  { label: 'Clients', to: '/dashboard/partner/clients' },
  { label: 'Shops', to: '/dashboard/partner/production-shops' },
  { label: 'Rate Card', to: '/dashboard/partner/rate-card', active: true },
  { label: 'Messages', to: '/dashboard/partner/messages' },
])
const normalizedMarkupPercent = computed(() => Math.max(0, Number(markupPercent.value || 0)))
const lastUpdatedLabel = computed(() => {
  if (!lastUpdatedRaw.value) return 'Live when market rates are loaded'
  const date = new Date(lastUpdatedRaw.value)
  if (Number.isNaN(date.getTime())) return String(lastUpdatedRaw.value)
  return new Intl.DateTimeFormat('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
})

function formatMoney(value: string | number | null | undefined) {
  const numeric = Number(value || 0)
  return `KES ${numeric.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function markedUpTotal(value: string | number | null | undefined) {
  const numeric = Number(value || 0)
  return numeric * (1 + normalizedMarkupPercent.value / 100)
}

function qualityBadgeLabel(quality: string) {
  if (quality === 'good') return 'Live market data'
  if (quality === 'limited') return 'Limited data'
  return 'Estimated'
}

function qualityBadgeClass(quality: string) {
  if (quality === 'good') return 'bg-teal-100 text-teal-700'
  if (quality === 'limited') return 'bg-amber-100 text-amber-700'
  return 'bg-slate-200 text-slate-700'
}

async function loadMarketRates() {
  pageError.value = ''
  loading.value = true
  try {
    const response = await fetchPartnerMarketRates()
    marketRows.value = Array.isArray(response?.results) ? response.results : []
    lastUpdatedRaw.value = String(response?.last_updated || response?.updated_at || response?.generated_at || '')
    const defaultRate = Number(response?.default_markup_rate || 0.3)
    markupPercent.value = Number.isFinite(defaultRate) ? Math.round(defaultRate * 100) : 30
  } catch (error: unknown) {
    pageError.value = getApiErrorMessage(error, 'We could not load market guidance.')
  } finally {
    loading.value = false
  }
}

async function saveDefaultMarkup() {
  saveMessage.value = ''
  pageError.value = ''
  savingMarkup.value = true
  try {
    const payload = await updatePartnerDefaultMarkupRate((normalizedMarkupPercent.value / 100).toFixed(2))
    const savedRate = Number(payload?.default_markup_rate || normalizedMarkupPercent.value / 100)
    markupPercent.value = Math.round(savedRate * 100)
    saveMessage.value = 'Default markup saved.'
  } catch (error: unknown) {
    pageError.value = getApiErrorMessage(error, 'We could not save your default markup.')
  } finally {
    savingMarkup.value = false
  }
}

await loadMarketRates()
</script>

<template>
  <main class="min-h-screen bg-slate-50 px-6 py-8">
    <section class="mx-auto max-w-6xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p class="text-sm font-semibold uppercase tracking-[0.2em] text-purple-600">Partner</p>
      <h1 class="mt-3 text-2xl font-bold text-slate-900">Rate card</h1>
      <p class="mt-2 text-sm text-slate-600">Manage pricing references and production rates from this workspace.</p>
    </section>
  </main>
</template>
