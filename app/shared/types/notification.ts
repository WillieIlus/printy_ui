/**
 * Notification types — matches backend Notification model.
 */

export type NotificationType =
  | 'quote_request_submitted'
  | 'shop_quote_sent'
  | 'shop_quote_revised'
  | 'shop_quote_accepted'
  | 'request_declined'
  | 'quote_request_cancelled'
  | 'job_status_updated'

export interface Notification {
  id: number
  notification_type: NotificationType
  notification_type_display: string
  message: string
  object_type: string
  object_id: number | null
  actor: number | null
  actor_email: string | null
  is_read: boolean
  read_at: string | null
  created_at: string
  target_url: string | null
}
