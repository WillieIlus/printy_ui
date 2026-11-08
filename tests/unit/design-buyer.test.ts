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
    const page = read('pages/app/buyer.vue')
    expect(page).toContain("layout: 'design-workspace'")
    expect(page).toContain("middleware: 'proto-role'")
    expect(page).toContain('<BuyerView />')
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
    expect(view).toContain('<CalculatorView authed @quote-created="onQuoteCreated" />')
    expect(view).toContain('<BuyerJobsInProgress')
    expect(view).toContain('<QuoteResponsesPanel />')
    expect(view).toContain('<ClientJobsPanel />')

    for (const anchor of ['id="quotes"', 'id="jobs"', 'id="payments"', 'id="upload"', 'id="history"', 'id="messages"', 'id="notifications"']) {
      expect(view, `buyer page should keep ${anchor}`).toContain(anchor)
    }

    expect(view).toContain('to="/app/messages"')
    expect(view).toContain('to="/notifications"')

    // The design workspace shell has no global search, so the dashboard keeps
    // the existing client-search state it previously received from ClientShell.
    expect(view).toContain('v-model="search"')
    expect(view).toContain('placeholder="Search your orders"')

    for (const copy of ['My orders', 'New quote', 'Back to my orders', 'My quotes', 'Active jobs', 'Payments', 'Upload artwork', 'History']) {
      expect(view, `buyer page should keep "${copy}"`).toContain(copy)
    }

    expect(view).toContain('DesignSectionLabel')
    expect(view).toContain('DesignStat')
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
      global: { plugins: [pinia], stubs: { CalculatorView: true } },
    })
    await flushPromises()

    expect(wrapper.find('[data-design-buyer-surface]').exists()).toBe(true)
    expect(wrapper.text()).toContain('My orders')

    const newQuote = wrapper.findAll('button').find(button => button.text().includes('New quote'))!
    await newQuote.trigger('click')
    await flushPromises()

    expect(wrapper.find('[data-design-calculator-surface]').exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'CalculatorView' }).exists()).toBe(true)
  })
})
