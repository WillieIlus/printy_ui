export interface CalculatorPaperSource {
  id: number
  sheet_size: string
  gsm: number
  paper_type: string
}

export interface CalculatorPaperRecord {
  id: number
  sheetSize: string
  gsm: number
  paperType: string
  label: string
}

export interface CalculatorOption<T = string | number> {
  label: string
  value: T
}

export interface CalculatorPaperCatalog {
  records: CalculatorPaperRecord[]
  sheetSizes: CalculatorOption<string>[]
  paperTypes: CalculatorOption<string>[]
  gsms: CalculatorOption<number>[]
}

function normalizeText(value: unknown) {
  return String(value ?? '').trim()
}

function uniqueOptions<T extends string | number>(values: T[], formatter?: (value: T) => string): CalculatorOption<T>[] {
  return Array.from(new Set(values))
    .filter(value => value !== '' && value !== null && value !== undefined)
    .map(value => ({
      value,
      label: formatter ? formatter(value) : String(value),
    }))
}

export function buildCalculatorPaperCatalog(source: Array<CalculatorPaperSource | Record<string, unknown>>) {
  const records: CalculatorPaperRecord[] = source
    .map((entry) => {
      const id = Number(entry.id)
      const sheetSize = normalizeText(entry.sheet_size)
      const gsm = Number(entry.gsm)
      const paperType = normalizeText(entry.paper_type)
      if (!Number.isFinite(id) || !sheetSize || !Number.isFinite(gsm) || !paperType) return null
      return {
        id,
        sheetSize,
        gsm,
        paperType,
        label: `${sheetSize} - ${gsm}gsm - ${paperType}`,
      } satisfies CalculatorPaperRecord
    })
    .filter((entry): entry is CalculatorPaperRecord => Boolean(entry))

  return {
    records,
    sheetSizes: uniqueOptions(records.map(record => record.sheetSize)),
    paperTypes: uniqueOptions(records.map(record => record.paperType)),
    gsms: uniqueOptions(records.map(record => record.gsm), value => `${value}gsm`),
  } satisfies CalculatorPaperCatalog
}

export function filterCalculatorPaperTypes(records: CalculatorPaperRecord[], sheetSize: string | null | undefined) {
  const filtered = sheetSize
    ? records.filter(record => record.sheetSize === sheetSize)
    : records
  return uniqueOptions(filtered.map(record => record.paperType))
}

export function filterCalculatorPaperGsms(
  records: CalculatorPaperRecord[],
  options: { sheetSize?: string | null, paperType?: string | null } = {},
) {
  const filtered = records.filter((record) => {
    if (options.sheetSize && record.sheetSize !== options.sheetSize) return false
    if (options.paperType && record.paperType !== options.paperType) return false
    return true
  })
  return uniqueOptions(filtered.map(record => record.gsm), value => `${value}gsm`)
}

export function findCalculatorPaperRecord(
  records: CalculatorPaperRecord[],
  options: { sheetSize?: string | null, paperType?: string | null, gsm?: number | null },
) {
  const exact = records.find((record) =>
    (!options.sheetSize || record.sheetSize === options.sheetSize)
    && (!options.paperType || record.paperType === options.paperType)
    && (!options.gsm || record.gsm === options.gsm),
  )
  if (exact) return exact

  const sameSheetAndType = records.find((record) =>
    (!options.sheetSize || record.sheetSize === options.sheetSize)
    && (!options.paperType || record.paperType === options.paperType),
  )
  if (sameSheetAndType) return sameSheetAndType

  const sameSheet = records.find((record) => !options.sheetSize || record.sheetSize === options.sheetSize)
  return sameSheet ?? records[0] ?? null
}
