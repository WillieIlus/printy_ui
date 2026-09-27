<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    text: string
    locked?: boolean
    reason?: string
  }>(),
  { locked: true, reason: 'Create a free account to reveal this price.' },
)
</script>

<template>
  <span class="inline-flex items-center">
    <template v-if="props.locked">
      <span class="obscured" aria-hidden="true" data-price-locked>{{ props.text }}</span>
      <span class="sr-only">{{ props.reason }}</span>
    </template>
    <template v-else>{{ props.text }}</template>
  </span>
</template>

<style scoped>
.obscured {
  filter: blur(7px) saturate(0.5);
  opacity: 0.9;
  pointer-events: none;
  user-select: none;
  -webkit-user-select: none;
}
</style>
