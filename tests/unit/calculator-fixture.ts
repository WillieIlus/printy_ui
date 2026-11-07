import type {
  CalculatorConfig,
  CalculatorProductConfig,
} from '~/shared/calculator-config'
import type { CalculatorSpec } from '~/shared/calculator-spec'

const product: CalculatorProductConfig = {
  key: 'business_card',
  label: 'Business cards',
  required_fields: ['quantity', 'finished_size', 'print_sides', 'color_mode'],
  optional_fields: ['requested_paper_category', 'requested_gsm', 'lamination', 'corner_rounding'],
  defaults: {
    quantity: 100,
    finished_size: 'business_card_90x54',
    print_sides: 'DUPLEX',
    color_mode: 'COLOR',
    requested_gsm: 350,
    lamination: 'matt_lamination',
  },
  allowed_paper_categories: ['art_card', 'gloss'],
  allow_custom_size: true,
  allow_custom_paper_request: true,
  sizes: [{ value: 'business_card_90x54', label: '90 x 54 mm', width_mm: 90, height_mm: 54 }],
  fields: [
    { key: 'quantity', label: 'Quantity', type: 'number', required: true },
    {
      key: 'finished_size',
      label: 'Size',
      type: 'select',
      required: true,
      options: [{ value: 'business_card_90x54', label: '90 x 54 mm', width_mm: 90, height_mm: 54 }],
    },
    {
      key: 'requested_paper_category',
      label: 'Requested paper',
      type: 'select',
      required: false,
      options: [
        { value: 'art_card', label: 'Art card' },
        { value: 'gloss', label: 'Gloss' },
      ],
    },
    { key: 'requested_gsm', label: 'Requested GSM', type: 'number', required: false },
    {
      key: 'print_sides',
      label: 'Printing',
      type: 'select',
      required: true,
      options: [{ value: 'DUPLEX', label: 'Double sided' }],
    },
    {
      key: 'color_mode',
      label: 'Colour',
      type: 'select',
      required: true,
      options: [{ value: 'COLOR', label: 'Full colour' }],
    },
    {
      key: 'lamination',
      label: 'Finishing',
      type: 'select',
      required: false,
      options: [{ value: 'matt_lamination', label: 'Matt lamination' }],
    },
    { key: 'corner_rounding', label: 'Rounded corners', type: 'boolean', required: false },
  ],
}

export const calculatorFixture: {
  config: CalculatorConfig
  product: CalculatorProductConfig
  spec: CalculatorSpec
} = {
  config: {
    products: [product],
    paper_categories: [
      { value: 'art_card', label: 'Art card' },
      { value: 'gloss', label: 'Gloss' },
    ],
    finishings: [],
    sizes: { business_card: product.sizes! },
    print_sides: [
      { value: 'SINGLE', label: 'Single sided' },
      { value: 'DUPLEX', label: 'Double sided' },
    ],
    color_modes: [
      { value: 'BWF', label: 'Black only' },
      { value: 'COLOR', label: 'Full colour' },
    ],
  },
  product,
  spec: {
    product_type: 'business_card',
    quantity: 100,
    finished_size: 'business_card_90x54',
    requested_paper_category: 'art_card',
    requested_gsm: 350,
    print_sides: 'DUPLEX',
    color_mode: 'COLOR',
    lamination: 'matt_lamination',
  },
}