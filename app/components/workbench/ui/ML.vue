<template>
  <div :class="['font-mono2 text-[10px] uppercase tracking-[0.22em] text-[var(--sub)]', className]">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{ className?: string }>()
</script>