<template>
  <div class="py-12">
    <CommonLoadingSpinner />
  </div>
</template>

<script setup lang="ts">
import { useSetupStatus } from '~/composables/useSetupStatus'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const route = useRoute()
const slug = computed(() => route.params.slug as string)
const { refresh } = useSetupStatus()

onMounted(async () => {
  const status = await refresh(slug.value)
  await navigateTo(status?.next_url || `/dashboard/shops/${slug.value}`, { replace: true })
})
</script>
