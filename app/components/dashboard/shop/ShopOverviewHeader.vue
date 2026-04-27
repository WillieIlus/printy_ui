<!-- Purpose: Shop dashboard overview hero backed by live quote request metrics. -->
<template>
  <div class="rounded-[2rem] bg-slate-950 p-6 text-white ring-1 ring-white/10 md:p-8">
    <div class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div class="space-y-3">
        <BaseBadge tone="dark">Print shop dashboard</BaseBadge>
        <div class="space-y-2">
          <h2 class="text-3xl font-semibold tracking-tight">
            {{ dashboard?.shop?.name || 'Run inbound quote work with a tighter operational view.' }}
          </h2>
          <p class="max-w-2xl text-sm text-slate-300 md:text-base">
            Review new quote requests, track pending replies, and keep the request queue moving from one place.
          </p>
        </div>
      </div>
      <div class="grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
        <div class="rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
          {{ dashboard?.received_quote_requests ?? 0 }} inbound requests
        </div>
        <div class="rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
          {{ dashboard?.status_counts?.pending ?? 0 }} awaiting response
        </div>
        <div class="rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
          {{ dashboard?.status_counts?.modified ?? 0 }} need follow-up
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import BaseBadge from '~/components/ui/BaseBadge.vue'
import { useQuoteInboxStore } from '~/stores/quoteInbox'

const store = useQuoteInboxStore()
const { dashboard } = storeToRefs(store)

onMounted(async () => {
  if (!dashboard.value) {
    await store.fetchDashboard().catch(() => undefined)
  }
})
</script>
