<script setup lang="ts">
import { Search, Loader2 } from 'lucide-vue-next'
import { API } from '~/shared/api-paths'
import type { DesignWorkspaceRole } from '~/utils/design/nav'

const props = defineProps<{ role: DesignWorkspaceRole }>()

const { api } = useApi()
const code = ref('')
const busy = ref(false)
const error = ref('')

function jobCode(item: Record<string, unknown>): string {
  return String(item.managed_reference || item.reference || item.job_code || item.code || '')
}

async function submit() {
  const query = code.value.trim().toLowerCase()
  if (!query || busy.value) return
  busy.value = true
  error.value = ''
  try {
    const payload = await api<Array<Record<string, unknown>> | { results?: Array<Record<string, unknown>> }>(API.managedJobs.list)
    const rows = Array.isArray(payload) ? payload : (payload?.results ?? [])
    const match = rows.find((row) => jobCode(row).toLowerCase() === query)
    if (!match) {
      error.value = 'That job is not in your workspace.'
      return
    }
    const id = Number(match.id)
    if (!Number.isFinite(id)) {
      error.value = 'That job is not available yet.'
      return
    }
    if (props.role === 'partner') {
      await navigateTo(`/app/manager/jobs/${id}`)
    } else if (props.role === 'production') {
      await navigateTo(`/app/printer/jobs/${id}`)
    } else if (props.role === 'super_admin') {
      await navigateTo(`/app/admin/jobs?focus=${id}`)
    } else {
      await navigateTo(`/app/buyer/jobs/${id}`)
    }
  } catch {
    error.value = 'We could not look up that job right now.'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <form class="w-full" role="search" @submit.prevent="submit">
    <div class="flex items-center gap-2 rounded-xl border border-line bg-card px-3 focus-within:border-brand">
      <Loader2 v-if="busy" :size="14" class="shrink-0 animate-spin text-brand" aria-hidden="true" />
      <Search v-else :size="14" class="shrink-0 text-ink-3" aria-hidden="true" />
      <input
        v-model="code"
        type="search"
        aria-label="Find a job by code"
        placeholder="Find a job by code, e.g. MJ-20261124-0001"
        class="h-10 min-w-0 flex-1 bg-transparent text-[12.5px] text-ink outline-none placeholder:text-ink-3"
      >
    </div>
    <p v-if="error" role="alert" class="mt-1 text-[10.5px] font-semibold text-red">{{ error }}</p>
  </form>
</template>
