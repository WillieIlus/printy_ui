<script setup lang="ts">
definePageMeta({
  middleware: 'proto-role',
  breadcrumb: [{ label: 'Settings', to: '/app/settings' }],
})
</script>

<template>
  <SettingsView />
</template>
