import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DesignButtonLink from '~/components/design/ui/ButtonLink.vue'
import DesignCard from '~/components/design/ui/Card.vue'
import DesignEmptyNote from '~/components/design/ui/EmptyNote.vue'
import DesignLedgerRows from '~/components/design/ui/LedgerRows.vue'
import DesignMonoChip from '~/components/design/ui/MonoChip.vue'
import DesignNavChip from '~/components/design/ui/NavChip.vue'
import DesignSectionLabel from '~/components/design/ui/SectionLabel.vue'
import DesignStat from '~/components/design/ui/Stat.vue'
import DesignStatusPill from '~/components/design/ui/StatusPill.vue'

const designUiDir = resolve(__dirname, '../../app/components/design/ui')

const primitives = [
  'ButtonLink.vue',
  'Card.vue',
  'EmptyNote.vue',
  'LedgerRows.vue',
  'MonoChip.vue',
  'NavChip.vue',
  'SectionLabel.vue',
  'Stat.vue',
  'StatusPill.vue',
]

describe('Design UI primitives (Phase 2)', () => {
  it.each(primitives)('design primitive %s exists', (file) => {
    expect(existsSync(resolve(designUiDir, file)), `${file} should exist`).toBe(true)
  })

  it('ported design primitives use design-local utils/types only', () => {
    for (const file of primitives) {
      const source = readFileSync(resolve(designUiDir, file), 'utf8')
      expect(source, file).not.toMatch(/New_Design/)
      expect(source, file).not.toMatch(/stores|fixtures/)
      expect(source, file).not.toMatch(/\$fetch|useFetch/)
    }
  })

  it('DesignCard renders the requested tone', () => {
    const wrapper = mount(DesignCard, { props: { tone: 'brand' } })
    expect(wrapper.find('div').classes()).toContain('bg-brand-deep')
  })

  it('DesignEmptyNote renders title and hint', () => {
    const wrapper = mount(DesignEmptyNote, { props: { title: 'No open quotes', hint: 'Create one' } })
    expect(wrapper.text()).toContain('No open quotes')
    expect(wrapper.text()).toContain('Create one')
  })

  it('DesignStat renders label value and hint', () => {
    const wrapper = mount(DesignStat, { props: { label: 'Open', value: '3', hint: 'needs action' } })
    expect(wrapper.text()).toContain('Open')
    expect(wrapper.text()).toContain('3')
    expect(wrapper.text()).toContain('needs action')
  })

  it('DesignLedgerRows renders rows', () => {
    const wrapper = mount(DesignLedgerRows, { props: { rows: [{ label: 'Fee', value: 'KSh 100' }] } })
    expect(wrapper.text()).toContain('Fee')
    expect(wrapper.text()).toContain('KSh 100')
  })

  it('DesignMonoChip renders slot content', () => {
    const wrapper = mount(DesignMonoChip, { slots: { default: 'OK' } })
    expect(wrapper.text()).toContain('OK')
  })

  it('DesignNavChip mounts quiet and loud variants', () => {
    expect(mount(DesignNavChip).exists()).toBe(true)
    expect(mount(DesignNavChip, { props: { quiet: true } }).exists()).toBe(true)
  })

  it('DesignSectionLabel renders index and label', () => {
    const wrapper = mount(DesignSectionLabel, { props: { index: '01', tone: 'brand' } })
    expect(wrapper.text()).toContain('01')
  })

  it('DesignButtonLink renders a span fallback without href', () => {
    const wrapper = mount(DesignButtonLink)
    expect(wrapper.find('span').exists()).toBe(true)
  })

  it('DesignStatusPill renders the ontrack tone', () => {
    const wrapper = mount(DesignStatusPill, { props: { tone: 'ontrack' } })
    expect(wrapper.find('span').classes()).toContain('bg-ontrack-soft')
  })
})

describe('Design Phase 2 helpers and types', () => {
  it('design cx helper merges parts', async () => {
    const { cx } = await import('../../app/utils/design/cx')
    expect(cx('a', false, 'c')).toBe('a c')
    expect(cx()).toBe('')
  })

  it('design icon registry resolves known icons', async () => {
    const { getIcon, iconNames } = await import('../../app/utils/design/icon-registry')
    expect(iconNames.length).toBeGreaterThan(0)
    const icon = getIcon('Gauge')
    expect(icon).toBeTruthy()
  })

  it('design status tone and ledger row types exist', () => {
    expect(existsSync(resolve(__dirname, '../../app/types/design/status-tone.ts'))).toBe(true)
    expect(existsSync(resolve(__dirname, '../../app/types/design/ledger-row.ts'))).toBe(true)
  })
})
