<template>
  <header :class="classes">
    <slot />
  </header>
</template>

<script setup lang="ts">
import { PRINTY_SHELLS } from '~/constants/design'

const props = withDefaults(defineProps<{
  tone?: 'light' | 'dark'
}>(), {
  tone: 'light',
})

const classes = computed(() => [
  'sticky top-0 z-30 h-16 flex items-center gap-4 px-4 lg:px-6 shrink-0',
  PRINTY_SHELLS.topbar[props.tone],
])
</script>
