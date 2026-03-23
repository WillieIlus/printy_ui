<template>
  <div class="space-y-6">
    <div>
      <p class="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--p-text-muted)]">Super Admin Analytics</p>
      <h1 class="mt-2 text-3xl font-semibold text-[var(--p-text)]">Error analytics</h1>
      <p class="mt-2 text-sm text-[var(--p-text-dim)]">Latest API/frontend failures and the paths or status codes producing the most noise.</p>
    </div>

    <UAlert v-if="errors.errorAnalytics" color="error" variant="soft" title="Errors unavailable" :description="errors.errorAnalytics" />

    <div class="grid gap-6 lg:grid-cols-3">
      <DashboardSectionCard title="By path" :col-span="12">
        <div class="space-y-3">
          <div v-for="item in data?.counts_by_path ?? []" :key="item.label" class="flex items-center justify-between gap-4 rounded-xl border border-[var(--p-border-dim)] p-3">
            <span class="truncate text-sm text-[var(--p-text)]">{{ item.label }}</span>
            <span class="text-sm font-medium text-[var(--p-text-muted)]">{{ item.count }}</span>
          </div>
        </div>
      </DashboardSectionCard>

      <DashboardSectionCard title="By status code" :col-span="12">
        <div class="space-y-3">
          <div v-for="item in data?.counts_by_status_code ?? []" :key="item.label" class="flex items-center justify-between gap-4 rounded-xl border border-[var(--p-border-dim)] p-3">
            <span class="text-sm text-[var(--p-text)]">{{ item.label }}</span>
            <span class="text-sm font-medium text-[var(--p-text-muted)]">{{ item.count }}</span>
          </div>
        </div>
      </DashboardSectionCard>

      <DashboardSectionCard title="By event type" :col-span="12">
        <div class="space-y-3">
          <div v-for="item in data?.counts_by_event_type ?? []" :key="item.label" class="flex items-center justify-between gap-4 rounded-xl border border-[var(--p-border-dim)] p-3">
            <span class="text-sm text-[var(--p-text)]">{{ item.label }}</span>
            <span class="text-sm font-medium text-[var(--p-text-muted)]">{{ item.count }}</span>
          </div>
        </div>
      </DashboardSectionCard>
    </div>

    <DashboardSectionCard title="Latest errors" :col-span="12">
      <div class="space-y-3">
        <div v-for="item in data?.latest_errors.results ?? []" :key="item.id" class="rounded-xl border border-[var(--p-border-dim)] p-4">
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div class="min-w-0">
              <p class="truncate text-sm font-medium text-[var(--p-text)]">{{ item.path || 'Unknown path' }}</p>
              <p class="mt-1 text-xs text-[var(--p-text-muted)]">{{ item.event_type }} | {{ item.status_code ?? 'unknown' }} | {{ formatDate(item.created_at) }}</p>
            </div>
            <UBadge color="error" variant="soft">{{ item.status_code ?? 'n/a' }}</UBadge>
          </div>
          <p class="mt-3 text-sm text-[var(--p-text-dim)]">{{ item.message || 'No error message captured.' }}</p>
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

const {
  errorAnalytics: data,
  errors,
  getErrorAnalytics,
} = useSuperAdminAnalytics()

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString()
}

async function load() {
  await getErrorAnalytics()
}

onMounted(async () => {
  await load()
})
</script>
