import { R as defineSchemaOrgResolver } from '../build/server.mjs';

const ratingResolver = defineSchemaOrgResolver({
  cast(node) {
    if (node === "number") {
      return {
        ratingValue: node
      };
    }
    return node;
  },
  defaults: {
    "@type": "Rating",
    "bestRating": 5,
    "worstRating": 1
  }
});

export { ratingResolver as r };
//# sourceMappingURL=schema-org.Brov9ENl.mjs.map
