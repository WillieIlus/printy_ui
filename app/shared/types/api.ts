// Purpose: Shared paginated response compatibility export.
export type PaginatedResponse<T = Record<string, unknown>> = {
  count?: number
  next?: string | null
  previous?: string | null
  results: T[]
}
