<template>
  <UiCard class="text-center">
    <p class="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">{{ eyebrow }}</p>
    <h3 class="mt-3 text-xl font-bold text-slate-950">{{ title }}</h3>
    <p class="mt-2 text-sm text-slate-600">{{ description }}</p>
    <div v-if="$slots.default" class="mt-5">
      <slot />
    </div>
  </UiCard>
</template>

<script setup lang="ts">
import UiCard from '~/components/ui/UiCard.vue'

defineProps<{
  eyebrow: string
  title: string
  description: string
}>()
</script>
