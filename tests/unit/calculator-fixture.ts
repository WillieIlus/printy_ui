import type {
  CalculatorConfig,
  CalculatorFieldOption,
  CalculatorPaperStock,
  CalculatorProductConfig,
} from '~/shared/calculator-config'
import type { CalculatorSpec } from '~/shared/calculator-spec'

const stock: CalculatorPaperStock = {
  key: 'art_card_350gsm',
  label: 'Art card 350gsm',
  display_name: 'Art card 350gsm',
  category: 'art_card',
  category_label: 'Art card',
  gsm: 350,
  paper_type: 'coated',
  is_cover_stock: false,
  is_insert_stock: false,
  is_sticker_stock: false,
  is_specialty: false,
}

const product: CalculatorProductConfig = {
  key: 'business_card',
  label: 'Business cards',
  required_fields: ['quantity', 'finished_size', 'print_sides', 'color_mode'],
  optional_fields: ['lamination', 'corner_rounding'],
  defaults: {
    quantity: 100,
    finished_size: 'business_card_90x54',
    print_sides: 'DUPLEX',
    color_mode: 'COLOR',
    requested_gsm: 350,
    lamination: 'matt_lamination',
  },
  allow_custom_size: true,
  allow_custom_paper_request: false,
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
  paper_options: [stock as CalculatorFieldOption],
}

export const calculatorFixture: {
  config: CalculatorConfig
  product: CalculatorProductConfig
  spec: CalculatorSpec
} = {
  config: {
    products: [product],
    paper_categories: [{ key: 'art_card', label: 'Art card', display_name: 'Art card' }],
    paper_stocks: [stock],
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
    print_sides: 'DUPLEX',
    color_mode: 'COLOR',
    requested_gsm: 350,
    lamination: 'matt_lamination',
  },
}