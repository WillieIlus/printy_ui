<template>
  <article class="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.05)]">
    <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">Delivery status</p>
    <h3 class="mt-2 text-base font-semibold text-slate-950">Handoff and completion</h3>
    <p class="mt-4 text-sm leading-6 text-slate-500">{{ copy }}</p>
    <div class="mt-5 grid gap-3 md:grid-cols-2">
      <SafePriceBlock label="Fulfillment" :value="fulfillment" caption="How this job will be handed over or delivered." />
      <SafePriceBlock label="Latest event" :value="latestEvent" caption="The most recent update on this job." />
    </div>
  </article>
</template>

<script setup lang="ts">
import type { ManagedJobEventRecord, ManagedJobRecord } from '~/stores/workflowSpine'
import SafePriceBlock from '~/components/workflow/SafePriceBlock.vue'
import { humanizeWorkflowValue } from '~/utils/workflowUi'

const props = defineProps<{
  job: ManagedJobRecord
  events: ManagedJobEventRecord[]
}>()

const fulfillment = computed(() => humanizeWorkflowValue((props.job as ManagedJobRecord & { fulfillment_mode?: string }).fulfillment_mode || 'managed delivery'))
const latestEvent = computed(() => props.events[0]?.summary || humanizeWorkflowValue(props.job.status))
const copy = computed(() => 'Printy coordinates delivery and completion updates so you always know what happens next.')
</script>
