<template>
  <UBadge :color="color" variant="soft" size="sm">
    {{ label }}
  </UBadge>
</template>

<script setup lang="ts">
import type { SentQuoteStatus } from '~/shared/types/sentQuote'

const props = defineProps<{
  status: SentQuoteStatus | string
}>()

const statusMap: Record<string, { label: string; color: 'neutral' | 'warning' | 'success' | 'error' }> = {
  sent: { label: 'Sent', color: 'warning' },
  revised: { label: 'Revised', color: 'warning' },
  accepted: { label: 'Accepted', color: 'success' },
}

const label = computed(() => statusMap[props.status]?.label ?? props.status)
const color = computed(() => statusMap[props.status]?.color ?? 'neutral')
</script>
