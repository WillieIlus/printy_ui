<template>
  <div class="rounded-[28px] border border-dashed border-[var(--p-border)] bg-[var(--p-surface-raised)] px-6 py-10 text-center shadow-sm backdrop-blur-xl">
    <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)]">
      <UIcon :name="icon" class="h-7 w-7 text-orange-500 dark:text-orange-300" />
    </div>
    <h3 class="mt-4 text-lg font-semibold text-[var(--p-text)]">{{ title }}</h3>
    <p v-if="description" class="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--p-text-muted)]">
      {{ description }}
    </p>
    <div v-if="$slots.default" class="mt-6">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  description?: string
  icon?: string
}>(), {
  description: undefined,
  icon: 'i-lucide-sparkles',
})
</script>
