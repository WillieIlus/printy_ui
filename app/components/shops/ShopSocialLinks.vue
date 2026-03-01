<template>
  <UCard>
    <template #header>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Social links</h3>
    </template>
    <div v-if="links?.length" class="space-y-2">
      <a v-for="link in links" :key="link.id" :href="link.url" target="_blank" rel="noopener" class="flex items-center gap-2 rounded-lg border dark:border-gray-700 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
        <UIcon name="i-lucide-link" class="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0" />
        <span class="font-medium text-gray-900 dark:text-white">{{ link.platform }}</span>
        <span class="text-sm text-gray-500 dark:text-gray-400 truncate flex-1">{{ link.url }}</span>
      </a>
    </div>
    <p v-else class="text-sm text-gray-500 dark:text-gray-400">No social links.</p>
    <slot />
  </UCard>
</template>

<script setup lang="ts">
import type { SocialLink } from '~/shared/types'
defineProps<{ links?: SocialLink[] }>()
</script>
