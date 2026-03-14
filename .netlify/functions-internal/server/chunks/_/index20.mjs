import { O as defineSchemaOrgResolver, a0 as resolvableDateToDate, S as resolveWithBase, P as resolveRelation } from '../build/server.mjs';
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

const musicGroupResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "MusicGroup"
  },
  idPrefix: "host",
  inheritMeta: [
    { meta: "host", key: "url" }
  ],
  resolve(node, ctx) {
    if (node.foundingDate)
      node.foundingDate = resolvableDateToDate(node.foundingDate);
    if (node.dissolutionDate)
      node.dissolutionDate = resolvableDateToDate(node.dissolutionDate);
    if (node.url)
      node.url = resolveWithBase(ctx.meta.host, node.url);
    node.member = resolveRelation(node.member, ctx, personResolver);
    return node;
  }
});

export { musicGroupResolver };
//# sourceMappingURL=index20.mjs.map
