import { Z as withBase } from './nitro.mjs';
import { V as defineSchemaOrgResolver, a2 as IdentityId, X as setIfEmpty, a0 as idReference, W as resolveRelation, a7 as resolvableDateToDate, $ as resolvableDateToIso } from '../build/server.mjs';
import { offerResolver } from './index23.mjs';
import { p as personResolver, o as organizationResolver } from './index3.mjs';
import { placeResolver } from './index8.mjs';
import { virtualLocationResolver } from './index9.mjs';
import 'lru-cache';
import '@unocss/core';
import '@unocss/preset-wind3';
import 'devalue';
import 'consola';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'vue';
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
import './index16.mjs';
import './index28.mjs';
import './index40.mjs';
import './index39.mjs';

const PrimaryEventId = "#event";
const eventResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "Event"
  },
  inheritMeta: [
    "inLanguage",
    "description",
    "image",
    { meta: "title", key: "name" }
  ],
  idPrefix: ["url", PrimaryEventId],
  resolve(node, ctx) {
    if (node.location) {
      const isVirtual = node.location === "string" || node.location?.url !== "undefined";
      node.location = resolveRelation(node.location, ctx, isVirtual ? virtualLocationResolver : placeResolver);
    }
    node.performer = resolveRelation(node.performer, ctx, personResolver, {
      root: true
    });
    node.organizer = resolveRelation(node.organizer, ctx, organizationResolver, {
      root: true
    });
    node.offers = resolveRelation(node.offers, ctx, offerResolver);
    if (node.eventAttendanceMode)
      node.eventAttendanceMode = withBase(node.eventAttendanceMode, "https://schema.org/");
    if (node.eventStatus)
      node.eventStatus = withBase(node.eventStatus, "https://schema.org/");
    const isOnline = node.eventStatus === "https://schema.org/EventMovedOnline";
    const dates = ["startDate", "previousStartDate", "endDate"];
    dates.forEach((date) => {
      if (!isOnline) {
        if (node[date] instanceof Date && node[date].getHours() === 0 && node[date].getMinutes() === 0)
          node[date] = resolvableDateToDate(node[date]);
      } else {
        node[date] = resolvableDateToIso(node[date]);
      }
    });
    setIfEmpty(node, "endDate", node.startDate);
    return node;
  },
  resolveRootNode(node, { find }) {
    const identity = find(IdentityId);
    if (identity)
      setIfEmpty(node, "organizer", idReference(identity));
  }
});

export { PrimaryEventId, eventResolver, placeResolver, virtualLocationResolver };
//# sourceMappingURL=index10.mjs.map
