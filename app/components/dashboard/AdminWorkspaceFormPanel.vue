<template>
  <aside class="softui-panel floating-form-panel sticky top-24 flex max-h-[calc(100vh-7rem)] min-h-0 flex-col overflow-hidden rounded-lg">
    <div class="flex items-start justify-between gap-4 border-b border-white/8 px-4 py-3.5 sm:px-5">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--p-text-muted)]">Editor</p>
        <h2 class="mt-1 text-base font-semibold text-[var(--p-text)] sm:text-lg">{{ title }}</h2>
        <p v-if="description" class="mt-1 text-sm leading-5 text-[var(--p-text-muted)]">{{ description }}</p>
      </div>
      <UButton
        color="neutral"
        variant="ghost"
        icon="i-lucide-x"
        aria-label="Close panel"
        @click="$emit('close')"
      />
    </div>
    <div class="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
      <slot />
    </div>
  </aside>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()

defineEmits<{
  close: []
}>()
</script>
