<template>
  <div class="col-span-12 space-y-6">
    <DashboardSkeletonState v-if="shopStore.loading" variant="block" />
    <template v-else-if="shop">
      <DashboardShopHeader :shop-name="shop.name" :shop-slug="slug">
        <template #actions>
          <UButton :to="`/dashboard/shops/${slug}/edit`" variant="outline" size="sm">
            <UIcon name="i-lucide-edit" class="mr-2 h-4 w-4" />
            Edit
          </UButton>
          <UButton :to="`/dashboard/shops/${slug}/incoming-requests`" color="primary">
            <UIcon name="i-lucide-inbox" class="mr-2 h-4 w-4" />
            Incoming Requests
          </UButton>
        </template>
        <div class="mt-3 flex flex-wrap items-center gap-3">
          <UBadge v-if="shop.is_verified" color="success" variant="soft">
            <UIcon name="i-lucide-check-circle" class="mr-1 h-3 w-3" />
            Verified
          </UBadge>
          <span class="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
            <UIcon name="i-lucide-star" class="h-3.5 w-3.5 fill-current" />
            {{ shopRating }}
          </span>
        </div>
      </DashboardShopHeader>

      <div
        v-if="setupProgress < 2"
        class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-1"
      >
        <div class="rounded-xl bg-[var(--p-surface-sunken)] p-6">
          <div class="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <span class="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[var(--p-primary)]">Setup Progress</span>
              <h3 class="mt-2 text-xl font-bold text-[var(--p-text)]">Complete the quoting setup for this shop</h3>
              <p class="mt-2 max-w-2xl text-sm leading-6 text-[var(--p-text-muted)]">
                Add machines, paper, and pricing so requests can move from inquiry to sent quote without gaps.
              </p>
            </div>
            <div class="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[var(--p-text)] shadow-sm">
              {{ setupProgress }} / 2 core steps ready
            </div>
          </div>

          <div class="mt-6 grid gap-4 md:grid-cols-3">
            <NuxtLink
              :to="`/dashboard/shops/${slug}/machines`"
              class="rounded-xl border border-[var(--p-border)] bg-white p-4 transition-colors hover:bg-[var(--p-surface)]"
            >
              <div class="flex items-center justify-between">
                <span class="text-sm font-semibold text-[var(--p-text)]">Machines</span>
                <UIcon :name="hasMachines ? 'i-lucide-check-circle' : 'i-lucide-printer'" class="h-5 w-5" :class="hasMachines ? 'text-green-600' : 'text-[var(--p-primary)]'" />
              </div>
              <p class="mt-2 text-sm text-[var(--p-text-muted)]">{{ hasMachines ? `${machineCount} configured` : 'Add at least one production machine.' }}</p>
            </NuxtLink>

            <NuxtLink
              :to="`/dashboard/shops/${slug}/pricing`"
              class="rounded-xl border border-[var(--p-border)] bg-white p-4 transition-colors hover:bg-[var(--p-surface)]"
            >
              <div class="flex items-center justify-between">
                <span class="text-sm font-semibold text-[var(--p-text)]">Stock & pricing</span>
                <UIcon :name="hasPricing ? 'i-lucide-check-circle' : 'i-lucide-banknote'" class="h-5 w-5" :class="hasPricing ? 'text-green-600' : 'text-[var(--p-primary)]'" />
              </div>
              <p class="mt-2 text-sm text-[var(--p-text-muted)]">{{ hasPricing ? 'Rates and materials are available.' : 'Load paper, printing, material, or finishing rates.' }}</p>
            </NuxtLink>

            <NuxtLink
              :to="`/dashboard/shops/${slug}/products`"
              class="rounded-xl border border-[var(--p-border)] bg-white p-4 transition-colors hover:bg-[var(--p-surface)]"
            >
              <div class="flex items-center justify-between">
                <span class="text-sm font-semibold text-[var(--p-text)]">Products</span>
                <UIcon name="i-lucide-package" class="h-5 w-5 text-[var(--p-primary)]" />
              </div>
              <p class="mt-2 text-sm text-[var(--p-text-muted)]">Keep the public catalog aligned with your pricing and turnaround.</p>
            </NuxtLink>
          </div>
        </div>
      </div>

      <div class="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section class="space-y-6">
          <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <article
              v-for="metric in workflowMetrics"
              :key="metric.label"
              class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-1"
            >
              <div class="h-full rounded-xl bg-[var(--p-surface-sunken)] p-5">
                <div class="flex items-center justify-between">
                  <span class="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">{{ metric.label }}</span>
                  <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                    <UIcon :name="metric.icon" class="h-5 w-5 text-[var(--p-primary)]" />
                  </div>
                </div>
                <p class="mt-6 text-3xl font-extrabold tracking-tight text-[var(--p-text)]">{{ metric.value }}</p>
                <p class="mt-2 text-sm text-[var(--p-text-muted)]">{{ metric.note }}</p>
              </div>
            </article>
          </div>

          <article class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-1">
            <div class="rounded-xl bg-[var(--p-surface-sunken)] p-6">
              <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <span class="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[var(--p-primary)]">Quote Workflow</span>
                  <h3 class="mt-2 text-2xl font-bold tracking-tight text-[var(--p-text)]">From submitted request to production handoff</h3>
                </div>
                <NuxtLink
                  :to="`/dashboard/shops/${slug}/sent-quotes`"
                  class="inline-flex items-center gap-2 rounded-xl border border-[var(--p-border)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--p-text)] transition-colors hover:bg-[var(--p-surface)]"
                >
                  Open sent quotes
                  <UIcon name="i-lucide-arrow-right" class="h-4 w-4" />
                </NuxtLink>
              </div>

              <div class="mt-6 grid gap-4 md:grid-cols-4">
                <div
                  v-for="stage in workflowStages"
                  :key="stage.label"
                  class="rounded-xl border border-[var(--p-border)] bg-white p-4"
                >
                  <p class="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">{{ stage.label }}</p>
                  <p class="mt-3 text-2xl font-bold text-[var(--p-text)]">{{ stage.value }}</p>
                  <p class="mt-2 text-sm text-[var(--p-text-muted)]">{{ stage.note }}</p>
                </div>
              </div>
            </div>
          </article>

          <div class="grid gap-4 md:grid-cols-3">
            <NuxtLink
              v-for="nav in navItems"
              :key="nav.to"
              :to="nav.to"
              class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-1 transition-colors hover:bg-[var(--p-surface-container)]"
            >
              <div class="flex h-full items-start gap-4 rounded-xl bg-[var(--p-surface-sunken)] p-5">
                <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                  <UIcon :name="nav.icon" class="h-5 w-5 text-[var(--p-primary)]" />
                </div>
                <div>
                  <h4 class="text-base font-semibold text-[var(--p-text)]">{{ nav.label }}</h4>
                  <p class="mt-1 text-sm leading-6 text-[var(--p-text-muted)]">{{ nav.desc }}</p>
                </div>
              </div>
            </NuxtLink>
          </div>
        </section>

        <aside class="space-y-6">
          <article class="overflow-hidden rounded-2xl bg-[var(--p-text)] text-white">
            <div class="relative p-6">
              <div class="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
              <div class="relative z-10">
                <span class="inline-flex rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80">
                  Operations
                </span>
                <h3 class="mt-4 text-2xl font-bold tracking-tight">Accepted work ready for the next operational step</h3>
                <p class="mt-3 text-sm leading-6 text-slate-300">
                  Accepted quotes are visible here today. The production-order flow already exists in the backend, but the frontend still needs a dedicated orders surface for payment and delivery tracking.
                </p>
                <NuxtLink
                  :to="`/dashboard/shops/${slug}/sent-quotes`"
                  class="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[var(--p-text)] transition-colors hover:bg-slate-100"
                >
                  Review accepted quotes
                  <UIcon name="i-lucide-arrow-right" class="h-4 w-4" />
                </NuxtLink>
              </div>
            </div>
          </article>

          <article class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-1">
            <div class="rounded-xl bg-[var(--p-surface-sunken)] p-6">
              <h3 class="text-lg font-bold text-[var(--p-text)]">Current shop view</h3>
              <ul class="mt-5 space-y-3 text-sm text-[var(--p-text-muted)]">
                <li class="flex items-center justify-between gap-4 rounded-lg bg-white px-4 py-3">
                  <span>Submitted and viewed requests</span>
                  <span class="font-semibold text-[var(--p-text)]">{{ pendingQuotes }}</span>
                </li>
                <li class="flex items-center justify-between gap-4 rounded-lg bg-white px-4 py-3">
                  <span>Sent and revised quotes</span>
                  <span class="font-semibold text-[var(--p-text)]">{{ activeSentQuotes }}</span>
                </li>
                <li class="flex items-center justify-between gap-4 rounded-lg bg-white px-4 py-3">
                  <span>Accepted quotes</span>
                  <span class="font-semibold text-[var(--p-text)]">{{ acceptedQuotes }}</span>
                </li>
                <li class="flex items-center justify-between gap-4 rounded-lg bg-white px-4 py-3">
                  <span>Estimated accepted value</span>
                  <span class="font-semibold text-[var(--p-text)]">{{ estimatedRevenue }}</span>
                </li>
              </ul>
            </div>
          </article>
        </aside>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { getRatingSummary } from '~/services/ratings'
