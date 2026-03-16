function parseApiError(err, fallback) {
  if (err && typeof err === "object") {
    const e = err;
    const responseData = e.data ?? e.response?._data;
    if (typeof responseData === "object" && responseData !== null) {
      const obj = responseData;
      if (typeof obj.detail === "string") return obj.detail;
      if (Array.isArray(obj.detail)) return obj.detail.join("; ");
      const fieldErrors = Object.entries(obj).filter(([, v]) => Array.isArray(v) || typeof v === "string").map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`).join("; ");
      if (fieldErrors) return fieldErrors;
    }
    if (typeof responseData === "string") return responseData;
    const status = e.statusCode ?? e.status;
    if (status === 403) return "You do not have permission to perform this action.";
    if (status === 404) return "The requested resource was not found.";
    if (status === 500) return "Server error. Please try again later.";
  }
  if (err instanceof Error) return err.message;
  return fallback;
}

export { parseApiError as p };
//# sourceMappingURL=api-error-D1IYk86E.mjs.map
