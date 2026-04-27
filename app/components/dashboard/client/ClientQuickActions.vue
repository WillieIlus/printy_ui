<!-- Purpose: Client dashboard quick action shortcuts. -->
<template>
  <DashboardSectionCard title="Quick actions" description="Jump into your next step.">
    <div class="space-y-2">
      <BaseButton
        v-for="action in actions"
        :key="action.label"
        :to="action.to"
        variant="outline"
        size="sm"
        block
      >
        {{ action.label }}
      </BaseButton>
    </div>
  </DashboardSectionCard>
</template>

<script setup lang="ts">
import DashboardSectionCard from '~/components/dashboard/shared/DashboardSectionCard.vue'
import BaseButton from '~/components/ui/BaseButton.vue'

const actions = [
  { label: 'Start new request', to: '/' },
  { label: 'Upload artwork', to: '/dashboard/client/files' },
  { label: 'Continue saved draft', to: '/dashboard/client/drafts' },
]
</script>
