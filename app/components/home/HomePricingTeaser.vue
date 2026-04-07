<template>
  <section class="bg-[var(--p-surface)] py-16 sm:py-24 border-t border-[var(--p-border)]">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

      <div class="text-center mb-10">
        <span class="inline-flex rounded-full bg-flamingo-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-flamingo-500">
          Pricing
        </span>
        <h2 class="mt-4 text-3xl font-extrabold tracking-tight text-[var(--p-text)] sm:text-4xl">
          Start free. Grow when you're ready.
        </h2>
        <p class="mt-3 text-base text-[var(--p-text-dim)] max-w-xl mx-auto">
          One shop and free forever on our Free plan, or upgrade to unlock more shops, machines, and team members.
        </p>
      </div>

      <!-- Plan teasers -->
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        <div
          v-for="plan in plans"
          :key="plan.code"
          class="relative rounded-2xl border p-5 flex flex-col gap-3"
          :class="plan.code === 'BIASHARA_PLUS'
            ? 'border-[var(--color-primary-600)]/50 bg-[var(--color-primary-600)]/5 shadow-md'
            : 'border-[var(--p-border)] bg-[var(--p-surface-raised)]'"
        >
          <!-- Badge -->
          <div v-if="plan.code === 'BIASHARA_PLUS'" class="absolute -top-2.5 left-4">
            <span class="inline-flex items-center rounded-full bg-[var(--color-primary-600)] px-2.5 py-0.5 text-[11px] font-bold text-white">
              Popular
            </span>
          </div>

          <!-- Name + shops badge -->
          <div class="flex items-start justify-between">
            <h3 class="font-bold text-[var(--p-text)]">{{ plan.name }}</h3>
            <span
              class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold shrink-0"
              :class="plan.code === 'BIASHARA_PLUS'
                ? 'bg-[var(--color-primary-600)]/15 text-[var(--color-primary-600)]'
                : 'bg-[var(--p-surface-sunken)] text-[var(--p-text-muted)]'"
            >
              <UIcon name="i-lucide-store" class="h-3 w-3" />
              {{ shopLabel(plan) }}
            </span>
          </div>

          <!-- Price -->
          <div>
            <span class="text-2xl font-extrabold text-[var(--p-text)]">{{ price(plan) }}</span>
            <span v-if="plan.code !== 'FREE'" class="text-xs text-[var(--p-text-muted)]">/month</span>
          </div>

          <!-- Key benefit -->
          <p class="text-xs text-[var(--p-text-dim)] leading-5">{{ plan.public_tagline }}</p>
        </div>
      </div>

      <div class="text-center">
        <NuxtLink
          to="/pricing"
          class="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary-600)] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-flamingo-500/20 transition-all hover:bg-flamingo-400 hover:shadow-flamingo-500/30"
        >
          See full pricing
          <UIcon name="i-lucide-arrow-right" class="h-4 w-4" />
        </NuxtLink>
        <p class="mt-3 text-xs text-[var(--p-text-muted)]">No credit card required for Free</p>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import { useBillingStore } from '~/stores/billing'
import { useBilling } from '~/composables/useBilling'
import type { Plan } from '~/shared/types/billing'

const store = useBillingStore()
const { planPrice, formatKes } = useBilling()

// Static fallback so section renders even without API call
const staticPlans: Pick<Plan, 'code' | 'name' | 'price_monthly' | 'price_annual' | 'shops_limit' | 'public_tagline'>[] = [
  { code: 'FREE', name: 'Free', price_monthly: '0', price_annual: '0', shops_limit: 1, public_tagline: 'Try Printy with one shop' },
  { code: 'BIASHARA', name: 'Biashara', price_monthly: '1500', price_annual: '15000', shops_limit: 1, public_tagline: 'Run one active print shop' },
  { code: 'BIASHARA_PLUS', name: 'Biashara Plus', price_monthly: '3500', price_annual: '35000', shops_limit: 2, public_tagline: 'Grow across two shops' },
  { code: 'BIASHARA_MAX', name: 'Biashara Max', price_monthly: '6500', price_annual: '65000', shops_limit: 5, public_tagline: 'Scale your print business' },
]

const plans = computed(() => store.plans.length ? store.plans : staticPlans)

function price(plan: typeof staticPlans[0]) {
  const n = parseFloat(plan.price_monthly)
  if (n === 0) return 'Free'
  return `KES ${n.toLocaleString('en-KE', { minimumFractionDigits: 0 })}`
}

function shopLabel(plan: typeof staticPlans[0]): string {
  if (plan.shops_limit === 5) return 'Up to 5 shops'
  return `${plan.shops_limit} shop${plan.shops_limit !== 1 ? 's' : ''}`
}

onMounted(() => {
  if (!store.plans.length) store.fetchPlans()
})
</script>
