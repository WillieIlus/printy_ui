/**
 * useBilling — high-level composable wrapping the billing store.
 * Use this in pages/components instead of calling the store directly.
 */
import { useBillingStore } from '~/stores/billing'
import { usePrintyToast } from '~/composables/usePrintyToast'
import type {
  Plan,
  PlanCode,
  BillingInterval,
  SubscribePayload,
  UpgradePayload,
  UpgradePrompt,
} from '~/shared/types/billing'

export function useBilling() {
  const store = useBillingStore()
  const toast = usePrintyToast()

  // -------------------------------------------------------------------------
  // Formatters
  // -------------------------------------------------------------------------

  function formatKes(amount: string | number): string {
    const n = typeof amount === 'string' ? parseFloat(amount) : amount
    if (n === 0) return 'Free'
    return `KES ${n.toLocaleString('en-KE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
  }

  function planPrice(plan: Plan, interval: BillingInterval): string {
    const raw = interval === 'annual' ? plan.price_annual : plan.price_monthly
    return formatKes(raw)
  }

  function planPriceSuffix(plan: Plan, interval: BillingInterval): string {
    const n = parseFloat(interval === 'annual' ? plan.price_annual : plan.price_monthly)
    if (n === 0) return ''
    return interval === 'annual' ? '/year' : '/month'
  }

  function limitLabel(value: number | null): string {
    return value === null ? 'Unlimited' : value.toLocaleString()
  }

  function usagePercent(used: number, limit: number | null): number {
    if (limit === null || limit === 0) return 0
    return Math.min(100, Math.round((used / limit) * 100))
  }

  // -------------------------------------------------------------------------
  // Status helpers
  // -------------------------------------------------------------------------

  function statusLabel(status: string): string {
    const labels: Record<string, string> = {
      active: 'Active',
      trialing: 'Trial',
      past_due: 'Payment due',
      grace_period: 'Grace period',
      suspended: 'Suspended',
      cancelled: 'Cancelled',
      expired: 'Expired',
    }
    return labels[status] ?? status
  }

  function statusColor(status: string): string {
    if (status === 'active' || status === 'trialing') return 'text-emerald-600 dark:text-emerald-400'
    if (status === 'grace_period' || status === 'past_due') return 'text-amber-600 dark:text-amber-400'
    return 'text-red-600 dark:text-red-400'
  }

  function txnStatusLabel(status: string): string {
    const map: Record<string, string> = {
      pending: 'Pending',
      processing: 'Awaiting PIN',
      success: 'Paid',
      failed: 'Failed',
      cancelled: 'Cancelled',
      timed_out: 'Timed out',
    }
    return map[status] ?? status
  }

  function txnStatusColor(status: string): string {
    if (status === 'success') return 'text-emerald-600 dark:text-emerald-400'
    if (status === 'pending' || status === 'processing') return 'text-amber-600 dark:text-amber-400'
    return 'text-red-600 dark:text-red-400'
  }

  // -------------------------------------------------------------------------
  // Upgrade prompt generation
  // -------------------------------------------------------------------------

  const NEXT_PLAN: Record<PlanCode, PlanCode | null> = {
    FREE: 'BIASHARA',
    BIASHARA: 'BIASHARA_PLUS',
    BIASHARA_PLUS: 'BIASHARA_MAX',
    BIASHARA_MAX: null,
  }

  function buildUpgradePrompt(
    resource: UpgradePrompt['resource'],
    current: number,
    limit: number,
    message: string,
  ): UpgradePrompt {
    const currentCode = (store.currentPlan?.code ?? 'FREE') as PlanCode
    return {
      resource,
      current,
      limit,
      planName: store.currentPlan?.name ?? 'Free',
      message,
      suggestedPlan: NEXT_PLAN[currentCode],
    }
  }

  function shopLimitPrompt(): UpgradePrompt | null {
    const used = store.usage?.shops ?? 0
    const limit = store.shopLimit
    if (used < limit) return null
    const currentCode = (store.currentPlan?.code ?? 'FREE') as PlanCode
    const messages: Record<PlanCode, string> = {
      FREE: 'Free includes 1 shop only. Upgrade to Biashara Plus to manage 2 shops.',
      BIASHARA: 'Biashara supports 1 shop. Upgrade to Biashara Plus to add a second shop.',
      BIASHARA_PLUS: 'Biashara Plus supports 2 shops. Upgrade to Biashara Max to manage up to 5 shops.',
      BIASHARA_MAX: 'Biashara Max supports up to 5 shops. You have reached the maximum.',
    }
    return buildUpgradePrompt('shop', used, limit, messages[currentCode])
  }

  function machineLimitPrompt(): UpgradePrompt | null {
    const used = store.usage?.machines ?? 0
    const limit = store.machineLimit
    if (limit === null || used < limit) return null
    return buildUpgradePrompt(
      'machine',
      used,
      limit,
      `Your ${store.currentPlan?.name ?? 'plan'} allows ${limit} machine(s). Upgrade to add more.`,
    )
  }

  function productLimitPrompt(): UpgradePrompt | null {
    const used = store.usage?.active_products ?? 0
    const limit = store.productLimit
    if (limit === null || used < limit) return null
    return buildUpgradePrompt(
      'product',
      used,
      limit,
      `Your ${store.currentPlan?.name ?? 'plan'} allows ${limit} products. Upgrade to add more.`,
    )
  }

  function quoteLimitPrompt(): UpgradePrompt | null {
    const used = store.usage?.quotes_this_month ?? 0
    const limit = store.quoteLimit
    if (limit === null || used < limit) return null
    return buildUpgradePrompt(
      'quote',
      used,
      limit,
      `You've used all ${limit} quotes for this month on the ${store.currentPlan?.name ?? 'current'} plan.`,
    )
  }

  function userLimitPrompt(): UpgradePrompt | null {
    const used = store.usage?.team_members ?? 0
    const limit = store.userLimit
    if (used < limit) return null
    return buildUpgradePrompt(
      'user',
      used,
      limit,
      `Your ${store.currentPlan?.name ?? 'plan'} allows ${limit} team member(s). Upgrade to add more.`,
    )
  }

  // -------------------------------------------------------------------------
  // Actions with notifications
  // -------------------------------------------------------------------------

  async function subscribeWithFeedback(payload: SubscribePayload): Promise<boolean> {
    const loadingId = toast.paymentStarted()
    try {
      await store.subscribe(payload)
      toast.update(loadingId, {
        title: 'Payment started',
        message: 'Check your phone and enter your M-PESA PIN to continue.',
        type: 'loading',
        context: 'payment',
        persistent: true,
      })
      return true
    } catch {
      toast.dismiss(loadingId)
      toast.paymentFailed(store.error ?? 'Subscription request failed. Please try again.')
      return false
    }
  }

  async function upgradeWithFeedback(payload: UpgradePayload): Promise<boolean> {
    const loadingId = toast.paymentStarted()
    try {
      await store.upgrade(payload)
      toast.update(loadingId, {
        title: 'Payment started',
        message: 'Check your phone and enter your M-PESA PIN to upgrade.',
        type: 'loading',
        context: 'payment',
        persistent: true,
      })
      return true
    } catch {
      toast.dismiss(loadingId)
      toast.paymentFailed(store.error ?? 'Upgrade request failed. Please try again.')
      return false
    }
  }

  async function initiateRenewalWithFeedback(phone?: string): Promise<boolean> {
    const loadingId = toast.paymentStarted()
    try {
      await store.initiateRenewal(phone ? { phone_number: phone } : {})
      toast.update(loadingId, {
        title: 'Payment started',
        message: 'Renewal request sent. Check your phone for the M-PESA prompt.',
        type: 'loading',
        context: 'payment',
        persistent: true,
      })
      return true
    } catch {
      toast.dismiss(loadingId)
      toast.paymentFailed(store.error ?? 'Could not initiate renewal. Please try again.')
      return false
    }
  }

  // -------------------------------------------------------------------------
  // Init
  // -------------------------------------------------------------------------

  async function initBilling() {
    await Promise.all([
      store.plans.length === 0 ? store.fetchPlans() : Promise.resolve(),
      store.subscription === null ? store.fetchSubscription() : Promise.resolve(),
      store.usage === null ? store.fetchUsage() : Promise.resolve(),
    ])
  }

  return {
    store,
    // formatters
    formatKes,
    planPrice,
    planPriceSuffix,
    limitLabel,
    usagePercent,
    // status
    statusLabel,
    statusColor,
    txnStatusLabel,
    txnStatusColor,
    // prompts
    shopLimitPrompt,
    machineLimitPrompt,
    productLimitPrompt,
    quoteLimitPrompt,
    userLimitPrompt,
    buildUpgradePrompt,
    // actions
    subscribeWithFeedback,
    upgradeWithFeedback,
    initiateRenewalWithFeedback,
    initBilling,
  }
}
