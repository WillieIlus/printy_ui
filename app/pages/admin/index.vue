<template>
  <div class="min-h-[12rem]" />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'super-admin'],
})

await navigateTo('/super-admin/analytics', { replace: true })
</script>
