import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const appDir = resolve(__dirname, '../../app')
const read = (rel: string) => readFileSync(resolve(appDir, rel), 'utf8')

/**
 * The buyer, manager and printer dashboards share one product language. These
 * guards keep the role wrappers delegating to the shared shells and keep every
 * job workflow on the same stage rail.
 */
describe('workspace dashboard consistency', () => {
  it('routes every role page header through the shared workspace header', () => {
    for (const file of ['buyer/BuyerPageHeader.vue', 'manager/ManagerPageHeader.vue', 'printer/PrinterPageHeader.vue']) {
      const source = read(`components/design/${file}`)
      expect(source, `${file} should delegate to the shared header`).toContain(
        "import DesignWorkspacePageHeader from '../ui/WorkspacePageHeader.vue'",
      )
      expect(source, `${file} should keep an actions slot`).toContain('<slot')
    }
  })

  it('routes every role section through the shared workspace section', () => {
    for (const file of ['buyer/BuyerSection.vue', 'manager/ManagerSection.vue', 'printer/PrinterSection.vue']) {
      const source = read(`components/design/${file}`)
      expect(source, `${file} should delegate to the shared section`).toContain(
        "import DesignWorkspaceSection from '../ui/WorkspaceSection.vue'",
      )
      expect(source, `${file} should keep its slots`).toContain('<slot')
    }
  })

  it('renders one workflow rail for buyer, manager and printer job cards', () => {
    for (const file of [
      'components/workbench/tracker/TicketStepper.vue',
      'components/workbench/views/JobCard.vue',
      'components/workbench/views/ManagerView.vue',
    ]) {
      expect(read(file), `${file} should use the shared workflow rail`).toContain('DesignWorkflowRail')
    }
  })

  it('keeps the manager markup as the first top-left dashboard figure', () => {
    const view = read('components/workbench/views/ManagerView.vue')
    expect(view).toContain('Getting started · your markup')
    expect(view).toContain('v-model.number="markupDraft"')
    expect(view).toContain('m.saveDefaultMarkup(value)')
    expect(view.indexOf('Getting started · your markup')).toBeLessThan(view.indexOf('Quotes to prepare'))
  })
})
