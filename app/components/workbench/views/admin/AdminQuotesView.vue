<template>
  <div class="flex flex-col gap-8">
    <DesignAdminPageHeader
      index="QT"
      kicker="Pricing pipeline"
      title="Quotes"
      description="Two separate queues. Requests that have no number attached yet, and everything that already carries a priced offer."
    >
      <template #actions>
        <span class="inline-flex items-center gap-2 rounded-full border border-line bg-card px-3 py-1.5 font-mono text-[9px] tracking-[0.1em] text-ink-2 uppercase">
          <component :is="getIcon('ReceiptText')" class="h-3.5 w-3.5 text-brand" :stroke-width="2" />
          {{ counts.quote_requests }} requests · {{ counts.quotes }} quotes
        </span>
      </template>
    </DesignAdminPageHeader>

    <DesignAdminSection
      index="01"
      title="Awaiting quotes"
      :count="awaitingQuotes.length"
      hint="a manager still owes the client a number"
    >
      <template #action>
        <span class="font-mono text-[9px] tracking-[0.1em] text-ink-3 uppercase">
          {{ awaitingQuotes.length ? `oldest · ${awaitingQuotes[0]?.code}` : 'queue clear' }}
        </span>
      </template>

      <DesignAdminJobList :jobs="awaitingQuotes" empty-copy="Every quote request on the marketplace has a priced offer behind it." @open="openJob">
        <template #actions="{ job }">
          <span :class="['rounded-full px-2.5 py-1 font-mono text-[9px] tracking-[0.08em] uppercase', waitingClass(job)]">
            {{ waitingLabel(job) }}
          </span>
        </template>
      </DesignAdminJobList>
    </DesignAdminSection>

    <DesignAdminSection
      index="02"
      title="Quoted items"
      :count="quotedItems.length"
      hint="priced offers and paid work, split by where the money sits"
    >
      <template #action>
        <div class="flex flex-wrap items-center gap-1.5">
          <span
            v-for="bucket in quotedBuckets"
            :key="bucket.key"
            :class="['rounded-full border px-2.5 py-1 font-mono text-[9px] font-semibold tracking-[0.08em] uppercase', bucket.class]"
          >
            {{ bucket.label }} {{ bucket.count }}
          </span>
        </div>
      </template>

      <DesignAdminJobList :jobs="quotedItems" empty-copy="No priced offers on the marketplace yet." @open="openJob">
        <template #actions="{ job }">
          <NuxtLink
            v-if="job.printerId"
            :to="{ path: '/app/admin/printers', query: { focus: job.printerId } }"
            class="font-mono text-[9px] tracking-[0.08em] text-ink-3 uppercase underline-offset-4 transition-colors hover:text-brand hover:underline"
          >
            {{ printerName(job.printerId) }}
          </NuxtLink>
        </template>
      </DesignAdminJobList>
    </DesignAdminSection>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getIcon } from '~/utils/design/icon-registry'
import { prn, STAGES, slaRatio, type Job } from '~/shared/workflow/printy'
import DesignAdminJobList from '~/components/design/admin/AdminJobList.vue'
import DesignAdminPageHeader from '~/components/design/admin/AdminPageHeader.vue'
import DesignAdminSection from '~/components/design/admin/AdminSection.vue'

const { admins, workflow, counts, awaitingQuotes, quotedItems } = useAdminNav()

const quotedBuckets = computed(() => [
  { key: 'awaiting', label: 'Awaiting payment', class: 'border-amber/45 bg-amber-soft text-amber', count: quotedItems.value.filter(job => job.custody === 'awaiting').length },
  { key: 'held', label: 'In escrow', class: 'border-brand/35 bg-mint text-brand-deep', count: quotedItems.value.filter(job => job.custody === 'held').length },
  { key: 'released', label: 'Released', class: 'border-green/40 bg-green-soft text-green', count: quotedItems.value.filter(job => job.custody === 'released').length },
])

const printerName = (printerId: string) => prn(printerId)?.name ?? null

function waitingLabel(job: Job) {
  const stage = STAGES.find(item => item.key === job.stage)?.label ?? job.stage
  return `at ${stage.toLowerCase()} · ${Math.round(slaRatio(job) * 100)}% of SLA`
}

function waitingClass(job: Job) {
  const ratio = slaRatio(job)
  if (ratio >= 1) return 'border-red/40 bg-red-soft text-red'
  if (ratio >= 0.65) return 'border-amber/45 bg-amber-soft text-amber'
  return 'border-line bg-paper-2 text-ink-2'
}

function openJob(job: Job) {
  admins.clearFocus()
  workflow.act('open-job', job)
}
</script>
