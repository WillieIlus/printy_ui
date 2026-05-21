<template>
  <DashboardStatusBadge :status="value || undefined" :label="label" :dot="false" />
</template>

<script setup lang="ts">
import { printyStatusLabel } from '~/constants/design'
import DashboardStatusBadge from '~/components/dashboard/StatusBadge.vue'

const props = defineProps<{
  value?: string | null
}>()

const label = computed(() => printyStatusLabel(props.value || undefined))
</script>
