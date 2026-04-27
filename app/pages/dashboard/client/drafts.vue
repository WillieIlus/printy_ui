<!-- Purpose: Client drafts page shell. -->
<template>
  <DashboardShell sidebar-tone="light">
    <template #sidebar>
      <ClientSidebarNav />
    </template>

    <div class="space-y-6">
      <DashboardTopBar
        eyebrow="Client"
        title="Drafts"
        description="A dedicated holding area for unfinished quote requests."
        action-label="Resume draft"
      />
      <ClientDraftRecoveryPanel />
    </div>
  </DashboardShell>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
})

import ClientSidebarNav from '~/components/dashboard/client/ClientSidebarNav.vue'
import ClientDraftRecoveryPanel from '~/components/dashboard/client/ClientDraftRecoveryPanel.vue'
import DashboardShell from '~/components/dashboard/shared/DashboardShell.vue'
import DashboardTopBar from '~/components/dashboard/shared/DashboardTopBar.vue'
</script>
