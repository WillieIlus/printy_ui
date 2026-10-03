import { chromium } from 'playwright-core'
import { mkdirSync } from 'node:fs'

const BASE = 'http://127.0.0.1:3113'
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const OUT = 'C:/Users/Admin/Projects/printy/printy_ui/.verify-shots'
mkdirSync(OUT, { recursive: true })

const size = { value: 'business_card_90x54', label: '90 x 54 mm', width_mm: 90, height_mm: 54 }
const config = {
  products: [{
    key: 'business_card', label: 'Business cards',
    required_fields: ['quantity', 'finished_size', 'print_sides', 'color_mode'],
    optional_fields: ['requested_paper_category', 'requested_gsm'],
    defaults: { quantity: 1000, finished_size: size.value, print_sides: 'DUPLEX', color_mode: 'COLOR', requested_gsm: 350 },
    allowed_paper_categories: ['art_card'], allow_custom_size: true, allow_custom_paper_request: true,
    sizes: [size],
    fields: [
      { key: 'quantity', label: 'Quantity', type: 'number', required: true },
      { key: 'finished_size', label: 'Size', type: 'select', required: true, options: [size] },
      { key: 'requested_paper_category', label: 'Requested paper', type: 'select', required: false, options: [{ value: 'art_card', label: 'Art card' }] },
      { key: 'requested_gsm', label: 'Requested GSM', type: 'number', required: false },
      { key: 'print_sides', label: 'Sides', type: 'select', required: true, options: [{ value: 'DUPLEX', label: 'Double sided' }] },
      { key: 'color_mode', label: 'Colour', type: 'select', required: true, options: [{ value: 'COLOR', label: 'Full colour' }] },
    ],
  }],
  paper_categories: [{ value: 'art_card', label: 'Art card' }], finishings: [],
  sizes: { business_card: [size] },
  print_sides: [{ value: 'DUPLEX', label: 'Double sided' }],
  color_modes: [{ value: 'COLOR', label: 'Full colour' }],
}
const preview = {
  can_calculate: true, display_price_text: 'KES 18,000 - KES 24,000',
  summary: 'Matched 3 verified shops.', matches_count: 3, missing_fields: [], warnings: [],
  market_range: { currency: 'KES', min: 18000, max: 24000, median: 21000, confidence: 'high' },
  production_preview: {
    pieces_per_sheet: 25, sheets_required: 40, good_sheets: 40, billable_sheets: 46,
    waste_sheets_added: 6, fixed_waste_sheets: 2, variable_waste_sheets: 4, variable_waste_rate: 0.1,
    bleed_mm: 3, layout: { cols: 5, rows: 5, orientation: 'rotated' },
    press_sheet: { label: '13x19in', width_mm: 330, height_mm: 483 },
    imposition_label: '5 copies per sheet using rotated layout.',
    size_label: '90 x 54 mm', quantity: 1000, cutting_required: true,
    selected_finishings: [], suggested_finishings: [], warnings: [],
  },
}

const browser = await chromium.launch({ executablePath: CHROME, headless: true })
const out = {}
for (const [name, width, height] of [['desktop-1440', 1440, 1300], ['mobile-390', 390, 844]]) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2 })
  const page = await ctx.newPage()
  const errs = []
  page.on('pageerror', e => errs.push(String(e).slice(0, 120)))
  await page.route('**/api/calculator/config/**', r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(config) }))
  await page.route('**/api/calculator/public-preview/**', r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(preview) }))
  await page.goto(`${BASE}/#calculator`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1800)
  const sec = page.locator('section').filter({ hasText: 'How your sheet is laid out' }).first()
  const visible = await sec.isVisible().catch(() => false)
  if (!visible) { out[name] = { visible: false, errs }; await ctx.close(); continue }

  const read = () => page.evaluate(() => {
    const sec = [...document.querySelectorAll('section')].find(s => /How your sheet is laid out/i.test(s.textContent || ''))
    const svg = sec?.querySelector('svg[role="img"]')
    if (!svg) return null
    const b = svg.getBoundingClientRect()
    const txt = (sec.textContent || '').replace(/\s+/g, ' ')
    return {
      svgW: Math.round(b.width), svgH: Math.round(b.height),
      pieceRects: svg.querySelectorAll('rect').length,
      trimLines: svg.querySelectorAll('g[stroke] line').length,
      pieceLegend: /90 x 54 mm piece/i.test(txt),
      marksLegend: /trim marks/i.test(txt),
      brickLegend: /rows offset by half a piece/i.test(txt),
      honestyNote: /gaps are drawn for clarity, not waste/i.test(txt),
      pricedLabel: /priced layout/i.test(txt),
      billed: /you are billed/i.test(txt),
    }
  })

  const grid = await read()
  await page.getByRole('button', { name: 'brick', exact: true }).click()
  await page.waitForTimeout(500)
  const brick = await read()
  await sec.screenshot({ path: `${OUT}/${name}-legend.png` })
  out[name] = { visible, grid, brick, errs }
  await ctx.close()
}
await browser.close()
console.log(JSON.stringify(out, null, 2))
