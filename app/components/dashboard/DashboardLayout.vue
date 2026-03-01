<template>
  <div class="dashboard-layout min-h-full">
    <div class="mx-auto max-w-7xl px-4 py-6">
      <!-- Header: title, subtitle, action slot, filters -->
      <div
        v-if="$slots.header || $slots.breadcrumbs"
        class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6"
      >
        <div class="min-w-0 flex-1">
          <div v-if="$slots.breadcrumbs" class="mb-2">
            <slot name="breadcrumbs" />
          </div>
          <slot name="header" />
        </div>
        <div v-if="$slots.actions" class="shrink-0 flex flex-wrap items-center gap-2">
          <slot name="actions" />
        </div>
      </div>
      <div v-if="$slots.filters" class="mb-4">
        <slot name="filters" />
      </div>

      <!-- Content: 12-col grid, gap-4 or gap-6 -->
      <div class="grid grid-cols-12 gap-4 lg:gap-6">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// DashboardLayout: enforces consistent max-width, padding, background, header pattern, and 12-col grid.
// Pages must never freestyle their own margins/paddings.
</script>

<style scoped>
.dashboard-layout {
  /* Subtle app surface - calmer than marketing pages, layered in dark mode */
  background-color: rgb(249 250 251 / 0.6); /* gray-50/60 */
}

:global(.dark) .dashboard-layout {
  /* Avoid pure black - use layered surface */
  background-color: rgb(17 24 39 / 0.4); /* gray-900/40 */
}
</style>
