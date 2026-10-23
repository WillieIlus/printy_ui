<script setup lang="ts">
definePageMeta({
  middleware: 'proto-role',
  breadcrumb: [{ label: 'Rate card', to: '/app/printer/rates' }],
})
</script>

<template>
  <RateCardView />
</template>