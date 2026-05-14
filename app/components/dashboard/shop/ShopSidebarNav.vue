<!-- Purpose: Left navigation for the production workspace with assignment-first priorities. -->
<template>
  <div class="flex h-full flex-col justify-between gap-6">
    <div class="space-y-6">
      <div class="space-y-2">
        <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Production workspace</p>
        <h2 class="text-2xl font-semibold tracking-tight text-white">Printy Production</h2>
        <p class="text-sm text-slate-300">Assignments, proofs, files, and payout readiness come first. Quote intake stays secondary.</p>
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

      <div class="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
        <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">Visibility guardrails</p>
        <p class="mt-3 text-sm leading-6 text-slate-300">
          Shops see production requirements, deadlines, assignment source, and payout. Direct unmanaged customer contact, partner margin, and client selling price stay out of this workspace.
        </p>
      </div>
    </div>
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
  { label: 'Files & Proofs', to: '/dashboard/shop/assignments#files' },
  { label: 'Payouts', to: '/dashboard/shop/assignments#payouts' },
  { label: 'Quote Opportunities', to: '/dashboard/shop/requests' },
  { label: 'Calculator', to: '/dashboard/shop/calculator' },
  { label: 'Support', to: '/dashboard/shop/messages', badge: shopUnreadCount.value || null },
  { label: 'Setup', to: '/dashboard/shop/setup' },
  { label: 'Pricing', to: '/dashboard/shop/pricing' },
  { label: 'Materials', to: '/dashboard/shop/materials' },
  { label: 'Finishing', to: '/dashboard/shop/finishing' },
  { label: 'Products', to: '/dashboard/shop/products' },
  { label: 'Profile', to: '/dashboard/shop/profile' },
])
</script>
