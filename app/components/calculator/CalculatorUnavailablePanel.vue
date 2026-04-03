<template>
  <section class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5 shadow-sm sm:p-6">
    <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Calculator type</p>
    <h3 class="mt-2 text-2xl font-semibold text-[var(--p-text)]">{{ title }}</h3>
    <p class="mt-2 max-w-3xl text-sm text-[var(--p-text-muted)]">{{ description }}</p>
    <div class="mt-4 rounded-2xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4 text-sm text-[var(--p-text-muted)]">
      Flat remains available as the default calculator here. Switch back to continue pricing, drafting, or sending requests without losing the current flow.
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description: string
}>()
</script>
