<template>
  <div class="flex flex-col gap-8">
    <DesignAdminPageHeader
      index="PR"
      kicker="People"
      title="Printers"
      description="Verify production shops. Approval runs the same rate-card completeness check the printer sees."
    >
      <template #actions>
        <span class="inline-flex items-center gap-2 rounded-full border border-line bg-card px-3 py-1.5 font-mono text-[9px] tracking-[0.1em] text-ink-2 uppercase">
          <component :is="getIcon('Store')" class="h-3.5 w-3.5 text-brand" :stroke-width="2" />
          {{ verified.length }} verified · {{ pending.length }} pending
        </span>
      </template>
    </DesignAdminPageHeader>

    <DesignAdminSection index="01" title="Pending verification" :count="pending.length" hint="machine, paper, printing rate and standard turnaround must be complete">
      <div v-if="pending.length" class="space-y-2" data-test="admin-printer-pending">
        <DesignAdminVerificationRow
          v-for="row in pending"
          :key="row.id"
          kind="printer"
          :name="row.name"
          :email="row.owner_email"
          :city="row.city"
          :detail="row.is_confirmed ? 'Rate card confirmed' : 'Rate card not confirmed'"
          :status="row.status"
          :busy="busyId === row.id"
          :error="errors[row.id]"
          :missing-steps="missingFor(row)"
          @approve="decide(row, 'approve')"
          @reject="reason => decide(row, 'reject', reason)"
        />
      </div>
      <DesignEmptyNote v-else title="No shops are waiting for verification." />
    </DesignAdminSection>

    <DesignAdminSection index="02" title="Verified shops" :count="verified.length" hint="cleared to price paid work">
      <div v-if="verified.length" class="space-y-2" data-test="admin-printer-verified">
        <DesignAdminVerificationRow
          v-for="row in verified"
          :key="row.id"
          kind="printer"
          :name="row.name"
          :email="row.owner_email"
          :city="row.city"
          :detail="row.is_confirmed ? 'Rate card confirmed' : 'Rate card not confirmed'"
          :status="row.status"
          :busy="busyId === row.id"
          :error="errors[row.id]"
          @approve="decide(row, 'approve')"
          @reject="reason => decide(row, 'reject', reason)"
        />
      </div>
      <DesignEmptyNote v-else title="No verified shops yet." />
    </DesignAdminSection>

    <DesignAdminSection v-if="rejected.length" index="03" title="Rejected" :count="rejected.length" hint="not visible to buyers">
      <div class="space-y-2" data-test="admin-printer-rejected">
        <DesignAdminVerificationRow
          v-for="row in rejected"
          :key="row.id"
          kind="printer"
          :name="row.name"
          :email="row.owner_email"
          :city="row.city"
          :detail="row.is_confirmed ? 'Rate card confirmed' : 'Rate card not confirmed'"
          :status="row.status"
          :busy="busyId === row.id"
          :error="errors[row.id]"
          @approve="decide(row, 'approve')"
          @reject="reason => decide(row, 'reject', reason)"
        />
      </div>
    </DesignAdminSection>

    <p v-if="loadError" class="text-[12.5px] text-red">{{ loadError }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { getIcon } from '~/utils/design/icon-registry'
import { API } from '~/shared/api-paths'
import DesignAdminPageHeader from '~/components/design/admin/AdminPageHeader.vue'
import DesignAdminSection from '~/components/design/admin/AdminSection.vue'
import DesignAdminVerificationRow from '~/components/design/admin/AdminVerificationRow.vue'
import DesignEmptyNote from '~/components/design/ui/EmptyNote.vue'

interface MissingStep { code: string, title: string, hint: string }
interface PrinterVerificationRow {
  id: number
  name: string
  owner_email: string
  city: string
  status: 'pending' | 'verified' | 'rejected'
  is_confirmed: boolean
  missing_steps: MissingStep[]
}

const { api } = useApi()
const rows = ref<PrinterVerificationRow[]>([])
const busyId = ref<number | null>(null)
const loadError = ref('')
const errors = reactive<Record<number, string>>({})
const extraMissing = reactive<Record<number, MissingStep[]>>({})

const pending = computed(() => rows.value.filter(row => row.status === 'pending'))
const verified = computed(() => rows.value.filter(row => row.status === 'verified'))
const rejected = computed(() => rows.value.filter(row => row.status === 'rejected'))

function missingFor(row: PrinterVerificationRow) {
  return (extraMissing[row.id] ?? row.missing_steps ?? []).map(step => step.title)
}

async function load() {
  loadError.value = ''
  try {
    const payload = await api<{ results: PrinterVerificationRow[] }>(`${API.admin.verificationPrinters}?status=all`)
    rows.value = payload?.results ?? []
  } catch {
    loadError.value = "We couldn't load printer verification."
  }
}

async function decide(row: PrinterVerificationRow, decision: 'approve' | 'reject', reason = '') {
  busyId.value = row.id
  errors[row.id] = ''
  extraMissing[row.id] = []
  try {
    const updated = await api<PrinterVerificationRow>(API.admin.printerDecision(row.id), {
      method: 'POST',
      body: { decision, reason },
    })
    const index = rows.value.findIndex(item => item.id === row.id)
    if (index >= 0) rows.value[index] = updated
  } catch (error: any) {
    errors[row.id] = error?.data?.detail || error?.message || "That decision could not be saved."
    if (Array.isArray(error?.data?.missing_steps)) {
      extraMissing[row.id] = error.data.missing_steps
    }
  } finally {
    busyId.value = null
  }
}

onMounted(load)
</script>
