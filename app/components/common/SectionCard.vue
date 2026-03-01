<script setup lang="ts">
interface Props {
  title?: string
  description?: string
}

withDefaults(defineProps<Props>(), {
  title: undefined,
  description: undefined,
})
</script>

<template>
  <div
    class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900"
  >
    <div
      v-if="title || $slots.header"
      class="border-b border-gray-200 px-4 py-4 dark:border-gray-700 sm:px-6"
    >
      <slot name="header">
        <h2 v-if="title" class="text-base font-semibold text-gray-900 dark:text-white">
          {{ title }}
        </h2>
        <p
          v-if="description"
          class="mt-1 text-sm text-gray-500 dark:text-gray-400"
        >
          {{ description }}
        </p>
      </slot>
    </div>
    <div class="p-4 sm:p-6">
      <slot />
    </div>
  </div>
</template>
