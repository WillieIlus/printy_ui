<template>
  <div class="overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-sm dark:border-gray-700/60 dark:bg-gray-900">
    <!-- Header -->
    <div class="border-b border-gray-100 px-5 py-4 dark:border-gray-700/60">
      <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Recent Activity</h3>
    </div>

    <!-- Content -->
    <div class="p-4">
      <div v-if="props.activities.length" class="space-y-2">
        <div
          v-for="(activity, i) in props.activities"
          :key="i"
          class="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3 transition-colors hover:bg-gray-100/50 dark:border-gray-800 dark:bg-gray-800/50 dark:hover:bg-gray-800"
        >
          <div
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ring-gray-200 dark:ring-gray-700"
          >
            <UIcon :name="activity.icon" class="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </div>
          <div class="min-w-0">
            <p class="text-sm font-medium text-gray-900 dark:text-white">{{ activity.title }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ activity.time }}</p>
          </div>
        </div>
      </div>
      <p v-else class="py-8 text-center text-sm text-gray-500 dark:text-gray-400">No recent activity</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    activities?: Array<{ title: string; time: string; icon: string }>
  }>(),
  { activities: () => [] }
)
</script>
