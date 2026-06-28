<template>
  <UiCard class="border-slate-900/10 bg-white">
    <p class="text-sm font-semibold uppercase tracking-[0.2em] text-[#e13515]">{{ eyebrow }}</p>
    <h1 class="mt-4 text-3xl font-black tracking-tight text-slate-950">{{ title }}</h1>
    <p v-if="description" class="mt-3 text-sm leading-6 text-slate-600">{{ description }}</p>
    <div class="mt-6">
      <slot />
    </div>
  </UiCard>
</template>

<script setup lang="ts">
import UiCard from '~/components/ui/UiCard.vue'

defineProps<{
  eyebrow: string
  title: string
  description?: string
}>()
</script>
