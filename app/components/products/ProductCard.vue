<template>
  <UCard class="transition-shadow hover:shadow-lg">
    <div class="space-y-3">
      <h3 class="font-semibold text-gray-900 dark:text-white">{{ product.name }}</h3>
      <p v-if="product.description" class="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">{{ product.description }}</p>
      <p v-if="priceLabel" class="font-medium text-gray-900 dark:text-white">{{ priceLabel }}</p>
      <UBadge v-if="!product.is_active" color="neutral" variant="soft" size="sm">Inactive</UBadge>
      <slot name="actions" />
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { Product } from '~/shared/types'

const props = defineProps<{ product: Product }>()

const priceLabel = computed(() => {
  const hint = props.product.price_hint
  if (hint?.price_display) return hint.price_display
  const unitLow = hint?.per_unit_low
  const unitHigh = hint?.per_unit_high
  if (unitLow != null && unitHigh != null && unitLow !== unitHigh) return `${unitLow} - ${unitHigh} / unit`
  if (unitLow != null) return `${unitLow} / unit`
  return null
})
</script>
