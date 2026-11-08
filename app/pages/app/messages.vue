<script setup lang="ts">
definePageMeta({
  layout: 'design-workspace',
  middleware: 'proto-role',
  breadcrumb: [{ label: 'Messages', to: '/app/messages' }],
})
</script>

<template>
  <MessagesView />
</template>
