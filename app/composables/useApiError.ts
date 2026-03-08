/**
 * Normalize API errors for modal and form display.
 * Backend returns: { code, message, reason, field_errors, suggestions }
 * Maps to: { title, message, code, fieldErrors, reason, retryable }
 */
export interface NormalizedApiError {
  title: string
  message: string
  code: string
  fieldErrors: Record<string, string[]>
  reason: string
  retryable: boolean
}

export function useApiError() {
  function normalize(err: unknown, fallbackTitle = 'Error'): NormalizedApiError {
    const defaultError: NormalizedApiError = {
      title: fallbackTitle,
      message: 'Something went wrong. Please try again.',
      code: 'UNKNOWN',
      fieldErrors: {},
      reason: '',
      retryable: true,
    }

    if (!err || typeof err !== 'object') {
      return defaultError
    }

    const e = err as {
      data?: unknown
      response?: { _data?: unknown }
      statusCode?: number
      status?: number
    }

    const responseData = e.data ?? e.response?._data
    const status = e.statusCode ?? e.status ?? 500

    if (typeof responseData === 'object' && responseData !== null) {
      const obj = responseData as Record<string, unknown>
      const code = (obj.code as string) || _statusToCode(status)
      const message = (obj.message as string) || defaultError.message
      const reason = (obj.reason as string) || ''
      const fieldErrors: Record<string, string[]> = {}
      const rawFieldErrors = obj.field_errors ?? obj.fieldErrors
      if (rawFieldErrors && typeof rawFieldErrors === 'object') {
        for (const [k, v] of Object.entries(rawFieldErrors)) {
          fieldErrors[k] = Array.isArray(v) ? (v as string[]) : [String(v)]
        }
      }
      const retryable = status >= 500 || status === 408 || code === 'NETWORK_ERROR'

      return {
        title: _codeToTitle(code),
        message,
        code,
        fieldErrors,
        reason: reason || _reasonForCode(code),
        retryable,
      }
    }

    if (err instanceof Error) {
      return {
        ...defaultError,
        message: err.message,
        code: 'NETWORK_ERROR',
        retryable: true,
      }
    }

    return {
      ...defaultError,
      code: _statusToCode(status),
      retryable: status >= 500,
    }
  }

  return { normalize }
}

function _statusToCode(status: number): string {
  const map: Record<number, string> = {
    400: 'BAD_REQUEST',
    401: 'UNAUTHORIZED',
    403: 'FORBIDDEN',
    404: 'NOT_FOUND',
    408: 'TIMEOUT',
    409: 'CONFLICT',
    500: 'SERVER_ERROR',
  }
  return map[status] || 'ERROR'
}

function _codeToTitle(code: string): string {
  const map: Record<string, string> = {
    VALIDATION_ERROR: 'Please fix the errors below',
    BAD_REQUEST: 'Invalid request',
    UNAUTHORIZED: 'Sign in required',
    FORBIDDEN: 'Permission denied',
    NOT_FOUND: 'Not found',
    CONFLICT: 'Conflict',
    SERVER_ERROR: 'Server error',
    NETWORK_ERROR: 'Connection error',
  }
  return map[code] || 'Error'
}

function _reasonForCode(code: string): string {
  const map: Record<string, string> = {
    UNAUTHORIZED: 'Please sign in to save this quote.',
    FORBIDDEN: "You don't have permission for this action.",
    NOT_FOUND: 'The requested resource was not found.',
    SERVER_ERROR: 'Something went wrong. Please try again.',
    NETWORK_ERROR: 'Could not reach the server. Check your connection.',
  }
  return map[code] || ''
}
