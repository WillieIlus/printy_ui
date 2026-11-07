import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useMessagesStore } from '~/stores/messages'
import type { InboxMessage } from '~/shared/types'

const { apiMock } = vi.hoisted(() => ({ apiMock: vi.fn() }))

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({
    api: apiMock,
    publicApi: vi.fn(),
    publicApiNoAuth: vi.fn(),
    getMediaUrl: vi.fn(),
  }),
}))

function makeMessage(overrides: Partial<InboxMessage> = {}): InboxMessage {
  return {
    id: 1,
    subject: 'Question about your quote',
    body: 'Can you do 350gsm for this run?',
    snippet: 'Can you do 350gsm for this run?',
    message_type: 'question',
    direction: 'inbound',
    quote_request_id: 42,
    quote_response_id: null,
    shop_name: 'North Press',
    client_name: '',
    read_at: null,
    created_at: '2026-09-16T10:00:00Z',
    sent_at: '2026-09-16T10:00:00Z',
    email_status: 'sent',
    has_attachment: false,
    attachments_summary: [],
    action_url: '/app/buyer/quotes/42',
    ...overrides,
  }
}

describe('messages store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    apiMock.mockReset()
  })

  it('starts empty in client mode', () => {
    const store = useMessagesStore()
    expect(store.mode).toBe('client')
    expect(store.items).toEqual([])
    expect(store.unreadCount).toBe(0)
    expect(store.hasMessages).toBe(false)
  })

  it('fetch loads client inbox + unread count from the client endpoints', async () => {
    const items = [makeMessage(), makeMessage({ id: 2, read_at: '2026-09-16T09:00:00Z' })]
    apiMock.mockImplementation((path: string) => {
      if (path === '/client/messages/unread-count/') return Promise.resolve({ unread_count: 1 })
      return Promise.resolve(items)
    })
    const store = useMessagesStore()

    await store.fetch()

    expect(store.items).toHaveLength(2)
    expect(store.unreadCount).toBe(1)
    expect(apiMock).toHaveBeenCalledWith('/client/messages/', { method: 'GET' })
    expect(apiMock).toHaveBeenCalledWith('/client/messages/unread-count/', { method: 'GET' })
  })

  it('fetch switches to the shop endpoints when mode is shop', async () => {
    apiMock.mockResolvedValue([])
    const store = useMessagesStore()

    await store.fetch('shop')

    expect(store.mode).toBe('shop')
    expect(apiMock).toHaveBeenCalledWith('/shop/messages/', { method: 'GET' })
    expect(apiMock).toHaveBeenCalledWith('/shop/messages/unread-count/', { method: 'GET' })
  })

  it('fetch records an error instead of throwing', async () => {
    apiMock.mockRejectedValue(new Error('network down'))
    const store = useMessagesStore()

    await store.fetch()

    expect(store.error).toContain("couldn't load")
    expect(store.loading).toBe(false)
    expect(store.items).toEqual([])
  })

  it('markRead posts to the detail endpoint and decrements unread', async () => {
    const message = makeMessage()
    apiMock.mockImplementation((path: string) => {
      if (path === '/client/messages/unread-count/') return Promise.resolve({ unread_count: 1 })
      if (path === '/client/messages/1/read/') return Promise.resolve(makeMessage({ read_at: '2026-09-16T11:00:00Z' }))
      return Promise.resolve([message])
    })
    const store = useMessagesStore()

    await store.fetch()
    await store.markRead(message)

    expect(apiMock).toHaveBeenCalledWith('/client/messages/1/read/', { method: 'POST' })
    expect(message.read_at).not.toBeNull()
    expect(store.unreadCount).toBe(0)
  })

  it('markRead of an already-read message does not call the API', async () => {
    const message = makeMessage({ read_at: '2026-09-16T09:00:00Z' })
    apiMock.mockImplementation((path: string) => {
      if (path === '/client/messages/unread-count/') return Promise.resolve({ unread_count: 0 })
      return Promise.resolve([message])
    })
    const store = useMessagesStore()

    await store.fetch()
    await store.markRead(message)

    expect(apiMock).not.toHaveBeenCalledWith('/client/messages/1/read/', expect.anything())
  })

  it('markAllRead posts once and clears the badge', async () => {
    const items = [makeMessage(), makeMessage({ id: 2 })]
    apiMock.mockImplementation((path: string) => {
      if (path === '/client/messages/unread-count/') return Promise.resolve({ unread_count: 2 })
      if (path === '/client/messages/mark-all-read/') return Promise.resolve({ marked_read: 2 })
      return Promise.resolve(items)
    })
    const store = useMessagesStore()

    await store.fetch()
    await store.markAllRead()

    expect(apiMock).toHaveBeenCalledWith('/client/messages/mark-all-read/', { method: 'POST' })
    expect(store.unreadCount).toBe(0)
    expect(items.every((item) => item.read_at)).toBe(true)
  })

  it('markAllRead is a no-op when nothing is unread', async () => {
    const store = useMessagesStore()
    await store.markAllRead()
    expect(apiMock).not.toHaveBeenCalled()
  })
})
