<template>
  <DashboardShell sidebar-tone="dark">
    <template #sidebar>
      <ShopSidebarNav />
    </template>

    <div class="space-y-6">
      <DashboardTopBar
        eyebrow="Print shop"
        title="Overview"
        description="Run requests, setup readiness, and quote coverage from one command center."
      />

      <section class="rounded-[2rem] bg-slate-950 p-6 text-white ring-1 ring-white/10 md:p-8">
        <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div class="max-w-3xl space-y-3">
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Next action</p>
            <h2 class="text-3xl font-semibold tracking-tight">{{ nextAction.title }}</h2>
            <p class="text-sm leading-6 text-slate-300 md:text-base">{{ nextAction.body }}</p>
          </div>
          <NuxtLink
            :to="nextAction.to"
            class="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
          >
            {{ nextAction.label }}
          </NuxtLink>
        </div>
      </section>

      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article
          v-for="card in summaryCards"
          :key="card.label"
          class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5"
        >
          <p class="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--p-text-muted)]">{{ card.label }}</p>
          <p class="mt-3 text-2xl font-semibold text-[var(--p-text)]">{{ card.value }}</p>
          <p class="mt-2 text-sm leading-6 text-[var(--p-text-muted)]">{{ card.helper }}</p>
        </article>
      </div>

      <div class="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6">
          <div class="flex items-start justify-between gap-4">
            <div class="space-y-1">
              <p class="text-sm font-semibold text-[var(--p-text)]">New quote requests</p>
              <p class="text-sm text-[var(--p-text-muted)]">Real request inbox activity from your shop queue.</p>
            </div>
            <NuxtLink to="/dashboard/shop/requests" class="text-sm font-semibold text-[var(--p-primary)] underline-offset-2 hover:underline">
              Open inbox
            </NuxtLink>
          </div>

          <div v-if="dashboardLoading && !dashboard" class="mt-5 space-y-3">
            <div v-for="i in 3" :key="i" class="h-20 animate-pulse rounded-2xl bg-[var(--p-bg-soft)]" />
          </div>

          <div v-else-if="recentRequests.length" class="mt-5 space-y-3">
            <article
              v-for="request in recentRequests"
              :key="request.id"
              class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-bg-soft)] p-4"
            >
              <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div class="space-y-1">
                  <p class="text-sm font-semibold text-[var(--p-text)]">{{ request.client }}</p>
                  <p class="text-sm text-[var(--p-text-muted)]">{{ request.job }}</p>
                </div>
                <div class="text-sm text-[var(--p-text-muted)] md:text-right">
                  <p>{{ request.status }}</p>
                  <p class="mt-1">{{ request.when }}</p>
                </div>
              </div>
            </article>
          </div>

          <div
            v-else
            class="mt-5 rounded-2xl border border-dashed border-[var(--p-border)] px-5 py-10 text-center"
          >
            <p class="text-sm font-semibold text-[var(--p-text)]">No quote requests yet</p>
            <p class="mt-2 text-sm text-[var(--p-text-muted)]">New request activity will appear here after buyers send work to your shop.</p>
          </div>
        </section>

        <section class="space-y-6">
          <div class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6">
            <div class="flex items-start justify-between gap-4">
              <div class="space-y-1">
                <p class="text-sm font-semibold text-[var(--p-text)]">Setup readiness</p>
                <p class="text-sm text-[var(--p-text-muted)]">Real readiness from the setup endpoint.</p>
              </div>
              <NuxtLink :to="setupActionUrl" class="text-sm font-semibold text-[var(--p-primary)] underline-offset-2 hover:underline">
                Review setup
              </NuxtLink>
            </div>

            <div v-if="setupStatus" class="mt-5 space-y-4">
              <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-bg-soft)] p-4">
                <div class="flex items-center justify-between gap-4">
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--p-text-muted)]">Overall readiness</p>
                    <p class="mt-2 text-2xl font-semibold text-[var(--p-text)]">{{ setupStatus.setup_percent ?? 0 }}%</p>
                  </div>
                  <span
                    class="rounded-full px-3 py-1 text-xs font-semibold"
                    :class="setupStatus.can_price_requests ? 'bg-green-500/10 text-green-700' : 'bg-amber-500/10 text-amber-700'"
                  >
                    {{ setupStatus.can_price_requests ? 'Ready to price' : 'Needs setup' }}
                  </span>
                </div>
                <p class="mt-3 text-sm text-[var(--p-text-muted)]">{{ setupReadinessCopy }}</p>
              </div>

              <div class="space-y-3">
                <div
                  v-for="item in setupChecklist"
                  :key="item.label"
                  class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-bg-soft)] p-4"
                >
                  <div class="flex items-start justify-between gap-3">
                    <div>
                      <p class="text-sm font-semibold text-[var(--p-text)]">{{ item.label }}</p>
                      <p class="mt-1 text-sm text-[var(--p-text-muted)]">{{ item.helper }}</p>
                    </div>
                    <span
                      class="rounded-full px-2.5 py-1 text-xs font-semibold"
                      :class="item.done ? 'bg-green-500/10 text-green-700' : 'bg-amber-500/10 text-amber-700'"
                    >
                      {{ item.done ? 'Ready' : 'Next' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="mt-5 rounded-2xl border border-dashed border-[var(--p-border)] px-5 py-10 text-center">
              <p class="text-sm font-semibold text-[var(--p-text)]">Setup status is not available yet</p>
              <p class="mt-2 text-sm text-[var(--p-text-muted)]">Refresh after selecting or creating a shop to load setup readiness.</p>
            </div>
          </div>
        </section>
      </div>

      <div class="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <section class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6">
          <div class="flex items-start justify-between gap-4">
            <div class="space-y-1">
              <p class="text-sm font-semibold text-[var(--p-text)]">Rate-card health</p>
              <p class="text-sm text-[var(--p-text-muted)]">Real quote-readiness counts from papers, pricing rules, and finishing rates.</p>
            </div>
            <NuxtLink to="/dashboard/shop/setup" class="text-sm font-semibold text-[var(--p-primary)] underline-offset-2 hover:underline">
              Open setup
            </NuxtLink>
          </div>

          <div class="mt-5 grid gap-3 sm:grid-cols-3">
            <article
              v-for="item in rateCardHealth"
              :key="item.label"
              class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-bg-soft)] p-4"
            >
              <p class="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--p-text-muted)]">{{ item.label }}</p>
              <p class="mt-2 text-2xl font-semibold text-[var(--p-text)]">{{ item.value }}</p>
              <p class="mt-2 text-sm text-[var(--p-text-muted)]">{{ item.helper }}</p>
              <NuxtLink :to="item.to" class="mt-3 inline-flex text-xs font-semibold text-[var(--p-primary)] underline-offset-2 hover:underline">
                {{ item.linkLabel }}
              </NuxtLink>
            </article>
          </div>
        </section>

        <section class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6">
          <div class="space-y-1">
            <p class="text-sm font-semibold text-[var(--p-text)]">Performance</p>
            <p class="text-sm text-[var(--p-text-muted)]">Shown only from real request and response activity.</p>
          </div>

          <div v-if="hasPerformanceData" class="mt-5 grid gap-3 sm:grid-cols-2">
            <article
              v-for="item in performanceCards"
              :key="item.label"
              class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-bg-soft)] p-4"
            >
              <p class="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--p-text-muted)]">{{ item.label }}</p>
              <p class="mt-2 text-2xl font-semibold text-[var(--p-text)]">{{ item.value }}</p>
              <p class="mt-2 text-sm text-[var(--p-text-muted)]">{{ item.helper }}</p>
            </article>
          </div>

          <div
            v-else
            class="mt-5 rounded-2xl border border-dashed border-[var(--p-border)] px-5 py-10 text-center"
          >
            <p class="text-sm font-semibold text-[var(--p-text)]">No performance insights yet</p>
            <p class="mt-2 text-sm text-[var(--p-text-muted)]">Performance insights will appear after you respond to quote requests.</p>
          </div>
        </section>
      </div>
    </div>
  </DashboardShell>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import DashboardShell from '~/components/dashboard/shared/DashboardShell.vue'
