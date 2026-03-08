<template>
  <div class="col-span-12 space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-[var(--p-text)]">{{ shop?.name ?? 'Shop Setup' }}</h1>
        <p class="text-[var(--p-text-muted)] mt-1">Configure machines, papers, finishing, materials, and products.</p>
      </div>
      <UButton to="/dashboard" variant="soft" size="sm">
        <UIcon name="i-lucide-arrow-left" class="mr-2 h-4 w-4" />
        Back to dashboard
      </UButton>
    </div>

    <div class="flex gap-1 overflow-x-auto rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-1.5">
      <button
        v-for="tab in tabItems"
        :key="tab.value"
        class="flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition-all"
        :class="activeTab === tab.value
          ? 'bg-flamingo-500 text-white shadow-sm'
          : 'text-[var(--p-text-muted)] hover:bg-[var(--p-surface-sunken)] dark:hover:bg-[var(--p-surface-raised)] hover:text-[var(--p-text)]'"
        @click="tab.isLink ? navigateTo(tab.to) : (activeTab = tab.value)"
      >
        <UIcon :name="tab.icon" class="h-4 w-4" />
        {{ tab.label }}
      </button>
    </div>

    <div class="py-4">
      <DashboardSellerSetupMachines v-if="activeTab === 'machines'" :shop-slug="shopSlug" />
      <DashboardSellerSetupPapers v-else-if="activeTab === 'papers'" :shop-slug="shopSlug" />
      <DashboardSellerSetupFinishing v-else-if="activeTab === 'finishing'" :shop-slug="shopSlug" />
      <DashboardSellerSetupMaterials v-else-if="activeTab === 'materials'" :shop-slug="shopSlug" />
      <DashboardSellerSetupProducts v-else-if="activeTab === 'products'" :shop-slug="shopSlug" :shop-exists="!!shop" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSellerStore } from '~/stores/seller'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const route = useRoute()
const sellerStore = useSellerStore()

const shopSlug = computed(() => route.params.slug as string)
const shop = computed(() => sellerStore.getShopBySlug(shopSlug.value))

const activeTab = ref('machines')
const tabItems = computed(() => [
  { label: 'Machines', value: 'machines', icon: 'i-lucide-printer', isLink: false },
  { label: 'Papers', value: 'papers', icon: 'i-lucide-file-stack', isLink: false },
  { label: 'Finishing', value: 'finishing', icon: 'i-lucide-scissors', isLink: false },
  { label: 'Materials', value: 'materials', icon: 'i-lucide-layers', isLink: false },
  { label: 'Pricing', value: 'pricing', icon: 'i-lucide-banknote', isLink: true, to: `/dashboard/shops/${shopSlug.value}/pricing` },
  { label: 'Products', value: 'products', icon: 'i-lucide-package', isLink: false },
])

onMounted(async () => {
  await sellerStore.fetchShops()
  if (!shopSlug.value || !sellerStore.getShopBySlug(shopSlug.value)) {
    await navigateTo('/dashboard')
  }
})
</script>
