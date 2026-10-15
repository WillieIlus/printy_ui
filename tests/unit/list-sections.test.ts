import { describe, it, expect } from 'vitest'
import {
  formatMinutes,
  isMuted,
  needsAttention,
  sectionsFromServer,
  timelineSummary,
} from '~/shared/list-sections'
import type { ServerListMeta } from '~/shared/types'

interface Row extends ServerListMeta {
  id: number
}

function row(id: number, meta: ServerListMeta = {}): Row {
  return { id, ...meta }
}

describe('law 7.5 - the backend decides list sections, the frontend only renders them', () => {
  it('groups consecutive rows by the server section and keeps the server order', () => {
    const sections = sectionsFromServer([
      row(1, { section: 'unresponded', section_label: 'Unresponded / sent' }),
      row(2, { section: 'unresponded', section_label: 'Unresponded / sent' }),
      row(3, { section: 'replied', section_label: 'Replied' }),
      row(4, { section: 'done', section_label: 'Done', muted: true }),
    ])
    expect(sections.map((s) => s.key)).toEqual(['unresponded', 'replied', 'done'])
    expect(sections.map((s) => s.items.map((i) => i.id))).toEqual([[1, 2], [3], [4]])
    expect(sections[0]?.label).toBe('Unresponded / sent')
    expect(sections[2]?.muted).toBe(true)
  })

  it('does not re-sort rows the backend already ordered', () => {
    const sections = sectionsFromServer([
      row(9, { section: 'new' }),
      row(3, { section: 'new' }),
      row(7, { section: 'paid' }),
    ])
    expect(sections.flatMap((s) => s.items.map((i) => i.id))).toEqual([9, 3, 7])
  })

  it('falls back to a title-cased label when the backend sends only a key', () => {
    const sections = sectionsFromServer([row(1, { section: 'in_progress' })])
    expect(sections[0]?.label).toBe('In Progress')
  })

  it('exposes the backend attention and muted flags verbatim', () => {
    expect(needsAttention(row(1, { needs_attention: true }))).toBe(true)
    expect(needsAttention(row(1))).toBe(false)
    expect(isMuted(row(1, { muted: true }))).toBe(true)
    expect(isMuted(row(1))).toBe(false)
  })
})

describe('law 7.6 - timeline formatting uses backend numbers only', () => {
  it('formats minutes into compact d/h/m text', () => {
    expect(formatMinutes(null)).toBe('')
    expect(formatMinutes(0)).toBe('0m')
    expect(formatMinutes(45)).toBe('45m')
    expect(formatMinutes(150)).toBe('2h 30m')
    expect(formatMinutes(60 * 26)).toBe('1d 2h')
  })

  it('summarises total taken vs allowed and lateness', () => {
    const summary = timelineSummary({
      due_date: null,
      current_stage: 'printing',
      is_late: true,
      lateness_minutes: 90,
      time_remaining_minutes: -30,
      total_allowed_minutes: 480,
      total_taken_minutes: 600,
      stages: [],
    })
    expect(summary).toBe('10h 0m taken of 8h 0m allowed — running late')
  })

  it('returns nothing when there is no timeline', () => {
    expect(timelineSummary(null)).toBe('')
  })

  it('formats minutes for display in the timeline rows', () => {
    expect(formatMinutes(90)).toBe('1h 30m')
  })
})
