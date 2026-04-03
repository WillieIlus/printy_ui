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
    description: 'Booklet workflows are being prepared on the shared backend engine.',
  },
  {
    label: 'Large Format',
    value: 'large_format',
    description: 'Large-format workflows will appear here once the shared surface is ready.',
  },
]

export function getCalculatorTypeLabel(type: CalculatorType): string {
  return calculatorTypeOptions.find((option) => option.value === type)?.label ?? 'Flat'
}
