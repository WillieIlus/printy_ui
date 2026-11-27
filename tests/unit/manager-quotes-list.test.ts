import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ManagerQuotesListView from '~/components/workbench/views/ManagerQuotesListView.vue'
import type { ManagerQuoteRow } from '~/shared/types'

const { apiMock } = vi.hoisted(() => ({ apiMock: vi.fn() }))

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({ api: apiMock, publicApi: vi.fn(), publicApiNoAuth: vi.fn(), getMediaUrl: vi.fn() }),
}))

function quote(overrides: Partial<ManagerQuoteRow> = {}): ManagerQuoteRow {
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
    assigned_manager_name: 'Dale',
    request_snapshot: {},
    latest_response: null,
    created_at: '2026-09-16T10:00:00Z',
    updated_at: '2026-09-16T10:00:00Z',
    managed_job: null,
    ...overrides,
  }
}

async function mountList(rows: ManagerQuoteRow[]) {
  const pinia = createPinia()
  setActivePinia(pinia)
  apiMock.mockResolvedValue({ results: rows })
  const wrapper = await mountSuspended(ManagerQuotesListView, { global: { plugins: [pinia] } })
  await flushPromises()
  return wrapper
}

describe('ManagerQuotesListView', () => {
  beforeEach(() => apiMock.mockReset())

  it('renders the quote workload as rows without the quote detail', async () => {
    const wrapper = await mountList([quote()])

    expect(wrapper.text()).toContain('Quote workload')
    expect(wrapper.find('[data-test="manager-quote-row-11"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('REQ-11')
    expect(wrapper.text()).toContain('A5 Flyers')
    expect(wrapper.text()).toContain('Ava')

    expect(wrapper.find('[data-test="manager-quote-one-screen"]').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('Production options')
    expect(wrapper.text()).not.toContain('Prepare quote')
    expect(wrapper.text()).not.toContain('Settlement')
  })

  it('keeps the add-client entry point on the list', async () => {
    const wrapper = await mountList([quote()])
    expect(wrapper.find('[data-test="toggle-add-client"]').exists()).toBe(true)
  })

  it('shows an empty list state', async () => {
    const wrapper = await mountList([])
    expect(wrapper.text()).toContain('No quote requests waiting')
    expect(wrapper.find('[data-test="manager-quote-row-11"]').exists()).toBe(false)
  })
})
