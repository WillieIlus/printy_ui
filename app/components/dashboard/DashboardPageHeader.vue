<template>
  <div class="col-span-12 overflow-hidden rounded-[30px] border border-[var(--p-border)] bg-[var(--p-surface-raised)] p-6 shadow-sm backdrop-blur-xl sm:p-7">
    <div class="absolute" />
    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
    <div class="min-w-0 flex-1 space-y-1">
      <p class="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-orange-600 dark:text-orange-300/90">
        Printy Workspace
      </p>
      <h1 class="text-3xl font-semibold tracking-[0.01em] text-[var(--p-text)] sm:text-4xl">
        {{ title }}
      </h1>
      <p v-if="subtitle" class="max-w-3xl text-[0.95rem] leading-7 text-[var(--p-text-muted)]">
        {{ subtitle }}
      </p>
      <div v-if="$slots.default" class="pt-1">
        <slot />
      </div>
    </div>
    <div v-if="$slots.actions" class="shrink-0 flex flex-wrap items-center gap-2">
      <slot name="actions" />
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>
