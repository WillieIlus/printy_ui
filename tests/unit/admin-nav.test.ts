import { describe, it, expect } from 'vitest'
import { existsSync } from 'node:fs'
import path from 'node:path'

import {
  ADMIN_NAV,
  ADMIN_NAV_ITEMS,
  ADMIN_ROOT,
  adminCrumbTrail,
  isAdminNavActive,
  isAwaitingQuote,
  isQuotedItem,
} from '~/shared/admin-nav'
import type { Job } from '~/shared/workflow/printy'

const PAGES_DIR = path.resolve(process.cwd(), 'app/pages')

function job(overrides: Partial<Job>): Job {
  return {
    id: 'j-1',
    code: 'PR-001',
    title: 'Business cards',
    product: 'Cards',
    qty: 500,
    value: 24000,
    buyerId: 'b-1',
    buyerName: 'Amina',
    buyerCompany: 'Amina Traders',
    managerId: 'm-dale',
    printerId: null,
    specs: { material: '350gsm', colors: '4/0', finish: 'Matt lamination', size: 'A6' },
    status: 'on-track',
    custody: 'awaiting',
    stage: 'quote',
    press: null,
    progress: null,
    owner: { name: 'Amina', role: 'Buyer', action: 'Confirm quote', waitingHrs: 2, slaHrs: 24 },
    eta: 'Friday',
    placedAt: 'Today',
    history: [],
    feed: [],
    ...overrides,
  }
}

describe('admin navigation model', () => {
  it('every nav item points at a real admin page file', () => {
    for (const item of ADMIN_NAV_ITEMS) {
      const relative = item.to === ADMIN_ROOT ? 'app/admin.vue' : `${item.to}.vue`
      expect(existsSync(path.join(PAGES_DIR, relative)), `${item.to} should resolve to ${relative}`).toBe(true)
    }
  })

  it('every nav item carries its own icon and blurb', () => {
    for (const item of ADMIN_NAV_ITEMS) {
      expect(item.label.length).toBeGreaterThan(0)
      expect(item.blurb.length).toBeGreaterThan(0)
      expect(item.icon.length).toBeGreaterThan(0)
    }
  })

  it('groups every item exactly once and keeps nav keys unique', () => {
    const keys = ADMIN_NAV.flatMap((group) => group.items.map((item) => item.key))
    expect(new Set(keys).size).toBe(keys.length)
    expect(keys).toContain('overview')
    expect(keys).toContain('quotes')
    expect(keys).toContain('disputes')
  })

  it('only the overview lives at the admin root', () => {
    const atRoot = ADMIN_NAV_ITEMS.filter((item) => item.to === ADMIN_ROOT)
    expect(atRoot).toHaveLength(1)
    expect(atRoot[0]?.key).toBe('overview')
  })
})

describe('admin nav active matching', () => {
  it('matches the exact section only', () => {
    expect(isAdminNavActive('/app/admin', ADMIN_ROOT)).toBe(true)
    expect(isAdminNavActive('/app/admin/', ADMIN_ROOT)).toBe(true)
    expect(isAdminNavActive('/app/admin/quotes', ADMIN_ROOT)).toBe(false)
    expect(isAdminNavActive('/app/admin/quotes', '/app/admin/quotes')).toBe(true)
  })
})

describe('admin breadcrumbs', () => {
  it('builds a two-level trail ending on a non-link', () => {
    const trail = adminCrumbTrail('/app/admin')
    expect(trail).toEqual([
      { label: 'Admin', to: '/app/admin' },
      { label: 'Overview', to: null },
    ])
  })

  it('names the current section for a sub-route', () => {
    expect(adminCrumbTrail('/app/admin/quotes')).toEqual([
      { label: 'Admin', to: '/app/admin' },
      { label: 'Quotes', to: null },
    ])
  })

  it('appends a drill-down label as the leaf crumb', () => {
    expect(adminCrumbTrail('/app/admin/printers', 'North Press Co.')).toEqual([
      { label: 'Admin', to: '/app/admin' },
      { label: 'Printers', to: '/app/admin/printers' },
      { label: 'North Press Co.', to: null },
    ])
  })

  it('falls back to the root crumb on an unknown admin path', () => {
    expect(adminCrumbTrail('/app/admin/nope')).toEqual([{ label: 'Admin', to: null }])
  })
})

describe('quote buckets', () => {
  it('treats an unpriced, unpaid job as awaiting a quote', () => {
    const pending = job({ stage: 'quote', custody: 'awaiting' })
    expect(isAwaitingQuote(pending)).toBe(true)
    expect(isQuotedItem(pending)).toBe(false)
  })

  it('treats a job with artwork in flight as awaiting a quote', () => {
    expect(isAwaitingQuote(job({ stage: 'artwork', custody: 'awaiting' }))).toBe(true)
  })

  it('treats an approved, unpaid job as already quoted', () => {
    const approved = job({ stage: 'approval', custody: 'awaiting' })
    expect(isAwaitingQuote(approved)).toBe(false)
    expect(isQuotedItem(approved)).toBe(true)
  })

  it('treats held and released work as quoted', () => {
    expect(isQuotedItem(job({ stage: 'production', custody: 'held' }))).toBe(true)
    expect(isQuotedItem(job({ stage: 'completed', custody: 'released' }))).toBe(true)
  })

  it('partitions the whole job list with no overlap or gaps', () => {
    const jobs = [
      job({ id: 'a', stage: 'quote', custody: 'awaiting' }),
      job({ id: 'b', stage: 'artwork', custody: 'awaiting' }),
      job({ id: 'c', stage: 'approval', custody: 'awaiting' }),
      job({ id: 'd', stage: 'production', custody: 'held' }),
      job({ id: 'e', stage: 'completed', custody: 'released' }),
    ]
    const awaiting = jobs.filter(isAwaitingQuote)
    const quoted = jobs.filter(isQuotedItem)
    expect(awaiting.map((j) => j.id)).toEqual(['a', 'b'])
    expect(quoted.map((j) => j.id)).toEqual(['c', 'd', 'e'])
    expect(awaiting.length + quoted.length).toBe(jobs.length)
  })
})