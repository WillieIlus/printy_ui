<template>
  <BaseStatCard :label="label" :value="value ?? '-'" :meta="hint" />
</template>

<script setup lang="ts">
import BaseStatCard from '~/components/base/BaseStatCard.vue'

defineProps<{
  label: string
  value?: string | number | null
  hint?: string
}>()
</script>
