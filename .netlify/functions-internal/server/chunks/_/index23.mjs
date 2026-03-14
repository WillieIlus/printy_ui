import { Z as withBase } from './nitro.mjs';
import { O as defineSchemaOrgResolver, Q as setIfEmpty, S as resolveWithBase, T as resolvableDateToIso, P as resolveRelation } from '../build/server.mjs';
import { m as monetaryAmountResolver, q as quantitativeValueResolver } from './schema-org.DYUYAtdd.mjs';
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
import 'tailwindcss/colors';
import '@iconify/vue';
import 'pinia-plugin-persistedstate';
import 'reka-ui';
import '@vueuse/core';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';

const merchantReturnPolicyResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "MerchantReturnPolicy"
  },
  resolve(node, ctx) {
    if (node.returnPolicyCategory)
      node.returnPolicyCategory = withBase(node.returnPolicyCategory, "https://schema.org/");
    if (node.returnFees)
      node.returnFees = withBase(node.returnFees, "https://schema.org/");
    if (node.returnMethod)
      node.returnMethod = withBase(node.returnMethod, "https://schema.org/");
    node.returnShippingFeesAmount = resolveRelation(node.returnShippingFeesAmount, ctx, monetaryAmountResolver);
    return node;
  }
});

const definedRegionResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "DefinedRegion"
  }
});

const shippingDeliveryTimeResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "ShippingDeliveryTime"
  },
  resolve(node, ctx) {
    node.handlingTime = resolveRelation(node.handlingTime, ctx, quantitativeValueResolver);
    node.transitTime = resolveRelation(node.transitTime, ctx, quantitativeValueResolver);
    return node;
  }
});

const offerShippingDetailsResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "OfferShippingDetails"
  },
  resolve(node, ctx) {
    node.deliveryTime = resolveRelation(node.deliveryTime, ctx, shippingDeliveryTimeResolver);
    node.shippingDestination = resolveRelation(node.shippingDestination, ctx, definedRegionResolver);
    node.shippingRate = resolveRelation(node.shippingRate, ctx, monetaryAmountResolver);
    return node;
  }
});

const offerResolver = defineSchemaOrgResolver({
  cast(node) {
    if (typeof node === "number" || typeof node === "string") {
      return {
        price: node
      };
    }
    return node;
  },
  defaults: {
    "@type": "Offer",
    "availability": "InStock"
  },
  resolve(node, ctx) {
    setIfEmpty(node, "priceCurrency", ctx.meta.currency);
    setIfEmpty(node, "priceValidUntil", new Date(Date.UTC((/* @__PURE__ */ new Date()).getFullYear() + 1, 12, -1, 0, 0, 0)));
    if (node.url)
      resolveWithBase(ctx.meta.host, node.url);
    if (node.availability)
      node.availability = withBase(node.availability, "https://schema.org/");
    if (node.itemCondition)
      node.itemCondition = withBase(node.itemCondition, "https://schema.org/");
    if (node.priceValidUntil)
      node.priceValidUntil = resolvableDateToIso(node.priceValidUntil);
    node.hasMerchantReturnPolicy = resolveRelation(node.hasMerchantReturnPolicy, ctx, merchantReturnPolicyResolver);
    node.shippingDetails = resolveRelation(node.shippingDetails, ctx, offerShippingDetailsResolver);
    return node;
  }
});

export { offerResolver };
//# sourceMappingURL=index23.mjs.map
