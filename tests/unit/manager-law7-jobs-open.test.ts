import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ManagerJobsView from '~/components/workbench/views/ManagerJobsView.vue'
import { useManagerStore } from '~/stores/manager'
import type { ManagerJobRow } from '~/shared/types'

const { apiMock } = vi.hoisted(() => ({ apiMock: vi.fn() }))

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({
    api: apiMock,
    publicApi: vi.fn(),
    publicApiNoAuth: vi.fn(),
    getMediaUrl: vi.fn(),
  }),
}))

function makeJob(overrides: Partial<ManagerJobRow> = {}): ManagerJobRow {
  return {
    id: 7,
    reference: 'MJ-7',
    job_reference: 'MJ-7',
    quote_request_id: 1,
    quote_id: 2,
    quote_request_reference: 'QR-1',
    quote_reference: 'Q-2',
    tracking_reference: 'MJ-7',
    production_assignment_reference: null,
    title: 'A5 Flyers',
    status: 'in_production',
    payment_status: 'confirmed',
    assignment_status: 'unassigned',
    requested_deadline: null,
    updated_at: '2026-09-16T10:00:00Z',
    artwork_uploaded: true,
    artwork_required: false,
    artwork_missing: false,
    can_dispatch: true,
    artwork_status_label: 'Artwork uploaded',
    artwork_reminder_sent: false,
    artwork_confirmation: { state: 'approved' },
    payment_confirmed: true,
    pricing: null,
    client_name: 'Ava',
    assigned_shop_name: 'North Press',
    ...overrides,
  }
}

function detailResponse(job: ManagerJobRow) {
  return { role: 'partner', job, settlement: null, canonical: null }
}

async function flush() {
  for (let i = 0; i < 6; i += 1) await nextTick()
}

async function mountView() {
  const pinia = createPinia()
  setActivePinia(pinia)
  const wrapper = await mountSuspended(ManagerJobsView, { global: { plugins: [pinia] } })
  const store = useManagerStore(pinia)
  return { wrapper, store }
}

async function openFirstCard(wrapper: Awaited<ReturnType<typeof mountView>>['wrapper']) {
  await wrapper.find('[role="button"]').trigger('click')
  await flush()
}

describe('ManagerJobsView open-in-place cards — law 7.11', () => {
  let scrollSpy: ReturnType<typeof vi.fn>
  let focusSpy: ReturnType<typeof vi.fn>

  beforeEach(() => {
    apiMock.mockReset()
    scrollSpy = vi.fn()
    focusSpy = vi.fn()
    Element.prototype.scrollIntoView = scrollSpy as unknown as typeof Element.prototype.scrollIntoView
    HTMLElement.prototype.focus = focusSpy as unknown as typeof HTMLElement.prototype.focus
  })

  afterEach(() => {
    // @ts-expect-error restore the environment's implementations
    delete Element.prototype.scrollIntoView
    // @ts-expect-error restore the environment's implementations
    delete HTMLElement.prototype.focus
  })

  it('expands the card in place under its own header and fetches the detail', async () => {
    apiMock.mockResolvedValueOnce({ role: 'partner', results: [makeJob()] })
    const { wrapper, store } = await mountView()
    await flush()

    expect(wrapper.text()).not.toContain('Job facts')
    expect(wrapper.find('[role="button"]').attributes('aria-expanded')).toBe('false')

    apiMock.mockResolvedValueOnce(detailResponse(makeJob()))
    await openFirstCard(wrapper)

    expect(apiMock).toHaveBeenLastCalledWith('/dashboard/partner/jobs/7/')
    expect(store.activeJob?.id).toBe(7)
    expect(wrapper.text()).toContain('Job facts')
    expect(wrapper.text()).toContain('Settlement split')
    expect(wrapper.find('[role="button"]').attributes('aria-expanded')).toBe('true')
    // The "open" indicator is rendered on the expanded card.
    expect(wrapper.text().toLowerCase()).toContain('open')
  })

  it('scrolls the opened card into view and moves focus to it', async () => {
    apiMock.mockResolvedValueOnce({ results: [makeJob()] })
    const { wrapper } = await mountView()
    await flush()

    apiMock.mockResolvedValueOnce(detailResponse(makeJob()))
    await openFirstCard(wrapper)

    expect(scrollSpy).toHaveBeenCalled()
    expect(focusSpy).toHaveBeenCalled()
  })

  it('clears the unread marker when the card is opened, via the detail endpoint', async () => {
    apiMock.mockResolvedValueOnce({ results: [makeJob({ unread: true })] })
    const { wrapper, store } = await mountView()
    await flush()

    expect(wrapper.find('[aria-label="Unread"]').exists()).toBe(true)

    apiMock.mockResolvedValueOnce(detailResponse(makeJob({ unread: false, viewer_read_at: '2026-09-16T11:00:00Z' })))
    await openFirstCard(wrapper)

    expect(store.jobs[0]!.unread).toBe(false)
    expect(store.jobs[0]!.viewer_read_at).toBe('2026-09-16T11:00:00Z')
    expect(wrapper.find('[aria-label="Unread"]').exists()).toBe(false)
  })

  it('keeps the needs-attention styling until the backend clears it', async () => {
    apiMock.mockResolvedValueOnce({ results: [makeJob({ unread: true, needs_attention: true })] })
    const { wrapper, store } = await mountView()
    await flush()

    apiMock.mockResolvedValueOnce(detailResponse(makeJob({ unread: false, needs_attention: true })))
    await openFirstCard(wrapper)

    // Opening clears the unread marker but never the server's attention flag.
    expect(store.jobs[0]!.needs_attention).toBe(true)
    expect(wrapper.find('article').classes()).toContain('ring-2')
  })

  it('keeps the card open when the list refreshes', async () => {
    apiMock.mockResolvedValueOnce({ results: [makeJob()] })
    const { wrapper, store } = await mountView()
    await flush()

    apiMock.mockResolvedValueOnce(detailResponse(makeJob()))
    await openFirstCard(wrapper)
    expect(wrapper.text()).toContain('Job facts')

    apiMock.mockResolvedValueOnce({ results: [makeJob()] })
    await store.fetchJobs()
    await flush()

    expect(wrapper.text()).toContain('Job facts')
    expect(wrapper.find('[role="button"]').attributes('aria-expanded')).toBe('true')
  })

  it('does not reorder cards when one is opened (an open card never pushes others around)', async () => {
    apiMock.mockResolvedValueOnce({ results: [makeJob({ id: 7 }), makeJob({ id: 8 }), makeJob({ id: 9 })] })
    const { wrapper } = await mountView()
    await flush()

    const before = wrapper.findAll('article').map((a) => a.attributes('id'))
    apiMock.mockResolvedValueOnce(detailResponse(makeJob({ id: 8 })))
    const headers = wrapper.findAll('[role="button"]')
    await headers[1]!.trigger('click')
    await flush()

    const after = wrapper.findAll('article').map((a) => a.attributes('id'))
    expect(after).toEqual(before)
  })

  it('shows a loading state while the detail is in flight', async () => {
    apiMock.mockResolvedValueOnce({ results: [makeJob()] })
    const { wrapper } = await mountView()
    await flush()

    let resolveDetail: (value: unknown) => void = () => {}
    apiMock.mockReturnValueOnce(new Promise((resolve) => { resolveDetail = resolve }))
    await wrapper.find('[role="button"]').trigger('click')
    await nextTick()
    await nextTick()

    expect(wrapper.text()).toContain('Loading job details')

    resolveDetail(detailResponse(makeJob()))
    await flush()
    expect(wrapper.text()).not.toContain('Loading job details')
  })
})
