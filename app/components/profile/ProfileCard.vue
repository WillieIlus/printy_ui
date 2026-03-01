<template>
  <UCard>
    <div class="flex flex-col sm:flex-row items-start gap-4">
      <UAvatar :src="profile?.avatar ?? undefined" :alt="String(profile?.user)" size="xl" class="shrink-0" />
      <div class="min-w-0 flex-1">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Profile</h3>
        <p v-if="profile?.bio" class="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{{ profile.bio }}</p>
        <div v-if="profile?.phone || profile?.city" class="mt-2 flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400">
          <span v-if="profile?.phone" class="flex items-center gap-1"><UIcon name="i-lucide-phone" class="w-4 h-4" />{{ profile.phone }}</span>
          <span v-if="profile?.city" class="flex items-center gap-1"><UIcon name="i-lucide-map-pin" class="w-4 h-4" />{{ profile.city }}</span>
        </div>
        <slot name="actions" />
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { Profile } from '~/shared/types'
defineProps<{ profile: Profile | null }>()
</script>
