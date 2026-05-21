<template>
  <BaseCard :padding="normalizedPadding" variant="dashboard">
    <slot />
  </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from '~/components/base/BaseCard.vue'

const props = withDefaults(defineProps<{
  padding?: string
}>(), {
  padding: 'p-6',
})

const normalizedPadding = computed(() => {
  if (props.padding.includes('p-8')) return 'xl'
  if (props.padding.includes('p-6')) return 'lg'
  if (props.padding.includes('p-5')) return 'md'
  if (props.padding.includes('p-4')) return 'sm'
  return 'md'
})
</script>
