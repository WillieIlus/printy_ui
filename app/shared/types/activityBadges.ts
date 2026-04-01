export interface ShopActivityBadges {
  incoming_requests: number
  messages_replies: number
  pending_quote_actions: number
}

export interface ClientActivityBadges {
  new_quotes: number
  shop_replies: number
  request_updates: number
}

export interface ActivityBadgeSummary {
  shop: ShopActivityBadges
  client: ClientActivityBadges
  notifications: {
    unread_total: number
  }
}
