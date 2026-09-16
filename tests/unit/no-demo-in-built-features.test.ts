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
]

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

  it('buyer quote tab pulls real quotes (and checkout is M-Pesa), not demo jobs', () => {
    const src = readFileSync(path.join(WORKBENCH_DIR, 'views/BuyerView.vue'), 'utf8')
    expect(src).toContain('fetchBuyerQuotes')
    expect(src).toContain('MpesaCheckout')
  })
})