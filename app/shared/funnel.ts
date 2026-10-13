/**
 * Law 4.7 — funnel instrumentation for the public marketing surface.
 *
 * There is no third-party analytics dependency in this app, so events are
 * pushed onto `window.dataLayer` (the conventional GTM/GA sink), mirrored as a
 * `printy:funnel` DOM CustomEvent for in-house listeners, and optionally POSTed
 * via `navigator.sendBeacon` when `window.__PRINTY_FUNNEL_ENDPOINT__` is set.
 *
 * The module is dependency-free and SSR-safe so it can be imported from the
 * landing page (which is prerendered) and from Pinia stores alike.
 */

export const FUNNEL_EVENTS = {
  CALCULATOR_STARTED: 'calculator_started',
  SPEC_COMPLETED: 'spec_completed',
  GATE_VIEWED: 'gate_viewed',
  SIGNED_UP: 'signed_up',
  QUOTE_SENT: 'quote_sent',
  QUOTE_PAID: 'quote_paid',
} as const

export type FunnelEventName = (typeof FUNNEL_EVENTS)[keyof typeof FUNNEL_EVENTS]

export interface FunnelEvent {
  name: FunnelEventName
  payload: Record<string, unknown>
  at: string
}

/** Pure builder — trivially unit-testable without a DOM. */
export function buildFunnelEvent(
  name: FunnelEventName,
  payload: Record<string, unknown> = {},
): FunnelEvent {
  return { name, payload: { ...payload }, at: new Date().toISOString() }
}

const firedOnce = new Set<string>()

function sink(event: FunnelEvent): FunnelEvent {
  if (typeof window === 'undefined') {
    return event
  }
  const w = window as unknown as {
    dataLayer?: Array<Record<string, unknown>>
    __PRINTY_FUNNEL_ENDPOINT__?: string
  }
  const record = { event: event.name, ...event.payload }
  if (Array.isArray(w.dataLayer)) {
    w.dataLayer.push(record)
  } else {
    w.dataLayer = [record]
  }
  window.dispatchEvent(new CustomEvent('printy:funnel', { detail: event }))
  const endpoint = w.__PRINTY_FUNNEL_ENDPOINT__
  if (endpoint && typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
    try {
      navigator.sendBeacon(endpoint, JSON.stringify(event))
    } catch {
      /* analytics must never break the product */
    }
  }
  return event
}

/** Fire a funnel event every time it is called. */
export function trackFunnel(
  name: FunnelEventName,
  payload: Record<string, unknown> = {},
): FunnelEvent {
  return sink(buildFunnelEvent(name, payload))
}

/**
 * Fire a funnel event at most once per `key` (defaults to the event name) per
 * page load — used for "started"/"viewed" style events that fire from watchers.
 */
export function trackFunnelOnce(
  name: FunnelEventName,
  payload: Record<string, unknown> = {},
  key: string = name,
): FunnelEvent | null {
  if (firedOnce.has(key)) {
    return null
  }
  firedOnce.add(key)
  return trackFunnel(name, payload)
}

/** Test/teardown helper. */
export function resetFunnelEvents(): void {
  firedOnce.clear()
}

export function useFunnel() {
  return {
    events: FUNNEL_EVENTS,
    track: trackFunnel,
    trackOnce: trackFunnelOnce,
    build: buildFunnelEvent,
    reset: resetFunnelEvents,
  }
}
