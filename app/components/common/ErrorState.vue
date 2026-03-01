<script setup lang="ts">
interface Props {
  title?: string
  message?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Something went wrong',
  message: 'We couldn\'t load this content. Please try again.',
})
</script>

<template>
  <div
    class="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900/50 dark:bg-red-950/30"
  >
    <UIcon
      name="i-lucide-alert-circle"
      class="h-12 w-12 shrink-0 text-red-500 dark:text-red-400"
    />
    <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">
      {{ title }}
    </h3>
    <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
      {{ message }}
    </p>
    <div v-if="$slots.default" class="mt-6">
      <slot />
    </div>
  </div>
</template>
