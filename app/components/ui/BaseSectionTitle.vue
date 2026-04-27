<!-- Purpose: Shared section heading block with eyebrow, title, and support text. -->
<template>
  <div class="space-y-3">
    <BaseBadge v-if="eyebrow" tone="primary">
      {{ eyebrow }}
    </BaseBadge>
    <div class="space-y-2">
      <h2 class="text-2xl font-semibold tracking-tight text-[var(--p-text)] md:text-3xl">
        {{ title }}
      </h2>
      <p v-if="description" class="max-w-2xl text-sm text-[var(--p-text-muted)] md:text-base">
        {{ description }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseBadge from '~/components/ui/BaseBadge.vue'

defineProps<{
  eyebrow?: string
  title: string
  description?: string
}>()
</script>
