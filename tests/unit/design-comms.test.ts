import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import type { Component } from 'vue'
import MessagesView from '~/components/workbench/views/MessagesView.vue'
import NotificationsPage from '~/pages/notifications.vue'
import { useAuthStore } from '~/stores/auth'
import { API } from '~/shared/api-paths'
import type { AuthUser } from '~/shared/types'

const appDir = resolve(__dirname, '../../app')
const read = (rel: string) => readFileSync(resolve(appDir, rel), 'utf8')

const { apiMock } = vi.hoisted(() => ({ apiMock: vi.fn() }))

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({
    api: apiMock,
    publicApi: vi.fn(),
    publicApiNoAuth: vi.fn(),
    getMediaUrl: vi.fn(),
  }),
}))

function clientUser(): AuthUser {
  return { id: 1, email: 'buyer@example.com', name: 'Wanjiku Njeri', role: 'client' }
}

function emptyApi(url: string) {
  if (url === API.messages.client || url === API.messages.shop) return Promise.resolve([])
  if (url === API.messages.clientUnread || url === API.messages.shopUnread) return Promise.resolve({ unread_count: 0 })
  if (url === API.notifications.feed) return Promise.resolve({ results: [] })
  if (url === API.notifications.unreadCount) return Promise.resolve({ count: 0 })
  return Promise.resolve({ results: [] })
}

async function mountView(component: Component) {
  const pinia = createPinia()
  setActivePinia(pinia)
  useAuthStore(pinia).user = clientUser()
  const wrapper = await mountSuspended(component, { global: { plugins: [pinia] } })
  await flushPromises()
  await wrapper.vm.$nextTick()
  return wrapper
}

describe('messages and notifications on design (Phase 8 owner amendment)', () => {
  it('keeps the real stores authoritative while offering clearly-labelled samples', () => {
    const messages = read('components/workbench/views/MessagesView.vue')
    expect(messages).toContain('useMessagesStore')
    expect(messages).toContain('startMessagePolling')
    expect(messages).toContain('store.markRead')
    expect(messages).toContain('store.markAllRead')
    expect(messages).toContain('Sample inbox')
    expect(messages).toContain('Sample')
    expect(read('pages/app/messages.vue')).toContain("layout: 'design-workspace'")

    const notifications = read('pages/notifications.vue')
    expect(notifications).toContain('useNotificationsStore')
    expect(notifications).toContain('fetchFeed')
    expect(notifications).toContain('markAllRead')
    expect(notifications).toContain('Sample feed')
    expect(notifications).toContain("layout: 'design-workspace'")

    const detail = read('pages/notifications/[id].vue')
    expect(detail).toContain('findSampleNotice')
    expect(detail).toContain('API.notifications.list')
    expect(detail).toContain("layout: 'design-workspace'")
  })

  it('keeps a role-aware sample set for every workspace role', () => {
    const comms = read('composables/design/useDesignComms.ts')
    for (const role of ['client', 'partner', 'production', 'super_admin']) {
      expect(comms, `sample data should cover ${role}`).toContain(`${role}: [`)
    }
    expect(comms).toContain('SAMPLE-1042')
    expect(comms).toContain('sample-thread-client-1')
    expect(comms).toContain('sample-notice-production-1')
    expect(comms).toContain('markSampleRead')
    expect(comms).toContain('markAllSamplesRead')
    expect(comms).not.toMatch(/\$fetch|useFetch|API\./)
  })

  it('renders design sample threads when the live inbox is empty', async () => {
    apiMock.mockReset()
    apiMock.mockImplementation(emptyApi)
    const wrapper = await mountView(MessagesView)

    expect(wrapper.find('[data-design-workspace-surface]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Sample inbox')
    expect(wrapper.text()).toContain('Artwork approved')
    expect(wrapper.text()).toContain('Sample')
    wrapper.unmount()
  })

  it('renders design sample notices when the live feed is empty', async () => {
    apiMock.mockReset()
    apiMock.mockImplementation(emptyApi)
    const wrapper = await mountView(NotificationsPage)

    expect(wrapper.find('[data-design-workspace-surface]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Sample feed')
    expect(wrapper.text()).toContain('QC passed on SAMPLE-1042')
    expect(wrapper.text()).toContain('Escrow received')
    wrapper.unmount()
  })

  beforeEach(() => {
    apiMock.mockReset()
  })
})
