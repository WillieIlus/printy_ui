import { extractApiFeedback } from '~/utils/api-feedback'
import { parseApiError } from '~/utils/api-error'

function normalizeMessage(message: unknown, fallback: string) {
  if (typeof message === 'string') {
    const trimmed = message.trim()
    return trimmed || fallback
  }

  return parseApiError(message, fallback)
}

export function useSubmissionFeedback() {
  const notification = useNotification()
  const submitting = ref(false)
  const errorMessage = ref<string | null>(null)
  const successMessage = ref<string | null>(null)
  const fieldErrors = ref<Record<string, string>>({})

  function reset() {
    errorMessage.value = null
    successMessage.value = null
    fieldErrors.value = {}
  }

  function start() {
    submitting.value = true
    errorMessage.value = null
    successMessage.value = null
    fieldErrors.value = {}
  }

  function finish() {
    submitting.value = false
  }

  function setError(message: unknown, title = 'Error', toast = true, errors: Record<string, string> = {}) {
    const normalizedMessage = normalizeMessage(message, 'Something went wrong.')
    errorMessage.value = normalizedMessage
    successMessage.value = null
    fieldErrors.value = errors
    if (toast) notification.error(normalizedMessage, title)
  }

  function setSuccess(message: unknown, title = 'Success', toast = true) {
    const normalizedMessage = normalizeMessage(message, 'Success')
    successMessage.value = normalizedMessage
    errorMessage.value = null
    fieldErrors.value = {}
    if (toast) notification.success(normalizedMessage, title)
  }

  function applyApiError(err: unknown, fallback: string, title = 'Error', toast = true) {
    const parsed = extractApiFeedback(err, fallback)
    setError(parsed.message, title, toast, parsed.fieldErrors)
    return parsed
  }

  function clearFieldError(field: string) {
    if (!(field in fieldErrors.value)) return
    fieldErrors.value = Object.fromEntries(
      Object.entries(fieldErrors.value).filter(([key]) => key !== field)
    )
  }

  function errorFor(field: string) {
    return fieldErrors.value[field] ?? null
  }

  return {
    submitting,
    errorMessage,
    successMessage,
    fieldErrors,
    reset,
    start,
    finish,
    setError,
    setSuccess,
    applyApiError,
    clearFieldError,
    errorFor,
  }
}
