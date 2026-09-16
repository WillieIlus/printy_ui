<template>
  <svg :width="size" :height="size" viewBox="0 0 32 32" role="img" aria-hidden="true">
    <circle cx="16" cy="16" r="7.5" fill="none" stroke="var(--accent)" stroke-width="2.4" />
    <path d="M16 1.5v7M16 23.5v7M1.5 16h7M23.5 16h7" stroke="var(--accent)" stroke-width="2.4" />
    <circle cx="16" cy="16" r="2.4" fill="var(--accent)" />
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ size?: number }>(), { size: 26 })
</script>