import DashboardTopBar from '~/components/dashboard/shared/DashboardTopBar.vue'
import ShopSidebarNav from '~/components/dashboard/shop/ShopSidebarNav.vue'
import { useQuoteInboxStore } from '~/stores/quoteInbox'
import { useSetupStatusStore } from '~/stores/setupStatus'
import { useShopStore } from '~/stores/shop'

definePageMeta({ layout: 'dashboard' })

const quoteInboxStore = useQuoteInboxStore()
const setupStatusStore = useSetupStatusStore()
const shopStore = useShopStore()

const { dashboard, loading: dashboardLoading } = storeToRefs(quoteInboxStore)
const { status: setupStatus } = storeToRefs(setupStatusStore)

const setupActionUrl = computed(() => setupStatus.value?.next_url || '/dashboard/shop/setup')

const nextAction = computed(() => {
  const summary = dashboard.value
  const setup = setupStatus.value
  const pending = summary?.pending_responses_count ?? 0
  const stale = summary?.stale_requests_count ?? 0

  if (pending > 0) {
    return {
      title: `${pending} quote request${pending === 1 ? '' : 's'} need your response.`,
      body: stale > 0
        ? `${stale} of them have been waiting more than 24 hours. Start with the oldest requests in your inbox.`
        : 'Open the inbox and send replies so buyers keep moving forward.',
      label: 'Open requests',
      to: '/dashboard/shop/requests',
    }
  }

  if (setup?.next_step && setup.next_step !== 'complete') {
    const step = setup.steps?.find(item => item.key === setup.next_step)
    return {
      title: setup.recommendations?.[0] || setup.warnings?.[0] || 'Continue your shop setup.',
      body: step?.blocking_reason || 'Complete the next setup item so Printy can match and price more jobs.',
      label: step?.cta_label || 'Continue setup',
      to: setup.next_url,
    }
  }

  if ((summary?.received_quote_requests ?? 0) > 0) {
    return {
      title: 'Your queue is clear right now.',
      body: 'Keep an eye on new requests and refresh this overview when more buyer activity comes in.',
      label: 'Open inbox',
      to: '/dashboard/shop/requests',
    }
  }

  return {
    title: 'Add your first paper to start matching jobs.',
    body: 'Once materials and pricing rules are in place, this overview will start guiding live request work instead of setup.',
    label: 'Open materials',
    to: '/dashboard/shop/materials',
  }
})

