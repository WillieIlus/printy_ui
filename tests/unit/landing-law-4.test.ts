import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import {
  PUBLIC_CALCULATOR_PRODUCT_KEYS,
  PUBLIC_CALCULATOR_FINISHING_KEYS,
  isPublicCalculatorProduct,
  isRestrictedPublicFinishingField,
  publicCalculatorFields,
} from '~/shared/calculator-config'
import {
  FUNNEL_EVENTS,
  buildFunnelEvent,
  trackFunnel,
  trackFunnelOnce,
  resetFunnelEvents,
} from '~/shared/funnel'

/**
 * Law 4.1-4.9 on the public landing page only.
 *
 * 4.1 headline leads with verified managers, escrow, fair-price cap
 * 4.2 fair-price guard explained in two sentences
 * 4.3 public calculator limited to cards/flyers/brochures + short finishing
 * 4.4 no sheet-math in the headline; no "Nothing hidden" copy
 * 4.5 trust copy uses price lock, cap, escrow, verified managers
 * 4.6 manager/printer pitches live on their own pages
 * 4.7 funnel events: calculator started, spec completed, gate viewed,
 *     signed up, quote sent, quote paid
 * 4.8 demo tracker is labelled "Sample"
 */
const VIEWS_DIR = path.resolve(process.cwd(), 'app/components/workbench/views')
const COMPONENTS_DIR = path.resolve(process.cwd(), 'app/components/workbench')
const STORES_DIR = path.resolve(process.cwd(), 'app/stores')
const PAGES_DIR = path.resolve(process.cwd(), 'app/pages')

const home = readFileSync(path.join(VIEWS_DIR, 'HomeView.vue'), 'utf8')
const homeTemplate = home.slice(home.indexOf('<template>'), home.indexOf('</template>'))
const calculator = readFileSync(path.join(VIEWS_DIR, 'CalculatorView.vue'), 'utf8')

describe('landing hero (law 4.1, 4.4)', () => {
  it('leads the headline with verified managers, escrow and the fair-price cap', () => {
    const h1 = homeTemplate.slice(homeTemplate.indexOf('<h1'), homeTemplate.indexOf('</h1>'))
    expect(h1.toLowerCase()).toContain('verified')
    expect(h1.toLowerCase()).toContain('escrow')
    expect(h1.toLowerCase()).toContain('fair-price cap')
  })

  it('keeps sheet math out of the headline', () => {
    const h1 = homeTemplate.slice(homeTemplate.indexOf('<h1'), homeTemplate.indexOf('</h1>')).toLowerCase()
    expect(h1).not.toContain('sheet')
    expect(h1).not.toContain('imposition')
    expect(h1).not.toContain('ups')
  })

  it('never claims "nothing hidden"', () => {
    expect(home.toLowerCase()).not.toContain('nothing hidden')
  })
})

describe('fair-price guard copy (law 4.2, 4.5)', () => {
  it('explains the guard in two sentences', () => {
    const guardAt = homeTemplate.indexOf('Fair-price guard')
    expect(guardAt).toBeGreaterThan(-1)
    const guard = homeTemplate.slice(guardAt, guardAt + 420)
    const sentences = guard.match(/[^.!?]+[.!?]/g) ?? []
    expect(sentences.length).toBeGreaterThanOrEqual(2)
    expect(guard.toLowerCase()).toContain('cap')
    expect(guard.toLowerCase()).toContain('manager')
  })

  it('bases trust copy on price lock, cap, escrow and verified managers', () => {
    const trust = home.toLowerCase()
    expect(trust).toContain('escrow')
    expect(trust).toContain('price lock')
    expect(trust).toContain('fair-price cap')
    expect(trust).toContain('verified printing managers')
  })
})

describe('public calculator scope (law 4.3)', () => {
  it('exposes exactly business cards, flyers and brochures', () => {
    expect([...PUBLIC_CALCULATOR_PRODUCT_KEYS]).toEqual(['business_card', 'flyer', 'booklet'])
    expect(isPublicCalculatorProduct('business_card')).toBe(true)
    expect(isPublicCalculatorProduct('banner')).toBe(false)
  })

  it('keeps only a short finishing list', () => {
    expect(PUBLIC_CALCULATOR_FINISHING_KEYS.length).toBeLessThanOrEqual(5)
    expect([...PUBLIC_CALCULATOR_FINISHING_KEYS]).toContain('lamination')
  })

  it('drops industrial finishing from the public calculator but keeps core fields', () => {
    expect(isRestrictedPublicFinishingField('spot_uv')).toBe(true)
    expect(isRestrictedPublicFinishingField('foiling')).toBe(true)
    expect(isRestrictedPublicFinishingField('die_cut')).toBe(true)
    expect(isRestrictedPublicFinishingField('lamination')).toBe(false)
    expect(isRestrictedPublicFinishingField('quantity')).toBe(false)

    const fields = [
      { key: 'quantity', label: 'Quantity', type: 'number' as const, required: true },
      { key: 'lamination', label: 'Finish', type: 'select' as const, required: false },
      { key: 'spot_uv', label: 'Spot UV', type: 'select' as const, required: false },
    ]
    expect(publicCalculatorFields(fields).map((f) => f.key)).toEqual(['quantity', 'lamination'])
  })

  it('wires the public filter into compact calculator mode', () => {
    expect(calculator).toContain('publicCalculatorFields')
    expect(calculator).toContain('PUBLIC_CALCULATOR_PRODUCT_KEYS')
  })
})

