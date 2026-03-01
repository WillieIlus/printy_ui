<template>
  <div class="col-span-12 space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ shop?.name ?? 'Shop Setup' }}</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">Configure machines, papers, finishing, materials, and products.</p>
      </div>
      <UButton to="/dashboard" variant="ghost" size="sm">
        <UIcon name="i-lucide-arrow-left" class="mr-2 h-4 w-4" />
        Back to dashboard
      </UButton>
    </div>

    <div class="flex gap-1 overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-1.5">
      <button
        v-for="tab in tabItems"
        :key="tab.value"
        class="flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition-all"
        :class="activeTab === tab.value
          ? 'bg-flamingo-500 text-white shadow-sm'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'"
        @click="activeTab = tab.value"
      >
        <UIcon :name="tab.icon" class="h-4 w-4" />
        {{ tab.label }}
      </button>
    </div>

    <div class="py-4">
      <DashboardSellerSetupMachines v-if="activeTab === 'machines'" :shop-id="shopId" />
      <DashboardSellerSetupPapers v-else-if="activeTab === 'papers'" :shop-id="shopId" />
      <DashboardSellerSetupFinishing v-else-if="activeTab === 'finishing'" :shop-id="shopId" />
      <DashboardSellerSetupMaterials v-else-if="activeTab === 'materials'" :shop-id="shopId" />
      <DashboardSellerSetupProducts v-else-if="activeTab === 'products'" :shop-id="shopId" />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const route = useRoute()
const sellerStore = useSellerStore()

const shopId = computed(() => parseInt(route.params.id as string, 10))
const shop = computed(() => (Number.isNaN(shopId.value) ? null : sellerStore.getShop(shopId.value)))

const activeTab = ref('machines')
const tabItems = [
  { label: 'Machines', value: 'machines', icon: 'i-lucide-printer' },
  { label: 'Papers', value: 'papers', icon: 'i-lucide-file-stack' },
  { label: 'Finishing', value: 'finishing', icon: 'i-lucide-scissors' },
  { label: 'Materials', value: 'materials', icon: 'i-lucide-layers' },
  { label: 'Products', value: 'products', icon: 'i-lucide-package' },
]

onMounted(async () => {
  await sellerStore.fetchShops()
  if (Number.isNaN(shopId.value) || !sellerStore.getShop(shopId.value)) {
    await navigateTo('/dashboard')
  }
})
</script>
