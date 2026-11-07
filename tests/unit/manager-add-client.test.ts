import { describe, it, expect, vi, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ManagerAddClientPanel from '~/components/workbench/views/ManagerAddClientPanel.vue'

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
  for (let i = 0; i < 5; i += 1) await nextTick()
}

async function mount() {
  const pinia = createPinia()
  setActivePinia(pinia)
  return mountSuspended(ManagerAddClientPanel, { global: { plugins: [pinia] } })
}

describe('ManagerAddClientPanel — law 10.5 add a client inside request creation', () => {
  beforeEach(() => {
    apiMock.mockReset()
  })

  it('keeps the submit disabled until name, phone and the permission box are set', async () => {
    const wrapper = await mount()
    const submit = wrapper.get('[data-test="add-client-submit"]')
    expect(submit.attributes('disabled')).toBeDefined()

    await wrapper.get('[data-test="client-name"]').setValue('Ava Client')
    await wrapper.get('[data-test="client-phone"]').setValue('0700000001')
    await flush()
    expect(submit.attributes('disabled')).toBeDefined()

    await wrapper.get('[data-test="contact-checkbox"]').setValue(true)
    await flush()
    expect(submit.attributes('disabled')).toBeUndefined()
  })

  it('requires the contact-permission checkbox and never calls the API without it', async () => {
    const wrapper = await mount()
    await wrapper.get('[data-test="client-name"]').setValue('Ava Client')
    await wrapper.get('[data-test="client-phone"]').setValue('0700000001')
    await flush()

    await wrapper.get('form').trigger('submit')
    await flush()

    expect(apiMock).not.toHaveBeenCalled()
    expect(wrapper.get('[data-test="permission-hint"]').text()).toContain('permission')
  })

  it('posts the client on behalf of the manager and emits created', async () => {
    apiMock.mockResolvedValueOnce({
      quote_request_id: 55,
      request_reference: 'QR-20260101-0055',
      client_name: 'Ava Client',
      client_phone: '254700000001',
    })
    const wrapper = await mount()

    await wrapper.get('[data-test="client-name"]').setValue('Ava Client')
    await wrapper.get('[data-test="client-phone"]').setValue('0700000001')
    await wrapper.get('[data-test="contact-checkbox"]').setValue(true)
    await flush()

    await wrapper.get('form').trigger('submit')
    await flush()

    expect(apiMock).toHaveBeenCalledWith('/client-portal/manager/quote-requests/', {
      method: 'POST',
      body: {
        name: 'Ava Client',
        phone: '0700000001',
        contact_permitted: true,
        email: '',
      },
    })
    expect(wrapper.emitted('created')?.[0]?.[0]).toMatchObject({ quote_request_id: 55 })
    expect(wrapper.get('[data-test="add-client-note"]').text()).toContain('QR-20260101-0055')
  })

  it('shows the backend error when the phone belongs to another account', async () => {
    apiMock.mockRejectedValueOnce({ statusCode: 400, data: { detail: 'That phone number belongs to an existing manager.' } })
    const wrapper = await mount()

    await wrapper.get('[data-test="client-name"]').setValue('Ava')
    await wrapper.get('[data-test="client-phone"]').setValue('0700000001')
    await wrapper.get('[data-test="contact-checkbox"]').setValue(true)
    await flush()
    await wrapper.get('form').trigger('submit')
    await flush()

    expect(wrapper.get('[data-test="add-client-error"]').text()).toContain('existing manager')
  })
})
