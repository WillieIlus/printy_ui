import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useProfileStore } from '~/stores/profile'
import type { UserProfileRecord } from '~/shared/types'

const { apiMock } = vi.hoisted(() => ({ apiMock: vi.fn() }))

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({
    api: apiMock,
    publicApi: vi.fn(),
    publicApiNoAuth: vi.fn(),
    getMediaUrl: vi.fn(),
  }),
}))

function makeProfile(overrides: Partial<UserProfileRecord> = {}): UserProfileRecord {
  return {
    id: 1,
    user: 7,
    bio: 'Print studio',
    avatar: null,
    phone: '0700000000',
    address: 'Moi Avenue',
    city: 'Nairobi',
    state: 'Nairobi',
    country: 'Kenya',
    postal_code: '00100',
    created_at: '2026-09-16T10:00:00Z',
    updated_at: '2026-09-16T10:00:00Z',
    ...overrides,
  }
}

describe('profile store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    apiMock.mockReset()
  })

  it('fetch loads the profile', async () => {
    apiMock.mockResolvedValue(makeProfile())
    const store = useProfileStore()

    await store.fetch()

    expect(apiMock).toHaveBeenCalledWith('/profiles/me/')
    expect(store.profile?.city).toBe('Nairobi')
    expect(store.avatarUrl).toBeNull()
  })

  it('fetch records an error instead of throwing', async () => {
    apiMock.mockRejectedValue(new Error('down'))
    const store = useProfileStore()

    await store.fetch()

    expect(store.error).toContain("couldn't load")
    expect(store.profile).toBeNull()
  })

  it('update patches and stores the returned profile', async () => {
    apiMock.mockResolvedValue(makeProfile({ city: 'Mombasa' }))
    const store = useProfileStore()

    await store.update({ city: 'Mombasa' })

    expect(apiMock).toHaveBeenCalledWith('/profiles/me/', { method: 'PATCH', body: { city: 'Mombasa' } })
    expect(store.profile?.city).toBe('Mombasa')
    expect(store.saving).toBe(false)
  })

  it('uploadAvatar posts multipart form data', async () => {
    apiMock.mockResolvedValue(makeProfile({ avatar: '/media/avatars/1/a.jpg' }))
    const store = useProfileStore()
    const file = new File(['img'], 'a.jpg', { type: 'image/jpeg' })

    await store.uploadAvatar(file)

    expect(apiMock).toHaveBeenCalledWith('/profiles/me/avatar/', expect.objectContaining({ method: 'POST' }))
    const body = apiMock.mock.calls[0]![1]!.body as FormData
    expect(body).toBeInstanceOf(FormData)
    expect(body.get('avatar')).toBe(file)
    expect(store.avatarUrl).toBe('/media/avatars/1/a.jpg')
  })
})
