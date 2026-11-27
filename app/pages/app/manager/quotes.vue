<script setup lang="ts">
definePageMeta({
  layout: 'design-workspace',
  middleware: 'proto-role',
  breadcrumb: [{ label: 'Quotes', to: '/app/manager/quotes' }],
})

const route = useRoute()
</script>

<template>
  <NuxtPage v-if="route.params.id" />
  <ManagerQuotesListView v-else />
</template>
