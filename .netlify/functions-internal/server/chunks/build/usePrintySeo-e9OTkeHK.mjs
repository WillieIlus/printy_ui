import { f as useRoute, m as useHead, e as useRuntimeConfig } from './server.mjs';
import { computed } from 'vue';

const DEFAULT_TITLE = "Printy - Instant Printing Quotes";
const DEFAULT_DESCRIPTION = "Get instant printing quotes for business cards, flyers, posters, and more. Browse templates, compare prices, and request quotes from trusted print shops in Kenya.";
function buildSiteUrl(path, siteUrl) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl.replace(/\/$/, "")}${p}`;
}
function usePrintySeo(options) {
  const route = useRoute();
  const config = useRuntimeConfig();
  const siteUrl = config.public.siteUrl || "https://printy.ke";
  const opts = typeof options === "function" ? computed(options) : computed(() => options);
  const title = computed(() => {
    const t = opts.value.title;
    return t ? `${t} | Printy` : DEFAULT_TITLE;
  });
  const description = computed(() => opts.value.description ?? DEFAULT_DESCRIPTION);
  const path = computed(() => opts.value.path ?? route.path);
  const url = computed(() => buildSiteUrl(path.value, siteUrl));
  const image = computed(() => {
    const img = opts.value.image;
    return img ? img.startsWith("http") ? img : buildSiteUrl(img, siteUrl) : `${siteUrl}/og-default.png`;
  });
  const schemaScripts = computed(() => {
    const webPage = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title.value,
      description: description.value,
      url: url.value
    };
    const scripts = [
      { type: "application/ld+json", innerHTML: JSON.stringify(webPage) }
    ];
    const breadcrumbs = opts.value.breadcrumbs;
    if (breadcrumbs?.length) {
      const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          item: buildSiteUrl(item.path, siteUrl)
        }))
      };
      scripts.push({ type: "application/ld+json", innerHTML: JSON.stringify(breadcrumbSchema) });
    }
    const custom = opts.value.schema;
    if (custom) {
      const arr = Array.isArray(custom) ? custom : [custom];
      for (const s of arr) {
        scripts.push({ type: "application/ld+json", innerHTML: JSON.stringify(s) });
      }
    }
    return scripts;
  });
  useHead({
    title,
    meta: computed(() => [
      { name: "description", content: description.value },
      ...opts.value.noIndex ? [{ name: "robots", content: "noindex, nofollow" }] : []
    ]),
    link: computed(() => [{ rel: "canonical", href: url.value }]),
    script: schemaScripts
  });
  useHead({
    title,
    meta: [
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:image", content: image },
      { property: "og:url", content: url },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Printy" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image }
    ]
  });
  return { title, description, url, image };
}

export { usePrintySeo as u };
//# sourceMappingURL=usePrintySeo-e9OTkeHK.mjs.map
