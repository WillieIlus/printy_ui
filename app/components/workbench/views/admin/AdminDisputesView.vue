<template>
  <div class="flex flex-col gap-8">
    <DesignAdminPageHeader
      index="DS"
      kicker="Money & risk"
      title="Disputes"
      description="Real jobs in dispute. A resolution clears the dispute flag and is written to the admin audit log."
    >
      <template #actions>
        <span
          :class="[
            'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[9px] tracking-[0.1em] uppercase',
            disputes.length ? 'border-red/40 bg-red-soft text-red' : 'border-line bg-card text-ink-2',
          ]"
        >
          <component :is="getIcon('AlertTriangle')" class="h-3.5 w-3.5" :stroke-width="2" />
          {{ disputes.length }} open · {{ formatKSh(frozenTotal) }} frozen
        </span>
      </template>
    </DesignAdminPageHeader>

    <DesignAdminSection index="01" title="Open disputes" :count="disputes.length" hint="release, dismiss or refund with a recorded reason">
      <div v-if="disputes.length" class="space-y-2.5" data-test="admin-dispute-list">
        <div
          v-for="row in rows"
          :key="row.job_id"
          class="overflow-hidden rounded-xl border border-red/45 bg-card"
        >
          <div class="h-1.5 bg-red/70" />
          <div class="bg-red-soft/40 p-4">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <span class="font-mono text-[11px] font-semibold tracking-[0.12em] text-red">{{ row.code }}</span>
              <span class="rounded-full border border-red/40 bg-red-soft px-2.5 py-1 font-mono text-[9px] tracking-[0.08em] text-red uppercase">
                {{ row.status }}
              </span>
            </div>
            <p class="mt-2 text-[16px] font-bold tracking-tight text-ink">{{ row.title }}</p>
            <p v-if="row.reason" class="mt-2 max-w-[64ch] text-[12.5px] leading-snug text-ink-2">{{ row.reason }}</p>
            <div class="mt-3 flex flex-wrap items-center gap-2 font-mono text-[9.5px] tracking-[0.08em] text-ink-3 uppercase">
              <span class="rounded-full border border-red/40 bg-red-soft px-2.5 py-1 text-red">{{ formatKSh(row.amounts.client_total) }} frozen</span>
              <span v-if="row.manager">manager {{ row.manager }}</span>
              <span v-if="row.shop">shop {{ row.shop }}</span>
            </div>

            <form class="mt-3 flex flex-wrap items-center gap-2 border-t border-red/20 pt-3" @submit.prevent="resolve(row)">
              <select
                v-model="row.form.resolution"
                class="min-h-[36px] rounded-xl border border-line bg-card px-3 text-[12px] text-ink"
              >
                <option value="release">Release payout</option>
                <option value="dismiss">Dismiss</option>
                <option value="refund">Refund buyer</option>
              </select>
              <input
                v-model="row.form.reason"
                data-test="admin-dispute-reason"
                type="text"
                placeholder="Reason"
                class="min-w-[220px] flex-1 rounded-xl border border-line bg-paper px-3 py-2 text-[13px] text-ink outline-none focus:border-red"
              >
              <button
                type="submit"
                data-test="admin-dispute-resolve"
                class="inline-flex min-h-[36px] items-center rounded-xl bg-red px-3 text-[12px] font-semibold text-white disabled:opacity-50"
                :disabled="busyId === row.job_id || (row.form.resolution !== 'dismiss' && !row.form.reason.trim())"
              >
                {{ busyId === row.job_id ? 'Resolving…' : 'Resolve' }}
              </button>
            </form>
            <p v-if="errors[row.job_id]" class="mt-2 text-[11.5px] text-red">{{ errors[row.job_id] }}</p>
          </div>
        </div>
      </div>
      <DesignEmptyNote v-else title="Zero open disputes — the marketplace is clean." />
    </DesignAdminSection>

    <p class="text-[12px] text-ink-3">
      Resolved disputes leave this queue. The decision and reason remain in the admin audit log.
    </p>
    <p v-if="loadError" class="text-[12.5px] text-red">{{ loadError }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { getIcon } from '~/utils/design/icon-registry'
import { API } from '~/shared/api-paths'
import { formatKSh } from '~/utils/money'
import DesignAdminPageHeader from '~/components/design/admin/AdminPageHeader.vue'
import DesignAdminSection from '~/components/design/admin/AdminSection.vue'
import DesignEmptyNote from '~/components/design/ui/EmptyNote.vue'

interface DisputeRow {
  job_id: number
  code: string
  title: string
  status: string
  payment_status: string
  exception_status: string
  dispute_open: boolean
  payout_hold: boolean
  amounts: { client_total: string | null }
  reason: string
  client: string
  manager: string
  shop: string
}

const { api } = useApi()
const disputes = ref<DisputeRow[]>([])
const busyId = ref<number | null>(null)
const loadError = ref('')
const errors = reactive<Record<number, string>>({})

type DisputeForm = { resolution: 'release' | 'dismiss' | 'refund', reason: string }
const forms = reactive<Record<number, DisputeForm>>({})

const frozenTotal = computed(() => disputes.value.reduce((total, row) => total + Number(row.amounts.client_total || 0), 0))
const rows = computed(() => disputes.value.map(row => ({ ...row, form: ensureForm(row.job_id) })))

function ensureForm(id: number): DisputeForm {
  const existing = forms[id]
  if (existing) return existing
  const form: DisputeForm = { resolution: 'release', reason: '' }
  forms[id] = form
  return form
}

async function load() {
  loadError.value = ''
  try {
    const payload = await api<{ results: DisputeRow[] }>(API.admin.disputes)
    disputes.value = payload?.results ?? []
    for (const row of disputes.value) ensureForm(row.job_id)
  } catch {
    loadError.value = "We couldn't load disputes."
  }
}

async function resolve(row: DisputeRow) {
  const form = ensureForm(row.job_id)
  busyId.value = row.job_id
  errors[row.job_id] = ''
  try {
    await api(API.admin.disputeResolve(row.job_id), {
      method: 'POST',
      body: { resolution: form.resolution, reason: form.reason.trim() },
    })
    await load()
  } catch (err: any) {
    errors[row.job_id] = err?.data?.detail || err?.message || "That resolution could not be saved."
  } finally {
    busyId.value = null
  }
}

onMounted(load)
</script>
