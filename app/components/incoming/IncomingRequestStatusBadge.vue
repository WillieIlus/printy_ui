<template>
  <UBadge :color="color" variant="soft" size="sm">
    {{ label }}
  </UBadge>
</template>

<script setup lang="ts">
import type { IncomingRequestStatus } from '~/shared/types/incomingRequest'

const props = defineProps<{
  status: IncomingRequestStatus
}>()

const statusMap: Record<string, { label: string; color: 'neutral' | 'primary' | 'warning' | 'success' | 'error' }> = {
  submitted: { label: 'New', color: 'primary' },
  viewed: { label: 'Viewed', color: 'neutral' },
  quoted: { label: 'Quoted', color: 'warning' },
  accepted: { label: 'Accepted', color: 'success' },
  closed: { label: 'Closed', color: 'neutral' },
  cancelled: { label: 'Cancelled', color: 'error' },
  draft: { label: 'Draft', color: 'neutral' },
}

const label = computed(() => statusMap[props.status]?.label ?? props.status)
const color = computed(() => statusMap[props.status]?.color ?? 'neutral')
</script>
