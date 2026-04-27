<!-- Purpose: Shop profile page shell. -->
<template>
  <DashboardShell sidebar-tone="dark">
    <template #sidebar>
      <ShopSidebarNav />
    </template>

    <div class="space-y-6">
      <DashboardTopBar
        eyebrow="Print shop"
        title="Profile"
        description="Reserved for public-facing business details, contact info, and profile copy."
        action-label="Save profile"
      />
      <DashboardEmptyState
        title="Profile workspace shell"
        description="This page will hold shop identity, service area, and business profile settings."
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
