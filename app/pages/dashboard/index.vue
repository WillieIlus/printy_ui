<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const auth = useAuthStore()
const route = useRoute()

const target = computed(() => {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(route.query)) {
    if (typeof value === 'string') {
      query.set(key, value)
    }
  }
  const nextRoute = auth.homeRoute
  const nextQuery = query.toString()
  return nextQuery ? `${nextRoute}?${nextQuery}` : nextRoute
})

await navigateTo(target.value, { replace: true })
</script>

<template>
  <div class="sr-only">Redirecting to your dashboard...</div>
</template>
