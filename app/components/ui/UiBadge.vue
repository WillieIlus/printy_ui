<template>
  <BaseBadge :variant="variant">
    <slot />
  </BaseBadge>
</template>

<script setup lang="ts">
import BaseBadge from '~/components/base/BaseBadge.vue'

const props = withDefaults(defineProps<{
  tone?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger'
}>(), {
  tone: 'neutral',
})

const variant = computed(() => ({
  neutral: 'default',
  primary: 'orange',
  success: 'green',
  warning: 'yellow',
  danger: 'red',
}[props.tone] as 'default' | 'orange' | 'green' | 'yellow' | 'red'))
</script>
