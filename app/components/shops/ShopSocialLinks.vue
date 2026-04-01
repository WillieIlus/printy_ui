<template>
  <UCard>
    <template #header>
      <h3 class="text-lg font-semibold text-[var(--p-text)]">Social links</h3>
    </template>
    <div v-if="links?.length" class="space-y-2">
      <a
        v-for="link in links"
        :key="link.id"
        :href="link.url"
        target="_blank"
        rel="noopener"
        class="flex items-center gap-3 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-container-low)] p-3 transition-colors hover:bg-[var(--p-surface-container)]"
      >
        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-500)]/10 text-[var(--color-primary-700)]">
          <UIcon :name="platformIcon(link.platform)" class="h-4 w-4" />
        </div>
        <div class="min-w-0 flex-1">
          <div class="font-medium capitalize text-[var(--p-text)]">{{ formatPlatform(link.platform) }}</div>
          <div class="truncate text-sm text-[var(--p-text-muted)]">{{ link.url }}</div>
        </div>
        <UIcon name="i-lucide-arrow-up-right" class="h-4 w-4 shrink-0 text-[var(--p-text-muted)]" />
      </a>
    </div>
    <p v-else class="text-sm text-[var(--p-text-muted)]">No social links.</p>
    <slot />
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

function platformIcon(platform: string): string {
  return PLATFORM_ICONS[platform.toLowerCase()] ?? 'i-lucide-link'
}

function formatPlatform(platform: string): string {
  return platform.replace(/[-_]/g, ' ').trim()
}
</script>
