import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { nextTick } from 'vue'
import { flushPromises } from '@vue/test-utils'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import HomeView from '~/components/workbench/views/HomeView.vue'
import SampleJobTicket from '~/components/workbench/marketing/SampleJobTicket.vue'

const { navigateToMock } = vi.hoisted(() => ({ navigateToMock: vi.fn() }))
mockNuxtImport('navigateTo', () => navigateToMock)

const stubs = {
  CalculatorView: { template: '<div data-test="calculator" />' },
  RevealOnScroll: { template: '<section><slot /></section>' },
}

beforeEach(() => {
  navigateToMock.mockReset()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('Homepage hero — "Where is my job?"', () => {
  it('renders the tracking headline, subline, job-code box and labelled sample', async () => {
    const wrapper = await mountSuspended(HomeView, { global: { stubs } })
    const text = wrapper.text()

    expect(text).toContain("Where's my job? Never call again.")
    expect(text).toContain('Live stage and time left on every print job.')
    expect(wrapper.find('#home-job-code').exists()).toBe(true)
    expect(text).toContain('Sample job')
    expect(text).toContain('Demo — not a real order')
    expect(text).toContain('Pay, and your job appears at the top of your dashboard. No code needed.')
  })

  it('sends the entered job code to the track page', async () => {
    const wrapper = await mountSuspended(HomeView, { global: { stubs } })
    await wrapper.get('#home-job-code').setValue('QR-2026-1042')
    await wrapper.get('form').trigger('submit')
    await nextTick()

    expect(navigateToMock).toHaveBeenCalledWith('/track/QR-2026-1042')
  })

  it('does not pitch fake managers and keeps the trusted-landing promises', async () => {
    const wrapper = await mountSuspended(HomeView, { global: { stubs } })
    const html = wrapper.html()

    expect(html).not.toContain('show-manager-cards')
    expect(html).not.toContain('Gitau')
    expect(html).not.toContain('North Press')
    expect(wrapper.text()).toContain('fair-price cap')
    expect(wrapper.text()).toContain('Verified printing managers')
  })
})

describe('Sample job demo', () => {
  it('shows all seven buyer stages in the dashboard order', async () => {
    const wrapper = await mountSuspended(SampleJobTicket)
    const labels = wrapper.findAll('.ticket-stepper__label').map((node) => node.text())

    expect(labels).toEqual([
      'Payment received',
      'Artwork check',
      'Printing',
      'Finishing',
      'Quality check',
      'Out for delivery',
      'Delivered',
    ])
  })

  it('auto-plays forward and shows the plain stage note', async () => {
    const intervalSpy = vi.spyOn(globalThis, 'setInterval')
    const wrapper = await mountSuspended(SampleJobTicket)
    const tick = intervalSpy.mock.calls.find((entry) => entry[1] === 1000)?.[0] as () => void
    expect(tick).toBeTruthy()

    expect(wrapper.text()).toContain('Printing')
    tick()
    tick()
    tick()
    await nextTick()
    await flushPromises()

    expect(wrapper.text()).toContain('Being laminated')
  })

  it('pauses and resumes with one control', async () => {
    const intervalSpy = vi.spyOn(globalThis, 'setInterval')
    const wrapper = await mountSuspended(SampleJobTicket)
    const tick = intervalSpy.mock.calls.find((entry) => entry[1] === 1000)?.[0] as () => void

    await wrapper.get('.sample__play').trigger('click')
    expect(wrapper.get('.sample__play').text()).toContain('Play')
    tick()
    tick()
    tick()
    await nextTick()
    expect(wrapper.text()).toContain('Printing')
    expect(wrapper.text()).not.toContain('Being laminated')

    await wrapper.get('.sample__play').trigger('click')
    expect(wrapper.get('.sample__play').text()).toContain('Pause')
  })

  it('renders a static stepper with no autoplay when reduced motion is requested', async () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: true,
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as unknown as MediaQueryList)
    const intervalSpy = vi.spyOn(globalThis, 'setInterval')

    const wrapper = await mountSuspended(SampleJobTicket)

    expect(wrapper.get('.sample__play').text()).toContain('Play')
    expect(wrapper.text()).toContain('Printing')
    expect(intervalSpy.mock.calls.some((entry) => entry[1] === 1000)).toBe(false)
  })

  it('jumps to a stage when one of the three questions is clicked', async () => {
    const wrapper = await mountSuspended(SampleJobTicket)
    const vm = wrapper.vm as unknown as { jumpTo: (key: string) => void }
    vm.jumpTo('out_for_delivery')
    await nextTick()

    expect(wrapper.text()).toContain('Out for delivery')
    expect(wrapper.get('.sample__play').text()).toContain('Play')
  })
})
