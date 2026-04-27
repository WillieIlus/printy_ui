<!-- Purpose: Client account page shell. -->
<template>
  <DashboardShell sidebar-tone="light">
    <template #sidebar>
      <ClientSidebarNav />
    </template>

    <div class="space-y-6">
      <DashboardTopBar
        eyebrow="Client"
        title="Account"
        description="Basic profile and notification preferences surface."
        action-label="Save changes"
      />
      <DashboardEmptyState
        title="Account workspace shell"
        description="This page is reserved for account details, notification settings, and contact preferences."
      />
    </div>
  </DashboardShell>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
})

import ClientSidebarNav from '~/components/dashboard/client/ClientSidebarNav.vue'
import DashboardEmptyState from '~/components/dashboard/shared/DashboardEmptyState.vue'
import DashboardShell from '~/components/dashboard/shared/DashboardShell.vue'
import DashboardTopBar from '~/components/dashboard/shared/DashboardTopBar.vue'
</script>
