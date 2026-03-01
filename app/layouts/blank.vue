<template>
  <div class="min-h-screen bg-[var(--p-bg)] text-[var(--p-text)]" :class="{ 'flex flex-col items-center justify-center': center }">
    <slot />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    center?: boolean
  }>(),
  { center: false }
)
</script>
