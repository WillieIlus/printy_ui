import { R as defineSchemaOrgResolver, W as resolvableDateToIso, V as resolveWithBase, S as resolveRelation } from '../build/server.mjs';
import { aggregateRatingResolver } from './index2.mjs';
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
import '@iconify/vue';
import 'tailwindcss/colors';
import 'pinia-plugin-persistedstate';
import 'reka-ui';
import '@vueuse/core';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';
import './index16.mjs';
import './index28.mjs';
import './index40.mjs';
import './index39.mjs';

const musicRecordingResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "MusicRecording"
  },
  idPrefix: "host",
  resolve(node, ctx) {
    if (node.datePublished)
      node.datePublished = resolvableDateToIso(node.datePublished);
    if (node.url)
      node.url = resolveWithBase(ctx.meta.host, node.url);
    if (node.audio)
      node.audio = resolveWithBase(ctx.meta.host, node.audio);
    node.byArtist = resolveRelation(node.byArtist, ctx, personResolver);
    node.aggregateRating = resolveRelation(node.aggregateRating, ctx, aggregateRatingResolver);
    return node;
  }
});

export { musicRecordingResolver };
//# sourceMappingURL=index22.mjs.map
