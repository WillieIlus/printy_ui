<script setup lang="ts">
/**
 * Backwards-compatible step wrapper. The visual card is the shared homepage
 * `CalculatorWorkflowCard`, so the legacy calculator and the universal
 * calculator cannot drift apart.
 */
import DesignCalculatorWorkflowCard from './CalculatorWorkflowCard.vue'

defineProps<{
  n: string
  title: string
  hint?: string
  value?: string
}>()
</script>

<template>
  <DesignCalculatorWorkflowCard :n="n" :label="title" :hint="hint" :value="value">
    <slot />
  </DesignCalculatorWorkflowCard>
</template>
