<!-- Purpose: Shop products page shell. -->
<template>
  <DashboardShell sidebar-tone="dark">
    <template #sidebar>
      <ShopSidebarNav />
    </template>

    <div class="space-y-6">
      <DashboardTopBar
        eyebrow="Print shop"
        title="Products"
        description="Reserved for public product catalog management."
        action-label="Add product"
      />
      <DashboardEmptyState
        title="Products workspace shell"
        description="This page will hold shop product cards, status, and public visibility controls."
      />
    </div>
  </DashboardShell>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
})

import ShopSidebarNav from '~/components/dashboard/shop/ShopSidebarNav.vue'
import DashboardEmptyState from '~/components/dashboard/shared/DashboardEmptyState.vue'
import DashboardShell from '~/components/dashboard/shared/DashboardShell.vue'
import DashboardTopBar from '~/components/dashboard/shared/DashboardTopBar.vue'
</script>
