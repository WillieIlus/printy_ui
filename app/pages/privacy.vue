<template>
  <LegalDocument
    title="Privacy Notice"
    eyebrow="Your data"
    intro="What Printy collects, why we need it, who can see it, how long we keep it and the rights you can use."
    current-label="Privacy"
    :sections="PRIVACY_SECTIONS"
    :plain-words="PRIVACY_PLAIN_WORDS"
  />
</template>

<script setup lang="ts">
import LegalDocument from '~/components/legal/LegalDocument.vue'
import { PRIVACY_PLAIN_WORDS, PRIVACY_SECTIONS } from '~/shared/legal/content'

definePageMeta({ layout: 'design-public', role: 'client' })

useHead({
  title: 'Printy - Privacy Notice',
  meta: [
    {
      name: 'description',
      content: 'How Printy collects, uses and protects personal data, who can see it, cross-border transfers, retention and your data rights.',
    },
  ],
})
</script>
