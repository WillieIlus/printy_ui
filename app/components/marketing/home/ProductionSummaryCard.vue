<template>
  <article class="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.05)]">
    <div class="flex items-center justify-between gap-3">
      <div>
        <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">Production summary</p>
        <h3 class="mt-2 text-lg font-semibold tracking-tight text-slate-950">Production summary</h3>
      </div>
      <VerifiedPartnerBadge />
    </div>

    <p class="mt-4 text-sm leading-6 text-slate-500">{{ summary }}</p>

    <div class="mt-5 grid gap-3 md:grid-cols-2">
      <div
        v-for="item in bullets"
        :key="item.label"
        class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4"
      >
        <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">{{ item.label }}</p>
        <p class="mt-2 text-sm font-semibold text-slate-950">{{ item.value }}</p>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { ProductionPreview } from '~/types/api/calculator'
import VerifiedPartnerBadge from '~/components/marketing/home/VerifiedPartnerBadge.vue'
import { summarizeProductionPreview } from '~/utils/workflowUi'

const props = defineProps<{
  productionPreview?: ProductionPreview | null
  summary: string
}>()

const bullets = computed(() => [
  {
    label: 'Imposition',
    value: summarizeProductionPreview(props.productionPreview, 'Imposition details are confirmed after artwork review.'),
  },
  {
    label: 'Finishings',
    value: props.productionPreview?.selected_finishings?.length
      ? props.productionPreview.selected_finishings.join(', ')
      : 'Finishing details will be confirmed in the exact quote.',
  },
])
</script>
