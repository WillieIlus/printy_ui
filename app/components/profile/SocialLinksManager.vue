<template>
  <UCard>
    <template #header>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Social links</h3>
    </template>
    <div v-if="links?.length" class="space-y-3">
      <div v-for="link in links" :key="link.id" class="flex items-center justify-between rounded-lg border dark:border-gray-700 p-3">
        <div class="flex items-center gap-3">
          <UIcon :name="platformIcon(link.platform)" class="w-5 h-5 text-gray-600 dark:text-gray-400 shrink-0" />
          <div>
            <p class="font-medium text-gray-900 dark:text-white capitalize">{{ link.platform }}</p>
            <a :href="link.url" target="_blank" rel="noopener" class="text-sm text-primary-600 dark:text-primary-400 truncate block max-w-[200px]">{{ link.url }}</a>
          </div>
        </div>
        <UButton variant="ghost" color="error" size="sm" icon="i-lucide-trash-2" aria-label="Remove" @click="$emit('remove', link!.id)" />
      </div>
    </div>
    <p v-else class="text-sm text-gray-500 dark:text-gray-400 py-2">No social links added.</p>
    <template #footer>
      <slot name="add-button" />
    </template>
  </UCard>
</template>

<script setup lang="ts">
import type { SocialLink } from '~/shared/types'

const PLATFORM_ICONS: Record<string, string> = {
  facebook: 'i-simple-icons-facebook',
  twitter: 'i-simple-icons-x',
  instagram: 'i-simple-icons-instagram',
  linkedin: 'i-simple-icons-linkedin',
  youtube: 'i-simple-icons-youtube',
  tiktok: 'i-simple-icons-tiktok',
  pinterest: 'i-simple-icons-pinterest',
  website: 'i-lucide-globe',
}

defineProps<{ links?: SocialLink[] }>()
defineEmits<{ remove: [id: number] }>()

function platformIcon(platform: string): string {
  return PLATFORM_ICONS[platform.toLowerCase()] ?? 'i-lucide-link'
}
</script>
