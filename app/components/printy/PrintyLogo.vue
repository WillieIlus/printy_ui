<template>
  <NuxtLink v-if="to" :to="to" class="inline-flex items-center shrink-0" :class="wrapperClass">
    <img :src="logoSrc" :alt="altText" :class="imageClass">
  </NuxtLink>
  <div v-else class="inline-flex items-center shrink-0" :class="wrapperClass">
    <img :src="logoSrc" :alt="altText" :class="imageClass">
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  variant?: 'light' | 'dark' | 'mark' | 'full'
  size?: 'sm' | 'md' | 'lg'
  to?: string
}>(), {
  variant: 'full',
  size: 'md',
})

const imageClass = computed(() => {
  const sizeMap = {
    sm: props.variant === 'mark' ? 'h-7 w-7' : 'h-7 w-auto',
    md: props.variant === 'mark' ? 'h-9 w-9' : 'h-9 w-auto',
    lg: props.variant === 'mark' ? 'h-11 w-11' : 'h-11 w-auto',
  } as const
  return sizeMap[props.size]
})

const wrapperClass = computed(() => props.variant === 'mark' ? '' : 'tracking-tight')
const altText = computed(() => props.variant === 'mark' ? 'Printy mark' : 'Printy')
const logoSrc = computed(() => {
  if (props.variant === 'mark') {
    return '/assets/logo-mark/dark/printy-logo-mark-01.svg'
  }
  if (props.variant === 'light') {
    return '/assets/word-mark/light/printy-word-mark-03.svg'
  }
  return '/assets/word-mark/dark/printy-word-mark-03.svg'
})
</script>
