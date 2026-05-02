import { API } from '~/shared/api-paths'

export interface QuoteMessageRecord {
  id: number
  subject: string
  body: string
  snippet: string
  message_type: string
  direction: 'inbound' | 'outbound'
  quote_request_id: number
  quote_response_id: number | null
  shop_name: string
  client_name: string
  read_at: string | null
  created_at: string
  sent_at: string | null
  email_status: string
  has_attachment: boolean
  attachments_summary: Array<{ id: number, name: string }>
  action_url: string
}

export const useQuoteMessagesStore = defineStore('quoteMessages', () => {
  const clientInbox = ref<QuoteMessageRecord[]>([])
  const clientOutbox = ref<QuoteMessageRecord[]>([])
  const clientUnreadCount = ref(0)
  const shopInbox = ref<QuoteMessageRecord[]>([])
  const shopOutbox = ref<QuoteMessageRecord[]>([])
  const shopUnreadCount = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchShopMessages() {
    loading.value = true
    error.value = null
    try {
      const { $api } = useNuxtApp()
      const [inbox, outbox, unread] = await Promise.all([
        $api<QuoteMessageRecord[]>(API.shopMessages()),
        $api<QuoteMessageRecord[]>(API.shopMessagesOutbox()),
        $api<{ unread_count: number }>(API.shopMessagesUnreadCount()),
      ])
      shopInbox.value = inbox
      shopOutbox.value = outbox
      shopUnreadCount.value = unread.unread_count ?? 0
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load shop messages.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchClientMessages() {
    loading.value = true
    error.value = null
    try {
      const { $api } = useNuxtApp()
      const [inbox, outbox, unread] = await Promise.all([
        $api<QuoteMessageRecord[]>(API.clientMessages()),
        $api<QuoteMessageRecord[]>(API.clientMessagesOutbox()),
        $api<{ unread_count: number }>(API.clientMessagesUnreadCount()),
      ])
      clientInbox.value = inbox
      clientOutbox.value = outbox
      clientUnreadCount.value = unread.unread_count ?? 0
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load client messages.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function markShopMessageRead(id: number) {
    const { $api } = useNuxtApp()
    const updated = await $api<QuoteMessageRecord>(API.shopMessageRead(id), {
      method: 'POST',
      body: {},
    })
    shopInbox.value = shopInbox.value.map(message => message.id === id ? updated : message)
    shopUnreadCount.value = Math.max(0, shopUnreadCount.value - 1)
    return updated
  }

  async function markClientMessageRead(id: number) {
    const { $api } = useNuxtApp()
    const updated = await $api<QuoteMessageRecord>(API.clientMessageRead(id), {
      method: 'POST',
      body: {},
    })
    clientInbox.value = clientInbox.value.map(message => message.id === id ? updated : message)
    clientUnreadCount.value = Math.max(0, clientUnreadCount.value - 1)
    return updated
  }

  async function markAllShopMessagesRead() {
    const { $api } = useNuxtApp()
    await $api<{ marked_read: number }>(API.shopMessagesMarkAllRead(), {
      method: 'POST',
      body: {},
    })
    const now = new Date().toISOString()
    shopInbox.value = shopInbox.value.map(message => ({ ...message, read_at: message.read_at || now }))
    shopUnreadCount.value = 0
  }

  async function markAllClientMessagesRead() {
    const { $api } = useNuxtApp()
    await $api<{ marked_read: number }>(API.clientMessagesMarkAllRead(), {
      method: 'POST',
      body: {},
    })
    const now = new Date().toISOString()
    clientInbox.value = clientInbox.value.map(message => ({ ...message, read_at: message.read_at || now }))
    clientUnreadCount.value = 0
  }

  return {
    clientInbox,
    clientOutbox,
    clientUnreadCount,
    shopInbox,
    shopOutbox,
    shopUnreadCount,
    loading,
    error,
    fetchClientMessages,
    fetchShopMessages,
    markClientMessageRead,
    markShopMessageRead,
    markAllClientMessagesRead,
    markAllShopMessagesRead,
  }
})
