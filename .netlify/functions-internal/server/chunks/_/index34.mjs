import { R as defineSchemaOrgResolver, a1 as resolveDefaultType, S as resolveRelation } from '../build/server.mjs';
import { aggregateRatingResolver } from './index2.mjs';
import { offerResolver } from './index23.mjs';
import { reviewResolver } from './index32.mjs';
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
import 'reka-ui';
import '@vueuse/core';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';
import './schema-org.DYUYAtdd.mjs';
import './index3.mjs';
import './index16.mjs';
import './index28.mjs';
import './index40.mjs';
import './index39.mjs';
import './schema-org.Brov9ENl.mjs';

const softwareAppResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "SoftwareApplication"
  },
  resolve(node, ctx) {
    resolveDefaultType(node, "SoftwareApplication");
    node.offers = resolveRelation(node.offers, ctx, offerResolver);
    node.aggregateRating = resolveRelation(node.aggregateRating, ctx, aggregateRatingResolver);
    node.review = resolveRelation(node.review, ctx, reviewResolver);
    return node;
  }
});

export { softwareAppResolver };
//# sourceMappingURL=index34.mjs.map
