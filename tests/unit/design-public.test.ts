import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, it, expect } from 'vitest'
import { useTrackStageView } from '../../app/composables/design/useTrackStageView'

const appDir = resolve(__dirname, '../../app')

const designMarketingComponents = [
  'Hero.vue',
  'TickerStrip.vue',
  'PillarsStrip.vue',
  'StageRailSection.vue',
  'QuoteSection.vue',
  'SpeedSection.vue',
  'TrackSection.vue',
  'FairPriceNote.vue',
  'RolesSplit.vue',
  'FinalCta.vue',
  'SectionHead.vue',
] as const

const designTrackerComponents = [
  'StageTimeline.vue',
  'TrackJobPrompt.vue',
  'JobCommandCenter.vue',
] as const

function readDesignMarketing(file: string): string {
  return readFileSync(resolve(appDir, 'components/design/marketing', file), 'utf8')
}

function readDesignTracker(file: string): string {
  return readFileSync(resolve(appDir, 'components/design/tracker', file), 'utf8')
}

describe('Design public pages and marketing sections (Phase 4)', () => {
  it('design marketing section components exist', () => {
    for (const file of designMarketingComponents) {
      expect(existsSync(resolve(appDir, 'components/design/marketing', file)), `${file} should exist`).toBe(true)
    }
  })

  it('design tracker components exist', () => {
    for (const file of designTrackerComponents) {
      expect(existsSync(resolve(appDir, 'components/design/tracker', file)), `${file} should exist`).toBe(true)
    }
  })

  it('design marketing components are presentational (no store, fetch, toast or design-source references)', () => {
    for (const file of designMarketingComponents) {
      const source = readDesignMarketing(file)
      expect(source, `${file} must not reference the design source`).not.toMatch(/New[_]Design/)
      expect(source, `${file} must not contain absolute URLs`).not.toMatch(/https?:\/\//)
      expect(source, `${file} must stay presentational`).not.toMatch(/\$fetch|\buseFetch\b|useToast|stores\//)
    }
  })

  it('design tracker components are presentational and keep sample labelling honest', () => {
    for (const file of designTrackerComponents) {
      const source = readDesignTracker(file)
      expect(source, `${file} must not reference the design source`).not.toMatch(/New[_]Design/)
      expect(source, `${file} must not contain absolute URLs`).not.toMatch(/https?:\/\//)
      expect(source, `${file} must stay presentational`).not.toMatch(/\$fetch|\buseFetch\b|stores\//)
    }
    expect(readDesignTracker('TrackJobPrompt.vue')).toContain('SAMPLE-1042')
  })

  it('design-public layout is used by every public page that has a design counterpart', () => {
    const pages = [
      'how-it-works.vue',
      'for-managers.vue',
      'for-shops.vue',
      'legal.vue',
      'track.vue',
    ]
    for (const page of pages) {
      const source = readFileSync(resolve(appDir, 'pages', page), 'utf8')
      expect(source, `${page} should set the design-public layout`).toContain("layout: 'design-public'")
    }
  })

  it('every design-public page file still sets its SEO meta or design composition', () => {
    const landing = readFileSync(resolve(appDir, 'pages', 'index.vue'), 'utf8')
    expect(landing).toContain('useHead')
    expect(landing).toContain('Instant, server-verified print prices')

    const track = readFileSync(resolve(appDir, 'pages', 'track.vue'), 'utf8')
    expect(track).toContain('useHead')
    expect(track).toContain('Track a job')

    const howItWorks = readFileSync(resolve(appDir, 'pages', 'how-it-works.vue'), 'utf8')
    expect(howItWorks).toContain('useHead')
    expect(howItWorks).toContain('How it works')
  })

  it('the landing page composes design marketing sections without the design calculator', () => {
    const landing = readFileSync(resolve(appDir, 'pages', 'index.vue'), 'utf8')
    for (const component of [
      'DesignHero',
      'DesignTickerStrip',
      'DesignPillarsStrip',
      'DesignStageRailSection',
      'DesignQuoteSection',
      'DesignSpeedSection',
      'DesignTrackSection',
      'DesignFairPriceNote',
      'DesignRolesSplit',
      'DesignFinalCta',
    ]) {
      expect(landing, `landing should compose ${component}`).toContain(component)
    }
    expect(landing).not.toContain('QuoteCalculator')
    expect(landing).not.toContain('/api/quote')
  })

  it('/track keeps the public tracker API behaviour behind the design-public layout', () => {
    const trackView = readFileSync(resolve(appDir, 'components/workbench/views/TrackView.vue'), 'utf8')
    expect(trackView).toContain('API.jobs.publicManagedTrack')
    expect(trackView).toContain('publicApi')
  })

  it('about and contact pages with no design equivalent keep their content and sit on the design-public layout', () => {
    const about = readFileSync(resolve(appDir, 'pages', 'about.vue'), 'utf8')
    expect(about).toContain('Printing shouldn')
    expect(about).toContain("layout: 'design-public'")

    const contact = readFileSync(resolve(appDir, 'pages', 'contact.vue'), 'utf8')
    expect(contact).toContain('Talk to a human')
    expect(contact).toContain("layout: 'design-public'")
  })

  it('marketing image references point at the files shipped under public/images/design', () => {
    for (const file of ['pexels-6620970.jpg', 'pexels-9550363.jpg']) {
      expect(existsSync(resolve(appDir, '../public/images/design', file)), `${file} should exist`).toBe(true)
    }
    for (const page of ['index.vue', 'for-managers.vue', 'for-shops.vue']) {
      const source = readFileSync(resolve(appDir, 'pages', page), 'utf8')
      expect(source, `${page} should use the Phase 1 design image paths`).not.toMatch(/\/images\/pexels-/)
      expect(source, `${page} should reference /images/design/`).toContain('/images/design/')
    }
  })

  it('adapts the public tracker timeline onto the design stage component without changing its states', () => {
    const { toDesignStages } = useTrackStageView()
    const mapped = toDesignStages([
      { key: 'quote_accepted', label: 'Quote accepted', state: 'completed' },
      { key: 'production', label: 'Production', state: 'current' },
      { key: 'qc', label: 'Quality check', state: 'pending' },
    ], stage => ({ leftLabel: stage.key === 'production' ? '2h left' : undefined }))

    expect(mapped.map(stage => stage.state)).toEqual(['done', 'active', 'upcoming'])
    expect(mapped[1]).toMatchObject({ label: 'Production', leftLabel: '2h left' })
  })
})
