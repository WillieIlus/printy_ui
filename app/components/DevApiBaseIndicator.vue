<!-- Purpose: Small development-only indicator for API environment awareness. -->
<template>
  <div
    v-if="show"
    class="fixed bottom-4 right-4 z-[95] rounded-full bg-slate-950 px-3 py-2 text-xs font-medium text-white shadow-lg"
  >
    Dev API
  </div>
</template>

<script setup lang="ts">
const show = computed(() => import.meta.dev)
</script>
