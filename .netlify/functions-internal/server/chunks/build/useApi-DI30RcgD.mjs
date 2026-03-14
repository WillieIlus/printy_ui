import { s as useNuxtApp, o as useRuntimeConfig } from './server.mjs';

function useApi() {
  const config = useRuntimeConfig();
  async function get(url, params) {
    const { $api } = useNuxtApp();
    return $api(url, { params });
  }
  async function post(url, body) {
    const { $api } = useNuxtApp();
    return $api(url, { method: "POST", body });
  }
  async function put(url, body) {
    const { $api } = useNuxtApp();
    return $api(url, { method: "PUT", body });
  }
  async function patch(url, body) {
    const { $api } = useNuxtApp();
    return $api(url, { method: "PATCH", body });
  }
  async function del(url) {
    const { $api } = useNuxtApp();
    return $api(url, { method: "DELETE" });
  }
  function getMediaUrl(path) {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${config.public.mediaBase}/${path}`;
  }
  return {
    get,
    post,
    put,
    patch,
    del,
    getMediaUrl
  };
}

export { useApi as u };
//# sourceMappingURL=useApi-DI30RcgD.mjs.map
