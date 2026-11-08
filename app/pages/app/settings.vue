<script setup lang="ts">
definePageMeta({
  layout: 'design-workspace',
  middleware: 'proto-role',
  breadcrumb: [{ label: 'Settings', to: '/app/settings' }],
})
</script>

<template>
  <SettingsView />
</template>
