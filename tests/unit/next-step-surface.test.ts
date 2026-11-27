import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const appDir = resolve(__dirname, '../../app')
const read = (rel: string) => readFileSync(resolve(appDir, rel), 'utf8')

describe('next-step surfaces', () => {
  it('keeps floating next-step cards off the job lists and detail surfaces', () => {
    for (const file of [
      'components/workbench/views/ManagerJobsView.vue',
      'components/workbench/tracker/BuyerJobTimeline.vue',
    ]) {
      const source = read(file)
      expect(source, `${file} should not use a floating card`).not.toContain('floating-next-step')
    }
    for (const file of ['components/workbench/views/ManagerView.vue', 'components/workbench/views/PrinterView.vue']) {
      const source = read(file)
      expect((source.match(/<FloatingNextStepCard/g) ?? []).length, `${file} keeps its dashboard card`).toBe(1)
    }
    expect(read('components/workbench/views/BuyerView.vue')).not.toContain('<FloatingNextStepCard')
  })

  it('embeds one next-step card inside the buyer job detail card', () => {
    const source = read('components/workbench/tracker/BuyerJobTimeline.vue')
    expect((source.match(/<FloatingNextStepCard/g) ?? []).length).toBe(1)
    expect(source).toContain('embedded')
    expect(source).toContain('<DesignJobCommandCenter')
    expect(source).not.toContain('card-target')
    expect(source).toContain('/app/buyer/jobs')
    for (const page of [
      'pages/app/buyer/job-card/[id].vue',
      'pages/app/manager/job-card/[id].vue',
      'pages/app/printer/job-card/[id].vue',
      'pages/app/manager/jobs/[id].vue',
      'pages/app/printer/jobs/[id].vue',
    ]) {
      expect(read(page), `${page} should render the shared card page`).toContain('JobCardPage')
    }
  })

  it('does not keep per-desk next-step card copies in the job surfaces', () => {
    for (const file of [
      'components/workbench/views/BuyerView.vue',
      'components/workbench/views/ManagerView.vue',
      'components/workbench/views/ManagerJobsView.vue',
      'components/workbench/views/PrinterView.vue',
      'components/workbench/tracker/BuyerJobTimeline.vue',
    ]) {
      expect(read(file), `${file} should not import the old NextActionCard`).not.toContain('tracker/NextActionCard.vue')
    }
  })
})
