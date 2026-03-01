<template>
  <div class="min-h-screen bg-[#f3f6fc] dark:bg-[#101828] text-[#101828] dark:text-gray-100" :class="{ 'flex flex-col items-center justify-center': center }">
    <slot />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Center content vertically and horizontally (e.g. for error pages) */
    center?: boolean
  }>(),
  { center: false }
)
</script>
