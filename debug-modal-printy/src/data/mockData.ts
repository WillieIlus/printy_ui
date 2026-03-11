import type { Product, Paper, MaterialItem, FinishingRate, Shop } from '../types'

export const shops: Shop[] = [
  { id: 1, name: 'Nairobi Print Hub', slug: 'nairobi-print-hub', location: 'Nairobi CBD', description: 'Full-service print shop in the heart of Nairobi.' },
  { id: 2, name: 'Mombasa Graphics', slug: 'mombasa-graphics', location: 'Mombasa', description: 'Quality printing and large format solutions.' },
  { id: 3, name: 'Kisumu Print Works', slug: 'kisumu-print-works', location: 'Kisumu', description: 'Fast turnaround and competitive pricing.' },
]

export const products: Product[] = [
  {
    id: 1, name: 'Business Cards', category: 'Cards',
    pricing_mode: 'SHEET', final_size: '90×55mm', imposition_summary: 'A4 (10-up)',
    min_quantity: 100, default_sides: 'DUPLEX',
    finishing_summary: ['Lamination', 'Round Corners'],
    finishing_options: [
      { finishing_rate: 1, name: 'Lamination (Glossy)', is_default: true },
      { finishing_rate: 3, name: 'Round Corners', is_default: false },
    ],
    price_hint: { can_calculate: true, price_display: 'KES 1,200', total: 1200, per_unit: 12 },
    shop: shops[0],
  },
  {
    id: 2, name: 'A4 Flyers', category: 'Flyers & Brochures',
    pricing_mode: 'SHEET', final_size: 'A4 (210×297mm)', imposition_summary: 'A3 (2-up)',
    min_quantity: 50, default_sides: 'SIMPLEX',
    finishing_summary: ['UV Coating'],
    finishing_options: [
      { finishing_rate: 2, name: 'UV Coating', is_default: false },
    ],
    price_hint: { can_calculate: true, price_display: 'KES 2,500', total: 2500, per_unit: 50 },
    shop: shops[0],
  },
  {
    id: 3, name: 'A5 Brochures (Tri-fold)', category: 'Flyers & Brochures',
    pricing_mode: 'SHEET', final_size: 'A5 (148×210mm)', imposition_summary: 'A3 (4-up)',
    min_quantity: 100, default_sides: 'DUPLEX',
    finishing_summary: ['Folding', 'Lamination'],
    finishing_options: [
      { finishing_rate: 1, name: 'Lamination (Glossy)', is_default: true },
      { finishing_rate: 4, name: 'Tri-fold', is_default: true },
    ],
    price_hint: { can_calculate: true, price_display: 'KES 3,800', total: 3800, per_unit: 38 },
    shop: shops[1],
  },
  {
    id: 4, name: 'Roll-Up Banner (85×200cm)', category: 'Banners',
    pricing_mode: 'LARGE_FORMAT', final_size: '85×200cm',
    min_quantity: 1, default_sides: 'SIMPLEX',
    finishing_summary: ['Roll-up Stand'],
    finishing_options: [
      { finishing_rate: 5, name: 'Roll-up Stand', is_default: true },
    ],
    price_hint: { can_calculate: true, price_display: 'KES 3,500', total: 3500, per_unit: 3500 },
    shop: shops[1],
  },
  {
    id: 5, name: 'Vinyl Banner (per sqm)', category: 'Banners',
    pricing_mode: 'LARGE_FORMAT', final_size: 'Custom size',
    min_quantity: 1, default_sides: 'SIMPLEX',
    finishing_summary: ['Eyelets', 'Hemming'],
    finishing_options: [
      { finishing_rate: 6, name: 'Eyelets', is_default: true },
      { finishing_rate: 7, name: 'Hemming', is_default: false },
    ],
    price_hint: { can_calculate: true, price_display: 'KES 800/sqm', total: 800, per_unit: 800 },
    shop: shops[2],
  },
  {
    id: 6, name: 'Invoice Books (A5, Triplicate)', category: 'Books & NCR',
    pricing_mode: 'SHEET', final_size: 'A5', imposition_summary: 'A3 (4-up)',
    min_quantity: 10, default_sides: 'SIMPLEX',
    finishing_summary: ['Numbering', 'Padding'],
    finishing_options: [
      { finishing_rate: 8, name: 'Numbering', is_default: true },
      { finishing_rate: 9, name: 'Padding', is_default: true },
    ],
    price_hint: { can_calculate: true, price_display: 'KES 4,500', total: 4500, per_unit: 450 },
    shop: shops[2],
  },
  {
    id: 7, name: 'Letterheads (A4)', category: 'Stationery',
    pricing_mode: 'SHEET', final_size: 'A4 (210×297mm)', imposition_summary: 'A3 (2-up)',
    min_quantity: 100, default_sides: 'SIMPLEX',
    finishing_summary: [],
    finishing_options: [],
    price_hint: { can_calculate: true, price_display: 'KES 1,800', total: 1800, per_unit: 18 },
    shop: shops[0],
  },
  {
    id: 8, name: 'Posters (A2)', category: 'Posters',
    pricing_mode: 'LARGE_FORMAT', final_size: 'A2 (420×594mm)',
    min_quantity: 1, default_sides: 'SIMPLEX',
    finishing_summary: ['Lamination'],
    finishing_options: [
      { finishing_rate: 1, name: 'Lamination (Glossy)', is_default: false },
    ],
    price_hint: { can_calculate: true, price_display: 'KES 500', total: 500, per_unit: 500 },
    shop: shops[1],
  },
  {
    id: 9, name: 'Compliment Slips', category: 'Stationery',
    pricing_mode: 'SHEET', final_size: 'DL (99×210mm)', imposition_summary: 'A4 (3-up)',
    min_quantity: 100, default_sides: 'SIMPLEX',
    finishing_summary: [],
    finishing_options: [],
    price_hint: { can_calculate: true, price_display: 'KES 900', total: 900, per_unit: 9 },
    shop: shops[2],
  },
]