import { useMachineStore } from '~/stores/machine'
import { usePricingStore } from '~/stores/pricing'
import { useShopStore } from '~/stores/shop'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'shop-owner'],
})

const route = useRoute()
const shopStore = useShopStore()
const machineStore = useMachineStore()
const pricingStore = usePricingStore()
const slug = computed(() => route.params.slug as string)
const shop = computed(() => shopStore.currentShop)

const incoming = useIncomingRequests(slug)
const sentQuotes = useSentQuotes()
const incomingRequests = ref<{ created_at?: string; status?: string }[]>([])
const sentQuotesList = ref<{ created_at?: string; status?: string; total?: number | string | null; shop?: number }[]>([])
const shopRatingSummary = ref<{ average: number; count: number } | null>(null)

const todayStart = computed(() => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.toISOString().slice(0, 10)
})

const shopId = computed(() => shop.value?.id ?? null)

const quotesToday = computed(() =>
  incomingRequests.value.filter((r) => r.created_at?.slice(0, 10) === todayStart.value).length
)

const pendingQuotes = computed(() =>
  incomingRequests.value.filter((r) => {
    const s = (r.status ?? '').toLowerCase()
    return s === 'submitted' || s === 'viewed'
  }).length
)

const activeSentQuotes = computed(() =>
  sentQuotesList.value.filter((q) => {
    const s = (q.status ?? '').toLowerCase()
    return s === 'sent' || s === 'revised'
  }).length
)

