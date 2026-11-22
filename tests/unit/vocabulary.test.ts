import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ActiveRoleIndicator from '~/components/design/layout/ActiveRoleIndicator.vue'
import {
  ACTIVE_ROLE_EXPLANATION,
  activeRoleLabel,
  ownerExplanation,
  roleLabel,
  stageLabel,
  STAGE_KEYS,
  STAGE_LABELS,
  waitingOnLabel,
} from '~/shared/vocabulary'

const appDir = resolve(__dirname, '../../app')
const read = (rel: string) => readFileSync(resolve(appDir, rel), 'utf8')

describe('one vocabulary', () => {
  it('defines exactly the five canonical stages', () => {
    expect([...STAGE_KEYS]).toEqual(['quote_accepted', 'artwork_approval', 'production', 'qc', 'delivery'])
    expect(Object.values(STAGE_LABELS)).toEqual([
      'Quote accepted',
      'Artwork approval',
      'Production',
      'Quality check',
      'Delivery',
    ])
    expect(stageLabel('printing')).toBe('Production')
    expect(stageLabel('out_for_delivery')).toBe('Delivery')
  })

  it('uses Manager and Printer instead of partner/production', () => {
    expect(roleLabel('partner')).toBe('Manager')
    expect(roleLabel('production')).toBe('Printer')
    expect(roleLabel('client')).toBe('Buyer')
    expect(activeRoleLabel('client')).toBe('Buyer')
    expect(activeRoleLabel('partner')).toBe('Manager')
    expect(activeRoleLabel('production')).toBe('Printer')
  })

  it('explains ownership in plain words and keeps buyer privacy', () => {
    expect(waitingOnLabel('manager', 'buyer')).toBe('Waiting on your manager')
    expect(waitingOnLabel('printer', 'buyer')).toBe('Waiting on your manager')
    expect(ownerExplanation('manager', 'buyer')).toBe('This action belongs to the Manager.')
    expect(ownerExplanation('buyer', 'buyer')).toBe('This action belongs to you.')
  })

  it('routes the shared card, floating card and next-action helper through the module', () => {
    for (const file of [
      'components/design/job/JobCard.vue',
      'components/design/tracker/FloatingNextStepCard.vue',
      'utils/design/next-action.ts',
    ]) {
      expect(read(file), `${file} should import the vocabulary`).toContain('~/shared/vocabulary')
    }
    expect(read('components/design/job/JobCard.vue')).not.toContain('Update job status')
    expect(read('layouts/design-workspace.vue')).toContain('DesignActiveRoleIndicator')
  })

  it('shows a visible active-role indicator with an explanation', async () => {
    const wrapper = await mountSuspended(ActiveRoleIndicator, { props: { role: 'partner' } })
    expect(wrapper.get('[data-test="active-role-indicator"]').text()).toContain('Manager')
    expect(wrapper.get('[data-test="active-role-indicator"]').text()).toContain(ACTIVE_ROLE_EXPLANATION)
  })
})
