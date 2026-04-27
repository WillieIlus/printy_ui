// Purpose: Notification shared typings.
export type Notification = {
  id?: number
  title?: string | null
  description?: string | null
  read?: boolean
  created_at?: string | null
} & Record<string, unknown>
