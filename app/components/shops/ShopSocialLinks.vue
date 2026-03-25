<template>
  <UCard>
    <template #header>
      <h3 class="text-lg font-semibold text-[var(--p-text)]">Social links</h3>
    </template>
    <div v-if="links?.length" class="space-y-2">
      <a v-for="link in links" :key="link.id" :href="link.url" target="_blank" rel="noopener" class="flex items-center gap-2 rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-container-low)] p-3 transition-colors hover:bg-[var(--p-surface-container)]">
        <UIcon name="i-lucide-link" class="h-4 w-4 shrink-0 text-[var(--p-text-muted)]" />
        <span class="font-medium text-[var(--p-text)]">{{ link.platform }}</span>
        <span class="flex-1 truncate text-sm text-[var(--p-text-muted)]">{{ link.url }}</span>
      </a>
    </div>
    <p v-else class="text-sm text-[var(--p-text-muted)]">No social links.</p>
    <slot />
  </UCard>
</template>

<script setup lang="ts">
import type { SocialLink } from '~/shared/types'
defineProps<{ links?: SocialLink[] }>()
</script>
