
<script setup lang="ts">
import { callWithNuxt } from '#app'
import BaseAlert from '~/components/base/BaseAlert.vue'
import BaseButton from '~/components/base/BaseButton.vue'
import DashboardPageHeader from '~/components/dashboard/DashboardPageHeader.vue'
import DashboardSection from '~/components/dashboard/DashboardSection.vue'
import RoleDashboardFrame from '~/components/dashboard/RoleDashboardFrame.vue'
import { fetchPrintshopJobBreakdown } from '~/services/production'
import { getApiErrorMessage } from '~/shared/api'

definePageMeta({ layout: false, middleware: 'auth' })

const nuxtApp = useNuxtApp()
const auth = useAuthStore()
if (!auth.canAccessProductionDashboard) {
  await callWithNuxt(nuxtApp, navigateTo, [auth.homeRoute])
}

const route = useRoute()
const jobId = computed(() => String(route.params.id || ''))
const displayName = computed(() => auth.user?.name || auth.user?.email || 'Production')
const initials = computed(() => displayName.value.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase() || 'PD')
const navItems = computed(() => [{ label: 'Assignments', to: '/dashboard/production/assignments', active: false }])
const pageError = ref('')
const breakdown = ref<Record<string, any> | null>(null)

try {
  breakdown.value = await fetchPrintshopJobBreakdown(jobId.value)
} catch (error: unknown) {
  pageError.value = getApiErrorMessage(error, 'We could not load the production breakdown.')
}

const specRows = computed(() => {
  const specs = breakdown.value?.specs || {}
  const size = specs.size || {}
  const paper = specs.paper || {}
  const print = specs.print || {}
  const finishing = Array.isArray(specs.finishing) && specs.finishing.length
    ? specs.finishing.map((item: Record<string, any>) => `${item.slug} (${item.sides})`).join(', ')
    : 'None'
  return [
    { label: 'Product', value: humanize(specs.product_type) },
    { label: 'Quantity', value: `${specs.quantity || 0} pieces` },
    { label: 'Size', value: `${size.width_mm || 0} x ${size.height_mm || 0} mm` },
    { label: 'Paper', value: `${paper.gsm || ''}gsm ${paper.type || ''}`.trim() || 'Not specified' },
    { label: 'Print', value: `${humanize(print.sides)} / ${humanize(print.color_mode)}` },
    { label: 'Finishing', value: finishing },
  ]
})

function humanize(value: unknown) {
  return String(value || 'Not specified').replace(/[_-]+/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
}

function formatMoney(value: unknown) {
  const amount = Number(value)
  if (!Number.isFinite(amount)) return 'KES 0'
  return `KES ${amount.toLocaleString('en-KE', { maximumFractionDigits: 2 })}`
}
</script>

<template>
  <main class="min-h-screen bg-slate-50 px-6 py-8">
    <section class="mx-auto max-w-6xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p class="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Print shop</p>
      <h1 class="mt-3 text-2xl font-bold text-slate-900">Job breakdown {{ jobId }}</h1>
      <p v-if="pageError" class="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{{ pageError }}</p>
      <dl v-else class="mt-6 grid gap-3 sm:grid-cols-2">
        <div v-for="row in specRows" :key="row.label" class="rounded-lg border border-slate-200 p-4">
          <dt class="text-xs font-semibold uppercase tracking-wide text-slate-400">{{ row.label }}</dt>
          <dd class="mt-1 text-sm font-semibold text-slate-900">{{ row.value }}</dd>
        </div>
      </dl>
      <p class="mt-5 text-sm text-slate-500">Total: {{ formatMoney(breakdown?.total_cost) }}</p>
    </section>
  </main>
</template>
