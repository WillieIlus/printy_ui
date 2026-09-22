import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import path from 'node:path'

const WORKBENCH_DIR = path.resolve(process.cwd(), 'app/components/workbench')

const FULLY_API_DRIVEN: Array<{ file: string; markers: string[] }> = [
  // Phase 2: rate cards are fully backend-driven (no local demo catalog).
  { file: 'views/RateCardView.vue', markers: ['API.rateCard'] },
  // Tracking resolves real job state from the API by job code.
  { file: 'views/TrackView.vue', markers: ['API.jobs.publicManagedTrack'] },
  // Phase 4: notifications come from the backend list/polling API.
  { file: 'ui/NotificationBell.vue', markers: ['startNotificationPolling', 'markAllRead'] },
  // Buyer calculator: products/sizes/papers come from the backend config and
  // the price is exclusively the public-preview median.
  { file: 'views/CalculatorView.vue', markers: ['loadConfig', 'refreshPreview'] },
  { file: 'calculator/PriceRail.vue', markers: ['display_price_text', 'market_range'] },
]

// The buyer calculator's price and catalog must come from the backend only —
// it is never allowed to reach the local pricing engine.
const LOCAL_PRICING_IMPORT = /from\s+['"]~\/shared\/workflow\/pricing['"]/

// The workflow demo dataset lives in ~/shared/workflow/printy and must never
// leak into components that are supposed to render real API data.
const DEMO_DATASET_MARKERS: Array<[RegExp, string]> = [
  [/\bINITIAL_JOBS\b/, 'INITIAL_JOBS'],
  [/\bMANAGERS\b/, 'MANAGERS'],
  [/\bPRINTERS\b/, 'PRINTERS'],
  [/\bBUYER_PERSONA\b/, 'BUYER_PERSONA'],
  [/\bSESSION_PRINTER_ID\b/, 'SESSION_PRINTER_ID'],
]

describe('backend-driven feature views are free of demo job data', () => {
  it('render from the API layer (real replacement present)', () => {
    for (const { file, markers } of FULLY_API_DRIVEN) {
      const src = readFileSync(path.join(WORKBENCH_DIR, file), 'utf8')
      for (const marker of markers) {
        expect(src, `${file} should reference ${marker}`).toContain(marker)
      }
    }
  })

  it('do not import or reference the workflow demo dataset', () => {
    for (const { file } of FULLY_API_DRIVEN) {
      const src = readFileSync(path.join(WORKBENCH_DIR, file), 'utf8')
      for (const [re, label] of DEMO_DATASET_MARKERS) {
        expect(re.test(src), `${file} must not reference ${label}`).toBe(false)
      }
    }
  })

  it('buyer calculator files never import the local pricing engine', () => {
    for (const file of ['views/CalculatorView.vue', 'calculator/PriceRail.vue']) {
      const src = readFileSync(path.join(WORKBENCH_DIR, file), 'utf8')
      expect(LOCAL_PRICING_IMPORT.test(src), `${file} must not import ~/shared/workflow/pricing`).toBe(false)
    }
    const config = readFileSync(path.join(process.cwd(), 'app/shared/calculator-config.ts'), 'utf8')
    const spec = readFileSync(path.join(process.cwd(), 'app/shared/calculator-spec.ts'), 'utf8')
    expect(LOCAL_PRICING_IMPORT.test(config)).toBe(false)
    expect(LOCAL_PRICING_IMPORT.test(spec)).toBe(false)
  })

  it('buyer views pull real quotes/jobs (and checkout is M-Pesa), not demo jobs', () => {
    const buyer = readFileSync(path.join(WORKBENCH_DIR, 'views/BuyerView.vue'), 'utf8')
    expect(buyer).toContain('fetchBuyerQuotes')
    expect(buyer).toContain('ClientJobsPanel')
    expect(buyer).toContain('useClientJobsStore')

    const panel = readFileSync(path.join(WORKBENCH_DIR, 'ClientJobsPanel.vue'), 'utf8')
    expect(panel).toContain('fetchJobs')
    expect(panel).toContain('MpesaCheckout')
  })
})