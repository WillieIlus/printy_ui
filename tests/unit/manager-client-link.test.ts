import { describe, it, expect, vi, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ManagerClientLinkPanel from '~/components/workbench/views/ManagerClientLinkPanel.vue'
import type { ManagerClientLinkStatus } from '~/shared/types'

const { apiMock } = vi.hoisted(() => ({ apiMock: vi.fn() }))

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({
    api: apiMock,
    publicApi: vi.fn(),
    publicApiNoAuth: vi.fn(),
    getMediaUrl: vi.fn(),
  }),
}))

const LINK_PATH = '/client-portal/manager/quote-requests/11/link/'

function makeStatus(overrides: Partial<ManagerClientLinkStatus> = {}): ManagerClientLinkStatus {
  return {
    quote_request_id: 11,
    has_link: true,
    link_id: 7,
    token: 'signed-token',
    url: 'https://printy.example/client/signed-token',
    status: 'sent',
    sent_at: '2026-01-01T09:00:00Z',
    viewed_at: null,
    view_count: 0,
    expires_at: '2026-01-08T09:00:00Z',
    is_active: true,
    delivery: { id: 3, status: 'sent', channel: 'sms', provider: 'stub' },
    ...overrides,
  }
}

async function flush() {
  for (let i = 0; i < 6; i += 1) await nextTick()
}

async function mount() {
  const pinia = createPinia()
  setActivePinia(pinia)
  return mountSuspended(ManagerClientLinkPanel, {
    props: { quoteRequestId: 11 },
    global: { plugins: [pinia] },
  })
}

describe('ManagerClientLinkPanel — law 10.6 link status, resend, revoke', () => {
  beforeEach(() => {
    apiMock.mockReset()
  })

  it('shows "Sent" with the delivery channel when the link was delivered but not opened', async () => {
    apiMock.mockImplementation(async () => makeStatus())
    const wrapper = await mount()
    await flush()

    expect(wrapper.get('[data-test="client-link-status"]').text()).toBe('Sent')
    expect(wrapper.get('[data-test="client-link-delivery"]').text()).toContain('sent via sms')
  })

  it('shows "Viewed" with the view count once the client opened it', async () => {
    apiMock.mockImplementation(async () => makeStatus({ status: 'viewed', view_count: 2, viewed_at: '2026-01-02T11:00:00Z' }))
    const wrapper = await mount()
    await flush()

    expect(wrapper.get('[data-test="client-link-status"]').text()).toBe('Viewed')
    expect(wrapper.get('[data-test="client-link-panel"]').text()).toContain('2')
  })

  it('shows "Expired" and hides the revoke button for an aged-out link', async () => {
    apiMock.mockImplementation(async () => makeStatus({ status: 'expired', is_active: false }))
    const wrapper = await mount()
    await flush()

    expect(wrapper.get('[data-test="client-link-status"]').text()).toBe('Expired')
    expect(wrapper.find('[data-test="client-link-revoke"]').exists()).toBe(false)
  })

  it('resends by creating a new link, then refreshes the status', async () => {
    let status = makeStatus({ status: 'sent' })
    apiMock.mockImplementation(async (path, options) => {
      if (path === LINK_PATH && options?.method === 'POST') {
        status = makeStatus({ status: 'viewed', view_count: 1, viewed_at: '2026-01-02T11:00:00Z', link_id: 8 })
        return { link_id: 8, token: 'new-token', url: 'https://printy.example/client/new-token', expires_at: '2026-01-09T09:00:00Z', delivery: { id: 4, status: 'sent', channel: 'sms' } }
      }
      return status
    })
    const wrapper = await mount()
    await flush()

    await wrapper.get('[data-test="client-link-send"]').trigger('click')
    await flush()

    expect(apiMock).toHaveBeenCalledWith(LINK_PATH, { method: 'POST', body: {} })
    expect(wrapper.get('[data-test="client-link-status"]').text()).toBe('Viewed')
  })

  it('revokes the link and reflects the revoked status', async () => {
    let status = makeStatus({ status: 'sent' })
    apiMock.mockImplementation(async (path, options) => {
      if (path === '/client-portal/manager/links/7/revoke/') {
        status = makeStatus({ status: 'revoked', is_active: false })
        return { detail: 'Link revoked.', link_id: 7, revoked_at: '2026-01-03T09:00:00Z' }
      }
      return status
    })
    const wrapper = await mount()
    await flush()

    await wrapper.get('[data-test="client-link-revoke"]').trigger('click')
    await flush()

    expect(apiMock).toHaveBeenCalledWith('/client-portal/manager/links/7/revoke/', { method: 'POST', body: {} })
    expect(wrapper.get('[data-test="client-link-status"]').text()).toBe('Revoked')
  })
})
