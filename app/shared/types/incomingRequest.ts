// Purpose: Incoming request shared typings.
export type IncomingRequestDetail = {
  id?: number
  status?: string | null
  note?: string | null
} & Record<string, unknown>

export type IncomingRequestList = IncomingRequestDetail
