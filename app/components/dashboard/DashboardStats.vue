<template>
  <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
    <div
      v-for="stat in stats"
      :key="stat.label"
      class="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm ring-1 ring-gray-100/50 transition-all hover:-translate-y-0.5 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900/50 dark:ring-gray-800/50"
    >
      <!-- subtle hover glow -->
      <div class="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
        <div class="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-flamingo-100/60 blur-2xl dark:bg-flamingo-900/30"></div>
        <div class="absolute -left-10 -bottom-10 h-20 w-20 rounded-full bg-gray-100/60 blur-2xl dark:bg-gray-800/60"></div>
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
        <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stat.value }}</p>
        <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{{ stat.label }}</p>
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
