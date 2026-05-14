<template>
  <QuickQuoteBuilder @created="$emit('created')" />
</template>

<script setup lang="ts">
import QuickQuoteBuilder from '~/components/dashboard/partner/QuickQuoteBuilder.vue'

defineEmits<{
  (e: 'created'): void
}>()
</script>
