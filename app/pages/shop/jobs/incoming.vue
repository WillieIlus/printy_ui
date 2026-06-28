<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const auth = useAuthStore()
await navigateTo(auth.dashboardRole === 'production' ? '/dashboard/production/jobs' : auth.homeRoute, { replace: true })
</script>

<template>
  <div class="sr-only">Redirecting to incoming jobs...</div>
</template>
