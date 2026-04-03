import { V as defineSchemaOrgResolver, W as resolveRelation, $ as resolvableDateToIso } from '../build/server.mjs';
import { aggregateRatingResolver } from './index2.mjs';
import { p as personResolver, o as organizationResolver } from './index3.mjs';
import { videoResolver } from './index38.mjs';
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
import './index16.mjs';
import './index28.mjs';
import './index40.mjs';
import './index39.mjs';

const tvSeriesResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "TVSeries"
  },
  resolve(node, ctx) {
    node.actor = resolveRelation(node.actor, ctx, personResolver);
    node.director = resolveRelation(node.director, ctx, personResolver);
    node.creator = resolveRelation(node.creator, ctx, personResolver);
    node.productionCompany = resolveRelation(node.productionCompany, ctx, organizationResolver);
    node.aggregateRating = resolveRelation(node.aggregateRating, ctx, aggregateRatingResolver);
    node.trailer = resolveRelation(node.trailer, ctx, videoResolver);
    if (node.datePublished)
      node.datePublished = resolvableDateToIso(node.datePublished);
    if (node.startDate)
      node.startDate = resolvableDateToIso(node.startDate);
    if (node.endDate)
      node.endDate = resolvableDateToIso(node.endDate);
    return node;
  }
});

export { tvSeriesResolver };
//# sourceMappingURL=index37.mjs.map
