<!-- Purpose: Left navigation for client dashboard with icons and live response badge. -->
<template>
  <div class="flex h-full flex-col justify-between gap-6">
    <div class="space-y-6">
      <div class="space-y-1.5">
        <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Client space</p>
        <h2 class="text-2xl font-semibold tracking-tight text-slate-950">Printy</h2>
        <p class="text-sm text-slate-500">Track requests without the clutter.</p>
      </div>

      <nav class="space-y-1">
        <NuxtLink
          v-for="item in navItems"
          :key="item.label"
          :to="item.to"
          class="flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          active-class="bg-primary-50 text-primary-700 ring-1 ring-primary-100"
        >
          <Icon :name="item.icon" class="size-4 shrink-0 opacity-60" />
          <span class="flex-1">{{ item.label }}</span>
          <span
            v-if="item.badge"
            class="flex size-5 items-center justify-center rounded-full bg-[var(--p-primary)] text-[10px] font-bold text-white"
          >
            {{ item.badge > 9 ? '9+' : item.badge }}
          </span>
        </NuxtLink>
      </nav>
    </div>

    <div class="space-y-1 border-t border-slate-200 pt-4">
      <NuxtLink
        to="/dashboard/client/account"
        class="flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100"
        active-class="bg-primary-50 text-primary-700 ring-1 ring-primary-100"
      >
        <Icon name="lucide:settings" class="size-4 shrink-0 opacity-60" />
        <span>Account settings</span>
      </NuxtLink>
      <a
        href="/help"
        class="flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100"
      >
        <Icon name="lucide:life-buoy" class="size-4 shrink-0 opacity-60" />
        <span>Help & support</span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useQuoteInboxStore } from '~/stores/quoteInbox'

const store = useQuoteInboxStore()
const { clientRequests } = storeToRefs(store)

const responsesWaiting = computed(() =>
  clientRequests.value.filter(
    r => r.latest_response !== null
      && r.response_status !== 'accepted'
      && r.status !== 'accepted',
  ).length,
)

const navItems = computed(() => [
  { label: 'Overview', to: '/dashboard/client', icon: 'lucide:layout-dashboard', badge: 0 },
  { label: 'My Requests', to: '/dashboard/client/requests', icon: 'lucide:inbox', badge: 0 },
  { label: 'Saved Drafts', to: '/dashboard/client/drafts', icon: 'lucide:file-pen-line', badge: 0 },
  { label: 'Responses', to: '/dashboard/client/requests', icon: 'lucide:message-square', badge: responsesWaiting.value },
  { label: 'Files', to: '/dashboard/client/files', icon: 'lucide:paperclip', badge: 0 },
  { label: 'Favorite Shops', to: '/dashboard/client/favorites', icon: 'lucide:heart', badge: 0 },
])
</script>
