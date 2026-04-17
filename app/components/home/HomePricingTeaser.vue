<template>
  <section id="pricing" class="scroll-mt-28 border-t border-[var(--p-border)] bg-[var(--p-surface)] py-16 sm:py-20">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div class="mb-10 text-center sm:mb-12">
        <span class="inline-flex rounded-full bg-flamingo-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-flamingo-500">
          Pricing
        </span>
        <h2 class="mt-4 text-2xl font-bold tracking-tight text-[var(--p-text)] sm:text-3xl">
          Pricing for shops that want better jobs, not more chaos
        </h2>
        <p class="mx-auto mt-2 max-w-sm text-sm leading-6 text-[var(--p-text-muted)]">
          Start free with one shop, then upgrade when you need more capacity, more team access, or more operational control.
        </p>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="plan in plans"
          :key="plan.code"
          class="relative flex flex-col overflow-hidden rounded-2xl border"
          :class="cardWrapClass(plan.code)"
        >
          <div
            v-if="plan.code === 'BIASHARA_PLUS'"
            class="flex items-center justify-between gap-2 border-b border-flamingo-500/20 bg-flamingo-500/10 px-5 py-2"
          >
            <span class="text-[11px] font-bold uppercase tracking-[0.1em] text-flamingo-400">
              Most popular
            </span>
            <UIcon name="i-lucide-star" class="h-3.5 w-3.5 text-flamingo-400" />
          </div>

          <div class="flex flex-1 flex-col p-5 sm:p-6">
            <div class="flex items-start justify-between gap-2">
              <h3
                class="text-sm font-bold"
                :class="plan.code === 'BIASHARA_PLUS' ? 'text-white' : plan.code === 'FREE' ? 'text-[var(--p-text-muted)]' : 'text-[var(--p-text)]'"
              >
                {{ plan.name }}
              </h3>
              <span
                class="inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                :class="plan.code === 'BIASHARA_PLUS'
                  ? 'bg-flamingo-500/20 text-flamingo-300'
                  : 'bg-[var(--p-surface-container)] text-[var(--p-text-muted)]'"
              >
                <UIcon name="i-lucide-store" class="h-3 w-3" />
                {{ shopLabel(plan) }}
              </span>
            </div>

            <div class="mt-5">
              <span
                class="text-3xl font-extrabold tracking-tight"
                :class="plan.code === 'BIASHARA_PLUS' ? 'text-white' : 'text-[var(--p-text)]'"
              >
                {{ price(plan) }}
              </span>
              <span
                v-if="plan.code !== 'FREE'"
                class="ml-1 text-xs"
                :class="plan.code === 'BIASHARA_PLUS' ? 'text-slate-400' : 'text-[var(--p-text-muted)]'"
              >
                /month
              </span>
            </div>

            <p
              class="mt-1.5 text-xs leading-5"
              :class="plan.code === 'BIASHARA_PLUS' ? 'text-slate-300' : 'text-[var(--p-text-muted)]'"
            >
              {{ plan.public_tagline }}
            </p>

            <ul class="mt-5 flex flex-1 flex-col gap-2">
              <li
                v-for="item in planHighlights(plan)"
                :key="item"
                class="flex items-start gap-2 text-xs leading-5"
                :class="plan.code === 'BIASHARA_PLUS' ? 'text-slate-200' : 'text-[var(--p-text-muted)]'"
              >
                <UIcon
                  name="i-lucide-check"
                  class="mt-0.5 h-3.5 w-3.5 shrink-0"
                  :class="plan.code === 'BIASHARA_PLUS' ? 'text-flamingo-400' : plan.code === 'FREE' ? 'text-[var(--p-text-muted)]' : 'text-flamingo-500'"
                />
                {{ item }}
              </li>
            </ul>

            <div class="mt-6">
              <NuxtLink
                :to="ctaHref(plan.code)"
                class="flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold transition-all"
                :class="ctaClass(plan.code)"
              >
                {{ ctaLabel(plan.code) }}
                <UIcon name="i-lucide-arrow-right" class="h-3.5 w-3.5" />
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <p class="mt-7 text-center text-xs text-[var(--p-text-muted)]">
        Free plan requires no credit card &nbsp;·&nbsp; Paid plans via M-Pesa &nbsp;·&nbsp;
        <NuxtLink to="/pricing" class="font-medium text-flamingo-500 hover:text-flamingo-400">
          See full plan comparison
        </NuxtLink>
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useBillingStore } from '~/stores/billing'
import type { Plan, PlanCode } from '~/shared/types/billing'

