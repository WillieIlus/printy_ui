<script setup lang="ts">
const props = defineProps<{
  title: string
  hint?: string
}>()
</script>

<template>
  <div class="rounded-xl border border-dashed border-line-strong bg-paper px-5 py-8 text-center">
    <p class="font-medium text-ink-2">{{ props.title }}</p>
    <p v-if="props.hint" class="mt-1 text-sm text-ink-3">{{ props.hint }}</p>
  </div>
</template>
