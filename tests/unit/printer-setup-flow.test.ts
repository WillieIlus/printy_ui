import { describe, it, expect, vi, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import PrinterSetupGuided from '~/components/design/printer/PrinterSetupGuided.vue'
import { fromRateCard } from '~/utils/design/printer-setup'

const { apiMock } = vi.hoisted(() => ({ apiMock: vi.fn() }))

let payload: any
let status: any
let machines: any[] = []
let confirmed = false

vi.mock('~/composables/useApi', () => ({
  useApi: () => ({ api: apiMock, publicApi: vi.fn(), publicApiNoAuth: vi.fn(), getMediaUrl: vi.fn() }),
}))

async function flush() {
  for (let i = 0; i < 10; i += 1) await nextTick()
}

async function mountGuided() {
  const pinia = createPinia()
  setActivePinia(pinia)
  return mountSuspended(PrinterSetupGuided, {
    props: { initial: fromRateCard(payload) },
    global: { plugins: [pinia] },
  })
}

function rateCardPayload(overrides: Record<string, unknown> = {}) {
  return {
    paper_rows: [
      {
        key: 'art-350',
        paper_name: 'Art Paper',
        gsm: 350,
        size: 'SRA3',
        paper_type: 'Matte',
        paper_base_price: '5.00',
        active: true,
        supports_double_side: true,
      },
    ],
    finishing_rows: [
      { key: 'cut', label: 'Cutting', unit: 'sheet', pricing_mode: 'per_sheet', price: '2.00', minimum_charge: '10.00', active: true },
    ],
    shop_details: { shop_name: '', whatsapp_number: '', location_area: '', standard_turnaround_hours: '' },
    master_settings: { single_print: '16.00', double_print: '25.00', surcharge: '10.00', surcharge_threshold_gsm: 250 },
    setup_status: { is_confirmed: false },
    version: '1',
    ...overrides,
  }
}

describe('progressive printer setup', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    apiMock.mockReset()
    payload = rateCardPayload()
    confirmed = false
    machines = []
    status = () => ({
      has_shop: true,
      has_machines: machines.length > 0,
      has_papers: true,
      has_pricing: Boolean(payload.shop_details.standard_turnaround_hours),
      turnaround_configured: Boolean(payload.shop_details.standard_turnaround_hours),
      shop_profile_complete: Boolean(payload.shop_details.shop_name && payload.shop_details.location_area),
      missing_steps: [
        ...(machines.length ? [] : [{ code: 'machine', title: 'Add your first machine', hint: 'Tell us which press you print on.' }]),
        ...(payload.master_settings.single_print ? [] : [{ code: 'printing_rate', title: 'Set a printing rate', hint: 'Set your per-sheet price.' }]),
        ...(payload.shop_details.standard_turnaround_hours ? [] : [{ code: 'standard_turnaround', title: 'Set your standard turnaround', hint: 'Set your business hours.' }]),
      ],
      steps: [
        { code: 'machine', done: machines.length > 0 },
        { code: 'paper', done: true },
        { code: 'printing_rate', done: Boolean(payload.master_settings.single_print) },
        { code: 'standard_turnaround', done: Boolean(payload.shop_details.standard_turnaround_hours) },
        { code: 'confirm', done: confirmed },
      ],
      setup_status: { is_confirmed: confirmed, steps: [], missing_steps: [] },
    })

    apiMock.mockImplementation(async (path: string, options: any = {}) => {
      if (path === '/shops/') {
        return [{ id: 1, slug: 'mwangaza', name: 'Mwangaza Press', is_public: false, service_area: '', city: '' }]
      }
      if (path === '/shops/1/machines/') {
        if (options.method === 'POST') {
          const created = { id: 9, ...options.body }
          machines = [created]
          return created
        }
        return machines
      }
      if (path === '/setup-status/') return status()
      if (path === '/shops/rate-card/setup/') {
        if (options.method === 'PATCH') {
          payload = rateCardPayload({
            ...payload,
            shop_details: options.body.shop_details,
            master_settings: options.body.master_settings,
            version: '2',
          })
        }
        return payload
      }
      if (path === '/shops/rate-card/onboarding-complete/') {
        confirmed = true
        payload = { ...payload, is_confirmed: true, setup_status: { is_confirmed: true } }
        return { detail: 'Live.' }
      }
      throw new Error(`unexpected api call ${options.method ?? 'GET'} ${path}`)
    })
  })

  it('walks shop, machine, turnaround, first prices and confirm from the backend status', async () => {
    const wrapper = await mountGuided()
    await flush()

    // 1. Shop
    expect(wrapper.find('[data-test="setup-step-shop"]').exists()).toBe(true)
    await wrapper.get('[data-test="setup-shop-name"]').setValue('Mwangaza Press')
    await wrapper.get('[data-test="setup-shop-location"]').setValue('Nairobi')
    await wrapper.get('[data-test="setup-next"]').trigger('click')
    await flush()
    expect(apiMock).toHaveBeenCalledWith('/shops/rate-card/setup/', expect.objectContaining({ method: 'PATCH' }))

    // 2. Machine
    expect(wrapper.find('[data-test="setup-step-machine"]').exists()).toBe(true)
    await wrapper.get('[data-test="setup-machine-name"]').setValue('Main digital press')
    await wrapper.get('[data-test="setup-next"]').trigger('click')
    await flush()
    expect(apiMock).toHaveBeenCalledWith('/shops/1/machines/', expect.objectContaining({ method: 'POST' }))

    // 3. Turnaround
    expect(wrapper.find('[data-test="setup-step-turnaround"]').exists()).toBe(true)
    await wrapper.get('[data-test="setup-turnaround"]').setValue('48')
    await wrapper.get('[data-test="setup-next"]').trigger('click')
    await flush()

    // 4. First prices
    expect(wrapper.find('[data-test="setup-step-prices"]').exists()).toBe(true)
    await wrapper.get('[data-test="setup-print-price"]').setValue('16')
    await new Promise(resolve => setTimeout(resolve, 450))
    await flush()
    await wrapper.get('[data-test="setup-next"]').trigger('click')
    await flush()

    // 5. Confirm and go live
    expect(wrapper.find('[data-test="setup-step-confirm"]').exists()).toBe(true)
    await wrapper.get('[data-test="setup-next"]').trigger('click')
    await flush()
    expect(apiMock).toHaveBeenCalledWith('/shops/rate-card/onboarding-complete/', { method: 'POST' })
    expect(wrapper.find('[data-test="setup-live"]').exists()).toBe(true)
    expect(wrapper.text()).toContain("You're live on Printy")
    expect(wrapper.text()).toContain('Jobs will start to trickle in')
  })

  it('keeps the full rate table behind the Advanced control', async () => {
    const wrapper = await mountGuided()
    await flush()

    expect(wrapper.find('[data-test="setup-advanced-table"]').exists()).toBe(false)
    await wrapper.get('[data-test="setup-advanced-toggle"]').trigger('click')
    expect(wrapper.find('[data-test="setup-advanced-table"]').exists()).toBe(true)
  })
})
