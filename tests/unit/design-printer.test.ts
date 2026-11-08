import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, it, expect } from 'vitest'

const appDir = resolve(__dirname, '../../app')
const read = (rel: string) => readFileSync(resolve(appDir, rel), 'utf8')

const PRINTER_PAGES: Array<[string, string]> = [
  ['pages/app/printer.vue', '<NuxtPage />'],
  ['pages/app/printer/index.vue', '<PrinterView />'],
  ['pages/app/printer/rates.vue', '<RateCardView />'],
  ['pages/app/printer/shop.vue', '<ShopSetupView />'],
  ['pages/app/printer/get-started.vue', '<DesignPrinterOnboarding'],
]

describe('printer workspace on design (Phase 8)', () => {
  it('routes every printer page through the design workspace layout while keeping proto-role', () => {
    for (const [file, component] of PRINTER_PAGES) {
      const page = read(file)
      expect(page, `${file} layout`).toContain("layout: 'design-workspace'")
      expect(page, `${file} middleware`).toContain("middleware: 'proto-role'")
      expect(page, `${file} component`).toContain(component)
    }
  })

  it('maps the legacy printer CSS variables onto design tokens', () => {
    const surface = read('components/design/printer/PrinterSurface.vue')
    for (const token of ['--bg', '--panel', '--panel2', '--line', '--sub', '--ink', '--accent', '--accentInk', '--glow']) {
      expect(surface, `surface should map ${token}`).toContain(`'${token}'`)
    }
    expect(surface).toContain("'--bg': 'var(--color-paper)'")
    expect(surface).toContain("'--panel': 'var(--color-card)'")
    expect(surface).toContain("'--panel2': 'var(--color-paper-2)'")
    expect(surface).toContain("'--accent': 'var(--color-brand)'")
    expect(surface).toContain('data-design-printer-surface')
    expect(surface).not.toMatch(/\$fetch|useFetch|stores\//)
  })

  it('keeps the printer frames presentational', () => {
    for (const file of ['PrinterSection.vue', 'PrinterPageHeader.vue', 'PrinterOnboarding.vue']) {
      const source = read(`components/design/printer/${file}`)
      expect(source, `${file} should render slots or props`).toMatch(/<slot|props\./)
      expect(source, `${file} should stay presentational`).not.toMatch(/\$fetch|useFetch|stores\/|API\./)
    }
  })

  it('keeps the printer dashboard anchors, stats and queue actions on the design surface', () => {
    const view = read('components/workbench/views/PrinterView.vue')
    expect(view).toContain('<DesignPrinterSurface>')
    expect(view).toContain('<DesignPrinterPageHeader')
    expect(view).toContain('<DesignPrinterSection')

    for (const anchor of ['id="requests"', 'id="jobs"', 'id="rates"', 'id="shop"', 'id="payouts"', 'id="messages"', 'id="notifications"']) {
      expect(view, `printer dashboard should keep ${anchor}`).toContain(anchor)
    }

    for (const copy of ['Floor is clear', 'My rate card', 'steps done', 'You are live to managers.']) {
      expect(view, `printer dashboard should keep "${copy}"`).toContain(copy)
    }

    for (const call of ['store.load()', 'store.advance', 'store.undoToast()', 'store.syncQueue()', 'shop.fetchPapers()', 'shop.fetchFinishings()', 'shop.fetchMachines()']) {
      expect(view, `printer dashboard should keep ${call}`).toContain(call)
    }

    // The design workspace shell already supplies the outer container.
    expect(view).not.toContain('max-w-[1080px]')
  })

  it('keeps rate-card pricing authority, version conflicts and auto-recalculation intact', () => {
    const view = read('components/workbench/views/RateCardView.vue')
    expect(view).toContain('<DesignPrinterSurface>')
    expect(view).toContain('API.rateCard.setup')
    expect(view).toContain('API.rateCard.preview')
    expect(view).toContain('API.rateCard.complete')
    expect(view).toContain('method: \'PATCH\'')
    expect(view).toContain('expected_version: version.value')
    expect(view).toContain('rate_card_version_conflict')
    expect(view).toContain('conflictVersion')
    expect(view).toContain('version.value')
    expect(view).toContain('previewError.value')
    expect(view).toContain('Recalculating from the backend')
    expect(view).toContain('Save draft')
    expect(view).not.toMatch(/New_Design|shared\/calculator'/)
  })

  it('keeps shop profile, paper, finishing and machine writes on the design surface', () => {
    const view = read('components/workbench/views/ShopSetupView.vue')
    expect(view).toContain('<DesignPrinterSurface>')
    expect(view).toContain('<DesignPrinterPageHeader')
    for (const call of [
      'shop.updateShop(',
      'shop.createPaper(',
      'shop.updatePaper(',
      'shop.createFinishing(',
      'shop.updateFinishing(',
      'shop.createMachine(',
      'shop.updateMachine(',
      'shop.fetchPapers()',
      'shop.fetchFinishings()',
      'shop.fetchMachines()',
    ]) {
      expect(view, `shop setup should keep ${call}`).toContain(call)
    }
  })

  it('ships a real get-started checklist backed by the shop and rate-card APIs', () => {
    const page = read('pages/app/printer/get-started.vue')
    expect(page).toContain('API.rateCard.setup')
    expect(page).toContain('shop.fetchShops()')
    expect(page).toContain('shop.fetchPapers()')
    expect(page).toContain('shop.fetchMachines()')
    expect(page).toContain('shop.fetchFinishings()')
    expect(page).toContain('DesignPrinterOnboarding')
    expect(page).toContain('Live to managers')
    expect(page).not.toMatch(/demo|placeholder data/i)
  })

  it('points every workspace role at the shared messages and notifications pages', () => {
    const nav = read('utils/design/nav.ts')
    expect(nav).not.toContain("href: '/app/buyer#messages'")
    expect(nav).not.toContain("href: '/app/manager#messages'")
    expect(nav).not.toContain("href: '/app/printer#messages'")
    expect(nav).not.toContain("href: '/app/buyer#notifications'")
    expect(nav).not.toContain("href: '/app/manager#notifications'")
    expect(nav).not.toContain("href: '/app/printer#notifications'")

    expect((nav.match(/href: '\/app\/messages'/g) ?? []).length).toBe(3)
    expect((nav.match(/href: '\/notifications'/g) ?? []).length).toBeGreaterThanOrEqual(4)
  })
})
