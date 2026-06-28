<template>
  <LayoutDashboardSidebar tone="dark" class="w-72 text-slate-200">
    <div class="border-b border-white/10 px-5 py-5">
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-[#f7a37a]">Printy workspace</p>
      <p class="mt-2 text-lg font-black text-white">Printy</p>
      <p class="mt-1 text-sm text-slate-400">{{ subtitle }}</p>
    </div>
    <nav class="flex-1 space-y-1 px-3 py-5">
      <NuxtLink
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        class="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition"
        :class="route.path === item.to ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'"
      >
        <span>{{ item.label }}</span>
        <span v-if="item.badge" class="rounded-full bg-primary-600 px-2 py-0.5 text-[10px] font-bold text-white">{{ item.badge }}</span>
      </NuxtLink>
    </nav>
    <div class="border-t border-white/10 p-4">
      <div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
        <p class="text-sm font-semibold text-white">Navigation sanity</p>
        <p class="mt-1 text-sm leading-6 text-slate-400">Primary routes stay visible here so pages do not collapse into isolated raw content.</p>
      </div>
    </div>
  </LayoutDashboardSidebar>
</template>

<script setup lang="ts">
import LayoutDashboardSidebar from '~/components/layout/DashboardSidebar.vue'

defineProps<{
  subtitle: string
  items: Array<{ label: string; to: string; badge?: string | number }>
}>()

const route = useRoute()
</script>
