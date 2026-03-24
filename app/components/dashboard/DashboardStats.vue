<template>
  <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
    <div
      v-for="stat in stats"
      :key="stat.label"
      class="group relative overflow-hidden rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-raised)] p-5 shadow-sm ring-1 ring-[var(--p-border-dim)] transition-all hover:-translate-y-0.5 hover:shadow-lg"
    >
      <!-- subtle hover glow -->
      <div class="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
        <div class="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-flamingo-100/60 blur-2xl dark:bg-flamingo-900/30" />
        <div class="absolute -left-10 -bottom-10 h-20 w-20 rounded-full bg-gray-100/60 blur-2xl dark:bg-gray-800/60" />
      </div>

      <div class="relative flex items-center justify-between">
        <div
          class="flex h-11 w-11 items-center justify-center rounded-2xl ring-1 ring-inset shrink-0"
          :class="stat.bgColor"
        >
          <UIcon :name="stat.icon" class="h-5 w-5" :class="stat.iconColor" />
        </div>
      </div>

      <div class="relative mt-3">
        <p class="text-2xl font-bold text-[var(--p-text)]">{{ stat.value }}</p>
        <p class="mt-1 text-sm leading-5 text-[var(--p-text-muted)]">{{ stat.label }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  stats: Array<{
    label: string
    value: string | number
    icon: string
    bgColor: string
    iconColor: string
  }>
}>()
</script>
