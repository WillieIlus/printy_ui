import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const appDir = resolve(__dirname, '../../app')
const read = (rel: string) => readFileSync(resolve(appDir, rel), 'utf8')

describe('floating next-step surfaces', () => {
  it('renders one shared floating next-step card per job surface', () => {
    for (const file of [
      'components/workbench/views/ManagerView.vue',
      'components/workbench/views/ManagerJobsView.vue',
      'components/workbench/views/PrinterView.vue',
    ]) {
      const source = read(file)
      expect((source.match(/<FloatingNextStepCard/g) ?? []).length, `${file} should render exactly one floating card`).toBe(1)
      expect(source).toContain('FloatingNextStepCard')
    }
    expect(read('components/workbench/views/BuyerView.vue')).not.toContain('<FloatingNextStepCard')
  })

  it('links the buyer job detail summary to the shared job card', () => {
    const source = read('components/workbench/tracker/BuyerJobTimeline.vue')
    expect(source).toContain('<FloatingNextStepCard')
    expect(source).toContain('card-target')
    expect(source).toContain('/app/buyer/job-card/')
    for (const page of [
      'pages/app/buyer/job-card/[id].vue',
      'pages/app/manager/job-card/[id].vue',
      'pages/app/printer/job-card/[id].vue',
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
