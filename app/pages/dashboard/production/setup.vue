<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const route = useRoute()
const query = route.fullPath.includes('?') ? route.fullPath.slice(route.fullPath.indexOf('?')) : ''

await navigateTo(`/dashboard/production/onboarding${query}`, { replace: true })
</script>

<template>
  <div class="sr-only">Redirecting to production setup...</div>
</template>
