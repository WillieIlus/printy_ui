export const PRINTY_COLORS = {
  brand: '#e13515',
  brandDark: '#b82c10',
  ink: '#101828',
  panel: '#1d2939',
  text: '#344054',
  muted: '#667085',
  subtle: '#98a2b3',
  border: '#e4e7ec',
  soft: '#f2f4f7',
  white: '#ffffff',
} as const

export const PRINTY_TYPOGRAPHY = {
  pageTitle: 'text-2xl font-bold',
  sectionTitle: 'text-base font-bold',
  sectionSubtitle: 'text-xs text-slate-400',
  body: 'text-sm text-slate-600',
  meta: 'text-xs text-slate-400',
} as const

export const PRINTY_RADIUS = {
  md: 'rounded-lg',
  lg: 'rounded-xl',
  xl: 'rounded-2xl',
  '2xl': 'rounded-[1.75rem]',
  '3xl': 'rounded-[2rem]',
} as const

export const PRINTY_SHADOW = {
  soft: 'shadow-sm',
  card: 'shadow-[0_24px_70px_-38px_rgba(15,23,42,0.32)]',
  auth: 'shadow-xl shadow-[#1018280d]',
  cta: 'shadow-[0_18px_36px_-22px_rgba(225,53,21,0.9)]',
} as const

export const PRINTY_CONTAINER = {
  sm: 'max-w-3xl',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  '2xl': 'max-w-[90rem]',
  full: 'max-w-none',
} as const

export const PRINTY_SECTION_SPACING = {
  none: '',
  sm: 'py-8',
  md: 'py-12',
  lg: 'py-16',
  xl: 'py-20',
  '2xl': 'py-24',
} as const

export const PRINTY_TABLE = {
  wrapper: 'bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden',
  head: 'bg-slate-50 border-b border-slate-100',
  headCell: 'px-6 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-400',
  body: 'divide-y divide-slate-100',
  row: 'hover:bg-slate-50 transition-colors',
  cell: 'px-6 py-4 text-sm text-slate-600',
  empty: 'px-6 py-10 text-center',
} as const

export const PRINTY_EMPTY_STATE = {
  card: 'rounded-2xl border border-slate-200 bg-slate-50 px-5 py-8 text-center',
  title: 'text-sm font-semibold text-slate-700',
  description: 'mt-1 text-xs text-slate-400',
} as const

export const PRINTY_SHELLS = {
  topbar: {
    light: 'bg-white border-b border-slate-200',
    dark: 'bg-[#0f172a] border-b border-white/10',
  },
  sidebar: {
    light: 'bg-white border-r border-slate-200',
    dark: 'bg-[#0f172a]',
  },
} as const

export const PRINTY_STATUS_VARIANTS = {
  draft: 'bg-slate-50 text-slate-700 border-slate-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  assigned: 'bg-blue-50 text-blue-700 border-blue-200',
  quoted: 'bg-amber-50 text-amber-700 border-amber-200',
  accepted: 'bg-green-50 text-green-700 border-green-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  in_production: 'bg-amber-50 text-amber-700 border-amber-200',
  ready: 'bg-green-50 text-green-700 border-green-200',
  delivered: 'bg-blue-50 text-blue-700 border-blue-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
  verified: 'bg-green-50 text-green-700 border-green-200',
  unverified: 'bg-slate-50 text-slate-600 border-slate-200',
  failed: 'bg-red-50 text-red-700 border-red-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  completed: 'bg-blue-50 text-blue-700 border-blue-200',
  active: 'bg-[#fff4ed] text-[#c4471a] border-[#fed7b5]',
  paid: 'bg-green-50 text-green-700 border-green-200',
  unpaid: 'bg-slate-50 text-slate-700 border-slate-200',
  overdue: 'bg-red-50 text-red-700 border-red-200',
  uploaded: 'bg-blue-50 text-blue-700 border-blue-200',
  missing: 'bg-slate-50 text-slate-700 border-slate-200',
} as const

export const PRINTY_STATUS_BADGE_VARIANTS = {
  draft: 'default',
  pending: 'pending',
  assigned: 'blue',
  quoted: 'pending',
  accepted: 'accepted',
  rejected: 'rejected',
  in_production: 'yellow',
  ready: 'accepted',
  delivered: 'completed',
  cancelled: 'rejected',
  verified: 'verified',
  unverified: 'gray',
  failed: 'rejected',
  warning: 'yellow',
  completed: 'completed',
  active: 'active',
  paid: 'accepted',
  unpaid: 'default',
  overdue: 'rejected',
  uploaded: 'blue',
  missing: 'gray',
} as const

