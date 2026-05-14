<template>
  <section class="rounded-[1.75rem] border border-dashed border-[var(--p-border)] bg-[var(--p-surface)] px-5 py-10 text-center">
    <p class="text-sm font-semibold text-[var(--p-text)]">{{ title }}</p>
    <p class="mt-2 text-sm text-[var(--p-text-muted)]">{{ description }}</p>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description: string
}>()
</script>
