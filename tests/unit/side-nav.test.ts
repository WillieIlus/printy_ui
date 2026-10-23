import { describe, it, expect, beforeEach } from 'vitest'
import { ref } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime'
import SideNav from '~/components/workbench/ui/SideNav.vue'
import { useAuthStore } from '~/stores/auth'
import { SIDE_NAV_ITEMS, isSideNavActive, sideNavForRole } from '~/shared/nav-sections'

const routePath = ref('/app/manager')

mockNuxtImport('useRoute', () => () => ({ path: routePath.value, meta: {} }) as any)

async function mountNav(role: 'client' | 'partner' | 'production', path = '/app/manager') {
  const pinia = createPinia()
  setActivePinia(pinia)
  useAuthStore(pinia).activeRole = role
  routePath.value = path
  const wrapper = await mountSuspended(SideNav, { global: { plugins: [pinia] } })
  await wrapper.vm.$nextTick()
  return wrapper
}

describe('side nav data', () => {
  it('gives every role its own sections and none to the admin shell', () => {
    expect(sideNavForRole('buyer').map((item) => item.key)).toEqual(['orders', 'messages', 'settings'])
    expect(sideNavForRole('manager').map((item) => item.key)).toEqual([
      'control-room', 'quotes', 'jobs', 'clients', 'rates', 'messages',
    ])
    expect(sideNavForRole('printer').map((item) => item.key)).toEqual(['press-floor', 'rate-card', 'shop', 'messages'])
    expect(sideNavForRole('admin')).toEqual([])
    expect(SIDE_NAV_ITEMS.buyer.length).toBeGreaterThan(0)
  })
})

describe('isSideNavActive', () => {
  it('matches a dashboard root exactly so a deeper page never lights two entries', () => {
    expect(isSideNavActive('/app/manager', '/app/manager')).toBe(true)
    expect(isSideNavActive('/app/manager/quotes', '/app/manager')).toBe(false)
  })

  it('prefix-matches pages below a section', () => {
    expect(isSideNavActive('/app/manager/quotes/11', '/app/manager/quotes')).toBe(true)
    expect(isSideNavActive('/app/messages', '/app/messages')).toBe(true)
    expect(isSideNavActive('/app/buyer', '/app/manager/quotes')).toBe(false)
  })
})

describe('SideNav', () => {
  beforeEach(() => {
    routePath.value = '/app/manager'
  })

  it('renders the manager sections and marks the current one', async () => {
    const wrapper = await mountNav('partner', '/app/manager/quotes')

    for (const key of ['control-room', 'quotes', 'jobs', 'clients', 'rates', 'messages']) {
      expect(wrapper.find(`[data-test="side-nav-${key}"]`).exists()).toBe(true)
    }
    expect(wrapper.find('[data-test="side-nav-quotes"]').attributes('data-active')).toBe('true')
    expect(wrapper.find('[data-test="side-nav-quotes"]').attributes('aria-current')).toBe('page')
    expect(wrapper.find('[data-test="side-nav-jobs"]').attributes('data-active')).toBe('false')
  })

  it('renders the buyer sections for a client', async () => {
    const wrapper = await mountNav('client', '/app/buyer')

    expect(wrapper.find('[data-test="side-nav-orders"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="side-nav-quotes"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="side-nav-orders"]').attributes('data-active')).toBe('true')
  })

  it('exposes the collapsible mobile sections control', async () => {
    const wrapper = await mountNav('partner', '/app/manager')

    const toggle = wrapper.find('[data-test="side-nav-toggle"]')
    expect(toggle.attributes('aria-expanded')).toBe('false')
    await toggle.trigger('click')
    expect(toggle.attributes('aria-expanded')).toBe('true')
  })
})
