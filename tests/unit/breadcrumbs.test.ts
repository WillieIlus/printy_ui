import { describe, it, expect } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import AppBreadcrumbs from '~/components/workbench/ui/AppBreadcrumbs.vue'
import { useBreadcrumbLeaf } from '~/composables/useBreadcrumbLeaf'
import { buildBreadcrumbs, readBreadcrumbTrail } from '~/shared/breadcrumbs'

describe('readBreadcrumbTrail', () => {
  it('reads a single string label', () => {
    expect(readBreadcrumbTrail({ breadcrumb: 'Quotes' })).toEqual([{ label: 'Quotes' }])
  })

  it('trims a string label and drops it when blank', () => {
    expect(readBreadcrumbTrail({ breadcrumb: '  Quotes  ' })).toEqual([{ label: 'Quotes' }])
    expect(readBreadcrumbTrail({ breadcrumb: '   ' })).toEqual([])
  })

  it('reads an array of string labels', () => {
    expect(readBreadcrumbTrail({ breadcrumb: ['Quotes', 'Requests'] })).toEqual([
      { label: 'Quotes' },
      { label: 'Requests' },
    ])
  })

  it('keeps the target of an object entry and omits it when missing', () => {
    expect(readBreadcrumbTrail({ breadcrumb: [{ label: 'Quotes', to: '/app/manager/quotes' }, { label: 'Request' }] }))
      .toEqual([{ label: 'Quotes', to: '/app/manager/quotes' }, { label: 'Request' }])
  })

  it('skips entries without a usable label and non-array/non-string meta', () => {
    expect(readBreadcrumbTrail({ breadcrumb: [null, 42, { to: '/x' }, { label: ' ' }] })).toEqual([])
    expect(readBreadcrumbTrail({ breadcrumb: 7 })).toEqual([])
    expect(readBreadcrumbTrail(undefined)).toEqual([])
  })
})

describe('buildBreadcrumbs', () => {
  const home = '/app/manager'

  it('shows only the home crumb on the dashboard root', () => {
    expect(buildBreadcrumbs({ home, path: home })).toEqual([{ label: 'Dashboard' }])
  })

  it('links the home crumb from any deeper page and appends the page trail', () => {
    expect(buildBreadcrumbs({ home, path: '/app/manager/quotes', meta: { breadcrumb: 'Quotes' } }))
      .toEqual([{ label: 'Dashboard', to: home }, { label: 'Quotes' }])
  })

  it('adds the leaf after the trail and links home from the root when a leaf is showing', () => {
    expect(buildBreadcrumbs({ home, path: home, meta: { breadcrumb: 'Jobs' }, leaf: 'MJ-1' }))
      .toEqual([{ label: 'Dashboard', to: home }, { label: 'Jobs' }, { label: 'MJ-1' }])
  })

  it('supports a custom dashboard label', () => {
    expect(buildBreadcrumbs({ home, homeLabel: 'Control room', path: home }))
      .toEqual([{ label: 'Control room' }])
  })

  it('ignores a whitespace-only leaf', () => {
    expect(buildBreadcrumbs({ home, path: home, leaf: '   ' })).toEqual([{ label: 'Dashboard' }])
  })
})

describe('AppBreadcrumbs', () => {
  it('renders the dashboard home and the record leaf published by useBreadcrumbLeaf', async () => {
    const Harness = defineComponent({
      setup() {
        useBreadcrumbLeaf(ref('MJ-20261020-0022'))
        return () => h(AppBreadcrumbs)
      },
    })
    const wrapper = await mountSuspended(Harness)
    await wrapper.vm.$nextTick()

    const links = wrapper.findAll('a')
    expect(links.length).toBe(1)
    expect(links[0]!.text()).toContain('Dashboard')
    expect(wrapper.find('[data-test="breadcrumb-current"]').text()).toBe('MJ-20261020-0022')
  })

  it('clears the leaf when the page showing it unmounts', async () => {
    const Harness = defineComponent({
      setup() {
        useBreadcrumbLeaf(ref('MJ-LEAF'))
        return () => h(AppBreadcrumbs)
      },
    })
    const withLeaf = await mountSuspended(Harness)
    await withLeaf.vm.$nextTick()
    expect(withLeaf.find('[data-test="breadcrumb-current"]').exists()).toBe(true)

    withLeaf.unmount()

    const plain = await mountSuspended(AppBreadcrumbs)
    await plain.vm.$nextTick()
    expect(plain.find('[data-test="breadcrumb-current"]').exists()).toBe(false)
  })
})
