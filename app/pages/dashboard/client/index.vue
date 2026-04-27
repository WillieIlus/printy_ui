<template>
  <DashboardShell sidebar-tone="light">
    <template #sidebar>
      <ClientSidebarNav />
    </template>

    <div class="space-y-6">
      <DashboardTopBar
        eyebrow="Client"
        title="Overview"
        description="Track your print requests, shop replies, and saved drafts."
        action-label="Start new request"
      />
      <ClientOverviewHeader />
      <ClientStatGrid />
      <ClientDraftRecoveryPanel />
      <div class="grid gap-6 xl:grid-cols-[1.5fr_0.5fr]">
        <ClientRequestInbox />
        <ClientQuickActions />
      </div>
      <ClientWhatsappStrip />
    </div>
  </DashboardShell>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
})

import ClientOverviewHeader from '~/components/dashboard/client/ClientOverviewHeader.vue'
import ClientDraftRecoveryPanel from '~/components/dashboard/client/ClientDraftRecoveryPanel.vue'
import ClientQuickActions from '~/components/dashboard/client/ClientQuickActions.vue'
import ClientRequestInbox from '~/components/dashboard/client/ClientRequestInbox.vue'
import ClientSidebarNav from '~/components/dashboard/client/ClientSidebarNav.vue'
import ClientStatGrid from '~/components/dashboard/client/ClientStatGrid.vue'
import ClientWhatsappStrip from '~/components/dashboard/client/ClientWhatsappStrip.vue'
import DashboardShell from '~/components/dashboard/shared/DashboardShell.vue'
import DashboardTopBar from '~/components/dashboard/shared/DashboardTopBar.vue'
</script>
