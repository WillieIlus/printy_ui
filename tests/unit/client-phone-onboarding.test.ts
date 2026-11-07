import { describe, it, expect, vi, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { useAuthStore } from '~/stores/auth'
import ManagerClientsView from '~/components/workbench/views/ManagerClientsView.vue'
import { useManagerStore } from '~/stores/manager'
import type { AuthUser, ClientInviteClaimResult, PartnerClientRow } from '~/shared/types'

const { apiMock, publicApiMock } = vi.hoisted(() => ({
  apiMock: vi.fn(),
  publicApiMock: vi.fn(),
}))

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({
    api: apiMock,
    publicApi: publicApiMock,
    publicApiNoAuth: vi.fn(),
    getMediaUrl: vi.fn(),
  }),
}))

function makeUser(overrides: Partial<AuthUser> = {}): AuthUser {
  return {
    id: 9,
    email: null as unknown as string,
    name: 'Walk In Client',
    role: 'client',
    is_phone_verified: true,
    ...overrides,
  }
}

async function flush() {
  for (let i = 0; i < 5; i += 1) await nextTick()
}

function buttonByText(wrapper: Awaited<ReturnType<typeof mountSuspended>>, text: string) {
  return wrapper.findAll('button').find(button => button.text().includes(text))
}

describe('phone-first auth', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    publicApiMock.mockReset()
    apiMock.mockReset()
  })

  it('signs in with a phone number and no email', async () => {
    publicApiMock
      .mockResolvedValueOnce({ access: 'a1', refresh: 'r1', user: makeUser() })

    const auth = useAuthStore()
    await auth.signInWithPhone('0700000001', 'secret-pass')

    expect(publicApiMock).toHaveBeenCalledWith('/auth/login/', {
      method: 'POST',
      body: { phone: '0700000001', password: 'secret-pass' },
      auth: false,
    })
    expect(auth.user?.is_phone_verified).toBe(true)
  })

  it('claims a client invite and starts the session without an email', async () => {
    const result: ClientInviteClaimResult = {
      access: 'a2',
      refresh: 'r2',
      user: makeUser(),
      client_invite_id: 5,
    }
    publicApiMock.mockResolvedValueOnce(result)

    const auth = useAuthStore()
    await auth.claimClientInvite({ token: 'tok-123', password: 'brand-new-pass', name: 'Walk In' })

    expect(publicApiMock).toHaveBeenCalledWith('/auth/client-invites/claim/', {
      method: 'POST',
      body: { token: 'tok-123', password: 'brand-new-pass', name: 'Walk In' },
      auth: false,
    })
    expect(auth.user?.id).toBe(9)
    expect(auth.isAuthenticated).toBe(true)
  })
})

describe('ManagerClientsView — phone-first onboarding', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    apiMock.mockReset()
  })

  async function mountView() {
    const pinia = createPinia()
    setActivePinia(pinia)
    const wrapper = await mountSuspended(ManagerClientsView, { global: { plugins: [pinia] } })
    return { wrapper, store: useManagerStore(pinia) }
  }

  it('shows a copyable claim link after creating a phone-only client', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { clipboard: { writeText } })

    const created: PartnerClientRow = {
      client_id: null,
      name: 'Walk In',
      phone: '0700000001',
      is_offline: true,
      status: 'invite_pending',
      claim_url: 'https://printy.ke/app/client-invite?token=abc',
      claim_token: 'abc',
    }
    apiMock.mockImplementation((url: string, options?: { method?: string }) => {
      if (url === '/dashboard/partner/clients/' && options?.method === 'POST') return Promise.resolve(created)
      if (url === '/dashboard/partner/clients/') return Promise.resolve({ results: [created] })
      if (url === '/dashboard/partner/production-shops/') return Promise.resolve({ results: [] })
      return Promise.resolve({})
    })

    const { wrapper } = await mountView()
    await flush()

    await buttonByText(wrapper, 'Add offline client')!.trigger('click')
    await nextTick()
    const inputs = wrapper.findAll('input')
    await inputs[1].setValue('Walk In')
    await inputs[2].setValue('0700000001')
    await buttonByText(wrapper, 'Save client')!.trigger('click')
    await flush()

    expect(wrapper.text()).toContain('Claim link ready')
    const readonly = wrapper.find('input[readonly]')
    expect((readonly.element as HTMLInputElement).value).toBe('https://printy.ke/app/client-invite?token=abc')

    await buttonByText(wrapper, 'Copy link')!.trigger('click')
    await flush()
    expect(writeText).toHaveBeenCalledWith('https://printy.ke/app/client-invite?token=abc')
  })

  it('labels a pending invite row and offers its invite link', async () => {
    const pending: PartnerClientRow = {
      client_id: null,
      name: 'Walk In',
      phone: '0700000002',
      is_offline: true,
      status: 'invite_pending',
      claim_url: 'https://printy.ke/app/client-invite?token=xyz',
    }
    apiMock.mockImplementation((url: string) => {
      if (url === '/dashboard/partner/clients/') return Promise.resolve({ results: [pending] })
      if (url === '/dashboard/partner/production-shops/') return Promise.resolve({ results: [] })
      return Promise.resolve({})
    })

    const { wrapper, store } = await mountView()
    await store.fetchClients()
    await flush()

    expect(wrapper.text()).toContain('invite pending')
    expect(buttonByText(wrapper, 'Invite link')).toBeTruthy()
  })
})
