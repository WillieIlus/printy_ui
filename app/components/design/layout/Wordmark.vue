<script setup lang="ts">
import PrintyLogo from '../../branding/PrintyLogo.vue'

/**
 * The site wordmark: official Printy lockup, linked home.
 *
 * The mark is shown on very narrow screens and the full symbol + wordmark
 * lockup from `sm` up, so the header never squeezes or stretches the artwork.
 */
const props = withDefaults(defineProps<{
  onDark?: boolean
  height?: number | string
}>(), { onDark: false, height: 30 })
</script>

<template>
  <NuxtLink to="/" class="group flex shrink-0 items-center" aria-label="Printy home">
    <PrintyLogo
      variant="logo"
      :tone="props.onDark ? 'on-dark' : 'brand'"
      :height="props.height"
      responsive
    />
  </NuxtLink>
</template>
