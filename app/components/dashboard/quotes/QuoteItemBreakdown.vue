<template>
  <div v-if="snapshot.line_total" class="text-sm">
    <div class="flex justify-between font-medium">
      <span class="text-[var(--p-text)]">Total</span>
      <span class="text-[var(--p-text)]">{{ formatKES(snapshot.line_total) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StaffPricingSnapshot } from '~/shared/types'
import { formatKES } from '~/utils/formatters'

defineProps<{
  snapshot: StaffPricingSnapshot
}>()
</script>
