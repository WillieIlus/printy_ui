<template>
  <UCard>
    <template #header>
      <h3 class="text-lg font-semibold text-[var(--p-text)]">Team members</h3>
    </template>
    <div v-if="members?.length" class="space-y-3">
      <div v-for="m in members" :key="m.id" class="flex items-center justify-between rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-container-low)] p-3">
        <div class="flex items-center gap-3">
          <UAvatar size="sm" />
          <div>
            <p class="font-medium text-[var(--p-text)]">{{ m.user_details?.first_name ?? `User #${m.user}` }}</p>
            <UBadge size="sm" variant="soft">{{ m.role }}</UBadge>
          </div>
        </div>
        <slot name="actions" :member="m" />
      </div>
    </div>
    <p v-else class="text-sm text-[var(--p-text-muted)]">No members yet.</p>
  </UCard>
</template>

<script setup lang="ts">
import type { ShopMember } from '~/shared/types'
defineProps<{ members?: ShopMember[] }>()
</script>
