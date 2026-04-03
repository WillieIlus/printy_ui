import { J as extractApiFeedback, p as parseApiError } from './server.mjs';
import { u as useNotification } from './useNotification-DxMfmZhF.mjs';
import { ref } from 'vue';

function normalizeMessage(message, fallback) {
  if (typeof message === "string") {
    const trimmed = message.trim();
    return trimmed || fallback;
  }
  return parseApiError(message, fallback);
}
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
    const normalizedMessage = normalizeMessage(message, "Something went wrong.");
    errorMessage.value = normalizedMessage;
    successMessage.value = null;
    fieldErrors.value = errors;
    if (toast) notification.error(normalizedMessage, title);
  }
  function setSuccess(message, title = "Success", toast = true) {
    const normalizedMessage = normalizeMessage(message, "Success");
    successMessage.value = normalizedMessage;
    errorMessage.value = null;
    fieldErrors.value = {};
    if (toast) notification.success(normalizedMessage, title);
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
//# sourceMappingURL=useSubmissionFeedback-B916DqgM.mjs.map
