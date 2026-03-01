<template>
  <div class="flex items-center justify-center" :class="containerClass">
    <UIcon name="i-lucide-loader-2" class="animate-spin text-gray-500 dark:text-gray-400" :class="sizeClass" />
    <span v-if="text" class="ml-2">{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg'
    text?: string
    fullScreen?: boolean
  }>(),
  { size: 'md', fullScreen: false }
)
const sizeClass = computed(() => ({
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
}[props.size]))
const containerClass = computed(() =>
  props.fullScreen ? 'fixed inset-0 bg-white/80 dark:bg-gray-900/80 z-50 flex items-center justify-center' : ''
)
</script>
