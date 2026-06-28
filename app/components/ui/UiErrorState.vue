<template>
  <UiCard class="border-rose-200 bg-rose-50/70">
    <p class="text-sm font-semibold text-rose-700">{{ title }}</p>
    <p class="mt-2 text-sm text-rose-900/80">{{ description }}</p>
  </UiCard>
</template>

<script setup lang="ts">
import UiCard from '~/components/ui/UiCard.vue'

defineProps<{
  title: string
  description: string
}>()
</script>
