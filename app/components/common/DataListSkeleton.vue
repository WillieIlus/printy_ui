<script setup lang="ts">
interface Props {
  /** Number of skeleton rows (default: 5) */
  rows?: number
  /** Show as table layout (default) or card grid */
  variant?: 'table' | 'cards'
}

withDefaults(defineProps<Props>(), {
  rows: 5,
  variant: 'table',
})
</script>

<template>
  <div
    v-if="variant === 'table'"
    class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
  >
    <div class="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
      <div class="flex gap-4 px-4 py-3 sm:px-6">
        <div class="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-600" />
        <div class="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-600" />
        <div class="h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-600" />
        <div class="ml-auto h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-600" />
      </div>
    </div>
    <div class="divide-y divide-gray-200 dark:divide-gray-700">
      <div
        v-for="i in rows"
        :key="i"
        class="flex items-center gap-4 px-4 py-4 sm:px-6"
      >
        <div class="h-4 flex-1 animate-pulse rounded bg-gray-200 dark:bg-gray-600" />
        <div class="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-600" />
        <div class="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-600" />
        <div class="h-8 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-600" />
      </div>
    </div>
  </div>

  <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <div
      v-for="i in rows"
      :key="i"
      class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
    >
      <div class="h-5 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-600" />
      <div class="mt-2 h-4 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-600" />
      <div class="mt-4 h-6 w-1/3 animate-pulse rounded bg-gray-200 dark:bg-gray-600" />
      <div class="mt-3 flex gap-2">
        <div class="h-8 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-600" />
        <div class="h-8 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-600" />
      </div>
    </div>
  </div>
</template>
