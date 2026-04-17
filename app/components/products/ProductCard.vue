<template>
  <UCard :class="['transition-shadow hover:shadow-lg overflow-hidden', cardStatusBorderClass]">
    <div class="space-y-3">
      <h3 class="font-semibold text-gray-900 dark:text-white">{{ product.name }}</h3>
      <p v-if="product.description" class="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">{{ product.description }}</p>
      <p v-if="priceLabel" class="font-medium text-gray-900 dark:text-white">{{ priceLabel }}</p>
      <div class="flex flex-wrap gap-2">
        <UBadge color="neutral" variant="soft" size="sm">{{ productModeLabel }}</UBadge>
        <template v-if="cardStatus">
          <UBadge v-if="cardStatus === 'live'" color="success" variant="soft" size="sm">Live</UBadge>
          <UBadge v-else-if="cardStatus === 'draft'" color="warning" variant="soft" size="sm">Draft</UBadge>
          <UBadge v-else-if="cardStatus === 'unlisted'" color="info" variant="soft" size="sm">Unlisted</UBadge>
          <UBadge v-else color="error" variant="soft" size="sm">Unavailable</UBadge>
        </template>
        <template v-else>
          <UBadge v-if="!product.is_active" color="neutral" variant="soft" size="sm">Inactive</UBadge>
          <UBadge v-else-if="product.is_public === false" color="warning" variant="soft" size="sm">Hidden</UBadge>
          <UBadge v-else color="primary" variant="soft" size="sm">Public</UBadge>
        </template>
      </div>
      <slot name="actions" />
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { Product } from '~/shared/types'
import type { ProductCardStatus } from '~/utils/product'

const props = defineProps<{
  product: Product
  cardStatus?: ProductCardStatus
}>()

const cardStatusBorderClass = computed(() => {
  if (!props.cardStatus) return ''
  if (props.cardStatus === 'live') return 'border-l-4 border-l-green-500'
  if (props.cardStatus === 'draft') return 'border-l-4 border-l-amber-500'
  if (props.cardStatus === 'unlisted') return 'border-l-4 border-l-blue-500'
  return 'border-l-4 border-l-red-500'
})

const priceLabel = computed(() => {
  const hint = props.product.price_hint
  if (hint?.price_display) return hint.price_display
  const unitLow = hint?.per_unit_low
  const unitHigh = hint?.per_unit_high
  if (unitLow != null && unitHigh != null && unitLow !== unitHigh) return `${unitLow} - ${unitHigh} / unit`
  if (unitLow != null) return `${unitLow} / unit`
  return null
})

const productModeLabel = computed(() => {
  if (props.product.pricing_mode === 'LARGE_FORMAT') return 'Large Format'
  if (props.product.product_kind === 'BOOKLET') return 'Booklet'
  return 'Flat / Sheet'
})
</script>
