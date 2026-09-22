/**
 * Types mirroring the backend `GET /calculator/config/` serializer
 * (printy_api.workflow_serializers.CalculatorConfigSerializer).
 *
 * The backend config is the single source of truth for the buyer calculator:
 * which products exist, what fields each product exposes, which sizes, paper
 * stocks, print sides, color modes and finishings are selectable, and what the
 * default values are. The UI never hard-codes any of this.
 */

export interface CalculatorSizeOption {
  value: string
  label: string
  width_mm: number
  height_mm: number
}

export interface CalculatorPaperStock {
  key: string
  label: string
  display_name: string
  category: string
  category_label: string
  gsm: number
  paper_type: string
  is_cover_stock: boolean
  is_insert_stock: boolean
  is_sticker_stock: boolean
  is_specialty: boolean
}

/** Select options are heterogeneous across products (sizes, stocks, enums). */
export interface CalculatorFieldOption {
  value?: string | number
  key?: string
  label?: string
  display_name?: string
  description?: string | null
  help_text?: string | null
  gsm?: number
  recommended?: boolean
  [additional: string]: unknown
}

export interface CalculatorConfigField {
  key: string
  label: string
  type: 'number' | 'select' | 'boolean'
  required: boolean
  help_text?: string | null
  options?: CalculatorFieldOption[] | null
}

export interface CalculatorProductConfig {
  key: string
  label: string
  required_fields: string[]
  optional_fields: string[]
  defaults: Record<string, unknown>
  allowed_paper_categories?: string[] | null
  allowed_cover_categories?: string[] | null
  allowed_insert_categories?: string[] | null
  allowed_finishings?: string[] | null
  allowed_print_sides?: string[] | null
  allow_custom_size: boolean
  allow_custom_paper_request: boolean
  sizes?: CalculatorSizeOption[] | null
  size_options?: CalculatorSizeOption[] | null
  paper_options?: CalculatorFieldOption[] | null
  cover_paper_options?: CalculatorFieldOption[] | null
  insert_paper_options?: CalculatorFieldOption[] | null
  fields: CalculatorConfigField[]
  color_mode_options?: CalculatorFieldOption[] | null
}

export interface CalculatorConfig {
  products: CalculatorProductConfig[]
  paper_categories: CalculatorFieldOption[]
  paper_stocks: CalculatorPaperStock[]
  finishings: Array<{ key: string; label: string; slug: string; category: string; help_text?: string }>
  sizes: Record<string, CalculatorSizeOption[]>
  print_sides: CalculatorFieldOption[]
  color_modes: CalculatorFieldOption[]
  preview_endpoint?: string
}

/** Normalized select option ready for the UI (value + label + metadata). */
export interface NormalizedOption {
  value: string
  label: string
  sub?: string
  meta: CalculatorFieldOption
}

/** A field option's payload key — `key` for stocks, `value` for enums. */
export function optionValue(option: CalculatorFieldOption): string {
  if (option.value !== undefined && option.value !== null) {
    return String(option.value)
  }
  if (option.key !== undefined && option.key !== null) {
    return String(option.key)
  }
  return ''
}

export function optionLabel(option: CalculatorFieldOption): string {
  return (option.label ?? option.display_name ?? '').trim() || optionValue(option)
}

export function configProduct(config: CalculatorConfig | null, productKey: string | undefined | null): CalculatorProductConfig | null {
  if (!config) {
    return null
  }
  return config.products.find((p) => p.key === productKey) ?? null
}

export function configProductFirst(config: CalculatorConfig | null): CalculatorProductConfig | null {
  return config?.products[0] ?? null
}

export function configProductLabel(config: CalculatorConfig | null, productKey: string | undefined | null): string {
  return configProduct(config, productKey)?.label ?? productKey ?? 'Print job'
}

export function configProductField(product: CalculatorProductConfig | null, fieldKey: string): CalculatorConfigField | null {
  return product?.fields.find((f) => f.key === fieldKey) ?? null
}

/** Resolves the ranks/gsm of a paper stock key from the config's stock list. */
export function stockLookup(config: CalculatorConfig | null, stockKey: string | undefined | null): CalculatorPaperStock | null {
  if (!config || !stockKey) {
    return null
  }
  return config.paper_stocks.find((s) => s.key === stockKey) ?? null
}

export function stockLabel(config: CalculatorConfig | null, stockKey: string | undefined | null): string {
  return stockLookup(config, stockKey)?.display_name ?? stockKey ?? ''
}

export function formatSizeMm(widthMm: number | undefined | null, heightMm: number | undefined | null): string {
  if (!widthMm || !heightMm) {
    return ''
  }
  return `${widthMm} x ${heightMm} mm`
}

