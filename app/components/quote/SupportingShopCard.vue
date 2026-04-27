<!-- Purpose: Secondary shop result card for quote output. -->
<template>
  <BaseCard class="space-y-2">
    <p class="text-sm font-semibold text-slate-900">{{ title }}</p>
    <p class="text-sm text-slate-500">{{ summary }}</p>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from '~/components/ui/BaseCard.vue'

defineProps<{
  title: string
  summary: string
}>()
</script>
