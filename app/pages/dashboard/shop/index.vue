<template>
  <DashboardShell sidebar-tone="dark">
    <template #sidebar>
      <ShopSidebarNav />
    </template>

    <div class="space-y-6">
      <DashboardTopBar
        eyebrow="Production"
        title="Overview"
        description="Run the production queue from assignments first. Quote intake and setup remain available, but they no longer define the workspace."
      />

      <template v-if="setupStatus && !setupStatus.has_shop">
        <section class="flex flex-col items-center justify-center rounded-[2rem] bg-slate-950 px-6 py-20 text-center text-white ring-1 ring-white/10">
          <div class="max-w-md space-y-4">
            <div class="mx-auto flex size-16 items-center justify-center rounded-3xl bg-white/10 text-white">
              <Icon name="lucide:store" class="size-8" />
            </div>
            <h2 class="text-3xl font-semibold tracking-tight">Create your first shop</h2>
            <p class="text-slate-400">
              Add your shop details to start receiving managed assignments, quote intake, and production workflow updates.
            </p>
            <NuxtLink
              to="/dashboard/shops/create"
              class="inline-flex h-12 items-center justify-center rounded-xl bg-white px-8 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              Get started
            </NuxtLink>
          </div>
        </section>
      </template>

      <template v-else>
        <section class="rounded-[2rem] bg-slate-950 p-6 text-white ring-1 ring-white/10 md:p-8">
          <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div class="max-w-3xl space-y-3">
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Production command</p>
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

        <section class="grid gap-4 md:grid-cols-4">
          <article
            v-for="card in summaryCards"
            :key="card.label"
            class="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)]"
          >
            <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">{{ card.label }}</p>
            <p class="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{{ card.value }}</p>
            <p class="mt-2 text-sm leading-6 text-slate-500">{{ card.helper }}</p>
          </article>
        </section>

        <div class="grid gap-6 xl:grid-cols-[1.12fr_0.88fr]">
          <section class="space-y-4">
            <ProductionWorkflowBoard :assignments="shopAssignments" />
            <MachineUtilizationPanel :assignments="shopAssignments" />
          </section>

          <section class="space-y-4">
            <AssignmentQueue :assignments="shopAssignments.slice(0, 3)" @select="openAssignment" />
          </section>
        </div>

        <div class="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <section class="rounded-[1.9rem] border border-slate-200 bg-white p-6 shadow-[0_16px_36px_rgba(15,23,42,0.06)]">
            <div class="flex items-start justify-between gap-4">
              <div class="space-y-1">
                <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">Setup readiness</p>
                <h3 class="text-lg font-semibold tracking-tight text-slate-950">Production infrastructure readiness</h3>
              </div>
              <NuxtLink :to="setupActionUrl" class="text-sm font-semibold text-[var(--p-primary)] underline-offset-2 hover:underline">
                Review setup
              </NuxtLink>
            </div>

            <div v-if="setupStatus" class="mt-5 space-y-4">
              <div class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                <div class="flex items-center justify-between gap-4">
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Overall readiness</p>
                    <p class="mt-2 text-2xl font-semibold text-slate-950">{{ setupStatus.setup_percent ?? 0 }}%</p>
                  </div>
                  <span
                    class="rounded-full px-3 py-1 text-xs font-semibold"
                    :class="setupStatus.can_price_requests ? 'bg-emerald-500/12 text-emerald-700' : 'bg-amber-500/12 text-amber-700'"
                  >
                    {{ setupStatus.can_price_requests ? 'Ready to route' : 'Needs setup' }}
                  </span>
                </div>
                <p class="mt-3 text-sm text-slate-500">{{ setupReadinessCopy }}</p>
              </div>

              <div class="space-y-3">
                <div
                  v-for="item in setupChecklist"
                  :key="item.label"
                  class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4"
                >
                  <div class="flex items-start justify-between gap-3">
                    <div>
                      <p class="text-sm font-semibold text-slate-950">{{ item.label }}</p>
                      <p class="mt-1 text-sm text-slate-500">{{ item.helper }}</p>
                    </div>
                    <span
                      class="rounded-full px-2.5 py-1 text-xs font-semibold"
                      :class="item.done ? 'bg-emerald-500/12 text-emerald-700' : 'bg-amber-500/12 text-amber-700'"
                    >
                      {{ item.done ? 'Ready' : 'Next' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section class="rounded-[1.9rem] border border-slate-200 bg-white p-6 shadow-[0_16px_36px_rgba(15,23,42,0.06)]">
            <div class="flex items-start justify-between gap-4">
              <div class="space-y-1">
                <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">Quote intake</p>
                <h3 class="text-lg font-semibold tracking-tight text-slate-950">Secondary intake queue</h3>
                <p class="text-sm text-slate-500">Still available for pre-assignment activity, but no longer the main production object.</p>
              </div>
              <NuxtLink to="/dashboard/shop/requests" class="text-sm font-semibold text-[var(--p-primary)] underline-offset-2 hover:underline">
                Open intake
              </NuxtLink>
            </div>

            <div v-if="recentRequests.length" class="mt-5 space-y-3">
              <article
                v-for="request in recentRequests"
                :key="request.id"
                class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4"
              >
                <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div class="space-y-1">
                    <p class="text-sm font-semibold text-slate-950">{{ request.client }}</p>
                    <p class="text-sm text-slate-500">{{ request.job }}</p>
                  </div>
                  <div class="text-sm text-slate-500 md:text-right">
                    <p>{{ request.status }}</p>
                    <p class="mt-1">{{ request.when }}</p>
                  </div>
                </div>
              </article>
            </div>

            <div v-else class="mt-5 rounded-2xl border border-dashed border-slate-200 px-5 py-10 text-center">
              <p class="text-sm font-semibold text-slate-950">No quote intake yet</p>
              <p class="mt-2 text-sm text-slate-500">This section only supports pre-assignment intake work now.</p>
            </div>
          </section>
        </div>
      </template>
    </div>
  </DashboardShell>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import AssignmentQueue from '~/components/dashboard/shop/AssignmentQueue.vue'
import MachineUtilizationPanel from '~/components/dashboard/shop/MachineUtilizationPanel.vue'
import ProductionWorkflowBoard from '~/components/dashboard/shop/ProductionWorkflowBoard.vue'
import DashboardShell from '~/components/dashboard/shared/DashboardShell.vue'
import DashboardTopBar from '~/components/dashboard/shared/DashboardTopBar.vue'
import ShopSidebarNav from '~/components/dashboard/shop/ShopSidebarNav.vue'
import { useQuoteInboxStore } from '~/stores/quoteInbox'
import { useSetupStatusStore } from '~/stores/setupStatus'
import { useShopStore } from '~/stores/shop'
import { useWorkflowSpineStore } from '~/stores/workflowSpine'

definePageMeta({ layout: 'dashboard' })

const quoteInboxStore = useQuoteInboxStore()
const setupStatusStore = useSetupStatusStore()
const shopStore = useShopStore()
const workflowStore = useWorkflowSpineStore()

const { dashboard } = storeToRefs(quoteInboxStore)
const { status: setupStatus } = storeToRefs(setupStatusStore)
const { shopAssignments } = storeToRefs(workflowStore)

const setupActionUrl = computed(() => setupStatus.value?.next_url || '/dashboard/shop/setup')

const nextAction = computed(() => {
  const pendingAssignments = shopAssignments.value.filter(item => String(item.status ?? '') === 'pending').length
  const activeAssignments = shopAssignments.value.filter(item => String(item.status ?? '') === 'in_production').length
  const setup = setupStatus.value

  if (pendingAssignments > 0) {
    return {
      title: `${pendingAssignments} assignment${pendingAssignments === 1 ? '' : 's'} need your acceptance.`,
      body: 'Open the assignment queue, confirm the work, and keep production moving from one workspace.',
      label: 'Open assignments',
      to: '/dashboard/shop/assignments',
    }
  }

  if (activeAssignments > 0) {
    return {
      title: `${activeAssignments} assignment${activeAssignments === 1 ? '' : 's'} are live on the floor.`,
      body: 'Stay inside the production queue to upload proofs, mark readiness, and keep payout release on track.',
      label: 'Open production queue',
      to: '/dashboard/shop/assignments',
    }
  }

  if (setup?.next_step && setup.next_step !== 'complete') {
    return {
      title: setup.recommendations?.[0] || setup.warnings?.[0] || 'Continue production setup.',
      body: 'Complete the next setup step so Printy can route more work to the shop without manual follow-up.',
      label: 'Continue setup',
      to: setup.next_url,
    }
  }

  return {
    title: 'Production queue is clear.',
    body: 'Keep the assignment workspace ready. Quote intake and setup remain available, but managed assignments are now the operating center.',
    label: 'Open assignments',
    to: '/dashboard/shop/assignments',
  }
})

const summaryCards = computed(() => [
  {
    label: 'Assignments',
    value: String(shopAssignments.value.length),
    helper: 'Managed jobs assigned to this shop.',
  },
  {
    label: 'Awaiting acceptance',
    value: String(shopAssignments.value.filter(item => String(item.status ?? '') === 'pending').length),
    helper: 'Assignments still waiting for a production response.',
  },
  {
    label: 'In production',
    value: String(shopAssignments.value.filter(item => String(item.status ?? '') === 'in_production').length),
    helper: 'Assignments currently moving on the floor.',
  },
  {
    label: 'Quote intake',
    value: String(dashboard.value?.pending_responses_count ?? 0),
    helper: 'Secondary pre-assignment queue still available to the shop.',
  },
])

const recentRequests = computed(() => (dashboard.value?.recent_requests ?? []).map((request) => {
  const requestSnapshot = (request.request_snapshot ?? {}) as Record<string, unknown>
  const calculatorInputs = (requestSnapshot.calculator_inputs ?? {}) as Record<string, unknown>
  const productType = typeof calculatorInputs.product_type === 'string'
    ? calculatorInputs.product_type.replace(/_/g, ' ')
    : 'Custom print job'
  const quantity = typeof calculatorInputs.quantity === 'number'
    ? `${calculatorInputs.quantity.toLocaleString()} pcs`
    : ''

  return {
    id: request.id,
    client: request.customer_name || request.customer_email || request.request_reference || `Request #${request.id}`,
    job: [productType, quantity].filter(Boolean).join(', ') || 'Quote request received',
    status: request.latest_response?.status_label || request.status_label || 'Awaiting response',
    when: formatRelative(request.created_at),
  }
}))

const setupReadinessCopy = computed(() => {
  const setup = setupStatus.value
  if (!setup) return 'Setup readiness will appear after the shop status loads.'
  return setup.recommendations?.[0] || setup.warnings?.[0] || 'Your main production setup steps are in place.'
})

const setupChecklist = computed(() => {
  const setup = setupStatus.value
  if (!setup) return []
  return (setup.steps ?? []).slice(0, 3).map(step => ({
    label: step.label,
    done: step.done,
    helper: step.done ? 'Already in place.' : step.blocking_reason,
  }))
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

async function loadOverview() {
  const activeShop = await shopStore.ensureActiveShop(shopStore.selectedShopSlug ?? null).catch(() => null)
  const slug = activeShop?.slug ?? shopStore.selectedShopSlug ?? null

  await Promise.allSettled([
    setupStatusStore.fetchStatus(slug),
    workflowStore.fetchShopAssignments(),
  ])

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

function openAssignment() {
  void navigateTo('/dashboard/shop/assignments')
}

onMounted(loadOverview)
watch(() => shopStore.selectedShopSlug, () => {
  loadOverview().catch(() => undefined)
})
</script>
