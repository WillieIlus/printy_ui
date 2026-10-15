import type { JobStageTimeline, ServerListMeta } from '~/shared/types'

/**
 * Law Part 5 (7.5). The backend decides every list's section, section label,
 * needs_attention and muted flags and the order of the rows. The frontend may
 * only render those decisions: it groups consecutive rows that share the
 * server-given section, keeps the server order, and never sorts, dates or
 * recomputes anything here.
 */

export interface ListSection<T> {
  key: string
  label: string
  muted: boolean
  items: T[]
}

function titleize(key: string): string {
  return key
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

/**
 * Group rows into sections using only the server-provided `section` and
 * `section_label`. Order is preserved exactly as received; a new section is
 * only started when the section key changes, so a well-ordered backend payload
 * yields clean consecutive groups.
 */
export function sectionsFromServer<T extends ServerListMeta>(items: T[]): ListSection<T>[] {
  const sections: ListSection<T>[] = []
  for (const item of items) {
    const key = item.section || 'other'
    const label = item.section_label || titleize(key)
    const last = sections[sections.length - 1]
    if (last && last.key === key) {
      last.items.push(item)
    } else {
      sections.push({ key, label, muted: Boolean(item.muted), items: [item] })
    }
  }
  return sections
}

/** Rows the server marked as needing the current viewer's attention. */
export function needsAttention<T extends ServerListMeta>(item: T): boolean {
  return Boolean(item.needs_attention)
}

/** Rows the server muted (e.g. done/closed) and that must render greyed out. */
export function isMuted<T extends ServerListMeta>(item: T): boolean {
  return Boolean(item.muted)
}

export function formatMinutes(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return ''
  }
  const minutes = Math.max(0, Math.round(value))
  const days = Math.floor(minutes / (60 * 24))
  const hours = Math.floor((minutes % (60 * 24)) / 60)
  const mins = minutes % 60
  if (days > 0) {
    return `${days}d ${hours}h`
  }
  if (hours > 0) {
    return `${hours}h ${mins}m`
  }
  return `${mins}m`
}

/**
 * A single human sentence describing the whole stage timeline (law 7.6): how
 * long the job has taken versus how long it was allowed, and whether it is
 * running late. The numbers come straight from the backend timeline.
 */
export function timelineSummary(timeline: JobStageTimeline | null | undefined): string {
  if (!timeline) {
    return ''
  }
  const taken = formatMinutes(timeline.total_taken_minutes)
  const allowed = formatMinutes(timeline.total_allowed_minutes)
  if (!taken && !allowed) {
    return ''
  }
  const late = timeline.is_late ? 'running late' : 'on schedule'
  return `${taken} taken of ${allowed} allowed — ${late}`
}
