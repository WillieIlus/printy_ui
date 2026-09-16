export type SignupMode = 'buyer' | 'manager' | 'printer'

export interface ModeDef {
  id: SignupMode
  label: string
  tagline: string
  blurb: string
  bullets: string[]
  cta: string
  orgLabel: string
  orgPlaceholder: string
}

export const MODES: ModeDef[] = [
  {
    id: 'buyer',
    label: 'I need printing',
    tagline: 'Buyer',
    blurb: 'Price a job, approve artwork, pay into custody and watch it move.',
    bullets: ['Instant exact quotes', 'Escrow protection', 'Live job tracking'],
    cta: 'Create buyer account',
    orgLabel: 'Company',
    orgPlaceholder: 'Studio North',
  },
  {
    id: 'manager',
    label: 'I coordinate print jobs',
    tagline: 'Print Manager',
    blurb: 'Run many jobs at once. See who has the ball, what\'s late and what\'s at risk.',
    bullets: ['SLA & risk board', 'Printer assignment', 'Dispute handling'],
    cta: 'Create manager account',
    orgLabel: 'Desk or brand',
    orgPlaceholder: 'Fastlane Print Desk',
  },
  {
    id: 'printer',
    label: 'I own the presses',
    tagline: 'Printer',
    blurb: 'Receive jobs that match your kit, run them from the floor, get paid on delivery.',
    bullets: ['Matched job requests', 'Shop-floor controls', 'Guaranteed payout'],
    cta: 'Create printer account',
    orgLabel: 'Print shop',
    orgPlaceholder: 'North Press Co.',
  },
]

export const PRINTER_CAPS = [
  'Offset',
  'Digital',
  'Large format',
  'Binding',
  'Finishing',
  'Foiling',
  'Flexo',
  'Packaging',
]

export function modeLabel(mode: SignupMode) {
  return MODES.find((m) => m.id === mode)?.label ?? 'Printy'
}