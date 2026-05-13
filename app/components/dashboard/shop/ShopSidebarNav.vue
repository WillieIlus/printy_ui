<!-- Purpose: Left navigation for print shop dashboard routes. -->
<template>
  <div class="space-y-6">
    <div class="space-y-2">
      <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Production workspace</p>
      <h2 class="text-2xl font-semibold tracking-tight text-white">Printy Production</h2>
      <p class="text-sm text-slate-300">Manage assignments, production readiness, pricing, and proof flow.</p>
    </div>
    <nav class="space-y-2">
      <NuxtLink
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        class="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10"
        active-class="bg-white/12 text-white ring-1 ring-white/10"
      >
        <span class="flex items-center justify-between gap-3">
          <span>{{ item.label }}</span>
          <span
            v-if="item.badge"
            class="rounded-full bg-white px-2 py-0.5 text-[11px] font-bold text-slate-950"
          >
            {{ item.badge }}
          </span>
        </span>
      </NuxtLink>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useQuoteMessagesStore } from '~/stores/quoteMessages'
import { useWorkflowSpineStore } from '~/stores/workflowSpine'

const quoteMessagesStore = useQuoteMessagesStore()
const workflowStore = useWorkflowSpineStore()
const { shopUnreadCount } = storeToRefs(quoteMessagesStore)
const { shopAssignments } = storeToRefs(workflowStore)

onMounted(() => {
  if (!quoteMessagesStore.shopInbox.length && !quoteMessagesStore.loading) {
    void quoteMessagesStore.fetchShopMessages().catch(() => {})
  }
  if (!shopAssignments.value.length && !workflowStore.loading) {
    void workflowStore.fetchShopAssignments().catch(() => {})
  }
})

const items = computed(() => [
  { label: 'Overview', to: '/dashboard/shop' },
  { label: 'Assignments', to: '/dashboard/shop/assignments', badge: shopAssignments.value.length || null },
  { label: 'Quote Intake', to: '/dashboard/shop/requests' },
  { label: 'Calculator', to: '/dashboard/shop/calculator' },
  { label: 'Messages', to: '/dashboard/shop/messages', badge: shopUnreadCount.value || null },
  { label: 'Setup', to: '/dashboard/shop/setup' },
  { label: 'Pricing', to: '/dashboard/shop/pricing' },
  { label: 'Materials', to: '/dashboard/shop/materials' },
  { label: 'Finishing', to: '/dashboard/shop/finishing' },
  { label: 'Products', to: '/dashboard/shop/products' },
  { label: 'Profile', to: '/dashboard/shop/profile' },
])
</script>
