<!-- Purpose: Request/order status badge molecule that maps status strings to colors and icons. -->
<template>
  <BaseBadge :variant="config.variant" :size="size">
    <Icon :name="config.icon" class="size-3" />
    {{ config.label }}
  </BaseBadge>
</template>

<script setup lang="ts">
import BaseBadge from '~/components/atoms/BaseBadge.vue'

type Status = 'pending' | 'processing' | 'completed' | 'cancelled' | 'draft' | 'rejected' | 'active'

const props = withDefaults(defineProps<{
  status: Status
  size?: 'sm' | 'md'
}>(), {
  size: 'sm',
})

type BadgeVariant = 'primary' | 'warning' | 'success' | 'error' | 'neutral' | 'info'

const configs: Record<Status, { label: string; variant: BadgeVariant; icon: string }> = {
  pending:    { label: 'Pending',    variant: 'warning', icon: 'lucide:clock' },
  processing: { label: 'Processing', variant: 'info',    icon: 'lucide:refresh-cw' },
  completed:  { label: 'Completed',  variant: 'success', icon: 'lucide:check-circle-2' },
  cancelled:  { label: 'Cancelled',  variant: 'neutral', icon: 'lucide:x-circle' },
  draft:      { label: 'Draft',      variant: 'neutral', icon: 'lucide:pencil-line' },
  rejected:   { label: 'Rejected',   variant: 'error',   icon: 'lucide:x-circle' },
  active:     { label: 'Active',     variant: 'success', icon: 'lucide:zap' },
}

const config = computed(() => configs[props.status] ?? configs.pending)
</script>
