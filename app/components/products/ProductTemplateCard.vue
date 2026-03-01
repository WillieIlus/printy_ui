<template>
  <UCard class="hover:shadow-lg transition-shadow">
    <div class="space-y-3">
      <h3 class="font-semibold text-gray-900 dark:text-white">{{ product.name }}</h3>
      <p v-if="product.description" class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{{ product.description }}</p>
      <p v-if="priceLabel" class="font-medium text-gray-900 dark:text-white">{{ priceLabel }}</p>
      <UBadge v-if="!product.is_active" color="neutral" variant="soft" size="sm">Inactive</UBadge>
      <slot name="actions" />
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { ProductTemplate } from '~/shared/types'

const props = defineProps<{ product: ProductTemplate }>()

const priceLabel = computed(() => {
  const p = props.product
  const price = p.base_price ?? (p.defaults as Record<string, unknown>)?.base_price
  const unit = p.unit ?? (p.defaults as Record<string, unknown>)?.unit
  if (price && unit) return `${price} / ${unit}`
  if (price) return String(price)
  return null
})
</script>
