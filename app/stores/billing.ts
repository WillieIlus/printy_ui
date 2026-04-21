import { defineStore } from 'pinia'
import { API } from '~/shared/api-paths'
import { parseApiError } from '~/utils/api-error'
import type {
  Plan,
  Subscription,
  Usage,
  PaymentTransaction,
  SubscribePayload,
  UpgradePayload,
  DowngradePayload,
  RenewalPayload,
  SubscribeResponse,
} from '~/shared/types/billing'

export const useBillingStore = defineStore('billing', {
  state: () => ({
    plans: [] as Plan[],
    subscription: null as Subscription | null,
    usage: null as Usage | null,
    payments: [] as PaymentTransaction[],

    // Pending payment tracking
    pendingTransaction: null as PaymentTransaction | null,
    paymentPolling: false,

    // Loading flags
    plansLoading: false,
    subscriptionLoading: false,
    usageLoading: false,
    paymentsLoading: false,
    actionLoading: false,

    // Errors
    error: null as string | null,
  }),

  getters: {
    currentPlan: (state): Plan | null => state.subscription?.plan ?? null,

    isFreePlan: (state): boolean => state.subscription?.plan?.code === 'FREE',

    isPaidPlan: (state): boolean =>
      Boolean(state.subscription?.plan?.code) && state.subscription?.plan?.code !== 'FREE',

    isActive: (state): boolean =>
      state.subscription?.status === 'active' || state.subscription?.status === 'trialing',

    isGracePeriod: (state): boolean => state.subscription?.status === 'grace_period',

    isSuspended: (state): boolean => state.subscription?.status === 'suspended',

    isPastDue: (state): boolean => state.subscription?.status === 'past_due',

    isOverLimit: (state): boolean => state.subscription?.over_limit ?? false,

    shopLimit: (state): number => state.subscription?.plan?.shops_limit ?? 1,

    machineLimit: (state): number | null => state.subscription?.plan?.machines_limit ?? 1,

    productLimit: (state): number | null => state.subscription?.plan?.products_limit ?? 3,

    quoteLimit: (state): number | null => state.subscription?.plan?.quotes_per_month_limit ?? 15,

    userLimit: (state): number => state.subscription?.plan?.users_limit ?? 1,

    renewalDate: (state): string | null => state.subscription?.renews_at ?? null,

    autoRenewEnabled: (state): boolean => state.subscription?.auto_renew_enabled ?? false,

    linkedShops: (state): Subscription['shops'] => state.subscription?.shops ?? [],

    availableUpgrades: (state): Plan[] => {
      if (!state.subscription) return state.plans.filter(p => p.code !== 'FREE')
      const currentOrder = state.subscription.plan.sort_order
      return state.plans.filter(p => p.sort_order > currentOrder)
    },

    hasPendingPayment: (state): boolean =>
      Boolean(state.pendingTransaction) &&
      ['pending', 'processing'].includes(state.pendingTransaction?.status ?? ''),
  },

  actions: {
    async fetchPlans() {
      this.plansLoading = true
      this.error = null
      try {
        const { $api } = useNuxtApp()
        const result = await ($api as (u: string, o?: object) => Promise<Plan[] | { results: Plan[] }>)(
          API.billingPlans(),
        )
        // Handle both plain array and DRF paginated response { count, results }
        this.plans = Array.isArray(result) ? result : (result as { results: Plan[] }).results ?? []
      } catch (err: unknown) {
        this.error = parseApiError(err, 'Failed to load plans')
      } finally {
        this.plansLoading = false
      }
    },

    async fetchSubscription() {
      this.subscriptionLoading = true
      this.error = null
      try {
        const { $api } = useNuxtApp()
        this.subscription = await ($api as (u: string, o?: object) => Promise<Subscription>)(
          API.billingSubscription(),
        )
      } catch (err: unknown) {
        this.error = parseApiError(err, 'Failed to load subscription')
      } finally {
        this.subscriptionLoading = false
      }
    },

    async fetchUsage() {
      this.usageLoading = true
      try {
        const { $api } = useNuxtApp()
        this.usage = await ($api as (u: string, o?: object) => Promise<Usage>)(API.billingUsage())
      } catch {
        // Non-critical — ignore
      } finally {
        this.usageLoading = false
      }
    },

    async fetchPayments() {
      this.paymentsLoading = true
      try {
        const { $api } = useNuxtApp()
        const result = await ($api as (u: string, o?: object) => Promise<{ results: PaymentTransaction[] } | PaymentTransaction[]>)(
          API.billingPayments(),
        )
        this.payments = Array.isArray(result) ? result : result.results
      } catch {
        // Non-critical
      } finally {
        this.paymentsLoading = false
      }
    },

    async subscribe(payload: SubscribePayload): Promise<SubscribeResponse> {
      this.actionLoading = true
      this.error = null
      try {
        const { $api } = useNuxtApp()
        const res = await ($api as (u: string, o?: object) => Promise<SubscribeResponse>)(
          API.billingSubscribe(),
          { method: 'POST', body: payload },
        )
        this.pendingTransaction = res.transaction
        return res
      } catch (err: unknown) {
        this.error = parseApiError(err, 'Subscription failed')
        throw err
      } finally {
        this.actionLoading = false
      }
    },

    async upgrade(payload: UpgradePayload): Promise<SubscribeResponse> {
      this.actionLoading = true
      this.error = null
      try {
        const { $api } = useNuxtApp()
        const res = await ($api as (u: string, o?: object) => Promise<SubscribeResponse>)(
          API.billingUpgrade(),
          { method: 'POST', body: payload },
        )
        this.pendingTransaction = res.transaction
        return res
      } catch (err: unknown) {
        this.error = parseApiError(err, 'Upgrade failed')
        throw err
      } finally {
        this.actionLoading = false
      }
    },

    async downgrade(payload: DowngradePayload): Promise<void> {
      this.actionLoading = true
      this.error = null
      try {
        const { $api } = useNuxtApp()
        await ($api as (u: string, o?: object) => Promise<unknown>)(
          API.billingDowngrade(),
          { method: 'POST', body: payload },
        )
        await this.fetchSubscription()
      } catch (err: unknown) {
        this.error = parseApiError(err, 'Downgrade failed')
        throw err
      } finally {
        this.actionLoading = false
      }
    },

    async cancel(immediate = false): Promise<void> {
      this.actionLoading = true
      this.error = null
      try {
        const { $api } = useNuxtApp()
        await ($api as (u: string, o?: object) => Promise<unknown>)(
          API.billingCancel(),
          { method: 'POST', body: { immediate } },
        )
        await this.fetchSubscription()
      } catch (err: unknown) {
        this.error = parseApiError(err, 'Cancellation failed')
        throw err
      } finally {
        this.actionLoading = false
      }
    },

    async reactivate(payload: RenewalPayload = {}): Promise<SubscribeResponse> {
      this.actionLoading = true
      this.error = null
      try {
        const { $api } = useNuxtApp()
        const res = await ($api as (u: string, o?: object) => Promise<SubscribeResponse>)(
          API.billingReactivate(),
          { method: 'POST', body: payload },
        )
        this.pendingTransaction = res.transaction
        return res
      } catch (err: unknown) {
        this.error = parseApiError(err, 'Reactivation failed')
        throw err
      } finally {
        this.actionLoading = false
      }
    },

    async initiateRenewal(payload: RenewalPayload = {}): Promise<SubscribeResponse> {
      this.actionLoading = true
      this.error = null
      try {
        const { $api } = useNuxtApp()
        const res = await ($api as (u: string, o?: object) => Promise<SubscribeResponse>)(
          API.billingInitiateRenewal(),
          { method: 'POST', body: payload },
        )
        this.pendingTransaction = res.transaction
        return res
      } catch (err: unknown) {
        this.error = parseApiError(err, 'Renewal failed')
        throw err
      } finally {
        this.actionLoading = false
      }
    },

    clearPendingTransaction() {
      this.pendingTransaction = null
    },

    async pollSubscriptionStatus(maxAttempts = 10, intervalMs = 4000): Promise<void> {
      if (this.paymentPolling) return
      this.paymentPolling = true
      try {
        let attempts = 0
        while (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, intervalMs))
          await this.fetchSubscription()
          const status = this.subscription?.status
          if (status === 'active' || status === 'trialing') {
            this.pendingTransaction = null
            break
          }
          attempts++
        }
      } finally {
        this.paymentPolling = false
      }
    },
  },
})
