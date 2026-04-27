<!-- Purpose: Shop setup page shell. -->
<template>
  <DashboardShell sidebar-tone="dark">
    <template #sidebar>
      <ShopSidebarNav />
    </template>

    <div class="space-y-6">
      <DashboardTopBar
        eyebrow="Print shop"
        title="Setup"
        description="Reserved for shop onboarding progress, profile readiness, and guardrails."
        action-label="Continue setup"
      />
      <DashboardEmptyState
        title="Setup workspace shell"
        description="This page will hold progress steps, completion checks, and profile requirements."
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
