/**
 * The buyer calculator spec — a typed record of the backend calculator
 * vocabulary. It is the exact payload sent to `POST /calculator/public-preview/`
 * and stored as `calculator_inputs_snapshot` on drafts, so no translation layer
 * needs to exist between what the UI shows and what the backend prices.
 */

import {
  configProduct,
  optionLabel,
  optionValue,
  type CalculatorConfig,
  type CalculatorProductConfig,
} from '~/shared/calculator-config'

export interface CalculatorSpec {
  product_type: string
  quantity: number
  finished_size?: string
  width_mm?: number
  height_mm?: number
  requested_gsm?: number
  requested_paper_category?: string
  print_sides?: string
  color_mode?: string
  lamination?: string
  corner_rounding?: boolean
  folding?: string
  shape?: string
  cut_type?: string
  total_pages?: number
  cover_stock?: string
  insert_stock?: string
  cover_lamination?: string
  binding_type?: string
  cutting?: boolean
  material_type?: string
  product_subtype?: string
  urgency_type?: string
}

const SPEC_KEYS: Array<keyof CalculatorSpec> = [
  'product_type',
  'quantity',
  'finished_size',
  'width_mm',
  'height_mm',
  'requested_gsm',
  'requested_paper_category',
  'print_sides',
  'color_mode',
  'lamination',
  'corner_rounding',
  'folding',
  'shape',
  'cut_type',
  'total_pages',
  'cover_stock',
  'insert_stock',
  'cover_lamination',
  'binding_type',
  'cutting',
  'material_type',
  'product_subtype',
  'urgency_type',
]

const BOOLEAN_KEYS: ReadonlySet<keyof CalculatorSpec> = new Set(['corner_rounding', 'cutting'])
const NUMBER_KEYS: ReadonlySet<keyof CalculatorSpec> = new Set(['quantity', 'width_mm', 'height_mm', 'requested_gsm', 'total_pages'])

function coerce(key: keyof CalculatorSpec, value: unknown): unknown {
  if (value === undefined || value === null || value === '') {
    return undefined
  }
  if (BOOLEAN_KEYS.has(key)) {
    return value === true || value === 'true' || value === 1 || value === '1' ? true : false
  }
  if (NUMBER_KEYS.has(key)) {
    const n = typeof value === 'number' ? value : Number(value)
    return Number.isFinite(n) ? n : undefined
  }
  return String(value)
}

/**
 * Builds a fresh spec for a product from its backend defaults. Paper is
 * requested by category + gsm; when the product declares no paper request
 * defaults, the fields stay unset so the backend's product paper defaults and
 * "complete your spec" gating drive the flow instead of a fabricated stock.
 */
export function makeDefaultSpec(
  product: CalculatorProductConfig | null,
  config: CalculatorConfig | null,
  previous?: CalculatorSpec | null,
): CalculatorSpec {
  const prev: Record<string, unknown> = previous && previous.product_type === product?.key ? { ...previous } : {}
  const spec: Record<string, unknown> = {
    ...prev,
    product_type: product?.key ?? (typeof prev.product_type === 'string' ? prev.product_type : ''),
  }

  if (product) {
    for (const key of SPEC_KEYS) {
      if (key === 'product_type') {
        continue
      }
      if (prev[key] !== undefined) {
        spec[key] = prev[key]
        continue
      }
      if (Object.prototype.hasOwnProperty.call(product.defaults, key)) {
        const coerced = coerce(key, (product.defaults as Record<string, unknown>)[key])
        if (coerced !== undefined) {
          spec[key] = coerced
        }
      }
    }
  }

  const quantity = typeof spec.quantity === 'number' && spec.quantity > 0 ? spec.quantity : 100
  spec.quantity = quantity

  if (typeof spec.finished_size !== 'string' || !spec.finished_size) {
    delete spec.finished_size
  }

  return spec as unknown as CalculatorSpec
}

export function isSpec(value: unknown): value is CalculatorSpec {
  if (!value || typeof value !== 'object') {
    return false
  }
  const r = value as Record<string, unknown>
  return typeof r.product_type === 'string' && typeof r.quantity === 'number'
}

/**
 * Restores a persisted/server snapshot into a valid spec for a product,
 * keeping only known keys that survive backend coercion.
 */
export function normalizeSpec(raw: unknown, product: CalculatorProductConfig | null, config: CalculatorConfig | null, fallback?: CalculatorSpec | null): CalculatorSpec {
  const spec = makeDefaultSpec(product, config, fallback)
  if (!raw || typeof raw !== 'object') {
    return spec
  }
  const r = raw as Record<string, unknown>
  for (const key of SPEC_KEYS) {
    if (key === 'product_type') {
      continue
    }
    const coerc = coerce(key, r[key])
    if (coerc !== undefined) {
      ;(spec as unknown as Record<string, unknown>)[key] = coerc
    }
  }
  if (typeof spec.quantity !== 'number' || spec.quantity <= 0) {
    spec.quantity = 100
  }
  return spec as CalculatorSpec
}

export function specValues(spec: CalculatorSpec, key: keyof CalculatorSpec) {
  return spec[key]
}

/** Payload for `POST /calculator/public-preview/`; null when unsupported. */
export function buildPublicPreviewPayload(spec: CalculatorSpec | null | undefined): Record<string, unknown> | null {
  if (!spec || typeof spec.product_type !== 'string' || !spec.product_type) {
    return null
  }
  return { ...specPublicPayload(spec) }
}

/** Strips undefined/empty values so the payload only contains real choices. */
export function specPublicPayload(spec: CalculatorSpec): Record<string, string | number | boolean> {
  const payload: Record<string, string | number | boolean> = {}
  for (const key of SPEC_KEYS) {
    const value = spec[key]
    if (value === undefined || value === null || value === '') {
      continue
    }
    if (key === 'finished_size' && value === 'custom') {
      continue
    }
    payload[key] = value as string | number | boolean
  }
  if (spec.finished_size === 'custom' && spec.width_mm && spec.height_mm) {
    payload.width_mm = spec.width_mm
    payload.height_mm = spec.height_mm
  }
  return payload
}

/**
 * Human label for the paper request, composed from the requested category
 * (resolved against the config's paper category list) and the requested GSM.
 */
export function specPaperLabel(spec: CalculatorSpec, config: CalculatorConfig | null): string {
  const parts: string[] = []
  const category = spec.requested_paper_category
  if (category) {
    const option = config?.paper_categories?.find((o) => optionValue(o) === category)
    parts.push(option ? optionLabel(option) : category)
  }
  if (spec.requested_gsm) {
    parts.push(`${spec.requested_gsm}gsm`)
  }
  return parts.join(' ')
}

/** Query params for `GET /intake/recommended-managers/`. */
export function buildIntakeQuery(spec: CalculatorSpec, config: CalculatorConfig | null): Record<string, string | number> {
  const query: Record<string, string | number> = { quantity: spec.quantity }
  if (spec.product_type) {
    query.product_type = spec.product_type
  }
  const size = spec.finished_size && spec.finished_size !== 'custom'
    ? spec.finished_size
    : spec.width_mm && spec.height_mm
      ? `${spec.width_mm}x${spec.height_mm}mm`
      : ''
  if (size) {
    query.size = size
  }
  if (spec.requested_gsm) {
    query.paper_gsm = spec.requested_gsm
  }
  return query
}

export { optionValue }