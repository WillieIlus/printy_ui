<template>
  <div>
    <AdminPageHead
      eyebrow="Money"
      title="Custody"
      lede="Every shilling the marketplace is holding, split by exactly where it is sitting right now."
    >
      <template #meta>
        <span
          class="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono2 text-[9px] uppercase tracking-[0.14em] text-[var(--sub)]"
          :style="{ borderColor: 'var(--line)' }"
        >
          <Wallet :size="12" :style="{ color: 'var(--accent)' }" />
          {{ counts.payments }} payments recorded
        </span>
      </template>
    </AdminPageHead>

    <AdminSection
      icon="wallet"
      tone="warn"
      title="Escrow position"
      subtitle="Held funds are only released when a delivery is confirmed. Awaiting money has not been committed to a shop yet."
    >
      <div class="rounded-2xl border p-5" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
        <div class="flex flex-wrap items-end justify-between gap-4">
          <div>
            <ML>Funds held now</ML>
            <div class="mt-1 font-disp text-[38px] font-bold leading-none tracking-tight" style="color: #F2622E">
              {{ money(custodyTotals.held) }}
            </div>
          </div>
          <div class="text-right">
            <ML>Released</ML>
            <div class="mt-1 font-disp text-[22px] font-bold leading-none" style="color: #0E7A45">
              {{ money(custodyTotals.released) }}
            </div>
            <div class="mt-1 font-mono2 text-[9px] uppercase tracking-[0.12em] text-[var(--sub)]">
              awaiting {{ money(custodyTotals.awaiting) }}
            </div>
          </div>
        </div>
        <div class="mt-5">
          <CustodyBar :held="custodyTotals.held" :released="custodyTotals.released" :awaiting="custodyTotals.awaiting" />
        </div>
      </div>
    </AdminSection>

    <AdminSection
      icon="lock"
      tone="accent"
      title="Held in escrow"
      :count="heldJobs.length"
      subtitle="Paid for and locked. The printer only gets this money once the buyer confirms delivery."
    >
      <AdminJobList :jobs="heldJobs" empty-copy="Nothing is sitting in escrow." @open="openJob" />
    </AdminSection>

    <AdminSection
      icon="file-text"
      tone="neutral"
      title="Awaiting payment"
      :count="awaitingPaymentJobs.length"
      subtitle="Quoted or approved but not yet paid. These jobs cannot be dispatched to a shop."
    >
      <AdminJobList :jobs="awaitingPaymentJobs" partner="manager" empty-copy="Nothing is waiting on a payment." @open="openJob" />
    </AdminSection>

    <AdminSection
      icon="badge-check"
      tone="good"
      title="Released to printers"
      :count="releasedJobs.length"
      subtitle="Delivered, signed off and paid out. Historical record of settled work."
    >
      <AdminJobList :jobs="releasedJobs" empty-copy="Nothing has been released yet." @open="openJob" />
    </AdminSection>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Wallet } from 'lucide-vue-next'
import { money, type Job } from '~/shared/workflow/printy'

const { admins, workflow, counts, custodyTotals } = useAdminNav()

const heldJobs = computed(() => workflow.jobs.filter((job) => job.custody === 'held'))
const awaitingPaymentJobs = computed(() => workflow.jobs.filter((job) => job.custody === 'awaiting'))
const releasedJobs = computed(() => workflow.jobs.filter((job) => job.custody === 'released'))

function openJob(job: Job) {
  admins.clearFocus()
  workflow.act('open-job', job)
}
</script>