const acceptedQuotes = computed(() =>
  sentQuotesList.value.filter((q) => (q.status ?? '').toLowerCase() === 'accepted').length
)

const estimatedRevenue = computed(() => {
  const sid = shopId.value
  const accepted = sentQuotesList.value.filter(
    (q) => q.shop === sid && (q.status ?? '').toLowerCase() === 'accepted'
  )
  const total = accepted.reduce((sum, q) => {
    const t = parseFloat(String(q.total ?? 0))
    return sum + (Number.isNaN(t) ? 0 : t)
  }, 0)
  return total > 0 ? `KES ${Math.round(total).toLocaleString()}` : 'KES 0'
})

const shopRating = computed(() => {
  const summary = shopRatingSummary.value
  if (!summary?.count) return 'No ratings yet'
  return `${summary.average.toFixed(1)} from ${summary.count} review${summary.count === 1 ? '' : 's'}`
})

const hasMachines = computed(() => machineStore.machines.length > 0)
const machineCount = computed(() => machineStore.machines.length)
const hasPricing = computed(
  () =>
    pricingStore.paperPrices.length > 0 ||
    pricingStore.printingPrices.length > 0 ||
    pricingStore.materialPrices.length > 0 ||
    pricingStore.finishingServices.length > 0
)
const setupProgress = computed(() => {
  let n = 0
  if (hasMachines.value) n++
  if (hasPricing.value) n++
  return n
})

