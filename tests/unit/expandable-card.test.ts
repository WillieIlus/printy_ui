import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ExpandableCard from '~/components/workbench/ui/ExpandableCard.vue'

describe('ExpandableCard', () => {
  it('starts collapsed and expands from the trigger', async () => {
    const wrapper = mount(ExpandableCard, {
      props: { open: false, code: 'MJ-1', title: 'A5 Flyers', status: 'In production', total: 'KSh 12,400' },
      slots: { default: '<div data-test="body-content">panel body</div>' },
    })

    const card = wrapper.get('[data-test="expandable-card"]')
    const trigger = wrapper.get('[data-test="expandable-trigger"]')

    expect(card.attributes('data-open')).toBe('false')
    expect(trigger.attributes('aria-expanded')).toBe('false')
    expect(wrapper.find('[data-test="expandable-open-badge"]').exists()).toBe(false)
    expect(wrapper.text()).toContain('MJ-1')
    expect(wrapper.text()).toContain('A5 Flyers')
    expect(wrapper.text()).toContain('In production')
    expect(wrapper.text()).toContain('KSh 12,400')

    await trigger.trigger('click')

    expect(wrapper.emitted('toggle')).toEqual([[true]])
    expect(wrapper.emitted('update:open')).toEqual([[true]])
  })

  it('collapses when the open card is clicked and works from the keyboard', async () => {
    const wrapper = mount(ExpandableCard, {
      props: { open: true },
      slots: { default: '<div>body</div>' },
    })

    await wrapper.get('[data-test="expandable-trigger"]').trigger('click')
    expect(wrapper.emitted('toggle')).toEqual([[false]])

    await wrapper.get('[data-test="expandable-trigger"]').trigger('keydown.enter')
    expect(wrapper.emitted('toggle')?.[1]).toEqual([false])

    await wrapper.get('[data-test="expandable-trigger"]').trigger('keydown.space')
    expect(wrapper.emitted('toggle')?.[2]).toEqual([false])
  })

  it('wires aria-controls to the panel and keys the panel off the given id', () => {
    const wrapper = mount(ExpandableCard, {
      props: { id: 'job-7', open: false },
      slots: { default: '<div>body</div>' },
    })

    expect(wrapper.get('[data-test="expandable-card"]').attributes('id')).toBe('job-7')
    expect(wrapper.get('[data-test="expandable-trigger"]').attributes('aria-controls')).toBe('job-7-panel')
    expect(wrapper.get('[data-test="expandable-body"]').attributes('id')).toBe('job-7-panel')
  })

  it('highlights cards flagged for attention', () => {
    const wrapper = mount(ExpandableCard, { props: { attention: true } })
    expect(wrapper.get('[data-test="expandable-card"]').classes()).toContain('ring-2')

    const calm = mount(ExpandableCard, { props: { attention: false } })
    expect(calm.get('[data-test="expandable-card"]').classes()).not.toContain('ring-2')
  })

  it('scrolls the card into view and focuses the panel on open only', async () => {
    const scrollIntoView = vi.fn()
    Element.prototype.scrollIntoView = scrollIntoView

    const scrolling = mount(ExpandableCard, { props: { open: false, scrollOnOpen: true } })
    await scrolling.get('[data-test="expandable-trigger"]').trigger('click')
    await scrolling.vm.$nextTick()
    expect(scrollIntoView).toHaveBeenCalledTimes(1)

    const still = mount(ExpandableCard, { props: { open: false, scrollOnOpen: false } })
    await still.get('[data-test="expandable-trigger"]').trigger('click')
    await still.vm.$nextTick()
    expect(scrollIntoView).toHaveBeenCalledTimes(1)
  })

  it('lets a parent render its own summary', () => {
    const wrapper = mount(ExpandableCard, {
      props: { open: false, title: 'ignored default' },
      slots: { summary: '<span data-test="custom-summary">Custom summary</span>' },
    })

    expect(wrapper.find('[data-test="custom-summary"]').exists()).toBe(true)
    expect(wrapper.text()).not.toContain('ignored default')
  })

  it('renders a header slot above the summary when provided', () => {
    const wrapper = mount(ExpandableCard, {
      props: { open: false },
      slots: { header: '<span data-test="custom-header">Header</span>' },
    })

    expect(wrapper.find('[data-test="custom-header"]').exists()).toBe(true)
  })

  it('renders the footer slot only when it is provided', () => {
    const withoutFooter = mount(ExpandableCard, { props: { open: false } })
    expect(withoutFooter.find('[data-test="expandable-footer"]').exists()).toBe(false)

    const withFooter = mount(ExpandableCard, {
      props: { open: false },
      slots: { footer: '<span data-test="job-code">MJ-1</span>' },
    })
    expect(withFooter.find('[data-test="expandable-footer"]').exists()).toBe(true)
    expect(withFooter.find('[data-test="job-code"]').text()).toBe('MJ-1')
  })

  it('prefers the body slot but falls back to the default slot', () => {
    const withBody = mount(ExpandableCard, {
      props: { open: true },
      slots: {
        body: '<span data-test="named-body">named</span>',
        default: '<span data-test="default-body">default</span>',
      },
    })
    expect(withBody.find('[data-test="named-body"]').exists()).toBe(true)
    expect(withBody.find('[data-test="default-body"]').exists()).toBe(false)

    const withDefault = mount(ExpandableCard, {
      props: { open: true },
      slots: { default: '<span data-test="default-body">default</span>' },
    })
    expect(withDefault.find('[data-test="default-body"]').exists()).toBe(true)
  })

  it('applies muted and attention state as data attributes and classes', () => {
    const muted = mount(ExpandableCard, { props: { muted: true } })
    const mutedCard = muted.get('[data-test="expandable-card"]')
    expect(mutedCard.attributes('data-muted')).toBe('true')
    expect(mutedCard.classes()).toContain('opacity-60')

    const attention = mount(ExpandableCard, { props: { attention: true } })
    const attentionCard = attention.get('[data-test="expandable-card"]')
    expect(attentionCard.attributes('data-attention')).toBe('true')
    expect(attentionCard.classes()).toContain('ring-2')

    const plain = mount(ExpandableCard)
    const plainCard = plain.get('[data-test="expandable-card"]')
    expect(plainCard.attributes('data-muted')).toBe('false')
    expect(plainCard.attributes('data-attention')).toBe('false')
    expect(plainCard.classes()).not.toContain('opacity-60')
    expect(plainCard.classes()).not.toContain('ring-2')
  })

  it('switches radius by size without changing default behaviour', () => {
    const def = mount(ExpandableCard)
    expect(def.get('[data-test="expandable-card"]').attributes('data-size')).toBe('default')
    expect(def.get('[data-test="expandable-card"]').classes()).toContain('rounded-3xl')

    const compact = mount(ExpandableCard, { props: { size: 'compact' } })
    expect(compact.get('[data-test="expandable-card"]').attributes('data-size')).toBe('compact')
    expect(compact.get('[data-test="expandable-card"]').classes()).toContain('rounded-2xl')
    expect(compact.get('[data-test="expandable-trigger"]').classes()).toContain('p-4')
  })

  it('keeps motion class on the body and marks the card for reduced-motion', () => {
    const wrapper = mount(ExpandableCard, {
      props: { open: true },
      slots: { default: '<div>body</div>' },
    })
    expect(wrapper.get('[data-test="expandable-body"]').classes()).toContain('expandable-motion')
    expect(wrapper.get('[data-test="expandable-card"]').classes()).toContain('expandable-card')
  })

  it('toggles aria-expanded on the trigger when opened', async () => {
    const wrapper = mount(ExpandableCard, {
      props: { open: false },
      slots: { default: '<div>body</div>' },
    })
    const trigger = wrapper.get('[data-test="expandable-trigger"]')
    expect(trigger.attributes('aria-expanded')).toBe('false')

    await trigger.trigger('click')
    await wrapper.setProps({ open: true })
    expect(trigger.attributes('aria-expanded')).toBe('true')
    expect(wrapper.find('[data-test="expandable-open-badge"]').exists()).toBe(true)
  })
})
