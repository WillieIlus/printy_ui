<template>
  <div class="col-span-12 space-y-6">
    <DashboardSkeletonState v-if="shopStore.loading" variant="block" />
    <template v-else-if="shop">
      <DashboardShopHeader :shop-name="shop.name" :shop-slug="slug">
        <template #actions>
          <UButton :to="`/dashboard/shops/${slug}/edit`" variant="outline" size="sm">
            <UIcon name="i-lucide-edit" class="w-4 h-4 mr-2" />
            Edit
          </UButton>
          <UButton :to="`/dashboard/shops/${slug}/incoming-requests`" color="primary">
            <UIcon name="i-lucide-inbox" class="w-4 h-4 mr-2" />
            Incoming Requests
          </UButton>
        </template>
        <UBadge v-if="shop.is_verified" color="success" variant="soft" class="mt-2">
          <UIcon name="i-lucide-check-circle" class="w-3 h-3 mr-1" />
          Verified
        </UBadge>
      </DashboardShopHeader>

      <!-- Setup checklist -->
      <div
        v-if="setupProgress < 3"
        class="col-span-12 rounded-xl border border-flamingo-200/80 bg-flamingo-50/50 p-4 dark:border-flamingo-800/60 dark:bg-flamingo-900/10"
      >
        <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Setup your shop</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Add machines first, then paper stock and prices to start quoting.
        </p>
        <div class="flex flex-wrap gap-4">
          <NuxtLink
            :to="`/dashboard/shops/${slug}/machines`"
            class="flex items-center gap-2 text-sm font-medium"
            :class="hasMachines ? 'text-green-600 dark:text-green-400' : 'text-flamingo-600 dark:text-flamingo-400 hover:underline'"
          >
            <UIcon :name="hasMachines ? 'i-lucide-check-circle' : 'i-lucide-printer'" class="w-4 h-4" />
            1. Machines {{ hasMachines ? `(${machineCount})` : '' }}
          </NuxtLink>
          <NuxtLink
            :to="`/dashboard/shops/${slug}/pricing`"
            class="flex items-center gap-2 text-sm font-medium"
            :class="hasPricing ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400 hover:text-flamingo-600 dark:hover:text-flamingo-400'"
          >
            <UIcon :name="hasPricing ? 'i-lucide-check-circle' : 'i-lucide-banknote'" class="w-4 h-4" />
            2. Stock & prices
          </NuxtLink>
          <NuxtLink
            :to="`/dashboard/shops/${slug}/products`"
            class="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-flamingo-600 dark:hover:text-flamingo-400"
          >
            <UIcon name="i-lucide-package" class="w-4 h-4" />
            3. Products (optional)
          </NuxtLink>
        </div>
      </div>

      <!-- KPI row: 4 cards (col-span-3 each) -->
      <div class="col-span-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 lg:gap-6">
        <NuxtLink
          v-for="nav in navItems"
          :key="nav.to"
          :to="nav.to"
          class="flex items-center gap-3 rounded-xl border border-gray-200/80 bg-white p-4 transition-all hover:border-flamingo-300 hover:shadow-md dark:border-gray-700/60 dark:bg-gray-800/50 dark:hover:border-flamingo-700/60"
        >
          <div
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
            :class="nav.bgClass"
          >
            <UIcon :name="nav.icon" class="h-5 w-5" :class="nav.iconClass" />
          </div>
          <div>
            <p class="text-sm font-medium text-gray-900 dark:text-white">{{ nav.label }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ nav.desc }}</p>
          </div>
        </NuxtLink>
      </div>

      <!-- Stats row: print operations KPIs -->
      <div class="col-span-12 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
        <DashboardStatCard
          label="Requests today"
          :value="quotesToday"
          icon="i-lucide-file-text"
          variant="flamingo"
        />
        <DashboardStatCard
          label="Awaiting response"
          :value="pendingQuotes"
          icon="i-lucide-clock"
          variant="blue"
        />
        <DashboardStatCard
          label="Est. revenue"
          :value="estimatedRevenue"
          icon="i-lucide-trending-up"
          variant="green"
        />
        <DashboardStatCard
          label="Most quoted"
          :value="mostQuotedProduct"
          icon="i-lucide-package"
          variant="orange"
        />
        <DashboardStatCard
          label="Team members"
          :value="shop.member_count ?? shop.members?.length ?? 0"
          icon="i-lucide-users"
          variant="purple"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useShopStore } from '~/stores/shop'
