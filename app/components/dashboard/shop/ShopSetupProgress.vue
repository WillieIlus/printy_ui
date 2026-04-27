<template>
  <DashboardSectionCard
    title="Setup progress"
    description="Real rate-card readiness for requests, automatic pricing, and public visibility."
    tone="dark"
  >
    <div v-if="setupStatus" class="space-y-5">
      <div class="grid gap-3 sm:grid-cols-3">
        <div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
          <p class="text-xs uppercase tracking-[0.18em] text-slate-400">Setup</p>
          <p class="mt-2 text-2xl font-semibold text-white">{{ setupStatus.setup_percent ?? 0 }}%</p>
          <p class="mt-1 text-sm text-slate-300">Overall dashboard and publishing readiness.</p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
          <p class="text-xs uppercase tracking-[0.18em] text-slate-400">Rate card</p>
          <p class="mt-2 text-2xl font-semibold text-white">{{ setupStatus.rate_card_completeness ?? 0 }}%</p>
          <p class="mt-1 text-sm text-slate-300">How much of your quoting stack is ready right now.</p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
          <p class="text-xs uppercase tracking-[0.18em] text-slate-400">Requests</p>
          <p class="mt-2 text-base font-semibold text-white">{{ requestReadinessLabel }}</p>
          <p class="mt-1 text-sm text-slate-300">{{ requestReadinessHelper }}</p>
        </div>
      </div>

      <div class="rounded-2xl border border-[var(--p-primary)]/25 bg-[var(--p-primary)]/10 px-4 py-4">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="text-sm font-semibold text-white">Next best action</p>
            <p class="mt-1 text-sm text-slate-300">{{ nextActionCopy }}</p>
          </div>
          <NuxtLink
            :to="setupStatus.next_url"
            class="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            {{ nextActionLabel }}
          </NuxtLink>
        </div>
      </div>

      <div class="space-y-3">
        <div
          v-for="item in readinessItems"
          :key="item.key"
          class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
        >
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p class="text-sm font-medium text-white">{{ item.label }}</p>
              <p class="mt-1 text-sm text-slate-300">{{ item.helper }}</p>
            </div>
            <span
              class="inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]"
              :class="item.done ? 'bg-green-500/15 text-green-300' : 'bg-amber-500/15 text-amber-200'"
            >
              {{ item.done ? 'Ready' : 'Needs attention' }}
            </span>
          </div>
        </div>
      </div>

      <div v-if="setupStatus.warnings?.length" class="space-y-2">
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Warnings</p>
        <p
          v-for="warning in setupStatus.warnings"
          :key="warning"
          class="rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100"
        >
          {{ warning }}
        </p>
      </div>

      <div v-if="setupStatus.recommendations?.length" class="space-y-2">
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Recommendations</p>
        <p
          v-for="recommendation in setupStatus.recommendations"
          :key="recommendation"
          class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
        >
          {{ recommendation }}
        </p>
      </div>
    </div>

    <p v-else class="text-sm text-slate-300">Setup readiness will appear once the shop status loads.</p>
  </DashboardSectionCard>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import DashboardSectionCard from '~/components/dashboard/shared/DashboardSectionCard.vue'
import { useSetupStatusStore } from '~/stores/setupStatus'

const setupStatusStore = useSetupStatusStore()
const { status: setupStatus } = storeToRefs(setupStatusStore)

const readinessItems = computed(() => {
  const status = setupStatus.value
  if (!status) return []

  return [
    {
      key: 'profile',
      label: 'Shop profile',
      done: Boolean(status.shop_profile_complete),
      helper: status.shop_profile_complete
        ? 'Core business details are ready for buyers.'
        : 'Add clear contact and business details buyers can trust.',
    },
    {
      key: 'materials',
      label: 'Materials',
      done: Boolean(status.has_materials),
      helper: status.has_materials
        ? `${status.materials_count ?? 0} paper or material entries support matching.`
        : 'Add paper stocks or materials so Printy can price real jobs.',
    },
    {
      key: 'pricing',
      label: 'Print pricing',
      done: Boolean(status.has_pricing_rules),
      helper: status.has_pricing_rules
        ? `${status.pricing_rules_count ?? 0} pricing rule(s) are available for calculator use.`
        : 'To price more jobs automatically, add print pricing rules.',
    },
    {
      key: 'finishing',
      label: 'Finishing',
      done: Boolean(status.has_finishing_rates),
      helper: status.has_finishing_rates
        ? `${status.finishing_rates_count ?? 0} finishing rate(s) can be used for add-ons.`
        : 'Your shop can receive requests, but exact pricing needs finishing rates.',
    },
    {
      key: 'turnaround',
      label: 'Turnaround',
      done: Boolean(status.turnaround_configured),
      helper: status.turnaround_configured
        ? 'At least one active product has turnaround configured.'
        : 'Add turnaround on an active product so buyers see expected timing.',
    },
  ]
})

const requestReadinessLabel = computed(() => {
  const status = setupStatus.value
  if (!status) return 'Checking'
  if (status.can_price_requests) return 'Ready to price'
  if (status.can_receive_requests) return 'Can receive requests'
  return 'Not public yet'
})

const requestReadinessHelper = computed(() => {
  const status = setupStatus.value
  if (!status) return 'Loading shop readiness.'
  if (status.can_price_requests) return 'The shop can receive requests and return base rate-card pricing.'
  if (status.can_receive_requests) return 'The shop can receive requests, but more setup is needed for exact pricing.'
  return 'Make the shop public when you are ready to receive marketplace traffic.'
})

const nextActionCopy = computed(() => {
  const status = setupStatus.value
  if (!status) return 'Loading next best action.'
  return status.recommendations?.[0] || status.warnings?.[0] || 'Your setup is in a good place right now.'
})

const nextActionLabel = computed(() => {
  const step = setupStatus.value?.steps?.find(item => item.key === setupStatus.value?.next_step)
  return step?.cta_label || 'Review setup'
})
</script>
