<template>
  <span class="inline-flex items-center gap-2 rounded-full border border-[var(--p-primary)]/20 bg-[var(--p-primary)]/8 px-3 py-1.5 text-xs font-semibold text-[var(--p-primary)]">
    <Icon name="lucide:gauge" class="size-3.5" />
    {{ labelText }}
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{
  label?: string | null
  level?: number | null
}>()

const labelText = computed(() => {
  if (props.label && props.level) return `${props.label} • P${props.level}`
  if (props.label) return props.label
  if (props.level) return `Priority P${props.level}`
  return 'Standard priority'
})
</script>
