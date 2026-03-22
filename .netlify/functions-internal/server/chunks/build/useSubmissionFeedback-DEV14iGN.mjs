import { x as extractApiFeedback } from './server.mjs';
import { u as useNotification } from './useNotification-DukejKDK.mjs';
import { ref } from 'vue';

function useSubmissionFeedback() {
  const notification = useNotification();
  const submitting = ref(false);
  const errorMessage = ref(null);
  const successMessage = ref(null);
  const fieldErrors = ref({});
  function reset() {
    errorMessage.value = null;
    successMessage.value = null;
    fieldErrors.value = {};
  }
  function start() {
    submitting.value = true;
    errorMessage.value = null;
    successMessage.value = null;
    fieldErrors.value = {};
  }
  function finish() {
    submitting.value = false;
  }
  function setError(message, title = "Error", toast = true, errors = {}) {
    errorMessage.value = message;
    successMessage.value = null;
    fieldErrors.value = errors;
    if (toast) notification.error(message, title);
  }
  function setSuccess(message, title = "Success", toast = true) {
    successMessage.value = message;
    errorMessage.value = null;
    fieldErrors.value = {};
    if (toast) notification.success(message, title);
  }
  function applyApiError(err, fallback, title = "Error", toast = true) {
    const parsed = extractApiFeedback(err, fallback);
    setError(parsed.message, title, toast, parsed.fieldErrors);
    return parsed;
  }
  function clearFieldError(field) {
    if (!(field in fieldErrors.value)) return;
    fieldErrors.value = Object.fromEntries(
      Object.entries(fieldErrors.value).filter(([key]) => key !== field)
    );
  }
  function errorFor(field) {
    return fieldErrors.value[field] ?? null;
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
    errorFor
  };
}

export { useSubmissionFeedback as u };
//# sourceMappingURL=useSubmissionFeedback-DEV14iGN.mjs.map
