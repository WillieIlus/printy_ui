<template>
  <UiCard class="overflow-hidden border-slate-900/10 bg-white p-0">
    <div class="border-b border-slate-200 bg-slate-50 px-6 py-5 sm:px-7">
      <div class="flex items-center justify-between gap-3">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Estimate result</p>
          <h3 class="mt-2 text-xl font-black tracking-tight text-slate-950">Production assumptions and KES output</h3>
        </div>
        <StatusBadge :value="preview.price_mode || 'estimated'" />
      </div>
    </div>

    <div class="px-6 py-6 sm:px-7">
      <div>
        <p class="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Estimate</p>
        <div class="mt-3 text-4xl font-black tracking-tight text-slate-950">
          <MoneyText :value="preview.total || preview.min_price || '-'" />
        </div>
        <p class="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{{ summary }}</p>
      </div>

      <div class="mt-6 grid gap-3 md:grid-cols-2">
        <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Production math</p>
          <p class="mt-3 text-sm text-slate-800">Pieces per sheet: {{ preview.production_preview?.pieces_per_sheet ?? '-' }}</p>
          <p class="mt-1 text-sm text-slate-800">Sheets required: {{ preview.production_preview?.sheets_required ?? '-' }}</p>
          <p class="mt-1 text-sm text-slate-800">Parent sheet: {{ preview.production_preview?.parent_sheet ?? '-' }}</p>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white p-4">
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Trust note</p>
          <p class="mt-3 text-sm leading-6 text-slate-700">Backend pricing stays in control. The frontend only makes the production brief clearer and easier to act on.</p>
        </div>
      </div>

      <div v-if="preview.pricing_breakdown?.lines?.length" class="mt-6 rounded-2xl border border-slate-200 bg-white">
        <div class="border-b border-slate-200 px-4 py-3">
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Breakdown</p>
        </div>
        <div v-for="line in preview.pricing_breakdown.lines" :key="line.label" class="flex items-start justify-between gap-4 border-t border-slate-100 px-4 py-4 text-sm first:border-t-0">
          <div>
            <p class="font-semibold text-slate-900">{{ line.label }}</p>
            <p v-if="line.formula" class="mt-1 text-xs text-slate-500">{{ line.formula }}</p>
          </div>
          <span class="font-semibold text-slate-950">{{ line.amount }}</span>
        </div>
      </div>
    </div>
  </UiCard>
</template>

<script setup lang="ts">
import MoneyText from '~/components/ui/MoneyText.vue'
import StatusBadge from '~/components/ui/UiStatusBadge.vue'
import UiCard from '~/components/ui/UiCard.vue'

const props = defineProps<{
  preview: Record<string, any>
}>()

const summary = computed(() => props.preview.summary || 'Set the quantity, stock, sides, and size to preview an instant KES estimate from the Django pricing backend.')
</script>
