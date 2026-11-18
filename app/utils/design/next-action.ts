import type { NextActionItem } from '~/components/design/tracker/NextActionCard.vue'
import type { WorkflowPanelData, WorkflowRow } from '~/components/design/tracker/JobWorkflowPanel.vue'
import { formatDue, formatHours } from './next-format'

type AnyJob = Record<string, any>

function text(value: unknown): string {
  return value == null ? '' : String(value)
}

export function toNextActionItem(job: AnyJob): NextActionItem {
  const step = job.next_step ?? job.nextStep ?? {}
  const action = step.next_action ?? {}
  const code = text(job.job_code || job.code || job.reference || job.job_reference || job.managed_reference || job.id)
  const key = text(action.key)
  const target = action.target ? text(action.target) : null
  const completed = text(job.status).toLowerCase() === 'completed' || text(step.current_stage).toLowerCase() === 'completed'
  const label = text(action.label || step.stage_label || job.status || 'Next step')
  const owner = text(step.owner_role || job.stage_owner || 'none')
  const isMine = Boolean(step.is_mine)
  const overdue = text(step.overdue_level || 'none')

  return {
    job_code: code,
    owner_role: owner,
    is_mine: isMine,
    next_action: key && key !== 'none' && target ? { key, label, target } : null,
    due_at: step.due_at ?? job.due_at ?? job.timing?.due_date ?? null,
    waiting_since: step.waiting_since ?? null,
    overdue_level: overdue,
    headline: completed ? 'Job completed' : label,
    explanation: text(step.explanation) || defaultExplanation(key, completed),
    reassurance: text(step.reassurance) || (owner === 'buyer'
      ? 'No payment here — your money stays in escrow until you confirm delivery'
      : 'Every step is timestamped and visible to the job’s parties'),
    waiting_label: step.waiting_label ?? (completed ? null : waitingLabel(owner)),
    phase: text(step.phase) || phaseForKey(key),
    completed,
  }
}

export function nextActionItems(rows: AnyJob[]): NextActionItem[] {
  return rows
    .filter((row) => row && row.next_step)
    .map(toNextActionItem)
    .filter((item) => item.is_mine)
    .sort((a, b) => {
      const rank = (level: string) => (level === 'late' ? 0 : level === 'warn' ? 1 : 2)
      return rank(a.overdue_level) - rank(b.overdue_level)
    })
}

function waitingLabel(owner: string): string {
  if (owner === 'buyer' || owner === 'client') return 'Waiting on you'
  if (owner === 'manager' || owner === 'partner') return 'Waiting on your manager'
  if (owner === 'printer' || owner === 'production') return 'Waiting on the printer'
  return 'Waiting on Printy'
}

function phaseForKey(key: string): string {
  if (['get_manager', 'upload_artwork', 'send_artwork', 'review_artwork', 'send_quote', 'accept_quote', 'pay', 'payment_confirmed'].includes(key)) return 'quote'
  if (['confirm_delivery', 'completed'].includes(key)) return 'outcome'
  return 'production'
}

function defaultExplanation(key: string, completed: boolean): string {
  if (completed) return 'Payout released per the escrow rules.'
  const copy: Record<string, string> = {
    upload_artwork: 'Attach your print-ready file, or tick that your manager already has it.',
    review_artwork: 'Check bleed, resolution and colour, then approve or request changes.',
    accept_quote: 'Review the manager-approved quote, then accept it to unlock payment.',
    pay: 'Pay by M-Pesa. Printy holds the money until you confirm delivery.',
    dispatch_job: 'Choose the production shop and dispatch the job.',
    accept_job: 'Payment is confirmed. Accept the job before dispatching it.',
    start_printing: 'Everything is checked — put the job on press.',
    mark_ready: 'Packed and labelled — mark the job ready for collection.',
    confirm_delivery: 'You have your print — confirm delivery to release the payout.',
  }
  return copy[key] ?? 'This step is waiting.'
}

function normalizeState(raw: string): WorkflowRow['state'] {
  const s = raw.toLowerCase()
  if (s === 'done' || s === 'completed' || s === 'complete') return 'done'
  if (s === 'current' || s === 'active' || s === 'in_progress' || s === 'overdue') return 'current'
  return 'upcoming'
}

function stageRows(stages: any[], from: number, to?: number): WorkflowRow[] {
  return stages.slice(from, to).map((stage) => {
    const state = normalizeState(text(stage.state || stage.status))
    return {
      label: text(stage.label || stage.key || 'Stage'),
      state,
      right: state === 'current' ? 'in progress' : state === 'done' ? 'done' : 'queued',
    }
  })
}

