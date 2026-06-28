<template>
  <BaseCard variant="dashboard" padding="none" radius="xl" class="flex flex-col overflow-hidden">
    <div class="flex items-center justify-between border-b border-slate-100 px-5 py-4">
      <p class="text-base font-bold text-slate-900">{{ title }}</p>
      <button type="button" class="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-200">{{ actionLabel }}</button>
    </div>
    <div class="flex-1 divide-y divide-slate-100 overflow-y-auto">
      <button v-for="client in clients" :key="client.requestId" type="button" class="w-full px-5 py-4 text-left transition-colors hover:bg-slate-50" @click="$emit('select-client', client.requestId)">
        <div class="flex items-center gap-3">
          <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold" :class="client.avatarClass">{{ client.initials }}</div>
          <div class="min-w-0 flex-1">
            <div class="flex items-center justify-between gap-2">
              <p class="truncate text-sm font-bold text-slate-800">{{ client.name }}</p>
              <span class="rounded-full px-2 py-0.5 text-xs font-bold" :class="client.badgeClass">{{ client.badge }}</span>
            </div>
            <p class="mt-0.5 truncate text-xs text-slate-400">{{ client.subtitle }}</p>
          </div>
        </div>
      </button>
    </div>
    <div class="border-t border-slate-100 p-4">
      <button type="button" class="w-full py-1 text-center text-sm font-semibold text-slate-500 transition-colors hover:text-slate-800">+ Add new client</button>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from '~/components/base/BaseCard.vue'

interface ClientRow {
  requestId: number
  name: string
  initials: string
  subtitle: string
  badge: string
  badgeClass: string
  avatarClass: string
}

withDefaults(defineProps<{
  title?: string
  actionLabel?: string
  clients: ClientRow[]
}>(), {
  title: 'Clients',
  actionLabel: 'View all',
})

defineEmits<{
  'select-client': [requestId: number]
}>()
</script>
