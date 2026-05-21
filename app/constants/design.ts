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
export type PrintyBadgeVariant = typeof PRINTY_STATUS_BADGE_VARIANTS[PrintyStatusKey]

export function printyStatusKey(status?: string): PrintyStatusKey {
  const normalized = String(status || '').toLowerCase()
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

export function printyStatusVariant(status?: string) {
  return PRINTY_STATUS_VARIANTS[printyStatusKey(status)]
}

export function printyStatusBadgeVariant(status?: string): PrintyBadgeVariant {
  return PRINTY_STATUS_BADGE_VARIANTS[printyStatusKey(status)]
}

export function printyStatusDot(status?: string) {
  switch (printyStatusKey(status)) {
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

export function printyStatusLabel(status?: string) {
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
