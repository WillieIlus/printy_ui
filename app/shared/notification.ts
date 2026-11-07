import type { PrintyNotification } from '~/shared/types'

/**
 * Human, relative timestamp for notification rows ("just now", "12m ago",
 * "yesterday", "4d ago"), matching the "what happened + when" reading order.
 */
export function relativeTime(iso: string, now: number = Date.now()): string {
  if (!iso) {
    return 'just now'
  }
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) {
    return 'just now'
  }
  const seconds = Math.max(0, Math.floor((now - then) / 1000))
  if (seconds < 60) {
    return 'just now'
  }
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) {
    return `${minutes}m ago`
  }
  const hours = Math.floor(minutes / 60)
  if (hours < 24) {
    return `${hours}h ago`
  }
  const days = Math.floor(hours / 24)
  if (days === 1) {
    return 'yesterday'
  }
  if (days < 7) {
    return `${days}d ago`
  }
  const weeks = Math.floor(days / 7)
  if (weeks < 5) {
    return `${weeks}w ago`
  }
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export interface NotificationGroup {
  key: string
  label: string
  entity: PrintyNotification['entity']
  items: PrintyNotification[]
}

const ENTITY_LABELS: Record<string, string> = {
  quote_request: 'Quote request',
  quote: 'Quote',
  managed_job: 'Job',
  job_assignment: 'Job',
  production_order: 'Production',
}

/**
 * Group a job/quote's notifications so the list reads as its timeline
 * (quote sent → quote ready → payment due). Unscoped events are grouped under a
 * trailing "Other activity" bucket.
 */
export function groupByEntity(notifications: PrintyNotification[]): NotificationGroup[] {
  const groups = new Map<string, NotificationGroup>()
  for (const item of notifications) {
    const entity = item.entity
    const key = entity ? `${entity.type}:${entity.id}` : 'other'
    let group = groups.get(key)
    if (!group) {
      const typeLabel = entity ? ENTITY_LABELS[entity.type] || 'Item' : 'Other activity'
      group = {
        key,
        label: entity ? `${typeLabel} #${entity.id}` : 'Other activity',
        entity: entity ?? null,
        items: [],
      }
      groups.set(key, group)
    }
    group.items.push(item)
  }
  return [...groups.values()]
}

export function isActionRequired(item: PrintyNotification): boolean {
  return item.priority === 'action_required'
}

/** Action-required items first (unread before read), then newest-first. */
export function pinActionRequired(notifications: PrintyNotification[]): PrintyNotification[] {
  const rank = (item: PrintyNotification) => {
    if (isActionRequired(item) && !item.is_read) return 0
    if (isActionRequired(item)) return 1
    if (!item.is_read) return 2
    return 3
  }
  return [...notifications].sort((a, b) => {
    const diff = rank(a) - rank(b)
    if (diff !== 0) return diff
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })
}
