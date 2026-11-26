import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import BuyerView from '~/components/workbench/views/BuyerView.vue'

const appDir = resolve(__dirname, '../../app')
const read = (rel: string) => readFileSync(resolve(appDir, rel), 'utf8')

describe('buyer workspace on design (Phase 6)', () => {
  it('routes /app/buyer through the design workspace layout while keeping proto-role', () => {
    const page = read('pages/app/buyer/index.vue')
    expect(page).toContain("layout: 'design-workspace'")
    expect(page).toContain("middleware: 'proto-role'")
    expect(page).toContain('<BuyerView />')
  })

  it('exposes a real new-quote route instead of only inline state', () => {
    const page = read('pages/app/buyer/new.vue')
    expect(page).toContain("layout: 'design-workspace'")
    expect(page).toContain("middleware: 'proto-role'")
    expect(page).toContain('<DesignCalculator authed')
    expect(page).toContain("to=\"/app/buyer\"")
    expect(read('components/workbench/views/BuyerView.vue')).toContain('to="/app/buyer/new"')
  })

  it('exposes a canonical order route that resolves quote and job surfaces', () => {
    const page = read('pages/app/buyer/orders/[id].vue')
    expect(page).toContain('API.managedJobs.card')
    expect(page).toContain('/app/buyer/requests/')
    expect(page).toContain('/app/buyer/jobs/')
    expect(page).toContain("layout: 'design-workspace'")
  })

  it('maps the legacy buyer CSS variables onto design tokens', () => {
    const surface = read('components/design/buyer/BuyerSurface.vue')
    for (const token of ['--bg', '--panel', '--panel2', '--line', '--sub', '--ink', '--accent', '--accentInk', '--glow']) {
      expect(surface, `surface should map ${token}`).toContain(`'${token}'`)
    }
    expect(surface).toContain("'--bg': 'var(--color-paper)'")
    expect(surface).toContain("'--panel': 'var(--color-card)'")
    expect(surface).toContain("'--panel2': 'var(--color-paper-2)'")
    expect(surface).toContain("'--accent': 'var(--color-brand)'")
    expect(surface).toContain('data-design-buyer-surface')
    expect(surface).not.toMatch(/\$fetch|useFetch|stores\//)
  })

  it('keeps the buyer view contract while adopting design sections', () => {
    const view = read('components/workbench/views/BuyerView.vue')
    expect(view).toContain('<DesignBuyerSurface>')
    expect(view).toContain('<DesignCalculatorSurface>')
    expect(view).toContain('<DesignCalculator authed @quote-created="onQuoteCreated" />')
    expect(view).toContain('<BuyerJobsInProgress')
    expect(view).toContain('<QuoteResponsesPanel />')
    expect(view).not.toContain('<ClientJobsPanel />')

    for (const anchor of ['id="quotes"', 'id="history"', 'id="notifications"']) {
      expect(view, `buyer page should keep ${anchor}`).toContain(anchor)
    }
    for (const removed of ['id="jobs"', 'id="payments"', 'id="upload"', 'id="messages"']) {
      expect(view, `buyer page should fold ${removed} into the card thread`).not.toContain(removed)
    }

    expect(view).toContain('to="/app/messages"')
    expect(view).toContain('to="/notifications"')

    // The design workspace shell has no global search, so the dashboard keeps
    // the existing client-search state it previously received from ClientShell.
    expect(view).toContain('v-model="search"')
    expect(view).toContain('placeholder="Search your quotes"')

    for (const copy of ['New quote', 'Quotes waiting for you', 'Quotes', 'Past jobs']) {
      expect(view, `buyer page should keep "${copy}"`).toContain(copy)
    }

    expect(view).toContain('DesignBuyerSection')
    expect(view).toContain('DesignStat')

    // Past jobs are compact and last; active jobs are the shared cards above.
    expect(view.indexOf('id="notifications"')).toBeLessThan(view.indexOf('id="history"'))
    expect(read('components/workbench/tracker/BuyerJobsInProgress.vue')).toContain('<DesignJobCard')

    // components/design/ui/* auto-registers under DesignUi*, so the short
    // Design* names must be imported explicitly or they render unresolved.
    for (const [name, file] of [
      ['DesignCard', 'Card.vue'],
      ['DesignStat', 'Stat.vue'],
    ]) {
      expect(view, `BuyerView should import ${name}`)
        .toContain(`import ${name} from '~/components/design/ui/${file}'`)
    }
  })

  it('uses the Stage 1C quote projection and Quote wording on request detail', () => {
    const source = read('pages/app/buyer/requests/[id].vue')
    expect(source).toContain('API.quoteCards.card')
    expect(source).toContain('data-test="buyer-quote-card"')
    expect(source).toContain('Quote status')
    expect(source).not.toContain('title="Offers"')
    expect(source).not.toContain('Back to my orders')
  })

  it('uses the design step and choice components in the real calculator', () => {
    const calc = read('components/workbench/views/CalculatorView.vue')
    expect(calc).toContain("import DesignCalculatorStep from '~/components/design/calculator/CalculatorStep.vue'")
    expect(calc).toContain("import DesignCalculatorChoice from '~/components/design/calculator/CalculatorChoice.vue'")
    expect(calc).not.toMatch(/<Step[ >]/)
    expect(calc).not.toMatch(/<Chip[ >]/)
    expect(calc).toContain('<DesignCalculatorStep')
    expect(calc).toContain('<DesignCalculatorChoice')

    // Pricing and catalogue remain backend-authoritative (decision C-002).
    expect(calc).toContain('loadConfig')
    expect(calc).toContain('refreshPreview')
    expect(calc).not.toMatch(/New_Design|QuoteCalculator|shared\/calculator'/)
  })

  it('keeps the design calculator components presentational', () => {
    for (const file of ['CalculatorStep.vue', 'CalculatorChoice.vue']) {
      const source = read(`components/design/calculator/${file}`)
      expect(source, `${file} should be presentational`).not.toMatch(/\$fetch|useFetch|stores\/|New_Design/)
    }
  })

  it('keeps the buyer section frame presentational', () => {
    const section = read('components/design/buyer/BuyerSection.vue')
    expect(section).toContain('<slot />')
    expect(section).toContain('<slot name="action" />')
    expect(section).not.toMatch(/\$fetch|useFetch|stores\//)
  })
})

const { apiMock } = vi.hoisted(() => ({ apiMock: vi.fn() }))

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({
    api: apiMock,
    publicApi: vi.fn(),
    publicApiNoAuth: vi.fn(),
    getMediaUrl: vi.fn(),
  }),
}))

describe('buyer workspace render (Phase 6)', () => {
  beforeEach(() => {
    apiMock.mockReset()
  })

  it('renders inside the buyer surface and opens the design calculator surface', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    apiMock.mockImplementation((url: string) => {
      if (String(url).includes('buyer-quotes')) return Promise.resolve([])
      return Promise.resolve({ results: [] })
    })

    const wrapper = await mountSuspended(BuyerView, {
      global: { plugins: [pinia], stubs: { DesignCalculator: true } },
    })
    await flushPromises()

    expect(wrapper.find('[data-design-buyer-surface]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Quotes waiting for you')

    const newQuote = wrapper.findAll('button').find(button => button.text().includes('New quote'))!
    await newQuote.trigger('click')
    await flushPromises()

    expect(wrapper.find('[data-design-calculator-surface]').exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'DesignCalculator' }).exists()).toBe(true)
  })
})
