<template>
  <p class="text-xs leading-5 text-[var(--p-text-muted)]">
    <slot>{{ text }}</slot>
  </p>
</template>

<script setup lang="ts">
defineProps<{
  text?: string
}>()
</script>
