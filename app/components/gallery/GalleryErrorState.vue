<script setup lang="ts">
defineEmits<{
  (e: 'retry'): void
}>()
</script>

<template>
  <UCard
    class="overflow-hidden border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20"
    :ui="{
      root: 'ring-0',
      body: 'p-8 sm:p-10',
    }"
  >
    <div class="flex flex-col items-center text-center">
      <div
        class="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
      >
        <UIcon name="i-lucide-alert-circle" class="h-10 w-10" />
      </div>
      <h2 class="mt-6 text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
        Couldn't load templates
      </h2>
      <p class="mt-2 max-w-md text-base text-gray-600 dark:text-gray-400">
        Something went wrong. Please try again.
      </p>
      <UButton
        color="primary"
        variant="solid"
        size="lg"
        class="mt-8 rounded-xl"
        @click="$emit('retry')"
      >
        <UIcon name="i-lucide-refresh-cw" class="h-4 w-4 mr-2" />
        Try again
      </UButton>
    </div>
  </UCard>
</template>
