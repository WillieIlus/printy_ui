import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import PrinterView from '~/components/workbench/views/PrinterView.vue'

const { apiMock } = vi.hoisted(() => ({ apiMock: vi.fn() }))

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({
    api: apiMock,
    publicApi: vi.fn(),
    publicApiNoAuth: vi.fn(),
    getMediaUrl: vi.fn(),
  }),
}))

vi.mock('~/stores/auth', () => ({
  useAuthStore: () => ({
    isAuthenticated: true,
    user: { name: 'Jon Weber', email: 'jon@example.com' },
  }),
}))

beforeEach(() => {
  apiMock.mockReset()
})

async function mountView() {
  const pinia = createPinia()
  setActivePinia(pinia)
  const wrapper = await mountSuspended(PrinterView, { global: { plugins: [pinia] } })
  await new Promise((resolve) => setTimeout(resolve, 0))
  return wrapper
}

describe('PrinterView — rate card go-live status (Phase 3A Task B)', () => {
  it('shows remaining steps when the owner has not confirmed yet', async () => {
    apiMock.mockResolvedValue({
      setup_status: { is_confirmed: false, completed_steps: 3, total_steps: 4 },
    })
    const wrapper = await mountView()
    expect(wrapper.get('a[href="/app/printer/rates"]').text()).toContain('3 of 4 steps done')
  })

  it('shows the calm live state once confirmed', async () => {
    apiMock.mockResolvedValue({
      setup_status: { is_confirmed: true, completed_steps: 4, total_steps: 4 },
    })
    const wrapper = await mountView()
    expect(wrapper.get('a[href="/app/printer/rates"]').text()).toContain('You are live to managers.')
  })
})
