<!-- Purpose: Horizontal or vertical divider atom, optionally with a centered label. -->
<template>
  <div
    v-if="!vertical"
    role="separator"
    class="flex items-center gap-3"
  >
    <div class="h-px flex-1 bg-[var(--p-border)]" />
    <span
      v-if="label || $slots.default"
      class="shrink-0 text-xs text-[var(--p-text-muted)]"
    >
      <slot>{{ label }}</slot>
    </span>
    <div v-if="label || $slots.default" class="h-px flex-1 bg-[var(--p-border)]" />
  </div>
  <div
    v-else
    role="separator"
    class="w-px self-stretch bg-[var(--p-border)]"
  />
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  label?: string
  vertical?: boolean
}>(), {
  vertical: false,
})
</script>
