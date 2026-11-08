<script setup lang="ts">
definePageMeta({
  layout: 'design-workspace',
  middleware: 'proto-role',
  breadcrumb: [{ label: 'Shop setup', to: '/app/printer/shop' }],
})
</script>

<template>
  <ShopSetupView />
</template>
