<script setup lang="ts">
definePageMeta({
  layout: 'design-workspace',
  middleware: 'proto-role',
  breadcrumb: [{ label: 'Managers', to: '/app/admin/managers' }],
})
</script>

<template>
  <AdminManagersView />
</template>
