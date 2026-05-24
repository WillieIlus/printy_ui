<template>
  <RoleDashboardFrame
    title="Partner Workspace"
    badge="Partner"
    :name="displayName"
    :initials="initials"
    subtitle="Role-specific partner flows"
    breadcrumb-root="Dashboard"
    :nav-items="navItems"
    support-title="Market guidance"
    support-copy="These benchmarks are aggregated across active shop rate cards. Individual shop formulas stay hidden."
    support-action="Open Quotes"
    support-to="/dashboard/partner/quotes"
    @logout="auth.logout()"
  >
    <DashboardSection
      title="Market Rate Card"
      subtitle="Production prices from verified Nairobi print shops. Use these as your baseline and add your margin on top."
    >
      <div class="space-y-6">
        <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div class="space-y-2">
              <p class="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">Default markup</p>
              <p class="max-w-2xl text-sm text-slate-600">
                Client pricing on this page is illustrative only. Final payable totals still stay backend-owned in the quote flow.
              </p>
            </div>
            <div class="flex flex-col gap-3 sm:flex-row sm:items-end">
              <label class="flex min-w-[180px] flex-col gap-2 text-sm font-medium text-slate-700">
                <span>Your markup %</span>
                <input
                  v-model.number="markupPercent"
                  type="number"
                  min="0"
                  step="1"
                  class="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-slate-500 focus:bg-white"
                >
              </label>
              <button
                type="button"
                class="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                :disabled="savingMarkup"
                @click="saveDefaultMarkup"
              >
                {{ savingMarkup ? 'Saving...' : 'Save as my default markup' }}
              </button>
            </div>
          </div>
          <p v-if="saveMessage" class="mt-3 text-sm text-emerald-700">{{ saveMessage }}</p>
          <p v-if="pageError" class="mt-3 text-sm text-rose-700">{{ pageError }}</p>
        </div>

        <div v-if="loading" class="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-600">
          Loading market guidance...
        </div>

        <div v-else class="grid gap-5 xl:grid-cols-2">
          <article
            v-for="row in marketRows"
            :key="row.key"
            class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 class="text-lg font-semibold text-slate-900">{{ row.product_label }} - {{ row.paper_name }}</h2>
                <p class="mt-1 text-sm text-slate-600">
                  Based on {{ row.shops_count }} shop<span v-if="row.shops_count !== 1">s</span> - {{ row.sample_job_label }}
                </p>
              </div>
              <span
                class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
                :class="qualityBadgeClass(row.data_quality)"
              >
                {{ qualityBadgeLabel(row.data_quality) }}
              </span>
            </div>

            <div class="mt-5 overflow-hidden rounded-2xl border border-slate-200">
              <table class="min-w-full divide-y divide-slate-200 text-sm">
                <thead class="bg-slate-50 text-left text-slate-500">
                  <tr>
                    <th class="px-4 py-3 font-medium">Mode</th>
                    <th class="px-4 py-3 font-medium">Market median</th>
                    <th class="px-4 py-3 font-medium">Your markup</th>
                    <th class="px-4 py-3 font-medium">Client</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 bg-white">
                  <tr>
                    <td class="px-4 py-4 font-medium text-slate-900">Single-sided</td>
                    <td class="px-4 py-4 text-slate-700">
                      {{ formatMoney(row.market_single?.median_total_100) }}/100
                      <div class="mt-1 text-xs text-slate-500">
                        Median {{ formatMoney(row.market_single?.median_per_unit) }} each - Range
                        {{ formatMoney(row.market_single?.min_total_100) }} to {{ formatMoney(row.market_single?.max_total_100) }}
                      </div>
                    </td>
                    <td class="px-4 py-4 text-slate-700">+{{ normalizedMarkupPercent }}%</td>
                    <td class="px-4 py-4 font-semibold text-slate-900">{{ formatMoney(markedUpTotal(row.market_single?.median_total_100)) }}</td>
                  </tr>
                  <tr>
                    <td class="px-4 py-4 font-medium text-slate-900">Double-sided</td>
                    <td class="px-4 py-4 text-slate-700">
                      <template v-if="row.market_double">
                        {{ formatMoney(row.market_double?.median_total_100) }}/100
                        <div class="mt-1 text-xs text-slate-500">
                          Median {{ formatMoney(row.market_double?.median_per_unit) }} each - Range
                          {{ formatMoney(row.market_double?.min_total_100) }} to {{ formatMoney(row.market_double?.max_total_100) }}
                        </div>
                      </template>
                      <span v-else class="text-slate-400">Single-sided only</span>
                    </td>
                    <td class="px-4 py-4 text-slate-700" :class="{ 'text-slate-400': !row.market_double }">
                      <template v-if="row.market_double">+{{ normalizedMarkupPercent }}%</template>
                      <template v-else>Unavailable</template>
                    </td>
                    <td class="px-4 py-4 font-semibold text-slate-900" :class="{ 'text-slate-400': !row.market_double }">
                      <template v-if="row.market_double">{{ formatMoney(markedUpTotal(row.market_double?.median_total_100)) }}</template>
                      <template v-else>Single-sided only</template>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
              <span class="rounded-full bg-slate-100 px-3 py-1">Confidence: {{ row.confidence_label.replace(/_/g, ' ') }}</span>
              <span class="rounded-full bg-slate-100 px-3 py-1">{{ row.gsm }}gsm</span>
              <span class="rounded-full bg-slate-100 px-3 py-1">{{ row.pieces_per_sheet }} up per sheet</span>
              <span class="rounded-full bg-slate-100 px-3 py-1">{{ row.sheets_needed }} sheet<span v-if="row.sheets_needed !== 1">s</span> for 100</span>
            </div>
            <p class="mt-3 text-sm text-slate-600">{{ row.explanation }}</p>
          </article>
        </div>

        <div class="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
          These are production costs only. Your client pays production + your margin + Printy service fee.
        </div>
      </div>
    </DashboardSection>
  </RoleDashboardFrame>
</template>

<script setup lang="ts">
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
