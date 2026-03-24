<template>
  <DashboardSectionCard :title="title" :col-span="12">
    <template v-if="$slots.toolbar" #card-header>
      <div class="flex flex-wrap items-center justify-between gap-3">
        <h3 class="text-sm font-semibold text-[var(--p-text-dim)]">
          {{ title }}
        </h3>
        <div class="flex items-center gap-2">
          <slot name="toolbar" />
        </div>
      </div>
    </template>
    <template v-else-if="title" #card-header>
      <h3 class="text-sm font-semibold text-[var(--p-text-dim)]">
        {{ title }}
      </h3>
    </template>

    <div class="overflow-x-auto -mx-5 -mt-5">
      <table class="min-w-full divide-y divide-[var(--p-border)]">
        <thead class="sticky top-0 z-10 bg-[var(--p-surface-sunken)]">
          <slot name="thead" />
        </thead>
        <tbody class="divide-y divide-[var(--p-border)]">
          <slot name="tbody" />
        </tbody>
      </table>
    </div>

    <div
      v-if="$slots.pagination"
      class="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--p-border-dim)] pt-4"
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
