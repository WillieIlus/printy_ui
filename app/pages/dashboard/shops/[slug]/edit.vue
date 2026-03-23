<template>
  <div class="space-y-6">
    <DashboardPageHeader
      title="Shop Profile"
      subtitle="Edit the business details for this shop in a proper page, not a modal."
    >
      <template #actions>
        <UButton :to="`/dashboard/shops/${slug}`" variant="soft">Back to workspace</UButton>
      </template>
    </DashboardPageHeader>

    <DashboardSkeletonState v-if="shopStore.loading && !shopStore.currentShop" variant="block" />

    <div v-else-if="shopStore.currentShop" class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm">
      <ShopsShopForm
        :shop="shopStore.currentShop"
        :loading="shopStore.loading"
        :error="shopStore.error"
        :field-errors="shopStore.updateFieldErrors"
        @submit="onSubmit"
        @cancel="goBack"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ShopCreateInput } from '~/shared/types'
import { useNotification } from '~/composables/useNotification'
import { useShopStore } from '~/stores/shop'
import { useSellerStore } from '~/stores/seller'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'shop-owner'],
})

const route = useRoute()
const notification = useNotification()
const shopStore = useShopStore()
const sellerStore = useSellerStore()

const slug = computed(() => route.params.slug as string)

function goBack() {
  navigateTo(`/dashboard/shops/${slug.value}`)
}

async function onSubmit(data: ShopCreateInput) {
  const result = await shopStore.updateShop(slug.value, data as Parameters<typeof shopStore.updateShop>[1])
  if (!result.success) {
    if (!shopStore.updateFieldErrors || Object.keys(shopStore.updateFieldErrors).length === 0) {
      notification.error(shopStore.error ?? 'We could not update this shop right now.')
    }
    return
  }

  notification.success('Shop profile updated successfully.')
  await sellerStore.fetchShops()
  await navigateTo(`/dashboard/shops/${slug.value}`)
}

onMounted(async () => {
  await Promise.all([
    shopStore.fetchShopBySlug(slug.value),
    sellerStore.fetchShops(),
  ])
})
</script>
