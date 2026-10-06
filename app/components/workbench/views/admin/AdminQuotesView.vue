<template>
  <div>
    <AdminPageHead
      eyebrow="Pricing pipeline"
      title="Quotes"
      lede="Two separate queues. Requests that have no number attached yet, and everything that already carries a priced offer."
    >
      <template #meta>
        <span
          class="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono2 text-[9px] uppercase tracking-[0.14em] text-[var(--sub)]"
          :style="{ borderColor: 'var(--line)' }"
        >
          <Handshake :size="12" :style="{ color: 'var(--accent)' }" />
          {{ counts.quote_requests }} requests · {{ counts.quotes }} quotes
        </span>
      </template>
    </AdminPageHead>

    <!-- ── awaiting quotes ── -->
    <AdminSection
      icon="file-text"
      tone="warn"
      title="Awaiting quotes"
      :count="awaitingQuotes.length"
      subtitle="Quote requested, nothing priced yet. A manager still owes the client a number, and no money has moved."
    >
      <template #actions>
        <span class="font-mono2 text-[9px] uppercase tracking-[0.14em] text-[var(--sub)]">
          {{ awaitingQuotes.length ? `Oldest · ${awaitingQuotes[0]?.code}` : 'queue clear' }}
        </span>
      </template>

      <div v-if="awaitingQuotes.length" class="space-y-2">
        <AdminJobRow
          v-for="job in awaitingQuotes"
          :key="job.id"
          :job="job"
          :partner="partnerName(job.managerId)"
          :alert="job.status === 'overdue' || job.status === 'at-risk'"
          @open="openJob"
        >
          <template #actions>
            <span
              class="rounded-full px-2.5 py-1 font-mono2 text-[9px] uppercase tracking-[0.12em]"
              :style="waitingStyle(job)"
            >
              {{ waitingLabel(job) }}
            </span>
          </template>
        </AdminJobRow>
      </div>

      <div v-else class="rounded-2xl border p-6 text-center" :style="{ borderColor: 'var(--line)' }">
        <Inbox :size="20" class="mx-auto" :style="{ color: 'var(--accent)' }" />
        <p class="mt-2.5 text-[12.5px] text-[var(--sub)]">
          Every quote request on the marketplace has a priced offer behind it.
        </p>
      </div>
    </AdminSection>

    <!-- ── quoted items ── -->
    <AdminSection
      icon="file-text"
      tone="accent"
      title="Quoted items"
      :count="quotedItems.length"
      subtitle="Priced offers and paid work. Split below by where the money is sitting — awaiting payment, held in escrow, or already released to the printer."
    >
      <template #meta>
        <div class="flex flex-wrap items-center gap-1.5">
          <span
            v-for="bucket in quotedBuckets"
            :key="bucket.key"
            class="rounded-full px-2.5 py-1 font-mono2 text-[9px] font-semibold uppercase tracking-[0.12em]"
            :style="bucket.count ? { background: `${bucket.color}1F`, color: bucket.color } : { background: 'var(--panel2)', color: 'var(--sub)' }"
          >
            {{ bucket.label }} {{ bucket.count }}
          </span>
        </div>
      </template>

      <div v-if="quotedItems.length" class="space-y-2">
        <AdminJobRow
          v-for="job in quotedItems"
          :key="job.id"
          :job="job"
          :partner="partnerName(job.managerId)"
          @open="openJob"
        >
          <template #actions>
            <NuxtLink
              v-if="job.printerId"
              :to="{ path: '/app/admin/printers', query: { focus: job.printerId } }"
              class="font-mono2 text-[9px] uppercase tracking-[0.12em] text-[var(--sub)] underline-offset-4 hover:text-[var(--accent)] hover:underline"
            >
              {{ printerName(job.printerId) }}
            </NuxtLink>
          </template>
        </AdminJobRow>
      </div>

      <div v-else class="rounded-2xl border p-6 text-center" :style="{ borderColor: 'var(--line)' }">
        <FileCheck :size="20" class="mx-auto" :style="{ color: 'var(--accent)' }" />
        <p class="mt-2.5 text-[12.5px] text-[var(--sub)]">No priced offers on the marketplace yet.</p>
      </div>
    </AdminSection>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { FileCheck, Handshake, Inbox } from 'lucide-vue-next'
import { mgr, prn, STAGES, slaRatio, type Job } from '~/shared/workflow/printy'
import { CUSTODY_META } from '~/shared/admin-nav'

const { admins, workflow, counts, awaitingQuotes, quotedItems } = useAdminNav()

const quotedBuckets = computed(() => [
  { key: 'awaiting', label: 'Awaiting payment', color: CUSTODY_META.awaiting.color, count: quotedItems.value.filter((job) => job.custody === 'awaiting').length },
  { key: 'held', label: 'In escrow', color: CUSTODY_META.held.color, count: quotedItems.value.filter((job) => job.custody === 'held').length },
  { key: 'released', label: 'Released', color: CUSTODY_META.released.color, count: quotedItems.value.filter((job) => job.custody === 'released').length },
])

const partnerName = (managerId: string) => mgr(managerId)?.name ?? null
const printerName = (printerId: string) => prn(printerId)?.name ?? null

function waitingLabel(job: Job) {
  const stage = STAGES.find((s) => s.key === job.stage)?.label ?? job.stage
  return `at ${stage.toLowerCase()} · ${Math.round(slaRatio(job) * 100)}% of SLA`
}

function waitingStyle(job: Job) {
  const ratio = slaRatio(job)
  const color = ratio >= 1 ? '#C81E44' : ratio >= 0.65 ? '#B45309' : 'var(--sub)'
  return { background: 'var(--panel2)', color }
}

function openJob(job: Job) {
  admins.clearFocus()
  workflow.act('open-job', job)
}
</script>