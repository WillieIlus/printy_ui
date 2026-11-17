import { kes } from './next-format'

export type SetupNumbers = {
  oneSidePrice: number | null
  heavyFromGsm: number | null
  heavyAmount: number | null
  twoSideMode: 'twice' | 'price'
  twoSidePrice: number | null
}

export type DerivedRow = {
  paperId: string
  print1s: number
  print2s: number | null
  surcharge: number
  total1s: number
  total2s: number | null
  quote1s: number
  quote2s: number | null
  oneSideOnly: boolean
}

export type PaperRow = {
  id: string
  name: string
  gsm: number
  sizeLabel: string
  finishLabel: string
  oneSideOnly: boolean
  suggested: boolean
  on: boolean
  paperCost: number
  defaultPaperCost: number
  derived: DerivedRow
  overrides: Record<string, number>
}

export type ServiceRow = {
  id: string
  name: string
  groupName: string
  billUnit: string
  plainNote: string
  on: boolean
  rate: number
  minimum: number
  defaultRate: number
  defaultMinimum: number
  exampleLabel: string
  exampleAmountLabel: string
}

export type SetupState = {
  shopName: string
  numbers: SetupNumbers
  papers: PaperRow[]
  services: ServiceRow[]
  confirmedAt: string | null
  updatedAt: string
  warnings: string[]
}

export type SetupProgress = {
  percent: number
  missing: string[]
  nextAction: { step: number; label: string } | null
  confirmed: boolean
}

export type PreviewDto = {
  sampleLabel: string
  lines: { label: string; amountLabel: string }[]
  note: string
}

export type SetupBundle = {
  setup: SetupState
  progress: SetupProgress
  preview: PreviewDto
  raw?: any
}

const r2 = (n: number) => Math.round(n * 100) / 100