export const papersByShop: Record<string, Paper[]> = {
  'nairobi-print-hub': [
    { id: 1, shop: 1, sheet_size: 'A4', gsm: 80, paper_type: 'Bond', selling_price: '2.50', buying_price: '1.50', is_active: true },
    { id: 2, shop: 1, sheet_size: 'A4', gsm: 120, paper_type: 'Glossy Art Paper', selling_price: '5.00', buying_price: '3.00', is_active: true },
    { id: 3, shop: 1, sheet_size: 'A4', gsm: 170, paper_type: 'Matt Art Card', selling_price: '8.00', buying_price: '5.00', is_active: true },
    { id: 4, shop: 1, sheet_size: 'A3', gsm: 250, paper_type: 'Glossy Art Card', selling_price: '15.00', buying_price: '9.00', is_active: true },
    { id: 5, shop: 1, sheet_size: 'A3', gsm: 300, paper_type: 'Board', selling_price: '20.00', buying_price: '12.00', is_active: true },
  ],
  'mombasa-graphics': [
    { id: 6, shop: 2, sheet_size: 'A4', gsm: 100, paper_type: 'Bond', selling_price: '3.00', buying_price: '1.80', is_active: true },
    { id: 7, shop: 2, sheet_size: 'A4', gsm: 150, paper_type: 'Glossy Art Paper', selling_price: '6.50', buying_price: '4.00', is_active: true },
    { id: 8, shop: 2, sheet_size: 'A3', gsm: 200, paper_type: 'Matt Art Card', selling_price: '12.00', buying_price: '7.00', is_active: true },
  ],
  'kisumu-print-works': [
    { id: 9, shop: 3, sheet_size: 'A4', gsm: 80, paper_type: 'Bond', selling_price: '2.00', buying_price: '1.20', is_active: true },
    { id: 10, shop: 3, sheet_size: 'A4', gsm: 130, paper_type: 'Glossy Art Paper', selling_price: '5.50', buying_price: '3.50', is_active: true },
    { id: 11, shop: 3, sheet_size: 'A3', gsm: 250, paper_type: 'Glossy Art Card', selling_price: '14.00', buying_price: '8.50', is_active: true },
  ],
}

export const materialsByShop: Record<string, MaterialItem[]> = {
  'nairobi-print-hub': [
    { id: 1, material_type: 'SAV (Self-Adhesive Vinyl)', name: 'SAV', unit: 'sqm', selling_price: '600', is_active: true },
    { id: 2, material_type: 'PVC Banner (440gsm)', name: 'PVC Banner', unit: 'sqm', selling_price: '450', is_active: true },
  ],
  'mombasa-graphics': [
    { id: 3, material_type: 'SAV (Self-Adhesive Vinyl)', name: 'SAV', unit: 'sqm', selling_price: '550', is_active: true },
    { id: 4, material_type: 'PVC Banner (440gsm)', name: 'PVC Banner', unit: 'sqm', selling_price: '400', is_active: true },
    { id: 5, material_type: 'Canvas', name: 'Canvas', unit: 'sqm', selling_price: '1200', is_active: true },
    { id: 6, material_type: 'Backlit Film', name: 'Backlit Film', unit: 'sqm', selling_price: '900', is_active: true },
  ],
  'kisumu-print-works': [
    { id: 7, material_type: 'SAV (Self-Adhesive Vinyl)', name: 'SAV', unit: 'sqm', selling_price: '500', is_active: true },
    { id: 8, material_type: 'PVC Banner (440gsm)', name: 'PVC Banner', unit: 'sqm', selling_price: '380', is_active: true },
  ],
}

export const finishingRatesByShop: Record<string, FinishingRate[]> = {
  'nairobi-print-hub': [
    { id: 1, name: 'Lamination (Glossy)', price: '5.00', charge_unit: 'PER_PIECE', is_active: true },
    { id: 2, name: 'UV Coating', price: '3.00', charge_unit: 'PER_PIECE', is_active: true },
    { id: 3, name: 'Round Corners', price: '2.00', charge_unit: 'PER_PIECE', is_active: true },
  ],
  'mombasa-graphics': [
    { id: 1, name: 'Lamination (Glossy)', price: '6.00', charge_unit: 'PER_PIECE', is_active: true },
    { id: 4, name: 'Tri-fold', price: '4.00', charge_unit: 'PER_PIECE', is_active: true },
    { id: 5, name: 'Roll-up Stand', price: '1500.00', charge_unit: 'FLAT', is_active: true },
  ],
  'kisumu-print-works': [
    { id: 6, name: 'Eyelets', price: '50.00', charge_unit: 'PER_PIECE', is_active: true },
    { id: 7, name: 'Hemming', price: '100.00', charge_unit: 'PER_SQM', is_active: true },
    { id: 8, name: 'Numbering', price: '3.00', charge_unit: 'PER_PIECE', is_active: true },
    { id: 9, name: 'Padding', price: '50.00', charge_unit: 'PER_PIECE', is_active: true },
  ],
}

export function getShopDataForProduct(product: Product) {
  const slug = product.shop?.slug || ''
  const papers = papersByShop[slug] || []
  const materials = materialsByShop[slug] || []
  const finishings = finishingRatesByShop[slug] || []
  return { papers, materials, finishings }
}
