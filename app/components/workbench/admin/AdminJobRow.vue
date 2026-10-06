<template>
  <div
    class="group flex flex-wrap items-center gap-x-3 gap-y-2 rounded-2xl border p-3.5 transition-colors hover:border-[var(--accent)]"
    :style="{ borderColor: rowBorder, background: 'var(--panel)' }"
  >
    <div class="min-w-0 flex-1">
      <div class="flex flex-wrap items-center gap-2">
        <button
          type="button"
          class="font-mono2 text-[10px] font-semibold tracking-[0.12em] text-[var(--accent)] underline-offset-4 hover:underline"
          @click="emit('open', job)"
        >
          {{ job.code }}
        </button>
        <StatusPill :status="job.status" size="sm" />
        <span
          v-if="custody !== false"
          class="rounded-full px-2 py-[2px] font-mono2 text-[8.5px] uppercase tracking-[0.12em]"
          :style="{ background: `${custodyMeta.color}1F`, color: custodyMeta.color }"
        >
          {{ custodyMeta.label }}
        </span>
      </div>

      <button type="button" class="mt-1.5 block max-w-full text-left" @click="emit('open', job)">
        <span class="block truncate font-disp text-[14px] font-bold tracking-tight">{{ job.title }}</span>
        <span class="mt-0.5 block truncate text-[11.5px] text-[var(--sub)]">
          {{ job.buyerCompany || job.buyerName }}<span v-if="partnerLabel"> · {{ partnerLabel }}</span> · {{ STAGES[stIdx(job.stage)]?.label }}
        </span>
      </button>
    </div>

    <div class="flex shrink-0 items-center gap-3">
      <div class="text-right">
        <div class="font-disp text-[15px] font-bold leading-none">{{ money(job.value) }}</div>
        <div class="mt-1 font-mono2 text-[8.5px] uppercase tracking-[0.12em] text-[var(--sub)]">{{ job.qty.toLocaleString() }} units</div>
      </div>
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { STAGES, stIdx, money, type Job } from '~/shared/workflow/printy'
import { CUSTODY_META } from '~/shared/admin-nav'

const props = withDefaults(defineProps<{
  job: Job
  partner?: string | null
  custody?: boolean
  alert?: boolean
}>(), { partner: null, custody: true, alert: false })

const emit = defineEmits<{ open: [job: Job] }>()

const custodyMeta = computed(() => CUSTODY_META[props.job.custody])
const partnerLabel = computed(() => props.partner ?? null)
const rowBorder = computed(() => {
  if (props.alert) return 'rgba(251,77,109,.45)'
  return 'var(--line)'
})
</script>