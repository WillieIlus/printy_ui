<template>
  <div class="col-span-12 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
    <div class="min-w-0 flex-1 space-y-1">
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">
        {{ title }}
      </h1>
      <p v-if="subtitle" class="text-sm text-gray-500 dark:text-gray-400">
        {{ subtitle }}
      </p>
      <div v-if="$slots.default" class="pt-1">
        <slot />
      </div>
    </div>
    <div v-if="$slots.actions" class="shrink-0 flex flex-wrap items-center gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>
