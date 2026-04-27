<!-- Purpose: Public layout — shared top bar and footer for all marketing/browse pages. -->
<template>
  <div class="min-h-screen bg-[var(--p-bg)] text-[var(--p-text)]">
    <HomeTopBar />
    <slot />
    <MinimalFooter />
  </div>
</template>

<script setup lang="ts">
import HomeTopBar from '~/components/marketing/home/HomeTopBar.vue'
import MinimalFooter from '~/components/marketing/home/MinimalFooter.vue'
</script>