describe('manager/printer pitches live on their own pages (law 4.6)', () => {
  it('does not pitch managers or shops on the landing page', () => {
    expect(home).not.toContain('/for-managers')
    expect(home).not.toContain('/for-shops')
    expect(homeTemplate.toLowerCase()).not.toContain('run a print shop')
    expect(homeTemplate.toLowerCase()).not.toContain('print shop?')
  })

  it('keeps the dedicated pitch pages', () => {
    expect(() => readFileSync(path.join(PAGES_DIR, 'for-managers.vue'), 'utf8')).not.toThrow()
    expect(() => readFileSync(path.join(PAGES_DIR, 'for-shops.vue'), 'utf8')).not.toThrow()
  })
})

describe('demo tracker is labelled sample (law 4.8)', () => {
  it('labels the tracker preview as a sample', () => {
    expect(homeTemplate).toContain('Sample job')
    expect(homeTemplate).toContain('>Sample<')
    expect(homeTemplate).not.toContain('A real job')
  })
})

describe('funnel events (law 4.7)', () => {
  it('defines the six funnel events', () => {
    expect(Object.values(FUNNEL_EVENTS).sort()).toEqual([
      'calculator_started',
      'gate_viewed',
      'quote_paid',
      'quote_sent',
      'signed_up',
      'spec_completed',
    ])
  })

  it('builds an immutable-shape event record', () => {
    const event = buildFunnelEvent(FUNNEL_EVENTS.SPEC_COMPLETED, { product: 'flyer' })
    expect(event.name).toBe('spec_completed')
    expect(event.payload).toEqual({ product: 'flyer' })
    expect(typeof event.at).toBe('string')
    expect(Number.isNaN(Date.parse(event.at))).toBe(false)
  })

  it('pushes onto window.dataLayer and dispatches a DOM event', () => {
    resetFunnelEvents()
    const w = window as unknown as { dataLayer: Array<Record<string, unknown>> }
    w.dataLayer = []
    let seen: string | null = null
    window.addEventListener('printy:funnel', (e: Event) => {
      seen = (e as CustomEvent).detail?.name ?? null
    })
    trackFunnel(FUNNEL_EVENTS.GATE_VIEWED, { product: 'booklet' })
    expect(w.dataLayer[0]).toMatchObject({ event: 'gate_viewed', product: 'booklet' })
    expect(seen).toBe('gate_viewed')
  })

  it('fires once-per-key events only once', () => {
    resetFunnelEvents()
    const w = window as unknown as { dataLayer: Array<Record<string, unknown>> }
    w.dataLayer = []
    trackFunnelOnce(FUNNEL_EVENTS.CALCULATOR_STARTED, { product: 'flyer' })
    trackFunnelOnce(FUNNEL_EVENTS.CALCULATOR_STARTED, { product: 'flyer' })
    expect(w.dataLayer).toHaveLength(1)
  })

  it('is wired into each funnel source', () => {
    expect(calculator).toContain('FUNNEL_EVENTS.CALCULATOR_STARTED')
    expect(calculator).toContain('FUNNEL_EVENTS.SPEC_COMPLETED')
    expect(calculator).toContain('FUNNEL_EVENTS.GATE_VIEWED')

    const signup = readFileSync(path.join(VIEWS_DIR, 'SignUpView.vue'), 'utf8')
    expect(signup).toContain('FUNNEL_EVENTS.SIGNED_UP')

    const manager = readFileSync(path.join(STORES_DIR, 'manager.ts'), 'utf8')
    expect(manager).toContain('FUNNEL_EVENTS.QUOTE_SENT')

    const responses = readFileSync(path.join(COMPONENTS_DIR, 'QuoteResponsesPanel.vue'), 'utf8')
    expect(responses).toContain('FUNNEL_EVENTS.QUOTE_PAID')

    const clientJobs = readFileSync(path.join(COMPONENTS_DIR, 'ClientJobsPanel.vue'), 'utf8')
    expect(clientJobs).toContain('FUNNEL_EVENTS.QUOTE_PAID')
  })
})
