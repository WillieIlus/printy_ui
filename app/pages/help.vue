<template>
  <LegalHelp />
</template>

<script setup lang="ts">
import LegalHelp from '~/components/legal/LegalHelp.vue'

definePageMeta({ layout: 'design-public', role: 'client' })

useHead({
  title: 'Printy - Help',
  meta: [
    {
      name: 'description',
      content: 'Answers about Printy quotes, artwork, M-Pesa payment, tracking, late jobs, delivery and data requests.',
    },
  ],
})
</script>
