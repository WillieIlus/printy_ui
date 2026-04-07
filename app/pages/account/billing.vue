<template>
  <div class="mx-auto max-w-4xl px-4 py-8 sm:px-6">
    <!-- Page header -->
    <div class="mb-8">
      <div class="flex items-center gap-3 mb-1">
        <NuxtLink to="/account" class="text-sm text-[var(--p-text-muted)] hover:text-[var(--p-text)] flex items-center gap-1">
          <UIcon name="i-lucide-arrow-left" class="h-4 w-4" />
          Account
        </NuxtLink>
      </div>
      <h1 class="text-2xl font-extrabold text-[var(--p-text)]">Subscription & Billing</h1>
      <p class="mt-1 text-sm text-[var(--p-text-muted)]">Manage your plan, usage, and payment history.</p>
    </div>

    <!-- Loading skeleton -->
    <div v-if="initialLoading" class="flex flex-col gap-5">
      <div v-for="i in 3" :key="i" class="h-36 animate-pulse rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)]" />
    </div>

    <template v-else>
      <!-- Subscription summary card -->
      <BillingSubscriptionSummary :subscription="store.subscription" @renew="openRenewalDialog">
        <template #actions>
          <template v-if="!store.isFreePlan">
            <button
              type="button"
              class="inline-flex items-center gap-1.5 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] px-3.5 py-2 text-sm font-semibold text-[var(--p-text)] hover:bg-[var(--p-surface-sunken)] transition-colors"
              @click="navigateTo('/pricing')"
            >
              <UIcon name="i-lucide-arrow-up-circle" class="h-4 w-4 text-[var(--color-primary-600)]" />
              Upgrade
            </button>
            <button
              type="button"
              class="inline-flex items-center gap-1.5 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] px-3.5 py-2 text-sm font-semibold text-[var(--p-text)] hover:bg-[var(--p-surface-sunken)] transition-colors"
              @click="renewDialogOpen = true"
            >
              <UIcon name="i-lucide-refresh-cw" class="h-4 w-4" />
              Renew
            </button>
          </template>
          <NuxtLink
            v-else
            to="/pricing"
            class="inline-flex items-center gap-1.5 rounded-xl bg-[var(--color-primary-600)] px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-[var(--color-primary-500)] transition-colors"
          >
            <UIcon name="i-lucide-trending-up" class="h-4 w-4" />
            Upgrade plan
          </NuxtLink>
        </template>
      </BillingSubscriptionSummary>

      <!-- Usage section -->
      <div class="mt-5 rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] shadow-sm p-5 sm:p-6">
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-sm font-bold text-[var(--p-text)]">Usage this month</h2>
          <button
            type="button"
            class="text-xs text-[var(--p-text-muted)] hover:text-[var(--p-text)] flex items-center gap-1"
            @click="store.fetchUsage()"
          >
            <UIcon name="i-lucide-refresh-cw" class="h-3.5 w-3.5" />
            Refresh
          </button>
        </div>

        <div v-if="store.usageLoading" class="grid gap-4 sm:grid-cols-2">
          <div v-for="i in 5" :key="i" class="h-12 animate-pulse rounded-xl bg-[var(--p-surface-sunken)]" />
        </div>

        <div v-else-if="store.usage" class="grid gap-5 sm:grid-cols-2">
          <BillingUsageMeter
            label="Shops"
            icon="i-lucide-store"
            :used="store.usage.shops"
            :limit="store.usage.shops_limit"
          />
          <BillingUsageMeter
            label="Machines"
            icon="i-lucide-cpu"
            :used="store.usage.machines"
            :limit="store.usage.machines_limit"
          />
          <BillingUsageMeter
            label="Active products"
            icon="i-lucide-package"
            :used="store.usage.active_products"
            :limit="store.usage.products_limit"
          />
          <BillingUsageMeter
            label="Quotes this month"
            icon="i-lucide-file-text"
            :used="store.usage.quotes_this_month"
            :limit="store.usage.quotes_per_month_limit"
          />
          <BillingUsageMeter
            label="Team members"
            icon="i-lucide-users"
            :used="store.usage.team_members"
            :limit="store.usage.users_limit"
          />
        </div>

        <!-- Over-limit notice -->
        <div
          v-if="store.isOverLimit"
          class="mt-4 flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 dark:border-amber-700/40 dark:bg-amber-900/20"
        >
          <UIcon name="i-lucide-alert-triangle" class="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div>
            <p class="text-sm font-semibold text-amber-800 dark:text-amber-300">You are over your plan limits</p>
            <p class="mt-0.5 text-xs text-amber-700 dark:text-amber-400">
              You can view existing data but cannot add more until you upgrade.
            </p>
            <NuxtLink
              to="/pricing"
              class="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 underline hover:text-amber-600 dark:text-amber-300"
            >
              View upgrade options
              <UIcon name="i-lucide-arrow-right" class="h-3.5 w-3.5" />
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Plan management -->
      <div class="mt-5 rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] shadow-sm p-5 sm:p-6">
        <h2 class="text-sm font-bold text-[var(--p-text)] mb-4">Plan management</h2>
        <div class="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
          <NuxtLink
            to="/pricing"
            class="inline-flex items-center gap-2 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] px-4 py-2.5 text-sm font-semibold text-[var(--p-text)] hover:bg-[var(--p-surface-sunken)] transition-colors"
          >
            <UIcon name="i-lucide-trending-up" class="h-4 w-4 text-[var(--color-primary-600)]" />
            Compare plans
          </NuxtLink>

          <button
            v-if="!store.isFreePlan && store.subscription?.auto_renew_enabled"
            type="button"
            class="inline-flex items-center gap-2 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] px-4 py-2.5 text-sm font-semibold text-[var(--p-text)] hover:bg-[var(--p-surface-sunken)] transition-colors"
            :disabled="store.actionLoading"
            @click="handleCancel"
          >
            <UIcon name="i-lucide-x-circle" class="h-4 w-4 text-[var(--p-text-muted)]" />
            Cancel at period end
          </button>

          <button
            v-if="store.isSuspended || !store.subscription?.auto_renew_enabled"
            type="button"
            class="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-500 transition-colors"
            :disabled="store.actionLoading"
            @click="renewDialogOpen = true"
          >
            <UIcon name="i-lucide-zap" class="h-4 w-4" />
            Reactivate subscription
          </button>
        </div>
      </div>

      <!-- Payment history -->
      <div class="mt-5">
        <BillingPaymentHistoryTable
          :payments="store.payments"
          :loading="store.paymentsLoading"
          @refresh="store.fetchPayments()"
        />
      </div>
    </template>

    <!-- Renewal / reactivation dialog -->
    <BillingMpesaPaymentDialog
      v-model:open="renewDialogOpen"
      v-model:phase="renewPhase"
      :plan-name="store.currentPlan?.name ?? ''"
      :amount="renewAmount"
      :interval="store.subscription?.billing_interval ?? 'monthly'"
      :submitting="store.actionLoading"
      :failure-message="store.error ?? ''"
      @submit="handleRenewalSubmit"
      @retry="renewPhase = 'input'"
      @cancel="renewDialogOpen = false"
      @done="renewDialogOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { useBillingStore } from '~/stores/billing'
