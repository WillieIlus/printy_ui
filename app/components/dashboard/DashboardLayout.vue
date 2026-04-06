<template>
  <div class="dashboard-layout min-h-full overflow-x-hidden bg-[var(--p-bg)]">
    <div class="mx-auto max-w-7xl overflow-x-hidden px-4 py-6">
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
      <div class="grid grid-cols-12 gap-4 overflow-x-hidden lg:gap-6">
        <slot />
      </div>
    </div>
  </div>
</template>
