<template>
  <section class="rounded-[28px] border border-[var(--p-border)] bg-[var(--p-surface-raised)] p-5 shadow-sm backdrop-blur-xl sm:p-6">
    <div v-if="title || description || $slots.header" class="mb-5 flex items-start justify-between gap-4">
      <slot name="header">
        <div class="space-y-1">
          <h2 v-if="title" class="text-lg font-semibold text-[var(--p-text)]">
            {{ title }}
          </h2>
          <p v-if="description" class="max-w-2xl text-sm leading-6 text-[var(--p-text-muted)]">
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
