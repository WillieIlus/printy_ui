import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { createPinia, setActivePinia } from 'pinia'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { designCalculatorMode } from '~/utils/design/calculator-mode'
import { useAuthStore } from '~/stores/auth'
import DesignCalculator from '~/components/design/calculator/DesignCalculator.vue'
import DesignCalculatorMinimal from '~/components/design/calculator/DesignCalculatorMinimal.vue'
import DesignCalculatorDetailed from '~/components/design/calculator/DesignCalculatorDetailed.vue'

const MINIMAL_SOURCE = readFileSync(
  path.resolve(process.cwd(), 'app/components/design/calculator/DesignCalculatorMinimal.vue'),
  'utf8',
)

describe('designCalculatorMode — role resolver', () => {
  it('gives signed-out visitors the minimal card even if a role is lying around', () => {
    expect(
      designCalculatorMode({
        isAuthenticated: false,
        activeRole: 'partner',
        accessibleRoles: ['partner', 'super_admin'],
      }),
    ).toBe('minimal')
  })

  it.each(['client', 'buyer', 'customer'])('gives the buyer role %s the minimal card', (role) => {
    expect(designCalculatorMode({ isAuthenticated: true, activeRole: role })).toBe('minimal')
  })

  it.each([
    ['manager', 'detailed'],
    ['broker', 'detailed'],
    ['print_manager', 'detailed'],
    ['printer', 'detailed'],
    ['shop_owner', 'detailed'],
    ['production_shop', 'detailed'],
    ['admin', 'detailed'],
    ['staff', 'detailed'],
    ['superuser', 'detailed'],
    ['super_admin', 'detailed'],
  ])('maps the internal role %s to %s', (role, expected) => {
    expect(designCalculatorMode({ isAuthenticated: true, activeRole: role })).toBe(expected)
  })

  it('follows the ACTIVE role for a user who holds several roles', () => {
    const accessibleRoles = ['client', 'partner', 'production']
    expect(
      designCalculatorMode({ isAuthenticated: true, activeRole: 'client', accessibleRoles }),
    ).toBe('minimal')
    expect(
      designCalculatorMode({ isAuthenticated: true, activeRole: 'partner', accessibleRoles }),
    ).toBe('detailed')
    expect(
      designCalculatorMode({ isAuthenticated: true, activeRole: 'production', accessibleRoles }),
    ).toBe('detailed')
  })

  it('falls back to minimal for unknown, empty or missing roles', () => {
    expect(designCalculatorMode({ isAuthenticated: true, activeRole: 'wizard' })).toBe('minimal')
    expect(designCalculatorMode({ isAuthenticated: true, activeRole: '' })).toBe('minimal')
    expect(designCalculatorMode({ isAuthenticated: true, activeRole: null })).toBe('minimal')
    expect(designCalculatorMode({ isAuthenticated: true })).toBe('minimal')
  })

  it('uses the only accessible role when no active role is set, and refuses to guess otherwise', () => {
    expect(
      designCalculatorMode({ isAuthenticated: true, activeRole: null, accessibleRoles: ['manager'] }),
    ).toBe('detailed')
    expect(
      designCalculatorMode({
        isAuthenticated: true,
        activeRole: null,
        accessibleRoles: ['client', 'manager'],
      }),
    ).toBe('minimal')
  })
})

describe('DesignCalculator wrapper', () => {
  async function mountWrapper(props: Record<string, unknown> = {}) {
    const pinia = createPinia()
    setActivePinia(pinia)
    const wrapper = await mountSuspended(DesignCalculator, {
      props,
      global: {
        plugins: [pinia],
        stubs: {
          DesignCalculatorMinimal: { template: '<div data-stub="minimal" />' },
          DesignCalculatorDetailed: { template: '<div data-stub="detailed" />' },
        },
      },
    })
    return { wrapper, pinia }
  }

  it('renders the one-card minimal layout for a signed-out visitor', async () => {
    const { wrapper } = await mountWrapper()
    expect(wrapper.find('[data-stub="minimal"]').exists()).toBe(true)
    expect(wrapper.find('[data-stub="detailed"]').exists()).toBe(false)
  })

  it('renders the minimal layout for a signed-in client', async () => {
    const { wrapper, pinia } = await mountWrapper()
    const auth = useAuthStore(pinia)
    auth.user = { id: 1 } as never
    auth.activeRole = 'client'
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-stub="minimal"]').exists()).toBe(true)
  })

  it.each(['partner', 'production', 'super_admin'] as const)(
    'renders the multi-card detailed layout for the %s role',
    async (role) => {
      const { wrapper, pinia } = await mountWrapper()
      const auth = useAuthStore(pinia)
      auth.user = { id: 1 } as never
      auth.activeRole = role
      await wrapper.vm.$nextTick()
      expect(wrapper.find('[data-stub="detailed"]').exists()).toBe(true)
      expect(wrapper.find('[data-stub="minimal"]').exists()).toBe(false)
    },
  )

  it('switches layout when the active role changes', async () => {
    const { wrapper, pinia } = await mountWrapper()
    const auth = useAuthStore(pinia)
    auth.user = { id: 1 } as never
    auth.activeRole = 'client'
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-stub="minimal"]').exists()).toBe(true)

    auth.activeRole = 'partner'
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-stub="detailed"]').exists()).toBe(true)
  })

  it('lets a test force the mode with the mode prop', async () => {
    const { wrapper } = await mountWrapper({ mode: 'detailed' })
    expect(wrapper.find('[data-stub="detailed"]').exists()).toBe(true)
  })

  it('mounts both layouts from the one wrapper, never a page-level mode', () => {
    const source = readFileSync(
      path.resolve(process.cwd(), 'app/components/design/calculator/DesignCalculator.vue'),
      'utf8',
    )
    expect(source).toContain('DesignCalculatorMinimal')
    expect(source).toContain('DesignCalculatorDetailed')
    expect(source).toContain('designCalculatorMode')
  })
})

describe('minimal layout isolation', () => {
  it('never imports the breakdown, imposition, shop or detailed-card components', () => {
    for (const forbidden of [
      'PriceRail',
      'LockedManagerCards',
      'ImpositionSheet',
      'DesignCalculatorOptions',
      'DesignCalculatorDetailed',
      'workbench/calculator',
      'shared/workflow/pricing',
      'shared/calculator.ts',
      'shared/quotes',
    ]) {
      expect(MINIMAL_SOURCE).not.toContain(forbidden)
    }
  })

  it('is a single card, not a stack of step cards', () => {
    expect(MINIMAL_SOURCE.match(/<section/g) ?? []).toHaveLength(1)
    expect(MINIMAL_SOURCE).not.toContain('CalculatorStep')
  })

  it('both layouts are distinct components sharing the one wrapper', () => {
    expect(DesignCalculatorMinimal).toBeTruthy()
    expect(DesignCalculatorDetailed).toBeTruthy()
    expect(DesignCalculatorMinimal).not.toBe(DesignCalculatorDetailed)
  })
})