import { useMachineStore } from '~/stores/machine'
import { usePricingStore } from '~/stores/pricing'

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
const sentQuotesList = ref<{ created_at?: string; status?: string; total?: number; shop?: number }[]>([])

const todayStart = computed(() => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.toISOString().slice(0, 10)
})

const shopId = computed(() => shop.value?.id ?? null)

const quotesToday = computed(() => {
  return incomingRequests.value.filter((r) => {
    const created = r.created_at?.slice(0, 10)
    return created === todayStart.value
  }).length
})

const pendingQuotes = computed(() => {
  return incomingRequests.value.filter((r) => {
    const s = (r.status ?? '').toLowerCase()
    return s === 'submitted' || s === 'viewed'
  }).length
})

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

const mostQuotedProduct = computed(() => {
  return '—'
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

const navItems = computed(() => [
  {
    to: `/dashboard/shops/${slug.value}/machines`,
    label: 'Machines',
    desc: 'Printers & equipment',
    icon: 'i-lucide-printer',
    bgClass: 'bg-flamingo-50 dark:bg-flamingo-900/20',
    iconClass: 'text-flamingo-600 dark:text-flamingo-400',
  },
  {
    to: `/dashboard/shops/${slug.value}/pricing`,
    label: 'Stock & prices',
    desc: 'Paper, printing, finishing',
    icon: 'i-lucide-banknote',
    bgClass: 'bg-amber-50 dark:bg-amber-900/20',
    iconClass: 'text-amber-600 dark:text-amber-400',
  },
  {
    to: `/dashboard/shops/${slug.value}/products`,
    label: 'Products',
    desc: 'Product templates',
    icon: 'i-lucide-package',
    bgClass: 'bg-green-50 dark:bg-green-900/20',
    iconClass: 'text-green-600 dark:text-green-400',
  },
  {
    to: `/dashboard/shops/${slug.value}/incoming-requests`,
    label: 'Incoming Requests',
    desc: 'Quote requests from customers',
    icon: 'i-lucide-file-text',
    bgClass: 'bg-blue-50 dark:bg-blue-900/20',
    iconClass: 'text-blue-600 dark:text-blue-400',
  },
  {
    to: `/dashboard/shops/${slug.value}/sent-quotes`,
    label: 'Sent Quotes',
    desc: 'Quotes you\'ve sent to customers',
    icon: 'i-lucide-send',
    bgClass: 'bg-emerald-50 dark:bg-emerald-900/20',
    iconClass: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    to: `/dashboard/shops/${slug.value}/members`,
    label: 'Team',
    desc: 'Manage members',
    icon: 'i-lucide-users',
    bgClass: 'bg-purple-50 dark:bg-purple-900/20',
    iconClass: 'text-purple-600 dark:text-purple-400',
  },
  {
    to: `/dashboard/shops/${slug.value}/hours`,
    label: 'Hours',
    desc: 'Business hours',
    icon: 'i-lucide-clock',
    bgClass: 'bg-orange-50 dark:bg-orange-900/20',
    iconClass: 'text-orange-600 dark:text-orange-400',
  },
])

onMounted(async () => {
  await shopStore.fetchShopBySlug(slug.value)
  if (slug.value) {
    const [incomingData, sentData] = await Promise.all([
      incoming.list().catch(() => []),
      sentQuotes.list().catch(() => []),
    ])
    incomingRequests.value = incomingData
    sentQuotesList.value = sentData
    await Promise.all([
      machineStore.fetchMachines(slug.value),
      pricingStore.fetchPrintingPrices(slug.value),
      pricingStore.fetchPaperPrices(slug.value),
      pricingStore.fetchMaterialPrices(slug.value),
      pricingStore.fetchFinishingServices(slug.value),
    ])
  }
})
</script>
