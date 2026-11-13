<template>
  <TrackView :token="token" />
</template>

<script setup lang="ts">
const route = useRoute()
const token = computed(() => typeof route.params.token === 'string' ? route.params.token : '')

definePageMeta({ layout: 'design-public', role: 'client' })

useHead({
  title: 'Track a job',
  meta: [
    {
      name: 'description',
      content: 'Enter your Printy job code to see the live stage, who has it, and what happens next — escrow-protected end to end.',
    },
  ],
})
</script>
