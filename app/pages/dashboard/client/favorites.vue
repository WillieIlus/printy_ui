<!-- Purpose: Client favorites page shell. -->
<template>
  <DashboardShell sidebar-tone="light">
    <template #sidebar>
      <ClientSidebarNav />
    </template>

    <div class="space-y-6">
      <DashboardTopBar
        eyebrow="Client"
        title="Favorite shops"
        description="A clean shortlist of preferred print partners."
        action-label="Browse shops"
      />
      <DashboardEmptyState
        title="Favorites workspace shell"
        description="This page will hold bookmarked shops and quick comparison shortcuts."
        cta-label="Browse shops"
        cta-to="/shops"
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
