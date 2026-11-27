import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const appDir = resolve(__dirname, '../../app')
const read = (rel: string) => readFileSync(resolve(appDir, rel), 'utf8')
const exists = (rel: string) => existsSync(resolve(appDir, rel))

describe('canonical overview, list and detail structure', () => {
  it('keeps buyer overview separate from the dedicated jobs list and detail', () => {
    const overview = read('pages/app/buyer/index.vue')
    expect(overview).toContain('<BuyerView />')

    expect(exists('pages/app/buyer/jobs/index.vue')).toBe(true)
    const jobs = read('pages/app/buyer/jobs/index.vue')
    expect(jobs).toContain('<BuyerJobsListView />')
    expect(jobs).toContain("layout: 'design-workspace'")

    const detail = read('pages/app/buyer/jobs/[id].vue')
    expect(detail).toContain('<BuyerJobTimeline')
    expect(detail).toContain("layout: 'design-workspace'")

    const list = read('components/workbench/views/BuyerJobsListView.vue')
    expect(list).toContain('data-test="buyer-jobs-list"')
    expect(list).toContain('data-test="buyer-job-row"')
    expect(list).toContain('/app/buyer/jobs/${job.id}')
    // Overview-only sections never belong on the jobs list.
    expect(list).not.toContain('ClientMyManagersPanel')
    expect(list).not.toContain('QuoteResponsesPanel')
    expect(list).not.toContain('DesignJobCard')
  })

  it('routes manager quotes and jobs as lists, with directly addressable details', () => {
    const quotes = read('pages/app/manager/quotes.vue')
    expect(quotes).toContain('<NuxtPage v-if="route.params.id" />')
    expect(quotes).toContain('<ManagerQuotesListView v-else />')
    expect(read('pages/app/manager/quotes/[id].vue')).toContain('<ManagerQuotesView />')

    const jobs = read('pages/app/manager/jobs.vue')
    expect(jobs).toContain('<NuxtPage v-if="route.params.id" />')
    expect(jobs).toContain('<ManagerJobsView v-else />')
    expect(read('pages/app/manager/jobs/[id].vue')).toContain('<JobCardPage')

    const quoteList = read('components/workbench/views/ManagerQuotesListView.vue')
    expect(quoteList).toContain('Quote workload')
    expect(quoteList).toContain('/app/manager/quotes/${row.id}')
    expect(quoteList).not.toContain('ManagerMarginPanel')
    expect(quoteList).not.toContain('ManagerClientLinkPanel')
    expect(quoteList).not.toContain('manager-quote-one-screen')

    const jobList = read('components/workbench/views/ManagerJobsView.vue')
    expect(jobList).toContain('/app/manager/jobs/${job.id}')
    expect(jobList).not.toContain('DesignJobCard')
    expect(jobList).not.toContain('FloatingNextStepCard')
    expect(jobList).not.toContain('Settlement split')
  })

  it('keeps old buyer and manager URLs as working aliases', () => {
    expect(exists('pages/app/buyer/orders/[id].vue')).toBe(true)
    expect(read('pages/app/buyer/orders/[id].vue')).toContain('<BuyerJobTimeline')
    expect(exists('pages/app/buyer/job-card/[id].vue')).toBe(true)
    expect(exists('pages/app/manager/job-card/[id].vue')).toBe(true)
    expect(read('pages/app/manager/job-card/[id].vue')).toContain('JobCardPage')
    expect(exists('pages/app/manager/jobs/[id].vue')).toBe(true)

    // Legacy /app/buyer#jobs lands on the dedicated list.
    expect(read('components/workbench/views/BuyerView.vue')).toContain("route.hash === '#jobs'")
    expect(read('components/workbench/views/BuyerView.vue')).toContain("navigateTo('/app/buyer/jobs')")
  })

  it('points workspace navigation at the dedicated jobs list', () => {
    expect(read('utils/design/nav.ts')).toContain("{ label: 'My jobs', href: '/app/buyer/jobs', icon: 'jobs' }")
    expect(read('components/workbench/ui/ClientShell.vue')).toContain("to: '/app/buyer/jobs'")
  })
})
