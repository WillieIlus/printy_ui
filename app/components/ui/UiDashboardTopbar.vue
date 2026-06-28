<template>
  <LayoutDashboardTopbar tone="light">
    <div>
      <p class="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">{{ eyebrow }}</p>
      <h1 class="mt-1 text-2xl font-black tracking-tight text-slate-950">{{ title }}</h1>
    </div>
    <div v-if="$slots.actions" class="ml-auto flex items-center gap-3">
      <slot name="actions" />
    </div>
  </LayoutDashboardTopbar>
</template>

<script setup lang="ts">
import LayoutDashboardTopbar from '~/components/layout/DashboardTopbar.vue'

defineProps<{
  eyebrow: string
  title: string
}>()
</script>
