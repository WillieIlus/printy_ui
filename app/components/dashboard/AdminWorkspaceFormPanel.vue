<template>
  <aside class="softui-panel floating-form-panel rounded-[2rem]">
    <div class="flex items-start justify-between gap-4 border-b border-white/8 px-5 py-5">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--p-text-muted)]">Editor</p>
        <h2 class="mt-1 text-lg font-semibold text-[var(--p-text)]">{{ title }}</h2>
        <p v-if="description" class="mt-1 text-sm leading-6 text-[var(--p-text-muted)]">{{ description }}</p>
      </div>
      <UButton
        color="neutral"
        variant="ghost"
        icon="i-lucide-x"
        aria-label="Close panel"
        @click="$emit('close')"
      />
    </div>
    <div class="p-5">
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
