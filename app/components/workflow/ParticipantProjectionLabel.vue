<template>
  <span class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700">
    <Icon :name="icon" class="size-3.5 text-[var(--p-primary)]" />
    <span>{{ label }}</span>
  </span>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  label: string
  icon?: string
}>(), {
  icon: 'lucide:shield-check',
})
</script>
