<template>
  <div class="space-y-6">
    <DashboardPageHeader
      title="Quote Files"
      subtitle="Grouped by customer or company, with shop-specific sections inside each file."
    >
      <template #actions>
        <UButton color="primary" to="/dashboard/quotes/create">
          <UIcon name="i-lucide-folder-plus" class="mr-2 h-4 w-4" />
          New Quote File
        </UButton>
      </template>
    </DashboardPageHeader>

    <CommonLoadingSpinner v-if="loading" />
    <div v-else-if="error" class="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
      <p class="text-sm text-red-700 dark:text-red-300">{{ error }}</p>
    </div>
    <div v-else-if="files.length" class="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
      <NuxtLink
        v-for="file in files"
        :key="file.id"
        :to="`/dashboard/quotes/files/${file.id}`"
        class="block rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5 transition-colors hover:border-flamingo-300 hover:bg-flamingo-50/30 dark:hover:border-flamingo-700 dark:hover:bg-flamingo-900/10"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <h2 class="truncate text-xl font-semibold text-[var(--p-text)]">
              {{ file.customer_name || file.company_name }}
            </h2>
            <p class="mt-1 text-sm text-[var(--p-text-muted)]">
              {{ file.shop_count }} shop{{ file.shop_count === 1 ? '' : 's' }} · {{ file.item_count }} item{{ file.item_count === 1 ? '' : 's' }}
            </p>
          </div>
          <UBadge :color="file.has_draft ? 'warning' : 'neutral'" variant="soft" size="xs">
            {{ file.has_draft ? 'Open Drafts' : 'Grouped' }}
          </UBadge>
        </div>

        <div class="mt-4 space-y-2">
          <p class="text-sm text-[var(--p-text-dim)]">
            <span class="font-medium text-[var(--p-text)]">Contact:</span>
            {{ file.contact_name || 'Not set' }}
          </p>
          <p class="text-sm text-[var(--p-text-dim)]">
            <span class="font-medium text-[var(--p-text)]">Email:</span>
            {{ file.contact_email || 'Not set' }}
          </p>
        </div>

        <div class="mt-5 flex items-center justify-between border-t border-[var(--p-border)] pt-4">
          <div>
            <p class="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Totals</p>
            <p class="mt-1 text-sm font-medium text-[var(--p-text)]">Kept inside each shop section</p>
          </div>
          <span class="text-sm font-semibold text-flamingo-600 dark:text-flamingo-400">Open file</span>
        </div>
      </NuxtLink>
    </div>
    <DashboardEmptyState
      v-else
      title="No quote files yet"
      description="Start a grouped quote file for a customer or company, then attach shop-specific quote sections inside it."
      icon="i-lucide-folder-open"
    >
      <UButton to="/dashboard/quotes/create" color="primary">New Quote File</UButton>
    </DashboardEmptyState>
  </div>
</template>

<script setup lang="ts">
import type { QuoteDraftFile } from '~/shared/types/buyer'
import { listQuoteDraftFiles } from '~/services/quoteDraft'
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const api = useApi()
const files = ref<QuoteDraftFile[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

async function loadFiles() {
  loading.value = true
  error.value = null
  try {
    files.value = await listQuoteDraftFiles(api, 'dashboard')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load grouped quote files'
    files.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  void loadFiles()
})
</script>
