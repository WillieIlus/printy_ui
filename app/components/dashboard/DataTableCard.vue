<template>
  <DashboardSectionCard :title="title" :col-span="12">
    <template v-if="$slots.toolbar" #card-header>
      <div class="flex flex-wrap items-center justify-between gap-3">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
          {{ title }}
        </h3>
        <div class="flex items-center gap-2">
          <slot name="toolbar" />
        </div>
      </div>
    </template>
    <template v-else-if="title" #card-header>
      <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
        {{ title }}
      </h3>
    </template>

    <div class="overflow-x-auto -mx-5 -mt-5">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="sticky top-0 z-10 bg-gray-50 dark:bg-gray-800/95">
          <slot name="thead" />
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <slot name="tbody" />
        </tbody>
      </table>
    </div>

    <div
      v-if="$slots.pagination"
      class="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-4 dark:border-gray-700/60"
    >
      <slot name="pagination" />
    </div>
  </DashboardSectionCard>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>
