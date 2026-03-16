import { P as defineSchemaOrgResolver, $ as resolveDefaultType, Q as resolveRelation, U as resolvableDateToIso } from '../build/server.mjs';
import { p as personResolver } from './index3.mjs';
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
import 'tailwindcss/colors';
import '@iconify/vue';
import 'pinia-plugin-persistedstate';
import 'reka-ui';
import '@vueuse/core';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';
import './index16.mjs';
import './index28.mjs';
import './index40.mjs';
import './index39.mjs';

const PrimaryDatasetId = "#dataset";
const datasetResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "Dataset"
  },
  inheritMeta: [
    "description",
    "url",
    "dateModified",
    "datePublished",
    { meta: "title", key: "name" }
  ],
  idPrefix: ["url", PrimaryDatasetId],
  resolve(node, ctx) {
    resolveDefaultType(node, "Dataset");
    node.creator = resolveRelation(node.creator, ctx, personResolver, {
      root: true
    });
    node.dateModified = resolvableDateToIso(node.dateModified);
    node.datePublished = resolvableDateToIso(node.datePublished);
    return node;
  }
});

export { PrimaryDatasetId, datasetResolver };
//# sourceMappingURL=index7.mjs.map
