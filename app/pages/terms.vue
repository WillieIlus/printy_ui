<template>
  <LegalDocument
    title="Terms of Service"
    eyebrow="The agreement"
    intro="The rules for using Printy: quotes, artwork, payment, custody, deadlines and what happens when something goes wrong."
    current-label="Terms"
    :sections="TERMS_SECTIONS"
    :plain-words="TERMS_PLAIN_WORDS"
  />
</template>

<script setup lang="ts">
import LegalDocument from '~/components/legal/LegalDocument.vue'
import { TERMS_PLAIN_WORDS, TERMS_SECTIONS } from '~/shared/legal/content'

definePageMeta({ layout: 'design-public', role: 'client' })

useHead({
  title: 'Printy - Terms of Service',
  meta: [
    {
      name: 'description',
      content: 'Printy Terms of Service: estimates and quotes, artwork, payment and custody, deadlines, tracking, disputes and account rules.',
    },
  ],
})
</script>
