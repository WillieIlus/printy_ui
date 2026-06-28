<template>
  <DataTableShell :columns="['Job', 'Status', 'Payment', 'Created']">
    <tr v-for="job in jobs" :key="job.id">
      <td class="px-4 py-4 text-sm font-semibold text-slate-900">{{ job.title || job.managed_reference }}</td>
      <td class="px-4 py-4"><StatusBadge :value="job.status" /></td>
      <td class="px-4 py-4"><StatusBadge :value="job.payment_status" /></td>
      <td class="px-4 py-4 text-sm text-slate-600">{{ formatDate(job.created_at) }}</td>
    </tr>
  </DataTableShell>
</template>

<script setup lang="ts">
import DataTableShell from '~/components/ui/DataTableShell.vue'
import StatusBadge from '~/components/ui/UiStatusBadge.vue'

defineProps<{
  jobs: Array<Record<string, any>>
}>()

function formatDate(value?: string) {
  return value ? new Date(value).toLocaleDateString() : '-'
}
</script>
