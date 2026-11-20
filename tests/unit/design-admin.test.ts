import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'

import DesignAdminStatusPill from '~/components/design/admin/AdminStatusPill.vue'
import DesignAdminCustodyChip from '~/components/design/admin/AdminCustodyChip.vue'
import { DESIGN_NAV_SECTIONS } from '~/utils/design/nav'

const appDir = resolve(__dirname, '../../app')
const read = (rel: string) => readFileSync(resolve(appDir, rel), 'utf8')

const ADMIN_PAGES: Array<[string, string]> = [
  ['pages/app/admin.vue', '<NuxtPage />'],
  ['pages/app/admin/index.vue', '<AdminOverviewView />'],
  ['pages/app/admin/jobs.vue', '<AdminJobsView />'],
  ['pages/app/admin/quotes.vue', '<AdminQuotesView />'],
  ['pages/app/admin/managers.vue', '<AdminManagersView />'],
  ['pages/app/admin/printers.vue', '<AdminPrintersView />'],
  ['pages/app/admin/custody.vue', '<AdminCustodyView />'],
  ['pages/app/admin/disputes.vue', '<AdminDisputesView />'],
]

const DESIGN_ADMIN_COMPONENTS = [
  'AdminFrame.vue',
  'AdminPageHeader.vue',
  'AdminSection.vue',
  'AdminPlaceholder.vue',
  'AdminStatusPill.vue',
  'AdminCustodyChip.vue',
  'AdminCustodyBar.vue',
  'AdminJobRow.vue',
  'AdminJobList.vue',
  'AdminVerificationRow.vue',
  'AdminPartnerPeek.vue',
  'AdminNetworkRoster.vue',
]

const ADMIN_ROUTES = [
  '/app/admin',
  '/app/admin/jobs',
  '/app/admin/quotes',
  '/app/admin/managers',
  '/app/admin/printers',
  '/app/admin/custody',
  '/app/admin/disputes',
]

describe('admin workspace on design (Phase 9)', () => {
  it('routes every admin page through the design workspace layout while keeping proto-role', () => {
    for (const [file, component] of ADMIN_PAGES) {
      const page = read(file)
      expect(page, `${file} layout`).toContain("layout: 'design-workspace'")
      expect(page, `${file} middleware`).toContain("middleware: 'proto-role'")
      expect(page, `${file} component`).toContain(component)
    }
  })

  it('replaces the legacy admin shell with the design frame but keeps hydrate and refresh', () => {
    const frame = read('components/design/admin/AdminFrame.vue')
    expect(frame).toContain('useAdminNav()')
    expect(frame).toContain('hydrate()')
    expect(frame).toContain('refresh()')
    expect(frame).toContain('admins.clearFocus()')
    expect(frame).toContain('loadError')
    expect(frame).toContain('Breadcrumb')
    expect(frame).not.toMatch(/<AdminShell|<AdminNavPanel/)

    const adminPage = read('pages/app/admin.vue')
    expect(adminPage).toContain('<DesignAdminFrame>')
    expect(adminPage).not.toContain('<AdminShell>')
  })

  it('points the super_admin design nav at every real admin route', () => {
    const hrefs = DESIGN_NAV_SECTIONS.super_admin
      .flatMap(section => section.items)
      .map(item => item.href)

    for (const route of ADMIN_ROUTES) {
      expect(hrefs, `admin nav should link ${route}`).toContain(route)
    }

    // The design-source section anchors stay addressable on the overview.
    for (const anchor of ['/app/admin#ledger', '/app/admin#escrow']) {
      expect(hrefs, `admin nav should keep ${anchor}`).toContain(anchor)
    }
  })

  it('ships the design admin components as presentational building blocks', () => {
    for (const file of DESIGN_ADMIN_COMPONENTS) {
      const source = read(`components/design/admin/${file}`)
      expect(source, `${file} should render markup`).toMatch(/<template>/)
      expect(source, `${file} must not reference the design source`).not.toMatch(/New[_]Design/)
      expect(source, `${file} must not fetch directly`).not.toMatch(/\$fetch|\buseFetch\b|API\./)

      // AdminFrame is the one component allowed to own the admin navigation
      // composable; every other design admin component stays presentational.
      if (file !== 'AdminFrame.vue') {
        expect(source, `${file} should not import stores`).not.toMatch(/stores\//)
      }
    }
  })

  it('keeps every existing admin behaviour on the rebuilt views', () => {
    const overview = read('components/workbench/views/admin/AdminOverviewView.vue')
    expect(overview).toContain('useAdminStore()')
    expect(overview).toContain('fetchReporting()')

    const jobs = read('components/workbench/views/admin/AdminJobsView.vue')
    expect(jobs).toContain("workflow.act('open-job', job)")

    const quotes = read('components/workbench/views/admin/AdminQuotesView.vue')
    expect(quotes).toContain("workflow.act('open-job', job)")

    const managers = read('components/workbench/views/admin/AdminManagersView.vue')
    expect(managers).toContain('API.admin.verificationManagers')
    expect(managers).toContain('API.admin.managerDecision')

    const printers = read('components/workbench/views/admin/AdminPrintersView.vue')
    expect(printers).toContain('API.admin.verificationPrinters')
    expect(printers).toContain('API.admin.printerDecision')

    const custody = read('components/workbench/views/admin/AdminCustodyView.vue')
    expect(custody).toContain('API.admin.custody')
    expect(custody).toContain('API.admin.custodyRelease')

    const disputes = read('components/workbench/views/admin/AdminDisputesView.vue')
    expect(disputes).toContain('API.admin.disputes')
    expect(disputes).toContain('API.admin.disputeResolve')
  })

  it('removes the old static verification, custody and dispute placeholders', () => {
    const overview = read('components/workbench/views/admin/AdminOverviewView.vue')
    expect(overview).not.toContain('MANAGERS')
    expect(overview).not.toContain('PRINTERS')
    expect(overview).not.toContain('No reporting API yet')
    expect(overview).not.toContain('Margin ledger is not available')
    for (const anchor of ['ledger', 'escrow']) {
      expect(overview, `overview should keep the #${anchor} anchor`).toContain(`id="${anchor}"`)
    }

    const managers = read('components/workbench/views/admin/AdminManagersView.vue')
    expect(managers).not.toContain('Manager verification queue is not available')
    expect(managers).not.toContain('MANAGERS')

    const printers = read('components/workbench/views/admin/AdminPrintersView.vue')
    expect(printers).not.toContain('Verification decisions are not available')
    expect(printers).not.toContain('PRINTERS')

    const custody = read('components/workbench/views/admin/AdminCustodyView.vue')
    expect(custody).toContain('API.admin.custody')

    const disputes = read('components/workbench/views/admin/AdminDisputesView.vue')
    expect(disputes).toContain('API.admin.disputes')
    expect(disputes).not.toContain("workflow.act('resolve-dispute'")
  })

  it('renders workflow status and custody in the design pill language', async () => {
    const onTrack = await mountSuspended(DesignAdminStatusPill, { props: { status: 'on-track' } })
    expect(onTrack.text()).toContain('On track')

    const disputed = await mountSuspended(DesignAdminStatusPill, { props: { status: 'disputed' } })
    expect(disputed.text()).toContain('Disputed')

    const held = await mountSuspended(DesignAdminCustodyChip, { props: { custody: 'held' } })
    expect(held.text()).toContain('Held')
  })
})
