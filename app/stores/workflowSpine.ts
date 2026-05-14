import { API } from '~/shared/api-paths'

export interface WorkflowProjection {
  code?: string | null
  label?: string | null
  tone?: string | null
  detail?: string | null
  priority_level?: number | null
}

export interface ManagedJobRecord {
  id: number
  managed_reference?: string
  title?: string
  status?: string
  payment_status?: string
  payment_method?: string
  assignment_status?: string
  exception_status?: string
  fulfillment_mode?: string
  urgency_type?: string
  urgency_label?: string
  urgency_fee?: string | null
  after_hours_fee?: string | null
  requested_deadline?: string | null
  requested_delivery_time?: string | null
  operational_priority_level?: number
  file_count?: number
  payment_count?: number
  workflow_projection?: WorkflowProjection | null
  accepted_at?: string | null
  payment_confirmed_at?: string | null
  assigned_at?: string | null
  ready_at?: string | null
  delivered_at?: string | null
  completed_at?: string | null
  created_at?: string
  updated_at?: string
}

export interface JobFileRecord {
  id: number
  managed_job: number
  assignment?: number | null
  file_type?: string
  visibility?: string
  status?: string
  version?: number
  original_filename?: string
  notes?: string
  created_at?: string
  download_url?: string
}

export interface JobPaymentRecord {
  id: number
  managed_job: number
  amount?: string | null
  expected_amount?: string | null
  received_amount?: string | null
  payment_method?: string
  payment_channel?: string
  payment_status?: string
  reconciliation_status?: string
  account_reference?: string
  payer_phone?: string
  checkout_request_id?: string
  external_reference?: string
  confirmed_at?: string | null
  created_at?: string
}

export interface JobPaymentQueryPayload {
  checkout_request_id: string
}

export interface JobSettlementRecord {
  id: number
  managed_job: number
  production_amount?: string | null
  platform_fee?: string | null
  partner_commission?: string | null
  delivery_amount?: string | null
  client_total?: string | null
  relationship_owner_type?: string
  relationship_owner_reference?: string
  commission_recipient_type?: string
  status?: string
  payment_method?: string
  release_ready_at?: string | null
  released_at?: string | null
}

export interface ManagedJobEventRecord {
  id: number
  event_type?: string
  summary?: string
  metadata?: Record<string, unknown> | null
  actor_name?: string
  created_at?: string
}

export interface JobAssignmentRecord {
  id: number
  managed_job: number
  managed_reference?: string
  assigned_shop?: number | null
  shop_name?: string
  status?: string
  urgency_type?: string
  urgency_label?: string
  operational_priority_level?: number
  managed_job_status?: string
  managed_job_payment_status?: string
  workflow_projection?: WorkflowProjection | null
  production_order?: number | null
  due_at?: string | null
  requested_deadline?: string | null
  accepted_at?: string | null
  rejected_at?: string | null
  assignment_notes?: string
}

export interface PartnerQuoteRecord {
  id: number
  quote_request_id?: number
  client_name?: string
  shop_name?: string
  status?: string
  total?: string | null
  partner_markup?: string | null
  partner_brand_name?: string
  share_token?: string
  created_at?: string
}