export function buildWorkflowPanel(job: AnyJob): WorkflowPanelData | null {
  const timeline = job?.timeline
  let rawStages: any[] = Array.isArray(job?.stages)
    ? job.stages
    : Array.isArray(timeline?.stages)
      ? timeline.stages
      : Array.isArray(job?.timing?.stage_timestamps?.stages)
        ? job.timing.stage_timestamps.stages.map((stage: any) => ({
            key: stage.stage,
            label: stage.label,
            state: stage.is_current ? 'current' : stage.completed_at ? 'done' : 'pending',
            started_at: stage.started_at,
          }))
        : []
  if (!rawStages.length) {
    const chain = [
      { key: 'quote_accepted', label: 'Quote accepted' },
      { key: 'artwork_approval', label: 'Artwork approval' },
      { key: 'production', label: 'Production' },
      { key: 'qc', label: 'Quality check' },
      { key: 'delivery', label: 'Delivery' },
    ]
    const currentRaw = text(job?.timing?.current_stage || job?.next_step?.current_stage || job?.status).toLowerCase()
    const completed = text(job?.status).toLowerCase() === 'completed'
    const currentIndex = completed ? chain.length : Math.max(0, chain.findIndex((stage) => stage.key === currentRaw))
    rawStages = chain.map((stage, index) => ({
      key: stage.key,
      label: stage.label,
      state: completed || index < currentIndex ? 'done' : index === currentIndex ? 'current' : 'pending',
    }))
  }
  if (!rawStages.length) return null
  const canonicalCurrent = text(
    job?.timing?.current_stage
    || job?.current_stage
    || job?.current_stage_key
    || job?.next_step?.current_stage,
  ).toLowerCase()
  if (canonicalCurrent) {
    const canonicalIndex = rawStages.findIndex((stage) => text(stage.key || stage.stage).toLowerCase() === canonicalCurrent)
    const isCompleted = text(job?.status).toLowerCase() === 'completed'
    if (canonicalIndex >= 0 || isCompleted) {
      rawStages = rawStages.map((stage, index) => ({
        ...stage,
        state: isCompleted || index < canonicalIndex ? 'done' : index === canonicalIndex ? 'current' : 'pending',
      }))
    }
  }

  const productionStart = Math.max(0, rawStages.findIndex((stage) => {
    const key = text(stage.key || stage.stage).toLowerCase()
    return key.includes('production') || key === 'in_production' || key === 'printing'
  }))
  const split = productionStart === 0 ? Math.min(2, rawStages.length) : productionStart
  const quoteRows = stageRows(rawStages, 0, split)
  const productionRows = stageRows(rawStages, split)
  const doneCount = productionRows.filter((row) => row.state === 'done').length
  const currentIndex = productionRows.findIndex((row) => row.state === 'current')
  const stageIndex = currentIndex === -1 ? doneCount : currentIndex + 1
  const current = productionRows[currentIndex] ?? productionRows[productionRows.length - 1]
  const step = job.next_step ?? {}
  const overdue = text(step.overdue_level || (timeline?.is_late ? 'late' : 'none'))
  const completed = text(job.status).toLowerCase() === 'completed'
  const remaining = job.timing?.time_remaining_minutes ?? timeline?.time_remaining_minutes
  const dueRaw = step.due_at || job.due_at || job.timing?.due_date || timeline?.due_date || job.requested_deadline
  const code = text(job.job_code || job.reference || job.job_reference || job.code || job.managed_reference || job.id)
  const qty = Number(job.quantity ?? job.qty ?? 0)
  const title = text(job.title || job.spec_label || job.quote_title || 'Print job')
  const subline = text(
    job.subline
    || `Placed ${job.created_at ? formatDue(job.created_at) : '—'}${job.location ? ` · ${job.location} delivery` : ''}`,
  )
  const phases = [
    { name: 'Phase 1 · Quote', rows: quoteRows },
    { name: 'Phase 2 · Production', rows: productionRows },
  ]
  if (completed) {
    phases.push({
      name: 'Outcome',
      rows: [
        { label: 'Buyer confirms', state: 'done', right: 'confirmed' },
        { label: 'Completed · payout released', state: 'done', right: 'released' },
      ],
    })
  }

  return {
    code,
    title: qty > 0 ? `${qty} ${title}` : title,
    subline,
    sample: code.toUpperCase().startsWith('SAMPLE'),
    badge: completed
      ? { label: 'Delivered', tone: 'delivered' }
      : overdue === 'late'
        ? { label: 'Late', tone: 'late' }
        : overdue === 'warn'
          ? { label: 'At risk', tone: 'atrisk' }
          : { label: 'On track', tone: 'ontrack' },
    phases,
    nextAction: job.next_step?.next_action?.label ? {
      label: text(step.next_action?.label || step.headline || ''),
      target: step.next_action?.target ? text(step.next_action.target) : null,
      is_mine: Boolean(step.is_mine),
      owner_role: text(step.owner_role || ''),
      overdue_level: text(step.overdue_level || 'none'),
      waiting_label: step.waiting_label ?? null,
    } : null,
    footer: {
      stageLabel: current?.label ?? (completed ? 'Delivered' : 'Payment received'),
      stageCount: Math.max(productionRows.length, 1),
      stageIndex: Math.max(1, stageIndex),
      leftLabel: completed
        ? 'completed'
        : typeof remaining === 'number'
          ? remaining <= 0 ? 'overdue' : `~${formatHours(remaining / 60)} left`
          : '—',
      dueLabel: dueRaw ? formatDue(dueRaw) : '—',
    },
    progress: Math.min(1, (doneCount + (currentIndex === -1 ? 0 : 0.5)) / Math.max(productionRows.length, 1)),
  }
}
