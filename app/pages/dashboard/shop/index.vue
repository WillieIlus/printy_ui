<!-- Purpose: Shop dashboard overview page assembled from restored operational components. -->
<template>
  <DashboardShell sidebar-tone="dark">
    <template #sidebar>
      <ShopSidebarNav />
    </template>

    <div class="space-y-6">
      <DashboardTopBar
        eyebrow="Print shop"
        title="Overview"
        description="A darker operational workspace for requests, setup readiness, performance, and follow-ups."
        action-label="Review requests"
      />
      <ShopOverviewHeader />
      <ShopStatGrid />
      <div class="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <ShopRecentRequests />
        <div class="space-y-6">
          <ShopSetupProgress />
          <ShopTipsCard />
        </div>
      </div>
      <ShopPerformanceCard />
      <ShopWhatsappStrip />
    </div>
  </DashboardShell>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
})

import { useSetupStatus } from '~/composables/useSetupStatus'
import { useShopStore } from '~/stores/shop'
import ShopOverviewHeader from '~/components/dashboard/shop/ShopOverviewHeader.vue'
import ShopPerformanceCard from '~/components/dashboard/shop/ShopPerformanceCard.vue'
import ShopRecentRequests from '~/components/dashboard/shop/ShopRecentRequests.vue'
import ShopSetupProgress from '~/components/dashboard/shop/ShopSetupProgress.vue'
import ShopSidebarNav from '~/components/dashboard/shop/ShopSidebarNav.vue'
import ShopStatGrid from '~/components/dashboard/shop/ShopStatGrid.vue'
import ShopTipsCard from '~/components/dashboard/shop/ShopTipsCard.vue'
import ShopWhatsappStrip from '~/components/dashboard/shop/ShopWhatsappStrip.vue'
import DashboardShell from '~/components/dashboard/shared/DashboardShell.vue'
import DashboardTopBar from '~/components/dashboard/shared/DashboardTopBar.vue'

const shopStore = useShopStore()
const { refresh } = useSetupStatus()
const shopSlug = computed(() => shopStore.selectedShopSlug ?? null)

onMounted(async () => {
  const activeShop = await shopStore.ensureActiveShop(shopSlug.value)
  await refresh(activeShop?.slug ?? shopSlug.value).catch(() => undefined)
})

watch(shopSlug, (slug) => {
  if (!slug) return
  refresh(slug).catch(() => undefined)
})
</script>
