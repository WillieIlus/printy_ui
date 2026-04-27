import { parseApiError } from '~/utils/api-error'

export interface ApiFeedbackResult {
  message: string
  fieldErrors: Record<string, string>
}

function flattenFieldErrors(
  value: unknown,
  prefix = '',
  target: Record<string, string> = {},
): Record<string, string> {
  if (typeof value === 'string') {
    if (prefix) target[prefix] = value
    return target
  }

  if (Array.isArray(value)) {
    const stringParts = value.filter((item): item is string => typeof item === 'string')
    if (stringParts.length && prefix) {
      target[prefix] = stringParts.join(', ')
      return target
    }

    value.forEach((item, index) => {
      if (item && typeof item === 'object') {
        flattenFieldErrors(item, prefix ? `${prefix}.${index}` : String(index), target)
      }
    })
    return target
  }

  if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      const nextPrefix = prefix ? `${prefix}.${key}` : key
      flattenFieldErrors(nested, nextPrefix, target)
    }
  }

  return target
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
  const fieldErrorsSource = (
    obj.field_errors && typeof obj.field_errors === 'object' && !Array.isArray(obj.field_errors)
      ? obj.field_errors
      : null
  ) as Record<string, unknown> | null

  if (fieldErrorsSource) {
    result.fieldErrors = flattenFieldErrors(fieldErrorsSource)
  }

  for (const [key, value] of Object.entries(obj)) {
    if (key === 'detail' || key === 'field_errors' || key === 'code' || key === 'reason' || key === 'suggestions' || key === 'message') continue
    const message = flattenMessage(value)
    if (!message) continue
    if (key === 'non_field_errors') {
      result.message = message
      continue
    }
    if (!result.fieldErrors[key]) {
      result.fieldErrors[key] = message
    }
  }

  if (!result.message && Object.keys(result.fieldErrors).length) {
    result.message = Object.values(result.fieldErrors)[0] ?? fallback
  }

  return result
}
