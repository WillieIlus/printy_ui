import { V as defineSchemaOrgResolver, W as resolveRelation } from '../build/server.mjs';

const quantitativeValueResolver = defineSchemaOrgResolver({
  cast(node) {
    if (typeof node === "number") {
      return {
        value: node
      };
    }
    return node;
  },
  defaults: {
    "@type": "QuantitativeValue"
  }
});
const monetaryAmountResolver = defineSchemaOrgResolver({
  defaults: {
    "@type": "MonetaryAmount"
  },
  resolve(node, ctx) {
    if (typeof node.value !== "number")
      node.value = resolveRelation(node.value, ctx, quantitativeValueResolver);
    return node;
  }
});

export { monetaryAmountResolver as m, quantitativeValueResolver as q };
//# sourceMappingURL=schema-org.DYUYAtdd.mjs.map
