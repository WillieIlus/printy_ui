import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ManagerView from '~/components/workbench/views/ManagerView.vue'
import { useAuthStore } from '~/stores/auth'
import type { ManagerQuoteRow } from '~/shared/types'

const { apiMock } = vi.hoisted(() => ({ apiMock: vi.fn() }))

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({
    api: apiMock,
    publicApi: vi.fn(),
    publicApiNoAuth: vi.fn(),
    getMediaUrl: vi.fn(),
  }),
}))

function makeQuote(overrides: Partial<ManagerQuoteRow> = {}): ManagerQuoteRow {
  return {
    id: 11,
    reference: 'QR-11',
    quote_request_reference: 'REQ-11',
    quote_reference: null,
    product: 'A5 Flyers',
    status: 'pending',
    raw_status: 'pending',
    status_label: 'Pending',
    customer_name: 'Ava',
    shop_name: 'Northpress',
    assigned_manager_name: 'Mia',
    request_snapshot: {},
    latest_response: null,
    created_at: '2026-09-16T10:00:00Z',
    updated_at: '2026-09-16T10:00:00Z',
    managed_job: null,
    ...overrides,
  }
}

async function mountDashboard(quotes: ManagerQuoteRow[]) {
  const pinia = createPinia()
  setActivePinia(pinia)
  useAuthStore(pinia).activeRole = 'partner'
  const wrapper = await mountSuspended(ManagerView, { global: { plugins: [pinia] } })
  await flushPromises()
  return wrapper
}

describe('ManagerView — B1.1 waiting queue and live calculator', () => {
  beforeEach(() => {
    apiMock.mockReset()
    apiMock.mockImplementation((path: string) => {
      if (path === '/dashboard/partner/quotes/') {
        return Promise.resolve([
          makeQuote({ id: 1, section: 'unresponded', section_label: 'Unresponded / sent', product: 'Booklets' }),
          makeQuote({ id: 2, section: 'unresponded', section_label: 'Unresponded / sent', product: 'Posters' }),
          makeQuote({ id: 3, section: 'replied', section_label: 'Replied', product: 'Already answered' }),
        ])
      }
      if (path === '/calculator/config/') {
        return Promise.resolve({ products: [], default_product: null })
      }
      return Promise.resolve({ results: [] })
    })
  })

  it('renders a "Waiting to be quoted" queue from the server section', async () => {
    const wrapper = await mountDashboard([])
    expect(wrapper.text()).toContain('Waiting to be quoted')

    const rows = wrapper.findAll('[data-test="waiting-quote-row"]')
    expect(rows).toHaveLength(2)
    const text = rows.map((row) => row.text()).join(' | ')
    expect(text).toContain('Booklets')
    expect(text).toContain('Posters')
    // A replied request is not waiting to be quoted.
    expect(text).not.toContain('Already answered')
  })

  it('shows the live calculator in price-only mode (no request action)', async () => {
    const wrapper = await mountDashboard([])
    expect(wrapper.text()).toContain('Live price calculator')
    expect(wrapper.find('#calculator').exists()).toBe(true)
    // A manager prices here; they cannot open a client quote draft from the dashboard.
    expect(wrapper.text()).not.toContain('Request this quote')
  })

  it('keeps the existing dashboard anchors and workload calls intact', async () => {
    const wrapper = await mountDashboard([])
    for (const anchor of ['quotes', 'jobs', 'clients', 'rates', 'messages', 'notifications']) {
      expect(wrapper.find(`#${anchor}`).exists(), `missing #${anchor}`).toBe(true)
    }
    const calls = apiMock.mock.calls.map(([path]) => path)
    expect(calls).toContain('/dashboard/partner/quotes/')
    expect(calls).toContain('/dashboard/partner/jobs/')
    expect(calls).toContain('/dashboard/partner/clients/')
    expect(calls).toContain('/dashboard/partner/production-shops/')
    expect(calls).toContain('/dashboard/partner/market-rates/')
  })
})
