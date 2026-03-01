<template>
  <div class="col-span-12 space-y-6">
    <DashboardPageHeader
      title="Create shop"
      subtitle="Add a new business listing"
    >
      <template #actions>
        <UButton to="/dashboard/shops" variant="ghost" size="sm">Back</UButton>
      </template>
    </DashboardPageHeader>

    <div class="max-w-xl rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
      <ShopsShopForm
        :loading="saving"
        :error="shopStore.error"
        @submit="onSubmit"
        @cancel="() => navigateTo('/dashboard/shops')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ShopCreateInput } from '~/shared/types'
import { useShopStore } from '~/stores/shop'
import { useSellerStore } from '~/stores/seller'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const shopStore = useShopStore()
const sellerStore = useSellerStore()
const toast = useToast()

const saving = ref(false)

async function onSubmit(data: ShopCreateInput) {
  saving.value = true
  try {
    const result = await shopStore.createShop(data)
    if (result.success && result.shop) {
      await sellerStore.fetchShops()
      toast.add({ title: 'Shop created', color: 'success' })
      await navigateTo(`/dashboard/shops/${result.shop.id}/setup`)
    } else {
      toast.add({ title: 'Error', description: shopStore.error ?? 'Failed to create', color: 'error' })
    }
  } catch (e) {
    toast.add({ title: 'Error', description: e instanceof Error ? e.message : 'Failed to create', color: 'error' })
  } finally {
    saving.value = false
  }
}
</script>
