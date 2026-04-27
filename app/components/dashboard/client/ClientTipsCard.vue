<!-- Purpose: Client dashboard contextual tips block. -->
<template>
  <DashboardSectionCard title="Tips" description="Starter guidance for stronger quote requests." tone="muted">
    <ul class="space-y-3 text-sm text-slate-600">
      <li v-for="tip in tips" :key="tip" class="rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-200">
        {{ tip }}
      </li>
    </ul>
  </DashboardSectionCard>
</template>

<script setup lang="ts">
import DashboardSectionCard from '~/components/dashboard/shared/DashboardSectionCard.vue'

const tips = [
  'Attach the final artwork file when available to reduce back-and-forth.',
  'Keep quantity and finishing requirements precise for more comparable responses.',
  'Save multi-step requests as drafts when collecting stakeholder approvals.',
]
</script>
