<template>
  <DashboardStatusBadge :status="value || undefined" :domain="domain" :label="label" :dot="false" />
</template>

<script setup lang="ts">
import { printyStatusLabel, type PrintyStatusDomain } from '~/constants/design'
import DashboardStatusBadge from '~/components/dashboard/StatusBadge.vue'

const props = withDefaults(defineProps<{
  value?: string | null
  domain?: PrintyStatusDomain
}>(), {
  domain: 'generic',
})

const label = computed(() => printyStatusLabel(props.value || undefined, props.domain))
</script>
