<script setup lang="ts">
definePageMeta({
  middleware: 'proto-role',
  breadcrumb: [{ label: 'Messages', to: '/app/messages' }],
})
</script>

<template>
  <MessagesView />
</template>
