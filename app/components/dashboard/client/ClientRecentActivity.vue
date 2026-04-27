<!-- Purpose: Client dashboard recent activity list. -->
<template>
  <DashboardSectionCard title="Recent activity" description="A simple timeline of quote and file actions.">
    <div class="space-y-4">
      <div
        v-for="item in items"
        :key="item.title"
        class="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4"
      >
        <div class="space-y-1">
          <p class="text-sm font-semibold text-slate-900">{{ item.title }}</p>
          <p class="text-sm text-slate-500">{{ item.description }}</p>
        </div>
        <span class="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">{{ item.time }}</span>
      </div>
    </div>
  </DashboardSectionCard>
</template>

<script setup lang="ts">
import DashboardSectionCard from '~/components/dashboard/shared/DashboardSectionCard.vue'

const items = [
  { title: 'Brochure request sent to 5 shops', description: 'A4, 500 copies, matte finish.', time: '10m ago' },
  { title: 'Draft updated', description: 'Business card quantity changed to 1,000 units.', time: '2h ago' },
  { title: 'Artwork uploaded', description: 'Poster design PDF attached for print readiness review.', time: 'Yesterday' },
]
</script>
