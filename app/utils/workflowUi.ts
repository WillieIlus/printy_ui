import type {
  CalculatorPreviewMatch,
  CalculatorPreviewResponse,
  ProductionPreview,
} from '~/types/api/calculator'
import type {
  JobAssignmentRecord,
  JobFileRecord,
  JobSettlementRecord,
  ManagedJobRecord,
  WorkflowProjection,
} from '~/stores/workflowSpine'

export type WorkflowTimelineItem = {
  key: string
  label: string
  caption: string
  complete: boolean
  current: boolean
}

export function humanizeWorkflowValue(value?: string | null) {
  if (!value) return 'Not available'
  return value.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
}

export function formatWorkflowDate(value?: string | null) {
  if (!value) return 'Pending'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Pending'
  return date.toLocaleString()
}

export function formatWorkflowMoney(value?: string | null, currency = 'KES') {
  if (!value) return 'Pending'
  const amount = Number(value)
  if (!Number.isFinite(amount)) return `${currency} ${value}`
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function workflowToneClass(tone?: string | null) {
  if (tone === 'success') return 'bg-emerald-500/12 text-emerald-700 ring-1 ring-emerald-500/15'
  if (tone === 'warning') return 'bg-amber-500/12 text-amber-700 ring-1 ring-amber-500/15'
  if (tone === 'danger') return 'bg-rose-500/12 text-rose-700 ring-1 ring-rose-500/15'
  if (tone === 'info') return 'bg-sky-500/12 text-sky-700 ring-1 ring-sky-500/15'
  return 'bg-slate-200/80 text-slate-700 ring-1 ring-slate-300/70'
}

export function paymentTone(status?: string | null) {
  if (!status) return 'neutral'
  if (['paid', 'confirmed', 'payment_confirmed', 'release_ready', 'released'].includes(status)) return 'success'
  if (['failed', 'rejected', 'refunded'].includes(status)) return 'danger'
  if (['pending', 'awaiting_payment', 'manual_payment_pending'].includes(status)) return 'warning'
  return 'info'
}

export function proofTone(status?: string | null) {
  if (!status) return 'neutral'
  if (['approved', 'print_ready', 'ready'].includes(status)) return 'success'
  if (['rejected'].includes(status)) return 'danger'
  if (['revision_requested', 'proof_uploaded'].includes(status)) return 'warning'
  return 'info'
}

export function summarizeProductionPreview(preview?: ProductionPreview | null, fallback = 'Production details will be confirmed by Printy after artwork review.') {
  if (!preview) return fallback
  const parts: string[] = []
  if (preview.sheets_required) parts.push(`${preview.sheets_required} sheet${preview.sheets_required === 1 ? '' : 's'}`)
  if (preview.pieces_per_sheet) parts.push(`${preview.pieces_per_sheet} up`)
  if (preview.parent_sheet) parts.push(preview.parent_sheet)
  if (preview.imposition_label) parts.push(preview.imposition_label)
  if (preview.booklet_binding_label) parts.push(preview.booklet_binding_label)
  if (preview.roll_width_m) parts.push(`${preview.roll_width_m}m roll`)
  return parts.length ? parts.join(' • ') : fallback
}

export function summarizeTurnaround(matches: CalculatorPreviewMatch[], preview?: CalculatorPreviewResponse | null) {
  const readyTexts = matches
    .map(match => match.human_ready_text || match.turnaround_label || null)
    .filter((value): value is string => Boolean(value))
  if (readyTexts.length) return readyTexts[0]
  if (preview?.assumptions?.length) return preview.assumptions[0] || 'Exact turnaround follows artwork review.'
  return 'Exact turnaround follows artwork review.'
}

export function buildManagedJobTimeline(job?: ManagedJobRecord | null): WorkflowTimelineItem[] {
  const status = String(job?.status ?? '')
  const projectionCode = String(job?.workflow_projection?.code ?? '')
  const currentKey = projectionCode || status || 'quoted'
  const stages = [
    {
      key: 'quoted',
      label: 'Quote locked',
      caption: job?.accepted_at ? formatWorkflowDate(job.accepted_at) : 'Quote accepted.',
    },
    {
      key: 'payment_confirmed',
      label: 'Payment confirmed',
      caption: job?.payment_confirmed_at ? formatWorkflowDate(job.payment_confirmed_at) : humanizeWorkflowValue(job?.payment_status),
    },
    {
      key: 'assigned',
      label: 'Assigned',
      caption: job?.assigned_at ? formatWorkflowDate(job.assigned_at) : humanizeWorkflowValue(job?.assignment_status),
    },
    {
      key: 'ready',
      label: 'Ready',
      caption: job?.ready_at ? formatWorkflowDate(job.ready_at) : 'Printy will confirm when the job is ready.',
    },
    {
      key: 'completed',
      label: 'Completed',
      caption: job?.completed_at ? formatWorkflowDate(job.completed_at) : 'Job completed and ready for payout release.',
    },
  ]

  return stages.map((stage, index) => {
    const complete = stage.key === currentKey
      ? true
      : index < stages.findIndex(item => item.key === currentKey)
    return {
      ...stage,
      complete: complete || currentKey === 'completed' && stage.key !== 'completed',
      current: stage.key === currentKey,
    }
  })
}

export function buildAssignmentTimeline(assignment?: JobAssignmentRecord | null): WorkflowTimelineItem[] {
  const status = String(assignment?.status ?? 'pending')
  const dueCaption = assignment?.due_at || assignment?.requested_deadline
    ? `Due ${formatWorkflowDate(assignment?.due_at || assignment?.requested_deadline || null)}`
    : 'Deadline to be confirmed.'
  const stages = [
    { key: 'pending', label: 'Queued', caption: 'Assignment placed in the production queue.' },
    { key: 'accepted', label: 'Accepted', caption: assignment?.accepted_at ? formatWorkflowDate(assignment.accepted_at) : 'Awaiting production acceptance.' },
    { key: 'in_production', label: 'In production', caption: dueCaption },
    { key: 'ready', label: 'Ready', caption: 'Ready for pickup, rider handoff, or final delivery.' },
    { key: 'completed', label: 'Completed', caption: 'Production work is complete and ready for payout release.' },
  ]
  return stages.map((stage, index) => {
    const currentIndex = stages.findIndex(item => item.key === status)
    return {
      ...stage,
      complete: currentIndex >= index,
      current: stage.key === status,
    }
  })
}

export function summarizeSettlement(settlement?: JobSettlementRecord | null, audience: 'client' | 'partner' | 'shop' = 'client') {
  if (!settlement) return []
  if (audience === 'client') {
    return [
      { label: 'Client total', value: formatWorkflowMoney(settlement.client_total) },
      { label: 'Delivery', value: formatWorkflowMoney(settlement.delivery_amount) },
      { label: 'Payment status', value: humanizeWorkflowValue(settlement.status) },
    ]
  }
  if (audience === 'partner') {
    return [
      { label: 'Partner commission', value: formatWorkflowMoney(settlement.partner_commission) },
      { label: 'Payment status', value: humanizeWorkflowValue(settlement.status) },
      { label: 'Release ready', value: settlement.release_ready_at ? formatWorkflowDate(settlement.release_ready_at) : 'Pending' },
    ]
  }
  return [
    { label: 'Production payout', value: formatWorkflowMoney(settlement.production_amount) },
    { label: 'Payment status', value: humanizeWorkflowValue(settlement.status) },
    { label: 'Release ready', value: settlement.release_ready_at ? formatWorkflowDate(settlement.release_ready_at) : 'Pending' },
  ]
}

export function visibleProofFiles(files: JobFileRecord[]) {
  return files.filter(file => ['proof', 'print_ready'].includes(String(file.file_type ?? '')))
}

export function workflowHeadline(projection?: WorkflowProjection | null, fallback?: string | null) {
  return projection?.label || fallback || 'Job in progress'
}
