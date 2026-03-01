<template>
  <UCard>
    <template #header>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Team members</h3>
    </template>
    <div v-if="members?.length" class="space-y-3">
      <div v-for="m in members" :key="m.id" class="flex items-center justify-between rounded-lg border dark:border-gray-700 p-3">
        <div class="flex items-center gap-3">
          <UAvatar size="sm" />
          <div>
            <p class="font-medium text-gray-900 dark:text-white">{{ m.user_details?.first_name ?? `User #${m.user}` }}</p>
            <UBadge size="sm" variant="soft">{{ m.role }}</UBadge>
          </div>
        </div>
        <slot name="actions" :member="m" />
      </div>
    </div>
    <p v-else class="text-sm text-gray-500 dark:text-gray-400">No members yet.</p>
  </UCard>
</template>

<script setup lang="ts">
import type { ShopMember } from '~/shared/types'
defineProps<{ members?: ShopMember[] }>()
</script>
