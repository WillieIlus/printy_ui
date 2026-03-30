<template>
  <div v-if="snapshot.line_total" class="text-sm">
    <div class="flex justify-between font-medium">
      <span class="text-[var(--p-text)]">Total</span>
      <span class="text-[var(--p-text)]">{{ formatMoney(snapshot.line_total) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StaffPricingSnapshot } from '~/shared/types'
const props = defineProps<{
  snapshot: StaffPricingSnapshot
}>()

const { formatMoney } = useCurrencyFormatter(computed(() => props.snapshot.currency ?? null))
</script>
