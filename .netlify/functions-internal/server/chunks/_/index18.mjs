import { P as defineSchemaOrgResolver, Q as resolveRelation, a1 as resolvableDateToDate } from '../build/server.mjs';
import { aggregateRatingResolver } from './index2.mjs';
import { p as personResolver, o as organizationResolver } from './index3.mjs';
import { reviewResolver } from './index32.mjs';
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
import './schema-org.Brov9ENl.mjs';

const movieResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "Movie"
  },
  resolve(node, ctx) {
    node.aggregateRating = resolveRelation(node.aggregateRating, ctx, aggregateRatingResolver);
    node.review = resolveRelation(node.review, ctx, reviewResolver);
    node.director = resolveRelation(node.director, ctx, personResolver);
    node.actor = resolveRelation(node.actor, ctx, personResolver);
    node.trailer = resolveRelation(node.trailer, ctx, videoResolver);
    node.productionCompany = resolveRelation(node.productionCompany, ctx, organizationResolver);
    if (node.dateCreated)
      node.dateCreated = resolvableDateToDate(node.dateCreated);
    return node;
  }
});

export { movieResolver };
//# sourceMappingURL=index18.mjs.map
