// Purpose: Sent quote shared typings.
export type SentQuoteDetail = {
  id?: number
  status?: string | null
  total?: string | number | null
} & Record<string, unknown>

export type SentQuoteList = SentQuoteDetail
