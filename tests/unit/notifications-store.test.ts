import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useNotificationsStore } from '~/stores/notifications'
import type { PrintyNotification } from '~/shared/types'

const { apiMock } = vi.hoisted(() => ({ apiMock: vi.fn() }))

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({
    api: apiMock,
    publicApi: vi.fn(),
    publicApiNoAuth: vi.fn(),
    getMediaUrl: vi.fn(),
  }),
}))

function makeNotification(overrides: Partial<PrintyNotification> = {}): PrintyNotification {
  return {
    id: 1,
    notification_type: 'shop_question_asked',
    notification_type_display: 'Shop question',
    message: 'Please confirm the finish.',
    object_type: 'quote',
    object_id: 42,
    actor: 2,
    actor_email: null,
    is_read: false,
    read_at: null,
    created_at: '2026-09-16T10:00:00Z',
    target_url: '/app/buyer/quotes/42',
    ...overrides,
  }
}

function mockFetchResult(items: PrintyNotification[], unread = items.filter(i => !i.is_read).length) {
  apiMock.mockImplementation((path: string) => {
    if (path === '/me/notifications/unread-count/') {
      return Promise.resolve({ count: unread })
    }
    return Promise.resolve({ count: items.length, next: null, previous: null, results: items })
  })
}

describe('notifications store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    apiMock.mockReset()
  })

  it('starts empty', () => {
    const store = useNotificationsStore()
    expect(store.items).toEqual([])
    expect(store.totalUnread).toBe(0)
    expect(store.unreadCount).toBe(0)
    expect(store.loading).toBe(false)
  })

  it('fetch loads paginated results and unread count', async () => {
    const items = [makeNotification(), makeNotification({ id: 2, is_read: true, read_at: '2026-09-16T09:00:00Z' })]
    mockFetchResult(items, 1)
    const store = useNotificationsStore()

    await store.fetch()

    expect(store.items).toHaveLength(2)
    expect(store.unreadCount).toBe(1)
    expect(apiMock).toHaveBeenCalledWith('/me/notifications/')
    expect(apiMock).toHaveBeenCalledWith('/me/notifications/unread-count/')
  })

  it('fetch tolerates a raw array response', async () => {
    apiMock.mockImplementation((path: string) => {
      if (path === '/me/notifications/unread-count/') {
        return Promise.resolve({ count: 3 })
      }
      return Promise.resolve([makeNotification(), makeNotification({ id: 2 }), makeNotification({ id: 3 })])
    })
    const store = useNotificationsStore()

    await store.fetch()

    expect(store.items).toHaveLength(3)
    expect(store.unreadCount).toBe(3)
  })

  it('fetch failure records an error instead of throwing', async () => {
    apiMock.mockRejectedValue(new Error('network down'))
    const store = useNotificationsStore()

    await store.fetch()

    expect(store.error).toContain("couldn't load")
    expect(store.loading).toBe(false)
    expect(store.items).toEqual([])
  })

  it('markRead patches the row, flips is_read and decrements unread', async () => {
    const [unread, read] = [makeNotification(), makeNotification({ id: 2, is_read: true })]
    mockFetchResult([unread, read], 1)
    apiMock.mockResolvedValueOnce({ count: 2, next: null, previous: null, results: [unread, read] })
    apiMock.mockResolvedValueOnce({ count: 1 })
    apiMock.mockResolvedValueOnce({ status: 'read' })
    const store = useNotificationsStore()

    await store.fetch()
    await store.markRead(unread)

    expect(apiMock).toHaveBeenCalledWith('/me/notifications/1/mark-read/', { method: 'PATCH' })
    expect(unread.is_read).toBe(true)
    expect(unread.read_at).not.toBeNull()
    expect(store.unreadCount).toBe(0)
  })

  it('markRead of an already-read row does not call the API', async () => {
    const read = makeNotification({ is_read: true, read_at: '2026-09-16T09:00:00Z' })
    mockFetchResult([read], 0)
    apiMock.mockResolvedValueOnce({ count: 1, next: null, previous: null, results: [read] })
    apiMock.mockResolvedValueOnce({ count: 0 })
    const store = useNotificationsStore()

    await store.fetch()
    await store.markRead(read)

    expect(apiMock).not.toHaveBeenCalledWith('/me/notifications/1/mark-read/', expect.anything())
  })

  it('markAllRead patches once and clears the badge', async () => {
    const items = [makeNotification(), makeNotification({ id: 2 }), makeNotification({ id: 3, is_read: true })]
    mockFetchResult(items, 2)
    apiMock.mockResolvedValueOnce({ count: 3, next: null, previous: null, results: items })
    apiMock.mockResolvedValueOnce({ count: 2 })
    apiMock.mockResolvedValueOnce({ marked: 2 })
    const store = useNotificationsStore()

    await store.fetch()
    await store.markAllRead()

    expect(apiMock).toHaveBeenCalledWith('/me/notifications/mark-all-read/', { method: 'PATCH' })
    expect(store.unreadCount).toBe(0)
    expect(items.every(i => i.is_read)).toBe(true)
  })

  it('markAllRead is a no-op when there is nothing unread', async () => {
    const store = useNotificationsStore()
    await store.markAllRead()
    expect(apiMock).not.toHaveBeenCalled()
  })
})