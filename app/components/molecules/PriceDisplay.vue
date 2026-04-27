<!-- Purpose: Formatted price molecule with optional original price and discount badge. -->
<template>
  <span class="inline-flex items-baseline gap-1.5">
    <span v-if="loading" class="h-5 w-16 animate-pulse rounded bg-[var(--p-surface-container-high)]" />
    <template v-else>
      <span :class="['font-semibold tabular-nums text-[var(--p-secondary-dark)] dark:text-[var(--p-text)]', sizeClass]">
        {{ currency }} {{ formattedAmount }}
      </span>
      <span
        v-if="original && original > amount"
        class="text-sm text-[var(--p-text-muted)] line-through"
      >
        {{ currency }} {{ formatNum(original) }}
      </span>
      <BaseBadge v-if="discountLabel" variant="success" size="sm">{{ discountLabel }}</BaseBadge>
    </template>
  </span>
</template>

<script setup lang="ts">
import BaseBadge from '~/components/atoms/BaseBadge.vue'

const props = withDefaults(defineProps<{
  amount: number
  currency?: string
  original?: number
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}>(), {
  currency: 'KES',
  size: 'md',
})

const formatNum = (n: number) => n.toLocaleString('en-KE', { minimumFractionDigits: 0 })
const formattedAmount = computed(() => formatNum(props.amount))

const discountLabel = computed(() => {
  if (!props.original || props.original <= props.amount) return null
  return `-${Math.round((1 - props.amount / props.original) * 100)}%`
})

const sizeClass = computed(() => ({ sm: 'text-sm', md: 'text-lg', lg: 'text-2xl' })[props.size])
</script>
