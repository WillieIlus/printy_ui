<template>
  <span class="relative inline-flex shrink-0" :style="{ width: `${size}px`, height: `${size}px` }">
    <span class="ball-ping absolute inline-flex h-full w-full rounded-full" :style="{ background: color }" />
    <span class="relative inline-flex h-full w-full rounded-full" :style="{ background: color, boxShadow: `0 0 ${size}px ${color}` }" />
  </span>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ color?: string; size?: number }>(), { color: 'var(--accent)', size: 10 })
</script>