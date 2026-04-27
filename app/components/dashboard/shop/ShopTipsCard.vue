<template>
  <DashboardSectionCard title="Next actions" description="Contextual actions based on live request and setup state." tone="dark">
    <div v-if="actions.length" class="space-y-3">
      <div
        v-for="action in actions"
        :key="action.title"
        class="rounded-2xl border border-white/10 bg-white/5 px-4 py-4"
      >
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="text-sm font-semibold text-white">{{ action.title }}</p>
            <p class="mt-1 text-sm text-slate-300">{{ action.body }}</p>
          </div>
          <NuxtLink
            :to="action.to"
            class="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            {{ action.label }}
          </NuxtLink>
        </div>
      </div>
    </div>
    <div v-else class="rounded-2xl border border-dashed border-white/10 px-4 py-10 text-center text-sm text-slate-300">
      Performance insights will appear after you respond to quote requests.
    </div>
  </DashboardSectionCard>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import DashboardSectionCard from '~/components/dashboard/shared/DashboardSectionCard.vue'
import { useQuoteInboxStore } from '~/stores/quoteInbox'
import { useSetupStatusStore } from '~/stores/setupStatus'

interface ActionItem {
  title: string
  body: string
  label: string
  to: string
}

const quoteInboxStore = useQuoteInboxStore()
const setupStatusStore = useSetupStatusStore()
const { dashboard } = storeToRefs(quoteInboxStore)
const { status } = storeToRefs(setupStatusStore)

const actions = computed<ActionItem[]>(() => {
  const items: ActionItem[] = []
  const summary = dashboard.value
  const setup = status.value

  if ((summary?.pending_responses_count ?? 0) > 0) {
    items.push({
      title: 'Respond to new requests',
      body: `${summary?.pending_responses_count ?? 0} request(s) are still waiting for a shop response.`,
      label: 'Open requests',
      to: '/dashboard/shop/requests',
    })
  }

  if ((summary?.stale_requests_count ?? 0) > 0) {
    items.push({
      title: 'Clear older unanswered requests',
      body: `${summary?.stale_requests_count ?? 0} request(s) have been waiting more than 24 hours.`,
      label: 'Review queue',
      to: '/dashboard/shop/requests',
    })
  }

  const recommendation = setup?.recommendations?.[0] || setup?.warnings?.[0]
  if (setup?.next_step && setup.next_step !== 'complete' && recommendation) {
    const step = setup.steps?.find(item => item.key === setup.next_step)
    items.push({
      title: 'Next setup action',
      body: recommendation,
      label: step?.cta_label || 'Continue setup',
      to: setup.next_url,
    })
  }

  if (setup && !setup.can_price_requests && !items.some(item => item.to === '/dashboard/shop/pricing')) {
    items.push({
      title: 'Improve automatic pricing coverage',
      body: 'To price more jobs automatically, keep materials, print pricing, and finishing rates up to date.',
      label: 'Review pricing',
      to: '/dashboard/shop/pricing',
    })
  }

  return items.slice(0, 3)
})
</script>
