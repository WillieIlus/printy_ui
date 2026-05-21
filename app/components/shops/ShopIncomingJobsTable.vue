<template>
  <DataTableShell :columns="['Reference', 'Status', 'Payment', 'Due', 'Open']">
    <tr v-for="assignment in assignments" :key="assignment.id">
      <td class="px-4 py-4 text-sm font-semibold text-slate-900">{{ assignment.managed_reference || assignment.id }}</td>
      <td class="px-4 py-4"><StatusBadge :value="assignment.status" /></td>
      <td class="px-4 py-4"><StatusBadge :value="assignment.managed_job_payment_status" /></td>
      <td class="px-4 py-4 text-sm text-slate-600">{{ formatDate(assignment.due_at || assignment.requested_deadline) }}</td>
      <td class="px-4 py-4">
        <UiButton :to="`/shop/jobs/${assignment.managed_job}`" variant="secondary">View</UiButton>
      </td>
    </tr>
  </DataTableShell>
</template>

<script setup lang="ts">
import DataTableShell from '~/components/ui/DataTableShell.vue'
import StatusBadge from '~/components/ui/StatusBadge.vue'
import UiButton from '~/components/ui/UiButton.vue'

defineProps<{
  assignments: Array<Record<string, any>>
}>()

function formatDate(value?: string) {
  return value ? new Date(value).toLocaleDateString() : '-'
}
</script>
