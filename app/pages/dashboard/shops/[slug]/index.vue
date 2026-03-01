<template>
  <div class="col-span-12 space-y-6">
    <DashboardSkeletonState v-if="shopStore.loading" variant="block" />
    <template v-else-if="shop">
      <DashboardPageHeader :title="shop.name" :subtitle="`${shop.city}, ${shop.state}`">
        <template #actions>
          <UButton :to="`/dashboard/shops/${slug}/edit`" variant="outline">
            <UIcon name="i-lucide-edit" class="w-4 h-4 mr-2" />
            Edit
          </UButton>
          <UButton :to="`/shops/${slug}`" variant="outline" target="_blank">
            <UIcon name="i-lucide-external-link" class="w-4 h-4 mr-2" />
            View Public
          </UButton>
        </template>
        <UBadge v-if="shop.is_verified" color="success" variant="soft" class="mt-2">
          <UIcon name="i-lucide-check-circle" class="w-3 h-3 mr-1" />
          Verified
        </UBadge>
      </DashboardPageHeader>

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

      <!-- Stats row: 3 KPI cards -->
      <div class="col-span-12 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:gap-6">
        <DashboardStatCard
          label="Total Quotes"
          :value="quoteCount"
          icon="i-lucide-file-text"
          variant="flamingo"
        />
        <DashboardStatCard
          label="Revenue"
          value="KES 0"
          icon="i-lucide-dollar-sign"
          variant="green"
        />
        <DashboardStatCard
          label="Team Members"
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
import { useQuoteStore } from '~/stores/quote'
import { useMachineStore } from '~/stores/machine'
import { usePricingStore } from '~/stores/pricing'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'shop-owner'],
})

const route = useRoute()
const shopStore = useShopStore()
const quoteStore = useQuoteStore()
const machineStore = useMachineStore()
const pricingStore = usePricingStore()
const slug = computed(() => route.params.slug as string)
const shop = computed(() => shopStore.currentShop)
const quoteCount = computed(() => quoteStore.quotes.length)

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
    to: `/dashboard/shops/${slug.value}/quotes`,
    label: 'Quotes',
    desc: 'Manage quotes',
    icon: 'i-lucide-file-text',
    bgClass: 'bg-blue-50 dark:bg-blue-900/20',
    iconClass: 'text-blue-600 dark:text-blue-400',
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
    await Promise.all([
      quoteStore.fetchShopQuotes(slug.value),
      machineStore.fetchMachines(slug.value),
      pricingStore.fetchPrintingPrices(slug.value),
      pricingStore.fetchPaperPrices(slug.value),
      pricingStore.fetchMaterialPrices(slug.value),
      pricingStore.fetchFinishingServices(slug.value),
    ])
  }
})
</script>
