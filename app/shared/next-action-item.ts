/** Shared next-action row shape used by the floating card and trackers. */
export type NextActionItem = {
  job_code: string
  owner_role: string
  is_mine: boolean
  next_action: { key: string; label: string; target: string } | null
  due_at: string | null
  waiting_since: string | null
  overdue_level: 'none' | 'warn' | 'late' | string
  headline: string
  explanation: string
  reassurance: string
  waiting_label: string | null
  phase: string
  completed: boolean
}
