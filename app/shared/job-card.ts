/** Types for the one role-aware job card envelope (law 23-24). */
import type { ViewerRole } from './vocabulary'

export interface JobCardStage {
  key: string
  label: string
}

export interface JobCardOwner {
  role: string
  label: string
}

export interface JobCardNextAction {
  code: string
  label: string
  actor: string
  params?: Record<string, unknown>
}

export interface JobCardThreadItem {
  id: string
  type: string
  at: string | null
  actor: { role: string; name: string }
  title: string
  body?: string
  stage?: string | null
  metadata?: Record<string, unknown>
}

export interface JobCardSecondaryAction {
  code: string
  label: string
}

export interface JobCardParty {
  id: number
  name: string
}

export interface JobCardJob {
  id: number
  code: string
  title: string
  stage: JobCardStage
  owner: JobCardOwner
  next_action: JobCardNextAction
  due?: Record<string, unknown>
  thread: JobCardThreadItem[]
  secondary_actions: JobCardSecondaryAction[]
  intake_path?: string
  manager?: JobCardParty
  client?: JobCardParty
  shop?: JobCardParty
  internal_status?: string
  internal_status_label?: string
}

export interface JobCardEnvelope {
  id: string
  viewer: { role: ViewerRole }
  jobs: JobCardJob[]
}

export interface JobCardPerformResponse {
  applied: boolean
  code: string
  idempotent?: boolean
  card: JobCardEnvelope
}
