<!-- Purpose: Shop-owner dashboard layout – sidebar (shop role) + topbar + content area with optional setup progress. -->
<template>
  <div class="flex h-screen overflow-hidden bg-[var(--p-bg)]">
    <DashboardSidebar role="shop">
      <template #user-menu><slot name="user-menu" /></template>
    </DashboardSidebar>

    <div class="flex flex-1 flex-col overflow-hidden">
      <DashboardTopBar :title="title">
        <template #start><slot name="topbar-start" /></template>
        <template #end><slot name="topbar-end" /></template>
        <template #avatar><slot name="avatar" /></template>
      </DashboardTopBar>

      <main class="flex-1 overflow-y-auto p-4 md:p-6">
        <div class="mx-auto max-w-6xl space-y-6">
          <ShopSetupProgress v-if="showSetup" :steps="setupSteps" />
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import DashboardSidebar from '~/components/organisms/dashboard/DashboardSidebar.vue'
import DashboardTopBar from '~/components/organisms/dashboard/DashboardTopBar.vue'
import ShopSetupProgress from '~/components/organisms/dashboard/ShopSetupProgress.vue'

withDefaults(defineProps<{
  title?: string
  showSetup?: boolean
  setupSteps?: { id: string; label: string; done: boolean; href: string }[]
}>(), {
  title: 'Shop dashboard',
  showSetup: false,
})
</script>
