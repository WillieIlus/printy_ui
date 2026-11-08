<script setup lang="ts">
import DesignAdminCustodyChip from './AdminCustodyChip.vue'
import DesignAdminStatusPill from './AdminStatusPill.vue'
import DesignEmptyNote from '../ui/EmptyNote.vue'
import { STAGES, mgr, money, prn, type Job } from '~/shared/workflow/printy'

/**
 * Full-width admin ledger in the design table language. The design's print
 * cost / margin / payout / escrow columns have no per-job API fields in
 * Printy, so the table renders only the real job fields and the gap is logged
 * as NO_DATA.
 */
const props = defineProps<{ jobs: Job[] }>()

const emit = defineEmits<{ open: [job: Job] }>()

function stageLabel(job: Job) {
  return STAGES.find(stage => stage.key === job.stage)?.label ?? job.stage
}

function managerName(job: Job) {
  return mgr(job.managerId)?.name ?? '—'
}

function shopName(job: Job) {
  return prn(job.printerId)?.name ?? '—'
}
</script>

<template>
  <div v-if="props.jobs.length" class="overflow-hidden rounded-xl border border-line">
    <div class="overflow-x-auto">
      <table class="w-full min-w-[940px] border-collapse text-left">
        <thead>
          <tr class="border-b border-line bg-paper-2/70">
            <th class="px-4 py-3 font-mono text-[10px] font-semibold tracking-[0.14em] text-ink-3 uppercase">Job</th>
            <th class="px-4 py-3 font-mono text-[10px] font-semibold tracking-[0.14em] text-ink-3 uppercase">Client</th>
            <th class="px-4 py-3 font-mono text-[10px] font-semibold tracking-[0.14em] text-ink-3 uppercase">Manager</th>
            <th class="px-4 py-3 font-mono text-[10px] font-semibold tracking-[0.14em] text-ink-3 uppercase">Shop</th>
            <th class="px-4 py-3 font-mono text-[10px] font-semibold tracking-[0.14em] text-ink-3 uppercase">Stage</th>
            <th class="px-4 py-3 font-mono text-[10px] font-semibold tracking-[0.14em] text-ink-3 uppercase">Status</th>
            <th class="px-4 py-3 font-mono text-[10px] font-semibold tracking-[0.14em] text-ink-3 uppercase">Custody</th>
            <th class="px-4 py-3 text-right font-mono text-[10px] font-semibold tracking-[0.14em] text-ink-3 uppercase">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="job in props.jobs" :key="job.id" class="border-b border-line/60 last:border-b-0 hover:bg-paper-2/50">
            <td class="px-4 py-3.5 align-top">
              <button
                type="button"
                class="tabular font-mono text-[12.5px] font-semibold text-brand underline-offset-4 hover:underline"
                @click="emit('open', job)"
              >
                {{ job.code }}
              </button>
              <span class="block text-[11.5px] text-ink-3">{{ job.title }}</span>
            </td>
            <td class="px-4 py-3.5 align-top text-[13px]">{{ job.buyerCompany || job.buyerName }}</td>
            <td class="px-4 py-3.5 align-top text-[13px] text-ink-2">{{ managerName(job) }}</td>
            <td class="px-4 py-3.5 align-top text-[13px] text-ink-2">{{ shopName(job) }}</td>
            <td class="px-4 py-3.5 align-top font-mono text-[12px] whitespace-nowrap text-ink-2">{{ stageLabel(job) }}</td>
            <td class="px-4 py-3.5 align-top"><DesignAdminStatusPill :status="job.status" /></td>
            <td class="px-4 py-3.5 align-top"><DesignAdminCustodyChip :custody="job.custody" /></td>
            <td class="tabular px-4 py-3.5 align-top text-right font-mono text-[13px] font-semibold">{{ money(job.value) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <DesignEmptyNote v-else title="No jobs on the marketplace yet." />
</template>
