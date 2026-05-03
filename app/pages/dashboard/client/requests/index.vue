<template>
  <DashboardShell sidebar-tone="light">
    <template #sidebar>
      <ClientSidebarNav />
    </template>

    <div class="space-y-6">
      <DashboardTopBar
        eyebrow="Client"
        title="My Requests"
        description="Review sent requests, compare shop responses, and track status."
        action-label="Start new request"
      />
      <ClientRequestInbox />
    </div>
  </DashboardShell>
</template>

<script setup lang="ts">
import ClientRequestInbox from '~/components/dashboard/client/ClientRequestInbox.vue'
import ClientSidebarNav from '~/components/dashboard/client/ClientSidebarNav.vue'
import DashboardShell from '~/components/dashboard/shared/DashboardShell.vue'
import DashboardTopBar from '~/components/dashboard/shared/DashboardTopBar.vue'

definePageMeta({
  layout: 'dashboard',
})
</script>
