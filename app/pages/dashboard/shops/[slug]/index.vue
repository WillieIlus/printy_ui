<template>
  <div class="space-y-6">
    <DashboardPageHeader
      :title="shop?.name ?? 'Shop Workspace'"
      subtitle="One shop workspace. Use the left navigation to move between setup, quoting, and settings."
    >
      <template #actions>
        <UButton :to="`/dashboard/shops/${slug}/edit`" variant="soft">Shop Profile</UButton>
        <UButton :to="`/dashboard/shops/${slug}/incoming-requests`" color="primary">Incoming Requests</UButton>
      </template>
    </DashboardPageHeader>

    <DashboardSkeletonState v-if="shopStore.loading && !shop" variant="block" />

    <template v-else-if="shop">
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article
          v-for="metric in metrics"
          :key="metric.label"
          class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5 shadow-sm"
        >
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">{{ metric.label }}</p>
          <p class="mt-3 text-3xl font-semibold text-[var(--p-text)]">{{ metric.value }}</p>
          <p class="mt-2 text-sm text-[var(--p-text-muted)]">{{ metric.note }}</p>
        </article>
      </div>

      <section class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Setup</p>
            <h2 class="mt-2 text-2xl font-semibold text-[var(--p-text)]">Essential setup</h2>
            <p class="mt-2 text-sm leading-6 text-[var(--p-text-muted)]">
              Required setup is grouped into clear sections. Missing items are shown calmly and link straight to the owning page.
            </p>
          </div>
          <UButton :to="`/dashboard/setup-guide`" variant="soft" color="primary">Open setup guide</UButton>
        </div>

        <div class="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <NuxtLink
            v-for="item in setupItems"
            :key="item.label"
            :to="item.to"
            class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4 transition hover:border-orange-300 dark:hover:border-orange-700"
          >
            <div class="flex items-start justify-between gap-3">
              <span class="flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)]">
                <UIcon :name="item.icon" class="h-4 w-4" />
              </span>
              <UBadge :color="item.done ? 'success' : 'warning'" variant="soft" size="xs">
                {{ item.done ? 'Complete' : 'Missing' }}
              </UBadge>
            </div>
            <p class="mt-4 text-sm font-medium text-[var(--p-text)]">{{ item.label }}</p>
            <p class="mt-2 text-sm leading-6 text-[var(--p-text-muted)]">{{ item.description }}</p>
          </NuxtLink>
        </div>
      </section>

      <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <NuxtLink
          v-for="item in sectionLinks"
          :key="item.to"
          :to="item.to"
          class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5 shadow-sm transition hover:border-orange-300 dark:hover:border-orange-700"
        >
          <div class="flex items-start gap-3">
            <span class="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)]">
              <UIcon :name="item.icon" class="h-5 w-5" />
            </span>
            <div>
              <p class="text-sm font-semibold text-[var(--p-text)]">{{ item.label }}</p>
              <p class="mt-1 text-sm leading-6 text-[var(--p-text-muted)]">{{ item.description }}</p>
            </div>
          </div>
        </NuxtLink>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
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

const incomingRequests = ref<{ status?: string }[]>([])
const sentQuotesList = ref<{ status?: string; total?: number | string | null; shop?: number }[]>([])
const pendingQuotes = computed(() =>
  incomingRequests.value.filter((request) => ['submitted', 'viewed'].includes((request.status ?? '').toLowerCase())).length
)
const acceptedQuotes = computed(() =>
  sentQuotesList.value.filter((quote) => (quote.status ?? '').toLowerCase() === 'accepted').length
)
const estimatedRevenue = computed(() => {
  const total = sentQuotesList.value
    .filter((quote) => (quote.status ?? '').toLowerCase() === 'accepted')
    .reduce((sum, quote) => sum + (parseFloat(String(quote.total ?? 0)) || 0), 0)
  return `KES ${Math.round(total).toLocaleString()}`
})

