export type CalculatorType = 'flat' | 'booklet' | 'large_format'

export interface CalculatorTypeOption {
  label: string
  value: CalculatorType
  description: string
}

export const calculatorTypeOptions: CalculatorTypeOption[] = [
  {
    label: 'Flat',
    value: 'flat',
    description: 'Standard flat-print jobs with backend pricing and imposition.',
  },
  {
    label: 'Booklet',
    value: 'booklet',
    description: 'Booklet workflows with cover, inserts, binding, and turnaround.',
  },
  {
    label: 'Large Format',
    value: 'large_format',
    description: 'Area-based pricing for banners, posters, stickers, roll-ups, and boards.',
  },
]

export function getCalculatorTypeLabel(type: CalculatorType): string {
  return calculatorTypeOptions.find((option) => option.value === type)?.label ?? 'Flat'
}
