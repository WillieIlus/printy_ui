import { V as defineSchemaOrgResolver, a2 as IdentityId, X as setIfEmpty, a0 as idReference, a5 as resolveDefaultType, W as resolveRelation } from '../build/server.mjs';
import { aggregateRatingResolver } from './index2.mjs';
import { offerResolver } from './index23.mjs';
import { reviewResolver } from './index32.mjs';
import { d as PrimaryWebPageId } from './index3.mjs';
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
import './schema-org.DYUYAtdd.mjs';
import './schema-org.Brov9ENl.mjs';
import './index16.mjs';
import './index28.mjs';
import './index40.mjs';
import './index39.mjs';

const ServiceId = "#service";
const serviceResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "Service"
  },
  inheritMeta: [
    "description",
    "image",
    { meta: "title", key: "name" }
  ],
  idPrefix: ["url", ServiceId],
  resolve(node, ctx) {
    resolveDefaultType(node, "Service");
    node.offers = resolveRelation(node.offers, ctx, offerResolver);
    node.aggregateRating = resolveRelation(node.aggregateRating, ctx, aggregateRatingResolver);
    node.review = resolveRelation(node.review, ctx, reviewResolver);
    return node;
  },
  resolveRootNode(service, { find }) {
    const webPage = find(PrimaryWebPageId);
    const identity = find(IdentityId);
    if (identity)
      setIfEmpty(service, "provider", idReference(identity));
    if (identity)
      setIfEmpty(service, "brand", idReference(identity));
    if (webPage)
      setIfEmpty(service, "mainEntityOfPage", idReference(webPage));
    return service;
  }
});

export { ServiceId, serviceResolver };
//# sourceMappingURL=index33.mjs.map