const hasPricing = computed(() =>
  pricingStore.printingPrices.length > 0 ||
  pricingStore.paperPrices.length > 0 ||
  pricingStore.materialPrices.length > 0 ||
  pricingStore.finishingServices.length > 0
)

const metrics = computed(() => [
  {
    label: 'Machines',
    value: machineStore.machines.length,
    note: machineStore.machines.length ? 'Equipment registered for this shop.' : 'No machines yet.',
  },
  {
    label: 'Pricing',
    value: hasPricing.value ? 'Ready' : 'Missing',
    note: 'Printing, materials, and pricing rules.',
  },
  {
    label: 'Incoming Requests',
    value: pendingQuotes.value,
    note: 'Requests waiting on a response.',
  },
  {
    label: 'Accepted Value',
    value: estimatedRevenue.value,
    note: acceptedQuotes.value ? 'Accepted quote value so far.' : 'No accepted quote value yet.',
  },
])

const setupItems = computed(() => [
  {
    label: 'Shop Profile',
    description: 'Business details and location.',
    done: Boolean(shop.value),
    to: `/dashboard/shops/${slug.value}/edit`,
    icon: 'i-lucide-store',
  },
  {
    label: 'Machines',
    description: 'Equipment and capacity.',
    done: machineStore.machines.length > 0,
    to: `/dashboard/shops/${slug.value}/machines`,
    icon: 'i-lucide-printer',
  },
  {
    label: 'Paper Stock',
    description: 'Paper lines used in quoting.',
    done: pricingStore.paperPrices.length > 0,
    to: `/dashboard/shops/${slug.value}/papers`,
    icon: 'i-lucide-file-stack',
  },
  {
    label: 'Pricing',
    description: 'Printing, materials, and discounts.',
    done: hasPricing.value,
    to: `/dashboard/shops/${slug.value}/pricing`,
    icon: 'i-lucide-banknote',
  },
  {
    label: 'Products',
    description: 'Catalog and publish status.',
    done: false,
    to: `/dashboard/shops/${slug.value}/products`,
    icon: 'i-lucide-package',
  },
])

const sectionLinks = computed(() => [
  {
    label: 'Incoming Requests',
    description: 'Review submitted and viewed customer requests.',
    to: `/dashboard/shops/${slug.value}/incoming-requests`,
    icon: 'i-lucide-inbox',
  },
  {
    label: 'Sent Quotes',
    description: 'Track quotes already sent to customers.',
    to: `/dashboard/shops/${slug.value}/sent-quotes`,
    icon: 'i-lucide-send',
  },
  {
    label: 'Products',
    description: 'Manage catalog items and publish readiness.',
    to: `/dashboard/shops/${slug.value}/products`,
    icon: 'i-lucide-package',
  },
  {
    label: 'Paper Stock',
    description: 'Manage paper inventory and stock lines.',
    to: `/dashboard/shops/${slug.value}/papers`,
    icon: 'i-lucide-file-stack',
  },
  {
    label: 'Finishings',
    description: 'Manage lamination, binding, and cutting services.',
    to: `/dashboard/shops/${slug.value}/finishing`,
    icon: 'i-lucide-scissors',
  },
  {
    label: 'Pricing',
    description: 'Manage printing rates, materials, and discounts.',
    to: `/dashboard/shops/${slug.value}/pricing`,
    icon: 'i-lucide-banknote',
  },
])

onMounted(async () => {
  await shopStore.fetchShopBySlug(slug.value)

  const [incomingData, sentData] = await Promise.all([
    incoming.list().catch(() => []),
    sentQuotes.list().catch(() => []),
  ])

  incomingRequests.value = incomingData
  sentQuotesList.value = sentData.filter((quote: { shop?: number }) => quote.shop === shopStore.currentShop?.id)

  await Promise.all([
    machineStore.fetchMachines(slug.value),
    pricingStore.fetchPrintingPrices(slug.value),
    pricingStore.fetchPaperPrices(slug.value),
    pricingStore.fetchMaterialPrices(slug.value),
    pricingStore.fetchFinishingServices(slug.value),
  ])
})
</script>
