import { describe, it, expect } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ManagerMarginPanel from '~/components/workbench/views/ManagerMarginPanel.vue'
import { useAuthStore } from '~/stores/auth'
import { marginRows } from '~/shared/margin'
import type { ManagerPricingBreakdown } from '~/shared/types'

function breakdown(): ManagerPricingBreakdown {
  return {
    printer_total: '900.00',
    markup_pct: '12.50',
    markup_amount: '112.50',
    printy_fee: '25.00',
    manager_total_to_client: '1037.50',
    per_piece: '2.08',
  }
}

async function mountPanel(options: {
  role?: 'partner' | 'client'
  props?: Record<string, unknown>
} = {}) {
  const pinia = createPinia()
  setActivePinia(pinia)
  useAuthStore(pinia).activeRole = options.role ?? 'partner'
  const wrapper = await mountSuspended(ManagerMarginPanel, {
    props: { ...options.props },
    global: { plugins: [pinia] },
  })
  await wrapper.vm.$nextTick()
  return wrapper
}

describe('marginRows', () => {
  it('reads all six figures from the server breakdown and formats them', () => {
    const rows = marginRows(breakdown(), 'KES')
    expect(rows.map((row) => row.key)).toEqual([
      'printer_total', 'markup_pct', 'markup_amount', 'printy_fee', 'client_total', 'per_piece',
    ])
    expect(rows.find((row) => row.key === 'printer_total')?.value).toBe('KES 900.00')
    expect(rows.find((row) => row.key === 'markup_pct')?.value).toBe('12.50%')
    expect(rows.find((row) => row.key === 'client_total')?.value).toBe('KES 1,037.50')
    expect(rows.find((row) => row.key === 'per_piece')?.value).toBe('KES 2.08')
  })

  it('falls back to an em dash instead of inventing any figure', () => {
    const rows = marginRows(null, 'KES')
    expect(rows).toHaveLength(6)
    rows.forEach((row) => expect(row.value).toBe('—'))
  })
})

describe('ManagerMarginPanel', () => {
  it('shows the six server figures for the manager and nothing is recalculated here', async () => {
    const wrapper = await mountPanel({ props: { breakdown: breakdown() } })

    expect(wrapper.find('[data-test="manager-margin-panel"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('nothing is')
    expect(wrapper.find('[data-test="margin-value-printer_total"]').text()).toBe('KES 900.00')
    expect(wrapper.find('[data-test="margin-value-markup_pct"]').text()).toBe('12.50%')
    expect(wrapper.find('[data-test="margin-value-markup_amount"]').text()).toBe('KES 112.50')
    expect(wrapper.find('[data-test="margin-value-printy_fee"]').text()).toBe('KES 25.00')
    expect(wrapper.find('[data-test="margin-value-client_total"]').text()).toBe('KES 1,037.50')
    expect(wrapper.find('[data-test="margin-value-per_piece"]').text()).toBe('KES 2.08')
    expect(wrapper.find('[data-test="margin-hint"]').exists()).toBe(false)
  })

  it('hints the manager until a printer option has been calculated', async () => {
    const wrapper = await mountPanel({ props: { breakdown: null } })

    expect(wrapper.find('[data-test="margin-hint"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="margin-value-printer_total"]').text()).toBe('—')
  })

  it('renders the markup input and Calculate button wired to the parent', async () => {
    const wrapper = await mountPanel({ props: { modelValue: '12.5', disabled: false } })

    const input = wrapper.get('[data-test="margin-markup-input"]')
    expect((input.element as HTMLInputElement).value).toBe('12.5')
    await input.setValue('15')
    // v-model on a numeric input hands the parent a number.
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([15])

    const button = wrapper.get('[data-test="margin-calculate"]')
    expect((button.element as HTMLButtonElement).disabled).toBe(false)
    await button.trigger('click')
    expect(wrapper.emitted('calculate')).toHaveLength(1)
  })

  it('disables Calculate while a shop is missing or a recalculation is running', async () => {
    const disabled = await mountPanel({ props: { disabled: true } })
    expect((disabled.get('[data-test="margin-calculate"]').element as HTMLButtonElement).disabled).toBe(true)

    const busy = await mountPanel({ props: { calculating: true } })
    expect((busy.get('[data-test="margin-calculate"]').element as HTMLButtonElement).disabled).toBe(true)
  })

  it('never renders for a non-manager, whatever page mounts it', async () => {
    const wrapper = await mountPanel({ role: 'client', props: { breakdown: breakdown() } })

    expect(wrapper.find('[data-test="manager-margin-panel"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="margin-markup-input"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="margin-calculate"]').exists()).toBe(false)
  })
})
