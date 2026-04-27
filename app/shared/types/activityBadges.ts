// Purpose: Activity badge summary typings used by notification and workspace stores.
export type ActivityBadgeSummary = {
  shop: {
    incoming_requests: number
    messages_replies: number
    pending_quote_actions: number
  }
  client: {
    new_quotes: number
    shop_replies: number
    request_updates: number
  }
  notifications: {
    unread_total: number
  }
}
