<template>
  <div
    class="rounded-[24px] border p-4 backdrop-blur-xl"
    :class="toneClass"
  >
    <div class="flex items-start gap-3">
      <div class="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] dark:border-white/10 dark:bg-white/10">
        <UIcon :name="icon" class="h-5 w-5" />
      </div>
      <div class="min-w-0 space-y-1">
        <p class="text-sm font-semibold text-[var(--p-text)] dark:text-white">{{ title }}</p>
        <p v-if="description" class="text-sm leading-6 text-[var(--p-text-dim)] dark:text-slate-200/90">
          {{ description }}
        </p>
        <div v-if="$slots.default" class="pt-1">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  title: string
  description?: string
  icon?: string
  tone?: 'default' | 'orange' | 'green' | 'blue'
}>(), {
  description: undefined,
  icon: 'i-lucide-info',
  tone: 'default',
})

const toneClass = computed(() => {
  const map: Record<string, string> = {
    default: 'border-[var(--p-border)] bg-[var(--p-surface-sunken)] text-[var(--p-text)] dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-200',
    orange: 'border-orange-200 bg-orange-50 text-orange-950 dark:border-orange-400/25 dark:bg-orange-500/10 dark:text-orange-100',
    green: 'border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-400/25 dark:bg-emerald-500/10 dark:text-emerald-100',
    blue: 'border-sky-200 bg-sky-50 text-sky-950 dark:border-sky-400/25 dark:bg-sky-500/10 dark:text-sky-100',
  }
  return map[props.tone] ?? map.default
})
</script>
