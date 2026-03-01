<script setup lang="ts">
interface Props {
  title: string
  description?: string
  icon?: string
}

withDefaults(defineProps<Props>(), {
  icon: 'i-lucide-inbox',
})
</script>

<template>
  <div class="empty-state rounded-xl border border-gray-200/60 bg-white p-8 text-center dark:border-gray-800/60 dark:bg-gray-900/50">
    <div class="flex justify-center">
      <UIcon :name="icon" class="w-14 h-14 text-gray-300 dark:text-gray-600" />
    </div>
    <h3 class="mt-4 text-base font-medium text-gray-900 dark:text-white">{{ title }}</h3>
    <p v-if="description" class="mt-2 text-sm text-muted">{{ description }}</p>
    <div v-if="$slots.default" class="mt-6">
      <slot />
    </div>
  </div>
</template>
