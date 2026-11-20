<template>
  <div class="flex flex-col gap-8">
    <DesignAdminPageHeader
      index="MG"
      kicker="People"
      title="Managers"
      description="Verify the managers who can carry client work. Decisions are written to the admin audit log."
    >
      <template #actions>
        <span class="inline-flex items-center gap-2 rounded-full border border-line bg-card px-3 py-1.5 font-mono text-[9px] tracking-[0.1em] text-ink-2 uppercase">
          <component :is="getIcon('Users')" class="h-3.5 w-3.5 text-brand" :stroke-width="2" />
          {{ rows.length }} managers · {{ pending.length }} pending
        </span>
      </template>
    </DesignAdminPageHeader>

    <DesignAdminSection index="01" title="Pending verification" :count="pending.length" hint="approve or reject with a reason">
      <div v-if="pending.length" class="space-y-2" data-test="admin-manager-pending">
        <DesignAdminVerificationRow
          v-for="row in pending"
          :key="row.user_id"
          kind="manager"
          :name="row.name"
          :email="row.email"
          :city="row.city"
          :detail="row.speciality"
          :status="row.status"
          :busy="busyId === row.user_id"
          :error="errors[row.user_id]"
          @approve="decide(row, 'approve')"
          @reject="reason => decide(row, 'reject', reason)"
        />
      </div>
      <DesignEmptyNote v-else title="No managers are waiting for verification." />
    </DesignAdminSection>

    <DesignAdminSection index="02" title="Verified managers" :count="verified.length" hint="cleared to carry client work">
      <div v-if="verified.length" class="space-y-2" data-test="admin-manager-verified">
        <DesignAdminVerificationRow
          v-for="row in verified"
          :key="row.user_id"
          kind="manager"
          :name="row.name"
          :email="row.email"
          :city="row.city"
          :detail="row.speciality"
          :status="row.status"
          :busy="busyId === row.user_id"
          :error="errors[row.user_id]"
          @approve="decide(row, 'approve')"
          @reject="reason => decide(row, 'reject', reason)"
        />
      </div>
      <DesignEmptyNote v-else title="No verified managers yet." />
    </DesignAdminSection>

    <DesignAdminSection v-if="rejected.length" index="03" title="Rejected" :count="rejected.length" hint="not active on the network">
      <div class="space-y-2" data-test="admin-manager-rejected">
        <DesignAdminVerificationRow
          v-for="row in rejected"
          :key="row.user_id"
          kind="manager"
          :name="row.name"
          :email="row.email"
          :city="row.city"
          :detail="row.speciality"
          :status="row.status"
          :busy="busyId === row.user_id"
          :error="errors[row.user_id]"
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

interface ManagerVerificationRow {
  user_id: number
  name: string
  email: string
  city: string
  speciality: string
  status: 'pending' | 'verified' | 'rejected'
}

const { api } = useApi()
const rows = ref<ManagerVerificationRow[]>([])
const busyId = ref<number | null>(null)
const loadError = ref('')
const errors = reactive<Record<number, string>>({})

const pending = computed(() => rows.value.filter(row => row.status === 'pending'))
const verified = computed(() => rows.value.filter(row => row.status === 'verified'))
const rejected = computed(() => rows.value.filter(row => row.status === 'rejected'))

async function load() {
  loadError.value = ''
  try {
    const payload = await api<{ results: ManagerVerificationRow[] }>(`${API.admin.verificationManagers}?status=all`)
    rows.value = payload?.results ?? []
  } catch {
    loadError.value = "We couldn't load manager verification."
  }
}

async function decide(row: ManagerVerificationRow, decision: 'approve' | 'reject', reason = '') {
  busyId.value = row.user_id
  errors[row.user_id] = ''
  try {
    const updated = await api<ManagerVerificationRow>(API.admin.managerDecision(row.user_id), {
      method: 'POST',
      body: { decision, reason },
    })
    const index = rows.value.findIndex(item => item.user_id === row.user_id)
    if (index >= 0) rows.value[index] = updated
  } catch (error: any) {
    errors[row.user_id] = error?.data?.detail || error?.message || "That decision could not be saved."
  } finally {
    busyId.value = null
  }
}

onMounted(load)
</script>
