<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const route = useRoute()
await navigateTo(`/quotes/${route.params.id}`, { redirectCode: 301 })
</script>

<template>
  <div class="py-8 sm:py-12">
    <CommonLoadingSpinner />
  </div>
</template>
