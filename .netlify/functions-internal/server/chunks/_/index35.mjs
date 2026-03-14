import { O as defineSchemaOrgResolver, P as resolveRelation, T as resolvableDateToIso } from '../build/server.mjs';
import { aggregateRatingResolver } from './index2.mjs';
import { p as personResolver } from './index3.mjs';
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

const tvEpisodeResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "TVEpisode"
  },
  resolve(node, ctx) {
    node.actor = resolveRelation(node.actor, ctx, personResolver);
    node.director = resolveRelation(node.director, ctx, personResolver);
    node.musicBy = resolveRelation(node.musicBy, ctx, personResolver);
    node.video = resolveRelation(node.video, ctx, videoResolver);
    node.aggregateRating = resolveRelation(node.aggregateRating, ctx, aggregateRatingResolver);
    node.review = resolveRelation(node.review, ctx, reviewResolver);
    if (node.datePublished)
      node.datePublished = resolvableDateToIso(node.datePublished);
    if (node.uploadDate)
      node.uploadDate = resolvableDateToIso(node.uploadDate);
    return node;
  }
});

export { tvEpisodeResolver };
//# sourceMappingURL=index35.mjs.map
