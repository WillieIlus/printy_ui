<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 p-6">
    <div class="max-w-md w-full text-center">
      <div class="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 mb-6">
        <UIcon name="i-lucide-alert-circle" class="w-8 h-8" />
      </div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Something went wrong
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        {{ error?.message ?? 'An unexpected error occurred.' }}
      </p>
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <UButton color="primary" size="lg" @click="handleRetry">
          Try again
        </UButton>
        <UButton to="/" variant="outline" size="lg">
          Go home
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const error = useError()

function handleRetry() {
  clearError({ redirect: '/' })
}
</script>
