<script setup lang="ts">
import { computed } from 'vue'
import { getIcon } from '~/utils/design/icon-registry'
import { cx } from '~/utils/design/cx'
import DesignAdminCustodyChip from './AdminCustodyChip.vue'
import DesignAdminStatusPill from './AdminStatusPill.vue'
import { STAGES, money, stIdx, type Job } from '~/shared/workflow/printy'

/**
 * Design restyle of the admin job row. It renders only values already present
 * on the workflow Job object and emits the same open event as before.
 */
const props = withDefaults(defineProps<{
  job: Job
  partner?: string | null
  custody?: boolean
  alert?: boolean
}>(), {
  partner: null,
  custody: true,
  alert: false,
})

const emit = defineEmits<{ open: [job: Job] }>()

const stageLabel = computed(() => STAGES[stIdx(props.job.stage)]?.label ?? props.job.stage)
const buyerLabel = computed(() => props.job.buyerCompany || props.job.buyerName)
const partnerLabel = computed(() => props.partner ?? null)
</script>

<template>
  <div
    data-test="admin-job-row"
    :class="cx(
      'group flex flex-wrap items-center gap-x-4 gap-y-3 rounded-xl border bg-card px-4 py-3.5 transition-colors hover:border-line-strong',
      props.alert ? 'border-red/45' : 'border-line',
    )"
  >
    <div class="min-w-0 flex-1">
      <div class="flex flex-wrap items-center gap-2">
        <button
          type="button"
          class="font-mono text-[11px] font-semibold tracking-[0.08em] text-brand underline-offset-4 hover:underline"
          @click="emit('open', props.job)"
        >
          {{ props.job.code }}
        </button>
        <DesignAdminStatusPill :status="props.job.status" />
        <DesignAdminCustodyChip v-if="props.custody" :custody="props.job.custody" />
      </div>

      <button type="button" class="mt-1.5 block max-w-full text-left" @click="emit('open', props.job)">
        <span class="block truncate text-[14px] font-semibold tracking-tight text-ink">{{ props.job.title }}</span>
        <span class="mt-0.5 block truncate text-[12px] text-ink-2">
          {{ buyerLabel }}<span v-if="partnerLabel"> · {{ partnerLabel }}</span> · {{ stageLabel }}
        </span>
      </button>
    </div>

    <div class="flex shrink-0 items-center gap-3">
      <div class="text-right">
        <div class="tabular font-mono text-[15px] font-semibold text-ink">{{ money(props.job.value) }}</div>
        <div class="mt-1 font-mono text-[8.5px] tracking-[0.1em] text-ink-3 uppercase">{{ props.job.qty.toLocaleString() }} units</div>
      </div>
      <slot name="actions" />
      <component :is="getIcon('ChevronRight')" class="h-4 w-4 shrink-0 text-ink-3 transition-transform group-hover:translate-x-0.5" :stroke-width="1.9" />
    </div>
  </div>
</template>
