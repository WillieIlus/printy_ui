<template>
  <div :id="id" class="grid grid-cols-1 gap-6 lg:grid-cols-3">
    <BaseCard variant="dashboard" padding="none" radius="xl" class="overflow-hidden lg:col-span-2">
      <div class="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <div>
          <p class="text-base font-bold text-slate-900">Earnings</p>
          <p class="mt-0.5 text-xs text-slate-400">{{ periodLabel }}</p>
        </div>
        <button type="button" class="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-200">Full report</button>
      </div>

      <div class="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100">
        <div v-for="summary in summaries" :key="summary.label" class="px-6 py-5" :style="summary.style">
          <p class="text-xs font-bold uppercase tracking-wide" :class="summary.labelClass">{{ summary.label }}</p>
          <p class="mt-1.5 text-2xl font-extrabold" :class="summary.valueClass">{{ summary.value }}</p>
          <p class="mt-1 text-xs font-semibold" :class="summary.metaClass">{{ summary.meta }}</p>
        </div>
      </div>

      <div class="divide-y divide-slate-100">
        <div v-for="row in rows" :key="row.id" class="flex items-center gap-4 px-6 py-3.5 transition-colors hover:bg-slate-50">
          <span class="w-14 shrink-0 rounded-lg bg-slate-100 px-2 py-0.5 text-center font-mono text-xs font-bold text-slate-700">{{ row.reference }}</span>
          <div class="min-w-0 flex-1">
            <p class="text-sm font-semibold text-slate-800">{{ row.title }}</p>
            <p class="text-xs text-slate-400">{{ row.detail }}</p>
          </div>
          <div class="shrink-0 text-right">
            <p class="text-sm font-extrabold" :class="row.amountClass">{{ row.amount }}</p>
            <span class="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold" :class="row.badgeClass">{{ row.badge }}</span>
          </div>
        </div>
        <div v-if="!rows.length" class="px-6 py-8 text-center">
          <p class="text-sm font-semibold text-slate-700">No earnings rows yet.</p>
          <p class="mt-1 text-xs text-slate-400">Rows appear here from real assignment payouts.</p>
        </div>
      </div>
    </BaseCard>

    <div class="space-y-4">
      <BaseCard variant="dashboard" padding="none" radius="xl" class="overflow-hidden">
        <div class="border-b border-slate-100 px-5 py-4">
          <p class="text-sm font-bold text-slate-900">Top Clients - {{ billingMonth }}</p>
        </div>
        <div class="divide-y divide-slate-100">
          <div v-for="client in topClients" :key="client.name" class="flex items-center gap-3 px-5 py-3.5">
            <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-extrabold" :class="client.avatarClass">{{ client.initials }}</div>
            <div class="min-w-0 flex-1">
              <p class="truncate text-xs font-bold text-slate-800">{{ client.name }}</p>
              <div class="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div class="h-1.5 rounded-full" :class="client.barClass" :style="{ width: `${client.width}%` }"></div>
              </div>
            </div>
            <p class="shrink-0 text-xs font-extrabold text-slate-800">{{ client.amount }}</p>
          </div>
          <div v-if="!topClients.length" class="px-5 py-6 text-center">
            <p class="text-xs text-slate-400">Client revenue appears here from real quote totals.</p>
          </div>
        </div>
      </BaseCard>

      <BaseCard variant="dark" padding="none" radius="xl" class="overflow-hidden border-[#1e2d45] bg-[linear-gradient(160deg,#101828_0%,#1e2d45_100%)]">
        <div class="border-b border-white/10 px-5 py-4">
          <p class="text-sm font-bold text-white">Payout Summary</p>
          <p class="mt-0.5 text-xs text-slate-400">{{ payoutPeriod }}</p>
        </div>
        <div class="space-y-3 px-5 py-4">
          <div v-for="item in payoutItems" :key="item.label" class="flex items-center justify-between">
            <span class="text-xs font-medium text-slate-400">{{ item.label }}</span>
            <span class="text-xs font-bold" :class="item.valueClass">{{ item.value }}</span>
          </div>
          <button type="button" class="mt-1 w-full rounded-xl border border-white/20 py-2 text-xs font-bold text-white transition-colors hover:bg-white/10">Request Early Payout</button>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseCard from '~/components/base/BaseCard.vue'

interface EarningsSummary {
  label: string
  value: string
  meta: string
  labelClass: string
  valueClass: string
  metaClass: string
  style?: string
}

interface EarningsRow {
  id: string | number
  reference: string
  title: string
  detail: string
  amount: string
  amountClass: string
  badge: string
  badgeClass: string
}

interface TopClient {
  name: string
  amount: string
  initials: string
  avatarClass: string
  barClass: string
  width: number
}

interface PayoutItem {
  label: string
  value: string
  valueClass: string
}

withDefaults(defineProps<{
  id?: string
  periodLabel: string
  billingMonth: string
  payoutPeriod: string
  summaries: EarningsSummary[]
  rows: EarningsRow[]
  topClients: TopClient[]
  payoutItems: PayoutItem[]
}>(), {
  id: '',
})
</script>
