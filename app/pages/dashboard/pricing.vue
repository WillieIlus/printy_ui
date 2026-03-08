<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-[var(--p-text)]">Pricing</h1>
        <p class="text-sm text-[var(--p-text-muted)]">Manage printing rates, paper prices, and finishing rates per shop.</p>
      </div>
      <div class="flex items-center gap-3">
        <USelectMenu
          v-if="sellerStore.shops.length > 1"
          v-model="selectedSlug"
          :items="shopOptions"
          value-key="value"
          class="w-48"
        />
        <UButton color="primary" :disabled="!selectedSlug" @click="goToShopPricing">
          <UIcon name="i-lucide-banknote" class="w-4 h-4 mr-2" />
          Add pricing
        </UButton>
      </div>
    </div>

    <div v-if="!sellerStore.shops.length && !sellerStore.loading" class="rounded-xl border border-dashed border-[var(--p-border)] p-8 text-center">
      <UIcon name="i-lucide-store" class="mx-auto h-12 w-12 text-[var(--p-text-muted)]" />
      <p class="mt-2 text-sm font-medium text-[var(--p-text-dim)]">No shops yet</p>
      <p class="mt-1 text-sm text-[var(--p-text-muted)]">Create a shop first to set up pricing.</p>
      <UButton color="primary" class="mt-4" to="/dashboard/shops/create">Create shop</UButton>
    </div>

    <CommonLoadingSpinner v-else-if="loading" />

    <div v-else-if="selectedSlug" class="rounded-xl border border-[var(--p-border)] overflow-hidden">
      <div class="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 class="text-lg font-semibold text-[var(--p-text)]">{{ selectedShop?.name ?? selectedSlug }}</h2>
          <p class="text-sm text-[var(--p-text-muted)]">Configure printing, paper, and finishing rates for this shop.</p>
        </div>
        <UButton color="primary" @click="goToShopPricing">
          <UIcon name="i-lucide-banknote" class="w-4 h-4 mr-2" />
          Manage pricing
        </UButton>
      </div>
    </div>

    <div v-else class="rounded-xl border border-dashed border-[var(--p-border)] p-8 text-center">
      <UIcon name="i-lucide-banknote" class="mx-auto h-12 w-12 text-[var(--p-text-muted)]" />
      <p class="mt-2 text-sm font-medium text-[var(--p-text-dim)]">No pricing configured</p>
      <p class="mt-1 text-sm text-[var(--p-text-muted)]">Select a shop and add printing rates, paper prices, and finishing.</p>
      <UButton color="primary" class="mt-4" to="/dashboard/shops">Select shop</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSellerStore } from '~/stores/seller'

definePageMeta({ layout: 'dashboard', middleware: ['auth'] })

const sellerStore = useSellerStore()
const loading = ref(true)
const selectedSlug = ref('')

const shopOptions = computed(() =>
  sellerStore.shops.map(s => ({ value: s.slug, label: s.name }))
)

const selectedShop = computed(() =>
  sellerStore.shops.find(s => s.slug === selectedSlug.value)
)

function goToShopPricing() {
  if (selectedSlug.value) {
    navigateTo(`/dashboard/shops/${selectedSlug.value}/pricing`)
  }
}

onMounted(async () => {
  if (!sellerStore.shops.length) await sellerStore.fetchShops()
  if (sellerStore.shops.length === 1) {
    await navigateTo(`/dashboard/shops/${sellerStore.shops[0].slug}/pricing`)
    return
  }
  if (sellerStore.shops.length) {
    selectedSlug.value = sellerStore.shops[0].slug
  }
  loading.value = false
})
</script>