export type PrintyStatusKey = keyof typeof PRINTY_STATUS_VARIANTS
export type PrintyBadgeVariant = 'default' | 'orange' | 'dark' | 'green' | 'red' | 'yellow' | 'blue' | 'gray' | 'verified' | 'pending' | 'accepted' | 'rejected' | 'active' | 'completed'
export type PrintyStatusDomain = 'generic' | 'quote' | 'payment' | 'production' | 'proof' | 'urgency'

function normalizeStatus(status?: string) {
  return String(status || '').toLowerCase().replace(/[\s-]+/g, '_')
}

const domainStatusMap: Partial<Record<PrintyStatusDomain, Record<string, { key: PrintyStatusKey, label: string }>>> = {
  quote: {
    draft: { key: 'draft', label: 'Draft' },
    submitted: { key: 'quoted', label: 'Needs quote' },
    awaiting_response: { key: 'quoted', label: 'Awaiting client' },
    sent: { key: 'quoted', label: 'Awaiting client' },
    accepted: { key: 'accepted', label: 'Accepted' },
    approved: { key: 'accepted', label: 'Approved' },
    paid: { key: 'paid', label: 'Paid' },
    dispatched: { key: 'in_production', label: 'In production' },
    complete: { key: 'completed', label: 'Completed' },
    completed: { key: 'completed', label: 'Completed' },
    rejected: { key: 'rejected', label: 'Declined' },
    declined: { key: 'rejected', label: 'Declined' },
  },
  payment: {
    pending: { key: 'pending', label: 'Payment pending' },
    awaiting_payment: { key: 'pending', label: 'Payment required' },
    required: { key: 'pending', label: 'Payment required' },
    confirmed: { key: 'paid', label: 'Paid' },
    paid: { key: 'paid', label: 'Paid' },
    release_ready: { key: 'paid', label: 'Payment cleared' },
    failed: { key: 'failed', label: 'Failed' },
    refunded: { key: 'unpaid', label: 'Refunded' },
    hold: { key: 'warning', label: 'On hold' },
  },
  production: {
    pending: { key: 'pending', label: 'New assignment' },
    assigned: { key: 'assigned', label: 'New assignment' },
    accepted: { key: 'ready', label: 'Ready to start' },
    ready_to_print: { key: 'ready', label: 'Ready to print' },
    in_production: { key: 'in_production', label: 'In production' },
    printing: { key: 'in_production', label: 'In production' },
    finishing: { key: 'in_production', label: 'Finishing' },
    ready: { key: 'ready', label: 'Ready for handoff' },
    completed: { key: 'completed', label: 'Completed' },
    delivered: { key: 'completed', label: 'Completed' },
    revision_requested: { key: 'failed', label: 'Changes requested' },
  },
  proof: {
    missing: { key: 'missing', label: 'Proof needed' },
    needed: { key: 'missing', label: 'Proof needed' },
    proof_uploaded: { key: 'uploaded', label: 'Awaiting approval' },
    manager_review: { key: 'uploaded', label: 'Awaiting approval' },
    manager_approved: { key: 'quoted', label: 'With client' },
    proof_approved: { key: 'accepted', label: 'Approved' },
    approved: { key: 'accepted', label: 'Approved' },
    revision_requested: { key: 'failed', label: 'Changes requested' },
    rejected: { key: 'failed', label: 'Changes requested' },
  },
  urgency: {
    overdue: { key: 'overdue', label: 'Overdue' },
    today: { key: 'warning', label: 'Due today' },
    none: { key: 'unverified', label: 'No deadline set' },
    future: { key: 'pending', label: 'Scheduled' },
  },
}

function domainStatus(status?: string, domain: PrintyStatusDomain = 'generic') {
  const normalized = normalizeStatus(status)
  return domainStatusMap[domain]?.[normalized] || null
}

export function printyStatusKey(status?: string, domain: PrintyStatusDomain = 'generic'): PrintyStatusKey {
  const domainMatch = domainStatus(status, domain)
  if (domainMatch) return domainMatch.key
  const normalized = normalizeStatus(status)
  if (!normalized) return 'pending'
  if (normalized.includes('overdue')) return 'overdue'
  if (normalized.includes('unverified')) return 'unverified'
  if (normalized.includes('verified')) return 'verified'
  if (normalized.includes('unpaid')) return 'unpaid'
  if (normalized.includes('paid') || normalized.includes('confirm')) return 'paid'
  if (normalized.includes('missing')) return 'missing'
  if (normalized.includes('upload') || normalized.includes('attach')) return 'uploaded'
  if (normalized.includes('warn')) return 'warning'
  if (normalized.includes('fail') || normalized.includes('error') || normalized.includes('issue')) return 'failed'
  if (normalized.includes('deliver')) return 'delivered'
  if (normalized.includes('complete')) return 'completed'
  if (normalized.includes('ready') || normalized.includes('approve')) return 'ready'
  if (normalized.includes('production') || normalized.includes('printing') || normalized.includes('progress')) return 'in_production'
  if (normalized.includes('accept')) return 'accepted'
  if (normalized.includes('assign')) return 'assigned'
  if (normalized.includes('quote') || normalized.includes('review') || normalized.includes('view') || normalized.includes('submit')) return 'quoted'
  if (normalized.includes('reject')) return 'rejected'
  if (normalized.includes('cancel')) return 'cancelled'
  if (normalized.includes('draft')) return 'draft'
  if (normalized.includes('active')) return 'active'
  return 'pending'
}

