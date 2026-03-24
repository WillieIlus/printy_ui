<script setup lang="ts">
interface Props {
  title: string
  description?: string
  icon?: string
}

withDefaults(defineProps<Props>(), {
  description: undefined,
  icon: 'i-lucide-inbox',
})
</script>

<template>
  <div class="empty-state rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-raised)] p-8 text-center">
    <div class="flex justify-center">
      <UIcon :name="icon" class="w-14 h-14 text-[var(--p-text-muted)]" />
    </div>
    <h3 class="mt-4 text-base font-semibold text-[var(--p-text)]">{{ title }}</h3>
    <p v-if="description" class="mt-2 text-sm leading-6 text-[var(--p-text-muted)]">{{ description }}</p>
    <div v-if="$slots.default" class="mt-6">
      <slot />
    </div>
  </div>
</template>
