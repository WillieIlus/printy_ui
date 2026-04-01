import { E as useNuxtApp, A as API, h as useApi } from './server.mjs';
import { ref, reactive, computed, onScopeDispose } from 'vue';

function resolveApiClient(client) {
  return client ?? useApi();
}
async function fetchAnalyticsSummary(params, client, signal) {
  const api = resolveApiClient(client);
  return await api(API.adminAnalyticsSummary(), { params, signal });
}
async function fetchAnalyticsTimeSeries(params, client, signal) {
  const api = resolveApiClient(client);
  return await api(API.adminAnalyticsTimeSeries(), { params, signal });
}
async function fetchAnalyticsTopMetrics(params, client, signal) {
  const api = resolveApiClient(client);
  return await api(API.adminAnalyticsTopMetrics(), { params, signal });
}
async function fetchAnalyticsFunnel(params, client, signal) {
  const api = resolveApiClient(client);
  return await api(API.adminAnalyticsFunnel(), { params, signal });
}
async function fetchAnalyticsLocations(params, client, signal) {
  const api = resolveApiClient(client);
  return await api(API.adminAnalyticsLocations(), { params, signal });
}
async function fetchAnalyticsErrors(params, client, signal) {
  const api = resolveApiClient(client);
  return await api(API.adminAnalyticsErrors(), { params, signal });
}
async function trackAnalyticsEvent(payload, client, signal) {
  const api = resolveApiClient(client);
  return await api(API.analyticsEvents(), {
    method: "POST",
    body: payload,
    signal
  });
}
function useSuperAdminAnalytics() {
  const { $api } = useNuxtApp();
  const apiClient = $api;
  const summary = ref(null);
  const timeSeries = ref(null);
  const topMetrics = ref(null);
  const funnel = ref(null);
  const locationBreakdown = ref(null);
  const errorAnalytics = ref(null);
  const loading = reactive({
    summary: false,
    timeSeries: false,
    topMetrics: false,
    funnel: false,
    locationBreakdown: false,
    errorAnalytics: false,
    trackEvent: false
  });
  const errors = reactive({
    summary: null,
    timeSeries: null,
    topMetrics: null,
    funnel: null,
    locationBreakdown: null,
    errorAnalytics: null,
    trackEvent: null
  });
  const controllers = /* @__PURE__ */ new Map();
  const isLoading = computed(() => Object.values(loading).some(Boolean));
  const firstError = computed(() => Object.values(errors).find(Boolean) ?? null);
  function abort(key) {
    const controller = controllers.get(key);
    if (controller) {
      controller.abort();
      controllers.delete(key);
    }
  }
  function abortAll() {
    for (const key of controllers.keys()) {
      abort(key);
    }
  }
  async function runRequest(key, execute, options) {
    {
      abort(key);
    }
    const controller = new AbortController();
    controllers.set(key, controller);
    loading[key] = true;
    errors[key] = null;
    try {
      return await execute(controller.signal);
    } catch (err) {
      if (controller.signal.aborted) {
        return null;
      }
      errors[key] = err instanceof Error ? err.message : "Request failed.";
      return null;
    } finally {
      if (controllers.get(key) === controller) {
        controllers.delete(key);
      }
      loading[key] = false;
    }
  }
  async function getSummary(params) {
    const data = await runRequest("summary", async (signal) => fetchAnalyticsSummary(params, apiClient, signal));
    if (data) {
      summary.value = data;
    }
    return data;
  }
  async function getTimeSeries(params) {
    const data = await runRequest("timeSeries", async (signal) => fetchAnalyticsTimeSeries(params, apiClient, signal));
    if (data) {
      timeSeries.value = data;
    }
    return data;
  }
  async function getTopMetrics(params) {
    const data = await runRequest("topMetrics", async (signal) => fetchAnalyticsTopMetrics(params, apiClient, signal));
    if (data) {
      topMetrics.value = data;
    }
    return data;
  }
  async function getFunnel(params) {
    const data = await runRequest("funnel", async (signal) => fetchAnalyticsFunnel(params, apiClient, signal));
    if (data) {
      funnel.value = data;
    }
    return data;
  }
  async function getLocationBreakdown(params) {
    const data = await runRequest("locationBreakdown", async (signal) => fetchAnalyticsLocations(params, apiClient, signal));
    if (data) {
      locationBreakdown.value = data;
    }
    return data;
  }
  async function getErrorAnalytics(params) {
    const data = await runRequest("errorAnalytics", async (signal) => fetchAnalyticsErrors(params, apiClient, signal));
    if (data) {
      errorAnalytics.value = data;
    }
    return data;
  }
  async function trackEvent(payload) {
    return await runRequest("trackEvent", async (signal) => trackAnalyticsEvent(payload, apiClient, signal));
  }
  onScopeDispose(() => {
    abortAll();
  });
  return {
    summary,
    timeSeries,
    topMetrics,
    funnel,
    locationBreakdown,
    errorAnalytics,
    loading,
    errors,
    isLoading,
    error: firstError,
    getSummary,
    getTimeSeries,
    getTopMetrics,
    getFunnel,
    getLocationBreakdown,
    getErrorAnalytics,
    trackEvent,
    abort,
    abortAll
  };
}

export { useSuperAdminAnalytics as u };
//# sourceMappingURL=useSuperAdminAnalytics-HnPTIU3l.mjs.map
