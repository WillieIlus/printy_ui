<!-- Purpose: Client files page shell. -->
<template>
  <DashboardShell sidebar-tone="light">
    <template #sidebar>
      <ClientSidebarNav />
    </template>

    <div class="space-y-6">
      <DashboardTopBar
        eyebrow="Client"
        title="Files"
        description="Manage uploaded artwork and supporting print assets."
        action-label="Upload file"
      />
      <DashboardEmptyState
        title="Files workspace shell"
        description="This page is reserved for upload lists, previews, and reuse across requests."
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
