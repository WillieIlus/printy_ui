import type { ManagedJobStatus } from '~/shared/types/job'

const WORKFLOW_LABELS: Record<string, string> = {
  draft: 'Draft',
  quoted: 'Quoted',
  awaiting_payment: 'Awaiting payment',
  payment_confirmed: 'Payment confirmed',
  assigned: 'Assigned',
  in_production: 'In production',
  finishing: 'Finishing',
  ready: 'Ready',
  delivered: 'Delivered',
  completed: 'Completed',
  disputed: 'Disputed',
  cancelled: 'Cancelled',
}

export function canonicalWorkflowLabel(status: ManagedJobStatus | string | null | undefined): string {
  if (!status) return 'Unknown'
  return WORKFLOW_LABELS[status] ?? String(status)
}

export function canonicalWorkflowTone(status: ManagedJobStatus | string | null | undefined): string {
  switch (status) {
    case 'completed':
      return 'success'
    case 'disputed':
    case 'cancelled':
      return 'danger'
    case 'payment_confirmed':
    case 'assigned':
    case 'in_production':
    case 'finishing':
    case 'ready':
    case 'delivered':
      return 'info'
    case 'quoted':
    case 'awaiting_payment':
      return 'warning'
    default:
      return 'neutral'
  }
}