import { useBilling } from '~/composables/useBilling'
import { useAuthStore } from '~/stores/auth'

definePageMeta({ middleware: ['auth'] })

usePrintySeo({ title: 'Subscription & Billing — Printy.ke' })

const store = useBillingStore()
const authStore = useAuthStore()
const { planPrice, formatKes } = useBilling()
const notification = useNotification()

const renewDialogOpen = ref(false)
const renewPhase = ref<'input' | 'pending' | 'success' | 'failed'>('input')
const initialLoading = ref(true)

onMounted(async () => {
  await Promise.all([
    store.fetchSubscription(),
    store.fetchUsage(),
    store.fetchPayments(),
    store.plans.length === 0 ? store.fetchPlans() : Promise.resolve(),
  ])
  initialLoading.value = false
})

const renewAmount = computed(() => {
  const plan = store.currentPlan
  const interval = store.subscription?.billing_interval ?? 'monthly'
  if (!plan || plan.code === 'FREE') return 'Free'
  return planPrice(plan, interval)
})

function openRenewalDialog() {
  renewPhase.value = 'input'
  renewDialogOpen.value = true
}

async function handleCancel() {
  if (!confirm('Are you sure you want to cancel? Your plan stays active until the end of the current period.')) return
  try {
    await store.cancel(false)
    notification.success('Your subscription will cancel at the end of this period.')
  } catch {
    notification.error(store.error ?? 'Cancellation failed. Please try again.')
  }
}

async function handleRenewalSubmit(phone: string) {
  renewPhase.value = 'pending'
  try {
    if (store.isSuspended || !store.subscription?.auto_renew_enabled) {
      await store.reactivate({ phone_number: phone })
    } else {
      await store.initiateRenewal({ phone_number: phone })
    }
    store.pollSubscriptionStatus().then(() => {
      if (store.isActive) renewPhase.value = 'success'
    })
  } catch {
    renewPhase.value = 'failed'
  }
}
</script>
