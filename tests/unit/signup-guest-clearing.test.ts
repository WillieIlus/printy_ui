import { describe, it, expect, vi, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import SignUpView from '~/components/workbench/views/SignUpView.vue'

const signUp = vi.fn(async () => ({ detail: 'Created', verification_required: false }))
const forgetPendingDraft = vi.fn()
const forgetPendingManagerSelection = vi.fn()

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
    forgetPendingDraft,
    pendingManagerSelection: () => ({ id: 7, name: 'Dale' }),
    forgetPendingManagerSelection,
  }),
}))

vi.mock('~/stores/intake', () => ({
  useIntakeStore: () => ({ submit: vi.fn(async () => ({})) }),
}))

async function mountPrinterSignup() {
  const pinia = createPinia()
  setActivePinia(pinia)
  const wrapper = await mountSuspended(SignUpView, { global: { plugins: [pinia] } })

  const printerCard = wrapper.findAll('button').find((b) => b.text().includes('I own the presses'))
  expect(printerCard, 'printer mode card').toBeTruthy()
  await printerCard!.trigger('click')
  await nextTick()

  await wrapper.get('input[placeholder="Ava Lindqvist"]').setValue('Jon Weber')
  await wrapper.get('input[placeholder="North Press Co."]').setValue('North Press Co.')
  await wrapper.get('input[placeholder="you@company.co.ke"]').setValue('north@test.com')
  await wrapper.get('input[placeholder="8+ characters"]').setValue('Pass12345')

  await wrapper.get('form').trigger('submit')
  await new Promise((resolve) => setTimeout(resolve, 0))
  return wrapper
}

describe('SignUpView — law 9.4: manager/printer sign-up clears guest selection', () => {
  beforeEach(() => {
    signUp.mockClear()
    forgetPendingDraft.mockClear()
    forgetPendingManagerSelection.mockClear()
  })

  it('discards a pending manager selection and the guest draft after a printer signs up', async () => {
    await mountPrinterSignup()
    expect(signUp).toHaveBeenCalledTimes(1)
    expect(forgetPendingManagerSelection).toHaveBeenCalled()
    expect(forgetPendingDraft).toHaveBeenCalled()
  })
})
