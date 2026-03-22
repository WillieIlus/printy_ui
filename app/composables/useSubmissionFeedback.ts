import { extractApiFeedback } from '~/utils/api-feedback'

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

  function setError(message: string, title = 'Error', toast = true, errors: Record<string, string> = {}) {
    errorMessage.value = message
    successMessage.value = null
    fieldErrors.value = errors
    if (toast) notification.error(message, title)
  }

  function setSuccess(message: string, title = 'Success', toast = true) {
    successMessage.value = message
    errorMessage.value = null
    fieldErrors.value = {}
    if (toast) notification.success(message, title)
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
