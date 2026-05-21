<template>
  <UiCard class="space-y-5">
    <div>
      <p class="text-sm font-semibold uppercase tracking-[0.18em] text-primary-600">Transparent marketplace pricing breakdown</p>
      <h3 class="mt-2 text-2xl font-black text-slate-950">Your production price stays separate. Printy adds the broker and service margins before showing the client price.</h3>
      <p class="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{{ note }}</p>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p class="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Preview quote</p>
        <p class="mt-2 text-3xl font-black text-slate-950">{{ money(clientPrice) }}</p>
        <p class="mt-1 text-sm text-slate-500">Client-facing total from the backend pricing settings.</p>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white p-4">
        <p class="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Production assumptions</p>
        <p class="mt-2 text-sm text-slate-800">Sheets required: {{ example.sheets_needed ?? '-' }}</p>
        <p class="mt-1 text-sm text-slate-800">Paper: {{ example.paper_label || 'Awaiting paper setup' }}</p>
        <p class="mt-1 text-sm text-slate-800">Status: {{ example.status_text || 'No preview yet.' }}</p>
      </div>
    </div>

    <div class="overflow-hidden rounded-2xl border border-slate-200">
      <div class="grid gap-px bg-slate-200 md:grid-cols-4">
        <div v-for="item in breakdownCards" :key="item.label" class="bg-white px-4 py-4">
          <p class="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{{ item.label }}</p>
          <p class="mt-2 text-xl font-black text-slate-950">{{ money(item.value) }}</p>
          <p class="mt-1 text-xs text-slate-500">{{ item.meta }}</p>
        </div>
      </div>
    </div>

    <div v-if="lineItems.length" class="rounded-2xl border border-slate-200 bg-white">
      <div class="border-b border-slate-200 px-4 py-3">
        <p class="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Production lines</p>
      </div>
      <div v-for="item in lineItems" :key="item.label" class="flex items-start justify-between gap-4 border-t border-slate-100 px-4 py-4 text-sm first:border-t-0">
        <div>
          <p class="font-semibold text-slate-900">{{ item.label }}</p>
          <p v-if="item.detail" class="mt-1 text-xs text-slate-500">{{ item.detail }}</p>
        </div>
        <span class="font-semibold text-slate-950">{{ money(item.total) }}</span>
      </div>
    </div>
  </UiCard>
</template>

<script setup lang="ts">
import UiCard from '~/components/ui/UiCard.vue'

const props = defineProps<{
  preview: Record<string, any> | null
}>()

const example = computed(() => props.preview?.example_quote || {})
const pricing = computed(() => example.value?.pricing_breakdown || props.preview?.pricing_breakdown || {})
const note = computed(() => {
  if (pricing.value?.broker_margin_percent && pricing.value?.service_margin_percent) {
    return `Current default margins are ${pricing.value.broker_margin_percent}% broker and ${pricing.value.service_margin_percent}% service.`
  }
  return 'No preview yet. The backend will return the pricing breakdown once the rate card preview is ready.'
})
const clientPrice = computed(() => pricing.value?.client_price || example.value?.estimated_total || null)
const breakdownCards = computed(() => [
  {
    label: 'Your shop price',
    value: pricing.value?.base_price || example.value?.production_cost,
    meta: 'Base production price',
  },
  {
    label: 'Broker margin',
    value: pricing.value?.broker_margin_amount,
    meta: `${pricing.value?.broker_margin_percent || 30}%`,
  },
  {
    label: 'Printy service',
    value: pricing.value?.service_margin_amount,
    meta: `${pricing.value?.service_margin_percent || 30}%`,
  },
  {
    label: 'Client price',
    value: clientPrice.value,
    meta: 'Final client-facing price',
  },
])
const lineItems = computed(() => Array.isArray(example.value?.line_items) ? example.value.line_items : [])

function money(value: unknown) {
  if (value === null || value === undefined || value === '') {
    return 'KES -'
  }
  const amount = Number(String(value).replace(/[^0-9.-]/g, ''))
  if (!Number.isFinite(amount)) {
    return 'KES -'
  }
  return `KES ${new Intl.NumberFormat('en-KE').format(Math.round(amount))}`
}
</script>
