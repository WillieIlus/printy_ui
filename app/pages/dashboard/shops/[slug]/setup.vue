<template>
  <div class="py-12">
    <CommonLoadingSpinner />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const route = useRoute()
const slug = computed(() => route.params.slug as string)

onMounted(async () => {
  await navigateTo(`/dashboard/shops/${slug.value}`, { replace: true })
})
</script>
