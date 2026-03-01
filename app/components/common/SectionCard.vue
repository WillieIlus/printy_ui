<script setup lang="ts">
interface Props {
  title?: string
  description?: string
}

withDefaults(defineProps<Props>(), {
  title: undefined,
  description: undefined,
})
</script>

<template>
  <div
    class="overflow-hidden rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] shadow-sm"
  >
    <div
      v-if="title || $slots.header"
      class="border-b border-[var(--p-border-dim)] px-4 py-4 sm:px-6"
    >
      <slot name="header">
        <h2 v-if="title" class="text-base font-semibold text-[var(--p-text)]">
          {{ title }}
        </h2>
        <p
          v-if="description"
          class="mt-1 text-sm text-[var(--p-text-muted)]"
        >
          {{ description }}
        </p>
      </slot>
    </div>
    <div class="p-4 sm:p-6">
      <slot />
    </div>
  </div>
</template>