const summaryCards = computed(() => {
  const summary = dashboard.value
  const setup = setupStatus.value
  const pending = summary?.pending_responses_count ?? 0
  const requests = summary?.received_quote_requests ?? 0

  return [
    {
      label: 'Requests in inbox',
      value: String(requests),
      helper: requests > 0 ? 'Real quote requests received by this shop.' : 'No buyer requests have arrived yet.',
    },
    {
      label: 'Need response',
      value: String(pending),
      helper: pending > 0 ? 'Requests still waiting for a shop reply.' : 'No current reply backlog.',
    },
    {
      label: 'Rate-card readiness',
      value: `${setup?.rate_card_completeness ?? 0}%`,
      helper: setup?.can_price_requests ? 'Printy can calculate prices from your current setup.' : 'Add more rate-card data to improve pricing coverage.',
    },
    {
      label: 'Shop visibility',
      value: setup?.can_receive_requests ? 'Receiving requests' : 'Not receiving yet',
      helper: setup?.can_receive_requests ? 'Your shop can receive buyer requests.' : 'Publish the shop and complete setup to receive requests.',
    },
  ]
})

const recentRequests = computed(() => (dashboard.value?.recent_requests ?? []).map((request) => {
  const requestSnapshot = (request.request_snapshot ?? {}) as Record<string, unknown>
  const calculatorInputs = (requestSnapshot.calculator_inputs ?? {}) as Record<string, unknown>
  const productType = typeof calculatorInputs.product_type === 'string'
    ? calculatorInputs.product_type.replace(/_/g, ' ')
    : 'Custom print job'
  const quantity = typeof calculatorInputs.quantity === 'number'
    ? `${calculatorInputs.quantity.toLocaleString()} pcs`
    : ''
  const matchedSpecs = Array.isArray(requestSnapshot.matched_specs)
    ? requestSnapshot.matched_specs.slice(0, 2).map(String)
    : []

  return {
    id: request.id,
    client: request.customer_name || request.customer_email || request.request_reference || `Request #${request.id}`,
    job: [productType, quantity, ...matchedSpecs].filter(Boolean).join(', ') || 'Quote request received',
    status: request.latest_response?.status_label || request.status_label || 'Awaiting response',
    when: formatRelative(request.created_at),
  }
}))

