<template>
  <div
    class="flex flex-col items-center justify-center rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] px-8 py-12 text-center"
  >
    <div
      class="flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--p-surface-sunken)] dark:bg-[var(--p-surface-raised)]"
    >
      <UIcon :name="icon" class="h-7 w-7 text-[var(--p-text-muted)]" />
    </div>
    <h3 class="mt-4 text-base font-medium text-[var(--p-text)]">
      {{ title }}
    </h3>
    <p v-if="description" class="mt-2 max-w-sm text-sm text-[var(--p-text-muted)]">
      {{ description }}
    </p>
    <div v-if="$slots.default" class="mt-6">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    description?: string
    icon?: string
  }>(),
  { icon: 'i-lucide-inbox' }
)
</script>
