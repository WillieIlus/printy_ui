<script setup lang="ts">
definePageMeta({ layout: false })
await navigateTo('/gallery', { replace: true, redirectCode: 301 })
</script>

<template>
  <div class="py-8 sm:py-12">
    <CommonLoadingSpinner />
  </div>
</template>
