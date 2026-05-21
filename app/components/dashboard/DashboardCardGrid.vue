<template>
  <div :class="gridClass">
    <slot />
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  columns?: '2' | '4'
}>(), {
  columns: '4',
})

const gridClass = computed(() => props.columns === '2'
  ? 'grid grid-cols-1 gap-4 sm:grid-cols-2'
  : 'grid grid-cols-2 gap-4 lg:grid-cols-4')
</script>
