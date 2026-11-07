import { describe, it, expect, beforeEach, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ClientJobsPanel from '~/components/workbench/ClientJobsPanel.vue'
import type { ClientJobRecord } from '~/shared/types'

const { apiMock } = vi.hoisted(() => ({ apiMock: vi.fn() }))

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({
    api: apiMock,
    publicApi: vi.fn(),
    publicApiNoAuth: vi.fn(),
    getMediaUrl: vi.fn(),
  }),
}))

function makeJob(overrides: Partial<ClientJobRecord> = {}): ClientJobRecord {
  return {
    id: 1,
    reference: 'PTY-1041',
    job_reference: 'PTY-1041',
    quote_request_id: null,
    quote_id: null,
    title: 'Business cards',
    status: 'awaiting_payment',
    payment_status: 'pending',
    assignment_status: 'unassigned',
    requested_deadline: null,
    updated_at: '2026-01-01T00:00:00Z',
    artwork_uploaded: true,
    artwork_required: false,
    artwork_missing: false,
    can_dispatch: false,
    artwork_status_label: 'Received',
    artwork_reminder_sent: false,
    artwork_confirmation: {
      state: 'approved',
      requested_at: null,
      requested_by: null,
      responded_at: null,
      responded_by: null,
      note: '',
    },
    payment_confirmed: false,
    pricing: { client_total: '1500.00' },
    ...overrides,
  }
}

async function mountPanel(jobs: ClientJobRecord[]) {
  const pinia = createPinia()
  setActivePinia(pinia)
  apiMock.mockResolvedValue({ results: jobs })
  const wrapper = await mountSuspended(ClientJobsPanel, { global: { plugins: [pinia] } })
  await flushPromises()
  return wrapper
}

function buttonLabel(text: string) {
  return (b: { text: () => string }) => b.text().includes(text)
}

describe('ClientJobsPanel — law 7.1/7.2 buyer gates', () => {
  beforeEach(() => {
    apiMock.mockReset()
  })

  it('disables payment and offers the artwork step when artwork is missing (7.2)', async () => {
    const wrapper = await mountPanel([makeJob({ artwork_missing: true, artwork_uploaded: false })])

    expect(wrapper.text()).toContain('Upload your artwork to pay')
    expect(wrapper.text()).toContain('Upload artwork')
    const blocked = wrapper.findAll('button').find(buttonLabel('Upload your artwork to pay'))
    expect(blocked?.attributes('disabled')).toBeDefined()
  })

  it('enables payment for a fresh, artwork-complete job', async () => {
    const wrapper = await mountPanel([makeJob()])

    expect(wrapper.text()).not.toContain('Upload your artwork to pay')
    const pay = wrapper.findAll('button').find(buttonLabel('Pay '))
    expect(pay).toBeTruthy()
    expect(pay?.attributes('disabled')).toBeUndefined()
  })

  it('blocks payment behind "Price updated" until the buyer acknowledges (7.1)', async () => {
    const wrapper = await mountPanel([makeJob({ pricing: { client_total: '1500.00' } })])
    expect(wrapper.text()).not.toContain('Price updated')

    apiMock.mockResolvedValue({ results: [makeJob({ pricing: { client_total: '1800.00' } })] })
    await wrapper.findAll('button').find(buttonLabel('refresh'))!.trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('Price updated')
    const blocked = wrapper.findAll('button').find(buttonLabel('acknowledge the new total to pay'))
    expect(blocked?.attributes('disabled')).toBeDefined()

    const ack = wrapper.findAll('button').find(buttonLabel('I acknowledge the new price'))!
    await ack.trigger('click')
    await flushPromises()

    expect(wrapper.text()).not.toContain('Price updated')
    const pay = wrapper.findAll('button').find(buttonLabel('Pay '))
    expect(pay?.attributes('disabled')).toBeUndefined()
  })

  it('does not flag a price update when the refetched total is unchanged (7.1)', async () => {
    const wrapper = await mountPanel([makeJob({ pricing: { client_total: '1500.00' } })])

    await wrapper.findAll('button').find(buttonLabel('refresh'))!.trigger('click')
    await flushPromises()

    expect(wrapper.text()).not.toContain('Price updated')
    const pay = wrapper.findAll('button').find(buttonLabel('Pay '))
    expect(pay?.attributes('disabled')).toBeUndefined()
  })
})
