<script setup lang="ts">
definePageMeta({
  layout: 'design-workspace',
  middleware: 'proto-role',
  breadcrumb: [
    { label: 'My jobs', to: '' },
  ],
})

useHead({ title: 'My jobs', meta: [{ name: 'robots', content: 'noindex' }] })
</script>

<template>
  <BuyerJobsListView />
</template>