export function printyStatusVariant(status?: string, domain: PrintyStatusDomain = 'generic') {
  return PRINTY_STATUS_VARIANTS[printyStatusKey(status, domain)]
}

export function printyStatusBadgeVariant(status?: string, domain: PrintyStatusDomain = 'generic'): PrintyBadgeVariant {
  return PRINTY_STATUS_BADGE_VARIANTS[printyStatusKey(status, domain)]
}

export function printyStatusDot(status?: string, domain: PrintyStatusDomain = 'generic') {
  switch (printyStatusKey(status, domain)) {
    case 'accepted':
    case 'ready':
    case 'verified':
    case 'paid':
      return 'bg-green-500'
    case 'assigned':
    case 'uploaded':
    case 'delivered':
    case 'completed':
      return 'bg-blue-500'
    case 'quoted':
    case 'pending':
    case 'warning':
    case 'in_production':
    case 'active':
      return 'bg-amber-500'
    case 'rejected':
    case 'cancelled':
    case 'failed':
    case 'overdue':
      return 'bg-red-500'
    default:
      return 'bg-slate-500'
  }
}

export function printyStatusLabel(status?: string, domain: PrintyStatusDomain = 'generic') {
  const domainMatch = domainStatus(status, domain)
  if (domainMatch) return domainMatch.label
  const key = printyStatusKey(status)
  const labels: Record<PrintyStatusKey, string> = {
    draft: 'Draft',
    pending: 'Pending',
    assigned: 'Assigned',
    quoted: 'Quoted',
    accepted: 'Accepted',
    rejected: 'Rejected',
    in_production: 'In Production',
    ready: 'Ready',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    verified: 'Verified',
    unverified: 'Unverified',
    failed: 'Failed',
    warning: 'Warning',
    completed: 'Completed',
    active: 'Active',
    paid: 'Paid',
    unpaid: 'Unpaid',
    overdue: 'Overdue',
    uploaded: 'Uploaded',
    missing: 'Missing',
  }
  if (status && String(status).includes('_')) {
    return String(status)
      .replace(/[_-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\b\w/g, (char) => char.toUpperCase()) || labels[key]
  }
  if (status && String(status).includes('-')) {
    return String(status)
      .replace(/[_-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\b\w/g, (char) => char.toUpperCase()) || labels[key]
  }
  if (status && String(status).trim() && !/^[a-z_ -]+$/i.test(String(status))) {
    return String(status)
  }
  return labels[key] || String(status || 'pending')
}

export function printyDueStatus(value: unknown) {
  if (!value) {
    return {
      status: 'none',
      label: 'No deadline set',
      variant: printyStatusBadgeVariant('none', 'urgency'),
      className: 'text-slate-700',
    }
  }
  const due = new Date(String(value))
  if (Number.isNaN(due.getTime())) {
    return {
      status: 'none',
      label: 'No deadline set',
      variant: printyStatusBadgeVariant('none', 'urgency'),
      className: 'text-slate-700',
    }
  }
  const today = new Date()
  const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate()).getTime()
  const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
  const dateLabel = new Intl.DateTimeFormat('en-KE', { day: 'numeric', month: 'short' }).format(due)
  if (dueDay < todayDay) {
    return {
      status: 'overdue',
      label: `Overdue / ${dateLabel}`,
      variant: printyStatusBadgeVariant('overdue', 'urgency'),
      className: 'text-red-700',
    }
  }
  if (dueDay === todayDay) {
    return {
      status: 'today',
      label: `Due today / ${dateLabel}`,
      variant: printyStatusBadgeVariant('today', 'urgency'),
      className: 'text-amber-700',
    }
  }
  return {
    status: 'future',
    label: `Due ${dateLabel}`,
    variant: printyStatusBadgeVariant('future', 'urgency'),
    className: 'text-slate-700',
  }
}
