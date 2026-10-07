import { describe, it, expect, vi } from 'vitest'
import { nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import SignUpView from '~/components/workbench/views/SignUpView.vue'

const signUp = vi.fn(async () => ({ detail: 'Created', verification_required: false }))

vi.mock('~/stores/auth', () => ({
  useAuthStore: () => ({
    signUp,
    initialize: vi.fn(async () => {}),
    isInitialized: true,
    isAuthenticated: false,
    user: null,
  }),
}))

vi.mock('~/stores/calculator', () => ({
  useCalculatorStore: () => ({
    guestSessionKey: () => 'guest-session',
    pendingDraft: () => null,
    forgetPendingDraft: () => {},
  }),
}))

describe('SignUpView — printer company name', () => {
  it('submits the print shop company name with the production role', async () => {
    signUp.mockClear()
    const pinia = createPinia()
    setActivePinia(pinia)
    const wrapper = await mountSuspended(SignUpView, { global: { plugins: [pinia] } })

    const printerCard = wrapper.findAll('button').find((b) => b.text().includes('I own the presses'))
    await printerCard.trigger('click')
    await nextTick()

    await wrapper.get('input[placeholder="Ava Lindqvist"]').setValue('Jon Weber')
    await wrapper.get('input[placeholder="North Press Co."]').setValue('North Press Co.')
    await wrapper.get('input[placeholder="you@company.co.ke"]').setValue('north@test.com')
    await wrapper.get('input[placeholder="8+ characters"]').setValue('Pass12345')

    const submit = wrapper.findAll('button').find((b) => b.text().includes('Create printer account'))
    expect(submit).toBeTruthy()
    await wrapper.get('form').trigger('submit')
    await new Promise((r) => setTimeout(r, 0))

    expect(signUp).toHaveBeenCalledTimes(1)
    expect(signUp).toHaveBeenCalledWith(expect.objectContaining({
      role: 'production',
      shop_name: 'North Press Co.',
      email: 'north@test.com',
    }))
  })
})