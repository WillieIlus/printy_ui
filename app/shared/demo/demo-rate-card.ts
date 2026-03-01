/**
 * Demo rate card for landing page quote simulator.
 * Mock prices only — NOT real API data.
 */

export const UNITS = ['A5', 'A4', 'A3', 'SRA3', 'SQM'] as const
export type DemoUnit = (typeof UNITS)[number]

export const GSM_OPTIONS = [130, 150, 300, 350] as const
export type DemoGsm = (typeof GSM_OPTIONS)[number]

export const LARGE_FORMAT_MATERIALS = ['banner', 'vinyl', 'reflective'] as const
export type DemoLargeFormatMaterial = (typeof LARGE_FORMAT_MATERIALS)[number]

/** Printing rates per unit: one-sided and duplex (duplex is discounted, not 2x) */
export const printingRates: Record<
  Exclude<DemoUnit, 'SQM'>,
  { oneSided: number; duplexPerSheet: number }
> = {
  A5: { oneSided: 1.2, duplexPerSheet: 2.0 },
  A4: { oneSided: 1.8, duplexPerSheet: 3.0 },
  A3: { oneSided: 3.5, duplexPerSheet: 5.5 },
  SRA3: { oneSided: 4.2, duplexPerSheet: 6.8 },
}

/** Paper rates: (unit, gsm) => price per sheet (KES) */
export const paperRates: Record<
  Exclude<DemoUnit, 'SQM'>,
  Partial<Record<DemoGsm, number>>
> = {
  A5: { 130: 0.8, 150: 1.0, 300: 1.8, 350: 2.2 },
  A4: { 130: 1.2, 150: 1.5, 300: 2.8, 350: 3.4 },
  A3: { 130: 2.4, 150: 3.0, 300: 5.6, 350: 6.8 },
  SRA3: { 130: 2.8, 150: 3.5, 300: 6.5, 350: 8.0 },
}

/** Large format material rates: price per m² (KES) */
export const largeFormatMaterials: Record<DemoLargeFormatMaterial, number> = {
  banner: 450,
  vinyl: 680,
  reflective: 920,
}

/** Large format printing: price per m² (KES) */
export const largeFormatPrintingPerSqm = 180

/** Finishing rates for demo */
export const finishingRates = {
  laminationPerSheet: 2.5,
  roundingPerPiece: 0.15,
  foldingPerPiece: 0.08,
  bindingPerPiece: 0.25,
} as const

/** Impressions per parent sheet (SRA3) for digital */
export const impressionsPerSheet: Record<Exclude<DemoUnit, 'SQM'>, number> = {
  A5: 8,
  A4: 4,
  A3: 1,
  SRA3: 1,
}

/** Preset for quote simulator (used by template gallery) */
export interface SimulatorPreset {
  templateName: string
  unit: DemoUnit
  sides?: 1 | 2
  quantity: number
  gsm?: DemoGsm
  material?: DemoLargeFormatMaterial
  widthM?: number
  heightM?: number
  finishing?: {
    lamination?: boolean
    rounding?: boolean
    folding?: boolean
    binding?: boolean
  }
}
