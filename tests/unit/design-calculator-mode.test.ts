import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { defineComponent } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { useAuthStore } from '~/stores/auth'
import DesignCalculator from '~/components/design/calculator/DesignCalculator.vue'
import DesignCalculatorMinimal from '~/components/design/calculator/DesignCalculatorMinimal.vue'

const CALCULATOR_SOURCE = readFileSync(
  path.resolve(process.cwd(), 'app/components/design/calculator/DesignCalculator.vue'),
  'utf8',
)
const MINIMAL_SOURCE = readFileSync(
  path.resolve(process.cwd(), 'app/components/design/calculator/DesignCalculatorMinimal.vue'),
  'utf8',
)
const WORKFLOW_CARD_SOURCE = readFileSync(
  path.resolve(process.cwd(), 'app/components/design/calculator/CalculatorWorkflowCard.vue'),
  'utf8',
)

const MinimalStub = defineComponent({
  name: 'DesignCalculatorMinimal',
  props: {
    authed: Boolean,
    priceOnly: Boolean,
    showProductionDetails: Boolean,
  },
  template: '<div data-stub="universal" />',
})

async function mountWrapper(user: Record<string, unknown> | null = null) {
  const pinia = createPinia()
  setActivePinia(pinia)
  const auth = useAuthStore(pinia)
  if (user) {
    auth.user = { id: 1, email: 'person@example.com', name: 'Asha Mwangi', ...user } as never
  }
  const wrapper = await mountSuspended(DesignCalculator, {
    global: {
      plugins: [pinia],
      stubs: { DesignCalculatorMinimal: MinimalStub },
    },
  })
  return { wrapper, pinia, auth }
}

describe('DesignCalculator universal wrapper', () => {
  it('mounts the same universal calculator for signed-out visitors', async () => {
    const { wrapper } = await mountWrapper()
    expect(wrapper.find('[data-stub="universal"]').exists()).toBe(true)
    expect(wrapper.findComponent(MinimalStub).props('showProductionDetails')).toBe(false)
  })

  it('keeps the identical presentation for a buyer', async () => {
    const { wrapper } = await mountWrapper({ role: 'client' })
    expect(wrapper.find('[data-stub="universal"]').exists()).toBe(true)
    expect(wrapper.findComponent(MinimalStub).props('showProductionDetails')).toBe(false)
  })

  it('adds production details as a capability for a printer', async () => {
    const { wrapper } = await mountWrapper({ role: 'production' })
    expect(wrapper.find('[data-stub="universal"]').exists()).toBe(true)
    expect(wrapper.findComponent(MinimalStub).props('showProductionDetails')).toBe(true)
  })

  it.each(['partner', 'super_admin'] as const)(
    'adds production details as a capability for the %s role',
    async (role) => {
      const { wrapper } = await mountWrapper({ role })
      expect(wrapper.find('[data-stub="universal"]').exists()).toBe(true)
      // Same design; only the capability flag changes.
      expect(wrapper.findComponent(MinimalStub).props('showProductionDetails')).toBe(true)
    },
  )

  it('never switches to a second calculator design', () => {
    expect(CALCULATOR_SOURCE).toContain('DesignCalculatorMinimal')
    expect(CALCULATOR_SOURCE).not.toContain('DesignCalculatorDetailed')
    expect(CALCULATOR_SOURCE).not.toContain('designCalculatorMode')
    expect(CALCULATOR_SOURCE).not.toContain('CalculatorView')
  })
})

describe('universal calculator shared parts', () => {
  it('renders the shared workflow card, speed cards and price panel', () => {
    for (const shared of [
      'DesignCalculatorWorkflowCard',
      'DesignCalculatorSpeedOptions',
      'DesignCalculatorPricePanel',
    ]) {
      expect(MINIMAL_SOURCE).toContain(shared)
    }
  })

  it('gates manager production cards behind a capability flag', () => {
    expect(MINIMAL_SOURCE).toContain('props.showProductionDetails')
    expect(MINIMAL_SOURCE).toContain('DesignCalculatorOptions')
    expect(MINIMAL_SOURCE).toContain('DesignCalculatorFinishing')
    expect(MINIMAL_SOURCE).toContain('ImpositionSheet')
  })

  it('keeps custom width and length open to every viewer', () => {
    expect(MINIMAL_SOURCE).toContain("finished_size: 'custom'")
    expect(MINIMAL_SOURCE).toContain("'width_mm'")
    expect(MINIMAL_SOURCE).toContain("'height_mm'")
  })

  it('uses one shared numbered workflow card for the homepage and calculator', () => {
    expect(WORKFLOW_CARD_SOURCE).toContain('rounded-3xl border border-line bg-card')
    expect(WORKFLOW_CARD_SOURCE).toContain('font-mono')
    expect(DesignCalculatorMinimal).toBeTruthy()
  })
})
