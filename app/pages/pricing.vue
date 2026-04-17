<template>
  <div>
    <!-- Hero -->
    <section class="relative overflow-hidden bg-[var(--p-surface)] pt-16 pb-10 sm:pt-24 sm:pb-14">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(225,53,21,0.07),transparent_55%)]" />
      <div class="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <span class="inline-flex rounded-full bg-flamingo-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-flamingo-500">
          Pricing
        </span>
        <h1 class="mt-4 text-4xl font-extrabold tracking-tight text-[var(--p-text)] sm:text-5xl">
          Simple, transparent pricing
        </h1>
        <p class="mt-4 text-lg text-[var(--p-text-dim)]">
          Start free and grow as your print business grows.
          No surprises — cancel any time.
        </p>

        <!-- Toggle -->
        <div class="mt-8">
          <BillingPricingToggle v-model="interval" />
        </div>
      </div>
    </section>

    <!-- Plans grid -->
    <section class="bg-[var(--p-surface)] pb-20">
      <div class="mx-auto max-w-6xl px-4 sm:px-6">

        <!-- Loading -->
        <div v-if="store.plansLoading" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="i in 4"
            :key="i"
            class="h-[520px] animate-pulse rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)]"
          />
        </div>

        <!-- Error -->
        <div v-else-if="store.error && !store.plans.length" class="flex flex-col items-center py-16 text-center">
          <UIcon name="i-lucide-wifi-off" class="h-12 w-12 text-[var(--p-text-muted)] mb-4" />
          <p class="text-sm text-[var(--p-text-muted)]">Could not load plans. Please refresh.</p>
          <button class="mt-4 text-sm font-semibold text-[var(--color-primary-600)] hover:underline" @click="store.fetchPlans()">
            Try again
          </button>
        </div>

        <!-- Cards -->
        <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 pt-4">
          <BillingPricingCard
            v-for="plan in store.plans"
            :key="plan.id"
            :plan="plan"
            :interval="interval"
            :is-current="store.subscription?.plan?.code === plan.code"
            @select="onSelectPlan"
          />
        </div>

        <!-- Shop limits callout -->
        <div class="mt-12 rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-raised)] p-6 sm:p-8">
          <div class="flex items-center gap-2 mb-4">
            <UIcon name="i-lucide-store" class="h-5 w-5 text-[var(--color-primary-600)]" />
            <h3 class="text-base font-bold text-[var(--p-text)]">Shop limits at a glance</h3>
          </div>
          <div class="grid gap-3 sm:grid-cols-4">
            <div
              v-for="row in shopLimitRows"
              :key="row.code"
              class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-4 text-center"
              :class="row.code === 'BIASHARA_PLUS' ? 'border-[var(--color-primary-600)]/40 bg-[var(--color-primary-600)]/5' : ''"
            >
              <p class="text-xs font-semibold uppercase tracking-wide text-[var(--p-text-muted)]">{{ row.name }}</p>
              <p class="mt-2 text-3xl font-extrabold" :class="row.code === 'BIASHARA_PLUS' ? 'text-[var(--color-primary-600)]' : 'text-[var(--p-text)]'">
                {{ row.shopsDisplay }}
              </p>
              <p class="mt-0.5 text-xs text-[var(--p-text-muted)]">{{ row.shopsLabel }}</p>
            </div>
          </div>
        </div>

        <!-- Feature comparison table -->
        <div class="mt-8 overflow-x-auto rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)]">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-[var(--p-border)]">
                <th class="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--p-text-muted)]">Feature</th>
                <th
                  v-for="plan in store.plans"
                  :key="plan.id"
                  class="px-4 py-4 text-center text-xs font-bold"
                  :class="plan.code === 'BIASHARA_PLUS' ? 'text-[var(--color-primary-600)]' : 'text-[var(--p-text)]'"
                >
                  {{ plan.name }}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[var(--p-border-dim)]">
              <tr v-for="row in comparisonRows" :key="row.label" class="hover:bg-[var(--p-surface-sunken)] dark:hover:bg-[var(--p-surface-raised)]">
                <td class="px-5 py-3.5 font-medium text-[var(--p-text-dim)]">{{ row.label }}</td>
                <td
                  v-for="plan in store.plans"
                  :key="plan.id"
                  class="px-4 py-3.5 text-center text-sm font-semibold text-[var(--p-text)]"
                >
                  <span v-if="typeof row.value(plan) === 'boolean'">
                    <UIcon
                      :name="row.value(plan) ? 'i-lucide-check' : 'i-lucide-minus'"
                      :class="row.value(plan) ? 'text-emerald-500' : 'text-[var(--p-text-muted)]'"
                      class="mx-auto h-4 w-4"
                    />
                  </span>
                  <span v-else>{{ row.value(plan) }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="bg-[var(--p-surface-raised)] py-16 sm:py-20 border-t border-[var(--p-border)]">
      <div class="mx-auto max-w-2xl px-4 sm:px-6">
        <h2 class="text-2xl font-extrabold text-[var(--p-text)] text-center mb-8">Questions</h2>
        <div class="flex flex-col gap-1">
          <UAccordion :items="faqItems" />
        </div>
      </div>
    </section>

    <!-- M-PESA dialog -->
    <BillingMpesaPaymentDialog
      v-model:open="paymentDialogOpen"
      v-model:phase="paymentPhase"
      :plan-name="selectedPlan?.name ?? ''"
      :amount="selectedPlanAmount"
      :interval="interval"
      :shops="myShops"
      :shop-limit="selectedPlan?.shops_limit ?? 1"
      :show-shop-selection="requiresShopSelection"
      :submitting="store.actionLoading"
      :failure-message="store.error ?? ''"
      @submit="handlePaymentSubmit"
      @retry="paymentPhase = 'input'"
      @cancel="paymentDialogOpen = false"
      @done="handlePaymentDone"
    />
  </div>
</template>

<script setup lang="ts">
import { useBillingStore } from '~/stores/billing'
import { useBilling } from '~/composables/useBilling'
import { useShopStore } from '~/stores/shop'
import { useAuthStore } from '~/stores/auth'
import type { Plan, BillingInterval } from '~/shared/types/billing'

usePrintySeo({
  title: 'Pricing — Printy.ke',
  description: 'Simple, transparent pricing for Kenyan print shops. Start free with one shop or scale to multi-branch with Biashara Max.',
})

const store = useBillingStore()
const shopStore = useShopStore()
const authStore = useAuthStore()
const { planPrice, formatKes } = useBilling()

const interval = ref<BillingInterval>('monthly')
const selectedPlan = ref<Plan | null>(null)
const paymentDialogOpen = ref(false)
const paymentPhase = ref<'input' | 'pending' | 'success' | 'failed'>('input')

onMounted(() => {
  if (!store.plans.length) store.fetchPlans()
  if (authStore.isAuthenticated && !store.subscription) store.fetchSubscription()
  if (authStore.isAuthenticated) shopStore.fetchMyShops()
})

const myShops = computed(() =>
  shopStore.myShops.map(s => ({ id: s.id, name: s.name })),
)

const requiresShopSelection = computed(() =>
  Boolean(selectedPlan.value && selectedPlan.value.shops_limit > 1 && myShops.value.length > 1),
)

const selectedPlanAmount = computed(() =>
  selectedPlan.value ? planPrice(selectedPlan.value, interval.value) : '',
)

function onSelectPlan(plan: Plan) {
  if (plan.code === 'FREE') {
    navigateTo({ path: '/auth/signup', query: { role: 'shop_owner' } })
    return
  }
  if (!authStore.isAuthenticated) {
    navigateTo({ path: '/auth/signup', query: { role: 'shop_owner' } })
    return
  }
  selectedPlan.value = plan
  paymentPhase.value = 'input'
  paymentDialogOpen.value = true
}

async function handlePaymentSubmit(phone: string, shopIds: number[]) {
  if (!selectedPlan.value) return
  paymentPhase.value = 'pending'

  const isUpgrade = store.subscription && store.subscription.plan.code !== 'FREE'

  try {
    if (isUpgrade) {
      await store.upgrade({
        target_plan_code: selectedPlan.value.code,
        billing_interval: interval.value,
        phone_number: phone,
        selected_shop_ids: shopIds.length ? shopIds : undefined,
      })
    } else {
      await store.subscribe({
        plan_code: selectedPlan.value.code,
        billing_interval: interval.value,
        phone_number: phone,
        selected_shop_ids: shopIds.length ? shopIds : myShops.value.slice(0, 1).map(s => s.id),
      })
    }

    // Poll for activation
    store.pollSubscriptionStatus().then(() => {
      if (store.isActive) {
        paymentPhase.value = 'success'
      }
    })
  } catch {
    paymentPhase.value = 'failed'
  }
}

function handlePaymentDone() {
  paymentDialogOpen.value = false
  navigateTo('/account/billing')
}

// -------------------------------------------------------------------------
// Comparison table
// -------------------------------------------------------------------------
const comparisonRows = [
  { label: 'Shops', value: (p: Plan) => p.shops_limit === 5 ? 'Up to 5' : String(p.shops_limit) },
  { label: 'Machines', value: (p: Plan) => p.machines_limit === null ? '∞' : String(p.machines_limit) },
  { label: 'Products', value: (p: Plan) => p.products_limit === null ? '∞' : String(p.products_limit) },
  { label: 'Quotes / month', value: (p: Plan) => p.quotes_per_month_limit === null ? '∞' : String(p.quotes_per_month_limit) },
  { label: 'Team members', value: (p: Plan) => String(p.users_limit) },
  { label: 'All papers', value: (p: Plan) => p.all_papers_enabled },
  { label: 'Branded quotes', value: (p: Plan) => p.branded_quotes_enabled },
  { label: 'Customer history', value: (p: Plan) => p.customer_history_enabled },
  { label: 'Analytics', value: (p: Plan) => p.analytics_level.charAt(0).toUpperCase() + p.analytics_level.slice(1) },
  { label: 'Priority support', value: (p: Plan) => p.priority_support },
]

const shopLimitRows = [
  { code: 'FREE', name: 'Free', shopsDisplay: '1', shopsLabel: 'shop' },
  { code: 'BIASHARA', name: 'Biashara', shopsDisplay: '1', shopsLabel: 'shop' },
  { code: 'BIASHARA_PLUS', name: 'Biashara Plus', shopsDisplay: '2', shopsLabel: 'shops' },
  { code: 'BIASHARA_MAX', name: 'Biashara Max', shopsDisplay: '5', shopsLabel: 'shops' },
]

const faqItems = [
  {
    label: 'Can I start with the Free plan?',
    content: 'Yes. The Free plan lets you set up one shop, one machine, and three products — no credit card required. It\'s built for trying Printy before committing.',
  },
  {
    label: 'How does the M-PESA payment work?',
    content: 'When you subscribe, you\'ll receive an STK push on your phone. Enter your M-PESA PIN to confirm. Your subscription activates immediately after payment is confirmed.',
  },
  {
    label: 'Can I have multiple shops?',
    content: 'Biashara Plus supports 2 shops. Biashara Max supports up to 5 shops. Free and Biashara are limited to 1 shop each.',
  },
  {
    label: 'What happens if I miss a renewal?',
    content: 'If your renewal fails, you\'ll have a short grace period to settle the payment before features are paused. Your data is never deleted.',
  },
  {
    label: 'Can I switch billing from monthly to annual?',
    content: 'Yes. You can switch billing interval when you upgrade or renew. Annual billing saves you roughly 2 months compared to monthly.',
  },
  {
    label: 'Can I cancel any time?',
    content: 'Yes. Cancellation takes effect at the end of your current period. Your data remains accessible until then.',
  },
]
</script>