const setupReadinessCopy = computed(() => {
  const setup = setupStatus.value
  if (!setup) return 'Setup readiness will appear after the shop status loads.'
  return setup.recommendations?.[0] || setup.warnings?.[0] || 'Your main setup steps are in place.'
})

const setupChecklist = computed(() => {
  const setup = setupStatus.value
  if (!setup) return []

  return (setup.steps ?? []).slice(0, 3).map((step) => ({
    label: step.label,
    done: step.done,
    helper: step.done ? 'Already in place.' : step.blocking_reason,
  }))
})

const rateCardHealth = computed(() => {
  const setup = setupStatus.value
  return [
    {
      label: 'Materials',
      value: String(setup?.materials_count ?? 0),
      helper: (setup?.materials_count ?? 0) > 0 ? 'Active paper or material entries available.' : 'Add your first paper to start matching jobs.',
      to: '/dashboard/shop/materials',
      linkLabel: 'Open materials',
    },
    {
      label: 'Pricing rules',
      value: String(setup?.pricing_rules_count ?? 0),
      helper: (setup?.pricing_rules_count ?? 0) > 0 ? 'Active machine pricing rules available.' : 'Add pricing rules so Printy can calculate your prices.',
      to: '/dashboard/shop/pricing',
      linkLabel: 'Open pricing',
    },
    {
      label: 'Finishing rates',
      value: String(setup?.finishing_rates_count ?? 0),
      helper: (setup?.finishing_rates_count ?? 0) > 0 ? 'Finishing add-ons can be priced from saved rates.' : 'Add finishing rates to reduce manual confirmation.',
      to: '/dashboard/shop/finishing',
      linkLabel: 'Open finishing',
    },
  ]
})

const hasPerformanceData = computed(() => {
  const summary = dashboard.value
  return (summary?.received_quote_requests ?? 0) > 0 || (summary?.responded_requests_count ?? 0) > 0 || (summary?.accepted_quotes_count ?? 0) > 0
})

const performanceCards = computed(() => {
  const summary = dashboard.value
  return [
    {
      label: 'Requests received',
      value: String(summary?.received_quote_requests ?? 0),
      helper: 'Real quote requests received by this shop.',
    },
    {
      label: 'Responses sent',
      value: String(summary?.responded_requests_count ?? 0),
      helper: 'Requests with a recorded shop response.',
    },
    {
      label: 'Average response time',
      value: formatResponseTime(summary?.average_response_hours),
      helper: summary?.average_response_hours != null
        ? 'Calculated from request and response timestamps.'
        : 'A response-time average appears after replies are sent.',
    },
    {
      label: 'Accepted quotes',
      value: String(summary?.accepted_quotes_count ?? 0),
      helper: 'Accepted quote outcomes recorded in the request workflow.',
    },
  ]
})

function formatRelative(iso?: string) {
  if (!iso) return 'Just now'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return 'Just now'
  const diffHours = Math.floor((Date.now() - date.getTime()) / 3_600_000)
  if (diffHours < 1) return 'Just now'
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  return diffDays < 7 ? `${diffDays}d ago` : date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function formatResponseTime(hours?: number | null) {
  if (hours == null) return 'Waiting for data'
  if (hours < 1) return `${Math.round(hours * 60)} min`
  if (hours < 24) return `${hours.toFixed(hours < 10 ? 1 : 0)}h`
  const days = hours / 24
  return `${days.toFixed(days < 10 ? 1 : 0)}d`
}

async function loadOverview() {
  const activeShop = await shopStore.ensureActiveShop(shopStore.selectedShopSlug ?? null).catch(() => null)
  const slug = activeShop?.slug ?? shopStore.selectedShopSlug ?? null

  await setupStatusStore.fetchStatus(slug).catch(() => undefined)

  if (!slug) {
    dashboard.value = null
    return
  }

  try {
    await quoteInboxStore.fetchDashboard(slug)
  } catch {
    dashboard.value = null
  }
}

onMounted(loadOverview)
watch(() => shopStore.selectedShopSlug, () => {
  loadOverview().catch(() => undefined)
})
</script>
