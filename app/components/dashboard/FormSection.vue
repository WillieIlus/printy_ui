<template>
  <section class="rounded-[28px] border border-[var(--p-border)] bg-[var(--p-surface)] p-5 shadow-sm sm:p-6 dark:border-white/10 dark:bg-white/6 dark:backdrop-blur-xl">
    <div v-if="title || description || $slots.header" class="mb-5 flex items-start justify-between gap-4">
      <slot name="header">
        <div class="space-y-1">
          <h2 v-if="title" class="text-lg font-semibold text-[var(--p-text)] dark:text-white">
            {{ title }}
          </h2>
          <p v-if="description" class="max-w-2xl text-sm text-[var(--p-text-muted)] dark:text-slate-300">
            {{ description }}
          </p>
        </div>
      </slot>
      <div v-if="$slots.actions" class="shrink-0">
        <slot name="actions" />
      </div>
    </div>

    <div class="space-y-5">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
}>()
</script>
