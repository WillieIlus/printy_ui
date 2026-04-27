<!-- Purpose: Client dashboard page layout – sidebar + topbar + scrollable content area. -->
<template>
  <div class="flex h-screen overflow-hidden bg-[var(--p-bg)]">
    <DashboardSidebar role="client">
      <template #user-menu><slot name="user-menu" /></template>
    </DashboardSidebar>

    <div class="flex flex-1 flex-col overflow-hidden">
      <DashboardTopBar :title="title">
        <template #start><slot name="topbar-start" /></template>
        <template #end><slot name="topbar-end" /></template>
        <template #avatar><slot name="avatar" /></template>
      </DashboardTopBar>

      <main class="flex-1 overflow-y-auto p-4 md:p-6">
        <div class="mx-auto max-w-5xl space-y-6">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import DashboardSidebar from '~/components/organisms/dashboard/DashboardSidebar.vue'
import DashboardTopBar from '~/components/organisms/dashboard/DashboardTopBar.vue'

withDefaults(defineProps<{
  title?: string
}>(), {
  title: 'Dashboard',
})
</script>
