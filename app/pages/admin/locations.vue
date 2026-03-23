<template>
  <div class="space-y-6">
    <div>
      <p class="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--p-text-muted)]">Super Admin Analytics</p>
      <h1 class="mt-2 text-3xl font-semibold text-[var(--p-text)]">Location breakdown</h1>
      <p class="mt-2 text-sm text-[var(--p-text-dim)]">Country, city, and paginated IP activity from the shared analytics stream.</p>
    </div>

    <UAlert v-if="errors.locationBreakdown" color="error" variant="soft" title="Locations unavailable" :description="errors.locationBreakdown" />

    <div class="grid gap-6 xl:grid-cols-2">
      <DashboardSectionCard title="Countries" :col-span="12">
        <div class="space-y-3">
          <div v-for="item in data?.countries ?? []" :key="item.label" class="flex items-center justify-between gap-4 rounded-xl border border-[var(--p-border-dim)] p-3">
            <span class="text-sm text-[var(--p-text)]">{{ item.label }}</span>
            <span class="text-sm font-medium text-[var(--p-text-muted)]">{{ item.count }}</span>
          </div>
        </div>
      </DashboardSectionCard>

      <DashboardSectionCard title="Cities" :col-span="12">
        <div class="space-y-3">
          <div v-for="item in data?.cities ?? []" :key="item.label" class="flex items-center justify-between gap-4 rounded-xl border border-[var(--p-border-dim)] p-3">
            <span class="text-sm text-[var(--p-text)]">{{ item.label }}</span>
            <span class="text-sm font-medium text-[var(--p-text-muted)]">{{ item.count }}</span>
          </div>
        </div>
      </DashboardSectionCard>
    </div>

    <DashboardSectionCard title="IP address activity" :col-span="12">
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
            <tr v-for="item in data?.ip_addresses.results ?? []" :key="`${item.ip_address}-${item.last_seen_at}`">
              <td class="px-3 py-3 text-[var(--p-text)]">{{ item.ip_address || 'Unknown' }}</td>
              <td class="px-3 py-3 text-[var(--p-text-dim)]">{{ item.country || 'Unknown' }}</td>
              <td class="px-3 py-3 text-[var(--p-text-dim)]">{{ item.city || 'Unknown' }}</td>
              <td class="px-3 py-3 text-[var(--p-text-dim)]">{{ item.region || 'Unknown' }}</td>
              <td class="px-3 py-3 text-[var(--p-text)]">{{ item.count }}</td>
              <td class="px-3 py-3 text-[var(--p-text-dim)]">{{ formatDate(item.last_seen_at) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-4 flex items-center justify-between gap-4">
        <p class="text-sm text-[var(--p-text-muted)]">Showing {{ data?.ip_addresses.results.length ?? 0 }} of {{ data?.ip_addresses.count ?? 0 }} IP groups.</p>
        <div class="flex gap-2">
          <UButton color="neutral" variant="soft" :disabled="page <= 1 || loading.locationBreakdown" @click="page -= 1">Previous</UButton>
          <UButton color="neutral" variant="soft" :disabled="!data?.ip_addresses.next || loading.locationBreakdown" @click="page += 1">Next</UButton>
        </div>
      </div>
    </DashboardSectionCard>
  </div>
</template>

<script setup lang="ts">
import { useSuperAdminAnalytics } from '~/composables/useSuperAdminAnalytics'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'super-admin'],
})

const page = ref(1)
const {
  locationBreakdown: data,
  loading,
  errors,
  getLocationBreakdown,
} = useSuperAdminAnalytics()

function formatDate(value: string | null) {
  if (!value) return 'Unknown'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString()
}

async function load() {
  await getLocationBreakdown({ page: page.value, page_size: 25 })
}

watch(page, async () => {
  await load()
})

onMounted(async () => {
  await load()
})
</script>
