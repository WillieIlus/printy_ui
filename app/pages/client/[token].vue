<template>
  <ClientPortalView :token="token" />
</template>

<script setup lang="ts">
const route = useRoute()
const token = computed(() => (typeof route.params.token === 'string' ? route.params.token : ''))

definePageMeta({ layout: 'design-public', role: 'client' })
</script>