function numberOrNull(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

export function deriveRow(paper: { id: string; gsm: number; oneSideOnly: boolean; paperCost: number }, setup: SetupNumbers): DerivedRow {
  const base = setup.oneSidePrice ?? 0
  const print1s = r2(base)
  const print2s = paper.oneSideOnly
    ? null
    : setup.twoSideMode === 'price' && setup.twoSidePrice !== null
      ? r2(setup.twoSidePrice)
      : r2(base * 2)
  const surcharge = setup.heavyFromGsm !== null && setup.heavyAmount !== null && paper.gsm >= setup.heavyFromGsm
    ? r2(setup.heavyAmount)
    : 0
  const total1s = r2(paper.paperCost + print1s + surcharge)
  const total2s = print2s === null ? null : r2(paper.paperCost + print2s + surcharge)
  return {
    paperId: paper.id,
    print1s,
    print2s,
    surcharge,
    total1s,
    total2s,
    quote1s: total1s,
    quote2s: total2s,
    oneSideOnly: paper.oneSideOnly,
  }
}

export function serviceExample(billUnit: string, rate: number, minimum: number): { label: string; amount: number } {
  const units = billUnit === 'job' ? 1 : 100
  const noun = billUnit === 'job' ? 'job' : billUnit === 'sheet' ? 'sheets' : billUnit === 'book' ? 'books' : 'pieces'
  const raw = billUnit === 'job' ? rate : rate * units
  return { label: billUnit === 'job' ? '1 job' : `100 ${noun}`, amount: r2(Math.max(minimum, raw)) }
}

export function setupWarnings(rows: DerivedRow[], papers: { id: string; name: string; paperCost: number }[]): string[] {
  const out: string[] = []
  for (const row of rows) {
    const paper = papers.find((p) => p.id === row.paperId)
    if (!paper) continue
    if (paper.paperCost > row.total1s) {
      out.push(`${paper.name}: the paper alone costs more than the price you charge. Is that right?`)
    }
  }
  return out
}

export function fromRateCard(payload: any): SetupBundle {
  const master = payload?.master_settings ?? {}
  const numbers: SetupNumbers = {
    oneSidePrice: numberOrNull(master.single_print),
    heavyFromGsm: numberOrNull(master.surcharge_threshold_gsm),
    heavyAmount: numberOrNull(master.surcharge),
    twoSideMode: numberOrNull(master.double_print) !== null ? 'price' : 'twice',
    twoSidePrice: numberOrNull(master.double_print),
  }
  const papers: PaperRow[] = (payload?.paper_rows ?? []).map((row: any) => {
    const src = {
      id: String(row.key),
      gsm: Number(row.gsm ?? 0),
      oneSideOnly: row.supports_double_side === false,
      paperCost: Number(row.paper_base_price ?? 0),
    }
    const derived = deriveRow(src, numbers)
    return {
      id: src.id,
      name: row.paper_name || row.label || 'Paper',
      gsm: src.gsm,
      sizeLabel: row.size || '',
      finishLabel: row.paper_type || row.category || '',
      oneSideOnly: src.oneSideOnly,
      suggested: true,
      on: Boolean(row.active),
      paperCost: src.paperCost,
      defaultPaperCost: src.paperCost,
      derived,
      overrides: {},
    }
  })
  const services: ServiceRow[] = (payload?.finishing_rows ?? []).map((row: any) => {
    const billUnit = row.unit === 'job' || row.pricing_mode === 'flat_per_job' ? 'job' : row.unit === 'book' ? 'book' : 'piece'
    const rate = Number(row.price ?? 0)
    const minimum = Number(row.minimum_charge ?? 0)
    const example = serviceExample(billUnit, rate, minimum)
    return {
      id: String(row.key),
      name: row.label || row.name || 'Finishing',
      groupName: row.pricing_mode === 'flat_per_job' ? 'Flat per job' : 'Per unit',
      billUnit,
      plainNote: row.help_text || '',
      on: Boolean(row.active),
      rate,
      minimum,
      defaultRate: rate,
      defaultMinimum: minimum,
      exampleLabel: example.label,
      exampleAmountLabel: kes(example.amount),
    }
  })
  const state: SetupState = {
    shopName: payload?.shop_details?.shop_name || 'Your shop',
    numbers,
    papers,
    services,
    confirmedAt: payload?.setup_status?.is_confirmed || payload?.is_confirmed || payload?.completed ? (payload?.updated_at ?? '') : null,
    updatedAt: payload?.updated_at ?? '',
    warnings: [],
  }
  state.warnings = setupWarnings(
    papers.filter((p) => p.on).map((p) => p.derived),
    papers.filter((p) => p.on).map((p) => ({ id: p.id, name: p.name, paperCost: p.paperCost })),
  )
  return {
    setup: state,
    progress: progressOf(state),
    preview: previewOf(state),
    raw: payload,
  }
}

export function toRateCardPayload(bundle: SetupBundle): Record<string, unknown> {
  const raw = bundle.raw ?? {}
  const setup = bundle.setup
  const paperById = new Map(setup.papers.map((p) => [p.id, p]))
  const serviceById = new Map(setup.services.map((s) => [s.id, s]))
  return {
    paper_rows: (raw.paper_rows ?? []).map((row: any) => {
      const mine = paperById.get(String(row.key))
      if (!mine) return row
      return {
        ...row,
        paper_base_price: mine.paperCost.toFixed(2),
        active: mine.on,
      }
    }),
    finishing_rows: (raw.finishing_rows ?? []).map((row: any) => {
      const mine = serviceById.get(String(row.key))
      if (!mine) return row
      return {
        ...row,
        price: mine.rate.toFixed(2),
        minimum_charge: mine.minimum ? mine.minimum.toFixed(2) : null,
        active: mine.on,
      }
    }),
    shop_details: raw.shop_details,
    master_settings: {
      ...(raw.master_settings ?? {}),
      single_print: (setup.numbers.oneSidePrice ?? 0).toFixed(2),
      double_print: setup.numbers.twoSideMode === 'price' && setup.numbers.twoSidePrice !== null
        ? setup.numbers.twoSidePrice.toFixed(2)
        : null,
      surcharge: (setup.numbers.heavyAmount ?? 0).toFixed(2),
      surcharge_threshold_gsm: setup.numbers.heavyFromGsm ?? 0,
    },
    expected_version: raw.version ?? '0',
  }
}

export function progressOf(setup: SetupState): SetupProgress {
  const missing: string[] = []
  let next: SetupProgress['nextAction'] = null
  const push = (step: number, label: string, detail: string) => {
    missing.push(detail)
    if (!next) next = { step, label }
  }
  const onPapers = setup.papers.filter((p) => p.on)
  if (onPapers.length === 0) push(1, 'Pick your papers', 'Step 1: switch on at least one paper.')
  if (setup.numbers.oneSidePrice === null) push(2, 'Set your one-side printing price', 'Step 2: what do you charge to print one sheet?')
  if (onPapers.some((p) => p.paperCost <= 0)) push(3, 'Add what each paper costs you', 'Step 3: a paper cost is missing or zero.')
  if (setup.services.filter((s) => s.on).length === 0) push(4, 'Switch on at least one finishing service', 'Step 4: finishing is empty.')
  const done = 4 - new Set(missing.map((m) => m.slice(0, 6))).size
  const confirmed = setup.confirmedAt !== null
  return {
    percent: confirmed ? 100 : Math.round((Math.max(0, done) / 4) * 90),
    missing,
    nextAction: next,
    confirmed,
  }
}

export function previewOf(setup: SetupState): PreviewDto {
  const card = setup.papers.find((p) => p.on) ?? setup.papers[0]
  const qty = 100
  if (!card || setup.numbers.oneSidePrice === null) {
    return {
      sampleLabel: '100 business cards',
      lines: [],
      note: 'Set your one-side printing price to see a live preview.',
    }
  }
  const one = card.derived.quote1s * qty
  const two = card.derived.quote2s === null ? null : card.derived.quote2s * qty
  return {
    sampleLabel: `100 business cards · ${card.name}`,
    lines: [
      { label: '1 side, printed and cut', amountLabel: kes(one) },
      ...(two === null
        ? [{ label: '2 sides', amountLabel: 'One side only' }]
        : [{ label: '2 sides, printed and cut', amountLabel: kes(two) }]),
    ],
    note: 'Your own price, before any Printy printer-side fee. No client data is used.',
  }
}
