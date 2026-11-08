import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ManagerView from '~/components/workbench/views/ManagerView.vue'

const appDir = resolve(__dirname, '../../app')
const read = (rel: string) => readFileSync(resolve(appDir, rel), 'utf8')

const MANAGER_PAGES: Array<[string, string]> = [
  ['pages/app/manager.vue', '<NuxtPage />'],
  ['pages/app/manager/index.vue', '<ManagerView />'],
  ['pages/app/manager/quotes.vue', '<ManagerQuotesView />'],
  ['pages/app/manager/jobs.vue', '<ManagerJobsView />'],
  ['pages/app/manager/clients.vue', '<ManagerClientsView />'],
  ['pages/app/manager/rates.vue', '<ManagerRatesView />'],
]

describe('manager workspace on design (Phase 7)', () => {
  it('routes every manager page through the design workspace layout while keeping proto-role', () => {
    for (const [file, component] of MANAGER_PAGES) {
      const page = read(file)
      expect(page, `${file} layout`).toContain("layout: 'design-workspace'")
      expect(page, `${file} middleware`).toContain("middleware: 'proto-role'")
      expect(page, `${file} component`).toContain(component)
    }
  })

  it('maps the legacy manager CSS variables onto design tokens', () => {
    const surface = read('components/design/manager/ManagerSurface.vue')
    for (const token of ['--bg', '--panel', '--panel2', '--line', '--sub', '--ink', '--accent', '--accentInk', '--glow']) {
      expect(surface, `surface should map ${token}`).toContain(`'${token}'`)
    }
    expect(surface).toContain("'--bg': 'var(--color-paper)'")
    expect(surface).toContain("'--panel': 'var(--color-card)'")
    expect(surface).toContain("'--panel2': 'var(--color-paper-2)'")
    expect(surface).toContain("'--accent': 'var(--color-brand)'")
    expect(surface).toContain('data-design-manager-surface')
    expect(surface).not.toMatch(/\$fetch|useFetch|stores\//)
  })

  it('keeps the manager frames presentational', () => {
    for (const file of ['ManagerSection.vue', 'ManagerPageHeader.vue']) {
      const source = read(`components/design/manager/${file}`)
      expect(source, `${file} should render slots`).toContain('<slot')
      expect(source, `${file} should stay presentational`).not.toMatch(/\$fetch|useFetch|stores\//)
    }
  })

  it('keeps the manager dashboard anchors and workload calls on the design surface', () => {
    const view = read('components/workbench/views/ManagerView.vue')
    expect(view).toContain('<DesignManagerSurface>')
    expect(view).toContain('<DesignManagerPageHeader')

    for (const anchor of ['id="quotes"', 'id="jobs"', 'id="clients"', 'id="rates"', 'id="messages"', 'id="notifications"']) {
      expect(view, `manager dashboard should keep ${anchor}`).toContain(anchor)
    }

    // The design workspace shell has no global search, so the dashboard keeps
    // the existing partner-search state the old ClientShell used to provide.
    expect(view).toContain('v-model="search"')
    expect(view).toContain('placeholder="Search quotes, jobs or clients"')

    for (const call of ['m.fetchQuotes()', 'm.fetchJobs()', 'm.fetchClients()', 'm.fetchProductionShops()', 'm.fetchMarketRates()']) {
      expect(view, `manager dashboard should keep ${call}`).toContain(call)
    }
  })

  it('keeps quote preparation, send-lock and server-priced breakdown intact', () => {
    const view = read('components/workbench/views/ManagerQuotesView.vue')
    expect(view).toContain('<DesignManagerSurface>')
    expect(view).toContain('<ManagerAddClientPanel')
    expect(view).toContain('<ManagerClientLinkPanel')
    expect(view).toContain('<ManagerMarginPanel')
    expect(view).toContain(':breakdown="m.pricingPreview?.breakdown"')

    // Send-lock: the handler no-ops while a send is already in flight, and the
    // button is disabled in the same window. Only the store calls the API.
    expect(view).toContain('if (!m.activeQuote || sending.value) return')
    expect(view).toContain('sending.value = true')
    expect(view).toContain('sending.value = false')
    expect(view).toContain('m.sendToClient(m.activeQuote.id)')
    expect(view).toContain(':disabled="m.saving || sending || !prepared"')

    // Markup is seeded from the stored default and persisted after prepare;
    // every money figure shown comes from the server breakdown.
    expect(view).toContain("markupPct.value = String(Math.round(m.defaultMarkupRate * 100))")
    expect(view).toContain('m.saveDefaultMarkup(next)')
    expect(view).toContain('markup_pct: markupPct.value')
    expect(view).toContain('m.prepare(m.activeQuote.id')
    expect(view).toContain('m.previewPricing(m.activeQuote.id')
    expect(view).not.toMatch(/printy_fee\s*[+*/-]|markup_amount\s*[+*/-]|manager_total_to_client\s*[+*/-]/)
  })

  it('keeps manager job follow-up behaviour and shared job cards intact', () => {
    const view = read('components/workbench/views/ManagerJobsView.vue')
    expect(view).toContain('<DesignManagerSurface>')
    expect(view).toContain('<ExpandableCard')
    expect(view).toContain('@toggle="(next: boolean) => onToggleCard(job, next)"')
    expect(view).toContain(':attention="needsAttention(job)"')
    expect(view).toContain(':muted="isMuted(job)"')
    expect(view).toContain('<JobCardFooter')
    expect(view).toContain('m.fetchJob(job.id)')
    expect(view).toContain('m.dispatchJob(job.id)')
    expect(view).toContain('m.previewJobOverride(jobId, payload)')
    expect(view).toContain('m.saveJobOverride(jobId, payload)')
    expect(view).toContain('m.artworkWorkflow(job.id, action)')
  })

  it('keeps clients, invites and shop selection on the design surface', () => {
    const view = read('components/workbench/views/ManagerClientsView.vue')
    expect(view).toContain('<DesignManagerSurface>')
    expect(view).toContain('Production shops')
    expect(view).toContain('No confirmed printers yet. Printers appear here once they finish setup.')
    expect(view).toContain('active papers, machines and printing rates')
    expect(view).toContain('Claim link ready')
    expect(view).toContain('m.createClient(')
    expect(view).toContain('m.fetchClients(search.value.trim())')
    expect(view).toContain('m.fetchProductionShops()')
  })

  it('keeps market-rate figures and the default markup save on the design surface', () => {
    const view = read('components/workbench/views/ManagerRatesView.vue')
    expect(view).toContain('<DesignManagerSurface>')
    expect(view).toContain('Backend price rows')
    expect(view).toContain('formatMoney(sideTotal(row, \'single\'))')
    expect(view).toContain('formatMoney(markedUpTotal(sideTotal(row, \'single\')))')
    expect(view).toContain('qualityBadgeLabel(row.data_quality)')
    expect(view).toContain('m.saveDefaultMarkup(normalizedMarkupPercent.value)')
    expect(view).toContain('m.fetchMarketRates()')
    expect(view).toContain('m.fetchProfile()')
    expect(view).toContain('id="manager-markup"')
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

describe('manager workspace render (Phase 7)', () => {
  beforeEach(() => {
    apiMock.mockReset()
    apiMock.mockResolvedValue({ results: [] })
  })

  it('renders inside the manager surface with every nav anchor present', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const wrapper = await mountSuspended(ManagerView, { global: { plugins: [pinia] } })
    await flushPromises()

    expect(wrapper.find('[data-design-manager-surface]').exists()).toBe(true)
    expect(wrapper.find('input[type="search"]').exists()).toBe(true)

    for (const anchor of ['quotes', 'jobs', 'clients', 'rates', 'messages', 'notifications']) {
      expect(wrapper.find(`#${anchor}`).exists(), `dashboard should render #${anchor}`).toBe(true)
    }

    expect(wrapper.text()).toContain('Quote prep')
    expect(wrapper.text()).toContain('Production follow-up')
    expect(wrapper.text()).toContain('Pricing guidance')
  })
})
