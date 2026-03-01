<template>
  <div
    class="flex flex-col items-center justify-center rounded-xl border border-gray-200/80 bg-white px-8 py-12 text-center dark:border-gray-700/60 dark:bg-gray-900"
  >
    <div
      class="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-700/50"
    >
      <UIcon :name="icon" class="h-7 w-7 text-gray-400 dark:text-gray-500" />
    </div>
    <h3 class="mt-4 text-base font-medium text-gray-900 dark:text-white">
      {{ title }}
    </h3>
    <p v-if="description" class="mt-2 max-w-sm text-sm text-gray-500 dark:text-gray-400">
      {{ description }}
    </p>
    <div v-if="$slots.default" class="mt-6">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    description?: string
    icon?: string
  }>(),
  { icon: 'i-lucide-inbox' }
)
</script>
