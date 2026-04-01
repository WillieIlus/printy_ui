<template>
  <div v-if="products?.length" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <ProductsProductCard v-for="product in products" :key="product.id" :product="product">
      <template #actions>
        <slot name="card-actions" :product="product" />
      </template>
    </ProductsProductCard>
  </div>
  <DashboardEmptyState
    v-else
    title="No products yet"
    description="Add products to start quoting from your catalog."
    icon="i-lucide-package"
  >
    <slot name="empty" />
  </DashboardEmptyState>
</template>

<script setup lang="ts">
import type { Product } from '~/shared/types'

defineProps<{ products?: Product[] }>()
</script>
