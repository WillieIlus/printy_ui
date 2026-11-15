<template>
  <section
    v-if="rows.length"
    data-test="client-managers-panel"
    class="rounded-2xl border border-line bg-card p-5 shadow-card"
  >
    <div class="flex flex-wrap items-center gap-2">
      <Handshake :size="18" class="text-brand" aria-hidden="true" />
      <h2 class="text-sm font-bold tracking-tight text-ink">Your managers</h2>
      <span
        data-test="your-managers-stamp"
        class="rounded-full bg-mint px-2 py-0.5 font-mono text-[9.5px] font-bold uppercase tracking-[0.12em] text-brand-deep"
      >
        Your managers
      </span>
      <span class="ml-auto hidden font-mono text-[10.5px] text-ink-3 sm:block">
        Managers on your quotes and shortlist
      </span>
    </div>

    <div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="manager in rows"
        :key="manager.id"
        data-test="client-manager-row"
        class="flex items-start gap-3 rounded-xl border border-line bg-paper-2 p-3.5"
      >
        <Avatar
          :src="manager.photo || null"
          :alt="`Photo of ${displayName(manager)}`"
          :name="displayName(manager)"
          :initials="initials(manager)"
          :hue="160"
          :size="38"
        />
        <div class="min-w-0 flex-1">
          <div class="truncate text-[13.5px] font-bold tracking-tight text-ink">{{ displayName(manager) }}</div>
          <span
            v-if="relationshipLabel(manager)"
            data-test="client-manager-relationship"
            class="mt-1 inline-flex rounded-full bg-mint px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-brand-deep"
          >
            {{ relationshipLabel(manager) }}
          </span>
          <p v-if="manager.speciality" class="mt-0.5 line-clamp-2 text-[11.5px] leading-snug text-ink-2">
            {{ manager.speciality }}
          </p>
          <ManagerTrustBadges v-if="manager.verified" class="mt-2" verified />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Handshake } from 'lucide-vue-next'
import { useApi } from '~/composables/useApi'
import { API } from '~/shared/api-paths'
import type { ClientManagerRow, ClientManagersResponse } from '~/shared/types'

/* B1.3 — the client's managers are derived by the server (origin manager plus any
   manager with a paid job for this client) and this panel only renders them. The
   payload carries no money, and nothing here adds any: a client never sees fees. */

const { api } = useApi()
const rows = ref<ClientManagerRow[]>([])

function displayName(manager: ClientManagerRow): string {
  return String(manager.first_name || manager.name || 'Your manager').trim()
}

function initials(manager: ClientManagerRow): string {
  return displayName(manager)
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'PM'
}

/** One short, money-free reason this manager is on the client's dashboard. */
function relationshipLabel(manager: ClientManagerRow): string {
  if (manager.is_printy) {
    return 'Managed by Printy'
  }
  if (manager.sources.includes('quote_request')) {
    return 'Working on your quote'
  }
  if (manager.sources.includes('locked')) {
    return 'Saved to your shortlist'
  }
  if ((manager.paid_jobs ?? 0) > 0) {
    return manager.paid_jobs === 1 ? '1 paid job with you' : `${manager.paid_jobs} paid jobs with you`
  }
  if (manager.sources.includes('origin')) {
    return 'Your account manager'
  }
  return ''
}

onMounted(async () => {
  try {
    const payload = await api<ClientManagersResponse>(API.clientPortal.myManagers)
    rows.value = Array.isArray(payload?.results) ? payload.results : []
  } catch {
    // A missing list is not an error on the dashboard: the panel simply stays hidden.
    rows.value = []
  }
})
</script>
