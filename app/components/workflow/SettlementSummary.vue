<template>
  <article class="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-[0_12px_34px_rgba(15,23,42,0.05)]">
    <div class="flex items-center justify-between gap-3">
      <div>
        <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">{{ eyebrow }}</p>
        <h3 class="mt-2 text-base font-semibold text-slate-950">{{ title }}</h3>
      </div>
      <slot name="badge" />
    </div>

    <div class="mt-5 grid gap-3 md:grid-cols-3">
      <div
        v-for="item in items"
        :key="item.label"
        class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4"
      >
        <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">{{ item.label }}</p>
        <p class="mt-2 text-lg font-semibold text-slate-950">{{ item.value }}</p>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { JobSettlementRecord } from '~/stores/workflowSpine'
import { summarizeSettlement } from '~/utils/workflowUi'

const props = withDefaults(defineProps<{
  settlement?: JobSettlementRecord | null
  audience?: 'client' | 'partner' | 'shop'
  eyebrow?: string
  title?: string
}>(), {
  audience: 'client',
  eyebrow: 'Payment record',
  title: 'Payment summary',
})

const items = computed(() => summarizeSettlement(props.settlement, props.audience))
</script>
