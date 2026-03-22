<template>
  <p
    v-if="message"
    class="flex items-start gap-2 text-xs leading-5 text-rose-700 dark:text-rose-300"
  >
    <UIcon name="i-lucide-alert-circle" class="mt-0.5 h-3.5 w-3.5 shrink-0" />
    <span>{{ message }}</span>
  </p>
</template>

<script setup lang="ts">
defineProps<{
  message?: string | null
}>()
</script>
