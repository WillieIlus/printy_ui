// Purpose: Job request shared typings.
export type JobRequest = {
  id?: number
  status?: string | null
  title?: string | null
} & Record<string, unknown>

export type JobClaim = {
  id?: number
  status?: string | null
} & Record<string, unknown>

export type JobRequestCreatePayload = {
  title?: string
  description?: string
} & Record<string, unknown>

export type JobWhatsappShareResponse = {
  message?: string
  whatsapp_url?: string
} & Record<string, unknown>

export type PublicJob = {
  token?: string
  title?: string | null
  status?: string | null
} & Record<string, unknown>