/** Human-facing microcopy for a selectable size (mirrors the old rate-card helper). */
export function sizeSupportCopy(size: CalculatorSizeOption): string | undefined {
  const raw = String(size.value ?? '').toLowerCase()
  if (raw.includes('90x55')) {
    return 'Standard card'
  }
  if (raw.includes('85x55')) {
    return 'Euro card'
  }
  const w = Number(size.width_mm)
  const h = Number(size.height_mm)
  if (raw.includes('square') || (Number.isFinite(w) && Number.isFinite(h) && w > 0 && h > 0 && w === h)) {
    return 'Square format'
  }
  return undefined
}

/** Paper tier label derived from grammage (mirrors the old rate-card chip copy). */
export function stockTierLabel(stock: CalculatorPaperStock | CalculatorFieldOption): string | undefined {
  const gsm = Number(stock.gsm ?? (stock as CalculatorFieldOption).weight_gsm ?? 0)
  if (!gsm) {
    return undefined
  }
  if (gsm >= 400) {
    return 'Luxury'
  }
  if (gsm >= 340) {
    return 'Premium'
  }
  if (gsm >= 280) {
    return 'Standard'
  }
  return 'Budget'
}

/** Ink-coverage microcopy for a color mode (mirrors the old helper). */
export function colorModeCopy(option: CalculatorFieldOption): string | undefined {
  const value = String(option.value ?? option.key ?? '').toUpperCase()
  if (value.includes('BW') || value.includes('BLACK')) {
    return 'Lower ink coverage'
  }
  if (value.includes('COVER_COLOR')) {
    return 'Mixed inside pages'
  }
  return undefined
}

/** Support line for product cards: how many sizes are configured. */
export function productSupportCopy(product: CalculatorProductConfig): string {
  const sizes = product.size_options && product.size_options.length > 0 ? product.size_options : (product.sizes ?? [])
  if (sizes.length > 0) {
    return `${sizes.length} configured size${sizes.length === 1 ? '' : 's'}`
  }
  return 'Live product'
}

/**
 * The options a select field offers, resolved from every source the backend
 * exposes (field options, product size/paper presets, and the config-level
 * print-sides/color-mode lists), normalized to `{ value, label, sub, meta }`.
 */
export function selectFieldOptions(
  product: CalculatorProductConfig | null,
  field: CalculatorConfigField | null,
  config: CalculatorConfig | null,
): NormalizedOption[] {
  if (!product || !field) {
    return []
  }
  if (field.options && field.options.length > 0) {
    return field.options.map((o) => {
      const value = optionValue(o)
      let sub: string | undefined
      if (typeof o.width_mm === 'number' && typeof o.height_mm === 'number') {
        sub = formatSizeMm(o.width_mm, o.height_mm)
      } else if (typeof o.gsm === 'number') {
        sub = `${o.gsm}gsm`
      }
      return { value, label: optionLabel(o), sub, meta: o }
    })
  }

  if (field.key === 'finished_size') {
    const sizes = product.sizes && product.sizes.length > 0
      ? product.sizes
      : (config?.sizes[product.key] ?? [])
    return sizes.map((s) => ({
      value: s.value,
      label: s.label,
      sub: sizeSupportCopy(s) ?? formatSizeMm(s.width_mm, s.height_mm),
      meta: s as unknown as CalculatorFieldOption,
    }))
  }

  if (field.key === 'paper_stock' || field.key === 'cover_stock' || field.key === 'insert_stock') {
    const source = field.key === 'cover_stock'
      ? (product.cover_paper_options ?? product.paper_options)
      : field.key === 'insert_stock'
        ? (product.insert_paper_options ?? product.paper_options)
        : product.paper_options
    if (source && source.length > 0) {
      return source.map((o) => ({
        value: optionValue(o),
        label: optionLabel(o),
        sub: typeof o.gsm === 'number' ? `${o.gsm}gsm` : undefined,
        meta: o,
      }))
    }
  }

  if (field.key === 'color_mode') {
    const source = product.color_mode_options && product.color_mode_options.length > 0
      ? product.color_mode_options
      : (config?.color_modes ?? [])
    return source.map((o) => ({ value: optionValue(o), label: optionLabel(o), sub: colorModeCopy(o), meta: o }))
  }

  if (field.key === 'print_sides') {
    if (product.allowed_print_sides && product.allowed_print_sides.length > 0) {
      return product.allowed_print_sides.map((value) => ({
        value,
        label: value === 'DUPLEX' ? 'Double sided' : 'Single sided',
        meta: { value } as CalculatorFieldOption,
      }))
    }
    return (config?.print_sides ?? []).map((o) => ({ value: optionValue(o), label: optionLabel(o), meta: o }))
  }

  return []
}

/** Fields the UI should actually render for a product (drops empty selects). */
export function visibleFields(product: CalculatorProductConfig | null, config: CalculatorConfig | null): CalculatorConfigField[] {
  if (!product) {
    return []
  }
  return product.fields.filter((field) => {
    if (field.type !== 'select') {
      return true
    }
    return selectFieldOptions(product, field, config).length > 0
  })
}