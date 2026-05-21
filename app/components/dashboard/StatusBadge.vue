<template>
  <BaseBadge :variant="variant" :dot="dot">
    <slot>{{ label }}</slot>
  </BaseBadge>
</template>

<script setup lang="ts">
import BaseBadge from '~/components/base/BaseBadge.vue'
import { printyStatusBadgeVariant, printyStatusLabel } from '~/constants/design'

const props = withDefaults(defineProps<{
  status?: string
  dot?: boolean
  label?: string
}>(), {
  dot: true,
  label: '',
})

const variant = computed(() => printyStatusBadgeVariant(props.status))
const label = computed(() => props.label || printyStatusLabel(props.status))
</script>
