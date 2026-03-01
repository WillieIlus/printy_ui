<template>
  <div class="animate-pulse space-y-4" :class="wrapperClass">
    <!-- KPI row skeleton -->
    <div v-if="variant === 'kpi'" class="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <div v-for="i in 4" :key="i" class="rounded-xl border border-gray-200/80 bg-white p-5 dark:border-gray-700/60 dark:bg-gray-800/50">
        <div class="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-700" />
        <div class="mt-3 h-8 w-20 rounded bg-gray-200 dark:bg-gray-700" />
        <div class="mt-2 h-4 w-24 rounded bg-gray-100 dark:bg-gray-700/80" />
      </div>
    </div>

    <!-- Table skeleton -->
    <div v-else-if="variant === 'table'" class="rounded-xl border border-gray-200/80 bg-white overflow-hidden dark:border-gray-700/60 dark:bg-gray-800/50">
      <div class="border-b border-gray-100 px-5 py-4 dark:border-gray-700/60">
        <div class="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700" />
      </div>
      <div class="p-5 space-y-3">
        <div v-for="i in rows" :key="i" class="flex gap-4">
          <div class="h-4 flex-1 rounded bg-gray-200 dark:bg-gray-700" />
          <div class="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
          <div class="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    </div>

    <!-- Card grid skeleton -->
    <div v-else-if="variant === 'cards'" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="i in cardCount" :key="i" class="rounded-xl border border-gray-200/80 bg-white p-5 dark:border-gray-700/60 dark:bg-gray-800/50">
        <div class="h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
        <div class="mt-3 h-4 w-full rounded bg-gray-100 dark:bg-gray-700/80" />
        <div class="mt-2 h-4 w-1/2 rounded bg-gray-100 dark:bg-gray-700/80" />
      </div>
    </div>

    <!-- Generic block skeleton -->
    <div v-else class="rounded-xl border border-gray-200/80 bg-white p-6 dark:border-gray-700/60 dark:bg-gray-800/50">
      <div class="h-4 w-48 rounded bg-gray-200 dark:bg-gray-700" />
      <div class="mt-4 space-y-2">
        <div class="h-4 w-full rounded bg-gray-100 dark:bg-gray-700/80" />
        <div class="h-4 w-5/6 rounded bg-gray-100 dark:bg-gray-700/80" />
        <div class="h-4 w-4/6 rounded bg-gray-100 dark:bg-gray-700/80" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    variant?: 'kpi' | 'table' | 'cards' | 'block'
    rows?: number
    cardCount?: number
    class?: string
  }>(),
  { variant: 'block', rows: 5, cardCount: 6 }
)

const wrapperClass = computed(() => props.class ?? '')
</script>
