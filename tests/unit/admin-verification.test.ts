import { describe, it, expect, vi, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { mountSuspended } from '@nuxt/test-utils/runtime'

import AdminVerificationRow from '~/components/design/admin/AdminVerificationRow.vue'
import AdminManagersView from '~/components/workbench/views/admin/AdminManagersView.vue'

const { apiMock } = vi.hoisted(() => ({ apiMock: vi.fn() }))

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({
    api: apiMock,
    publicApi: vi.fn(),
    publicApiNoAuth: vi.fn(),
    getMediaUrl: vi.fn(),
  }),
}))

async function flush() {
  for (let i = 0; i < 8; i += 1) await nextTick()
}

function manager(overrides: Record<string, unknown> = {}) {
  return {
    id: 3,
    user_id: 7,
    name: 'Dale Mwangi',
    email: 'dale@example.com',
    phone: '+254700000007',
    city: 'Nairobi',
    speciality: 'Books',
    status: 'pending',
    manager_verified: false,
    broker_profile_active: true,
    ...overrides,
  }
}

describe('AdminVerificationRow', () => {
  it('emits approve from the row action', async () => {
    const wrapper = await mountSuspended(AdminVerificationRow, {
      props: { kind: 'manager', name: 'Dale Mwangi', status: 'pending' },
    })

    await wrapper.get('[data-test="admin-verification-approve"]').trigger('click')

    expect(wrapper.emitted('approve')).toHaveLength(1)
  })

  it('requires a reason before a rejection can be confirmed', async () => {
    const wrapper = await mountSuspended(AdminVerificationRow, {
      props: { kind: 'manager', name: 'Dale Mwangi', status: 'pending' },
    })

    await wrapper.get('[data-test="admin-verification-reject"]').trigger('click')
    const confirm = wrapper.get('[data-test="admin-verification-confirm-reject"]')
    expect(confirm.attributes('disabled')).toBeDefined()

    await wrapper.get('[data-test="admin-verification-reason"]').setValue('Documents did not match')
    await flush()
    await wrapper.get('[data-test="admin-verification-reject-form"]').trigger('submit')

    expect(wrapper.emitted('reject')?.[0]).toEqual(['Documents did not match'])
  })

  it('lists the missing setup steps blocked by the backend', async () => {
    const wrapper = await mountSuspended(AdminVerificationRow, {
      props: {
        kind: 'printer',
        name: 'Northpress',
        status: 'pending',
        missingSteps: ['Add a machine', 'Confirm your rate card'],
      },
    })

    const text = wrapper.text()
    expect(text).toContain('Add a machine')
    expect(text).toContain('Confirm your rate card')
  })
})

describe('admin manager approval flow', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    apiMock.mockReset()
  })

  it('moves a registered manager from pending to verified after an admin approves', async () => {
    apiMock.mockImplementation(async (path: string, options?: { method?: string, body?: any }) => {
      if (path === '/admin/verifications/managers/?status=all') {
        return { count: 1, results: [manager()] }
      }
      if (path === '/admin/verifications/managers/7/decision/' && options?.method === 'POST') {
        return manager({ status: 'verified', manager_verified: true })
      }
      throw new Error(`unexpected api call ${options?.method ?? 'GET'} ${path}`)
    })

    const pinia = createPinia()
    setActivePinia(pinia)
    const wrapper = await mountSuspended(AdminManagersView, { global: { plugins: [pinia] } })
    await flush()

    const pending = wrapper.get('[data-test="admin-manager-pending"]')
    expect(pending.text()).toContain('Dale Mwangi')
    expect(pending.text()).toContain('Pending')

    await pending.get('[data-test="admin-verification-approve"]').trigger('click')
    await flush()

    expect(apiMock).toHaveBeenCalledWith('/admin/verifications/managers/7/decision/', {
      method: 'POST',
      body: { decision: 'approve', reason: '' },
    })

    expect(wrapper.find('[data-test="admin-manager-pending"]').exists()).toBe(false)
    const verified = wrapper.get('[data-test="admin-manager-verified"]')
    expect(verified.text()).toContain('Dale Mwangi')
    expect(verified.text()).toContain('Verified')
  })
})
