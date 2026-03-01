<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <div
      v-for="i in count"
      :key="i"
      class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden shadow-sm animate-pulse"
    >
      <div class="aspect-[4/3] bg-gray-200 dark:bg-gray-700" />
      <div class="p-5 space-y-3">
        <div class="h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
        <div class="h-4 w-full rounded bg-gray-100 dark:bg-gray-700/80" />
        <div class="h-4 w-1/2 rounded bg-gray-100 dark:bg-gray-700/80" />
        <div class="flex justify-between pt-2">
          <div class="h-6 w-16 rounded bg-gray-200 dark:bg-gray-700" />
          <div class="h-8 w-16 rounded-xl bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    count?: number
  }>(),
  { count: 6 }
)
</script>
