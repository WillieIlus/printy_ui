import { parseApiError } from '~/utils/api-error'

export interface ApiFeedbackResult {
  message: string
  fieldErrors: Record<string, string>
}

function flattenMessage(value: unknown): string | null {
  if (typeof value === 'string') return value
  if (Array.isArray(value)) {
    const parts = value.map(flattenMessage).filter(Boolean)
    return parts.length ? parts.join(', ') : null
  }
  if (value && typeof value === 'object') {
    const parts = Object.values(value).map(flattenMessage).filter(Boolean)
    return parts.length ? parts.join(', ') : null
  }
  return null
}

export function extractApiFeedback(err: unknown, fallback: string): ApiFeedbackResult {
  const result: ApiFeedbackResult = {
    message: parseApiError(err, fallback),
    fieldErrors: {},
  }

  if (!err || typeof err !== 'object') return result

  const e = err as {
    data?: unknown
    response?: { _data?: unknown }
  }

  const responseData = e.data ?? e.response?._data
  if (!responseData || typeof responseData !== 'object' || Array.isArray(responseData)) {
    return result
  }

  const obj = responseData as Record<string, unknown>

  for (const [key, value] of Object.entries(obj)) {
    if (key === 'detail') continue
    const message = flattenMessage(value)
    if (!message) continue
    if (key === 'non_field_errors') {
      result.message = message
      continue
    }
    result.fieldErrors[key] = message
  }

  if (!result.message && Object.keys(result.fieldErrors).length) {
    result.message = Object.values(result.fieldErrors)[0]
  }

  return result
}
