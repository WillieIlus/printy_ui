<template>
  <div class="flex flex-col gap-8">
    <DesignAdminPageHeader
      index="CU"
      kicker="Money"
      title="Custody"
      description="Every shilling the marketplace is holding, split by exactly where it is sitting right now."
    >
      <template #actions>
        <span class="inline-flex items-center gap-2 rounded-full border border-line bg-card px-3 py-1.5 font-mono text-[9px] tracking-[0.1em] text-ink-2 uppercase">
          <component :is="getIcon('Banknote')" class="h-3.5 w-3.5 text-brand" :stroke-width="2" />
          {{ counts.payments }} payments recorded
        </span>
      </template>
    </DesignAdminPageHeader>

    <DesignAdminSection
      index="01"
      title="Escrow position"
      hint="held funds release only when delivery is confirmed"
    >
      <DesignCard class="p-6">
        <div class="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p class="font-mono text-[10px] font-medium tracking-[0.16em] text-ink-3 uppercase">Funds held now</p>
            <p class="mt-1 tabular font-mono text-2xl font-semibold tracking-tight text-brand">{{ money(custodyTotals.held) }}</p>
            <p class="mt-1 text-[13px] text-ink-2">awaiting money has not been committed to a shop yet</p>
          </div>
          <div class="text-right">
            <p class="font-mono text-[10px] font-medium tracking-[0.16em] text-ink-3 uppercase">Released</p>
            <p class="mt-1 tabular font-mono text-xl font-semibold text-green">{{ money(custodyTotals.released) }}</p>
            <p class="mt-1 font-mono text-[9px] tracking-[0.1em] text-ink-3 uppercase">awaiting {{ money(custodyTotals.awaiting) }}</p>
          </div>
        </div>
        <div class="mt-5">
          <DesignAdminCustodyBar :held="custodyTotals.held" :released="custodyTotals.released" :awaiting="custodyTotals.awaiting" />
        </div>
      </DesignCard>
    </DesignAdminSection>

    <DesignAdminSection
      index="02"
      title="Held in escrow"
      :count="heldJobs.length"
      hint="paid for and locked until the buyer confirms delivery"
    >
      <DesignAdminJobList :jobs="heldJobs" empty-copy="Nothing is sitting in escrow." @open="openJob" />
    </DesignAdminSection>

    <DesignAdminSection
      index="03"
      title="Awaiting payment"
      :count="awaitingPaymentJobs.length"
      hint="quoted or approved but not paid — cannot be dispatched"
    >
      <DesignAdminJobList :jobs="awaitingPaymentJobs" partner="manager" empty-copy="Nothing is waiting on a payment." @open="openJob" />
    </DesignAdminSection>

    <DesignAdminSection
      index="04"
      title="Released to printers"
      :count="releasedJobs.length"
      hint="delivered, signed off and paid out"
    >
      <DesignAdminJobList :jobs="releasedJobs" empty-copy="Nothing has been released yet." @open="openJob" />
    </DesignAdminSection>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getIcon } from '~/utils/design/icon-registry'
import { money, type Job } from '~/shared/workflow/printy'
import DesignAdminCustodyBar from '~/components/design/admin/AdminCustodyBar.vue'
import DesignAdminJobList from '~/components/design/admin/AdminJobList.vue'
import DesignAdminPageHeader from '~/components/design/admin/AdminPageHeader.vue'
import DesignAdminSection from '~/components/design/admin/AdminSection.vue'
import DesignCard from '~/components/design/ui/Card.vue'

const { admins, workflow, counts, custodyTotals } = useAdminNav()

const heldJobs = computed(() => workflow.jobs.filter(job => job.custody === 'held'))
const awaitingPaymentJobs = computed(() => workflow.jobs.filter(job => job.custody === 'awaiting'))
const releasedJobs = computed(() => workflow.jobs.filter(job => job.custody === 'released'))

function openJob(job: Job) {
  admins.clearFocus()
  workflow.act('open-job', job)
}
</script>
