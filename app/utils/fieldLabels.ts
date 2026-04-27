export const fieldLabelMap: Record<string, string> = {
  quantity: 'How many?',
  finished_size: 'Size?',
  paper_stock: 'Paper?',
  requested_paper_category: 'Paper?',
  requested_gsm: 'GSM',
  color_mode: 'Colors?',
  print_sides: 'Sides?',
  lamination: 'Lamination',
  cover_lamination: 'Lamination',
  cover_stock: 'Cover paper',
  insert_stock: 'Inside pages paper',
  total_pages: 'Number of pages',
  custom_notes: 'Anything else?',
  folding: 'Folding',
  cutting: 'Cutting',
  binding_type: 'Binding',
  corner_rounding: 'Corners',
  cut_type: 'Cutting',
}

export const optionLabelMap: Record<string, string> = {
  COLOR: 'Full color',
  BW: 'Black & white',
  SINGLE: 'One side',
  DOUBLE: 'Both sides',
  SIMPLEX: 'One side',
  DUPLEX: 'Both sides',
}

export function humanFieldLabel(key: string, fallback: string): string {
  return fieldLabelMap[key] ?? fallback
}

export function humanOptionLabel(value: string, fallback: string): string {
  return optionLabelMap[value] ?? fallback
}