const workflowMetrics = computed(() => [
  {
    label: 'Requests Today',
    value: quotesToday.value,
    note: 'New requests created today.',
    icon: 'i-lucide-inbox',
  },
  {
    label: 'Awaiting Response',
    value: pendingQuotes.value,
    note: 'Submitted or viewed requests.',
    icon: 'i-lucide-clock-3',
  },
  {
    label: 'Accepted Quotes',
    value: acceptedQuotes.value,
    note: 'Ready for operational handoff.',
    icon: 'i-lucide-badge-check',
  },
  {
    label: 'Accepted Value',
    value: estimatedRevenue.value,
    note: 'Total across accepted quotes.',
    icon: 'i-lucide-banknote',
  },
])

const workflowStages = computed(() => [
  {
    label: 'Submitted',
    value: pendingQuotes.value,
    note: 'Customer requests waiting on a quote.',
  },
  {
    label: 'Sent',
    value: activeSentQuotes.value,
    note: 'Quotes sent or revised and awaiting customer action.',
  },
  {
    label: 'Accepted',
    value: acceptedQuotes.value,
    note: 'Quotes accepted by customers.',
  },
  {
    label: 'Ready To Order',
    value: acceptedQuotes.value,
    note: 'Accepted quotes available for the production-order flow.',
  },
])

const navItems = computed(() => [
  {
    to: `/dashboard/shops/${slug.value}/incoming-requests`,
    label: 'Incoming Requests',
    desc: 'Review submitted, viewed, and unquoted customer work.',
    icon: 'i-lucide-inbox',
  },
  {
    to: `/dashboard/shops/${slug.value}/sent-quotes`,
    label: 'Sent Quotes',
    desc: 'Track revisions, accepted quotes, and ready-to-order work.',
    icon: 'i-lucide-send',
  },
  {
    to: `/dashboard/shops/${slug.value}/products`,
    label: 'Products',
    desc: 'Manage catalog cards, turnaround, and public product coverage.',
    icon: 'i-lucide-package',
  },
  {
    to: `/dashboard/shops/${slug.value}/pricing`,
    label: 'Stock & Pricing',
    desc: 'Configure papers, materials, printing, and finishing rates.',
    icon: 'i-lucide-banknote',
  },
  {
    to: `/dashboard/shops/${slug.value}/machines`,
    label: 'Machines',
    desc: 'Align capacity and equipment with quote output.',
    icon: 'i-lucide-printer',
  },
  {
    to: `/dashboard/shops/${slug.value}/members`,
    label: 'Team',
    desc: 'Coordinate the people managing requests and production.',
    icon: 'i-lucide-users',
  },
])

onMounted(async () => {
  await shopStore.fetchShopBySlug(slug.value)
  if (!slug.value) return

  const [incomingData, sentData, ratingSummary] = await Promise.all([
    incoming.list().catch(() => []),
    sentQuotes.list().catch(() => []),
    getRatingSummary(slug.value).catch(() => null),
  ])

  incomingRequests.value = incomingData
  sentQuotesList.value = sentData
  shopRatingSummary.value = ratingSummary

  await Promise.all([
    machineStore.fetchMachines(slug.value),
    pricingStore.fetchPrintingPrices(slug.value),
    pricingStore.fetchPaperPrices(slug.value),
    pricingStore.fetchMaterialPrices(slug.value),
    pricingStore.fetchFinishingServices(slug.value),
  ])
})
</script>