export const useWorkflowSpineStore = defineStore('workflowSpine', () => {
  const managedJobs = ref<ManagedJobRecord[]>([])
  const shopAssignments = ref<JobAssignmentRecord[]>([])
  const partnerQuotes = ref<PartnerQuoteRecord[]>([])
  const filesByJob = ref<Record<number, JobFileRecord[]>>({})
  const paymentsByJob = ref<Record<number, JobPaymentRecord[]>>({})
  const settlementByJob = ref<Record<number, JobSettlementRecord | null>>({})
  const eventsByJob = ref<Record<number, ManagedJobEventRecord[]>>({})
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchManagedJobs() {
    loading.value = true
    error.value = null
    try {
      const { $api } = useNuxtApp()
      managedJobs.value = await $api<ManagedJobRecord[]>(API.managedJobs())
      return managedJobs.value
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load jobs.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchShopAssignments() {
    loading.value = true
    error.value = null
    try {
      const { $api } = useNuxtApp()
      shopAssignments.value = await $api<JobAssignmentRecord[]>(API.shopAssignments())
      return shopAssignments.value
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load assignments.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchPartnerQuotes() {
    loading.value = true
    error.value = null
    try {
      const { $api } = useNuxtApp()
      partnerQuotes.value = await $api<PartnerQuoteRecord[]>(API.partnerQuotes())
      return partnerQuotes.value
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load partner quotes.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchJobFiles(jobId: number) {
    const { $api } = useNuxtApp()
    const files = await $api<JobFileRecord[]>(API.managedJobFiles(jobId))
    filesByJob.value = { ...filesByJob.value, [jobId]: files }
    return files
  }

  async function fetchJobPayments(jobId: number) {
    const { $api } = useNuxtApp()
    const payments = await $api<JobPaymentRecord[]>(API.managedJobPayments(jobId))
    paymentsByJob.value = { ...paymentsByJob.value, [jobId]: payments }
    return payments
  }

  async function fetchJobSettlement(jobId: number) {
    const { $api } = useNuxtApp()
    const settlement = await $api<JobSettlementRecord>(API.managedJobSettlement(jobId))
    settlementByJob.value = { ...settlementByJob.value, [jobId]: settlement }
    return settlement
  }

  async function fetchJobEvents(jobId: number) {
    const { $api } = useNuxtApp()
    const events = await $api<ManagedJobEventRecord[]>(API.managedJobEvents(jobId))
    eventsByJob.value = { ...eventsByJob.value, [jobId]: events }
    return events
  }

  async function hydrateJob(jobId: number) {
    await Promise.all([
      fetchJobFiles(jobId),
      fetchJobPayments(jobId),
      fetchJobSettlement(jobId),
      fetchJobEvents(jobId),
    ])
  }

  async function performAssignmentAction(assignmentId: number, action: 'accept' | 'reject' | 'in_production' | 'ready' | 'completed' | 'issue', note = '') {
    const { $api } = useNuxtApp()
    const endpoint = {
      accept: API.jobAssignmentAccept(assignmentId),
      reject: API.jobAssignmentReject(assignmentId),
      in_production: API.jobAssignmentInProduction(assignmentId),
      ready: API.jobAssignmentReady(assignmentId),
      completed: API.jobAssignmentCompleted(assignmentId),
      issue: API.jobAssignmentIssue(assignmentId),
    }[action]
    const assignment = await $api<JobAssignmentRecord>(endpoint, {
      method: 'POST',
      body: note ? { note } : {},
    })
    shopAssignments.value = shopAssignments.value.map((item) => (item.id === assignment.id ? assignment : item))
    return assignment
  }

  async function performFileAction(fileId: number, action: 'approve' | 'reject' | 'revision' | 'print_ready', note = '') {
    const { $api } = useNuxtApp()
    const endpoint = {
      approve: API.jobFileApprove(fileId),
      reject: API.jobFileReject(fileId),
      revision: API.jobFileRevision(fileId),
      print_ready: API.jobFilePrintReady(fileId),
    }[action]
    const jobFile = await $api<JobFileRecord>(endpoint, {
      method: 'POST',
      body: note ? { note } : {},
    })
    const jobId = jobFile.managed_job
    const current = filesByJob.value[jobId] ?? []
    filesByJob.value = {
      ...filesByJob.value,
      [jobId]: current.map((item) => (item.id === jobFile.id ? jobFile : item)),
    }
    return jobFile
  }

  async function uploadProof(jobId: number, file: File, note = '') {
    const { $api } = useNuxtApp()
    const body = new FormData()
    body.append('file', file)
    if (note) body.append('note', note)
    const jobFile = await $api<JobFileRecord>(API.managedJobProofs(jobId), {
      method: 'POST',
      body,
    })
    const current = filesByJob.value[jobId] ?? []
    filesByJob.value = {
      ...filesByJob.value,
      [jobId]: [jobFile, ...current],
    }
    return jobFile
  }

  async function initiateJobStkPush(jobId: number, phoneNumber: string, amount?: string | null) {
    const { $api } = useNuxtApp()
    const payment = await $api<JobPaymentRecord>(API.managedJobPaymentStkPush(jobId), {
      method: 'POST',
      body: {
        phone_number: phoneNumber,
        amount: amount || undefined,
      },
    })
    const current = paymentsByJob.value[jobId] ?? []
    paymentsByJob.value = {
      ...paymentsByJob.value,
      [jobId]: [payment, ...current],
    }
    return payment
  }

  async function queryJobPaymentStatus(jobId: number, payload: JobPaymentQueryPayload) {
    const { $api } = useNuxtApp()
    const payment = await $api<JobPaymentRecord>(API.managedJobPaymentQuery(jobId), {
      method: 'POST',
      body: payload,
    })
    const current = paymentsByJob.value[jobId] ?? []
    const next = current.some(item => item.id === payment.id)
      ? current.map(item => (item.id === payment.id ? payment : item))
      : [payment, ...current]
    paymentsByJob.value = {
      ...paymentsByJob.value,
      [jobId]: next,
    }
    return payment
  }

  return {
    managedJobs,
    shopAssignments,
    partnerQuotes,
    filesByJob,
    paymentsByJob,
    settlementByJob,
    eventsByJob,
    loading,
    error,
    fetchManagedJobs,
    fetchShopAssignments,
    fetchPartnerQuotes,
    fetchJobFiles,
    fetchJobPayments,
    fetchJobSettlement,
    fetchJobEvents,
    hydrateJob,
    performAssignmentAction,
    performFileAction,
    uploadProof,
    initiateJobStkPush,
    queryJobPaymentStatus,
  }
})
