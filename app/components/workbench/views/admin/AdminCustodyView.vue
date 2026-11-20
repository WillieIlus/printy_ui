<template>
  <div class="flex flex-col gap-8">
    <DesignAdminPageHeader
      index="CU"
      kicker="Money"
      title="Custody"
      description="Real escrow positions from the platform ledger. Release is available only for completed jobs."
    >
      <template #actions>
        <span class="inline-flex items-center gap-2 rounded-full border border-line bg-card px-3 py-1.5 font-mono text-[9px] tracking-[0.1em] text-ink-2 uppercase">
          <component :is="getIcon('Banknote')" class="h-3.5 w-3.5 text-brand" :stroke-width="2" />
          {{ rows.length }} custody jobs
        </span>
      </template>
    </DesignAdminPageHeader>

    <DesignAdminSection index="01" title="Escrow position" hint="held funds release only when delivery is confirmed">
      <DesignCard class="p-6">
        <div class="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p class="font-mono text-[10px] font-medium tracking-[0.16em] text-ink-3 uppercase">Funds held now</p>
            <p class="mt-1 tabular font-mono text-2xl font-semibold tracking-tight text-brand">{{ formatKSh(totals.held) }}</p>
            <p class="mt-1 text-[13px] text-ink-2">across {{ held.length }} jobs</p>
          </div>
          <div class="text-right">
            <p class="font-mono text-[10px] font-medium tracking-[0.16em] text-ink-3 uppercase">Released</p>
            <p class="mt-1 tabular font-mono text-xl font-semibold text-green">{{ formatKSh(totals.released) }}</p>
            <p class="mt-1 font-mono text-[9px] tracking-[0.1em] text-ink-3 uppercase">awaiting {{ formatKSh(totals.awaiting) }}</p>
          </div>
        </div>
        <div class="mt-5">
          <DesignAdminCustodyBar :held="totals.held" :released="totals.released" :awaiting="totals.awaiting" />
        </div>
      </DesignCard>
    </DesignAdminSection>

    <DesignAdminSection index="02" title="Held in escrow" :count="held.length" hint="paid and locked until delivery">
      <div v-if="held.length" class="space-y-2" data-test="admin-custody-held">
        <div
          v-for="row in held"
          :key="row.job_id"
          class="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-card p-4"
        >
          <div class="min-w-0 flex-1">
            <div class="font-mono text-[11px] font-semibold tracking-[0.08em] text-brand">{{ row.code }}</div>
            <div class="mt-1 text-[13px] text-ink-2">{{ row.status }} · {{ row.payment_status }}</div>
          </div>
          <div class="text-right">
            <div class="tabular font-mono text-[15px] font-semibold text-ink">{{ formatKSh(row.amounts.client_total) }}</div>
            <div class="font-mono text-[9px] tracking-[0.08em] text-ink-3 uppercase">
              manager {{ formatKSh(row.amounts.manager_payout) }} · shop {{ formatKSh(row.amounts.shop_payout) }}
            </div>
          </div>
          <button
            v-if="row.can_release"
            type="button"
            data-test="admin-custody-release"
            class="inline-flex min-h-[36px] items-center rounded-xl bg-ink px-3 text-[12px] font-semibold text-white disabled:opacity-50"
            :disabled="busyId === row.job_id"
            @click="release(row)"
          >
            {{ busyId === row.job_id ? 'Releasing…' : 'Release' }}
          </button>
          <span v-else-if="row.payout_hold" class="font-mono text-[9px] tracking-[0.08em] text-amber uppercase">Payout on hold</span>
        </div>
        <p v-if="error" class="text-[12px] text-red">{{ error }}</p>
      </div>
      <DesignEmptyNote v-else title="Nothing is sitting in escrow." />
    </DesignAdminSection>

    <DesignAdminSection index="03" title="Released to printers" :count="released.length" hint="delivered and paid out">
      <div v-if="released.length" class="space-y-2" data-test="admin-custody-released">
        <div
          v-for="row in released"
          :key="row.job_id"
          class="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-card p-4"
        >
          <div class="min-w-0 flex-1">
            <div class="font-mono text-[11px] font-semibold tracking-[0.08em] text-brand">{{ row.code }}</div>
            <div class="mt-1 text-[13px] text-ink-2">{{ row.status }} · released</div>
          </div>
          <div class="tabular font-mono text-[15px] font-semibold text-green">{{ formatKSh(row.amounts.client_total) }}</div>
        </div>
      </div>
      <DesignEmptyNote v-else title="Nothing has been released yet." />
    </DesignAdminSection>

    <p v-if="loadError" class="text-[12.5px] text-red">{{ loadError }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { getIcon } from '~/utils/design/icon-registry'
import { API } from '~/shared/api-paths'
import { formatKSh } from '~/utils/money'
import DesignAdminCustodyBar from '~/components/design/admin/AdminCustodyBar.vue'
import DesignAdminPageHeader from '~/components/design/admin/AdminPageHeader.vue'
import DesignAdminSection from '~/components/design/admin/AdminSection.vue'
import DesignCard from '~/components/design/ui/Card.vue'
import DesignEmptyNote from '~/components/design/ui/EmptyNote.vue'

interface CustodyRow {
  job_id: number
  code: string
  status: string
  payment_status: string
  custody_status: 'awaiting' | 'held' | 'released'
  payout_hold: boolean
  can_release: boolean
  amounts: {
    client_total: string | null
    manager_payout: string | null
    shop_payout: string | null
    printy_fee: string | null
  }
}

const { api } = useApi()
const rows = ref<CustodyRow[]>([])
const busyId = ref<number | null>(null)
const error = ref('')
const loadError = ref('')

const held = computed(() => rows.value.filter(row => row.custody_status === 'held'))
const released = computed(() => rows.value.filter(row => row.custody_status === 'released'))
const awaiting = computed(() => rows.value.filter(row => row.custody_status === 'awaiting'))
const totals = computed(() => ({
  held: sum(held.value),
  released: sum(released.value),
  awaiting: sum(awaiting.value),
}))

function sum(list: CustodyRow[]) {
  return list.reduce((total, row) => total + Number(row.amounts.client_total || 0), 0)
}

async function load() {
  loadError.value = ''
  try {
    const payload = await api<{ results: CustodyRow[] }>(API.admin.custody)
    rows.value = payload?.results ?? []
  } catch {
    loadError.value = "We couldn't load custody."
  }
}

async function release(row: CustodyRow) {
  busyId.value = row.job_id
  error.value = ''
  try {
    await api(API.admin.custodyRelease(row.job_id), { method: 'POST', body: {} })
    await load()
  } catch (err: any) {
    error.value = err?.data?.detail || err?.message || "That release could not be completed."
  } finally {
    busyId.value = null
  }
}

onMounted(load)
</script>
