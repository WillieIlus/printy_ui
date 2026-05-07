<template>
  <DashboardShell sidebar-tone="dark">
    <template #sidebar>
      <ShopSidebarNav />
    </template>

    <div class="space-y-6">
      <DashboardTopBar
        eyebrow="Print shop"
        title="Quick Quote Calculator"
        description="Calculate job costs instantly using your saved rate card, paper prices, and finishing rates."
      />

      <DashboardCalculatorCard />
    </div>
  </DashboardShell>
</template>

<script setup lang="ts">
import DashboardShell from '~/components/dashboard/shared/DashboardShell.vue'
import DashboardTopBar from '~/components/dashboard/shared/DashboardTopBar.vue'
import ShopSidebarNav from '~/components/dashboard/shop/ShopSidebarNav.vue'
import DashboardCalculatorCard from '~/components/dashboard/calculator/DashboardCalculatorCard.vue'

definePageMeta({ layout: 'dashboard' })
</script>
