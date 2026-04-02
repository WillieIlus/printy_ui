<template>
  <div class="col-span-12 space-y-6">
    <DashboardPageHeader
      title="Products"
      subtitle="Catalog products available for quoting"
    >
      <template #actions>
        <UButton :to="`/dashboard/shops/${slug}`" variant="soft" size="sm">Back</UButton>
        <UButton :to="`/dashboard/shops/${slug}/products/create`" color="primary">
          <UIcon name="i-lucide-plus" class="w-4 h-4 mr-2" />
          Add product
        </UButton>
      </template>
    </DashboardPageHeader>

    <DashboardSkeletonState v-if="quoteStore.loading || !quoteStore.productsLoaded" variant="cards" :card-count="6" />
    <div v-else class="col-span-12">
      <ProductsProductList :products="quoteStore.products">
        <template #card-actions="{ product }">
          <UButton :to="`/dashboard/shops/${slug}/products/${product.id}`" variant="soft" size="sm">View</UButton>
        </template>
        <template #empty>
          <UButton :to="`/dashboard/shops/${slug}/products/create`" color="primary">Add first product</UButton>
        </template>
      </ProductsProductList>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useShopStore } from '~/stores/shop'
import { useQuoteStore } from '~/stores/quote'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'shop-owner', 'shop-setup-step'],
})

const route = useRoute()
const shopStore = useShopStore()
const quoteStore = useQuoteStore()
const slug = computed(() => route.params.slug as string)

onMounted(async () => {
  await shopStore.fetchShopBySlug(slug.value)
  await quoteStore.fetchProducts(slug.value)
})
</script>
