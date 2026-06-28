<template>
  <DataTableShell :columns="['Request', 'Status', 'Responses', 'Updated']">
    <tr v-for="request in requests" :key="request.id">
      <td class="px-4 py-4 text-sm font-semibold text-slate-900">
        <NuxtLink :to="`/quotes/${request.id}`" class="hover:text-primary-700">
          {{ request.request_reference || `Quote request #${request.id}` }}
        </NuxtLink>
      </td>
      <td class="px-4 py-4"><StatusBadge :value="request.status" /></td>
      <td class="px-4 py-4 text-sm text-slate-600">{{ request.responses_count ?? 0 }}</td>
      <td class="px-4 py-4 text-sm text-slate-600">{{ formatDate(request.updated_at) }}</td>
    </tr>
  </DataTableShell>
</template>

<script setup lang="ts">
import DataTableShell from '~/components/ui/DataTableShell.vue'
import StatusBadge from '~/components/ui/UiStatusBadge.vue'

defineProps<{
  requests: Array<Record<string, any>>
}>()

function formatDate(value?: string) {
  return value ? new Date(value).toLocaleDateString() : '-'
}
</script>
