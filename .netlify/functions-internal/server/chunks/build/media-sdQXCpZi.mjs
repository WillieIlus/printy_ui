import { h as useRuntimeConfig } from './server.mjs';

function getMediaUrl(path, baseUrl = "") {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const normalizedBase = baseUrl.replace(/\/$/, "");
  return `${normalizedBase}${path.startsWith("/") ? path : `/${path}`}`;
}
function useMediaUrl() {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiBaseUrl?.replace(/\/$/, "") || "";
  return (path) => getMediaUrl(path, baseUrl);
}

export { useMediaUrl as u };
//# sourceMappingURL=media-sdQXCpZi.mjs.map
