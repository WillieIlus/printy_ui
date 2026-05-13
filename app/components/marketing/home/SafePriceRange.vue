<template>
  <SafePriceBlock
    label="Estimated market range"
    :value="rangeText"
    caption="A clear price guide before artwork review and final quoting."
  />
</template>

<script setup lang="ts">
import SafePriceBlock from '~/components/workflow/SafePriceBlock.vue'

defineProps<{
  rangeText: string
}>()
</script>
