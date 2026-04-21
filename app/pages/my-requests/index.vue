<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

await navigateTo('/quotes', { redirectCode: 301 })
</script>

<template>
  <div class="py-8 sm:py-12">
    <CommonLoadingSpinner />
  </div>
</template>
