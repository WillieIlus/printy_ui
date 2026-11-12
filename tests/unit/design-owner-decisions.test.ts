import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, it, expect } from 'vitest'

const appDir = resolve(__dirname, '../../app')
const readPage = (file: string) => readFileSync(resolve(appDir, 'pages', file), 'utf8')
const readComponent = (rel: string) => readFileSync(resolve(appDir, 'components', rel), 'utf8')

describe('Owner decisions on the public pages (Phase 4B)', () => {
  it('the landing page runs on the design-public layout while keeping the buyer-entry gate', () => {
    const landing = readPage('index.vue')
    expect(landing).toContain("layout: 'design-public'")
    expect(landing).toContain("middleware: 'buyer-entry'")
  })

  it('public copy uses seven stages, never ten', () => {
    expect(readPage('how-it-works.vue')).toContain('Seven stages')
    expect(readPage('how-it-works.vue')).toContain('seven-stage')
    expect(readComponent('design/marketing/StageRailSection.vue')).toContain('Seven stages')
    expect(readComponent('design/marketing/Hero.vue')).toContain('seven-stage')
    expect(readFileSync(resolve(appDir, 'error.vue'), 'utf8')).toContain('seven stages')
    expect(readFileSync(resolve(appDir, 'error.vue'), 'utf8')).not.toContain('ten stages')
  })

  it('sample stage windows and demo figures stay explicitly labelled as samples', () => {
    const stageRail = readComponent('design/marketing/StageRailSection.vue')
    expect(stageRail).toContain('Sample stage windows')
    expect(stageRail).toContain('come from the server')

    const fairPrice = readComponent('design/marketing/FairPriceNote.vue')
    expect(fairPrice).toContain('Sample - 1,000 flyers')

    const managers = readPage('for-managers.vue')
    expect(managers).toContain('demo figures')
    expect(managers).toContain('The real one lives in your workspace')

    const shops = readPage('for-shops.vue')
    expect(shops).toContain('A sample rate card')
    expect(shops).toContain('Sample shop - rate card')
    expect(shops).toContain('The real one lives in your workspace')

    expect(readComponent('design/marketing/TrackerDemo.vue')).toContain('Demo - not a real order')
  })

  it('legal is split into Terms, Privacy and Help without retiring the /legal entry point', () => {
    const terms = readPage('terms.vue')
    expect(terms).toContain('TERMS_SECTIONS')
    expect(terms).toContain('LegalDocument')

    const privacy = readPage('privacy.vue')
    expect(privacy).toContain('PRIVACY_SECTIONS')
    expect(privacy).toContain('LegalDocument')

    const help = readPage('help.vue')
    expect(help).toContain('LegalHelp')

    const legal = readPage('legal.vue')
    expect(legal).toContain("to: '/terms'")
    expect(legal).toContain("to: '/privacy'")
    expect(legal).toContain("to: '/help'")
    expect(legal).not.toContain('Previous terms')

    const content = readFileSync(resolve(appDir, 'shared/legal/content.ts'), 'utf8')
    expect(content).toContain('Fair-price cap')
    expect(content).toContain('Buyers never see a shop')
    expect(content).toContain('public tracker shows only stages and times')
  })

  it('/quote renders the exact same server-backed calculator section as the homepage', () => {
    const quote = readPage('quote.vue')
    expect(quote).toContain("layout: 'design-public'")
    expect(quote).toContain("title: 'Instant price'")
    expect(quote).toContain("import DesignHomeQuoteSection from '~/components/design/marketing/HomeQuoteSection.vue'")
    expect(quote).toContain('<DesignHomeQuoteSection />')
    expect(quote).not.toContain('<DesignCalculator')
    expect(quote).not.toMatch(/\$fetch|useFetch|QuoteCalculator|shared\/calculator/)

    const landing = readPage('index.vue')
    expect(landing).toContain("import DesignHomeQuoteSection from '~/components/design/marketing/HomeQuoteSection.vue'")
    expect(landing).toContain('<DesignHomeQuoteSection />')

    const homeQuote = readComponent('design/marketing/HomeQuoteSection.vue')
    expect(homeQuote).toContain('<DesignCalculator split @unlock="goSignUp" />')

    const surface = readComponent('design/calculator/CalculatorSurface.vue')
    expect(surface).toContain('--accent')
    expect(surface).toContain('--panel')
    expect(surface).not.toMatch(/\$fetch|useFetch|stores\//)
  })
})
