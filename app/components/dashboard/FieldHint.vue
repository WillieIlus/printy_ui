<template>
  <p class="text-xs leading-5 text-slate-400">
    <slot>{{ text }}</slot>
  </p>
</template>

<script setup lang="ts">
defineProps<{
  text?: string
}>()
</script>
