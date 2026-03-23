<template>
  <DashboardSectionCard title="IP Address Activity" :col-span="12">
    <div v-if="data?.ip_addresses?.results?.length" class="space-y-4">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-[var(--p-border)] text-sm">
          <thead>
            <tr class="text-left text-[var(--p-text-muted)]">
              <th class="px-3 py-3 font-medium">IP</th>
              <th class="px-3 py-3 font-medium">Country</th>
              <th class="px-3 py-3 font-medium">City</th>
              <th class="px-3 py-3 font-medium">Region</th>
              <th class="px-3 py-3 font-medium">Events</th>
              <th class="px-3 py-3 font-medium">Last seen</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[var(--p-border)]">
            <tr v-for="item in data.ip_addresses.results" :key="`${item.ip_address}-${item.last_seen_at}`">
              <td class="px-3 py-3 text-[var(--p-text)]">{{ item.ip_address || 'Unknown' }}</td>
              <td class="px-3 py-3 text-[var(--p-text-dim)]">{{ item.country || 'Unknown' }}</td>
              <td class="px-3 py-3 text-[var(--p-text-dim)]">{{ item.city || 'Unknown' }}</td>
              <td class="px-3 py-3 text-[var(--p-text-dim)]">{{ item.region || 'Unknown' }}</td>
              <td class="px-3 py-3 text-[var(--p-text)]">{{ formatNumber(item.count) }}</td>
              <td class="px-3 py-3 text-[var(--p-text-dim)]">{{ formatDateTime(item.last_seen_at) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p class="text-sm text-[var(--p-text-muted)]">
          Showing {{ data.ip_addresses.results.length }} of {{ data.ip_addresses.count }} IP groups.
        </p>
        <div class="flex gap-2">
          <UButton color="neutral" variant="soft" :disabled="page <= 1 || loading" @click="emit('update:page', page - 1)">
            Previous
          </UButton>
          <UButton color="neutral" variant="soft" :disabled="!data.ip_addresses.next || loading" @click="emit('update:page', page + 1)">
            Next
          </UButton>
        </div>
      </div>
    </div>
    <div v-else-if="error" class="rounded-xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-8 text-center">
      <p class="text-sm font-medium text-[var(--p-text)]">Location analytics are unavailable.</p>
      <p class="mt-2 text-sm text-[var(--p-text-muted)]">{{ error }}</p>
      <UButton class="mt-4" color="neutral" variant="soft" @click="emit('retry')">
        Retry
      </UButton>
    </div>
    <div v-else class="rounded-xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-8 text-center text-sm text-[var(--p-text-muted)]">
      No IP activity has been grouped yet.
    </div>
  </DashboardSectionCard>
</template>

<script setup lang="ts">
import type { AnalyticsLocationsResponse } from '~/services/adminAnalytics'

defineProps<{
  data: AnalyticsLocationsResponse | null
  page: number
  loading?: boolean
  error?: string | null
}>()

const emit = defineEmits<{
  'update:page': [value: number]
  retry: []
}>()

const numberFormatter = new Intl.NumberFormat('en-US')

function formatNumber(value: number) {
  return numberFormatter.format(value)
}

function formatDateTime(value: string | null) {
  if (!value) return 'Unknown'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString()
}
</script>
