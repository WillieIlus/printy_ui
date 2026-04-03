import { V as defineSchemaOrgResolver, Y as asArray, X as setIfEmpty, $ as resolvableDateToIso, Z as resolveWithBase, W as resolveRelation, a4 as imageResolver } from '../build/server.mjs';
import 'vue';
import './nitro.mjs';
import 'lru-cache';
import '@unocss/core';
import '@unocss/preset-wind3';
import 'devalue';
import 'consola';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'vue-bundle-renderer/runtime';
import 'vue/server-renderer';
import '@iconify/utils';
import 'node:crypto';
import 'fast-xml-parser';
import 'node:url';
import 'ipx';
import 'node:fs';
import 'node:path';
import 'pinia';
import 'vue-router';
import '@iconify/vue';
import 'tailwindcss/colors';
import 'pinia-plugin-persistedstate';
import 'vue-i18n';
import 'reka-ui';
import '@vueuse/core';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';

const videoResolver = defineSchemaOrgResolver({
  cast(input) {
    if (typeof input === "string") {
      input = {
        url: input
      };
    }
    return input;
  },
  alias: "video",
  defaults: {
    "@type": "VideoObject"
  },
  inheritMeta: [
    { meta: "title", key: "name" },
    "description",
    "image",
    "inLanguage",
    { meta: "datePublished", key: "uploadDate" }
  ],
  idPrefix: "host",
  resolve(video, ctx) {
    if (video.uploadDate)
      video.uploadDate = resolvableDateToIso(video.uploadDate);
    video.url = resolveWithBase(ctx.meta.host, video.url);
    if (video.caption && !video.description)
      video.description = video.caption;
    if (!video.description)
      video.description = "No description";
    if (video.thumbnailUrl && (typeof video.thumbnailUrl === "string" || Array.isArray(video.thumbnailUrl))) {
      const images = asArray(video.thumbnailUrl).map((image) => resolveWithBase(ctx.meta.host, image));
      video.thumbnailUrl = images.length > 1 ? images : images[0];
    }
    if (video.thumbnail)
      video.thumbnail = resolveRelation(video.thumbnailUrl, ctx, imageResolver);
    return video;
  },
  resolveRootNode(video, { find }) {
    if (video.image && !video.thumbnail) {
      const firstImage = asArray(video.image)[0];
      setIfEmpty(video, "thumbnail", find(firstImage["@id"])?.url);
    }
  }
});

export { videoResolver };
//# sourceMappingURL=index38.mjs.map
