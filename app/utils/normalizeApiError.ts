export function normalizeApiError(error: unknown, fallback = 'Something went wrong. Please try again.') {
  if (typeof error === 'string') {
    return error.trim() || fallback
  }

  if (!error || typeof error !== 'object') {
    return fallback
  }

  const raw = error as {
    message?: unknown
    data?: Record<string, unknown>
    response?: { _data?: Record<string, unknown> }
    statusMessage?: unknown
  }

  const payload = raw.data ?? raw.response?._data
  if (payload && typeof payload === 'object') {
    const direct = [payload.detail, payload.message, payload.error].find((value) => typeof value === 'string' && value.trim())
    if (typeof direct === 'string') return direct.trim()

    const nestedErrors = payload.errors ?? payload.field_errors ?? payload.fieldErrors
    if (nestedErrors && typeof nestedErrors === 'object') {
      for (const value of Object.values(nestedErrors)) {
        if (typeof value === 'string' && value.trim()) return value.trim()
        if (Array.isArray(value)) {
          const first = value.find((item) => typeof item === 'string' && item.trim())
          if (typeof first === 'string') return first.trim()
        }
      }
    }
  }

  if (typeof raw.message === 'string' && raw.message.trim()) return raw.message.trim()
  if (typeof raw.statusMessage === 'string' && raw.statusMessage.trim()) return raw.statusMessage.trim()
  if (error instanceof Error && error.message.trim()) return error.message.trim()

  return fallback
}
