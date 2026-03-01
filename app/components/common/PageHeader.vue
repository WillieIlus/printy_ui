<script setup lang="ts">
interface Props {
  title: string
  description?: string
  badge?: string
}

withDefaults(defineProps<Props>(), {
  description: undefined,
  badge: undefined,
})
</script>

<template>
  <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
    <div class="min-w-0 flex-1">
      <div class="flex flex-wrap items-center gap-2">
        <h1 class="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
          {{ title }}
        </h1>
        <UBadge
          v-if="badge"
          color="neutral"
          variant="soft"
          size="sm"
          class="shrink-0"
        >
          {{ badge }}
        </UBadge>
      </div>
      <p
        v-if="description"
        class="mt-1 text-sm text-gray-600 dark:text-gray-400"
      >
        {{ description }}
      </p>
    </div>
    <div v-if="$slots.actions" class="flex shrink-0 flex-wrap gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>
