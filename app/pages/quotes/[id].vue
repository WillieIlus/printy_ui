<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const auth = useAuthStore()
const route = useRoute()
const id = route.params.id

const target = auth.dashboardRole === 'partner'
  ? `/dashboard/partner/quotes/${id}`
  : auth.dashboardRole === 'client'
    ? `/dashboard/client/quotes/${id}`
    : auth.dashboardRole === 'production'
      ? '/dashboard/production/jobs'
      : auth.homeRoute

await navigateTo(target, { replace: true })
</script>

<template>
  <div class="sr-only">Redirecting to quote...</div>
</template>
