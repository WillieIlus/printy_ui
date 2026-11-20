<script setup lang="ts">
import PrintyLogo from '../../branding/PrintyLogo.vue'

/**
 * The site wordmark: official Printy lockup, linked home.
 *
 * The full symbol + wordmark lockup stays visible on every screen, including
 * mobile. The mark-only responsive switch is intentionally off so the wordmark
 * is never hidden on a phone.
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
      :responsive="false"
    />
  </NuxtLink>
</template>
