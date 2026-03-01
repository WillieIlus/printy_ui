/**
 * Extract user-friendly error message from API responses (Django REST, ofetch, etc.).
 * Handles: { detail: string }, { field: ["msg"] }, plain string, and standard Error.
 * ofetch errors may have: data, response._data, statusCode.
 */
export function parseApiError(err: unknown, fallback: string): string {
  if (err && typeof err === 'object') {
    const e = err as {
      data?: unknown
      response?: { _data?: unknown }
      statusCode?: number
      status?: number
    }
    // ofetch: err.data or err.response._data
    const responseData = e.data ?? e.response?._data

    if (typeof responseData === 'object' && responseData !== null) {
      const obj = responseData as Record<string, unknown>
      if (typeof obj.detail === 'string') return obj.detail
      if (Array.isArray(obj.detail)) return (obj.detail as string[]).join('; ')
      const fieldErrors = Object.entries(obj)
        .filter(([, v]) => Array.isArray(v) || typeof v === 'string')
        .map(([k, v]) => `${k}: ${Array.isArray(v) ? (v as string[]).join(', ') : v}`)
        .join('; ')
      if (fieldErrors) return fieldErrors
    }

    if (typeof responseData === 'string') return responseData

    // Fallback for known HTTP status when no body
    const status = e.statusCode ?? e.status
    if (status === 403) return 'You do not have permission to perform this action.'
    if (status === 404) return 'The requested resource was not found.'
    if (status === 500) return 'Server error. Please try again later.'
  }

  if (err instanceof Error) return err.message

  return fallback
}
