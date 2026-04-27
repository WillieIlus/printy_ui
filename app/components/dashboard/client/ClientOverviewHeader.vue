<!-- Purpose: Client dashboard hero — welcome message, responses-waiting alert, primary CTAs. -->
<template>
  <div class="rounded-[2rem] bg-gradient-to-r from-white via-orange-50 to-white p-6 ring-1 ring-slate-200 md:p-8">
    <div class="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
      <div class="space-y-3">
        <BaseBadge tone="neutral">Client dashboard</BaseBadge>
        <div class="space-y-1">
          <h2 class="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">Welcome back.</h2>
          <p class="max-w-xl text-sm text-slate-600 md:text-base">
            {{ loading && !loaded ? 'Loading your request activity and saved drafts.' : 'Track your print requests, shop replies, and saved drafts.' }}
          </p>
        </div>
        <div
          v-if="responsesWaiting > 0"
          class="inline-flex items-center gap-2 rounded-2xl bg-amber-50 px-4 py-2.5 ring-1 ring-amber-200"
        >
          <Icon name="lucide:bell" class="size-4 shrink-0 text-amber-600" />
          <p class="text-sm font-semibold text-amber-700">
            You have {{ responsesWaiting }}
            {{ responsesWaiting === 1 ? 'shop response' : 'shop responses' }} waiting.
          </p>
        </div>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <BaseButton variant="primary" to="/dashboard/client/requests">Review responses</BaseButton>
        <BaseButton variant="outline" to="/">Start new request</BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useQuoteInboxStore } from '~/stores/quoteInbox'
import BaseBadge from '~/components/ui/BaseBadge.vue'
import BaseButton from '~/components/ui/BaseButton.vue'

const store = useQuoteInboxStore()
const { clientRequests, loading, loaded } = storeToRefs(store)

const responsesWaiting = computed(() =>
  clientRequests.value.filter(
    r => r.latest_response !== null
      && r.response_status !== 'accepted'
      && r.status !== 'accepted',
  ).length,
)
</script>
