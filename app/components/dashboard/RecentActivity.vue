<template>
  <div class="overflow-hidden rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] shadow-sm">
    <div class="border-b border-[var(--p-border-dim)] px-5 py-4">
      <h3 class="text-sm font-medium text-[var(--p-text-muted)]">Recent Activity</h3>
    </div>
    <div class="p-4">
      <div v-if="props.activities.length" class="space-y-2">
        <div
          v-for="(activity, i) in props.activities"
          :key="i"
          class="flex items-start gap-3 rounded-xl border border-[var(--p-border-dim)] bg-[var(--p-surface-sunken)] dark:bg-[var(--p-surface-raised)] p-3 transition-colors hover:bg-gray-100/50 dark:hover:bg-gray-800"
        >
          <div
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ring-[var(--p-border)]"
          >
            <UIcon :name="activity.icon" class="h-4 w-4 text-[var(--p-text-dim)]" />
          </div>
          <div class="min-w-0">
            <p class="text-sm font-medium text-[var(--p-text)]">{{ activity.title }}</p>
            <p class="text-xs text-[var(--p-text-muted)]">{{ activity.time }}</p>
          </div>
        </div>
      </div>
      <p v-else class="py-8 text-center text-sm text-[var(--p-text-muted)]">No recent activity</p>
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
