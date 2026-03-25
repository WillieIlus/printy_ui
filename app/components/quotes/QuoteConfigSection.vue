<template>
  <section class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-container-low)] p-4 sm:p-5">
    <div v-if="title || description" class="mb-4">
      <h3 v-if="title" class="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--p-text)]">
        {{ title }}
      </h3>
      <p v-if="description" class="mt-1 text-sm text-[var(--p-text-muted)]">
        {{ description }}
      </p>
    </div>
    <slot />
  </section>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  description?: string
}>(), {
  title: '',
  description: '',
})
</script>
