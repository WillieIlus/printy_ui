<script setup lang="ts">
definePageMeta({
  layout: 'design-workspace',
  middleware: 'proto-role',
  breadcrumb: [{ label: 'Jobs', to: '/app/manager/jobs' }],
})

const route = useRoute()
</script>

<template>
  <NuxtPage v-if="route.params.id" />
  <ManagerJobsView v-else />
</template>
