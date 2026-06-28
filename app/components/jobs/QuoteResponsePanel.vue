<template>
  <DashboardDetailPanel :title="title" :subtitle="subtitle" padding="none">
    <template v-if="$slots.actions" #actions>
      <slot name="actions" />
    </template>
    <slot />
    <BaseAlert v-if="error" variant="error" :message="error" class="mx-6 mb-6" />
  </DashboardDetailPanel>
</template>

<script setup lang="ts">
import BaseAlert from '~/components/base/BaseAlert.vue'
import DashboardDetailPanel from '~/components/dashboard/DashboardDetailPanel.vue'

withDefaults(defineProps<{
  title?: string
  subtitle?: string
  error?: string
}>(), {
  title: '',
  subtitle: '',
  error: '',
})
</script>
