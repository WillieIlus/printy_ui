<!-- Purpose: Minimal empty state block for unfinished dashboard routes. -->
<template>
  <BaseCard tone="soft" class="space-y-3 border border-dashed !border-[var(--p-border-strong)] text-center">
    <p class="text-lg font-semibold text-[var(--p-text)]">{{ title }}</p>
    <p class="mx-auto max-w-md text-sm text-[var(--p-text-muted)]">{{ description }}</p>
    <BaseButton v-if="ctaLabel && ctaTo" :to="ctaTo" variant="dark" size="sm">
      {{ ctaLabel }}
    </BaseButton>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseCard from '~/components/ui/BaseCard.vue'

defineProps<{
  title: string
  description: string
  ctaLabel?: string
  ctaTo?: string
}>()
</script>
