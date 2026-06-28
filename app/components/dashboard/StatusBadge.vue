<template>
  <BaseBadge :variant="resolvedVariant" :dot="dot" :size="size" :class="className">
    <slot>{{ label }}</slot>
  </BaseBadge>
</template>

<script setup lang="ts">
import BaseBadge from '~/components/base/BaseBadge.vue'
import { printyStatusBadgeVariant, printyStatusLabel, type PrintyStatusDomain, type PrintyBadgeVariant } from '~/constants/design'

type ReferenceBadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'muted'
type BadgeVariant = PrintyBadgeVariant | ReferenceBadgeVariant

const props = withDefaults(defineProps<{
  status?: string
  value?: string | null
  domain?: PrintyStatusDomain
  dot?: boolean
  label?: string
  variant?: BadgeVariant
  size?: 'sm' | 'md' | 'lg'
  className?: string
}>(), {
  value: null,
  domain: 'generic',
  dot: true,
  label: '',
  variant: undefined,
  size: 'md',
  className: '',
})

const referenceVariantMap: Record<ReferenceBadgeVariant, PrintyBadgeVariant> = {
  success: 'accepted',
  warning: 'pending',
  danger: 'rejected',
  info: 'blue',
  muted: 'gray',
}

const statusValue = computed(() => props.status || props.value || undefined)
const resolvedVariant = computed<PrintyBadgeVariant>(() => {
  if (!props.variant) return printyStatusBadgeVariant(statusValue.value, props.domain)
  return referenceVariantMap[props.variant as ReferenceBadgeVariant] || props.variant as PrintyBadgeVariant
})
const label = computed(() => props.label || printyStatusLabel(statusValue.value, props.domain))
</script>