const store = useBillingStore()

type StaticPlan = Pick<Plan, 'code' | 'name' | 'price_monthly' | 'price_annual' | 'shops_limit' | 'public_tagline'>

const staticPlans: StaticPlan[] = [
  { code: 'FREE', name: 'Free', price_monthly: '0', price_annual: '0', shops_limit: 1, public_tagline: 'Try Printy with one shop' },
  { code: 'BIASHARA', name: 'Biashara', price_monthly: '1500', price_annual: '15000', shops_limit: 1, public_tagline: 'Run one active print shop' },
  { code: 'BIASHARA_PLUS', name: 'Biashara Plus', price_monthly: '3500', price_annual: '35000', shops_limit: 2, public_tagline: 'Grow across two shops' },
  { code: 'BIASHARA_MAX', name: 'Biashara Max', price_monthly: '6500', price_annual: '65000', shops_limit: 5, public_tagline: 'Scale your print business' },
]

const plans = computed(() => (store.plans.length ? store.plans : staticPlans) as Plan[])

function cardWrapClass(code: PlanCode): string {
  if (code === 'BIASHARA_PLUS') return 'border-transparent bg-[#08111f] ring-1 ring-flamingo-500/25'
  if (code === 'FREE') return 'border-[var(--p-border)] bg-[var(--p-surface-sunken)]'
  return 'border-[var(--p-border)] bg-[var(--p-surface)]'
}

function ctaClass(code: PlanCode): string {
  if (code === 'BIASHARA_PLUS') return 'bg-flamingo-500 text-white shadow-md shadow-flamingo-500/25 hover:bg-flamingo-400'
  if (code === 'FREE') return 'border border-[var(--p-border)] bg-transparent text-[var(--p-text-muted)] hover:bg-[var(--p-surface-container)]'
  return 'border border-flamingo-500/40 bg-transparent text-flamingo-500 hover:bg-flamingo-500/8 dark:hover:bg-flamingo-500/10'
}

function ctaLabel(code: PlanCode): string {
  if (code === 'FREE') return 'Start for free'
  return 'Get started'
}

function ctaHref(code: PlanCode): string {
  if (code === 'FREE') return '/auth/signup?role=shop_owner'
  return '/pricing'
}

const staticHighlights: Record<PlanCode, string[]> = {
  FREE: ['1 shop · limited products', '15 quotes per month'],
  BIASHARA: ['Unlimited products & quotes', 'Branded PDF quotes'],
  BIASHARA_PLUS: ['2 shops · team access', 'Advanced analytics'],
  BIASHARA_MAX: ['Up to 5 shops', 'Multi-shop management'],
}

function planHighlights(plan: Plan): string[] {
  if (plan.benefits?.length) return plan.benefits.slice(0, 2)
  return staticHighlights[plan.code] ?? []
}

function price(plan: StaticPlan): string {
  const n = parseFloat(plan.price_monthly)
  if (n === 0) return 'Free'
  return `KES ${n.toLocaleString('en-KE', { minimumFractionDigits: 0 })}`
}

function shopLabel(plan: StaticPlan): string {
  if (plan.shops_limit === 5) return 'Up to 5 shops'
  return `${plan.shops_limit} shop${plan.shops_limit !== 1 ? 's' : ''}`
}

onMounted(() => {
  if (!store.plans.length) store.fetchPlans()
})
</script>
