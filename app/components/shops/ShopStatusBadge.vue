<template>
  <UBadge
    :color="badgeColor"
    variant="soft"
    size="sm"
    class="shrink-0"
  >
    <UIcon :name="statusIcon" class="mr-1 h-3.5 w-3.5" />
    {{ statusLabel }}
  </UBadge>
</template>

<script setup lang="ts">
import type { ShopStatus } from '~/shared/types'

const props = defineProps<{ status: ShopStatus }>()

const statusLabel = computed(() => {
  const labels: Record<ShopStatus, string> = {
    opening: 'Open',
    closing_soon: 'Closing soon',
    closed: 'Closed',
  }
  return labels[props.status] ?? props.status
})

const statusIcon = computed(() => {
  const icons: Record<ShopStatus, string> = {
    opening: 'i-lucide-circle-check',
    closing_soon: 'i-lucide-clock',
    closed: 'i-lucide-circle-x',
  }
  return icons[props.status] ?? 'i-lucide-circle'
})

const badgeColor = computed(() => {
  const colors: Record<ShopStatus, string> = {
    opening: 'success',
    closing_soon: 'warning',
    closed: 'neutral',
  }
  return colors[props.status] ?? 'neutral'
})
</script>
