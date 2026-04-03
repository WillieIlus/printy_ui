import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import { isRef, toRef, inject, computed, useModel, unref, mergeProps, withCtx, renderSlot, createVNode, openBlock, createBlock, createTextVNode, toDisplayString, createCommentVNode, mergeModels, defineComponent, shallowRef, createElementBlock, ref, h, resolveDynamicComponent, useSlots, getCurrentInstance, provide, cloneVNode, hasInjectionContext, watch, toValue, onServerPrefetch, defineAsyncComponent, resolveComponent, useAttrs, useTemplateRef, nextTick, useSSRContext, Suspense, shallowReactive, Fragment, createApp, renderList, useId, onErrorCaptured, reactive, effectScope, withModifiers, getCurrentScope, markRaw, isReadonly, toRaw, isShallow, isReactive } from 'vue';
import { W as hasTrailingSlash, K as withTrailingSlash, X as withoutTrailingSlash, w as joinURL, Y as hasProtocol, Z as withBase, _ as serialize, $ as isEqual, a0 as klona, a1 as defu, o as createError$1, a2 as headSymbol, a3 as isScriptProtocol, a4 as useHead$1, a5 as parse$1, a6 as getRequestHeader, s as destr, a7 as parseQuery, a8 as withQuery, a9 as sanitizeStatusCode, Q as parseURL, aa as encodePath, ab as decodePath, ac as defuFn, ad as setCookie$1, ae as getCookie, af as deleteCookie, ag as getContext, ah as withLeadingSlash, ai as $fetch$1, aj as baseURL, ak as createHooks, al as executeAsync, am as TemplateParamsPlugin$1, an as InferSeoMetaPlugin, ao as titleCase, ap as encodeParam, aq as camelCase, ar as toRouteMatcher, as as createRouter$1, at as withoutBase, au as useSeoMeta$1, av as stringifyQuery, aw as resolveUnrefHeadInput } from '../_/nitro.mjs';
import { defineStore, setActivePinia, createPinia, shouldHydrate } from 'pinia';
import { useRoute as useRoute$1, RouterView, createMemoryHistory, createRouter, START_LOCATION } from 'vue-router';
import { Icon, getIcon, loadIcon as loadIcon$1, _api, addAPIProvider, setCustomIconsLoader } from '@iconify/vue';
import colors from 'tailwindcss/colors';
import { createPersistedState } from 'pinia-plugin-persistedstate';
import { createI18n } from 'vue-i18n';
import { ssrRenderComponent, ssrRenderSlot, ssrRenderClass, ssrInterpolate, ssrRenderVNode, ssrRenderAttrs, ssrRenderList, ssrRenderSuspense, ssrRenderStyle } from 'vue/server-renderer';
import { Primitive, Slot, useForwardProps, ToastProvider, ToastPortal, ToastViewport, ConfigProvider, TooltipProvider, useForwardPropsEmits, ToastRoot, ToastTitle, ToastDescription, ToastAction, ToastClose, ProgressRoot, ProgressIndicator } from 'reka-ui';
import { reactivePick, useDebounceFn, reactiveOmit, createSharedComposable } from '@vueuse/core';
import { createTV } from 'tailwind-variants';
import { getIconCSS } from '@iconify/utils/lib/css/icon';

function defineHeadPlugin(plugin) {
  return plugin;
}

const SepSub = "%separator";
function sub(p, token, isJson = false) {
  let val;
  if (token === "s" || token === "pageTitle") {
    val = p.pageTitle;
  } else if (token.includes(".")) {
    const dotIndex = token.indexOf(".");
    val = p[token.substring(0, dotIndex)]?.[token.substring(dotIndex + 1)];
  } else {
    val = p[token];
  }
  if (val !== void 0) {
    return isJson ? (val || "").replace(/\\/g, "\\\\").replace(/</g, "\\u003C").replace(/"/g, '\\"') : val || "";
  }
  return void 0;
}
function processTemplateParams(s, p, sep, isJson = false) {
  if (typeof s !== "string" || !s.includes("%"))
    return s;
  let decoded = s;
  try {
    decoded = decodeURI(s);
  } catch {
  }
  const tokens = decoded.match(/%\w+(?:\.\w+)?/g);
  if (!tokens) {
    return s;
  }
  const hasSepSub = s.includes(SepSub);
  s = s.replace(/%\w+(?:\.\w+)?/g, (token) => {
    if (token === SepSub || !tokens.includes(token)) {
      return token;
    }
    const re = sub(p, token.slice(1), isJson);
    return re !== void 0 ? re : token;
  }).trim();
  if (hasSepSub) {
    s = s.split(SepSub).map((part) => part.trim()).filter((part) => part !== "").join(sep ? ` ${sep} ` : " ");
  }
  return s;
}

const SupportedAttrs = {
  meta: "content",
  link: "href",
  htmlAttrs: "lang"
};
const contentAttrs = ["innerHTML", "textContent"];
const TemplateParamsPlugin = /* @__PURE__ */ defineHeadPlugin((head) => {
  return {
    key: "template-params",
    hooks: {
      "entries:normalize": (ctx) => {
        const params = ctx.tags.filter((t) => t.tag === "templateParams" && t.mode === "server")?.[0]?.props || {};
        if (Object.keys(params).length) {
          head._ssrPayload = {
            templateParams: {
              ...head._ssrPayload?.templateParams || {},
              ...params
            }
          };
        }
      },
      "tags:resolve": ({ tagMap, tags }) => {
        const params = tagMap.get("templateParams")?.props || {};
        const sep = params.separator || "|";
        delete params.separator;
        params.pageTitle = processTemplateParams(
          // find templateParams
          params.pageTitle || head._title || "",
          params,
          sep
        );
        for (const tag of tags) {
          if (tag.processTemplateParams === false) {
            continue;
          }
          const v = SupportedAttrs[tag.tag];
          if (v && typeof tag.props[v] === "string") {
            tag.props[v] = processTemplateParams(tag.props[v], params, sep);
          } else if (tag.processTemplateParams || tag.tag === "titleTemplate" || tag.tag === "title") {
            for (const p of contentAttrs) {
              if (typeof tag[p] === "string")
                tag[p] = processTemplateParams(tag[p], params, sep, tag.tag === "script" && tag.props.type.endsWith("json"));
            }
          }
        }
        head._templateParams = params;
        head._separator = sep;
      },
      "tags:afterResolve": ({ tagMap }) => {
        const title = tagMap.get("title");
        if (title?.textContent && title.processTemplateParams !== false) {
          title.textContent = processTemplateParams(title.textContent, head._templateParams, head._separator);
        }
      }
    }
  };
});

function defineSchemaOrgResolver(schema) {
  return schema;
}

function idReference(node) {
  return {
    "@id": typeof node !== "string" ? node["@id"] : node
  };
}
function resolvableDateToDate(val) {
  try {
    const date = val instanceof Date ? val : new Date(Date.parse(val));
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${date.getFullYear()}-${month}-${day}`;
  } catch {
  }
  return typeof val === "string" ? val : val.toString();
}
const IS_VALID_W3C_DATE = [
  /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/,
  /^\d{4}-[01]\d-[0-3]\d$/,
  /^\d{4}-[01]\d$/,
  /^\d{4}$/
];
function isValidW3CDate(d) {
  return IS_VALID_W3C_DATE.some((r) => r.test(d));
}
function resolvableDateToIso(val) {
  if (!val)
    return val;
  try {
    if (val instanceof Date)
      return val.toISOString();
    else if (isValidW3CDate(val))
      return val;
    else
      return new Date(Date.parse(val)).toISOString();
  } catch {
  }
  return typeof val === "string" ? val : val.toString();
}
const IdentityId = "#identity";
function setIfEmpty(node, field, value) {
  if (!node?.[field] && value)
    node[field] = value;
}
function asArray(input) {
  return Array.isArray(input) ? input : [input];
}
function dedupeMerge(node, field, value) {
  const data = new Set(asArray(node[field]));
  data.add(value);
  node[field] = [...data].filter(Boolean);
}
function prefixId(url, id) {
  if (hasProtocol(id))
    return id;
  if (!id.includes("#"))
    id = `#${id}`;
  return `${url || ""}${id}`;
}
function trimLength(val, length) {
  if (!val)
    return val;
  if (val.length > length) {
    const trimmedString = val.substring(0, length);
    return trimmedString.substring(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")));
  }
  return val;
}
function resolveDefaultType(node, defaultType) {
  const val = node["@type"];
  if (val === defaultType)
    return;
  if (typeof val === "string" && typeof defaultType === "string") {
    if (val !== defaultType)
      node["@type"] = [defaultType, val];
    return;
  }
  const types = new Set(asArray(defaultType));
  for (const t of asArray(val))
    types.add(t);
  node["@type"] = types.size === 1 ? val : [...types];
}
function resolveWithBase(base, urlOrPath) {
  if (!urlOrPath || hasProtocol(urlOrPath) || urlOrPath[0] !== "/" && urlOrPath[0] !== "#")
    return urlOrPath;
  return withBase(urlOrPath, base);
}
function resolveAsGraphKey(key) {
  if (!key)
    return key;
  return key.substring(key.lastIndexOf("#"));
}
function stripEmptyProperties(obj) {
  for (const k in obj) {
    if (!Object.hasOwn(obj, k))
      continue;
    const v = obj[k];
    if (v === "" || v === null || v === void 0) {
      delete obj[k];
    } else if (typeof v === "object" && v !== null) {
      if (v.__v_isReadonly || v.__v_isRef)
        continue;
      stripEmptyProperties(v);
    }
  }
  return obj;
}

const imageResolver = defineSchemaOrgResolver({
  alias: "image",
  cast(input) {
    if (typeof input === "string") {
      input = {
        url: input
      };
    }
    return input;
  },
  defaults: {
    "@type": "ImageObject"
  },
  inheritMeta: [
    // @todo possibly only do if there's a caption
    "inLanguage"
  ],
  idPrefix: "host",
  resolve(image, { meta }) {
    image.url = resolveWithBase(meta.host, image.url);
    setIfEmpty(image, "contentUrl", image.url);
    if (image.height && !image.width)
      delete image.height;
    if (image.width && !image.height)
      delete image.width;
    return image;
  }
});

const index$1 = {
  __proto__: null,
  imageResolver: imageResolver
};

function nextNodeId(ctx, alias) {
  ctx.nodeIdCounters[alias] = (ctx.nodeIdCounters[alias] || 0) + 1;
  return ctx.nodeIdCounters[alias].toString();
}
function resolveMeta(meta) {
  if (!meta.host && meta.canonicalHost)
    meta.host = meta.canonicalHost;
  if (!meta.tagPosition && meta.position)
    meta.tagPosition = meta.position;
  if (!meta.currency && meta.defaultCurrency)
    meta.currency = meta.defaultCurrency;
  if (!meta.inLanguage && meta.defaultLanguage)
    meta.inLanguage = meta.defaultLanguage;
  if (!meta.path)
    meta.path = "/";
  if (!meta.host && typeof document !== "undefined")
    meta.host = document.location.host;
  if (!meta.url && meta.canonicalUrl)
    meta.url = meta.canonicalUrl;
  if (meta.path !== "/") {
    if (meta.trailingSlash && !hasTrailingSlash(meta.path))
      meta.path = withTrailingSlash(meta.path);
    else if (!meta.trailingSlash && hasTrailingSlash(meta.path))
      meta.path = withoutTrailingSlash(meta.path);
  }
  meta.url = joinURL(meta.host || "", meta.path);
  return {
    ...meta,
    host: meta.host,
    url: meta.url,
    currency: meta.currency,
    image: meta.image,
    inLanguage: meta.inLanguage,
    title: meta.title,
    description: meta.description,
    datePublished: meta.datePublished,
    dateModified: meta.dateModified
  };
}
function resolveNode(node, ctx, resolver) {
  if (resolver?.cast)
    node = resolver.cast(node, ctx);
  if (resolver?.defaults) {
    let defaults = resolver.defaults;
    if (typeof defaults === "function")
      defaults = defaults(ctx);
    node = { ...defaults, ...node };
  }
  const inheritMeta = resolver?.inheritMeta;
  if (inheritMeta) {
    for (let i = 0; i < inheritMeta.length; i++) {
      const entry = inheritMeta[i];
      if (typeof entry === "string")
        setIfEmpty(node, entry, ctx.meta[entry]);
      else
        setIfEmpty(node, entry.key, ctx.meta[entry.meta]);
    }
  }
  if (resolver?.resolve)
    node = resolver.resolve(node, ctx);
  for (const k in node) {
    const v = node[k];
    if (Array.isArray(v)) {
      for (let i = 0; i < v.length; i++) {
        const item = v[i];
        if (typeof item === "object" && item?._resolver)
          node[k][i] = resolveRelation(item, ctx, item._resolver);
      }
    } else if (typeof v === "object" && v?._resolver) {
      node[k] = resolveRelation(v, ctx, v._resolver);
    }
  }
  stripEmptyProperties(node);
  return node;
}
function resolveNodeId(node, ctx, resolver, resolveAsRoot = false) {
  if (node["@id"] && node["@id"].startsWith("http"))
    return node;
  const prefix = resolver ? (Array.isArray(resolver.idPrefix) ? resolver.idPrefix[0] : resolver.idPrefix) || "url" : "url";
  const rootId = node["@id"] || (resolver ? Array.isArray(resolver.idPrefix) ? resolver.idPrefix?.[1] : void 0 : "");
  if (!node["@id"] && resolveAsRoot && rootId) {
    node["@id"] = prefixId(ctx.meta[prefix], rootId);
    return node;
  }
  if (node["@id"]?.startsWith("#/schema/") || node["@id"]?.startsWith("/")) {
    node["@id"] = prefixId(ctx.meta[prefix], node["@id"]);
    return node;
  }
  let alias = resolver?.alias;
  if (!alias) {
    const type = asArray(node["@type"])?.[0] || "";
    alias = type.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
  }
  node["@id"] = prefixId(ctx.meta[prefix], `#/schema/${alias}/${node["@id"] || nextNodeId(ctx, alias)}`);
  return node;
}
function resolveRelation(input, ctx, fallbackResolver, options = {}) {
  if (!input)
    return input;
  const items = asArray(input);
  const ids = [];
  for (let i = 0; i < items.length; i++) {
    const a = items[i];
    let keyCount = 0;
    for (const _ in a) keyCount++;
    if (keyCount === 1 && a["@id"] || keyCount === 2 && a["@id"] && a["@type"]) {
      ids.push(resolveNodeId({
        "@id": ctx.find(a["@id"])?.["@id"] || a["@id"]
      }, ctx));
      continue;
    }
    let resolver = fallbackResolver;
    if (a._resolver && typeof a._resolver !== "string") {
      resolver = a._resolver;
      delete a._resolver;
    }
    if (!resolver) {
      ids.push(a);
      continue;
    }
    let node = resolveNode(a, ctx, resolver);
    if (options.afterResolve)
      options.afterResolve(node);
    if (options.generateId || options.root)
      node = resolveNodeId(node, ctx, resolver, false);
    if (options.root) {
      if (resolver.resolveRootNode)
        resolver.resolveRootNode(node, ctx);
      ctx.push(node);
      ids.push(idReference(node["@id"]));
      continue;
    }
    ids.push(node);
  }
  return !options.array && ids.length === 1 ? ids[0] : ids;
}

const UNSAFE_KEYS$1 = /* @__PURE__ */ new Set(["__proto__", "constructor", "prototype"]);
function merge(target, source) {
  if (!source)
    return target;
  for (const key in source) {
    if (!Object.hasOwn(source, key) || UNSAFE_KEYS$1.has(key))
      continue;
    const value = source[key];
    if (value === void 0)
      continue;
    if (Array.isArray(target[key])) {
      if (Array.isArray(value)) {
        const merged = [...target[key], ...value];
        if (key === "@type") {
          target[key] = [...new Set(merged)];
        } else if (key === "itemListElement") {
          merged.sort((a, b) => (a.position || 0) - (b.position || 0));
          for (let i = 0; i < merged.length; i++)
            merged[i].position = i + 1;
          target[key] = merged;
        } else if (key === "potentialAction") {
          const byType = /* @__PURE__ */ Object.create(null);
          for (const action of merged) {
            const type = action["@type"];
            if (byType[type]) {
              if (action.target && byType[type].target)
                byType[type].target = [.../* @__PURE__ */ new Set([...byType[type].target, ...action.target])];
            } else {
              byType[type] = { ...action };
            }
          }
          target[key] = Object.values(byType);
        } else {
          target[key] = merged;
        }
      } else {
        target[key] = merge(target[key], [value]);
      }
    } else if (target[key] && typeof target[key] === "object" && typeof value === "object" && !Array.isArray(value)) {
      target[key] = merge({ ...target[key] }, value);
    } else {
      target[key] = value;
    }
  }
  return target;
}

function indexNode(index, node) {
  if (!node["@id"])
    return;
  const nodeId = node["@id"];
  const fragmentKey = resolveAsGraphKey(nodeId);
  index.set(fragmentKey, node);
  index.set(nodeId, node);
  const domainKey = nodeId.replace(/(https?:)?\/\//, "").split("/")[0];
  index.set(domainKey, node);
}
function createSchemaOrgGraph() {
  const ctx = {
    find(id) {
      let resolver = (s) => s;
      if (id[0] === "#") {
        resolver = resolveAsGraphKey;
      } else if (id[0] === "/") {
        resolver = (s) => s.replace(/(https?:)?\/\//, "").split("/")[0];
      }
      const key = resolver(id);
      if (ctx.nodeIndex.size > 0) {
        return ctx.nodeIndex.get(key) || null;
      }
      return ctx.nodes.filter((n) => !!n["@id"]).find((n) => resolver(n["@id"]) === key);
    },
    push(input) {
      asArray(input).forEach((node) => {
        const registeredNode = node;
        ctx.nodes.push(registeredNode);
        if (ctx.nodeIndex.size > 0)
          indexNode(ctx.nodeIndex, registeredNode);
      });
    },
    resolveGraph(meta) {
      for (const k in ctx.nodeIdCounters) delete ctx.nodeIdCounters[k];
      ctx.meta = resolveMeta({ ...meta });
      const len = ctx.nodes.length;
      for (let i = 0; i < len; i++) {
        let node = ctx.nodes[i];
        const resolver = node._resolver;
        node = resolveNode(node, ctx, resolver);
        node = resolveNodeId(node, ctx, resolver, true);
        ctx.nodes[i] = node;
      }
      const dedupedNodes = /* @__PURE__ */ Object.create(null);
      ctx.nodeIndex = /* @__PURE__ */ new Map();
      for (let i = 0; i < ctx.nodes.length; i++) {
        const n = ctx.nodes[i];
        const nodeKey = resolveAsGraphKey(n["@id"]);
        if (dedupedNodes[nodeKey]) {
          if (n._dedupeStrategy !== "replace")
            dedupedNodes[nodeKey] = merge(dedupedNodes[nodeKey], n);
          else
            dedupedNodes[nodeKey] = n;
        } else {
          dedupedNodes[nodeKey] = n;
        }
      }
      ctx.nodes = Object.values(dedupedNodes);
      for (let i = 0; i < ctx.nodes.length; i++)
        indexNode(ctx.nodeIndex, ctx.nodes[i]);
      const countBeforeRelations = ctx.nodes.length;
      for (let i = 0; i < ctx.nodes.length; i++) {
        const node = ctx.nodes[i];
        if (node.image && typeof node.image === "string") {
          node.image = resolveRelation(node.image, ctx, imageResolver, {
            root: true
          });
        }
        node.translationOfWork = resolveRelation(node.translationOfWork, ctx);
        node.workTranslation = resolveRelation(node.workTranslation, ctx);
        if (node._resolver?.resolveRootNode)
          node._resolver.resolveRootNode(node, ctx);
        delete node._resolver;
      }
      const needsDedupe = ctx.nodes.length > countBeforeRelations;
      const normalizedNodes = needsDedupe ? /* @__PURE__ */ Object.create(null) : null;
      const result = needsDedupe ? null : [];
      for (let i = 0; i < ctx.nodes.length; i++) {
        const n = ctx.nodes[i];
        const nodeKey = resolveAsGraphKey(n["@id"]);
        const keys = Object.keys(n);
        const primitives = [];
        const relations = [];
        for (let j = 0; j < keys.length; j++) {
          const k = keys[j];
          if (k[0] === "_")
            continue;
          const v = n[k];
          if (v !== null && (Array.isArray(v) || typeof v === "object"))
            relations.push(k);
          else
            primitives.push(k);
        }
        primitives.sort();
        relations.sort();
        const newNode = {};
        for (let j = 0; j < primitives.length; j++)
          newNode[primitives[j]] = n[primitives[j]];
        for (let j = 0; j < relations.length; j++)
          newNode[relations[j]] = n[relations[j]];
        if (needsDedupe) {
          normalizedNodes[nodeKey] = normalizedNodes[nodeKey] ? merge(normalizedNodes[nodeKey], newNode) : newNode;
        } else {
          result.push(newNode);
        }
      }
      return needsDedupe ? Object.values(normalizedNodes) : result;
    },
    nodes: [],
    nodeIndex: /* @__PURE__ */ new Map(),
    nodeIdCounters: /* @__PURE__ */ Object.create(null),
    meta: {}
  };
  return ctx;
}

const resolverCache = {};
const resolverImports = {
  address: () => import('../_/index28.mjs'),
  aggregateOffer: () => import('../_/index.mjs'),
  aggregateRating: () => import('../_/index2.mjs'),
  article: () => import('../_/index3.mjs').then(function (n) { return n.l; }),
  breadcrumb: () => import('../_/index3.mjs').then(function (n) { return n.i; }),
  comment: () => import('../_/index5.mjs'),
  course: () => import('../_/index6.mjs'),
  dataset: () => import('../_/index7.mjs'),
  event: () => import('../_/index10.mjs'),
  foodEstablishment: () => import('../_/index11.mjs'),
  virtualLocation: () => import('../_/index9.mjs'),
  place: () => import('../_/index8.mjs'),
  howTo: () => import('../_/index13.mjs'),
  howToStep: () => import('../_/index12.mjs').then(function (n) { return n.i; }),
  image: () => Promise.resolve().then(function () { return index$1; }),
  localBusiness: () => import('../_/index17.mjs'),
  offer: () => import('../_/index23.mjs'),
  openingHours: () => import('../_/index24.mjs'),
  organization: () => import('../_/index3.mjs').then(function (n) { return n.h; }),
  person: () => import('../_/index3.mjs').then(function (n) { return n.k; }),
  product: () => import('../_/index29.mjs'),
  question: () => import('../_/index30.mjs'),
  recipe: () => import('../_/index31.mjs'),
  review: () => import('../_/index32.mjs'),
  video: () => import('../_/index38.mjs'),
  webPage: () => import('../_/index3.mjs').then(function (n) { return n.j; }),
  webSite: () => import('../_/index3.mjs').then(function (n) { return n.g; }),
  book: () => import('../_/index4.mjs'),
  itemList: () => import('../_/index14.mjs'),
  jobPosting: () => import('../_/index15.mjs'),
  listItem: () => import('../_/index16.mjs'),
  movie: () => import('../_/index18.mjs'),
  musicAlbum: () => import('../_/index19.mjs'),
  musicGroup: () => import('../_/index20.mjs'),
  musicPlaylist: () => import('../_/index21.mjs'),
  musicRecording: () => import('../_/index22.mjs'),
  podcastEpisode: () => import('../_/index25.mjs'),
  podcastSeason: () => import('../_/index26.mjs'),
  podcastSeries: () => import('../_/index27.mjs'),
  searchAction: () => import('../_/index40.mjs'),
  readAction: () => import('../_/index39.mjs'),
  service: () => import('../_/index33.mjs'),
  softwareApp: () => import('../_/index34.mjs'),
  tvEpisode: () => import('../_/index35.mjs'),
  tvSeason: () => import('../_/index36.mjs'),
  tvSeries: () => import('../_/index37.mjs'),
  bookEdition: () => import('../_/index4.mjs')
};
const resolverExportNames = {
  address: "addressResolver",
  aggregateOffer: "aggregateOfferResolver",
  aggregateRating: "aggregateRatingResolver",
  article: "articleResolver",
  breadcrumb: "breadcrumbResolver",
  comment: "commentResolver",
  course: "courseResolver",
  dataset: "datasetResolver",
  event: "eventResolver",
  foodEstablishment: "foodEstablishmentResolver",
  virtualLocation: "virtualLocationResolver",
  place: "placeResolver",
  howTo: "howToResolver",
  howToStep: "howToStepResolver",
  image: "imageResolver",
  localBusiness: "localBusinessResolver",
  offer: "offerResolver",
  openingHours: "openingHoursResolver",
  organization: "organizationResolver",
  person: "personResolver",
  product: "productResolver",
  question: "questionResolver",
  recipe: "recipeResolver",
  review: "reviewResolver",
  video: "videoResolver",
  webPage: "webPageResolver",
  webSite: "webSiteResolver",
  book: "bookResolver",
  itemList: "itemListResolver",
  jobPosting: "jobPostingResolver",
  listItem: "listItemResolver",
  movie: "movieResolver",
  musicAlbum: "musicAlbumResolver",
  musicGroup: "musicGroupResolver",
  musicPlaylist: "musicPlaylistResolver",
  musicRecording: "musicRecordingResolver",
  podcastEpisode: "podcastEpisodeResolver",
  podcastSeason: "podcastSeasonResolver",
  podcastSeries: "podcastSeriesResolver",
  searchAction: "searchActionResolver",
  readAction: "readActionResolver",
  service: "serviceResolver",
  softwareApp: "softwareAppResolver",
  tvEpisode: "tvEpisodeResolver",
  tvSeason: "tvSeasonResolver",
  tvSeries: "tvSeriesResolver",
  bookEdition: "bookEditionResolver"
};
async function loadResolver(resolver) {
  if (resolverCache[resolver])
    return resolverCache[resolver];
  const importFn = resolverImports[resolver];
  if (!importFn)
    return null;
  const mod = await importFn();
  const exportName = resolverExportNames[resolver];
  const loaded = mod[exportName] || mod.default;
  if (loaded)
    resolverCache[resolver] = loaded;
  return loaded || null;
}

const UNSAFE_KEYS = /* @__PURE__ */ new Set(["__proto__", "constructor", "prototype"]);
async function preloadNestedResolvers(obj) {
  if (!obj || typeof obj !== "object")
    return;
  const promises = [];
  if (typeof obj._resolver === "string") {
    const resolverName = obj._resolver;
    promises.push(loadResolver(resolverName).then((loaded) => {
      if (loaded)
        obj._resolver = loaded;
    }));
  }
  for (const key in obj) {
    if (!Object.hasOwn(obj, key) || UNSAFE_KEYS.has(key))
      continue;
    const val = obj[key];
    if (val && typeof val === "object") {
      if (Array.isArray(val)) {
        for (const item of val) {
          promises.push(preloadNestedResolvers(item));
        }
      } else {
        promises.push(preloadNestedResolvers(val));
      }
    }
  }
  await Promise.all(promises);
}
function mergeObjects(target, source) {
  const result = { ...target };
  for (const key in source) {
    if (!Object.hasOwn(source, key) || source[key] === void 0 || UNSAFE_KEYS.has(key))
      continue;
    const isNestedObject = result[key] && typeof result[key] === "object" && typeof source[key] === "object" && !Array.isArray(result[key]) && !Array.isArray(source[key]);
    if (isNestedObject)
      result[key] = mergeObjects(result[key], source[key]);
    else if (!result[key])
      result[key] = source[key];
  }
  return result;
}
function SchemaOrgUnheadPlugin(config, meta, options) {
  config = resolveMeta({ ...config });
  let graph;
  let resolvedMeta = {};
  return defineHeadPlugin((head) => {
    head.use(TemplateParamsPlugin);
    return {
      key: "schema-org",
      hooks: {
        "entries:normalize": async ({ tags }) => {
          graph = graph || createSchemaOrgGraph();
          for (const tag of tags) {
            if (tag.tag === "script" && tag.props.type === "application/ld+json" && tag.props.nodes) {
              const nodes = await tag.props.nodes;
              for (const node of Array.isArray(nodes) ? nodes : [nodes]) {
                if (typeof node !== "object" || Object.keys(node).length === 0) {
                  continue;
                }
                await preloadNestedResolvers(node);
                const newNode = {
                  ...node,
                  _dedupeStrategy: tag.tagDuplicateStrategy
                };
                graph.push(newNode);
              }
              tag.tagPosition = tag.tagPosition || config.tagPosition === "head" ? "head" : "bodyClose";
            }
            if (tag.tag === "htmlAttrs" && tag.props.lang) {
              resolvedMeta.inLanguage = tag.props.lang;
            } else if (tag.tag === "title") {
              resolvedMeta.title = tag.textContent;
            } else if (tag.tag === "meta" && tag.props.name === "description") {
              resolvedMeta.description = tag.props.content;
            } else if (tag.tag === "link" && tag.props.rel === "canonical") {
              resolvedMeta.url = tag.props.href;
              if (resolvedMeta.url && !resolvedMeta.host) {
                try {
                  resolvedMeta.host = new URL(resolvedMeta.url).origin;
                } catch {
                }
              }
            } else if (tag.tag === "meta" && tag.props.property === "og:image") {
              resolvedMeta.image = tag.props.content;
            } else if (tag.tag === "templateParams" && tag.props.schemaOrg) {
              resolvedMeta = {
                ...resolvedMeta,
                // @ts-expect-error untyped
                ...tag.props.schemaOrg
              };
              delete tag.props.schemaOrg;
            }
          }
        },
        "tags:resolve": async (ctx) => {
          for (const k in ctx.tags) {
            const tag = ctx.tags[k];
            if (tag.tag === "script" && tag.props.type === "application/ld+json" && tag.props.nodes) {
              delete tag.props.nodes;
              const resolvedGraph = graph.resolveGraph({ ...await meta?.() || {}, ...config, ...resolvedMeta });
              if (!resolvedGraph.length) {
                tag.props = {};
                return;
              }
              tag.innerHTML = JSON.stringify({
                "@context": "https://schema.org",
                "@graph": resolvedGraph
              }, (_, value) => {
                if (typeof value !== "object")
                  return processTemplateParams(value, head._templateParams, head._separator);
                return value;
              }, 0 );
              return;
            }
          }
        },
        "tags:afterResolve": (ctx) => {
          let firstNodeKey;
          for (const k in ctx.tags) {
            const tag = ctx.tags[k];
            if (!tag?.props)
              continue;
            if (tag.props.type === "application/ld+json" && tag.props.nodes || tag.key === "schema-org-graph") {
              delete tag.props.nodes;
              if (typeof firstNodeKey === "undefined") {
                firstNodeKey = k;
                continue;
              }
              ctx.tags[firstNodeKey].props = mergeObjects(ctx.tags[firstNodeKey].props, tag.props);
              delete ctx.tags[firstNodeKey].props.nodes;
              ctx.tags[k] = false;
            }
          }
          ctx.tags = ctx.tags.filter(Boolean);
        }
      }
    };
  });
}

function provideResolver(input, resolver) {
  if (!input)
    input = {};
  const target = isRef(input) ? input.value : input;
  target._resolver = resolver;
  return input;
}
function defineWebPage(input) {
  return provideResolver(input, "webPage");
}
function defineWebSite(input) {
  return provideResolver(input, "webSite");
}

/** @type {Record<string, string>} */

class DevalueError extends Error {
	/**
	 * @param {string} message
	 * @param {string[]} keys
	 * @param {any} [value] - The value that failed to be serialized
	 * @param {any} [root] - The root value being serialized
	 */
	constructor(message, keys, value, root) {
		super(message);
		this.name = 'DevalueError';
		this.path = keys.join('');
		this.value = value;
		this.root = root;
	}
}

/** @param {any} thing */
function is_primitive(thing) {
	return Object(thing) !== thing;
}

const object_proto_names = /* @__PURE__ */ Object.getOwnPropertyNames(
	Object.prototype
)
	.sort()
	.join('\0');

/** @param {any} thing */
function is_plain_object(thing) {
	const proto = Object.getPrototypeOf(thing);

	return (
		proto === Object.prototype ||
		proto === null ||
		Object.getPrototypeOf(proto) === null ||
		Object.getOwnPropertyNames(proto).sort().join('\0') === object_proto_names
	);
}

/** @param {any} thing */
function get_type(thing) {
	return Object.prototype.toString.call(thing).slice(8, -1);
}

/** @param {string} char */
function get_escaped_char(char) {
	switch (char) {
		case '"':
			return '\\"';
		case '<':
			return '\\u003C';
		case '\\':
			return '\\\\';
		case '\n':
			return '\\n';
		case '\r':
			return '\\r';
		case '\t':
			return '\\t';
		case '\b':
			return '\\b';
		case '\f':
			return '\\f';
		case '\u2028':
			return '\\u2028';
		case '\u2029':
			return '\\u2029';
		default:
			return char < ' '
				? `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`
				: '';
	}
}

/** @param {string} str */
function stringify_string(str) {
	let result = '';
	let last_pos = 0;
	const len = str.length;

	for (let i = 0; i < len; i += 1) {
		const char = str[i];
		const replacement = get_escaped_char(char);
		if (replacement) {
			result += str.slice(last_pos, i) + replacement;
			last_pos = i + 1;
		}
	}

	return `"${last_pos === 0 ? str : result + str.slice(last_pos)}"`;
}

/** @param {Record<string | symbol, any>} object */
function enumerable_symbols(object) {
	return Object.getOwnPropertySymbols(object).filter(
		(symbol) => Object.getOwnPropertyDescriptor(object, symbol).enumerable
	);
}

const is_identifier = /^[a-zA-Z_$][a-zA-Z_$0-9]*$/;

/** @param {string} key */
function stringify_key(key) {
	return is_identifier.test(key) ? '.' + key : '[' + JSON.stringify(key) + ']';
}

/**
 * Base64 Encodes an arraybuffer
 * @param {ArrayBuffer} arraybuffer
 * @returns {string}
 */
function encode64(arraybuffer) {
  const dv = new DataView(arraybuffer);
  let binaryString = "";

  for (let i = 0; i < arraybuffer.byteLength; i++) {
    binaryString += String.fromCharCode(dv.getUint8(i));
  }

  return binaryToAscii(binaryString);
}

/**
 * Decodes a base64 string into an arraybuffer
 * @param {string} string
 * @returns {ArrayBuffer}
 */
function decode64(string) {
  const binaryString = asciiToBinary(string);
  const arraybuffer = new ArrayBuffer(binaryString.length);
  const dv = new DataView(arraybuffer);

  for (let i = 0; i < arraybuffer.byteLength; i++) {
    dv.setUint8(i, binaryString.charCodeAt(i));
  }

  return arraybuffer;
}

const KEY_STRING =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

/**
 * Substitute for atob since it's deprecated in node.
 * Does not do any input validation.
 *
 * @see https://github.com/jsdom/abab/blob/master/lib/atob.js
 *
 * @param {string} data
 * @returns {string}
 */
function asciiToBinary(data) {
  if (data.length % 4 === 0) {
    data = data.replace(/==?$/, "");
  }

  let output = "";
  let buffer = 0;
  let accumulatedBits = 0;

  for (let i = 0; i < data.length; i++) {
    buffer <<= 6;
    buffer |= KEY_STRING.indexOf(data[i]);
    accumulatedBits += 6;
    if (accumulatedBits === 24) {
      output += String.fromCharCode((buffer & 0xff0000) >> 16);
      output += String.fromCharCode((buffer & 0xff00) >> 8);
      output += String.fromCharCode(buffer & 0xff);
      buffer = accumulatedBits = 0;
    }
  }
  if (accumulatedBits === 12) {
    buffer >>= 4;
    output += String.fromCharCode(buffer);
  } else if (accumulatedBits === 18) {
    buffer >>= 2;
    output += String.fromCharCode((buffer & 0xff00) >> 8);
    output += String.fromCharCode(buffer & 0xff);
  }
  return output;
}

/**
 * Substitute for btoa since it's deprecated in node.
 * Does not do any input validation.
 *
 * @see https://github.com/jsdom/abab/blob/master/lib/btoa.js
 *
 * @param {string} str
 * @returns {string}
 */
function binaryToAscii(str) {
  let out = "";
  for (let i = 0; i < str.length; i += 3) {
    /** @type {[number, number, number, number]} */
    const groupsOfSix = [undefined, undefined, undefined, undefined];
    groupsOfSix[0] = str.charCodeAt(i) >> 2;
    groupsOfSix[1] = (str.charCodeAt(i) & 0x03) << 4;
    if (str.length > i + 1) {
      groupsOfSix[1] |= str.charCodeAt(i + 1) >> 4;
      groupsOfSix[2] = (str.charCodeAt(i + 1) & 0x0f) << 2;
    }
    if (str.length > i + 2) {
      groupsOfSix[2] |= str.charCodeAt(i + 2) >> 6;
      groupsOfSix[3] = str.charCodeAt(i + 2) & 0x3f;
    }
    for (let j = 0; j < groupsOfSix.length; j++) {
      if (typeof groupsOfSix[j] === "undefined") {
        out += "=";
      } else {
        out += KEY_STRING[groupsOfSix[j]];
      }
    }
  }
  return out;
}

const UNDEFINED = -1;
const HOLE = -2;
const NAN = -3;
const POSITIVE_INFINITY = -4;
const NEGATIVE_INFINITY = -5;
const NEGATIVE_ZERO = -6;

/**
 * Revive a value serialized with `devalue.stringify`
 * @param {string} serialized
 * @param {Record<string, (value: any) => any>} [revivers]
 */
function parse(serialized, revivers) {
	return unflatten(JSON.parse(serialized));
}

/**
 * Revive a value flattened with `devalue.stringify`
 * @param {number | any[]} parsed
 * @param {Record<string, (value: any) => any>} [revivers]
 */
function unflatten(parsed, revivers) {
	if (typeof parsed === 'number') return hydrate(parsed, true);

	if (!Array.isArray(parsed) || parsed.length === 0) {
		throw new Error('Invalid input');
	}

	const values = /** @type {any[]} */ (parsed);

	const hydrated = Array(values.length);

	/**
	 * @param {number} index
	 * @returns {any}
	 */
	function hydrate(index, standalone = false) {
		if (index === UNDEFINED) return undefined;
		if (index === NAN) return NaN;
		if (index === POSITIVE_INFINITY) return Infinity;
		if (index === NEGATIVE_INFINITY) return -Infinity;
		if (index === NEGATIVE_ZERO) return -0;

		if (standalone || typeof index !== 'number') {
			throw new Error(`Invalid input`);
		}

		if (index in hydrated) return hydrated[index];

		const value = values[index];

		if (!value || typeof value !== 'object') {
			hydrated[index] = value;
		} else if (Array.isArray(value)) {
			if (typeof value[0] === 'string') {
				const type = value[0];

				switch (type) {
					case 'Date':
						hydrated[index] = new Date(value[1]);
						break;

					case 'Set':
						const set = new Set();
						hydrated[index] = set;
						for (let i = 1; i < value.length; i += 1) {
							set.add(hydrate(value[i]));
						}
						break;

					case 'Map':
						const map = new Map();
						hydrated[index] = map;
						for (let i = 1; i < value.length; i += 2) {
							map.set(hydrate(value[i]), hydrate(value[i + 1]));
						}
						break;

					case 'RegExp':
						hydrated[index] = new RegExp(value[1], value[2]);
						break;

					case 'Object':
						hydrated[index] = Object(value[1]);
						break;

					case 'BigInt':
						hydrated[index] = BigInt(value[1]);
						break;

					case 'null':
						const obj = Object.create(null);
						hydrated[index] = obj;
						for (let i = 1; i < value.length; i += 2) {
							obj[value[i]] = hydrate(value[i + 1]);
						}
						break;

					case 'Int8Array':
					case 'Uint8Array':
					case 'Uint8ClampedArray':
					case 'Int16Array':
					case 'Uint16Array':
					case 'Int32Array':
					case 'Uint32Array':
					case 'Float32Array':
					case 'Float64Array':
					case 'BigInt64Array':
					case 'BigUint64Array': {
						if (values[value[1]][0] !== 'ArrayBuffer') {
							// without this, if we receive malformed input we could
							// end up trying to hydrate in a circle or allocate
							// huge amounts of memory when we call `new TypedArrayConstructor(buffer)`
							throw new Error('Invalid data');
						}

						const TypedArrayConstructor = globalThis[type];
						const buffer = hydrate(value[1]);
						const typedArray = new TypedArrayConstructor(buffer);

						hydrated[index] =
							value[2] !== undefined
								? typedArray.subarray(value[2], value[3])
								: typedArray;

						break;
					}

					case 'ArrayBuffer': {
						const base64 = value[1];
						if (typeof base64 !== 'string') {
							throw new Error('Invalid ArrayBuffer encoding');
						}
						const arraybuffer = decode64(base64);
						hydrated[index] = arraybuffer;
						break;
					}

					case 'Temporal.Duration':
					case 'Temporal.Instant':
					case 'Temporal.PlainDate':
					case 'Temporal.PlainTime':
					case 'Temporal.PlainDateTime':
					case 'Temporal.PlainMonthDay':
					case 'Temporal.PlainYearMonth':
					case 'Temporal.ZonedDateTime': {
						const temporalName = type.slice(9);
						// @ts-expect-error TS doesn't know about Temporal yet
						hydrated[index] = Temporal[temporalName].from(value[1]);
						break;
					}

					case 'URL': {
						const url = new URL(value[1]);
						hydrated[index] = url;
						break;
					}

					case 'URLSearchParams': {
						const url = new URLSearchParams(value[1]);
						hydrated[index] = url;
						break;
					}

					default:
						throw new Error(`Unknown type ${type}`);
				}
			} else {
				const array = new Array(value.length);
				hydrated[index] = array;

				for (let i = 0; i < value.length; i += 1) {
					const n = value[i];
					if (n === HOLE) continue;

					array[i] = hydrate(n);
				}
			}
		} else {
			/** @type {Record<string, any>} */
			const object = {};
			hydrated[index] = object;

			for (const key in value) {
				if (key === '__proto__') {
					throw new Error('Cannot parse an object with a `__proto__` property');
				}

				const n = value[key];
				object[key] = hydrate(n);
			}
		}

		return hydrated[index];
	}

	return hydrate(0);
}

/**
 * Turn a value into a JSON string that can be parsed with `devalue.parse`
 * @param {any} value
 * @param {Record<string, (value: any) => any>} [reducers]
 */
function stringify(value, reducers) {
	/** @type {any[]} */
	const stringified = [];

	/** @type {Map<any, number>} */
	const indexes = new Map();

	/** @type {Array<{ key: string, fn: (value: any) => any }>} */
	const custom = [];

	/** @type {string[]} */
	const keys = [];

	let p = 0;

	/** @param {any} thing */
	function flatten(thing) {
		if (thing === undefined) return UNDEFINED;
		if (Number.isNaN(thing)) return NAN;
		if (thing === Infinity) return POSITIVE_INFINITY;
		if (thing === -Infinity) return NEGATIVE_INFINITY;
		if (thing === 0 && 1 / thing < 0) return NEGATIVE_ZERO;

		if (indexes.has(thing)) return indexes.get(thing);

		const index = p++;
		indexes.set(thing, index);

		for (const { key, fn } of custom) {
			const value = fn(thing);
			if (value) {
				stringified[index] = `["${key}",${flatten(value)}]`;
				return index;
			}
		}

		if (typeof thing === 'function') {
			throw new DevalueError(`Cannot stringify a function`, keys, thing, value);
		}

		let str = '';

		if (is_primitive(thing)) {
			str = stringify_primitive(thing);
		} else {
			const type = get_type(thing);

			switch (type) {
				case 'Number':
				case 'String':
				case 'Boolean':
					str = `["Object",${stringify_primitive(thing)}]`;
					break;

				case 'BigInt':
					str = `["BigInt",${thing}]`;
					break;

				case 'Date':
					const valid = !isNaN(thing.getDate());
					str = `["Date","${valid ? thing.toISOString() : ''}"]`;
					break;

				case 'URL':
					str = `["URL",${stringify_string(thing.toString())}]`;
					break;

				case 'URLSearchParams':
					str = `["URLSearchParams",${stringify_string(thing.toString())}]`;
					break;

				case 'RegExp':
					const { source, flags } = thing;
					str = flags
						? `["RegExp",${stringify_string(source)},"${flags}"]`
						: `["RegExp",${stringify_string(source)}]`;
					break;

				case 'Array':
					str = '[';

					for (let i = 0; i < thing.length; i += 1) {
						if (i > 0) str += ',';

						if (i in thing) {
							keys.push(`[${i}]`);
							str += flatten(thing[i]);
							keys.pop();
						} else {
							str += HOLE;
						}
					}

					str += ']';

					break;

				case 'Set':
					str = '["Set"';

					for (const value of thing) {
						str += `,${flatten(value)}`;
					}

					str += ']';
					break;

				case 'Map':
					str = '["Map"';

					for (const [key, value] of thing) {
						keys.push(
							`.get(${is_primitive(key) ? stringify_primitive(key) : '...'})`
						);
						str += `,${flatten(key)},${flatten(value)}`;
						keys.pop();
					}

					str += ']';
					break;

				case 'Int8Array':
				case 'Uint8Array':
				case 'Uint8ClampedArray':
				case 'Int16Array':
				case 'Uint16Array':
				case 'Int32Array':
				case 'Uint32Array':
				case 'Float32Array':
				case 'Float64Array':
				case 'BigInt64Array':
				case 'BigUint64Array': {
					/** @type {import("./types.js").TypedArray} */
					const typedArray = thing;
					str = '["' + type + '",' + flatten(typedArray.buffer);

					const a = thing.byteOffset;
					const b = a + thing.byteLength;

					// handle subarrays
					if (a > 0 || b !== typedArray.buffer.byteLength) {
						const m = +/(\d+)/.exec(type)[1] / 8;
						str += `,${a / m},${b / m}`;
					}

					str += ']';
					break;
				}

				case 'ArrayBuffer': {
					/** @type {ArrayBuffer} */
					const arraybuffer = thing;
					const base64 = encode64(arraybuffer);

					str = `["ArrayBuffer","${base64}"]`;
					break;
				}

				case 'Temporal.Duration':
				case 'Temporal.Instant':
				case 'Temporal.PlainDate':
				case 'Temporal.PlainTime':
				case 'Temporal.PlainDateTime':
				case 'Temporal.PlainMonthDay':
				case 'Temporal.PlainYearMonth':
				case 'Temporal.ZonedDateTime':
					str = `["${type}",${stringify_string(thing.toString())}]`;
					break;

				default:
					if (!is_plain_object(thing)) {
						throw new DevalueError(
							`Cannot stringify arbitrary non-POJOs`,
							keys,
							thing,
							value
						);
					}

					if (enumerable_symbols(thing).length > 0) {
						throw new DevalueError(
							`Cannot stringify POJOs with symbolic keys`,
							keys,
							thing,
							value
						);
					}

					if (Object.getPrototypeOf(thing) === null) {
						str = '["null"';
						for (const key in thing) {
							keys.push(stringify_key(key));
							str += `,${stringify_string(key)},${flatten(thing[key])}`;
							keys.pop();
						}
						str += ']';
					} else {
						str = '{';
						let started = false;
						for (const key in thing) {
							if (started) str += ',';
							started = true;
							keys.push(stringify_key(key));
							str += `${stringify_string(key)}:${flatten(thing[key])}`;
							keys.pop();
						}
						str += '}';
					}
			}
		}

		stringified[index] = str;
		return index;
	}

	const index = flatten(value);

	// special case — value is represented as a negative index
	if (index < 0) return `${index}`;

	return `[${stringified.join(',')}]`;
}

/**
 * @param {any} thing
 * @returns {string}
 */
function stringify_primitive(thing) {
	const type = typeof thing;
	if (type === 'string') return stringify_string(thing);
	if (thing instanceof String) return stringify_string(thing.toString());
	if (thing === void 0) return UNDEFINED.toString();
	if (thing === 0 && 1 / thing < 0) return NEGATIVE_ZERO.toString();
	if (type === 'bigint') return `["BigInt","${thing}"]`;
	return String(thing);
}

function diff(obj1, obj2) {
  const h1 = _toHashedObject(obj1);
  const h2 = _toHashedObject(obj2);
  return _diff(h1, h2);
}
function _diff(h1, h2) {
  const diffs = [];
  const allProps = /* @__PURE__ */ new Set([
    ...Object.keys(h1.props || {}),
    ...Object.keys(h2.props || {})
  ]);
  if (h1.props && h2.props) {
    for (const prop of allProps) {
      const p1 = h1.props[prop];
      const p2 = h2.props[prop];
      if (p1 && p2) {
        diffs.push(..._diff(h1.props?.[prop], h2.props?.[prop]));
      } else if (p1 || p2) {
        diffs.push(
          new DiffEntry((p2 || p1).key, p1 ? "removed" : "added", p2, p1)
        );
      }
    }
  }
  if (allProps.size === 0 && h1.hash !== h2.hash) {
    diffs.push(new DiffEntry((h2 || h1).key, "changed", h2, h1));
  }
  return diffs;
}
function _toHashedObject(obj, key = "") {
  if (obj && typeof obj !== "object") {
    return new DiffHashedObject(key, obj, serialize(obj));
  }
  const props = {};
  const hashes = [];
  for (const _key in obj) {
    props[_key] = _toHashedObject(obj[_key], key ? `${key}.${_key}` : _key);
    hashes.push(props[_key].hash);
  }
  return new DiffHashedObject(key, obj, `{${hashes.join(":")}}`, props);
}
class DiffEntry {
  constructor(key, type, newValue, oldValue) {
    this.key = key;
    this.type = type;
    this.newValue = newValue;
    this.oldValue = oldValue;
  }
  toString() {
    return this.toJSON();
  }
  toJSON() {
    switch (this.type) {
      case "added": {
        return `Added   \`${this.key}\``;
      }
      case "removed": {
        return `Removed \`${this.key}\``;
      }
      case "changed": {
        return `Changed \`${this.key}\` from \`${this.oldValue?.toString() || "-"}\` to \`${this.newValue.toString()}\``;
      }
    }
  }
}
class DiffHashedObject {
  constructor(key, value, hash, props) {
    this.key = key;
    this.value = value;
    this.hash = hash;
    this.props = props;
  }
  toString() {
    if (this.props) {
      return `{${Object.keys(this.props).join(",")}}`;
    } else {
      return JSON.stringify(this.value);
    }
  }
  toJSON() {
    const k = this.key || ".";
    if (this.props) {
      return `${k}({${Object.keys(this.props).join(",")}})`;
    }
    return `${k}(${this.value})`;
  }
}

//#region src/index.ts
const DEBOUNCE_DEFAULTS = { trailing: true };
/**
Debounce functions
@param fn - Promise-returning/async function to debounce.
@param wait - Milliseconds to wait before calling `fn`. Default value is 25ms
@returns A function that delays calling `fn` until after `wait` milliseconds have elapsed since the last time it was called.
@example
```
import { debounce } from 'perfect-debounce';
const expensiveCall = async input => input;
const debouncedFn = debounce(expensiveCall, 200);
for (const number of [1, 2, 3]) {
console.log(await debouncedFn(number));
}
//=> 1
//=> 2
//=> 3
```
*/
function debounce(fn, wait = 25, options = {}) {
	options = {
		...DEBOUNCE_DEFAULTS,
		...options
	};
	if (!Number.isFinite(wait)) throw new TypeError("Expected `wait` to be a finite number");
	let leadingValue;
	let timeout;
	let resolveList = [];
	let currentPromise;
	let trailingArgs;
	const applyFn = (_this, args) => {
		currentPromise = _applyPromised(fn, _this, args);
		currentPromise.finally(() => {
			currentPromise = null;
			if (options.trailing && trailingArgs && !timeout) {
				const promise = applyFn(_this, trailingArgs);
				trailingArgs = null;
				return promise;
			}
		});
		return currentPromise;
	};
	const debounced = function(...args) {
		if (options.trailing) trailingArgs = args;
		if (currentPromise) return currentPromise;
		return new Promise((resolve) => {
			const shouldCallNow = !timeout && options.leading;
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				timeout = null;
				const promise = options.leading ? leadingValue : applyFn(this, args);
				trailingArgs = null;
				for (const _resolve of resolveList) _resolve(promise);
				resolveList = [];
			}, wait);
			if (shouldCallNow) {
				leadingValue = applyFn(this, args);
				resolve(leadingValue);
			} else resolveList.push(resolve);
		});
	};
	const _clearTimeout = (timer) => {
		if (timer) {
			clearTimeout(timer);
			timeout = null;
		}
	};
	debounced.isPending = () => !!timeout;
	debounced.cancel = () => {
		_clearTimeout(timeout);
		resolveList = [];
		trailingArgs = null;
	};
	debounced.flush = () => {
		_clearTimeout(timeout);
		if (!trailingArgs || currentPromise) return;
		const args = trailingArgs;
		trailingArgs = null;
		return applyFn(this, args);
	};
	return debounced;
}
async function _applyPromised(fn, _this, args) {
	return await fn.apply(_this, args);
}

if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch$1.create({
    baseURL: baseURL()
  });
}
if (!("global" in globalThis)) {
  globalThis.global = globalThis;
}
const appLayoutTransition = {};
const nuxtLinkDefaults = { "componentName": "NuxtLink" };
const asyncDataDefaults = { "deep": false };
const appId = "nuxt-app";
function getNuxtAppCtx(id = appId) {
  return getContext(id, {
    asyncContext: false
  });
}
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  let hydratingCount = 0;
  const nuxtApp = {
    _id: options.id || appId || "nuxt-app",
    _scope: effectScope(),
    provide: void 0,
    versions: {
      get nuxt() {
        return "4.3.1";
      },
      get vue() {
        return nuxtApp.vueApp.version;
      }
    },
    payload: shallowReactive({
      ...options.ssrContext?.payload || {},
      data: shallowReactive({}),
      state: reactive({}),
      once: /* @__PURE__ */ new Set(),
      _errors: shallowReactive({})
    }),
    static: {
      data: {}
    },
    runWithContext(fn) {
      if (nuxtApp._scope.active && !getCurrentScope()) {
        return nuxtApp._scope.run(() => callWithNuxt(nuxtApp, fn));
      }
      return callWithNuxt(nuxtApp, fn);
    },
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: shallowReactive({}),
    _payloadRevivers: {},
    ...options
  };
  {
    nuxtApp.payload.serverRendered = true;
  }
  if (nuxtApp.ssrContext) {
    nuxtApp.payload.path = nuxtApp.ssrContext.url;
    nuxtApp.ssrContext.nuxt = nuxtApp;
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.ssrContext.config = {
      public: nuxtApp.ssrContext.runtimeConfig.public,
      app: nuxtApp.ssrContext.runtimeConfig.app
    };
  }
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  {
    const contextCaller = async function(hooks, args) {
      for (const hook of hooks) {
        await nuxtApp.runWithContext(() => hook(...args));
      }
    };
    nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, ...args);
  }
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  const runtimeConfig = options.ssrContext.runtimeConfig;
  nuxtApp.provide("config", runtimeConfig);
  return nuxtApp;
}
function registerPluginHooks(nuxtApp, plugin2) {
  if (plugin2.hooks) {
    nuxtApp.hooks.addHooks(plugin2.hooks);
  }
}
async function applyPlugin(nuxtApp, plugin2) {
  if (typeof plugin2 === "function") {
    const { provide: provide2 } = await nuxtApp.runWithContext(() => plugin2(nuxtApp)) || {};
    if (provide2 && typeof provide2 === "object") {
      for (const key in provide2) {
        nuxtApp.provide(key, provide2[key]);
      }
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  const resolvedPlugins = /* @__PURE__ */ new Set();
  const unresolvedPlugins = [];
  const parallels = [];
  let error = void 0;
  let promiseDepth = 0;
  async function executePlugin(plugin2) {
    const unresolvedPluginsForThisPlugin = plugin2.dependsOn?.filter((name) => plugins2.some((p) => p._name === name) && !resolvedPlugins.has(name)) ?? [];
    if (unresolvedPluginsForThisPlugin.length > 0) {
      unresolvedPlugins.push([new Set(unresolvedPluginsForThisPlugin), plugin2]);
    } else {
      const promise = applyPlugin(nuxtApp, plugin2).then(async () => {
        if (plugin2._name) {
          resolvedPlugins.add(plugin2._name);
          await Promise.all(unresolvedPlugins.map(async ([dependsOn, unexecutedPlugin]) => {
            if (dependsOn.has(plugin2._name)) {
              dependsOn.delete(plugin2._name);
              if (dependsOn.size === 0) {
                promiseDepth++;
                await executePlugin(unexecutedPlugin);
              }
            }
          }));
        }
      }).catch((e) => {
        if (!plugin2.parallel && !nuxtApp.payload.error) {
          throw e;
        }
        error ||= e;
      });
      if (plugin2.parallel) {
        parallels.push(promise);
      } else {
        await promise;
      }
    }
  }
  for (const plugin2 of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin2.env?.islands === false) {
      continue;
    }
    registerPluginHooks(nuxtApp, plugin2);
  }
  for (const plugin2 of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin2.env?.islands === false) {
      continue;
    }
    await executePlugin(plugin2);
  }
  await Promise.all(parallels);
  if (promiseDepth) {
    for (let i = 0; i < promiseDepth; i++) {
      await Promise.all(parallels);
    }
  }
  if (error) {
    throw nuxtApp.payload.error || error;
  }
}
// @__NO_SIDE_EFFECTS__
function defineNuxtPlugin(plugin2) {
  if (typeof plugin2 === "function") {
    return plugin2;
  }
  const _name = plugin2._name || plugin2.name;
  delete plugin2.name;
  return Object.assign(plugin2.setup || (() => {
  }), plugin2, { [NuxtPluginIndicator]: true, _name });
}
const definePayloadPlugin = defineNuxtPlugin;
function callWithNuxt(nuxt, setup, args) {
  const fn = () => setup();
  const nuxtAppCtx = getNuxtAppCtx(nuxt._id);
  {
    return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
  }
}
function tryUseNuxtApp(id) {
  let nuxtAppInstance;
  if (hasInjectionContext()) {
    nuxtAppInstance = getCurrentInstance()?.appContext.app.$nuxt;
  }
  nuxtAppInstance ||= getNuxtAppCtx(id).tryUse();
  return nuxtAppInstance || null;
}
function useNuxtApp(id) {
  const nuxtAppInstance = tryUseNuxtApp(id);
  if (!nuxtAppInstance) {
    {
      throw new Error("[nuxt] instance unavailable");
    }
  }
  return nuxtAppInstance;
}
// @__NO_SIDE_EFFECTS__
function useRuntimeConfig(_event) {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
const LayoutMetaSymbol = /* @__PURE__ */ Symbol("layout-meta");
const PageRouteSymbol = /* @__PURE__ */ Symbol("route");
globalThis._importMeta_.url.replace(/\/app\/.*$/, "/");
const useRouter = () => {
  return useNuxtApp()?.$router;
};
const useRoute = () => {
  if (hasInjectionContext()) {
    return inject(PageRouteSymbol, useNuxtApp()._route);
  }
  return useNuxtApp()._route;
};
// @__NO_SIDE_EFFECTS__
function defineNuxtRouteMiddleware(middleware) {
  return middleware;
}
const isProcessingMiddleware = () => {
  try {
    if (useNuxtApp()._processingMiddleware) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
};
const URL_QUOTE_RE = /"/g;
const navigateTo = (to, options) => {
  to ||= "/";
  const toPath = typeof to === "string" ? to : "path" in to ? resolveRouteObject(to) : useRouter().resolve(to).href;
  const isExternalHost = hasProtocol(toPath, { acceptRelative: true });
  const isExternal = options?.external || isExternalHost;
  if (isExternal) {
    if (!options?.external) {
      throw new Error("Navigating to an external URL is not allowed by default. Use `navigateTo(url, { external: true })`.");
    }
    const { protocol } = new URL(toPath, "http://localhost");
    if (protocol && isScriptProtocol(protocol)) {
      throw new Error(`Cannot navigate to a URL with '${protocol}' protocol.`);
    }
  }
  const inMiddleware = isProcessingMiddleware();
  const router = useRouter();
  const nuxtApp = useNuxtApp();
  {
    if (nuxtApp.ssrContext) {
      const fullPath = typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
      const location2 = isExternal ? toPath : joinURL((/* @__PURE__ */ useRuntimeConfig()).app.baseURL, fullPath);
      const redirect = async function(response) {
        await nuxtApp.callHook("app:redirected");
        const encodedLoc = location2.replace(URL_QUOTE_RE, "%22");
        const encodedHeader = encodeURL(location2, isExternalHost);
        nuxtApp.ssrContext["~renderResponse"] = {
          statusCode: sanitizeStatusCode(options?.redirectCode || 302, 302),
          body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`,
          headers: { location: encodedHeader }
        };
        return response;
      };
      if (!isExternal && inMiddleware) {
        router.afterEach((final) => final.fullPath === fullPath ? redirect(false) : void 0);
        return to;
      }
      return redirect(!inMiddleware ? void 0 : (
        /* abort route navigation */
        false
      ));
    }
  }
  if (isExternal) {
    nuxtApp._scope.stop();
    if (options?.replace) {
      (void 0).replace(toPath);
    } else {
      (void 0).href = toPath;
    }
    if (inMiddleware) {
      if (!nuxtApp.isHydrating) {
        return false;
      }
      return new Promise(() => {
      });
    }
    return Promise.resolve();
  }
  const encodedTo = typeof to === "string" ? encodeRoutePath(to) : to;
  return options?.replace ? router.replace(encodedTo) : router.push(encodedTo);
};
function resolveRouteObject(to) {
  return withQuery(to.path || "", to.query || {}) + (to.hash || "");
}
function encodeURL(location2, isExternalHost = false) {
  const url = new URL(location2, "http://localhost");
  if (!isExternalHost) {
    return url.pathname + url.search + url.hash;
  }
  if (location2.startsWith("//")) {
    return url.toString().replace(url.protocol, "");
  }
  return url.toString();
}
function encodeRoutePath(url) {
  const parsed = parseURL(url);
  return encodePath(decodePath(parsed.pathname)) + parsed.search + parsed.hash;
}
const NUXT_ERROR_SIGNATURE = "__nuxt_error";
const useError = /* @__NO_SIDE_EFFECTS__ */ () => toRef(useNuxtApp().payload, "error");
const showError = (error) => {
  const nuxtError = createError(error);
  try {
    const error2 = /* @__PURE__ */ useError();
    if (false) ;
    error2.value ||= nuxtError;
  } catch {
    throw nuxtError;
  }
  return nuxtError;
};
const clearError = async (options = {}) => {
  const nuxtApp = useNuxtApp();
  const error = /* @__PURE__ */ useError();
  nuxtApp.callHook("app:error:cleared", options);
  if (options.redirect) {
    await useRouter().replace(options.redirect);
  }
  error.value = void 0;
};
const isNuxtError = (error) => !!error && typeof error === "object" && NUXT_ERROR_SIGNATURE in error;
const createError = (error) => {
  if (typeof error !== "string" && error.statusText) {
    error.message ??= error.statusText;
  }
  const nuxtError = createError$1(error);
  Object.defineProperty(nuxtError, NUXT_ERROR_SIGNATURE, {
    value: true,
    configurable: false,
    writable: false
  });
  Object.defineProperty(nuxtError, "status", {
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    get: () => nuxtError.statusCode,
    configurable: true
  });
  Object.defineProperty(nuxtError, "statusText", {
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    get: () => nuxtError.statusMessage,
    configurable: true
  });
  return nuxtError;
};
function injectHead(nuxtApp) {
  const nuxt = nuxtApp || useNuxtApp();
  return nuxt.ssrContext?.head || nuxt.runWithContext(() => {
    if (hasInjectionContext()) {
      const head = inject(headSymbol);
      if (!head) {
        throw new Error("[nuxt] [unhead] Missing Unhead instance.");
      }
      return head;
    }
  });
}
function useHead(input, options = {}) {
  const head = options.head || injectHead(options.nuxt);
  return useHead$1(input, { head, ...options });
}
function useSeoMeta(input, options = {}) {
  const head = options.head || injectHead(options.nuxt);
  return useSeoMeta$1(input, { head, ...options });
}
const matcher = /* @__PURE__ */ (() => {
  const $0 = { redirect: "/gallery" }, $1 = {};
  return (m, p) => {
    let r = [];
    if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
    if (p === "/products/gallery") {
      r.unshift({ data: $0 });
    }
    if (p === "/__sitemap__/style.xsl") {
      r.unshift({ data: $1 });
    }
    if (p === "/sitemap.xml") {
      r.unshift({ data: $1 });
    }
    if (p === "/_nuxt") {
      r.unshift({ data: $1 });
    }
    let s = p.split("/");
    s.length - 1;
    if (s[1] === "auth") {
      r.unshift({ data: $1, params: { "_": s.slice(2).join("/") } });
    }
    if (s[1] === "dashboard") {
      r.unshift({ data: $1, params: { "_": s.slice(2).join("/") } });
    }
    if (s[1] === "onboarding") {
      r.unshift({ data: $1, params: { "_": s.slice(2).join("/") } });
    }
    return r;
  };
})();
const _routeRulesMatcher = (path) => defu({}, ...matcher("", path).map((r) => r.data).reverse());
const routeRulesMatcher$1 = _routeRulesMatcher;
function getRouteRules(arg) {
  const path = typeof arg === "string" ? arg : arg.path;
  try {
    return routeRulesMatcher$1(path);
  } catch (e) {
    console.error("[nuxt] Error matching route rules.", e);
    return {};
  }
}
function definePayloadReducer(name, reduce) {
  {
    useNuxtApp().ssrContext["~payloadReducers"][name] = reduce;
  }
}
const payloadPlugin = definePayloadPlugin(() => {
  definePayloadReducer(
    "skipHydrate",
    // We need to return something truthy to be treated as a match
    (data) => !shouldHydrate(data) && 1
  );
});
const __nuxt_component_2$1 = defineComponent({
  name: "ServerPlaceholder",
  render() {
    return createElementBlock("div");
  }
});
const _wrapInTransition = (props, children) => {
  return { default: () => children.default?.() };
};
const ROUTE_KEY_PARENTHESES_RE = /(:\w+)\([^)]+\)/g;
const ROUTE_KEY_SYMBOLS_RE = /(:\w+)[?+*]/g;
const ROUTE_KEY_NORMAL_RE = /:\w+/g;
function generateRouteKey(route) {
  const source = route?.meta.key ?? route.path.replace(ROUTE_KEY_PARENTHESES_RE, "$1").replace(ROUTE_KEY_SYMBOLS_RE, "$1").replace(ROUTE_KEY_NORMAL_RE, (r) => route.params[r.slice(1)]?.toString() || "");
  return typeof source === "function" ? source(route) : source;
}
function isChangingPage(to, from) {
  if (to === from || from === START_LOCATION) {
    return false;
  }
  if (generateRouteKey(to) !== generateRouteKey(from)) {
    return true;
  }
  const areComponentsSame = to.matched.every(
    (comp, index2) => comp.components && comp.components.default === from.matched[index2]?.components?.default
  );
  if (areComponentsSame) {
    return false;
  }
  return true;
}
const clientOnlySymbol = /* @__PURE__ */ Symbol.for("nuxt:client-only");
const __nuxt_component_2 = defineComponent({
  name: "ClientOnly",
  inheritAttrs: false,
  props: ["fallback", "placeholder", "placeholderTag", "fallbackTag"],
  ...false,
  setup(props, { slots, attrs }) {
    const mounted = shallowRef(false);
    const vm = getCurrentInstance();
    if (vm) {
      vm._nuxtClientOnly = true;
    }
    provide(clientOnlySymbol, true);
    return () => {
      if (mounted.value) {
        const vnodes = slots.default?.();
        if (vnodes && vnodes.length === 1) {
          return [cloneVNode(vnodes[0], attrs)];
        }
        return vnodes;
      }
      const slot = slots.fallback || slots.placeholder;
      if (slot) {
        return h(slot);
      }
      const fallbackStr = props.fallback || props.placeholder || "";
      const fallbackTag = props.fallbackTag || props.placeholderTag || "span";
      return createElementBlock(fallbackTag, attrs, fallbackStr);
    };
  }
});
function useAsyncData(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (_isAutoKeyNeeded(args[0], args[1])) {
    args.unshift(autoKey);
  }
  let [_key, _handler, options = {}] = args;
  const key = computed(() => toValue(_key));
  if (typeof key.value !== "string") {
    throw new TypeError("[nuxt] [useAsyncData] key must be a string.");
  }
  if (typeof _handler !== "function") {
    throw new TypeError("[nuxt] [useAsyncData] handler must be a function.");
  }
  const nuxtApp = useNuxtApp();
  options.server ??= true;
  options.default ??= getDefault;
  options.getCachedData ??= getDefaultCachedData;
  options.lazy ??= false;
  options.immediate ??= true;
  options.deep ??= asyncDataDefaults.deep;
  options.dedupe ??= "cancel";
  options._functionName || "useAsyncData";
  nuxtApp._asyncData[key.value];
  function createInitialFetch() {
    const initialFetchOptions = { cause: "initial", dedupe: options.dedupe };
    if (!nuxtApp._asyncData[key.value]?._init) {
      initialFetchOptions.cachedData = options.getCachedData(key.value, nuxtApp, { cause: "initial" });
      nuxtApp._asyncData[key.value] = createAsyncData(nuxtApp, key.value, _handler, options, initialFetchOptions.cachedData);
    }
    return () => nuxtApp._asyncData[key.value].execute(initialFetchOptions);
  }
  const initialFetch = createInitialFetch();
  const asyncData = nuxtApp._asyncData[key.value];
  asyncData._deps++;
  const fetchOnServer = options.server !== false && nuxtApp.payload.serverRendered;
  if (fetchOnServer && options.immediate) {
    const promise = initialFetch();
    if (getCurrentInstance()) {
      onServerPrefetch(() => promise);
    } else {
      nuxtApp.hook("app:created", async () => {
        await promise;
      });
    }
  }
  const asyncReturn = {
    data: writableComputedRef(() => nuxtApp._asyncData[key.value]?.data),
    pending: writableComputedRef(() => nuxtApp._asyncData[key.value]?.pending),
    status: writableComputedRef(() => nuxtApp._asyncData[key.value]?.status),
    error: writableComputedRef(() => nuxtApp._asyncData[key.value]?.error),
    refresh: (...args2) => {
      if (!nuxtApp._asyncData[key.value]?._init) {
        const initialFetch2 = createInitialFetch();
        return initialFetch2();
      }
      return nuxtApp._asyncData[key.value].execute(...args2);
    },
    execute: (...args2) => asyncReturn.refresh(...args2),
    clear: () => {
      const entry2 = nuxtApp._asyncData[key.value];
      if (entry2?._abortController) {
        try {
          entry2._abortController.abort(new DOMException("AsyncData aborted by user.", "AbortError"));
        } finally {
          entry2._abortController = void 0;
        }
      }
      clearNuxtDataByKey(nuxtApp, key.value);
    }
  };
  const asyncDataPromise = Promise.resolve(nuxtApp._asyncDataPromises[key.value]).then(() => asyncReturn);
  Object.assign(asyncDataPromise, asyncReturn);
  return asyncDataPromise;
}
function writableComputedRef(getter) {
  return computed({
    get() {
      return getter()?.value;
    },
    set(value) {
      const ref2 = getter();
      if (ref2) {
        ref2.value = value;
      }
    }
  });
}
function _isAutoKeyNeeded(keyOrFetcher, fetcher) {
  if (typeof keyOrFetcher === "string") {
    return false;
  }
  if (typeof keyOrFetcher === "object" && keyOrFetcher !== null) {
    return false;
  }
  if (typeof keyOrFetcher === "function" && typeof fetcher === "function") {
    return false;
  }
  return true;
}
function clearNuxtDataByKey(nuxtApp, key) {
  if (key in nuxtApp.payload.data) {
    nuxtApp.payload.data[key] = void 0;
  }
  if (key in nuxtApp.payload._errors) {
    nuxtApp.payload._errors[key] = void 0;
  }
  if (nuxtApp._asyncData[key]) {
    nuxtApp._asyncData[key].data.value = unref(nuxtApp._asyncData[key]._default());
    nuxtApp._asyncData[key].error.value = void 0;
    nuxtApp._asyncData[key].status.value = "idle";
  }
  if (key in nuxtApp._asyncDataPromises) {
    nuxtApp._asyncDataPromises[key] = void 0;
  }
}
function pick(obj, keys) {
  const newObj = {};
  for (const key of keys) {
    newObj[key] = obj[key];
  }
  return newObj;
}
function createAsyncData(nuxtApp, key, _handler, options, initialCachedData) {
  nuxtApp.payload._errors[key] ??= void 0;
  const hasCustomGetCachedData = options.getCachedData !== getDefaultCachedData;
  const handler = _handler ;
  const _ref = options.deep ? ref : shallowRef;
  const hasCachedData = initialCachedData !== void 0;
  const unsubRefreshAsyncData = nuxtApp.hook("app:data:refresh", async (keys) => {
    if (!keys || keys.includes(key)) {
      await asyncData.execute({ cause: "refresh:hook" });
    }
  });
  const asyncData = {
    data: _ref(hasCachedData ? initialCachedData : options.default()),
    pending: computed(() => asyncData.status.value === "pending"),
    error: toRef(nuxtApp.payload._errors, key),
    status: shallowRef("idle"),
    execute: (...args) => {
      const [_opts, newValue = void 0] = args;
      const opts = _opts && newValue === void 0 && typeof _opts === "object" ? _opts : {};
      if (nuxtApp._asyncDataPromises[key]) {
        if ((opts.dedupe ?? options.dedupe) === "defer") {
          return nuxtApp._asyncDataPromises[key];
        }
      }
      {
        const cachedData = "cachedData" in opts ? opts.cachedData : options.getCachedData(key, nuxtApp, { cause: opts.cause ?? "refresh:manual" });
        if (cachedData !== void 0) {
          nuxtApp.payload.data[key] = asyncData.data.value = cachedData;
          asyncData.error.value = void 0;
          asyncData.status.value = "success";
          return Promise.resolve(cachedData);
        }
      }
      if (asyncData._abortController) {
        asyncData._abortController.abort(new DOMException("AsyncData request cancelled by deduplication", "AbortError"));
      }
      asyncData._abortController = new AbortController();
      asyncData.status.value = "pending";
      const cleanupController = new AbortController();
      const promise = new Promise(
        (resolve, reject) => {
          try {
            const timeout = opts.timeout ?? options.timeout;
            const mergedSignal = mergeAbortSignals([asyncData._abortController?.signal, opts?.signal], cleanupController.signal, timeout);
            if (mergedSignal.aborted) {
              const reason = mergedSignal.reason;
              reject(reason instanceof Error ? reason : new DOMException(String(reason ?? "Aborted"), "AbortError"));
              return;
            }
            mergedSignal.addEventListener("abort", () => {
              const reason = mergedSignal.reason;
              reject(reason instanceof Error ? reason : new DOMException(String(reason ?? "Aborted"), "AbortError"));
            }, { once: true, signal: cleanupController.signal });
            return Promise.resolve(handler(nuxtApp, { signal: mergedSignal })).then(resolve, reject);
          } catch (err) {
            reject(err);
          }
        }
      ).then(async (_result) => {
        let result = _result;
        if (options.transform) {
          result = await options.transform(_result);
        }
        if (options.pick) {
          result = pick(result, options.pick);
        }
        nuxtApp.payload.data[key] = result;
        asyncData.data.value = result;
        asyncData.error.value = void 0;
        asyncData.status.value = "success";
      }).catch((error) => {
        if (nuxtApp._asyncDataPromises[key] && nuxtApp._asyncDataPromises[key] !== promise) {
          return nuxtApp._asyncDataPromises[key];
        }
        if (asyncData._abortController?.signal.aborted) {
          return nuxtApp._asyncDataPromises[key];
        }
        if (typeof DOMException !== "undefined" && error instanceof DOMException && error.name === "AbortError") {
          asyncData.status.value = "idle";
          return nuxtApp._asyncDataPromises[key];
        }
        asyncData.error.value = createError(error);
        asyncData.data.value = unref(options.default());
        asyncData.status.value = "error";
      }).finally(() => {
        cleanupController.abort();
        delete nuxtApp._asyncDataPromises[key];
      });
      nuxtApp._asyncDataPromises[key] = promise;
      return nuxtApp._asyncDataPromises[key];
    },
    _execute: debounce((...args) => asyncData.execute(...args), 0, { leading: true }),
    _default: options.default,
    _deps: 0,
    _init: true,
    _hash: void 0,
    _off: () => {
      unsubRefreshAsyncData();
      if (nuxtApp._asyncData[key]?._init) {
        nuxtApp._asyncData[key]._init = false;
      }
      if (!hasCustomGetCachedData) {
        nextTick(() => {
          if (!nuxtApp._asyncData[key]?._init) {
            clearNuxtDataByKey(nuxtApp, key);
            asyncData.execute = () => Promise.resolve();
          }
        });
      }
    }
  };
  return asyncData;
}
const getDefault = () => void 0;
const getDefaultCachedData = (key, nuxtApp, ctx) => {
  if (nuxtApp.isHydrating) {
    return nuxtApp.payload.data[key];
  }
  if (ctx.cause !== "refresh:manual" && ctx.cause !== "refresh:hook") {
    return nuxtApp.static.data[key];
  }
};
function mergeAbortSignals(signals, cleanupSignal, timeout) {
  const list = signals.filter((s) => !!s);
  if (typeof timeout === "number" && timeout >= 0) {
    const timeoutSignal = AbortSignal.timeout?.(timeout);
    if (timeoutSignal) {
      list.push(timeoutSignal);
    }
  }
  if (AbortSignal.any) {
    return AbortSignal.any(list);
  }
  const controller = new AbortController();
  for (const sig of list) {
    if (sig.aborted) {
      const reason = sig.reason ?? new DOMException("Aborted", "AbortError");
      try {
        controller.abort(reason);
      } catch {
        controller.abort();
      }
      return controller.signal;
    }
  }
  const onAbort = () => {
    const abortedSignal = list.find((s) => s.aborted);
    const reason = abortedSignal?.reason ?? new DOMException("Aborted", "AbortError");
    try {
      controller.abort(reason);
    } catch {
      controller.abort();
    }
  };
  for (const sig of list) {
    sig.addEventListener?.("abort", onAbort, { once: true, signal: cleanupSignal });
  }
  return controller.signal;
}
const useStateKeyPrefix = "$s";
function useState(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  const [_key, init] = args;
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useState] key must be a string: " + _key);
  }
  if (init !== void 0 && typeof init !== "function") {
    throw new Error("[nuxt] [useState] init must be a function: " + init);
  }
  const key = useStateKeyPrefix + _key;
  const nuxtApp = useNuxtApp();
  const state = toRef(nuxtApp.payload.state, key);
  if (state.value === void 0 && init) {
    const initialValue = init();
    if (isRef(initialValue)) {
      nuxtApp.payload.state[key] = initialValue;
      return initialValue;
    }
    state.value = initialValue;
  }
  return state;
}
function useRequestEvent(nuxtApp) {
  nuxtApp ||= useNuxtApp();
  return nuxtApp.ssrContext?.event;
}
const CookieDefaults = {
  path: "/",
  watch: true,
  decode: (val) => {
    const decoded = decodeURIComponent(val);
    const parsed = destr(decoded);
    if (typeof parsed === "number" && (!Number.isFinite(parsed) || String(parsed) !== decoded)) {
      return decoded;
    }
    return parsed;
  },
  encode: (val) => encodeURIComponent(typeof val === "string" ? val : JSON.stringify(val))
};
function useCookie(name, _opts) {
  const opts = { ...CookieDefaults, ..._opts };
  opts.filter ??= (key) => key === name;
  const cookies = readRawCookies(opts) || {};
  let delay;
  if (opts.maxAge !== void 0) {
    delay = opts.maxAge * 1e3;
  } else if (opts.expires) {
    delay = opts.expires.getTime() - Date.now();
  }
  const hasExpired = delay !== void 0 && delay <= 0;
  const cookieValue = klona(hasExpired ? void 0 : cookies[name] ?? opts.default?.());
  const cookie = ref(cookieValue);
  {
    const nuxtApp = useNuxtApp();
    const writeFinalCookieValue = () => {
      if (opts.readonly || isEqual(cookie.value, cookies[name])) {
        return;
      }
      nuxtApp._cookies ||= {};
      if (name in nuxtApp._cookies) {
        if (isEqual(cookie.value, nuxtApp._cookies[name])) {
          return;
        }
      }
      nuxtApp._cookies[name] = cookie.value;
      writeServerCookie(useRequestEvent(nuxtApp), name, cookie.value, opts);
    };
    const unhook = nuxtApp.hooks.hookOnce("app:rendered", writeFinalCookieValue);
    nuxtApp.hooks.hookOnce("app:error", () => {
      unhook();
      return writeFinalCookieValue();
    });
  }
  return cookie;
}
function readRawCookies(opts = {}) {
  {
    return parse$1(getRequestHeader(useRequestEvent(), "cookie") || "", opts);
  }
}
function writeServerCookie(event, name, value, opts = {}) {
  if (event) {
    if (value !== null && value !== void 0) {
      return setCookie$1(event, name, value, opts);
    }
    if (getCookie(event, name) !== void 0) {
      return deleteCookie(event, name, opts);
    }
  }
}
const routerOptions0 = {
  scrollBehavior(to, from, savedPosition) {
    const nuxtApp = useNuxtApp();
    const hashScrollBehaviour = useRouter().options?.scrollBehaviorType ?? "auto";
    if (to.path.replace(/\/$/, "") === from.path.replace(/\/$/, "")) {
      if (from.hash && !to.hash) {
        return { left: 0, top: 0 };
      }
      if (to.hash) {
        return { el: to.hash, top: _getHashElementScrollMarginTop(to.hash), behavior: hashScrollBehaviour };
      }
      return false;
    }
    const routeAllowsScrollToTop = typeof to.meta.scrollToTop === "function" ? to.meta.scrollToTop(to, from) : to.meta.scrollToTop;
    if (routeAllowsScrollToTop === false) {
      return false;
    }
    const hookToWait = nuxtApp._runningTransition ? "page:transition:finish" : "page:loading:end";
    return new Promise((resolve) => {
      if (from === START_LOCATION) {
        resolve(_calculatePosition(to, from, savedPosition, hashScrollBehaviour));
        return;
      }
      nuxtApp.hooks.hookOnce(hookToWait, () => {
        requestAnimationFrame(() => resolve(_calculatePosition(to, from, savedPosition, hashScrollBehaviour)));
      });
    });
  }
};
function _getHashElementScrollMarginTop(selector) {
  try {
    const elem = (void 0).querySelector(selector);
    if (elem) {
      return (Number.parseFloat(getComputedStyle(elem).scrollMarginTop) || 0) + (Number.parseFloat(getComputedStyle((void 0).documentElement).scrollPaddingTop) || 0);
    }
  } catch {
  }
  return 0;
}
function _calculatePosition(to, from, savedPosition, defaultHashScrollBehaviour) {
  if (savedPosition) {
    return savedPosition;
  }
  const isPageNavigation = isChangingPage(to, from);
  if (to.hash) {
    return {
      el: to.hash,
      top: _getHashElementScrollMarginTop(to.hash),
      behavior: isPageNavigation ? defaultHashScrollBehaviour : "instant"
    };
  }
  return {
    left: 0,
    top: 0
  };
}
const configRouterOptions = {
  hashMode: false,
  scrollBehaviorType: "auto"
};
const routerOptions = {
  ...configRouterOptions,
  ...routerOptions0
};
const firstNonUndefined = (...args) => args.find((arg) => arg !== void 0);
// @__NO_SIDE_EFFECTS__
function defineNuxtLink(options) {
  const componentName = options.componentName || "NuxtLink";
  function isHashLinkWithoutHashMode(link) {
    return typeof link === "string" && link.startsWith("#");
  }
  function resolveTrailingSlashBehavior(to, resolve, trailingSlash) {
    const effectiveTrailingSlash = trailingSlash ?? options.trailingSlash;
    if (!to || effectiveTrailingSlash !== "append" && effectiveTrailingSlash !== "remove") {
      return to;
    }
    if (typeof to === "string") {
      return applyTrailingSlashBehavior(to, effectiveTrailingSlash);
    }
    const path = "path" in to && to.path !== void 0 ? to.path : resolve(to).path;
    const resolvedPath = {
      ...to,
      name: void 0,
      // named routes would otherwise always override trailing slash behavior
      path: applyTrailingSlashBehavior(path, effectiveTrailingSlash)
    };
    return resolvedPath;
  }
  function useNuxtLink(props) {
    const router = useRouter();
    const config = /* @__PURE__ */ useRuntimeConfig();
    const hasTarget = computed(() => !!props.target && props.target !== "_self");
    const isAbsoluteUrl = computed(() => {
      const path = props.to || props.href || "";
      return typeof path === "string" && hasProtocol(path, { acceptRelative: true });
    });
    const builtinRouterLink = resolveComponent("RouterLink");
    const useBuiltinLink = builtinRouterLink && typeof builtinRouterLink !== "string" ? builtinRouterLink.useLink : void 0;
    const isExternal = computed(() => {
      if (props.external) {
        return true;
      }
      const path = props.to || props.href || "";
      if (typeof path === "object") {
        return false;
      }
      return path === "" || isAbsoluteUrl.value;
    });
    const to = computed(() => {
      const path = props.to || props.href || "";
      if (isExternal.value) {
        return path;
      }
      return resolveTrailingSlashBehavior(path, router.resolve, props.trailingSlash);
    });
    const link = isExternal.value ? void 0 : useBuiltinLink?.({ ...props, to });
    const href = computed(() => {
      const effectiveTrailingSlash = props.trailingSlash ?? options.trailingSlash;
      if (!to.value || isAbsoluteUrl.value || isHashLinkWithoutHashMode(to.value)) {
        return to.value;
      }
      if (isExternal.value) {
        const path = typeof to.value === "object" && "path" in to.value ? resolveRouteObject(to.value) : to.value;
        const href2 = typeof path === "object" ? router.resolve(path).href : path;
        return applyTrailingSlashBehavior(href2, effectiveTrailingSlash);
      }
      if (typeof to.value === "object") {
        return router.resolve(to.value)?.href ?? null;
      }
      return applyTrailingSlashBehavior(joinURL(config.app.baseURL, to.value), effectiveTrailingSlash);
    });
    return {
      to,
      hasTarget,
      isAbsoluteUrl,
      isExternal,
      //
      href,
      isActive: link?.isActive ?? computed(() => to.value === router.currentRoute.value.path),
      isExactActive: link?.isExactActive ?? computed(() => to.value === router.currentRoute.value.path),
      route: link?.route ?? computed(() => router.resolve(to.value)),
      async navigate(_e) {
        await navigateTo(href.value, { replace: props.replace, external: isExternal.value || hasTarget.value });
      }
    };
  }
  return defineComponent({
    name: componentName,
    props: {
      // Routing
      to: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      href: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      // Attributes
      target: {
        type: String,
        default: void 0,
        required: false
      },
      rel: {
        type: String,
        default: void 0,
        required: false
      },
      noRel: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Prefetching
      prefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      prefetchOn: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      noPrefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Styling
      activeClass: {
        type: String,
        default: void 0,
        required: false
      },
      exactActiveClass: {
        type: String,
        default: void 0,
        required: false
      },
      prefetchedClass: {
        type: String,
        default: void 0,
        required: false
      },
      // Vue Router's `<RouterLink>` additional props
      replace: {
        type: Boolean,
        default: void 0,
        required: false
      },
      ariaCurrentValue: {
        type: String,
        default: void 0,
        required: false
      },
      // Edge cases handling
      external: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Slot API
      custom: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Behavior
      trailingSlash: {
        type: String,
        default: void 0,
        required: false
      }
    },
    useLink: useNuxtLink,
    setup(props, { slots }) {
      const router = useRouter();
      const { to, href, navigate, isExternal, hasTarget, isAbsoluteUrl } = useNuxtLink(props);
      shallowRef(false);
      const el = void 0;
      const elRef = void 0;
      async function prefetch(nuxtApp = useNuxtApp()) {
        {
          return;
        }
      }
      return () => {
        if (!isExternal.value && !hasTarget.value && !isHashLinkWithoutHashMode(to.value)) {
          const routerLinkProps = {
            ref: elRef,
            to: to.value,
            activeClass: props.activeClass || options.activeClass,
            exactActiveClass: props.exactActiveClass || options.exactActiveClass,
            replace: props.replace,
            ariaCurrentValue: props.ariaCurrentValue,
            custom: props.custom
          };
          if (!props.custom) {
            routerLinkProps.rel = props.rel || void 0;
          }
          return h(
            resolveComponent("RouterLink"),
            routerLinkProps,
            slots.default
          );
        }
        const target = props.target || null;
        const rel = firstNonUndefined(
          // converts `""` to `null` to prevent the attribute from being added as empty (`rel=""`)
          props.noRel ? "" : props.rel,
          options.externalRelAttribute,
          /*
          * A fallback rel of `noopener noreferrer` is applied for external links or links that open in a new tab.
          * This solves a reverse tabnapping security flaw in browsers pre-2021 as well as improving privacy.
          */
          isAbsoluteUrl.value || hasTarget.value ? "noopener noreferrer" : ""
        ) || null;
        if (props.custom) {
          if (!slots.default) {
            return null;
          }
          return slots.default({
            href: href.value,
            navigate,
            prefetch,
            get route() {
              if (!href.value) {
                return void 0;
              }
              const url = new URL(href.value, "http://localhost");
              return {
                path: url.pathname,
                fullPath: url.pathname,
                get query() {
                  return parseQuery(url.search);
                },
                hash: url.hash,
                params: {},
                name: void 0,
                matched: [],
                redirectedFrom: void 0,
                meta: {},
                href: href.value
              };
            },
            rel,
            target,
            isExternal: isExternal.value || hasTarget.value,
            isActive: false,
            isExactActive: false
          });
        }
        return h("a", {
          ref: el,
          href: href.value || null,
          // converts `""` to `null` to prevent the attribute from being added as empty (`href=""`)
          rel,
          target,
          onClick: async (event) => {
            if (isExternal.value || hasTarget.value) {
              return;
            }
            event.preventDefault();
            try {
              const encodedHref = encodeRoutePath(href.value);
              return await (props.replace ? router.replace(encodedHref) : router.push(encodedHref));
            } finally {
            }
          }
        }, slots.default?.());
      };
    }
  });
}
const __nuxt_component_1 = /* @__PURE__ */ defineNuxtLink(nuxtLinkDefaults);
function applyTrailingSlashBehavior(to, trailingSlash) {
  const normalizeFn = trailingSlash === "append" ? withTrailingSlash : withoutTrailingSlash;
  const hasProtocolDifferentFromHttp = hasProtocol(to) && !to.startsWith("http");
  if (hasProtocolDifferentFromHttp) {
    return to;
  }
  return normalizeFn(to, true);
}
const inlineConfig = {
  "nuxt": {},
  "ui": {
    "colors": {
      "primary": "green",
      "secondary": "blue",
      "success": "green",
      "info": "blue",
      "warning": "yellow",
      "error": "red",
      "neutral": "slate"
    },
    "icons": {
      "arrowDown": "i-lucide-arrow-down",
      "arrowLeft": "i-lucide-arrow-left",
      "arrowRight": "i-lucide-arrow-right",
      "arrowUp": "i-lucide-arrow-up",
      "caution": "i-lucide-circle-alert",
      "check": "i-lucide-check",
      "chevronDoubleLeft": "i-lucide-chevrons-left",
      "chevronDoubleRight": "i-lucide-chevrons-right",
      "chevronDown": "i-lucide-chevron-down",
      "chevronLeft": "i-lucide-chevron-left",
      "chevronRight": "i-lucide-chevron-right",
      "chevronUp": "i-lucide-chevron-up",
      "close": "i-lucide-x",
      "copy": "i-lucide-copy",
      "copyCheck": "i-lucide-copy-check",
      "dark": "i-lucide-moon",
      "drag": "i-lucide-grip-vertical",
      "ellipsis": "i-lucide-ellipsis",
      "error": "i-lucide-circle-x",
      "external": "i-lucide-arrow-up-right",
      "eye": "i-lucide-eye",
      "eyeOff": "i-lucide-eye-off",
      "file": "i-lucide-file",
      "folder": "i-lucide-folder",
      "folderOpen": "i-lucide-folder-open",
      "hash": "i-lucide-hash",
      "info": "i-lucide-info",
      "light": "i-lucide-sun",
      "loading": "i-lucide-loader-circle",
      "menu": "i-lucide-menu",
      "minus": "i-lucide-minus",
      "panelClose": "i-lucide-panel-left-close",
      "panelOpen": "i-lucide-panel-left-open",
      "plus": "i-lucide-plus",
      "reload": "i-lucide-rotate-ccw",
      "search": "i-lucide-search",
      "stop": "i-lucide-square",
      "success": "i-lucide-circle-check",
      "system": "i-lucide-monitor",
      "tip": "i-lucide-lightbulb",
      "upload": "i-lucide-upload",
      "warning": "i-lucide-triangle-alert"
    },
    "tv": {
      "twMergeConfig": {}
    }
  },
  "icon": {
    "provider": "iconify",
    "class": "",
    "aliases": {},
    "iconifyApiEndpoint": "https://api.iconify.design",
    "localApiEndpoint": "/api/_nuxt_icon",
    "fallbackToApi": true,
    "cssSelectorPrefix": "i-",
    "cssWherePseudo": true,
    "cssLayer": "components",
    "mode": "css",
    "attrs": {
      "aria-hidden": true
    },
    "collections": [
      "academicons",
      "akar-icons",
      "ant-design",
      "arcticons",
      "basil",
      "bi",
      "bitcoin-icons",
      "bpmn",
      "brandico",
      "bx",
      "bxl",
      "bxs",
      "bytesize",
      "carbon",
      "catppuccin",
      "cbi",
      "charm",
      "ci",
      "cib",
      "cif",
      "cil",
      "circle-flags",
      "circum",
      "clarity",
      "codex",
      "codicon",
      "covid",
      "cryptocurrency",
      "cryptocurrency-color",
      "cuida",
      "dashicons",
      "devicon",
      "devicon-plain",
      "dinkie-icons",
      "duo-icons",
      "ei",
      "el",
      "emojione",
      "emojione-monotone",
      "emojione-v1",
      "entypo",
      "entypo-social",
      "eos-icons",
      "ep",
      "et",
      "eva",
      "f7",
      "fa",
      "fa-brands",
      "fa-regular",
      "fa-solid",
      "fa6-brands",
      "fa6-regular",
      "fa6-solid",
      "fa7-brands",
      "fa7-regular",
      "fa7-solid",
      "fad",
      "famicons",
      "fe",
      "feather",
      "file-icons",
      "flag",
      "flagpack",
      "flat-color-icons",
      "flat-ui",
      "flowbite",
      "fluent",
      "fluent-color",
      "fluent-emoji",
      "fluent-emoji-flat",
      "fluent-emoji-high-contrast",
      "fluent-mdl2",
      "fontelico",
      "fontisto",
      "formkit",
      "foundation",
      "fxemoji",
      "gala",
      "game-icons",
      "garden",
      "geo",
      "gg",
      "gis",
      "gravity-ui",
      "gridicons",
      "grommet-icons",
      "guidance",
      "healthicons",
      "heroicons",
      "heroicons-outline",
      "heroicons-solid",
      "hugeicons",
      "humbleicons",
      "ic",
      "icomoon-free",
      "icon-park",
      "icon-park-outline",
      "icon-park-solid",
      "icon-park-twotone",
      "iconamoon",
      "iconoir",
      "icons8",
      "il",
      "ion",
      "iwwa",
      "ix",
      "jam",
      "la",
      "lets-icons",
      "line-md",
      "lineicons",
      "logos",
      "ls",
      "lsicon",
      "lucide",
      "lucide-lab",
      "mage",
      "majesticons",
      "maki",
      "map",
      "marketeq",
      "material-icon-theme",
      "material-symbols",
      "material-symbols-light",
      "mdi",
      "mdi-light",
      "medical-icon",
      "memory",
      "meteocons",
      "meteor-icons",
      "mi",
      "mingcute",
      "mono-icons",
      "mynaui",
      "nimbus",
      "nonicons",
      "noto",
      "noto-v1",
      "nrk",
      "octicon",
      "oi",
      "ooui",
      "openmoji",
      "oui",
      "pajamas",
      "pepicons",
      "pepicons-pencil",
      "pepicons-pop",
      "pepicons-print",
      "ph",
      "picon",
      "pixel",
      "pixelarticons",
      "prime",
      "proicons",
      "ps",
      "qlementine-icons",
      "quill",
      "radix-icons",
      "raphael",
      "ri",
      "rivet-icons",
      "roentgen",
      "si",
      "si-glyph",
      "sidekickicons",
      "simple-icons",
      "simple-line-icons",
      "skill-icons",
      "solar",
      "stash",
      "streamline",
      "streamline-block",
      "streamline-color",
      "streamline-cyber",
      "streamline-cyber-color",
      "streamline-emojis",
      "streamline-flex",
      "streamline-flex-color",
      "streamline-freehand",
      "streamline-freehand-color",
      "streamline-kameleon-color",
      "streamline-logos",
      "streamline-pixel",
      "streamline-plump",
      "streamline-plump-color",
      "streamline-sharp",
      "streamline-sharp-color",
      "streamline-stickies-color",
      "streamline-ultimate",
      "streamline-ultimate-color",
      "subway",
      "svg-spinners",
      "system-uicons",
      "tabler",
      "tdesign",
      "teenyicons",
      "temaki",
      "token",
      "token-branded",
      "topcoat",
      "twemoji",
      "typcn",
      "uil",
      "uim",
      "uis",
      "uit",
      "uiw",
      "unjs",
      "vaadin",
      "vs",
      "vscode-icons",
      "websymbol",
      "weui",
      "whh",
      "wi",
      "wpf",
      "zmdi",
      "zondicons"
    ],
    "fetchTimeout": 1500
  }
};
const appConfig = /* @__PURE__ */ defuFn(inlineConfig);
function useAppConfig() {
  const nuxtApp = useNuxtApp();
  nuxtApp._appConfig ||= klona(appConfig);
  return nuxtApp._appConfig;
}
const _0_siteConfig_tU0SxKrPeVRXWcGu2sOnIfhNDbYiKNfDCvYZhRueG0Q = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt-site-config:init",
  enforce: "pre",
  async setup(nuxtApp) {
    const stack = useRequestEvent()?.context?.siteConfig;
    const state = useState("site-config");
    {
      nuxtApp.hooks.hook("app:rendered", () => {
        state.value = stack?.get({
          debug: (/* @__PURE__ */ useRuntimeConfig())["nuxt-site-config"].debug,
          resolveRefs: true
        });
      });
    }
    return {
      provide: {
        nuxtSiteConfig: stack
      }
    };
  }
});
const unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:head",
  enforce: "pre",
  setup(nuxtApp) {
    const head = nuxtApp.ssrContext.head;
    nuxtApp.vueApp.use(head);
  }
});
function toArray(value) {
  return Array.isArray(value) ? value : [value];
}
const __nuxt_page_meta$1i = {
  layout: "default"
};
const __nuxt_page_meta$1h = {
  layout: "default"
};
const __nuxt_page_meta$1g = {
  layout: "workspace"
};
const __nuxt_page_meta$1f = {
  layout: "default"
};
const __nuxt_page_meta$1e = {
  layout: "default"
};
const __nuxt_page_meta$1d = {
  layout: "default"
};
const __nuxt_page_meta$1c = {
  layout: false
};
const __nuxt_page_meta$1b = {
  layout: "admin"
};
const __nuxt_page_meta$1a = {
  layout: false
};
const __nuxt_page_meta$19 = {
  layout: "workspace"
};
const __nuxt_page_meta$18 = {
  layout: false
};
const __nuxt_page_meta$17 = {
  layout: "default"
};
const __nuxt_page_meta$16 = { layout: "default" };
const __nuxt_page_meta$15 = {
  layout: "workspace"
};
const __nuxt_page_meta$14 = {
  layout: "admin"
};
const __nuxt_page_meta$13 = {
  layout: "workspace"
};
const __nuxt_page_meta$12 = {
  layout: "workspace"
};
const __nuxt_page_meta$11 = { layout: "default" };
const __nuxt_page_meta$10 = {
  layout: "workspace"
};
const __nuxt_page_meta$$ = { layout: "default" };
const __nuxt_page_meta$_ = {
  layout: "default"
};
const __nuxt_page_meta$Z = { layout: "default" };
const __nuxt_page_meta$Y = {
  layout: "admin"
};
const __nuxt_page_meta$X = {
  layout: "default"
};
const __nuxt_page_meta$W = {
  layout: "dashboard"
};
const __nuxt_page_meta$V = { layout: "default" };
const __nuxt_page_meta$U = { layout: "default" };
const __nuxt_page_meta$T = { layout: "dashboard" };
const __nuxt_page_meta$S = { layout: "default" };
const __nuxt_page_meta$R = { layout: "default" };
const __nuxt_page_meta$Q = {
  layout: false
};
const __nuxt_page_meta$P = { layout: "dashboard" };
const __nuxt_page_meta$O = {
  layout: "dashboard"
};
const __nuxt_page_meta$N = { layout: "dashboard" };
const __nuxt_page_meta$M = { layout: "dashboard" };
const __nuxt_page_meta$L = {
  layout: "dashboard"
};
const __nuxt_page_meta$K = {
  layout: "default"
};
const __nuxt_page_meta$J = {
  layout: false
};
const __nuxt_page_meta$I = { layout: "default" };
const __nuxt_page_meta$H = {
  layout: false
};
const __nuxt_page_meta$G = { layout: "dashboard" };
const __nuxt_page_meta$F = {
  layout: "dashboard"
};
const __nuxt_page_meta$E = { layout: "dashboard" };
const __nuxt_page_meta$D = {
  layout: "default"
};
const __nuxt_page_meta$C = {
  layout: false
};
const __nuxt_page_meta$B = {
  layout: "dashboard"
};
const __nuxt_page_meta$A = {
  layout: "dashboard"
};
const __nuxt_page_meta$z = {
  layout: "dashboard"
};
const __nuxt_page_meta$y = {
  layout: "dashboard"
};
const __nuxt_page_meta$x = {
  layout: "dashboard"
};
const __nuxt_page_meta$w = {
  layout: "dashboard"
};
const __nuxt_page_meta$v = {
  layout: "dashboard"
};
const __nuxt_page_meta$u = {
  layout: "dashboard"
};
const __nuxt_page_meta$t = {
  layout: "dashboard"
};
const __nuxt_page_meta$s = {
  layout: "dashboard"
};
const __nuxt_page_meta$r = {
  layout: "dashboard"
};
const __nuxt_page_meta$q = {
  layout: "dashboard"
};
const __nuxt_page_meta$p = {
  layout: "dashboard"
};
const __nuxt_page_meta$o = { layout: "default" };
const __nuxt_page_meta$n = { layout: "default" };
const __nuxt_page_meta$m = {
  layout: "dashboard"
};
const __nuxt_page_meta$l = {
  layout: "dashboard"
};
const __nuxt_page_meta$k = {
  layout: "dashboard"
};
const __nuxt_page_meta$j = {
  layout: "dashboard"
};
const __nuxt_page_meta$i = {
  layout: "dashboard"
};
const __nuxt_page_meta$h = {
  layout: "dashboard"
};
const __nuxt_page_meta$g = {
  layout: "dashboard"
};
const __nuxt_page_meta$f = {
  layout: "dashboard"
};
const __nuxt_page_meta$e = {
  layout: "dashboard"
};
const __nuxt_page_meta$d = {
  layout: "dashboard"
};
const __nuxt_page_meta$c = {
  layout: "dashboard"
};
const __nuxt_page_meta$b = {
  layout: "dashboard"
};
const __nuxt_page_meta$a = {
  layout: "dashboard"
};
const __nuxt_page_meta$9 = {
  layout: "dashboard"
};
const __nuxt_page_meta$8 = {
  layout: "dashboard"
};
const __nuxt_page_meta$7 = {
  layout: "dashboard"
};
const __nuxt_page_meta$6 = {
  layout: "dashboard"
};
const __nuxt_page_meta$5 = {
  layout: "dashboard"
};
const __nuxt_page_meta$4 = {
  layout: "dashboard"
};
const __nuxt_page_meta$3 = { layout: "default" };
const __nuxt_page_meta$2 = {
  layout: "dashboard"
};
const __nuxt_page_meta$1 = {
  layout: "dashboard"
};
const __nuxt_page_meta = {
  layout: "dashboard"
};
const _routes = [
  {
    name: "help",
    path: "/help",
    meta: __nuxt_page_meta$1i || {},
    component: () => import('./help-GZdelQfn.mjs')
  },
  {
    name: "about",
    path: "/about",
    meta: __nuxt_page_meta$1h || {},
    component: () => import('./about-Djz6yFP4.mjs')
  },
  {
    name: "inbox",
    path: "/inbox",
    meta: { ...__nuxt_page_meta$1g || {}, ...{ "middleware": "auth" } },
    component: () => import('./inbox-CuZdtXcM.mjs')
  },
  {
    name: "index",
    path: "/",
    meta: __nuxt_page_meta$1f || {},
    component: () => import('./index-xsCiar3T.mjs')
  },
  {
    name: "terms",
    path: "/terms",
    meta: __nuxt_page_meta$1e || {},
    component: () => import('./terms-CvlxgIuz.mjs')
  },
  {
    name: "privacy",
    path: "/privacy",
    meta: __nuxt_page_meta$1d || {},
    component: () => import('./privacy-Bn_9oh0w.mjs')
  },
  {
    name: "auth-login",
    path: "/auth/login",
    meta: { ...__nuxt_page_meta$1c || {}, ...{ "middleware": "guest" } },
    component: () => import('./login-DoBqPLrc.mjs')
  },
  {
    name: "admin",
    path: "/admin",
    meta: { ...__nuxt_page_meta$1b || {}, ...{ "middleware": ["auth", "super-admin"] } },
    component: () => import('./index-DZ6Td1LG.mjs')
  },
  {
    name: "auth-signup",
    path: "/auth/signup",
    meta: { ...__nuxt_page_meta$1a || {}, ...{ "middleware": "guest" } },
    component: () => import('./signup-CFkslXBH.mjs')
  },
  {
    name: "quote-draft",
    path: "/quote-draft",
    meta: { ...__nuxt_page_meta$19 || {}, ...{ "middleware": ["auth"] } },
    component: () => import('./quote-draft-D9yunikx.mjs')
  },
  {
    name: "quote-print",
    path: "/quote/print",
    meta: __nuxt_page_meta$18 || {},
    component: () => import('./print-k6fU9DYT.mjs')
  },
  {
    name: "quotes-id",
    path: "/quotes/:id()",
    meta: { ...__nuxt_page_meta$17 || {}, ...{ "middleware": "auth" } },
    component: () => import('./_id_-JOm2K2fh.mjs')
  },
  {
    name: "shops",
    path: "/shops",
    meta: __nuxt_page_meta$16 || {},
    component: () => import('./index-B6kspsAb.mjs')
  },
  {
    name: "account-edit",
    path: "/account/edit",
    meta: { ...__nuxt_page_meta$15 || {}, ...{ "middleware": "auth" } },
    component: () => import('./edit-DEDj53VJ.mjs')
  },
  {
    name: "admin-errors",
    path: "/admin/errors",
    meta: { ...__nuxt_page_meta$14 || {}, ...{ "middleware": ["auth", "super-admin"] } },
    component: () => import('./errors-9JhOlc2j.mjs')
  },
  {
    name: "me-favorites",
    path: "/me/favorites",
    meta: { ...__nuxt_page_meta$13 || {}, ...{ "middleware": "auth" } },
    component: () => import('./favorites-DipyHBOT.mjs')
  },
  {
    name: "quotes",
    path: "/quotes",
    meta: { ...__nuxt_page_meta$12 || {}, ...{ "middleware": "auth" } },
    component: () => import('./index-DySDLylp.mjs')
  },
  {
    name: "shops-nearby",
    path: "/shops/nearby",
    meta: __nuxt_page_meta$11 || {},
    component: () => import('./nearby-D1o8UEAe.mjs')
  },
  {
    name: "account",
    path: "/account",
    meta: { ...__nuxt_page_meta$10 || {}, ...{ "middleware": "auth" } },
    component: () => import('./index-DWCDeZ8s.mjs')
  },
  {
    name: "gallery",
    path: "/gallery",
    meta: __nuxt_page_meta$$ || {},
    component: () => import('./index-CJ_QmYNc.mjs')
  },
  {
    name: "quotes-create",
    path: "/quotes/create",
    meta: { ...__nuxt_page_meta$_ || {}, ...{ "middleware": "auth" } },
    component: () => import('./create-B7tX05Et.mjs')
  },
  {
    name: "products",
    path: "/products",
    meta: __nuxt_page_meta$Z || {},
    component: () => import('./index-B_QuipbL.mjs')
  },
  {
    name: "admin-locations",
    path: "/admin/locations",
    meta: { ...__nuxt_page_meta$Y || {}, ...{ "middleware": ["auth", "super-admin"] } },
    component: () => import('./locations-vD9VizLq.mjs')
  },
  {
    name: "booklets-create",
    path: "/booklets/create",
    meta: __nuxt_page_meta$X || {},
    component: () => import('./create-BZd8a4d5.mjs')
  },
  {
    name: "dashboard",
    path: "/dashboard",
    meta: { ...__nuxt_page_meta$W || {}, ...{ "middleware": ["auth", "setup-guard"] } },
    component: () => import('./index-cFu9MWkj.mjs')
  },
  {
    name: "locations",
    path: "/locations",
    meta: __nuxt_page_meta$V || {},
    component: () => import('./index-COUf6k51.mjs')
  },
  {
    name: "products-slug",
    path: "/products/:slug()",
    meta: __nuxt_page_meta$U || {},
    component: () => import('./_slug_-CkRRroGj.mjs')
  },
  {
    name: "dashboard-papers",
    path: "/dashboard/papers",
    meta: { ...__nuxt_page_meta$T || {}, ...{ "middleware": ["auth"] } },
    component: () => import('./papers-9wMe_OMa.mjs')
  },
  {
    name: "locations-slug",
    path: "/locations/:slug()",
    meta: __nuxt_page_meta$S || {},
    component: () => import('./_slug_-D1GDQOER.mjs')
  },
  {
    name: "my-requests-id",
    path: "/my-requests/:id()",
    meta: { "middleware": "auth" },
    component: () => import('./_id_-CNYdPlGy.mjs')
  },
  {
    name: "products-gallery",
    path: "/products/gallery",
    meta: __nuxt_page_meta$R || {},
    component: () => import('./gallery-Bmf1qWjP.mjs')
  },
  {
    name: "auth-verify-email",
    path: "/auth/verify-email",
    meta: { ...__nuxt_page_meta$Q || {}, ...{ "middleware": "guest" } },
    component: () => import('./verify-email-Bn7wdTqb.mjs')
  },
  {
    name: "dashboard-pricing",
    path: "/dashboard/pricing",
    meta: { ...__nuxt_page_meta$P || {}, ...{ "middleware": ["auth"] } },
    component: () => import('./pricing-Dmbx2e8t.mjs')
  },
  {
    name: "my-requests",
    path: "/my-requests",
    meta: { "middleware": "auth" },
    component: () => import('./index-BfFMR1p1.mjs')
  },
  {
    name: "dashboard-machines",
    path: "/dashboard/machines",
    meta: { ...__nuxt_page_meta$N || {}, ...{ "middleware": ["auth"] } },
    component: () => import('./machines-CTnpX4mE.mjs'),
    children: [
      {
        name: "dashboard-machines-id-rates",
        path: ":id()/rates",
        meta: { ...__nuxt_page_meta$O || {}, ...{ "middleware": "auth" } },
        component: () => import('./rates-B2rY4UzD.mjs')
      }
    ]
  },
  {
    name: "dashboard-products",
    path: "/dashboard/products",
    meta: { ...__nuxt_page_meta$M || {}, ...{ "middleware": ["auth"] } },
    component: () => import('./products-DWRaY2kb.mjs')
  },
  {
    name: "dashboard-settings",
    path: "/dashboard/settings",
    meta: { ...__nuxt_page_meta$L || {}, ...{ "middleware": ["auth"] } },
    component: () => import('./settings-_ucFCBmt.mjs')
  },
  {
    name: "onboarding-printer",
    path: "/onboarding/printer",
    meta: { ...__nuxt_page_meta$K || {}, ...{ "middleware": "auth" } },
    component: () => import('./printer-B8H84Iup.mjs')
  },
  {
    name: "public-job-token",
    path: "/public/job/:token()",
    meta: __nuxt_page_meta$J || {},
    component: () => import('./_token_-iFjjfCoV.mjs')
  },
  {
    name: "shops-slug",
    path: "/shops/:slug()",
    meta: __nuxt_page_meta$I || {},
    component: () => import('./index-Dovsz3Y6.mjs')
  },
  {
    name: "auth-reset-password",
    path: "/auth/reset-password",
    meta: __nuxt_page_meta$H || {},
    component: () => import('./reset-password-BEvjSe0e.mjs')
  },
  {
    name: "dashboard-finishing",
    path: "/dashboard/finishing",
    meta: { ...__nuxt_page_meta$G || {}, ...{ "middleware": ["auth"] } },
    component: () => import('./finishing-B7N6Kik4.mjs')
  },
  {
    name: "dashboard-jobs-id",
    path: "/dashboard/jobs/:id()",
    meta: { ...__nuxt_page_meta$F || {}, ...{ "middleware": "auth" } },
    component: () => import('./_id_-Cu3yNqwH.mjs')
  },
  {
    name: "dashboard-materials",
    path: "/dashboard/materials",
    meta: { ...__nuxt_page_meta$E || {}, ...{ "middleware": ["auth"] } },
    component: () => import('./materials-GqyyuhSz.mjs')
  },
  {
    name: "large-format-create",
    path: "/large-format/create",
    meta: __nuxt_page_meta$D || {},
    component: () => import('./create-D_9TtpxK.mjs')
  },
  {
    name: "auth-forgot-password",
    path: "/auth/forgot-password",
    meta: { ...__nuxt_page_meta$C || {}, ...{ "middleware": "guest" } },
    component: () => import('./forgot-password-C38tvuuG.mjs')
  },
  {
    name: "dashboard-jobs",
    path: "/dashboard/jobs",
    meta: { ...__nuxt_page_meta$B || {}, ...{ "middleware": "auth" } },
    component: () => import('./index-BYD_iaY_.mjs')
  },
  {
    name: "dashboard-claims-id",
    path: "/dashboard/claims/:id()",
    meta: { ...__nuxt_page_meta$A || {}, ...{ "middleware": "auth" } },
    component: () => import('./_id_-AbWU1VOJ.mjs')
  },
  {
    name: "dashboard-jobs-create",
    path: "/dashboard/jobs/create",
    meta: { ...__nuxt_page_meta$z || {}, ...{ "middleware": "auth" } },
    component: () => import('./create-D58lQgUr.mjs')
  },
  {
    name: "dashboard-quotes-id",
    path: "/dashboard/quotes/:id()",
    meta: { ...__nuxt_page_meta$y || {}, ...{ "middleware": "auth" } },
    component: () => import('./_id_-C3St8aeN.mjs')
  },
  {
    name: "dashboard-setup-guide",
    path: "/dashboard/setup-guide",
    meta: { ...__nuxt_page_meta$x || {}, ...{ "middleware": ["auth"] } },
    component: () => import('./setup-guide-EpPWISao.mjs')
  },
  {
    name: "dashboard-shops",
    path: "/dashboard/shops",
    meta: { ...__nuxt_page_meta$w || {}, ...{ "middleware": "auth" } },
    component: () => import('./index-DwyYFpaJ.mjs')
  },
  {
    name: "super-admin-analytics",
    path: "/super-admin/analytics",
    meta: { ...__nuxt_page_meta$v || {}, ...{ "middleware": ["auth", "super-admin"] } },
    component: () => import('./analytics-DoSi17Hx.mjs')
  },
  {
    name: "dashboard-claims",
    path: "/dashboard/claims",
    meta: { ...__nuxt_page_meta$u || {}, ...{ "middleware": "auth" } },
    component: () => import('./index-BR1HF-GQ.mjs')
  },
  {
    name: "dashboard-profile-edit",
    path: "/dashboard/profile/edit",
    meta: { ...__nuxt_page_meta$t || {}, ...{ "middleware": "auth" } },
    component: () => import('./edit-BWUGxpYm.mjs')
  },
  {
    name: "dashboard-quotes",
    path: "/dashboard/quotes",
    meta: { ...__nuxt_page_meta$s || {}, ...{ "middleware": "auth" } },
    component: () => import('./index-MQcIgBeI.mjs')
  },
  {
    name: "dashboard-shops-create",
    path: "/dashboard/shops/create",
    meta: { ...__nuxt_page_meta$r || {}, ...{ "middleware": "auth" } },
    component: () => import('./create-DrUwoeEv.mjs')
  },
  {
    name: "dashboard-profile",
    path: "/dashboard/profile",
    meta: { ...__nuxt_page_meta$q || {}, ...{ "middleware": "auth" } },
    component: () => import('./index-BTJtc069.mjs')
  },
  {
    name: "dashboard-quotes-create",
    path: "/dashboard/quotes/create",
    meta: { ...__nuxt_page_meta$p || {}, ...{ "middleware": "auth" } },
    component: () => import('./create-7SxNUDGd.mjs')
  },
  {
    name: "gallery-shopSlug",
    path: "/gallery/:shopSlug()",
    meta: __nuxt_page_meta$o || {},
    component: () => import('./index-DBWMRQ0F.mjs')
  },
  {
    name: "shops-slug-request-quote",
    path: "/shops/:slug()/request-quote",
    meta: __nuxt_page_meta$n || {},
    component: () => import('./request-quote-DzbjfXEu.mjs')
  },
  {
    name: "dashboard-quotes-files-id",
    path: "/dashboard/quotes/files/:id()",
    meta: { ...__nuxt_page_meta$m || {}, ...{ "middleware": "auth" } },
    component: () => import('./_id_-D7flBA9c.mjs')
  },
  {
    name: "dashboard-shops-slug-edit",
    path: "/dashboard/shops/:slug()/edit",
    meta: { ...__nuxt_page_meta$l || {}, ...{ "middleware": ["auth", "shop-owner"] } },
    component: () => import('./edit-C4dfJYBa.mjs')
  },
  {
    name: "dashboard-shops-slug-hours",
    path: "/dashboard/shops/:slug()/hours",
    meta: { ...__nuxt_page_meta$k || {}, ...{ "middleware": ["auth", "shop-owner"] } },
    component: () => import('./hours-BpM01v4B.mjs')
  },
  {
    name: "dashboard-shops-slug",
    path: "/dashboard/shops/:slug()",
    meta: { ...__nuxt_page_meta$j || {}, ...{ "middleware": ["auth", "shop-owner"] } },
    component: () => import('./index-B6jae3Xc.mjs')
  },
  {
    name: "dashboard-shops-slug-setup",
    path: "/dashboard/shops/:slug()/setup",
    meta: { ...__nuxt_page_meta$i || {}, ...{ "middleware": "auth" } },
    component: () => import('./setup-CO-KSh3v.mjs')
  },
  {
    name: "dashboard-notifications",
    path: "/dashboard/notifications",
    meta: { ...__nuxt_page_meta$h || {}, ...{ "middleware": "auth" } },
    component: () => import('./index-BqhsqDbL.mjs')
  },
  {
    name: "dashboard-shops-slug-members",
    path: "/dashboard/shops/:slug()/members",
    meta: { ...__nuxt_page_meta$g || {}, ...{ "middleware": ["auth", "shop-owner"] } },
    component: () => import('./members-BTtKVGyf.mjs')
  },
  {
    name: "gallery-shopSlug-templateSlug",
    path: "/gallery/:shopSlug()/:templateSlug()",
    component: () => import('./_templateSlug_-P0I_KrF9.mjs')
  },
  {
    name: "dashboard-shops-slug-quotes-id",
    path: "/dashboard/shops/:slug()/quotes/:id()",
    meta: { ...__nuxt_page_meta$f || {}, ...{ "middleware": ["auth", "shop-owner"] } },
    component: () => import('./_id_-2i5r3Ope.mjs')
  },
  {
    name: "dashboard-shops-slug-papers",
    path: "/dashboard/shops/:slug()/papers",
    meta: { ...__nuxt_page_meta$e || {}, ...{ "middleware": ["auth", "shop-owner", "shop-setup-step"] } },
    component: () => import('./index-Byo6eo2X.mjs')
  },
  {
    name: "dashboard-shops-slug-quotes",
    path: "/dashboard/shops/:slug()/quotes",
    meta: { ...__nuxt_page_meta$d || {}, ...{ "middleware": ["auth", "shop-owner"] } },
    component: () => import('./index-D0KlkhKp.mjs')
  },
  {
    name: "dashboard-shops-slug-pricing",
    path: "/dashboard/shops/:slug()/pricing",
    meta: { ...__nuxt_page_meta$c || {}, ...{ "middleware": ["auth", "shop-owner", "shop-setup-step"] } },
    component: () => import('./index-bP1eo9Xm.mjs')
  },
  {
    name: "dashboard-shops-slug-products-id",
    path: "/dashboard/shops/:slug()/products/:id()",
    meta: { ...__nuxt_page_meta$b || {}, ...{ "middleware": ["auth", "shop-owner", "shop-setup-step"] } },
    component: () => import('./_id_-BFYF83_6.mjs')
  },
  {
    name: "dashboard-shops-slug-quotes-create",
    path: "/dashboard/shops/:slug()/quotes/create",
    meta: { ...__nuxt_page_meta$a || {}, ...{ "middleware": ["auth", "shop-owner"] } },
    component: () => import('./create-DccH8yY0.mjs')
  },
  {
    name: "dashboard-shops-slug-machines",
    path: "/dashboard/shops/:slug()/machines",
    meta: { ...__nuxt_page_meta$9 || {}, ...{ "middleware": ["auth", "shop-owner", "shop-setup-step"] } },
    component: () => import('./index-Ds378O9K.mjs')
  },
  {
    name: "dashboard-shops-slug-products",
    path: "/dashboard/shops/:slug()/products",
    meta: { ...__nuxt_page_meta$8 || {}, ...{ "middleware": ["auth", "shop-owner", "shop-setup-step"] } },
    component: () => import('./index-B767rKOt.mjs')
  },
  {
    name: "dashboard-shops-slug-finishing",
    path: "/dashboard/shops/:slug()/finishing",
    meta: { ...__nuxt_page_meta$7 || {}, ...{ "middleware": ["auth", "shop-owner", "shop-setup-step"] } },
    component: () => import('./index-nTWFRCGo.mjs')
  },
  {
    name: "dashboard-shops-slug-materials",
    path: "/dashboard/shops/:slug()/materials",
    meta: { ...__nuxt_page_meta$6 || {}, ...{ "middleware": ["auth", "shop-owner"] } },
    component: () => import('./index-c98EBXUy.mjs')
  },
  {
    name: "dashboard-shops-slug-products-create",
    path: "/dashboard/shops/:slug()/products/create",
    meta: { ...__nuxt_page_meta$5 || {}, ...{ "middleware": ["auth", "shop-owner", "shop-setup-step"] } },
    component: () => import('./create-cwM2RtDN.mjs')
  },
  {
    name: "dashboard-shops-slug-sent-quotes-id",
    path: "/dashboard/shops/:slug()/sent-quotes/:id()",
    meta: { ...__nuxt_page_meta$4 || {}, ...{ "middleware": ["auth", "shop-owner"] } },
    component: () => import('./_id_-BEnFv3aa.mjs')
  },
  {
    name: "locations-location-products-product",
    path: "/locations/:location()/products/:product()",
    meta: __nuxt_page_meta$3 || {},
    component: () => import('./_product_-B_OQaGsS.mjs')
  },
  {
    name: "dashboard-shops-slug-sent-quotes",
    path: "/dashboard/shops/:slug()/sent-quotes",
    meta: { ...__nuxt_page_meta$2 || {}, ...{ "middleware": ["auth", "shop-owner"] } },
    component: () => import('./index-pRCgFUiQ.mjs')
  },
  {
    name: "dashboard-shops-slug-incoming-requests-id",
    path: "/dashboard/shops/:slug()/incoming-requests/:id()",
    meta: { ...__nuxt_page_meta$1 || {}, ...{ "middleware": ["auth", "shop-owner"] } },
    component: () => import('./_id_-CWjcvzHi.mjs')
  },
  {
    name: "dashboard-shops-slug-incoming-requests",
    path: "/dashboard/shops/:slug()/incoming-requests",
    meta: { ...__nuxt_page_meta || {}, ...{ "middleware": ["auth", "shop-owner"] } },
    component: () => import('./index-DWOCf6Ty.mjs')
  }
];
const validate = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to, from) => {
  let __temp, __restore;
  if (!to.meta?.validate) {
    return;
  }
  const result = ([__temp, __restore] = executeAsync(() => Promise.resolve(to.meta.validate(to))), __temp = await __temp, __restore(), __temp);
  if (result === true) {
    return;
  }
  const error = createError({
    fatal: false,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    status: result && (result.status || result.statusCode) || 404,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    statusText: result && (result.statusText || result.statusMessage) || `Page Not Found: ${to.fullPath}`,
    data: {
      path: to.fullPath
    }
  });
  return error;
});
const manifest_45route_45rule = /* @__PURE__ */ defineNuxtRouteMiddleware((to) => {
  {
    return;
  }
});
const globalMiddleware = [
  validate,
  manifest_45route_45rule
];
const namedMiddleware = {
  auth: () => import('./auth-B7b-nlSq.mjs'),
  guest: () => import('./guest-B3TMVvqj.mjs'),
  "setup-guard": () => import('./setup-guard-BkDQH8TU.mjs'),
  "shop-owner": () => import('./shop-owner-D7bq0La5.mjs'),
  "shop-setup-step": () => import('./shop-setup-step-BOvnP0hJ.mjs'),
  "super-admin": () => import('./super-admin-DHLNvKJW.mjs')
};
const plugin$1 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:router",
  enforce: "pre",
  async setup(nuxtApp) {
    let __temp, __restore;
    let routerBase = (/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
    const history = routerOptions.history?.(routerBase) ?? createMemoryHistory(routerBase);
    const routes = routerOptions.routes ? ([__temp, __restore] = executeAsync(() => routerOptions.routes(_routes)), __temp = await __temp, __restore(), __temp) ?? _routes : _routes;
    let startPosition;
    const router = createRouter({
      ...routerOptions,
      scrollBehavior: (to, from, savedPosition) => {
        if (from === START_LOCATION) {
          startPosition = savedPosition;
          return;
        }
        if (routerOptions.scrollBehavior) {
          router.options.scrollBehavior = routerOptions.scrollBehavior;
          if ("scrollRestoration" in (void 0).history) {
            const unsub = router.beforeEach(() => {
              unsub();
              (void 0).history.scrollRestoration = "manual";
            });
          }
          return routerOptions.scrollBehavior(to, START_LOCATION, startPosition || savedPosition);
        }
      },
      history,
      routes
    });
    nuxtApp.vueApp.use(router);
    const previousRoute = shallowRef(router.currentRoute.value);
    router.afterEach((_to, from) => {
      previousRoute.value = from;
    });
    Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", {
      get: () => previousRoute.value
    });
    const initialURL = nuxtApp.ssrContext.url;
    const _route = shallowRef(router.currentRoute.value);
    const syncCurrentRoute = () => {
      _route.value = router.currentRoute.value;
    };
    router.afterEach((to, from) => {
      if (to.matched.at(-1)?.components?.default === from.matched.at(-1)?.components?.default) {
        syncCurrentRoute();
      }
    });
    const route = { sync: syncCurrentRoute };
    for (const key in _route.value) {
      Object.defineProperty(route, key, {
        get: () => _route.value[key],
        enumerable: true
      });
    }
    nuxtApp._route = shallowReactive(route);
    nuxtApp._middleware ||= {
      global: [],
      named: {}
    };
    const error = /* @__PURE__ */ useError();
    if (!nuxtApp.ssrContext?.islandContext) {
      router.afterEach(async (to, _from, failure) => {
        delete nuxtApp._processingMiddleware;
        if (failure) {
          await nuxtApp.callHook("page:loading:end");
        }
        if (failure?.type === 4) {
          return;
        }
        if (to.redirectedFrom && to.fullPath !== initialURL) {
          await nuxtApp.runWithContext(() => navigateTo(to.fullPath || "/"));
        }
      });
    }
    try {
      if (true) {
        ;
        [__temp, __restore] = executeAsync(() => router.push(initialURL)), await __temp, __restore();
        ;
      }
      ;
      [__temp, __restore] = executeAsync(() => router.isReady()), await __temp, __restore();
      ;
    } catch (error2) {
      [__temp, __restore] = executeAsync(() => nuxtApp.runWithContext(() => showError(error2))), await __temp, __restore();
    }
    const resolvedInitialRoute = router.currentRoute.value;
    syncCurrentRoute();
    if (nuxtApp.ssrContext?.islandContext) {
      return { provide: { router } };
    }
    const initialLayout = nuxtApp.payload.state._layout;
    router.beforeEach(async (to, from) => {
      await nuxtApp.callHook("page:loading:start");
      to.meta = reactive(to.meta);
      if (nuxtApp.isHydrating && initialLayout && !isReadonly(to.meta.layout)) {
        to.meta.layout = initialLayout;
      }
      nuxtApp._processingMiddleware = true;
      if (!nuxtApp.ssrContext?.islandContext) {
        const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
        for (const component of to.matched) {
          const componentMiddleware = component.meta.middleware;
          if (!componentMiddleware) {
            continue;
          }
          for (const entry2 of toArray(componentMiddleware)) {
            middlewareEntries.add(entry2);
          }
        }
        const routeRules = getRouteRules({ path: to.path });
        if (routeRules.appMiddleware) {
          for (const key in routeRules.appMiddleware) {
            if (routeRules.appMiddleware[key]) {
              middlewareEntries.add(key);
            } else {
              middlewareEntries.delete(key);
            }
          }
        }
        for (const entry2 of middlewareEntries) {
          const middleware = typeof entry2 === "string" ? nuxtApp._middleware.named[entry2] || await namedMiddleware[entry2]?.().then((r) => r.default || r) : entry2;
          if (!middleware) {
            throw new Error(`Unknown route middleware: '${entry2}'.`);
          }
          try {
            if (false) ;
            const result = await nuxtApp.runWithContext(() => middleware(to, from));
            if (true) {
              if (result === false || result instanceof Error) {
                const error2 = result || createError({
                  status: 404,
                  statusText: `Page Not Found: ${initialURL}`
                });
                await nuxtApp.runWithContext(() => showError(error2));
                return false;
              }
            }
            if (result === true) {
              continue;
            }
            if (result === false) {
              return result;
            }
            if (result) {
              if (isNuxtError(result) && result.fatal) {
                await nuxtApp.runWithContext(() => showError(result));
              }
              return result;
            }
          } catch (err) {
            const error2 = createError(err);
            if (error2.fatal) {
              await nuxtApp.runWithContext(() => showError(error2));
            }
            return error2;
          }
        }
      }
    });
    router.onError(async () => {
      delete nuxtApp._processingMiddleware;
      await nuxtApp.callHook("page:loading:end");
    });
    router.afterEach((to) => {
      if (to.matched.length === 0 && !error.value) {
        return nuxtApp.runWithContext(() => showError(createError({
          status: 404,
          fatal: false,
          statusText: `Page not found: ${to.fullPath}`,
          data: {
            path: to.fullPath
          }
        })));
      }
    });
    nuxtApp.hooks.hookOnce("app:created", async () => {
      try {
        if ("name" in resolvedInitialRoute) {
          resolvedInitialRoute.name = void 0;
        }
        await router.replace({
          ...resolvedInitialRoute,
          force: true
        });
        router.options.scrollBehavior = routerOptions.scrollBehavior;
      } catch (error2) {
        await nuxtApp.runWithContext(() => showError(error2));
      }
    });
    return { provide: { router } };
  }
});
const VALID_ISLAND_KEY_RE = /^[a-z][a-z\d-]*_[a-z\d]+$/i;
function isValidIslandKey(key) {
  return typeof key === "string" && VALID_ISLAND_KEY_RE.test(key) && key.length <= 100;
}
const reducers = [
  ["NuxtError", (data) => isNuxtError(data) && data.toJSON()],
  ["EmptyShallowRef", (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["EmptyRef", (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["ShallowRef", (data) => isRef(data) && isShallow(data) && data.value],
  ["ShallowReactive", (data) => isReactive(data) && isShallow(data) && toRaw(data)],
  ["Ref", (data) => isRef(data) && data.value],
  ["Reactive", (data) => isReactive(data) && toRaw(data)]
];
{
  reducers.push(["Island", (data) => data && data?.__nuxt_island && isValidIslandKey(data.__nuxt_island.key) && data.__nuxt_island]);
}
const revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:revive-payload:server",
  setup() {
    for (const [reducer, fn] of reducers) {
      definePayloadReducer(reducer, fn);
    }
  }
});
const plugin = /* @__PURE__ */ defineNuxtPlugin({
  name: "pinia",
  setup(nuxtApp) {
    const pinia = createPinia();
    nuxtApp.vueApp.use(pinia);
    setActivePinia(pinia);
    if (nuxtApp.payload && nuxtApp.payload.pinia) {
      pinia.state.value = nuxtApp.payload.pinia;
    }
    return {
      provide: {
        pinia
      }
    };
  },
  hooks: {
    "app:rendered"() {
      const nuxtApp = useNuxtApp();
      nuxtApp.payload.pinia = toRaw(nuxtApp.$pinia).state.value;
      setActivePinia(void 0);
    }
  }
});
function useSiteConfig(options) {
  const stack = useRequestEvent()?.context.siteConfig.get(defu({ resolveRefs: true }, options));
  delete stack._priority;
  return stack;
}
const siteConfig_vuqmRkLAUZxQvb5pvUwT3uUdVggfjhj1m5v7Pb6IE0w = /* @__PURE__ */ defineNuxtPlugin(() => {
  const head = injectHead();
  if (!head)
    return;
  const siteConfig = useSiteConfig();
  const input = {
    meta: [],
    templateParams: {
      site: siteConfig,
      // support legacy
      siteUrl: siteConfig.url,
      siteName: siteConfig.name
    }
  };
  if (siteConfig.separator)
    input.templateParams.separator = siteConfig.separator;
  if (siteConfig.titleSeparator)
    input.templateParams.titleSeparator = siteConfig.titleSeparator;
  if (siteConfig.description) {
    input.templateParams.siteDescription = siteConfig.description;
    input.meta.push(
      {
        name: "description",
        content: "%site.description",
        tagPriority: "low"
      }
    );
  }
  head.push(input);
});
const inferSeoMetaPlugin_KsEotgC9NJyW_guR_3z04hFN8TI2h5dgP8bzHmpMm5o = /* @__PURE__ */ defineNuxtPlugin(() => {
  const head = injectHead();
  if (!head)
    return;
  head.use(TemplateParamsPlugin$1);
  head.use(InferSeoMetaPlugin());
});
const titles_Fth_MAhm7dgpxeTaMXibYXbcCjegjWK3QH9gKvbTRVg = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt-seo:fallback-titles",
  env: {
    islands: false
  },
  setup() {
    const route = useRoute();
    const err = /* @__PURE__ */ useError();
    const title = computed(() => {
      if (err.value && [404, 500].includes(err.value?.statusCode)) {
        return `${err.value.statusCode} - ${err.value.message}`;
      }
      if (typeof route.meta?.title === "string")
        return route.meta?.title;
      const path = withoutTrailingSlash(route.path || "/");
      const lastSegment = path.split("/").pop();
      return lastSegment ? titleCase(lastSegment) : null;
    });
    const minimalPriority = {
      // give nuxt.config values higher priority
      tagPriority: 101
    };
    useHead({ title: () => title.value }, minimalPriority);
  }
});
function useSchemaOrgConfig() {
  const runtimeConfig = /* @__PURE__ */ useRuntimeConfig();
  return defu(runtimeConfig["nuxt-schema-org"], {
    scriptAttributes: {}
  });
}
function useSchemaOrg(input) {
  const config = useSchemaOrgConfig();
  const script = {
    type: "application/ld+json",
    key: "schema-org-graph",
    // @ts-expect-error untyped
    nodes: input,
    tagPriority: "high",
    ...config.scriptAttributes
  };
  {
    return useHead({
      script: [script]
    });
  }
}
function resolveSitePath(pathOrUrl, options) {
  let path = pathOrUrl;
  if (hasProtocol(pathOrUrl, { strict: false, acceptRelative: true })) {
    const parsed = parseURL(pathOrUrl);
    path = parsed.pathname;
  }
  const base = withLeadingSlash(options.base || "/");
  if (base !== "/" && path.startsWith(base)) {
    path = path.slice(base.length);
  }
  let origin = withoutTrailingSlash(options.absolute ? options.siteUrl : "");
  if (base !== "/" && origin.endsWith(base)) {
    origin = origin.slice(0, origin.indexOf(base));
  }
  const baseWithOrigin = options.withBase ? withBase(base, origin || "/") : origin;
  const resolvedUrl = withBase(path, baseWithOrigin);
  return path === "/" && !options.withBase ? withTrailingSlash(resolvedUrl) : fixSlashes(options.trailingSlash, resolvedUrl);
}
const fileExtensions = [
  // Images
  "jpg",
  "jpeg",
  "png",
  "gif",
  "bmp",
  "webp",
  "svg",
  "ico",
  // Documents
  "pdf",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
  "txt",
  "md",
  "markdown",
  // Archives
  "zip",
  "rar",
  "7z",
  "tar",
  "gz",
  // Audio
  "mp3",
  "wav",
  "flac",
  "ogg",
  "opus",
  "m4a",
  "aac",
  "midi",
  "mid",
  // Video
  "mp4",
  "avi",
  "mkv",
  "mov",
  "wmv",
  "flv",
  "webm",
  // Web
  "html",
  "css",
  "js",
  "json",
  "xml",
  "tsx",
  "jsx",
  "ts",
  "vue",
  "svelte",
  "xsl",
  "rss",
  "atom",
  // Programming
  "php",
  "py",
  "rb",
  "java",
  "c",
  "cpp",
  "h",
  "go",
  // Data formats
  "csv",
  "tsv",
  "sql",
  "yaml",
  "yml",
  // Fonts
  "woff",
  "woff2",
  "ttf",
  "otf",
  "eot",
  // Executables/Binaries
  "exe",
  "msi",
  "apk",
  "ipa",
  "dmg",
  "iso",
  "bin",
  // Scripts/Config
  "bat",
  "cmd",
  "sh",
  "env",
  "htaccess",
  "conf",
  "toml",
  "ini",
  // Package formats
  "deb",
  "rpm",
  "jar",
  "war",
  // E-books
  "epub",
  "mobi",
  // Common temporary/backup files
  "log",
  "tmp",
  "bak",
  "old",
  "sav"
];
function isPathFile(path) {
  const lastSegment = path.split("/").pop();
  const ext = (lastSegment || path).match(/\.[0-9a-z]+$/i)?.[0];
  return ext && fileExtensions.includes(ext.replace(".", ""));
}
function fixSlashes(trailingSlash, pathOrUrl) {
  const $url = parseURL(pathOrUrl);
  if (isPathFile($url.pathname))
    return pathOrUrl;
  const fixedPath = trailingSlash ? withTrailingSlash($url.pathname) : withoutTrailingSlash($url.pathname);
  return `${$url.protocol ? `${$url.protocol}//` : ""}${$url.host || ""}${fixedPath}${$url.search || ""}${$url.hash || ""}`;
}
function getNitroOrigin(e) {
  {
    e = e || useRequestEvent();
    return e?.context?.siteConfigNitroOrigin || "";
  }
}
function useNitroOrigin(e) {
  return getNitroOrigin(e);
}
function createSitePathResolver(options = {}) {
  const siteConfig = useSiteConfig();
  const nitroOrigin = useNitroOrigin();
  const nuxtBase = (/* @__PURE__ */ useRuntimeConfig()).app.baseURL || "/";
  return (path) => {
    return computed(() => resolveSitePath(unref(path), {
      absolute: unref(options.absolute),
      withBase: unref(options.withBase),
      siteUrl: unref(options.canonical) !== false || false ? siteConfig.url : nitroOrigin,
      trailingSlash: siteConfig.trailingSlash,
      base: nuxtBase
    }));
  };
}
function withSiteUrl(path, options = {}) {
  const siteConfig = useSiteConfig();
  const nitroOrigin = useNitroOrigin();
  const base = (/* @__PURE__ */ useRuntimeConfig()).app.baseURL || "/";
  return computed(() => {
    return resolveSitePath(unref(path), {
      absolute: true,
      siteUrl: unref(options.canonical) !== false || false ? siteConfig.url : nitroOrigin,
      trailingSlash: siteConfig.trailingSlash,
      base,
      withBase: unref(options.withBase)
    });
  });
}
function initPlugin(nuxtApp) {
  const head = injectHead();
  const config = useSchemaOrgConfig();
  const route = useRoute();
  const siteConfig = useSiteConfig();
  const resolvePath = createSitePathResolver({
    absolute: false,
    withBase: true
  });
  const resolveUrl = createSitePathResolver({
    canonical: true,
    absolute: true,
    withBase: true
  });
  const schemaOrg = computed(() => {
    const siteConfigResolved = {};
    for (const key in siteConfig) {
      if (key.startsWith("_")) {
        continue;
      }
      siteConfigResolved[key] = toValue(siteConfig[key]);
      if (typeof siteConfigResolved[key] === "object") {
        for (const k in siteConfigResolved[key]) {
          siteConfigResolved[key][k] = toValue(siteConfigResolved[key][k]);
        }
      }
    }
    return {
      ...route.meta?.schemaOrg || {},
      ...siteConfigResolved,
      url: toValue(resolveUrl(route.path)),
      host: withTrailingSlash(siteConfigResolved.url),
      inLanguage: toValue(siteConfigResolved.currentLocale) || toValue(siteConfigResolved.defaultLocale),
      path: toValue(resolvePath(route.path))
    };
  });
  const templateParamEntry = useHead({
    templateParams: { schemaOrg: schemaOrg.value }
  });
  watch(() => siteConfig, () => {
    templateParamEntry.patch({
      templateParams: { schemaOrg: schemaOrg.value }
    });
  }, { deep: true });
  head.use(
    SchemaOrgUnheadPlugin({}, async () => {
      const meta = {};
      await nuxtApp.hooks.callHook("schema-org:meta", meta);
      return meta;
    }, {
      minify: config.minify,
      trailingSlash: siteConfig.trailingSlash
    })
  );
}
function maybeAddIdentitySchemaOrg() {
  const config = useSchemaOrgConfig();
  const siteConfig = useSiteConfig({
    resolveRefs: true
  });
  if (config.identity || siteConfig.identity) {
    const identity = config.identity || siteConfig.identity;
    let identityPayload = {
      name: () => toValue(siteConfig.name),
      url: () => toValue(siteConfig.url)
    };
    let identityType;
    if (typeof identity !== "string") {
      identityPayload = {
        ...identityPayload,
        ...identity
      };
      identityType = identity.type;
      delete identityPayload.type;
    } else {
      identityType = identity;
    }
    if (siteConfig.twitter) {
      const id = siteConfig.twitter.startsWith("@") ? siteConfig.twitter.slice(1) : siteConfig.twitter;
      identityPayload.sameAs = [
        `https://twitter.com/${id}`
      ];
    }
    identityPayload._resolver = identityPayload._resolver || camelCase(identityType);
    useSchemaOrg([identityPayload]);
  }
}
const defaults_ZjgoYqsIrjWNaJMfDhci2B0eoNnvY4CDsoscm0L1fE0 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt-schema-org:defaults",
  dependsOn: [
    "nuxt-schema-org:init"
  ],
  setup() {
    const error = /* @__PURE__ */ useError();
    if (error.value?.error) {
      return;
    }
    const siteConfig = useSiteConfig();
    useSchemaOrg([
      defineWebSite({
        name: () => toValue(siteConfig.name) || "",
        inLanguage: () => toValue(siteConfig.currentLocale) || "",
        description: () => toValue(siteConfig.description) || ""
      }),
      defineWebPage()
    ]);
    maybeAddIdentitySchemaOrg();
  }
});
const init_Ks1wcI1vuv3K3FXG7iAYRqIWlPli19G_eByed0tsXe0 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt-schema-org:init",
  setup(nuxtApp) {
    initPlugin(nuxtApp);
  }
});
const componentNames = [{ "hash": "SOHaoKfoo4fUkREsCFGw8ewxkl4-XkkHkug2VwYRtFM", "pascalName": "BrandedLogo", "kebabName": "branded-logo", "path": "C:/Users/Admin/Projects/printy/printy_ui/node_modules/nuxt-og-image/dist/runtime/app/components/Templates/Community/BrandedLogo.vue", "category": "community" }, { "hash": "tFoYPh0fXaZR3uXybAqFEOGnQuQsvz-E-Yq-CtrFlIY", "pascalName": "Frame", "kebabName": "frame", "path": "C:/Users/Admin/Projects/printy/printy_ui/node_modules/nuxt-og-image/dist/runtime/app/components/Templates/Community/Frame.vue", "category": "community" }, { "hash": "NPQTTXYQ8toXx5OaJ1VlRUUcxy1SNOxg-FoM7C08ZPM", "pascalName": "Nuxt", "kebabName": "nuxt", "path": "C:/Users/Admin/Projects/printy/printy_ui/node_modules/nuxt-og-image/dist/runtime/app/components/Templates/Community/Nuxt.vue", "category": "community" }, { "hash": "VAHSTZlVcPHzkozocV1iTnwc4-YttdoOkHsYfoSgDZ4", "pascalName": "NuxtSeo", "kebabName": "nuxt-seo", "path": "C:/Users/Admin/Projects/printy/printy_ui/node_modules/nuxt-og-image/dist/runtime/app/components/Templates/Community/NuxtSeo.vue", "category": "community" }, { "hash": "8CNn4yU043gQFqO-sZNDPz9GKED-h7ahXJ-61c9ThHM", "pascalName": "Pergel", "kebabName": "pergel", "path": "C:/Users/Admin/Projects/printy/printy_ui/node_modules/nuxt-og-image/dist/runtime/app/components/Templates/Community/Pergel.vue", "category": "community" }, { "hash": "b-Juo-FXQepo6SOCnA478MTAqbXNZuve6-MzHgTKA7s", "pascalName": "SimpleBlog", "kebabName": "simple-blog", "path": "C:/Users/Admin/Projects/printy/printy_ui/node_modules/nuxt-og-image/dist/runtime/app/components/Templates/Community/SimpleBlog.vue", "category": "community" }, { "hash": "vRUm5ru-64PEHIGsBby6-vCgLBg7iUJfvFKL6VuCXtI", "pascalName": "UnJs", "kebabName": "un-js", "path": "C:/Users/Admin/Projects/printy/printy_ui/node_modules/nuxt-og-image/dist/runtime/app/components/Templates/Community/UnJs.vue", "category": "community" }, { "hash": "hq07GBU-Yd16ICfETt8SfSxfaYj3qBmDAiQkTcv89nw", "pascalName": "Wave", "kebabName": "wave", "path": "C:/Users/Admin/Projects/printy/printy_ui/node_modules/nuxt-og-image/dist/runtime/app/components/Templates/Community/Wave.vue", "category": "community" }, { "hash": "zSwOodBXcjwS1qvFqGBJqitTEEnrvVfwQYkTeIxNpws", "pascalName": "WithEmoji", "kebabName": "with-emoji", "path": "C:/Users/Admin/Projects/printy/printy_ui/node_modules/nuxt-og-image/dist/runtime/app/components/Templates/Community/WithEmoji.vue", "category": "community" }];
function generateMeta(url, resolvedOptions) {
  const meta = [
    { property: "og:image", content: url },
    { property: "og:image:type", content: () => `image/${getExtension(toValue(url)) || resolvedOptions.extension}` },
    { name: "twitter:card", content: "summary_large_image" },
    // we don't need this but avoids issue when using useSeoMeta({ twitterImage })
    { name: "twitter:image", content: url },
    { name: "twitter:image:src", content: url }
  ];
  if (resolvedOptions.width) {
    meta.push({ property: "og:image:width", content: resolvedOptions.width });
    meta.push({ name: "twitter:image:width", content: resolvedOptions.width });
  }
  if (resolvedOptions.height) {
    meta.push({ property: "og:image:height", content: resolvedOptions.height });
    meta.push({ name: "twitter:image:height", content: resolvedOptions.height });
  }
  if (resolvedOptions.alt) {
    meta.push({ property: "og:image:alt", content: resolvedOptions.alt });
    meta.push({ name: "twitter:image:alt", content: resolvedOptions.alt });
  }
  return meta;
}
function isInternalRoute(path) {
  return path.startsWith("/_") || path.startsWith("@");
}
function filterIsOgImageOption(key) {
  const keys = [
    "url",
    "extension",
    "width",
    "height",
    "fonts",
    "alt",
    "props",
    "renderer",
    "html",
    "component",
    "renderer",
    "emojis",
    "_query",
    "satori",
    "resvg",
    "sharp",
    "screenshot",
    "cacheMaxAgeSeconds"
  ];
  return keys.includes(key);
}
function separateProps(options, ignoreKeys = []) {
  options = options || {};
  const _props = defu(options.props, Object.fromEntries(
    Object.entries({ ...options }).filter(([k]) => !filterIsOgImageOption(k) && !ignoreKeys.includes(k))
  ));
  const props = {};
  Object.entries(_props).forEach(([key, val]) => {
    props[key.replace(/-([a-z])/g, (g) => String(g[1]).toUpperCase())] = val;
  });
  return {
    ...Object.fromEntries(
      Object.entries({ ...options }).filter(([k]) => filterIsOgImageOption(k) || ignoreKeys.includes(k))
    ),
    props
  };
}
function withoutQuery(path) {
  return path.split("?")[0];
}
function getExtension(path) {
  path = withoutQuery(path);
  const lastSegment = path.split("/").pop() || path;
  const extension = lastSegment.split(".").pop() || lastSegment;
  if (extension === "jpg")
    return "jpeg";
  return extension;
}
function createOgImageMeta(src, input, ssrContext) {
  const { defaults } = useOgImageRuntimeConfig();
  const _input = separateProps(defu(input, ssrContext._ogImagePayload));
  if (input._query && Object.keys(input._query).length)
    src = withQuery(src, { _query: input._query });
  const meta = generateMeta(src, input);
  ssrContext._ogImageInstances = ssrContext._ogImageInstances || [];
  const script = [];
  if (src) {
    script.push({
      id: "nuxt-og-image-options",
      type: "application/json",
      processTemplateParams: true,
      innerHTML: () => {
        const payload = resolveUnrefHeadInput(_input);
        if (payload.props && typeof payload.props.title === "undefined")
          payload.props.title = "%s";
        payload.component = resolveComponentName(input.component, defaults.component || "");
        delete payload.url;
        if (payload._query && Object.keys(payload._query).length === 0) {
          delete payload._query;
        }
        const final = {};
        for (const k in payload) {
          if (payload[k] !== defaults[k]) {
            final[k] = payload[k];
          }
        }
        return stringify(final);
      },
      // we want this to be last in our head
      tagPosition: "bodyClose"
    });
  }
  const instance = useHead({
    script,
    meta
  }, {
    tagPriority: "high"
  });
  ssrContext._ogImagePayload = _input;
  ssrContext._ogImageInstances.push(instance);
}
function resolveComponentName(component, fallback) {
  component = component || fallback || componentNames?.[0]?.pascalName;
  if (component && componentNames) {
    const originalName = component;
    for (const component2 of componentNames) {
      if (component2.pascalName.endsWith(originalName) || component2.kebabName.endsWith(originalName)) {
        return component2.pascalName;
      }
    }
  }
  return component;
}
function getOgImagePath(pagePath, _options) {
  const baseURL2 = (/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
  const extension = _options?.extension || useOgImageRuntimeConfig().defaults?.extension || "png";
  const path = joinURL("/", baseURL2, `__og-image__/${"image"}`, pagePath, `og.${extension}`);
  if (Object.keys(_options?._query || {}).length) {
    return withQuery(path, _options._query);
  }
  return path;
}
function useOgImageRuntimeConfig() {
  const c = /* @__PURE__ */ useRuntimeConfig();
  return {
    defaults: {},
    ...c["nuxt-og-image"],
    app: {
      baseURL: c.app.baseURL
    }
  };
}
function ogImageCanonicalUrls(nuxtApp) {
  nuxtApp.hooks.hook("app:rendered", async (ctx) => {
    const { ssrContext } = ctx;
    const e = useRequestEvent();
    const path = parseURL(e?.path || "").pathname;
    if (isInternalRoute(path))
      return;
    ssrContext?.head.use(TemplateParamsPlugin$1);
    ssrContext?.head.use({
      key: "nuxt-og-image:overrides-and-canonical-urls",
      hooks: {
        "tags:resolve": async (ctx2) => {
          const hasPrimaryPayload = ctx2.tags.some((tag) => tag.tag === "script" && tag.props.id === "nuxt-og-image-options");
          let overrides;
          for (const tag of ctx2.tags) {
            if (tag.tag === "script" && tag.props.id === "nuxt-og-image-overrides") {
              if (hasPrimaryPayload) {
                overrides = separateProps(parse(tag.innerHTML || "{}"));
                delete ctx2.tags[ctx2.tags.indexOf(tag)];
              } else {
                tag.props.id = "nuxt-og-image-options";
                tag.innerHTML = stringify(separateProps(parse(tag.innerHTML || "{}")));
                tag._d = "script:id:nuxt-og-image-options";
              }
              break;
            }
          }
          ctx2.tags = ctx2.tags.filter(Boolean);
          for (const tag of ctx2.tags) {
            if (tag.tag === "meta" && (tag.props.property === "og:image" || ["twitter:image:src", "twitter:image"].includes(tag.props.name || ""))) {
              if (!tag.props.content) {
                tag.props = {};
                continue;
              }
              if (!tag.props.content?.startsWith("https")) {
                await nuxtApp.runWithContext(() => {
                  tag.props.content = toValue(withSiteUrl(tag.props.content || "", {
                    withBase: true
                  }));
                });
              }
            } else if (overrides && tag.tag === "script" && tag.props.id === "nuxt-og-image-options") {
              tag.innerHTML = stringify(defu(overrides, parse(tag.innerHTML || "{}")));
            }
          }
        }
      }
    });
  });
}
function routeRuleOgImage(nuxtApp) {
  nuxtApp.hooks.hook("app:rendered", async (ctx) => {
    const { ssrContext } = ctx;
    const e = useRequestEvent();
    const path = parseURL(e?.path || "").pathname;
    if (isInternalRoute(path))
      return;
    const _routeRulesMatcher2 = toRouteMatcher(
      createRouter$1({ routes: ssrContext?.runtimeConfig?.nitro?.routeRules })
    );
    const matchedRules = _routeRulesMatcher2.matchAll(
      withoutBase(path.split("?")?.[0] || "", ssrContext?.runtimeConfig?.app.baseURL || "")
    ).reverse();
    const combinedRules = defu({}, ...matchedRules);
    let routeRules = combinedRules?.ogImage;
    if (typeof routeRules === "undefined")
      return;
    const ogImageInstances = nuxtApp.ssrContext._ogImageInstances || [];
    if (routeRules === false) {
      ogImageInstances?.forEach((e2) => {
        e2.dispose();
      });
      nuxtApp.ssrContext._ogImagePayload = void 0;
      nuxtApp.ssrContext._ogImageInstances = void 0;
      return;
    }
    routeRules = defu(nuxtApp.ssrContext?.event?.context._nitro?.routeRules?.ogImage, routeRules);
    const src = getOgImagePath(ssrContext.url, routeRules);
    createOgImageMeta(src, routeRules, nuxtApp.ssrContext);
  });
}
const og_image_canonical_urls_server_2uCBKzWxjEK91fSFBdBNPEWilWXRzR66cHJvjIi4FGA = /* @__PURE__ */ defineNuxtPlugin({
  setup(nuxtApp) {
    ogImageCanonicalUrls(nuxtApp);
  }
});
const route_rule_og_image_server_yrHfzNQxtCKZyHaGhWqsbaa4V0Y5WoBOo3_wqkmh41k = /* @__PURE__ */ defineNuxtPlugin({
  setup(nuxtApp) {
    routeRuleOgImage(nuxtApp);
  }
});
const robot_meta_server_bRHpso_4KN_Ec3RJzqCvbuvfZsNOeE_4TgpL8dCNuwk = /* @__PURE__ */ defineNuxtPlugin({
  setup() {
    const event = useRequestEvent();
    const ctx = event?.context?.robots;
    event?.context?.robotsProduction;
    if (!ctx)
      return;
    useHead({
      meta: [
        {
          "name": "robots",
          "content": () => ctx.rule || "",
          "data-hint": () => void 0,
          "data-production-content": () => void 0
        }
      ]
    });
  }
});
const LazyIcon = defineAsyncComponent(() => Promise.resolve().then(() => index).then((r) => r["default"] || r.default || r));
const lazyGlobalComponents = [
  ["Icon", LazyIcon]
];
const components_plugin_4kY4pyzJIYX99vmMAAIorFf3CnAaptHitJgf7JxiED8 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:global-components",
  setup(nuxtApp) {
    for (const [name, component] of lazyGlobalComponents) {
      nuxtApp.vueApp.component(name, component);
      nuxtApp.vueApp.component("Lazy" + name, component);
    }
  }
});
const plugin_MeUvTuoKUi51yb_kBguab6hdcExVXeTtZtTg9TZZBB8 = /* @__PURE__ */ defineNuxtPlugin({
  name: "@nuxt/icon",
  setup() {
    const configs = /* @__PURE__ */ useRuntimeConfig();
    const options = useAppConfig().icon;
    _api.setFetch($fetch.native);
    const resources = [];
    if (options.provider === "server") {
      const baseURL2 = configs.app?.baseURL?.replace(/\/$/, "") ?? "";
      resources.push(baseURL2 + (options.localApiEndpoint || "/api/_nuxt_icon"));
      if (options.fallbackToApi === true || options.fallbackToApi === "client-only") {
        resources.push(options.iconifyApiEndpoint);
      }
    } else if (options.provider === "none") {
      _api.setFetch(() => Promise.resolve(new Response()));
    } else {
      resources.push(options.iconifyApiEndpoint);
    }
    async function customIconLoader(icons, prefix) {
      try {
        const data = await $fetch(resources[0] + "/" + prefix + ".json", {
          query: {
            icons: icons.join(",")
          }
        });
        if (!data || data.prefix !== prefix || !data.icons)
          throw new Error("Invalid data" + JSON.stringify(data));
        return data;
      } catch (e) {
        console.error("Failed to load custom icons", e);
        return null;
      }
    }
    addAPIProvider("", { resources });
    for (const prefix of options.customCollections || []) {
      if (prefix)
        setCustomIconsLoader(customIconLoader, prefix);
    }
  }
  // For type portability
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
});
const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
function getColor(color, shade) {
  if (color in colors && typeof colors[color] === "object" && shade in colors[color]) {
    return colors[color][shade];
  }
  return "";
}
function generateShades(key, value, prefix) {
  const prefixStr = prefix ? `${prefix}-` : "";
  return `${shades.map((shade) => `--ui-color-${key}-${shade}: var(--${prefixStr}color-${value === "neutral" ? "old-neutral" : value}-${shade}, ${getColor(value, shade)});`).join("\n  ")}`;
}
function generateColor(key, shade) {
  return `--ui-${key}: var(--ui-color-${key}-${shade});`;
}
const colors_E7kSti5pGZ28QhUUurq6gGRU3l65WuXO_KJC3GQgzFo = /* @__PURE__ */ defineNuxtPlugin(() => {
  const appConfig2 = useAppConfig();
  useNuxtApp();
  const root = computed(() => {
    const { neutral, ...colors2 } = appConfig2.ui.colors;
    const prefix = appConfig2.ui.prefix;
    return `@layer theme {
  :root, :host {
  ${Object.entries(appConfig2.ui.colors).map(([key, value]) => generateShades(key, value, prefix)).join("\n  ")}
  }
  :root, :host, .light {
  ${Object.keys(colors2).map((key) => generateColor(key, 500)).join("\n  ")}
  }
  .dark {
  ${Object.keys(colors2).map((key) => generateColor(key, 400)).join("\n  ")}
  }
}`;
  });
  const headData = {
    style: [{
      innerHTML: () => root.value,
      tagPriority: -2,
      id: "nuxt-ui-colors"
    }]
  };
  useHead(headData);
});
const preference = "system";
const plugin_server_9Ca9_HhnjAGwBWpwAydRauMHxWoxTDY60BrArRnXN_A = /* @__PURE__ */ defineNuxtPlugin((nuxtApp) => {
  const colorMode = nuxtApp.ssrContext?.islandContext ? ref({}) : useState("color-mode", () => reactive({
    preference,
    value: preference,
    unknown: true,
    forced: false
  })).value;
  const htmlAttrs = {};
  {
    useHead({ htmlAttrs });
  }
  useRouter().afterEach((to) => {
    const forcedColorMode = to.meta.colorMode;
    if (forcedColorMode && forcedColorMode !== "system") {
      colorMode.value = htmlAttrs["data-color-mode-forced"] = forcedColorMode;
      colorMode.forced = true;
    } else if (forcedColorMode === "system") {
      console.warn("You cannot force the colorMode to system at the page level.");
    }
  });
  nuxtApp.provide("colorMode", colorMode);
});
function usePersistedstateCookies(cookieOptions) {
  return {
    getItem: (key) => cookieOptions?.readonly ? useCookie(key, {
      ...cookieOptions,
      encode: encodeURIComponent,
      decode: decodeURIComponent,
      readonly: true
    }).value : useCookie(key, {
      ...cookieOptions,
      encode: encodeURIComponent,
      decode: decodeURIComponent,
      readonly: false
    }).value,
    setItem: (key, value) => {
      if (cookieOptions?.readonly)
        throw new Error("Cannot set a readonly cookie.");
      useCookie(key, {
        ...cookieOptions,
        encode: encodeURIComponent,
        decode: decodeURIComponent,
        readonly: false
      }).value = value;
    }
  };
}
function usePersistedstateLocalStorage() {
  return {
    getItem: (key) => {
      return !useNuxtApp().ssrContext ? localStorage.getItem(key) : null;
    },
    setItem: (key, value) => {
      if (!useNuxtApp().ssrContext)
        localStorage.setItem(key, value);
    }
  };
}
function usePersistedstateSessionStorage() {
  return {
    getItem: (key) => {
      return !useNuxtApp().ssrContext ? sessionStorage.getItem(key) : null;
    },
    setItem: (key, value) => {
      if (!useNuxtApp().ssrContext)
        sessionStorage.setItem(key, value);
    }
  };
}
const persistedState = {
  localStorage: usePersistedstateLocalStorage(),
  sessionStorage: usePersistedstateSessionStorage(),
  cookies: usePersistedstateCookies(),
  cookiesWithOptions: usePersistedstateCookies
};
const plugin_VW0S5L6gti_L2lJP5Fh8KfD6_3GK52P9spdjsc0v3y4 = /* @__PURE__ */ defineNuxtPlugin((nuxtApp) => {
  const {
    cookieOptions,
    debug,
    storage
  } = (/* @__PURE__ */ useRuntimeConfig()).public.persistedState;
  const pinia = nuxtApp.$pinia;
  pinia.use(createPersistedState({
    storage: storage === "cookies" ? persistedState.cookiesWithOptions(cookieOptions) : persistedState[storage],
    debug
  }));
});
const API = {
  // Auth (SimpleJWT / Printy_API)
  auth: {
    token: "auth/token/",
    tokenRefresh: "auth/token/refresh/",
    me: "auth/me/",
    // Legacy / optional
    register: "auth/register/",
    signup: "auth/signup/",
    verifyEmail: "auth/email/verify/",
    resendVerification: "auth/email/resend/",
    forgotPassword: "auth/password/reset/",
    resetConfirm: "auth/password/reset/confirm/"
  },
  analyticsEvents: () => "analytics/events/",
  adminAnalyticsSummary: () => "admin/analytics/summary/",
  adminAnalyticsTimeSeries: () => "admin/analytics/timeseries/",
  adminAnalyticsTopMetrics: () => "admin/analytics/top-metrics/",
  adminAnalyticsFunnel: () => "admin/analytics/funnel/",
  adminAnalyticsLocations: () => "admin/analytics/locations/",
  adminAnalyticsErrors: () => "admin/analytics/errors/",
  // Users
  users: () => "users/",
  userMe: () => "users/me/",
  userDetail: (pk) => `users/${pk}/`,
  // Profiles
  profiles: () => "profiles/",
  profileMe: () => "profiles/me/",
  profileAvatarUpload: () => "profiles/me/avatar/",
  // Notifications (me)
  notifications: () => "me/notifications/",
  notificationDetail: (id) => `me/notifications/${id}/`,
  notificationMarkRead: (id) => `me/notifications/${id}/mark-read/`,
  notificationMarkAllRead: () => "me/notifications/mark-all-read/",
  notificationUnreadCount: () => "me/notifications/unread-count/",
  notificationActivitySummary: () => "me/notifications/activity-summary/",
  profileDetail: (pk) => `profiles/${pk}/`,
  profileSocialLinks: (profileId) => `profiles/${profileId}/social-links/`,
  // Social links (global)
  socialLinks: () => "social-links/",
  socialLinkDetail: (pk) => `social-links/${pk}/`,
  // Demo calculator — try real shop rate card first, fallback to static
  shopRateCardForCalculator: (slug) => `shops/${slug}/rate-card-for-calculator/`,
  // Legacy demo endpoints (may 404 if demo app not deployed)
  demoTemplates: () => "demo/templates/",
  demoQuote: () => "demo/quote/",
  // Public (Printy_API buyer browsing)
  publicShops: () => "public/shops/",
  publicShopBySlug: (slug) => `public/shops/${slug}/`,
  publicShopCatalog: (slug) => `public/shops/${slug}/catalog/`,
  publicShopCustomOptions: (slug) => `public/shops/${slug}/custom-options/`,
  publicShopCalculatorPreview: (slug) => `public/shops/${slug}/calculator-preview/`,
  publicAllProducts: () => "public/products/",
  publicMatchShops: () => "public/match-shops/",
  // SEO (public, no auth — for sitemap and dynamic pages)
  seoLocations: () => "seo/locations/",
  seoLocationDetail: (slug) => `seo/locations/${slug}/`,
  seoLocationProducts: (slug) => `seo/locations/${slug}/products/`,
  seoProducts: () => "seo/products/",
  seoProductDetail: (slug) => `seo/products/${slug}/`,
  seoLocationProduct: (locationSlug, productSlug) => `seo/locations/${locationSlug}/products/${productSlug}/`,
  seoRoutes: () => "seo/routes/",
  /** Product gallery — categories with products (grouped) */
  productsGallery: () => "products/gallery/",
  /** Gallery product calculate-price (shop-scoped; may require auth) */
  galleryProductCalculatePrice: (shopSlug, productSlug) => `shops/${shopSlug}/gallery/products/${productSlug}/calculate-price/`,
  // Quote drafts (Printy_API buyer — cart-like draft per shop)
  quoteDraftsActive: (shopSlug, fileId) => `quote-drafts/active/?shop=${encodeURIComponent(shopSlug)}${fileId ? `&file=${encodeURIComponent(String(fileId))}` : ""}`,
  calculatorPreview: () => "calculator/preview/",
  calculatorBookletPreview: () => "calculator/booklet-preview/",
  calculatorLargeFormatPreview: () => "calculator/large-format-preview/",
  calculatorDrafts: () => "calculator/drafts/",
  calculatorDraftDetail: (id) => `calculator/drafts/${id}/`,
  calculatorDraftSend: (id) => `calculator/drafts/${id}/send/`,
  quoteDraftItems: (draftId) => `quote-drafts/${draftId}/items/`,
  quoteDraftItemDetail: (draftId, itemId) => `quote-drafts/${draftId}/items/${itemId}/`,
  quoteDraftItemRequestQuote: (draftId, itemId) => `quote-drafts/${draftId}/items/${itemId}/request-quote/`,
  quoteDraftPreviewPrice: (draftId) => `quote-drafts/${draftId}/preview-price/`,
  quoteDraftRequestQuote: (draftId) => `quote-drafts/${draftId}/request-quote/`,
  quoteDraftDownloadPdf: (draftId) => `quote-drafts/${draftId}/download-pdf/`,
  quoteDraftFiles: () => "quote-draft-files/",
  quoteDraftFileDetail: (fileId) => `quote-draft-files/${fileId}/`,
  quoteDraftFileDownloadPdf: (fileId) => `quote-draft-files/${fileId}/download-pdf/`,
  quoteDraftFileWhatsappPreview: (fileId) => `quote-draft-files/${fileId}/whatsapp-preview/`,
  quoteDraftTweakAndAdd: (draftId) => `quote-drafts/${draftId}/tweak-and-add/`,
  tweakedItemDetail: (itemId) => `tweaked-items/${itemId}/`,
  publicProductOptions: (pk) => `public/products/${pk}/options/`,
  // Setup status (printer onboarding)
  setupStatus: () => "setup-status/",
  shopSetupStatus: (slug) => `shops/${slug}/setup-status/`,
  dashboardShopHome: () => "dashboard/shop-home/",
  // Staff quotes API (staff-only)
  staffQuotes: () => "quotes/",
  staffQuoteDetail: (id) => `quotes/${id}/`,
  staffQuoteItems: (quoteId) => `quotes/${quoteId}/items/`,
  staffQuoteItemDetail: (quoteId, itemId) => `quotes/${quoteId}/items/${itemId}/`,
  staffQuoteSend: (quoteId) => `quotes/${quoteId}/send/`,
  staffQuoteWhatsappPreview: (quoteId) => `quotes/${quoteId}/whatsapp-preview/`,
  staffQuoteShare: (quoteId) => `quotes/${quoteId}/share/`,
  // Job requests (JobShare / overflow work)
  jobRequests: () => "job-requests/",
  jobRequestDetail: (id) => `job-requests/${id}/`,
  jobRequestWhatsappShare: (id) => `job-requests/${id}/whatsapp-share/`,
  jobRequestClaims: (id) => `job-requests/${id}/claims/`,
  jobClaims: () => "job-claims/",
  jobClaimDetail: (id) => `job-claims/${id}/`,
  jobClaimAccept: (id) => `job-claims/${id}/accept/`,
  jobClaimReject: (id) => `job-claims/${id}/reject/`,
  publicJob: (token) => `public/job/${token}/`,
  // Quote calculator (staff-only, live preview)
  calculatorQuoteItem: () => "calculator/quote-item/",
  // Quote requests (customer flow)
  quoteRequests: () => "quote-requests/",
  quoteRequestDetail: (id) => `quote-requests/${id}/`,
  quoteRequestSubmit: (id) => `quote-requests/${id}/submit/`,
  quoteRequestResponses: (id) => `quote-requests/${id}/responses/`,
  quoteRequestAccept: (id) => `quote-requests/${id}/accept/`,
  quoteRequestReply: (id) => `quote-requests/${id}/reply/`,
  quoteRequestCancel: (id) => `quote-requests/${id}/cancel/`,
  // Shops
  shops: () => "shops/",
  shopsPublic: () => "shops/public/",
  shopsMyShops: () => "shops/my_shops/",
  shopDetail: (slug) => `shops/${slug}/`,
  // Incoming requests (shop flow)
  incomingRequests: (shopSlug) => `shops/${shopSlug}/incoming-requests/`,
  incomingRequestDetail: (shopSlug, requestId) => `shops/${shopSlug}/incoming-requests/${requestId}/`,
  incomingRequestSendQuote: (shopSlug, requestId) => `shops/${shopSlug}/incoming-requests/${requestId}/send-quote/`,
  incomingRequestAccept: (shopSlug, requestId) => `shops/${shopSlug}/incoming-requests/${requestId}/accept-request/`,
  incomingRequestAskQuestion: (shopSlug, requestId) => `shops/${shopSlug}/incoming-requests/${requestId}/ask-question/`,
  incomingRequestReject: (shopSlug, requestId) => `shops/${shopSlug}/incoming-requests/${requestId}/reject-request/`,
  incomingRequestMarkViewed: (shopSlug, requestId) => `shops/${shopSlug}/incoming-requests/${requestId}/mark-viewed/`,
  incomingRequestDecline: (shopSlug, requestId) => `shops/${shopSlug}/incoming-requests/${requestId}/decline/`,
  // Sent quotes (shop flow)
  sentQuotes: () => "sent-quotes/",
  sentQuoteDetail: (id) => `sent-quotes/${id}/`,
  // Seller (Printy_API) — shop-scoped by id
  sellerShopDetail: (id) => `shops/${id}/`,
  sellerShopMachines: (shopId) => `shops/${shopId}/machines/`,
  sellerShopMachineDetail: (shopId, pk) => `shops/${shopId}/machines/${pk}/`,
  sellerShopPapers: (shopId) => `shops/${shopId}/papers/`,
  sellerShopPaperDetail: (shopId, pk) => `shops/${shopId}/papers/${pk}/`,
  sellerShopFinishingRates: (shopId) => `shops/${shopId}/finishing-rates/`,
  sellerShopFinishingRateDetail: (shopId, pk) => `shops/${shopId}/finishing-rates/${pk}/`,
  sellerShopMaterials: (shopId) => `shops/${shopId}/materials/`,
  sellerShopMaterialDetail: (shopId, pk) => `shops/${shopId}/materials/${pk}/`,
  sellerShopProducts: (shopId) => `shops/${shopId}/products/`,
  sellerShopProductDetail: (shopId, pk) => `shops/${shopId}/products/${pk}/`,
  // Slug-based seller resources (prefer over id-based; id returns 404 when shop IDs differ across envs)
  shopProducts: (slug) => `shops/${slug}/products/`,
  shopProductDetail: (slug, pk) => `shops/${slug}/products/${pk}/`,
  shopProductCategories: (slug) => `shops/${slug}/products/categories/`,
  shopProductCategoryDetail: (slug, categorySlug) => `shops/${slug}/products/categories/${encodeURIComponent(categorySlug)}/`,
  shopPapers: (slug) => `shops/${slug}/papers/`,
  shopPapersDetail: (slug, pk) => `shops/${slug}/papers/${pk}/`,
  shopMaterials: (slug) => `shops/${slug}/materials/`,
  shopMaterialDetail: (slug, pk) => `shops/${slug}/materials/${pk}/`,
  shopFinishingRates: (slug) => `shops/${slug}/finishing-rates/`,
  shopFinishingRateDetail: (slug, pk) => `shops/${slug}/finishing-rates/${pk}/`,
  sellerMachinePrintingRates: (machineId) => `machines/${machineId}/printing-rates/`,
  sellerMachinePrintingRateDetail: (machineId, pk) => `machines/${machineId}/printing-rates/${pk}/`,
  shopTransferOwnership: (slug) => `shops/${slug}/transfer_ownership/`,
  shopMembers: (slug) => `shops/${slug}/members/`,
  shopMemberDetail: (slug, pk) => `shops/${slug}/members/${pk}/`,
  shopHours: (slug) => `shops/${slug}/hours/`,
  shopHoursBulk: (slug) => `shops/${slug}/hours/bulk/`,
  shopHoursDetail: (slug, pk) => `shops/${slug}/hours/${pk}/`,
  shopSocialLinks: (slug) => `shops/${slug}/social-links/`,
  shopSocialLinkDetail: (slug, pk) => `shops/${slug}/social-links/${pk}/`,
  shopsNearby: () => "shops-nearby/",
  // Finishing categories (global)
  finishingCategories: () => "finishing-categories/",
  finishingCategoryDetail: (slug) => `finishing-categories/${slug}/`,
  // Product images
  shopProductImages: (shopSlug, productPk) => `shops/${shopSlug}/products/${productPk}/images/`,
  shopProductImageDetail: (shopSlug, productPk, imagePk) => `shops/${shopSlug}/products/${productPk}/images/${imagePk}/`,
  // Quotes
  shopQuotes: (slug) => `shops/${slug}/quotes/`,
  shopQuoteDetail: (slug, pk) => `shops/${slug}/quotes/${pk}/`,
  shopQuoteCalculate: (slug, pk) => `shops/${slug}/quotes/${pk}/calculate/`,
  shopQuoteUpdateStatus: (slug, pk) => `shops/${slug}/quotes/${pk}/update-status/`,
  shopQuoteDuplicate: (slug, pk) => `shops/${slug}/quotes/${pk}/duplicate/`,
  shopQuoteItems: (slug, quoteId) => `shops/${slug}/quotes/${quoteId}/items/`,
  shopQuoteItemDetail: (slug, quoteId, pk) => `shops/${slug}/quotes/${quoteId}/items/${pk}/`,
  requestQuote: (slug) => `shops/${slug}/request-quote/`,
  myQuotes: () => "my-quotes/",
  // Favorites (buyer) — use me/favorites/ for add, me/favorites/{id}/ for remove
  meFavorites: () => "me/favorites/",
  meFavoriteDetail: (shopId) => `me/favorites/${shopId}/`,
  // Ratings
  shopRate: (shopId) => `shops/${shopId}/rate/`,
  publicShopRatingSummary: (slug) => `public/shops/${slug}/rating-summary/`,
  // Templates (catalog) — public
  templates: () => "templates/",
  templateCategories: () => "templates/categories/",
  templateDetail: (slug) => `templates/${slug}/`,
  templateCalculatePrice: (slug) => `templates/${slug}/calculate-price/`,
  // Claims
  claims: () => "claims/",
  claimDetail: (pk) => `claims/${pk}/`,
  claimVerify: () => "claims/verify/",
  claimReview: (pk) => `claims/${pk}/review/`,
  // Pricing - Public (no auth required)
  shopRateCard: (slug) => `shops/${slug}/rate-card/`,
  shopCalculatePrice: (slug) => `shops/${slug}/calculate-price/`,
  // Pricing defaults (read-only templates)
  pricingDefaultsPrinting: () => "pricing/defaults/printing/",
  pricingDefaultsPapers: () => "pricing/defaults/papers/",
  pricingDefaultsMaterials: () => "pricing/defaults/materials/",
  pricingDefaultsFinishing: () => "pricing/defaults/finishing/",
  // Shop pricing seed & status
  shopPricingSeedDefaults: (slug) => `shops/${slug}/pricing/seed-defaults/`,
  shopPricingStatus: (slug) => `shops/${slug}/pricing/status/`,
  // Pricing - Management (shop owner)
  shopPrintingPrices: (slug) => `shops/${slug}/pricing/printing-prices/`,
  shopPrintingPriceDetail: (slug, pk) => `shops/${slug}/pricing/printing-prices/${pk}/`,
  // Paper (unified: inventory - backend uses papers/)
  shopPaper: (slug) => `shops/${slug}/papers/`,
  shopPaperDetail: (slug, pk) => `shops/${slug}/papers/${pk}/`,
  shopPaperAdjust: (slug, pk) => `shops/${slug}/papers/${pk}/adjust/`,
  // Uses finishing-rates (backend has no pricing/finishing route)
  shopFinishingServices: (slug) => `shops/${slug}/finishing-rates/`,
  shopFinishingServiceDetail: (slug, pk) => `shops/${slug}/finishing-rates/${pk}/`,
  // Materials (backend uses materials/ - large-format pricing)
  shopMaterialPrices: (slug) => `shops/${slug}/materials/`,
  shopMaterialPriceDetail: (slug, pk) => `shops/${slug}/materials/${pk}/`,
  shopVolumeDiscounts: (slug) => `shops/${slug}/pricing/discounts/`,
  shopVolumeDiscountDetail: (slug, pk) => `shops/${slug}/pricing/discounts/${pk}/`,
  // Inventory (machines, materials, paper stock)
  shopMachines: (slug) => `shops/${slug}/machines/`,
  shopMachineDetail: (slug, id) => `shops/${slug}/machines/${id}/`,
  // Legacy material/stock routes removed (use pricing/material-prices for large-format)
  shopPricing: (slug) => `shops/${slug}/pricing/`,
  // Subscription & payments
  shopSubscription: (slug) => `shops/${slug}/subscription/`,
  shopStkPush: (slug) => `shops/${slug}/payments/mpesa/stk-push/`,
  plans: () => "plans/",
  paymentStatus: (id) => `payments/${id}/status/`
};
const AUTH_COOKIE_NAME = "printy_auth";
const REMEMBER_ME_DAYS = 30;
function setCookie(name, value, maxAgeDays) {
  return;
}
const authCookieStorage = {
  getItem(_key) {
    return null;
  },
  setItem(_key, value) {
    try {
      const parsed = JSON.parse(value);
      const rememberMe = !!parsed.rememberMe;
      setCookie(AUTH_COOKIE_NAME, value, rememberMe ? REMEMBER_ME_DAYS : void 0);
    } catch {
    }
  },
  removeItem(_key) {
  }
};
function parseApiError(err, fallback) {
  if (err && typeof err === "object") {
    const e = err;
    const responseData = e.data ?? e.response?._data;
    if (typeof responseData === "object" && responseData !== null) {
      const obj = responseData;
      if (typeof obj.detail === "string") return obj.detail;
      if (Array.isArray(obj.detail)) return obj.detail.join("; ");
      const fieldErrors = Object.entries(obj).filter(([, v]) => Array.isArray(v) || typeof v === "string").map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`).join("; ");
      if (fieldErrors) return fieldErrors;
    }
    if (typeof responseData === "string") return responseData;
    const status = e.statusCode ?? e.status;
    if (status === 403) return "You do not have permission to perform this action.";
    if (status === 404) return "The requested resource was not found.";
    if (status === 500) return "Server error. Please try again later.";
  }
  if (err instanceof Error) return err.message;
  return fallback;
}
function flattenFieldErrors(value, prefix = "", target = {}) {
  if (typeof value === "string") {
    if (prefix) target[prefix] = value;
    return target;
  }
  if (Array.isArray(value)) {
    const stringParts = value.filter((item) => typeof item === "string");
    if (stringParts.length && prefix) {
      target[prefix] = stringParts.join(", ");
      return target;
    }
    value.forEach((item, index2) => {
      if (item && typeof item === "object") {
        flattenFieldErrors(item, prefix ? `${prefix}.${index2}` : String(index2), target);
      }
    });
    return target;
  }
  if (value && typeof value === "object") {
    for (const [key, nested] of Object.entries(value)) {
      const nextPrefix = prefix ? `${prefix}.${key}` : key;
      flattenFieldErrors(nested, nextPrefix, target);
    }
  }
  return target;
}
function flattenMessage(value) {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    const parts = value.map(flattenMessage).filter(Boolean);
    return parts.length ? parts.join(", ") : null;
  }
  if (value && typeof value === "object") {
    const parts = Object.values(value).map(flattenMessage).filter(Boolean);
    return parts.length ? parts.join(", ") : null;
  }
  return null;
}
function extractApiFeedback(err, fallback) {
  const result = {
    message: parseApiError(err, fallback),
    fieldErrors: {}
  };
  if (!err || typeof err !== "object") return result;
  const e = err;
  const responseData = e.data ?? e.response?._data;
  if (!responseData || typeof responseData !== "object" || Array.isArray(responseData)) {
    return result;
  }
  const obj = responseData;
  const fieldErrorsSource = obj.field_errors && typeof obj.field_errors === "object" && !Array.isArray(obj.field_errors) ? obj.field_errors : null;
  if (fieldErrorsSource) {
    result.fieldErrors = flattenFieldErrors(fieldErrorsSource);
  }
  for (const [key, value] of Object.entries(obj)) {
    if (key === "detail" || key === "field_errors" || key === "code" || key === "reason" || key === "suggestions") continue;
    const message = flattenMessage(value);
    if (!message) continue;
    if (key === "non_field_errors") {
      result.message = message;
      continue;
    }
    if (!result.fieldErrors[key]) {
      result.fieldErrors[key] = message;
    }
  }
  if (!result.message && Object.keys(result.fieldErrors).length) {
    result.message = Object.values(result.fieldErrors)[0];
  }
  return result;
}
const SEEN_TTL_MS = 5e3;
const seen = /* @__PURE__ */ new Map();
function fingerprint(err) {
  if (err instanceof Error) {
    const stack = err.stack ?? "";
    const msg = err.message ?? "";
    return `${msg}|${stack.slice(0, 200)}`;
  }
  return String(err);
}
function prune() {
  const now = Date.now();
  for (const [key, ts] of seen) {
    if (now - ts > SEEN_TTL_MS) seen.delete(key);
  }
}
function safeLogError(err, context) {
  const key = fingerprint(err);
  const now = Date.now();
  prune();
  if (seen.has(key)) return;
  seen.set(key, now);
  const prefix = context ? `[${context}] ` : "";
  if (err instanceof Error) {
    console.error(prefix + err.message, err);
  } else {
    console.error(prefix + String(err));
  }
}
const AUTH_STORAGE_KEY = "auth";
function extractErrorMessage(err, rateLimitStatus, rateLimitMessage) {
  if (err && typeof err === "object") {
    const e = err;
    if (e.statusCode === rateLimitStatus || e.status === rateLimitStatus) return rateLimitMessage;
    const data = e.data ?? e.response?._data;
    if (data && typeof data === "object") {
      if (typeof data.detail === "string") return data.detail;
      const first = Object.values(data).flat().find((v) => typeof v === "string");
      if (first) return first;
    }
  }
  return err instanceof Error ? err.message : "Login failed";
}
function normalizeLoginError(err) {
  const message = parseApiError(err, "We could not sign you in right now. Please try again in a moment.");
  const normalized = message.toLowerCase();
  if (normalized.includes("no active account found")) {
    return "Incorrect email or password.";
  }
  if (normalized.includes("email") && normalized.includes("verify")) {
    return "Please verify your email before signing in.";
  }
  if (normalized.includes("server error")) {
    return "We could not sign you in right now. Please try again in a moment.";
  }
  return message;
}
const useAuthStore = defineStore("auth", () => {
  const api = useApi();
  const accessToken = ref(null);
  const refreshToken = ref(null);
  const user = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const rateLimitUntil = ref(0);
  const rememberMe = ref(true);
  const isAuthenticated = computed(() => !!accessToken.value);
  const normalizedRole = computed(() => {
    const role = user.value?.role;
    if (role === "PRINTER") return "shop_owner";
    if (role === "CUSTOMER") return "client";
    return role ?? null;
  });
  const isClient = computed(() => normalizedRole.value === "client");
  const isShopOwner = computed(() => normalizedRole.value === "shop_owner");
  const isStaffRole = computed(() => normalizedRole.value === "staff");
  async function login(email, password, remember = true) {
    loading.value = true;
    error.value = null;
    rememberMe.value = remember;
    try {
      const response = await api(API.auth.token, {
        method: "POST",
        body: { email, password }
      });
      accessToken.value = response.access;
      refreshToken.value = response.refresh;
      await fetchMe();
      return { success: true };
    } catch (err) {
      const e = err;
      if (e?.statusCode === 429 || e?.status === 429) rateLimitUntil.value = Date.now() + 6e4;
      const message = e?.statusCode === 429 || e?.status === 429 ? extractErrorMessage(err, 429, "Too many requests. Please wait a minute before trying again.") : normalizeLoginError(err);
      error.value = message;
      return { success: false, error: message };
    } finally {
      loading.value = false;
    }
  }
  async function refresh() {
    if (!refreshToken.value) return false;
    try {
      const response = await api(API.auth.tokenRefresh, {
        method: "POST",
        body: { refresh: refreshToken.value }
      });
      accessToken.value = response.access;
      if (response.refresh) refreshToken.value = response.refresh;
      return true;
    } catch {
      logout();
      return false;
    }
  }
  async function fetchMe() {
    if (!accessToken.value) return;
    try {
      user.value = await api(API.auth.me);
    } catch (err) {
      safeLogError(err, "auth.fetchMe");
    }
  }
  function logout() {
    accessToken.value = null;
    refreshToken.value = null;
    user.value = null;
    navigateTo("/auth/login");
  }
  async function signup(credentials) {
    loading.value = true;
    error.value = null;
    try {
      await api(API.auth.register, {
        method: "POST",
        body: {
          email: credentials.email,
          password: credentials.password,
          name: `${credentials.first_name} ${credentials.last_name}`.trim(),
          ...credentials.role ? { role: credentials.role } : {}
        }
      });
      return { success: true, message: "Registration successful. Please sign in." };
    } catch (err) {
      const message = extractApiFeedback(err, "We could not create your account right now.").message;
      error.value = message;
      return { success: false, error: message };
    } finally {
      loading.value = false;
    }
  }
  async function requestPasswordReset(email) {
    error.value = null;
    try {
      await api(API.auth.forgotPassword, { method: "POST", body: { email } });
      return { success: true };
    } catch (err) {
      error.value = extractApiFeedback(err, "We could not send a reset link right now.").message;
      return { success: false, error: error.value };
    }
  }
  async function resetPassword(uid, token, newPassword, newPasswordConfirm) {
    error.value = null;
    try {
      await api(API.auth.resetConfirm, {
        method: "POST",
        body: { uid, token, new_password: newPassword, new_password_confirmation: newPasswordConfirm ?? newPassword }
      });
      return { success: true };
    } catch (err) {
      error.value = extractApiFeedback(err, "We could not reset your password right now.").message;
      return { success: false, error: error.value };
    }
  }
  return {
    accessToken,
    refreshToken,
    user,
    loading,
    error,
    rateLimitUntil,
    rememberMe,
    isAuthenticated,
    normalizedRole,
    isClient,
    isShopOwner,
    isStaffRole,
    login,
    refresh,
    fetchMe,
    logout,
    signup,
    requestPasswordReset,
    resetPassword
  };
}, {
  persist: {
    key: AUTH_STORAGE_KEY,
    storage: authCookieStorage,
    pick: ["accessToken", "refreshToken", "rememberMe"]
  }
});
function createApiClient(baseURL2) {
  let apiClient;
  apiClient = $fetch.create({
    baseURL: baseURL2,
    retry: 0,
    onRequest({ options }) {
      const authStore = useAuthStore();
      const token = authStore.accessToken;
      if (token) {
        const headers = new Headers(options.headers);
        headers.set("Authorization", `Bearer ${token}`);
        options.headers = headers;
      }
    },
    async onResponseError({ response, request, options }) {
      const status = response?.status;
      const url = typeof request === "string" ? request : request?.url ?? "";
      if (status === 401) {
        if (url.includes("auth/token") || url.includes("token/refresh")) return;
        const requestOptions = options;
        if (requestOptions._authRetried) return;
        const authStore = useAuthStore();
        const refreshed = await authStore.refresh();
        if (!refreshed) {
          authStore.logout();
          return;
        }
        return apiClient(request, {
          ...options,
          _authRetried: true
        });
      }
    }
  });
  return apiClient;
}
function createPublicApiClient(baseURL2) {
  return $fetch.create({
    baseURL: baseURL2,
    retry: 0,
    onRequest({ options }) {
      const authStore = useAuthStore();
      const token = authStore.accessToken;
      if (token) {
        const headers = new Headers(options.headers);
        headers.set("Authorization", `Bearer ${token}`);
        options.headers = headers;
      }
    }
  });
}
function createPublicApiNoAuthClient(baseURL2) {
  return $fetch.create({
    baseURL: baseURL2,
    retry: 0
  });
}
function useApi() {
  return useNuxtApp().$api;
}
function usePublicApi() {
  return useNuxtApp().$publicApi;
}
function usePublicApiNoAuth() {
  return useNuxtApp().$publicApiNoAuth;
}
const API_BASE_ERROR = "NUXT_PUBLIC_API_BASE_URL is missing or invalid. Set it in .env (e.g. NUXT_PUBLIC_API_BASE_URL=http://localhost:8000) or in your deployment environment.";
function ensureValidApiBase(apiBase) {
  const url = typeof apiBase === "string" ? apiBase : "";
  if (!url || !url.startsWith("http://") && !url.startsWith("https://")) {
    throw new Error(API_BASE_ERROR);
  }
  return url;
}
const api_84elem0X4yBmBiZUVE7UuQp73h8h21064ANeRANSla4 = /* @__PURE__ */ defineNuxtPlugin(() => {
  const config = /* @__PURE__ */ useRuntimeConfig();
  const apiBase = ensureValidApiBase(config.public.apiBase);
  const api = createApiClient(apiBase);
  const publicApi = createPublicApiClient(apiBase);
  const publicApiNoAuth = createPublicApiNoAuthClient(apiBase);
  return {
    provide: {
      api,
      publicApi,
      publicApiNoAuth
    }
  };
});
const common$1 = { "back": "Back", "cancel": "Cancel", "create": "Create", "copy": "Copy", "view": "View", "refresh": "Refresh", "location": "Location", "deadline": "Deadline", "specs": "Specs", "login": "Log In", "getStarted": "Get Started", "home": "Home", "profile": "Profile", "dashboard": "Dashboard", "metrics": "Metrics", "logout": "Log Out", "myShops": "My Shops", "workspace": "Workspace", "user": "User", "today": "Today", "notProvided": "Not provided", "notSelected": "Not selected", "notSet": "Not set", "none": "None", "saveToWorkspace": "Save to workspace", "settings": "Settings", "alerts": "Alerts", "requests": "Requests", "print": "Print", "email": "Email", "menu": "Menu" };
const language$1 = { "english": "English", "swahili": "Swahili" };
const header$1 = { "tagline": "Your Price, Instantly", "nav": { "gallery": "Products Gallery", "shops": "Shops", "locations": "Locations", "requestsQuotes": "Requests & Quotes" }, "account": { "signedInAs": "Signed in", "shop": "Active shop", "becomeShopOwner": "Become a shop owner", "updating": "Updating...", "updateRoleFailed": "Failed to update role" }, "inbox": { "shopIncoming": "Incoming Requests", "shopMessages": "Messages / Replies", "shopActions": "Pending Quote Actions", "clientQuotes": "New Quotes", "clientReplies": "Shop Replies", "clientUpdates": "Request Updates" } };
const shop$1 = { "breadcrumbs": { "home": "Home", "shops": "Shops", "shop": "Shop" }, "heroDescription": "Configure a real product, review pricing signals, and send the job to this shop with the same workflow used elsewhere in Printy.", "readyForQuotes": "Ready for configurable quotes", "overview": "Shop overview", "quickActions": "Quick actions", "openRequestsWorkspace": "Open your requests workspace", "requestCustomPrint": "Request custom print", "backToShops": "Back to shops", "catalog": "Catalog", "catalogTitle": "Configure a product and send it to this shop", "catalogDescription": "Each card carries real product data from the shop. Open one to tweak quantity, paper, finishing, and other quote options.", "configuredProducts_one": "{count} configured product", "configuredProducts_other": "{count} configured products", "products": "Products", "rating": "Rating", "turnaround": "Turnaround", "askShop": "Ask shop", "new": "New", "fitsOn": "Fits on {value}", "minimumPieces": "Minimum {count} pcs", "configureQuote": "Configure quote", "productCardFallback": "Configured by this shop and ready for live quote adjustments.", "productCardReadySuffix": "Ready for live quote adjustments.", "noProductsTitle": "No products yet", "noProductsDescription": "This shop has not published products to its public catalog yet.", "shopNotFoundTitle": "Shop not found", "shopNotFoundDescription": "The shop you are looking for does not exist or is inactive.", "browseShops": "Browse shops", "workingHours": "Working hours", "closed": "Closed", "dayFallback": "Day {day}", "socialLinks": "Social links", "noSocialLinks": "No social links.", "backToShop": "Back to shop", "requestCustomPrintTitle": "Request custom print", "requestCustomPrintDescription": "Build a request for this shop, then track its progress and any received quote from your requests workspace.", "singleShopCustomRequestTitle": "Single-shop custom request", "singleShopCustomRequestDescription": "Keep the shop fixed, capture a structured custom job spec, and save it into your requests workspace.", "singleShopBookletTitle": "Single-shop booklet request", "singleShopBookletDescription": "Keep the shop fixed, preview booklet pricing, and save the job into your requests workspace.", "singleShopLargeFormatTitle": "Single-shop large-format request", "singleShopLargeFormatDescription": "Keep the shop fixed, preview large-format pricing, and save the job into your requests workspace.", "requestCustomPrintEyebrow": "Request Custom Print", "requestCustomBookletEyebrow": "Request Custom Booklet", "requestLargeFormatEyebrow": "Request Large Format", "addedToDraftTitle": "Added to draft", "addedToDraftDescription": "{name} added to your draft.", "rateThisShop": "Rate this shop", "rateThisShopDescription": "You received a quote from this shop. Share your experience.", "optionalComment": "Optional comment...", "submitRating": "Submit", "ratingThanks": "Thanks for your feedback!", "ratingSubmitted": "Rating submitted", "ratingSubmitFailed": "Could not submit rating", "requestCustomPrintFor": "Request custom print for {shop}", "requestCustomBookletFor": "Request custom booklet for {shop}", "requestLargeFormatFor": "Request large-format print for {shop}", "customPrintModalDescription": "Single-shop public mode keeps the shop fixed, removes send-to-shops UI, and preserves the quote-draft submission flow.", "customBookletModalDescription": "Keep the shop fixed and use the backend booklet preview without leaving this modal flow.", "customLargeFormatModalDescription": "Keep the shop fixed and use the backend large-format preview without leaving this modal flow.", "customPrintRequestEyebrow": "Custom print request", "customBookletRequestEyebrow": "Custom booklet request", "customLargeFormatRequestEyebrow": "Custom large-format request", "addedToQuoteTitle": "Added to quote", "addedToQuoteDescription": "{name} added to your quote.", "signInToSubmitQuote": "Sign in when you are ready to submit this shop quote.", "quoteConfiguration": "Quote Configuration", "configureProduct": "Configure {name}", "productTweakDescription": "This public tweak flow now runs on the shared calculator engine. Machine selection stays hidden in public mode.", "tweakProduct": "Tweak {name}", "tweakFlowDescription": "Shared public calculator mode for tweak and tweak-and-quote flows.", "tweakFlow": "Tweak Flow", "bookletRequestForProduct": "Booklet request for {name}", "bookletFlowDescription": "Switch to booklet mode when the job needs cover, inserts, binding, and booklet-specific pricing.", "bookletFlow": "Booklet Flow", "largeFormatRequestForProduct": "Large-format request for {name}", "largeFormatFlowDescription": "Switch to large-format mode when the job needs area pricing, materials, finishing, and hardware.", "largeFormatFlow": "Large Format Flow", "savedToWorkspaceTitle": "Saved to workspace", "savedToWorkspaceDescription": "Custom request saved to your requests and quotes workspace." };
const workspace$1 = { "clientWorkspace": "Client Workspace", "workspaceSummary": "Workspace Summary", "myQuote": "My Quote", "inbox": "Inbox", "quoteHistory": "Quote History", "account": "Account", "savedShops": "Saved Shops", "browseShops": "Browse Shops", "utility": "Utility", "workspaceSection": "Workspace", "quoteBuilderHelper": "Build, edit, and submit shop-scoped quote items.", "inboxHelper": "Track new quotes, replies, and request updates.", "quoteHistoryHelper": "Review request history and open quote threads.", "accountHelper": "Manage your profile, avatar, and contact details.", "savedShopsHelper": "Return quickly to print shops you want to revisit.", "browseShopsHelper": "Find and compare print shops.", "homeHelper": "Back to the public Printy homepage.", "toggleNavigation": "Toggle workspace navigation", "closeNavigation": "Close workspace navigation", "headerLine": "{name}'s workspace keeps quote building, inbox updates, request history, and account details separate from shop operations." };
const adminWorkspace$1 = { "workspace": "Workspace", "shop": "Shop", "utility": "Utility", "dashboard": "Dashboard", "dashboardHelper": "Owner workspace desk", "setupGuide": "Setup Guide", "setupGuideHelper": "Backend setup status", "requestsQuotes": "Requests & Quotes", "requestsQuotesHelper": "Client request tracking workspace", "metrics": "Metrics", "metricsHelper": "Super-admin analytics dashboard", "shopHome": "Shop Home", "shopHomeHelper": "Selected shop workspace", "incomingRequests": "Incoming Requests", "incomingRequestsHelper": "New requests from clients", "messagesReplies": "Messages / Replies", "messagesRepliesHelper": "Client replies waiting on your team", "pendingQuoteActions": "Pending Quote Actions", "pendingQuoteActionsHelper": "Requests that still need action", "machines": "Machines", "machinesHelper": "Presses and production equipment", "materials": "Materials", "materialsHelper": "Paper stock and material setup", "pricing": "Pricing", "pricingHelper": "Machine and material pricing", "finishing": "Finishing", "finishingHelper": "Per-sheet lamination and post-press pricing", "products": "Products", "productsHelper": "Catalog and product rules", "home": "Home", "homeHelper": "Public homepage", "viewPublicShop": "View Public Shop", "viewCurrentPublicShop": "Open the current shop public page", "viewPublicDirectory": "Open the public shops directory", "signOut": "Sign out", "signOutHelper": "End this session" };
const turnaround$1 = { "onRequest": "On request", "workingHours_one": "{count} working hour", "workingHours_other": "{count} working hours", "workingHoursRange": "{min}-{max} working hours" };
const weekdays$1 = { "1": "Monday", "2": "Tuesday", "3": "Wednesday", "4": "Thursday", "5": "Friday", "6": "Saturday", "7": "Sunday" };
const jobs$1 = { "title": "Jobs", "subtitle": "Production jobs and overflow work sharing", "createTitle": "Create Job Request", "createSubtitle": "Share overflow work with other printers", "requestFallbackTitle": "Job", "requestFallbackSubtitle": "Job request", "tabs": { "open": "Open Jobs", "mine": "My Job Requests", "claims": "My Claims" }, "actions": { "createRequest": "Create Job Request", "browseOpenJobs": "Browse open jobs", "claimThisJob": "Claim this job", "submitClaim": "Submit claim", "accept": "Accept", "reject": "Reject", "shareOnWhatsApp": "Share on WhatsApp", "openWhatsApp": "Open WhatsApp", "signInToClaim": "Sign in to claim", "backToPrinty": "Back to Printy" }, "status": { "OPEN": "Open", "CLAIMED": "Claimed", "CLOSED": "Closed" }, "claimStatus": { "PENDING": "Pending", "ACCEPTED": "Accepted", "REJECTED": "Rejected" }, "fields": { "title": "Title", "productCategory": "Product / Category", "size": "Size", "quantity": "Quantity", "paper": "Paper", "finishing": "Finishing", "messageOptional": "Message (optional)", "priceOfferOptional": "Price offer (optional)" }, "placeholders": { "title": "e.g. Brochure 500 pcs A4", "productCategory": "e.g. Brochure, Business Card", "size": "e.g. A4, 90x55mm", "quantity": "500", "paper": "e.g. 300gsm Gloss", "finishing": "e.g. Lamination, Cutting", "location": "e.g. Nairobi, Westlands", "message": "Short message...", "price": "KES" }, "empty": { "noClaimsTitle": "No claims yet", "noClaimsDescription": "Claims you make on open jobs will appear here.", "noOpenTitle": "No open jobs", "noOwnTitle": "No job requests yet", "noOpenDescription": "Open jobs from other shops will appear here. Create your own to share overflow work.", "noOwnDescription": "Create a job request to share overflow work with other shops." }, "labels": { "claims": "Claims", "share": "Share", "jobNumber": "Job #{id}", "claimCount_one": "{count} claim", "claimCount_other": "{count} claims" }, "feedback": { "loadFailed": "Failed to load jobs", "loadJobFailed": "Failed to load job", "createFailed": "Failed to create", "createSuccess": "Job request created", "titleRequired": "Title is required", "claimSubmitted": "Claim submitted", "claimFailed": "Failed to claim", "claimAccepted": "Claim accepted", "acceptFailed": "Failed to accept", "claimRejected": "Claim rejected", "rejectFailed": "Failed to reject", "shareLinkReady": "Share link ready", "shareFailed": "Failed to get share link", "copied": "Copied to clipboard", "copyFailed": "Could not copy", "jobNotFound": "Job not found" } };
const en$1 = {
  common: common$1,
  language: language$1,
  header: header$1,
  shop: shop$1,
  workspace: workspace$1,
  adminWorkspace: adminWorkspace$1,
  turnaround: turnaround$1,
  weekdays: weekdays$1,
  jobs: jobs$1
};
const common = { "back": "Rudi", "cancel": "Ghairi", "create": "Tengeneza", "copy": "Nakili", "view": "Tazama", "refresh": "Onyesha upya", "location": "Mahali", "deadline": "Mwisho wa muda", "specs": "Maelezo", "login": "Ingia", "getStarted": "Anza", "home": "Nyumbani", "profile": "Wasifu", "dashboard": "Dashibodi", "metrics": "Takwimu", "logout": "Toka", "myShops": "Maduka Yangu", "workspace": "Nafasi ya kazi", "user": "Mtumiaji", "today": "Leo", "notProvided": "Haijatolewa", "notSelected": "Haijachaguliwa", "notSet": "Haijawekwa", "none": "Hakuna", "saveToWorkspace": "Hifadhi kwenye nafasi ya kazi", "settings": "Mipangilio", "alerts": "Arifa", "requests": "Maombi", "print": "Uchapishaji", "email": "Barua pepe", "menu": "Menyu" };
const language = { "english": "Kiingereza", "swahili": "Kiswahili" };
const header = { "tagline": "Bei Yako, Mara Moja", "nav": { "gallery": "Bidhaa na Michoro", "shops": "Maduka", "locations": "Maeneo", "requestsQuotes": "Maombi na Nukuu" }, "account": { "signedInAs": "Umeingia kama", "shop": "Duka linalotumika", "becomeShopOwner": "Kuwa mmiliki wa duka", "updating": "Inasasishwa...", "updateRoleFailed": "Imeshindwa kusasisha jukumu" }, "inbox": { "shopIncoming": "Maombi Yanayoingia", "shopMessages": "Ujumbe / Majibu", "shopActions": "Hatua za Nukuu Zinazosubiri", "clientQuotes": "Nukuu Mpya", "clientReplies": "Majibu ya Duka", "clientUpdates": "Mabadiliko ya Ombi" } };
const shop = { "breadcrumbs": { "home": "Nyumbani", "shops": "Maduka", "shop": "Duka" }, "heroDescription": "Sanidi bidhaa halisi, kagua viashiria vya bei, na utume kazi kwa duka hili kwa mtiririko uleule unaotumika sehemu nyingine za Printy.", "readyForQuotes": "Tayari kwa nukuu zinazoweza kusanidiwa", "overview": "Muhtasari wa duka", "quickActions": "Vitendo vya haraka", "openRequestsWorkspace": "Fungua nafasi yako ya maombi", "requestCustomPrint": "Omba uchapishaji maalum", "backToShops": "Rudi kwenye maduka", "catalog": "Katalogi", "catalogTitle": "Sanidi bidhaa na uitume kwa duka hili", "catalogDescription": "Kila kadi ina data halisi ya bidhaa kutoka duka. Fungua moja kurekebisha kiasi, karatasi, finishing, na chaguo nyingine za nukuu.", "configuredProducts_one": "bidhaa {count} iliyosanidiwa", "configuredProducts_other": "bidhaa {count} zilizosanidiwa", "products": "Bidhaa", "rating": "Ukadiriaji", "turnaround": "Muda wa kutayarisha", "askShop": "Uliza duka", "new": "Mpya", "fitsOn": "Inaingia kwenye {value}", "minimumPieces": "Kiasi cha chini {count} pcs", "configureQuote": "Sanidi nukuu", "productCardFallback": "Imesanidiwa na duka hili na iko tayari kwa marekebisho ya moja kwa moja ya nukuu.", "productCardReadySuffix": "Tayari kwa marekebisho ya moja kwa moja ya nukuu.", "noProductsTitle": "Bado hakuna bidhaa", "noProductsDescription": "Duka hili bado halijachapisha bidhaa kwenye katalogi yake ya umma.", "shopNotFoundTitle": "Duka halijapatikana", "shopNotFoundDescription": "Duka unalotafuta halipo au halifanyi kazi sasa.", "browseShops": "Vinjari maduka", "workingHours": "Saa za kazi", "closed": "Imefungwa", "dayFallback": "Siku ya {day}", "socialLinks": "Viungo vya mitandao", "noSocialLinks": "Hakuna viungo vya mitandao.", "backToShop": "Rudi kwenye duka", "requestCustomPrintTitle": "Omba uchapishaji maalum", "requestCustomPrintDescription": "Tengeneza ombi kwa duka hili, kisha fuatilia maendeleo yake na nukuu yoyote utakayopokea kwenye nafasi yako ya maombi.", "singleShopCustomRequestTitle": "Ombi maalum la duka moja", "singleShopCustomRequestDescription": "Weka duka lilelile, jaza maelezo ya kazi maalum kwa mpangilio, na uhifadhi kwenye nafasi yako ya maombi.", "singleShopBookletTitle": "Ombi la booklet la duka moja", "singleShopBookletDescription": "Weka duka lilelile, ona makadirio ya bei ya booklet, na uhifadhi kazi kwenye nafasi yako ya maombi.", "singleShopLargeFormatTitle": "Ombi la large-format la duka moja", "singleShopLargeFormatDescription": "Weka duka lilelile, ona makadirio ya bei ya large-format, na uhifadhi kazi kwenye nafasi yako ya maombi.", "requestCustomPrintEyebrow": "Omba Uchapishaji Maalum", "requestCustomBookletEyebrow": "Omba Booklet Maalum", "requestLargeFormatEyebrow": "Omba Large Format", "addedToDraftTitle": "Imeongezwa kwenye draft", "addedToDraftDescription": "{name} imeongezwa kwenye draft yako.", "rateThisShop": "Kadiria duka hili", "rateThisShopDescription": "Umepokea nukuu kutoka duka hili. Shiriki uzoefu wako.", "optionalComment": "Maoni ya hiari...", "submitRating": "Wasilisha", "ratingThanks": "Asante kwa maoni yako!", "ratingSubmitted": "Ukadiriaji umewasilishwa", "ratingSubmitFailed": "Imeshindwa kuwasilisha ukadiriaji", "requestCustomPrintFor": "Omba uchapishaji maalum kwa {shop}", "requestCustomBookletFor": "Omba booklet maalum kwa {shop}", "requestLargeFormatFor": "Omba large-format kwa {shop}", "customPrintModalDescription": "Hali ya umma ya duka moja huweka duka lilelile, huondoa UI ya kutuma kwa maduka, na huhifadhi mtiririko wa kutuma kwenye quote-draft.", "customBookletModalDescription": "Weka duka lilelile na tumia mwonekano wa backend wa booklet bila kutoka kwenye modal hii.", "customLargeFormatModalDescription": "Weka duka lilelile na tumia mwonekano wa backend wa large-format bila kutoka kwenye modal hii.", "customPrintRequestEyebrow": "Ombi la uchapishaji maalum", "customBookletRequestEyebrow": "Ombi la booklet maalum", "customLargeFormatRequestEyebrow": "Ombi la large-format maalum", "addedToQuoteTitle": "Imeongezwa kwenye nukuu", "addedToQuoteDescription": "{name} imeongezwa kwenye nukuu yako.", "signInToSubmitQuote": "Ingia ukiwa tayari kuwasilisha nukuu hii ya duka.", "quoteConfiguration": "Usanidi wa nukuu", "configureProduct": "Sanidi {name}", "productTweakDescription": "Mtiririko huu wa umma wa kurekebisha sasa unatumia injini ya pamoja ya kalkuleta. Uchaguzi wa mashine unabaki umefichwa kwenye hali ya umma.", "tweakProduct": "Rekebisha {name}", "tweakFlowDescription": "Hali ya kalkuleta ya umma inayoshirikiwa kwa mitiririko ya marekebisho na marekebisho-pamoja-na-nukuu.", "tweakFlow": "Mtiririko wa marekebisho", "bookletRequestForProduct": "Ombi la booklet kwa {name}", "bookletFlowDescription": "Badili hadi hali ya booklet kazi inapohitaji cover, inserts, binding, na bei maalum za booklet.", "bookletFlow": "Mtiririko wa booklet", "largeFormatRequestForProduct": "Ombi la large-format kwa {name}", "largeFormatFlowDescription": "Badili hadi hali ya large-format kazi inapohitaji bei za area, materials, finishing, na hardware.", "largeFormatFlow": "Mtiririko wa large-format", "savedToWorkspaceTitle": "Imehifadhiwa kwenye nafasi ya kazi", "savedToWorkspaceDescription": "Ombi maalum limehifadhiwa kwenye nafasi yako ya maombi na nukuu." };
const workspace = { "clientWorkspace": "Nafasi ya kazi ya mteja", "workspaceSummary": "Muhtasari wa nafasi ya kazi", "myQuote": "Nukuu yangu", "inbox": "Kikasha", "quoteHistory": "Historia ya nukuu", "account": "Akaunti", "savedShops": "Maduka yaliyohifadhiwa", "browseShops": "Vinjari maduka", "utility": "Zana", "workspaceSection": "Nafasi ya kazi", "quoteBuilderHelper": "Unda, hariri, na uwasilishe vipengee vya nukuu vinavyohusu duka.", "inboxHelper": "Fuatilia nukuu mpya, majibu, na masasisho ya maombi.", "quoteHistoryHelper": "Kagua historia ya maombi na fungua mazungumzo ya nukuu.", "accountHelper": "Dhibiti wasifu wako, picha, na maelezo ya mawasiliano.", "savedShopsHelper": "Rudi haraka kwenye maduka ya uchapishaji unayotaka kutembelea tena.", "browseShopsHelper": "Tafuta na linganisha maduka ya uchapishaji.", "homeHelper": "Rudi kwenye ukurasa wa umma wa Printy.", "toggleNavigation": "Washa au zima urambazaji wa nafasi ya kazi", "closeNavigation": "Funga urambazaji wa nafasi ya kazi", "headerLine": "Nafasi ya kazi ya {name} hutenganisha uundaji wa nukuu, masasisho ya kikasha, historia ya maombi, na maelezo ya akaunti na shughuli za duka." };
const adminWorkspace = { "workspace": "Nafasi ya kazi", "shop": "Duka", "utility": "Zana", "dashboard": "Dashibodi", "dashboardHelper": "Dawati la mmiliki", "setupGuide": "Mwongozo wa usanidi", "setupGuideHelper": "Hali ya usanidi kutoka backend", "requestsQuotes": "Maombi na Nukuu", "requestsQuotesHelper": "Nafasi ya kufuatilia maombi ya mteja", "metrics": "Takwimu", "metricsHelper": "Dashibodi ya takwimu ya super-admin", "shopHome": "Nyumbani kwa duka", "shopHomeHelper": "Nafasi ya kazi ya duka lililochaguliwa", "incomingRequests": "Maombi yanayoingia", "incomingRequestsHelper": "Maombi mapya kutoka kwa wateja", "messagesReplies": "Ujumbe / Majibu", "messagesRepliesHelper": "Majibu ya wateja yanayosubiri timu yako", "pendingQuoteActions": "Hatua za nukuu zinazosubiri", "pendingQuoteActionsHelper": "Maombi yanayohitaji hatua zaidi", "machines": "Mashine", "machinesHelper": "Mashine za uchapishaji na vifaa vya uzalishaji", "materials": "Malighafi", "materialsHelper": "Usanidi wa karatasi na malighafi", "pricing": "Bei", "pricingHelper": "Bei za mashine na malighafi", "finishing": "Finishing", "finishingHelper": "Bei za lamination na post-press kwa kila sheet", "products": "Bidhaa", "productsHelper": "Katalogi na sheria za bidhaa", "home": "Nyumbani", "homeHelper": "Ukurasa wa umma", "viewPublicShop": "Tazama duka la umma", "viewCurrentPublicShop": "Fungua ukurasa wa umma wa duka hili", "viewPublicDirectory": "Fungua orodha ya umma ya maduka", "signOut": "Toka", "signOutHelper": "Maliza kipindi hiki" };
const turnaround = { "onRequest": "Kwa ombi", "workingHours_one": "saa {count} ya kazi", "workingHours_other": "saa {count} za kazi", "workingHoursRange": "saa {min}-{max} za kazi" };
const weekdays = { "1": "Jumatatu", "2": "Jumanne", "3": "Jumatano", "4": "Alhamisi", "5": "Ijumaa", "6": "Jumamosi", "7": "Jumapili" };
const jobs = { "title": "Kazi", "subtitle": "Kazi za uzalishaji na kushirikisha kazi ya ziada", "createTitle": "Tengeneza Ombi la Kazi", "createSubtitle": "Shiriki kazi ya ziada na wapishaji wengine", "requestFallbackTitle": "Kazi", "requestFallbackSubtitle": "Ombi la kazi", "tabs": { "open": "Kazi Wazi", "mine": "Maombi Yangu ya Kazi", "claims": "Madai Yangu" }, "actions": { "createRequest": "Tengeneza Ombi la Kazi", "browseOpenJobs": "Tafuta kazi wazi", "claimThisJob": "Dai kazi hii", "submitClaim": "Wasilisha dai", "accept": "Kubali", "reject": "Kataa", "shareOnWhatsApp": "Shiriki kwa WhatsApp", "openWhatsApp": "Fungua WhatsApp", "signInToClaim": "Ingia ili kudai", "backToPrinty": "Rudi Printy" }, "status": { "OPEN": "Wazi", "CLAIMED": "Imedaiwa", "CLOSED": "Imefungwa" }, "claimStatus": { "PENDING": "Inasubiri", "ACCEPTED": "Imekubaliwa", "REJECTED": "Imekataliwa" }, "fields": { "title": "Kichwa", "productCategory": "Bidhaa / Kategoria", "size": "Ukubwa", "quantity": "Idadi", "paper": "Karatasi", "finishing": "Ukamilishaji", "messageOptional": "Ujumbe (si lazima)", "priceOfferOptional": "Bei unayopendekeza (si lazima)" }, "placeholders": { "title": "mf. Brochure 500 pcs A4", "productCategory": "mf. Brochure, Business Card", "size": "mf. A4, 90x55mm", "quantity": "500", "paper": "mf. 300gsm Gloss", "finishing": "mf. Lamination, Cutting", "location": "mf. Nairobi, Westlands", "message": "Ujumbe mfupi...", "price": "KES" }, "empty": { "noClaimsTitle": "Bado hakuna madai", "noClaimsDescription": "Madai utakayoweka kwenye kazi wazi yataonekana hapa.", "noOpenTitle": "Hakuna kazi wazi", "noOwnTitle": "Bado hakuna maombi ya kazi", "noOpenDescription": "Kazi wazi kutoka maduka mengine zitaonekana hapa. Tengeneza lako ushirikishe kazi ya ziada.", "noOwnDescription": "Tengeneza ombi la kazi ili kushirikisha kazi ya ziada na maduka mengine." }, "labels": { "claims": "Madai", "share": "Shiriki", "jobNumber": "Kazi #{id}", "claimCount_one": "dai {count}", "claimCount_other": "madai {count}" }, "feedback": { "loadFailed": "Imeshindwa kupakia kazi", "loadJobFailed": "Imeshindwa kupakia kazi", "createFailed": "Imeshindwa kutengeneza", "createSuccess": "Ombi la kazi limetengenezwa", "titleRequired": "Kichwa kinahitajika", "claimSubmitted": "Dai limewasilishwa", "claimFailed": "Imeshindwa kudai", "claimAccepted": "Dai limekubaliwa", "acceptFailed": "Imeshindwa kukubali", "claimRejected": "Dai limekataliwa", "rejectFailed": "Imeshindwa kukataa", "shareLinkReady": "Kiungo cha kushiriki kiko tayari", "shareFailed": "Imeshindwa kupata kiungo cha kushiriki", "copied": "Imenakiliwa", "copyFailed": "Haikuweza kunakili", "jobNotFound": "Kazi haikupatikana" } };
const sw = {
  common,
  language,
  header,
  shop,
  workspace,
  adminWorkspace,
  turnaround,
  weekdays,
  jobs
};
const i18n_rgpBWqceGhUXVUoLOJ2oM3jvlmYalZprXt7Hyqw4ZVg = /* @__PURE__ */ defineNuxtPlugin((nuxtApp) => {
  const languageCookie = useCookie("printy-language", { default: () => "en" });
  const initialLocale = useState("app-language", () => languageCookie.value === "sw" ? "sw" : "en");
  const i18n = createI18n({
    legacy: false,
    locale: initialLocale.value,
    fallbackLocale: "en",
    messages: {
      en: en$1,
      sw
    }
  });
  nuxtApp.vueApp.use(i18n);
  return {
    provide: {
      i18n
    }
  };
});
const seo_global_server_dCzbnmKc4DepJIcvy_5PCer_5yY5ODX_DB_M4OzqZGA = /* @__PURE__ */ defineNuxtPlugin(() => {
  const config = /* @__PURE__ */ useRuntimeConfig();
  const siteUrl = config.public.siteUrl || "https://printy.ke";
  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Printy",
    url: siteUrl,
    description: "Get instant printing quotes for business cards, flyers, posters, and more. Browse templates and request quotes from trusted print shops in Kenya.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/gallery?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Printy",
    url: siteUrl,
    logo: `${siteUrl}/printy-brand-assets-ready/logo-mark/light/printy-logo-mark-01.svg`,
    description: "Printy connects buyers with print shops across Kenya. Get instant quotes for business cards, flyers, posters, and more.",
    sameAs: []
  };
  useHead({
    script: [
      { type: "application/ld+json", innerHTML: JSON.stringify(webSiteSchema) },
      { type: "application/ld+json", innerHTML: JSON.stringify(organizationSchema) }
    ]
  });
});
const _1_absoluteImageUrls_server_2YTf8dZl0nl5nVc1xW7fV_4mFLM_syJu2DEHHvxD9lg = /* @__PURE__ */ defineNuxtPlugin({
  enforce: "post",
  setup() {
    const head = injectHead();
    if (!head)
      return;
    const resolver = createSitePathResolver({
      withBase: true,
      absolute: true,
      canonical: true
    });
    head.use({
      key: "absoluteImageUrls",
      hooks: {
        "tags:resolve": async ({ tags }) => {
          for (const tag of tags) {
            if (tag.tag !== "meta")
              continue;
            if (tag.props.property !== "og:image:url" && tag.props.property !== "og:image" && tag.props.name !== "twitter:image")
              continue;
            if (typeof tag.props.content !== "string" || !tag.props.content.trim() || tag.props.content.startsWith("http") || tag.props.content.startsWith("//"))
              continue;
            tag.props.content = unref(resolver(tag.props.content));
          }
        }
      }
    });
  }
});
const _0_routeRules_3p7F2AZYQSP_eJRsw5nLkf3zyZXPOFcTrXNpZlBwROM = /* @__PURE__ */ defineNuxtPlugin({
  enforce: "post",
  async setup() {
    let __temp, __restore;
    const head = injectHead();
    const routeRuleState = useState("nuxt-seo-utils:routeRules", () => null);
    {
      const event = useRequestEvent();
      const routeRules = ([__temp, __restore] = executeAsync(() => getRouteRules(event)), __temp = await __temp, __restore(), __temp);
      routeRuleState.value = {
        head: routeRules.head,
        seoMeta: routeRules.seoMeta
      };
    }
    if (routeRuleState.value) {
      const { head: headInput, seoMeta } = routeRuleState.value;
      if (headInput)
        head.push(headInput);
      if (seoMeta)
        useSeoMeta(seoMeta);
    }
  }
});
function applyDefaults() {
  const siteConfig = useSiteConfig({
    resolveRefs: false
  });
  const resolveCurrentLocale = () => {
    const locale = toValue(siteConfig.currentLocale) || toValue(siteConfig.defaultLocale) || "en";
    return locale.replace(/_/g, "-");
  };
  const head = injectHead();
  head.use(TemplateParamsPlugin$1);
  const { canonicalQueryWhitelist, canonicalLowercase } = (/* @__PURE__ */ useRuntimeConfig()).public["seo-utils"];
  const route = useRoute();
  const resolveUrl = createSitePathResolver({ withBase: true, absolute: true });
  const err = /* @__PURE__ */ useError();
  const canonicalUrl = computed(() => {
    if (err.value) {
      return false;
    }
    const { query } = route;
    let url = resolveUrl(route.path || "/").value || route.path;
    if (canonicalLowercase) {
      try {
        url = url.toLocaleLowerCase(resolveCurrentLocale());
      } catch {
        url = url.toLowerCase();
      }
    }
    const filteredQuery = Object.fromEntries(
      Object.entries(query).filter(([key]) => canonicalQueryWhitelist.includes(key)).sort(([a], [b]) => a.localeCompare(b))
      // Sort params
    );
    const href = Object.keys(filteredQuery).length ? `${url}?${stringifyQuery(filteredQuery)}` : url;
    return { rel: "canonical", href };
  });
  const minimalPriority = {
    // give nuxt.config values higher priority
    tagPriority: "low"
  };
  useHead({
    htmlAttrs: { lang: resolveCurrentLocale },
    templateParams: {
      site: () => siteConfig,
      siteName: () => siteConfig.name
    },
    titleTemplate: "%s %separator %siteName",
    link: [() => canonicalUrl.value]
  }, minimalPriority);
  const seoMeta = {
    ogType: "website",
    ogUrl: () => {
      const url = canonicalUrl.value;
      return url ? url.href : false;
    },
    ogLocale: () => {
      const locale = resolveCurrentLocale();
      if (locale) {
        const l = locale.replace("-", "_");
        if (l.includes("_")) {
          return l;
        }
      }
      return false;
    },
    ogSiteName: siteConfig.name
  };
  if (siteConfig.description)
    seoMeta.description = siteConfig.description;
  if (siteConfig.twitter) {
    const id = siteConfig.twitter.startsWith("@") ? siteConfig.twitter : `@${siteConfig.twitter}`;
    seoMeta.twitterCreator = id;
    seoMeta.twitterSite = id;
  }
  useSeoMeta(seoMeta, minimalPriority);
}
const defaults_0Sn7xIMAzGkdbab2otVWD8mX4GpY74A3Jy_gY_4_qYk = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt-seo:defaults",
  order: 999,
  env: {
    islands: false
  },
  setup() {
    applyDefaults();
  }
});
const plugins = [
  payloadPlugin,
  _0_siteConfig_tU0SxKrPeVRXWcGu2sOnIfhNDbYiKNfDCvYZhRueG0Q,
  unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU,
  plugin$1,
  revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms,
  plugin,
  siteConfig_vuqmRkLAUZxQvb5pvUwT3uUdVggfjhj1m5v7Pb6IE0w,
  inferSeoMetaPlugin_KsEotgC9NJyW_guR_3z04hFN8TI2h5dgP8bzHmpMm5o,
  titles_Fth_MAhm7dgpxeTaMXibYXbcCjegjWK3QH9gKvbTRVg,
  defaults_ZjgoYqsIrjWNaJMfDhci2B0eoNnvY4CDsoscm0L1fE0,
  init_Ks1wcI1vuv3K3FXG7iAYRqIWlPli19G_eByed0tsXe0,
  og_image_canonical_urls_server_2uCBKzWxjEK91fSFBdBNPEWilWXRzR66cHJvjIi4FGA,
  route_rule_og_image_server_yrHfzNQxtCKZyHaGhWqsbaa4V0Y5WoBOo3_wqkmh41k,
  robot_meta_server_bRHpso_4KN_Ec3RJzqCvbuvfZsNOeE_4TgpL8dCNuwk,
  components_plugin_4kY4pyzJIYX99vmMAAIorFf3CnAaptHitJgf7JxiED8,
  plugin_MeUvTuoKUi51yb_kBguab6hdcExVXeTtZtTg9TZZBB8,
  colors_E7kSti5pGZ28QhUUurq6gGRU3l65WuXO_KJC3GQgzFo,
  plugin_server_9Ca9_HhnjAGwBWpwAydRauMHxWoxTDY60BrArRnXN_A,
  plugin_VW0S5L6gti_L2lJP5Fh8KfD6_3GK52P9spdjsc0v3y4,
  api_84elem0X4yBmBiZUVE7UuQp73h8h21064ANeRANSla4,
  i18n_rgpBWqceGhUXVUoLOJ2oM3jvlmYalZprXt7Hyqw4ZVg,
  seo_global_server_dCzbnmKc4DepJIcvy_5PCer_5yY5ODX_DB_M4OzqZGA,
  _1_absoluteImageUrls_server_2YTf8dZl0nl5nVc1xW7fV_4mFLM_syJu2DEHHvxD9lg,
  _0_routeRules_3p7F2AZYQSP_eJRsw5nLkf3zyZXPOFcTrXNpZlBwROM,
  defaults_0Sn7xIMAzGkdbab2otVWD8mX4GpY74A3Jy_gY_4_qYk
];
function omit(data, keys) {
  const result = { ...data };
  for (const key of keys) {
    delete result[key];
  }
  return result;
}
function get(object, path, defaultValue) {
  if (typeof path === "string") {
    path = path.split(".").map((key) => {
      const numKey = Number(key);
      return Number.isNaN(numKey) ? key : numKey;
    });
  }
  let result = object;
  for (const key of path) {
    if (result === void 0 || result === null) {
      return defaultValue;
    }
    result = result[key];
  }
  return result !== void 0 ? result : defaultValue;
}
function looseToNumber(val) {
  const n = Number.parseFloat(val);
  return Number.isNaN(n) ? val : n;
}
function compare(value, currentValue, comparator) {
  if (value === void 0 || currentValue === void 0) {
    return false;
  }
  if (typeof value === "string") {
    return value === currentValue;
  }
  if (typeof comparator === "function") {
    return comparator(value, currentValue);
  }
  if (typeof comparator === "string") {
    return get(value, comparator) === get(currentValue, comparator);
  }
  return isEqual(value, currentValue);
}
function isEmpty(value) {
  if (value == null) {
    return true;
  }
  if (typeof value === "boolean" || typeof value === "number") {
    return false;
  }
  if (typeof value === "string") {
    return value.trim().length === 0;
  }
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  if (value instanceof Map || value instanceof Set) {
    return value.size === 0;
  }
  if (value instanceof Date || value instanceof RegExp || typeof value === "function") {
    return false;
  }
  if (typeof value === "object") {
    for (const _ in value) {
      if (Object.prototype.hasOwnProperty.call(value, _)) {
        return false;
      }
    }
    return true;
  }
  return false;
}
function getDisplayValue(items, value, options = {}) {
  const { valueKey, labelKey, by } = options;
  const foundItem = items.find((item) => {
    const itemValue = typeof item === "object" && item !== null && valueKey ? get(item, valueKey) : item;
    return compare(itemValue, value, by);
  });
  if (isEmpty(value) && foundItem) {
    return labelKey ? get(foundItem, labelKey) : void 0;
  }
  if (isEmpty(value)) {
    return void 0;
  }
  const source = foundItem ?? value;
  if (source === null || source === void 0) {
    return void 0;
  }
  if (typeof source === "object") {
    return labelKey ? get(source, labelKey) : void 0;
  }
  return String(source);
}
function isArrayOfArray(item) {
  return Array.isArray(item[0]);
}
function mergeClasses(appConfigClass, propClass) {
  if (!appConfigClass && !propClass) {
    return "";
  }
  return [
    ...Array.isArray(appConfigClass) ? appConfigClass : [appConfigClass],
    propClass
  ].filter(Boolean);
}
function buildTranslator(locale) {
  return (path, option) => translate(path, option, unref(locale));
}
function translate(path, option, locale) {
  const prop = get(locale, `messages.${path}`, path);
  return prop.replace(
    /\{(\w+)\}/g,
    (_, key) => `${option?.[key] ?? `{${key}}`}`
  );
}
function buildLocaleContext(locale) {
  const lang = computed(() => unref(locale).name);
  const code = computed(() => unref(locale).code);
  const dir = computed(() => unref(locale).dir);
  const localeRef = isRef(locale) ? locale : ref(locale);
  return {
    lang,
    code,
    dir,
    locale: localeRef,
    t: buildTranslator(locale)
  };
}
// @__NO_SIDE_EFFECTS__
function defineLocale(options) {
  return defu(options, { dir: "ltr" });
}
const en = /* @__PURE__ */ defineLocale({
  name: "English",
  code: "en",
  messages: {
    alert: {
      close: "Close"
    },
    authForm: {
      hidePassword: "Hide password",
      showPassword: "Show password",
      submit: "Continue"
    },
    banner: {
      close: "Close"
    },
    calendar: {
      nextMonth: "Next month",
      nextYear: "Next year",
      prevMonth: "Previous month",
      prevYear: "Previous year"
    },
    carousel: {
      dots: "Choose slide to display",
      goto: "Go to slide {slide}",
      next: "Next",
      prev: "Prev"
    },
    chatPrompt: {
      placeholder: "Type your message here…"
    },
    chatPromptSubmit: {
      label: "Send prompt"
    },
    colorMode: {
      dark: "Dark",
      light: "Light",
      switchToDark: "Switch to dark mode",
      switchToLight: "Switch to light mode",
      system: "System"
    },
    commandPalette: {
      back: "Back",
      close: "Close",
      noData: "No data",
      noMatch: "No matching data",
      placeholder: "Type a command or search…"
    },
    contentSearch: {
      links: "Links",
      theme: "Theme"
    },
    contentSearchButton: {
      label: "Search…"
    },
    contentToc: {
      title: "On this page"
    },
    dashboardSearch: {
      theme: "Theme"
    },
    dashboardSearchButton: {
      label: "Search…"
    },
    dashboardSidebarCollapse: {
      collapse: "Collapse sidebar",
      expand: "Expand sidebar"
    },
    dashboardSidebarToggle: {
      close: "Close sidebar",
      open: "Open sidebar"
    },
    error: {
      clear: "Back to home"
    },
    fileUpload: {
      removeFile: "Remove {filename}"
    },
    header: {
      close: "Close menu",
      open: "Open menu"
    },
    inputMenu: {
      create: 'Create "{label}"',
      noData: "No data",
      noMatch: "No matching data"
    },
    inputNumber: {
      decrement: "Decrement",
      increment: "Increment"
    },
    modal: {
      close: "Close"
    },
    pricingTable: {
      caption: "Pricing plan comparison"
    },
    prose: {
      codeCollapse: {
        closeText: "Collapse",
        name: "code",
        openText: "Expand"
      },
      collapsible: {
        closeText: "Hide",
        name: "properties",
        openText: "Show"
      },
      pre: {
        copy: "Copy code to clipboard"
      }
    },
    selectMenu: {
      create: 'Create "{label}"',
      noData: "No data",
      noMatch: "No matching data",
      search: "Search…"
    },
    slideover: {
      close: "Close"
    },
    table: {
      noData: "No data"
    },
    toast: {
      close: "Close"
    }
  }
});
const localeContextInjectionKey = /* @__PURE__ */ Symbol.for("nuxt-ui.locale-context");
const _useLocale = (localeOverrides) => {
  const locale = localeOverrides || toRef(inject(localeContextInjectionKey, en));
  return buildLocaleContext(computed(() => locale.value || en));
};
const useLocale = _useLocale;
const portalTargetInjectionKey = /* @__PURE__ */ Symbol("nuxt-ui.portal-target");
function usePortal(portal) {
  const globalPortal = inject(portalTargetInjectionKey, void 0);
  const value = computed(() => portal.value === true ? globalPortal?.value : portal.value);
  const disabled = computed(() => typeof value.value === "boolean" ? !value.value : false);
  const to = computed(() => typeof value.value === "boolean" ? "body" : value.value);
  return computed(() => ({
    to: to.value,
    disabled: disabled.value
  }));
}
const toastMaxInjectionKey = /* @__PURE__ */ Symbol("nuxt-ui.toast-max");
function useToast() {
  const toasts = useState("toasts", () => []);
  const max = inject(toastMaxInjectionKey, void 0);
  const running = ref(false);
  const queue = [];
  const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  async function processQueue() {
    if (running.value || queue.length === 0) {
      return;
    }
    running.value = true;
    while (queue.length > 0) {
      const toast = queue.shift();
      await nextTick();
      toasts.value = [...toasts.value, toast].slice(-(max?.value ?? 5));
    }
    running.value = false;
  }
  function add(toast) {
    const body = {
      id: generateId(),
      open: true,
      ...toast
    };
    queue.push(body);
    processQueue();
    return body;
  }
  function update(id, toast) {
    const index2 = toasts.value.findIndex((t) => t.id === id);
    if (index2 !== -1) {
      toasts.value[index2] = {
        ...toasts.value[index2],
        ...toast
      };
    }
  }
  function remove(id) {
    const index2 = toasts.value.findIndex((t) => t.id === id);
    if (index2 !== -1) {
      toasts.value[index2] = {
        ...toasts.value[index2],
        open: false
      };
    }
    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== id);
    }, 200);
  }
  function clear() {
    toasts.value = [];
  }
  return {
    toasts,
    add,
    update,
    remove,
    clear
  };
}
const appConfigTv = appConfig;
const tv = /* @__PURE__ */ createTV(appConfigTv.ui?.tv);
async function loadIcon(name, timeout) {
  if (!name)
    return null;
  const _icon = getIcon(name);
  if (_icon)
    return _icon;
  let timeoutWarn;
  const load = loadIcon$1(name).catch(() => {
    console.warn(`[Icon] failed to load icon \`${name}\``);
    return null;
  });
  if (timeout > 0)
    await Promise.race([
      load,
      new Promise((resolve) => {
        timeoutWarn = setTimeout(() => {
          console.warn(`[Icon] loading icon \`${name}\` timed out after ${timeout}ms`);
          resolve();
        }, timeout);
      })
    ]).finally(() => clearTimeout(timeoutWarn));
  else
    await load;
  return getIcon(name);
}
function useResolvedName(getName) {
  const options = useAppConfig().icon;
  const collections = (options.collections || []).sort((a, b) => b.length - a.length);
  return computed(() => {
    const name = getName();
    const bare = name.startsWith(options.cssSelectorPrefix) ? name.slice(options.cssSelectorPrefix.length) : name;
    const resolved = options.aliases?.[bare] || bare;
    if (!resolved.includes(":")) {
      const collection = collections.find((c) => resolved.startsWith(c + "-"));
      return collection ? collection + ":" + resolved.slice(collection.length + 1) : resolved;
    }
    return resolved;
  });
}
function resolveCustomizeFn(customize, globalCustomize) {
  if (customize === false) return void 0;
  if (customize === true || customize === null) return globalCustomize;
  return customize;
}
const SYMBOL_SERVER_CSS = "NUXT_ICONS_SERVER_CSS";
function escapeCssSelector(selector) {
  return selector.replace(/([^\w-])/g, "\\$1");
}
const NuxtIconCss = /* @__PURE__ */ defineComponent({
  name: "NuxtIconCss",
  props: {
    name: {
      type: String,
      required: true
    },
    customize: {
      type: [Function, Boolean, null],
      default: null,
      required: false
    }
  },
  setup(props) {
    const nuxt = useNuxtApp();
    const options = useAppConfig().icon;
    const cssClass = computed(() => props.name ? options.cssSelectorPrefix + props.name : "");
    const selector = computed(() => "." + escapeCssSelector(cssClass.value));
    function getCSS(icon, withLayer = true) {
      let iconSelector = selector.value;
      if (options.cssWherePseudo) {
        iconSelector = `:where(${iconSelector})`;
      }
      const css = getIconCSS(icon, {
        iconSelector,
        format: "compressed",
        customise: resolveCustomizeFn(props.customize, options.customize)
      });
      if (options.cssLayer && withLayer) {
        return `@layer ${options.cssLayer} { ${css} }`;
      }
      return css;
    }
    onServerPrefetch(async () => {
      {
        const configs = (/* @__PURE__ */ useRuntimeConfig()).icon || {};
        if (!configs?.serverKnownCssClasses?.includes(cssClass.value)) {
          const icon = await loadIcon(props.name, options.fetchTimeout).catch(() => null);
          if (!icon)
            return null;
          let ssrCSS = nuxt.vueApp._context.provides[SYMBOL_SERVER_CSS];
          if (!ssrCSS) {
            ssrCSS = nuxt.vueApp._context.provides[SYMBOL_SERVER_CSS] = /* @__PURE__ */ new Map();
            nuxt.runWithContext(() => {
              useHead({
                style: [
                  () => {
                    const sep = "";
                    let css = Array.from(ssrCSS.values()).sort().join(sep);
                    if (options.cssLayer) {
                      css = `@layer ${options.cssLayer} {${sep}${css}${sep}}`;
                    }
                    return { innerHTML: css };
                  }
                ]
              }, {
                tagPriority: "low"
              });
            });
          }
          if (props.name && !ssrCSS.has(props.name)) {
            const css = getCSS(icon, false);
            ssrCSS.set(props.name, css);
          }
          return null;
        }
      }
    });
    return () => h("span", { class: ["iconify", cssClass.value] });
  }
});
const NuxtIconSvg = /* @__PURE__ */ defineComponent({
  name: "NuxtIconSvg",
  props: {
    name: {
      type: String,
      required: true
    },
    customize: {
      type: [Function, Boolean, null],
      default: null,
      required: false
    }
  },
  setup(props, { slots }) {
    useNuxtApp();
    const options = useAppConfig().icon;
    const name = useResolvedName(() => props.name);
    const storeKey = "i-" + name.value;
    if (name.value) {
      onServerPrefetch(async () => {
        {
          await useAsyncData(
            storeKey,
            async () => await loadIcon(name.value, options.fetchTimeout),
            { deep: false }
          );
        }
      });
    }
    return () => h(Icon, {
      icon: name.value,
      ssr: true,
      // Iconify uses `customise`, where we expose `customize` for consistency
      customise: resolveCustomizeFn(props.customize, options.customize)
    }, slots);
  }
});
const __nuxt_component_0$2 = defineComponent({
  name: "NuxtIcon",
  props: {
    name: {
      type: String,
      required: true
    },
    mode: {
      type: String,
      required: false,
      default: null
    },
    size: {
      type: [Number, String],
      required: false,
      default: null
    },
    customize: {
      type: [Function, Boolean, null],
      default: null,
      required: false
    }
  },
  setup(props, { slots }) {
    const nuxtApp = useNuxtApp();
    const runtimeOptions = useAppConfig().icon;
    const name = useResolvedName(() => props.name);
    const component = computed(
      () => nuxtApp.vueApp?.component(name.value) || ((props.mode || runtimeOptions.mode) === "svg" ? NuxtIconSvg : NuxtIconCss)
    );
    const style = computed(() => {
      const size = props.size || runtimeOptions.size;
      return size ? { fontSize: Number.isNaN(+size) ? size : size + "px" } : null;
    });
    return () => h(
      component.value,
      {
        ...runtimeOptions.attrs,
        name: name.value,
        class: runtimeOptions.class,
        style: style.value,
        customize: props.customize
      },
      slots
    );
  }
});
const index = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __nuxt_component_0$2
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$f = {
  __name: "UIcon",
  __ssrInlineRender: true,
  props: {
    name: { type: null, required: true },
    mode: { type: String, required: false },
    size: { type: [String, Number], required: false },
    customize: { type: Function, required: false }
  },
  setup(__props) {
    const props = __props;
    const iconProps = useForwardProps(reactivePick(props, "name", "mode", "size", "customize"));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0$2;
      if (typeof __props.name === "string") {
        _push(ssrRenderComponent(_component_Icon, mergeProps(unref(iconProps), _attrs), null, _parent));
      } else {
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(__props.name), _attrs, null), _parent);
      }
    };
  }
};
const _sfc_setup$f = _sfc_main$f.setup;
_sfc_main$f.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/Icon.vue");
  return _sfc_setup$f ? _sfc_setup$f(props, ctx) : void 0;
};
async function imageMeta(_ctx, url) {
  const meta = await _imageMeta(url).catch((err) => {
    console.error("Failed to get image meta for " + url, err + "");
    return {
      width: 0,
      height: 0,
      ratio: 0
    };
  });
  return meta;
}
async function _imageMeta(url) {
  {
    const imageMeta2 = await import('image-meta').then((r) => r.imageMeta);
    const data = await fetch(url).then((res) => res.buffer());
    const metadata = imageMeta2(data);
    if (!metadata) {
      throw new Error(`No metadata could be extracted from the image \`${url}\`.`);
    }
    const { width, height } = metadata;
    const meta = {
      width,
      height,
      ratio: width && height ? width / height : void 0
    };
    return meta;
  }
}
function createMapper(map) {
  return ((key) => key !== void 0 ? map[key] || key : map.missingValue);
}
function createOperationsGenerator(config = {}) {
  const formatter = config.formatter;
  const keyMap = config.keyMap && typeof config.keyMap !== "function" ? createMapper(config.keyMap) : config.keyMap;
  const map = {};
  for (const key in config.valueMap) {
    const valueKey = key;
    const value = config.valueMap[valueKey];
    map[valueKey] = typeof value === "object" ? createMapper(value) : value;
  }
  return (modifiers) => {
    const operations = [];
    for (const _key in modifiers) {
      const key = _key;
      if (typeof modifiers[key] === "undefined") {
        continue;
      }
      const value = typeof map[key] === "function" ? map[key](modifiers[key]) : modifiers[key];
      operations.push([keyMap ? keyMap(key) : key, value]);
    }
    if (formatter) {
      return operations.map((entry2) => formatter(...entry2)).join(config.joinWith ?? "&");
    }
    return new URLSearchParams(operations).toString();
  };
}
function parseDensities(input = "") {
  if (input === void 0 || !input.length) {
    return [];
  }
  const densities = /* @__PURE__ */ new Set();
  for (const density of input.split(" ")) {
    const d = Number.parseInt(density.replace("x", ""));
    if (d) {
      densities.add(d);
    }
  }
  return Array.from(densities);
}
function checkDensities(densities) {
  if (densities.length === 0) {
    throw new Error("`densities` must not be empty, configure to `1` to render regular size only (DPR 1.0)");
  }
}
function parseSize(input = "") {
  if (typeof input === "number") {
    return input;
  }
  if (typeof input === "string") {
    if (input.replace("px", "").match(/^\d+$/g)) {
      return Number.parseInt(input, 10);
    }
  }
}
function parseSizes(input) {
  const sizes = {};
  if (typeof input === "string") {
    for (const entry2 of input.split(/[\s,]+/).filter((e) => e)) {
      const s = entry2.split(":");
      if (s.length !== 2) {
        sizes["1px"] = s[0].trim();
      } else {
        sizes[s[0].trim()] = s[1].trim();
      }
    }
  } else {
    Object.assign(sizes, input);
  }
  return sizes;
}
function createImage(globalOptions) {
  const ctx = {
    options: globalOptions
  };
  const getImage = (input, options = {}) => {
    const image = resolveImage(ctx, input, options);
    return image;
  };
  const $img = ((input, modifiers, options) => getImage(input, defu({ modifiers }, options)).url);
  for (const presetName in globalOptions.presets) {
    $img[presetName] = ((source, modifiers, options) => $img(source, modifiers, { ...globalOptions.presets[presetName], ...options }));
  }
  $img.options = globalOptions;
  $img.getImage = getImage;
  $img.getMeta = ((input, options) => getMeta(ctx, input, options));
  $img.getSizes = ((input, options) => getSizes(ctx, input, options));
  ctx.$img = $img;
  return $img;
}
async function getMeta(ctx, input, options) {
  const image = resolveImage(ctx, input, { ...options });
  if (typeof image.getMeta === "function") {
    return await image.getMeta();
  } else {
    return await imageMeta(ctx, image.url);
  }
}
function resolveImage(ctx, input, options) {
  if (input && typeof input !== "string") {
    throw new TypeError(`input must be a string (received ${typeof input}: ${JSON.stringify(input)})`);
  }
  if (!input || input.startsWith("data:")) {
    return {
      url: input
    };
  }
  const { setup, defaults } = getProvider(ctx, options.provider || ctx.options.provider);
  const provider = setup();
  const preset = getPreset(ctx, options.preset);
  input = hasProtocol(input) ? input : withLeadingSlash(input);
  if (!provider.supportsAlias) {
    for (const base in ctx.options.alias) {
      if (input.startsWith(base)) {
        const alias = ctx.options.alias[base];
        if (alias) {
          input = joinURL(alias, input.slice(base.length));
        }
      }
    }
  }
  if (provider.validateDomains && hasProtocol(input)) {
    const inputHost = parseURL(input).host;
    if (!ctx.options.domains.find((d) => d === inputHost)) {
      return {
        url: input
      };
    }
  }
  const _options = defu(options, preset, defaults);
  const resolvedOptions = {
    ..._options,
    modifiers: {
      ..._options.modifiers,
      width: _options.modifiers?.width ? parseSize(_options.modifiers.width) : void 0,
      height: _options.modifiers?.height ? parseSize(_options.modifiers.height) : void 0
    }
  };
  const image = provider.getImage(input, resolvedOptions, ctx);
  image.format ||= resolvedOptions.modifiers.format || "";
  return image;
}
function getProvider(ctx, name) {
  const provider = ctx.options.providers[name];
  if (!provider) {
    throw new Error("Unknown provider: " + name);
  }
  return provider;
}
function getPreset(ctx, name) {
  if (!name) {
    return {};
  }
  if (!ctx.options.presets[name]) {
    throw new Error("Unknown preset: " + name);
  }
  return ctx.options.presets[name];
}
function getSizes(ctx, input, opts) {
  const preset = getPreset(ctx, opts.preset);
  const merged = defu(opts, preset);
  const width = parseSize(merged.modifiers?.width);
  const height = parseSize(merged.modifiers?.height);
  const sizes = merged.sizes ? parseSizes(merged.sizes) : {};
  const _densities = merged.densities?.trim();
  const densities = _densities ? parseDensities(_densities) : ctx.options.densities;
  checkDensities(densities);
  const hwRatio = width && height ? height / width : 0;
  const sizeVariants = [];
  const srcsetVariants = [];
  if (Object.keys(sizes).length >= 1) {
    for (const key in sizes) {
      const variant = getSizesVariant(key, String(sizes[key]), height, hwRatio, ctx);
      if (variant === void 0) {
        continue;
      }
      sizeVariants.push({
        size: variant.size,
        screenMaxWidth: variant.screenMaxWidth,
        media: `(max-width: ${variant.screenMaxWidth}px)`
      });
      for (const density of densities) {
        srcsetVariants.push({
          width: variant._cWidth * density,
          src: getVariantSrc(ctx, input, opts, variant, density)
        });
      }
    }
    finaliseSizeVariants(sizeVariants);
  } else {
    for (const density of densities) {
      const key = Object.keys(sizes)[0];
      let variant = key ? getSizesVariant(key, String(sizes[key]), height, hwRatio, ctx) : void 0;
      if (variant === void 0) {
        variant = {
          size: "",
          screenMaxWidth: 0,
          _cWidth: opts.modifiers?.width,
          _cHeight: opts.modifiers?.height
        };
      }
      srcsetVariants.push({
        width: density,
        src: getVariantSrc(ctx, input, opts, variant, density)
      });
    }
  }
  finaliseSrcsetVariants(srcsetVariants);
  const defaultVariant = srcsetVariants[srcsetVariants.length - 1];
  const sizesVal = sizeVariants.length ? sizeVariants.map((v) => `${v.media ? v.media + " " : ""}${v.size}`).join(", ") : void 0;
  const suffix = sizesVal ? "w" : "x";
  const srcsetVal = srcsetVariants.map((v) => `${v.src} ${v.width}${suffix}`).join(", ");
  return {
    sizes: sizesVal,
    srcset: srcsetVal,
    src: defaultVariant?.src
  };
}
function getSizesVariant(key, size, height, hwRatio, ctx) {
  const screenMaxWidth = ctx.options.screens && ctx.options.screens[key] || Number.parseInt(key);
  const isFluid = size.endsWith("vw");
  if (!isFluid && /^\d+$/.test(size)) {
    size = size + "px";
  }
  if (!isFluid && !size.endsWith("px")) {
    return void 0;
  }
  let _cWidth = Number.parseInt(size);
  if (!screenMaxWidth || !_cWidth) {
    return void 0;
  }
  if (isFluid) {
    _cWidth = Math.round(_cWidth / 100 * screenMaxWidth);
  }
  const _cHeight = hwRatio ? Math.round(_cWidth * hwRatio) : height;
  return {
    size,
    screenMaxWidth,
    _cWidth,
    _cHeight
  };
}
function getVariantSrc(ctx, input, opts, variant, density) {
  return ctx.$img(
    input,
    {
      ...opts.modifiers,
      width: variant._cWidth ? variant._cWidth * density : void 0,
      height: variant._cHeight ? variant._cHeight * density : void 0
    },
    opts
  );
}
function finaliseSizeVariants(sizeVariants) {
  sizeVariants.sort((v1, v2) => v1.screenMaxWidth - v2.screenMaxWidth);
  let previousMedia = null;
  for (let i = sizeVariants.length - 1; i >= 0; i--) {
    const sizeVariant = sizeVariants[i];
    if (sizeVariant.media === previousMedia) {
      sizeVariants.splice(i, 1);
    }
    previousMedia = sizeVariant.media;
  }
  for (let i = 0; i < sizeVariants.length; i++) {
    sizeVariants[i].media = sizeVariants[i + 1]?.media || "";
  }
}
function finaliseSrcsetVariants(srcsetVariants) {
  srcsetVariants.sort((v1, v2) => v1.width - v2.width);
  let previousWidth = null;
  for (let i = srcsetVariants.length - 1; i >= 0; i--) {
    const sizeVariant = srcsetVariants[i];
    if (sizeVariant.width === previousWidth) {
      srcsetVariants.splice(i, 1);
    }
    previousWidth = sizeVariant.width;
  }
}
function defineProvider(setup) {
  let result;
  return () => {
    if (result) {
      return result;
    }
    result = typeof setup === "function" ? setup() : setup;
    return result;
  };
}
const operationsGenerator = createOperationsGenerator({
  keyMap: {
    format: "f",
    width: "w",
    height: "h",
    resize: "s",
    quality: "q",
    background: "b",
    position: "pos"
  },
  formatter: (key, val) => encodeParam(key) + "_" + encodeParam(val.toString())
});
const ipxRuntime$k29b_j1ALt4ygwJNPXZhK_7UaDJxY4f2KLRk_qM7DfE = defineProvider({
  validateDomains: true,
  supportsAlias: true,
  getImage: (src, { modifiers, baseURL: baseURL2 }, ctx) => {
    if (modifiers.width && modifiers.height) {
      modifiers.resize = `${modifiers.width}x${modifiers.height}`;
      delete modifiers.width;
      delete modifiers.height;
    }
    const params = operationsGenerator(modifiers) || "_";
    if (!baseURL2) {
      baseURL2 = joinURL(ctx.options.nuxt.baseURL, "/_ipx");
    }
    return {
      url: joinURL(baseURL2, params, encodePath(src))
    };
  }
});
const imageOptions = {
  ...{
    "screens": {
      "sm": 640,
      "md": 768,
      "lg": 1024,
      "xl": 1280,
      "2xl": 1536
    },
    "presets": {},
    "provider": "ipx",
    "domains": [
      "localhost",
      "printy.ke",
      "willieilus.pythonanywhere.com"
    ],
    "alias": {},
    "densities": [
      1,
      2
    ],
    "format": [
      "webp"
    ]
  },
  /** @type {"ipx"} */
  provider: "ipx",
  providers: {
    ["ipx"]: { setup: ipxRuntime$k29b_j1ALt4ygwJNPXZhK_7UaDJxY4f2KLRk_qM7DfE, defaults: {} }
  }
};
const useImage = (event) => {
  const config = /* @__PURE__ */ useRuntimeConfig();
  const nuxtApp = useNuxtApp();
  return nuxtApp.$img || nuxtApp._img || (nuxtApp._img = createImage({
    ...imageOptions,
    event: nuxtApp.ssrContext?.event,
    nuxt: {
      baseURL: config.app.baseURL
    },
    runtimeConfig: config
  }));
};
const useImageProps = (props) => {
  const $img = useImage();
  const providerOptions = computed(() => ({
    provider: props.provider,
    preset: props.preset
  }));
  const normalizedAttrs = computed(() => ({
    width: parseSize(props.width),
    height: parseSize(props.height),
    crossorigin: props.crossorigin === true ? "anonymous" : props.crossorigin || void 0,
    nonce: props.nonce
  }));
  const imageModifiers = computed(() => {
    return {
      ...props.modifiers,
      width: props.width,
      height: props.height,
      format: props.format,
      quality: props.quality || $img.options.quality,
      background: props.background,
      fit: props.fit
    };
  });
  return { providerOptions, normalizedAttrs, imageModifiers };
};
const _sfc_main$e = {
  __name: "NuxtImg",
  __ssrInlineRender: true,
  props: {
    custom: { type: Boolean, required: false },
    placeholder: { type: [Boolean, String, Number, Array], required: false },
    placeholderClass: { type: String, required: false },
    src: { type: String, required: false },
    format: { type: String, required: false },
    quality: { type: [String, Number], required: false },
    background: { type: String, required: false },
    fit: { type: String, required: false },
    modifiers: { type: Object, required: false },
    preset: { type: String, required: false },
    provider: { type: null, required: false },
    sizes: { type: [String, Object], required: false },
    densities: { type: String, required: false },
    preload: { type: [Boolean, Object], required: false },
    width: { type: [String, Number], required: false },
    height: { type: [String, Number], required: false },
    crossorigin: { type: [String, Boolean], required: false },
    nonce: { type: String, required: false }
  },
  emits: ["load", "error"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const $img = useImage();
    const { providerOptions, normalizedAttrs, imageModifiers } = useImageProps(props);
    const sizes = computed(() => $img.getSizes(props.src, {
      ...providerOptions.value,
      sizes: props.sizes,
      densities: props.densities,
      modifiers: imageModifiers.value
    }));
    const placeholderLoaded = ref(false);
    const attrs = useAttrs();
    const imgAttrs = computed(() => ({
      ...normalizedAttrs.value,
      "data-nuxt-img": "",
      ...!props.placeholder || placeholderLoaded.value ? { sizes: sizes.value.sizes, srcset: sizes.value.srcset } : {},
      ...{ onerror: "this.setAttribute('data-error', 1)" },
      ...attrs
    }));
    const placeholder = computed(() => {
      if (placeholderLoaded.value) {
        return false;
      }
      const placeholder2 = props.placeholder === "" ? [10, 10] : props.placeholder;
      if (!placeholder2) {
        return false;
      }
      if (typeof placeholder2 === "string") {
        return placeholder2;
      }
      const [width = 10, height = width, quality = 50, blur = 3] = Array.isArray(placeholder2) ? placeholder2 : typeof placeholder2 === "number" ? [placeholder2] : [];
      return $img(props.src, {
        ...imageModifiers.value,
        width,
        height,
        quality,
        blur
      }, providerOptions.value);
    });
    const mainSrc = computed(
      () => props.sizes ? sizes.value.src : $img(props.src, imageModifiers.value, providerOptions.value)
    );
    const src = computed(() => placeholder.value || mainSrc.value);
    if (props.preload) {
      const hasMultipleDensities = sizes.value.srcset.includes("x, ");
      const isResponsive = hasMultipleDensities || !!sizes.value.sizes;
      useHead({
        link: [{
          rel: "preload",
          as: "image",
          nonce: props.nonce,
          crossorigin: normalizedAttrs.value.crossorigin,
          href: isResponsive ? sizes.value.src : src.value,
          ...sizes.value.sizes && { imagesizes: sizes.value.sizes },
          ...hasMultipleDensities && { imagesrcset: sizes.value.srcset },
          ...typeof props.preload !== "boolean" && props.preload.fetchPriority ? { fetchpriority: props.preload.fetchPriority } : {}
        }]
      });
    }
    useNuxtApp().isHydrating;
    const imgEl = useTemplateRef("imgEl");
    __expose({ imgEl });
    return (_ctx, _push, _parent, _attrs) => {
      if (!__props.custom) {
        _push(`<img${ssrRenderAttrs(mergeProps({
          ref_key: "imgEl",
          ref: imgEl,
          class: placeholder.value ? __props.placeholderClass : void 0
        }, imgAttrs.value, { src: src.value }, _attrs))}>`);
      } else {
        ssrRenderSlot(_ctx.$slots, "default", {
          imgAttrs: imgAttrs.value,
          isLoaded: placeholderLoaded.value,
          src: src.value
        }, null, _push, _parent);
      }
    };
  }
};
const _sfc_setup$e = _sfc_main$e.setup;
_sfc_main$e.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/image/dist/runtime/components/NuxtImg.vue");
  return _sfc_setup$e ? _sfc_setup$e(props, ctx) : void 0;
};
const __nuxt_component_5 = Object.assign(_sfc_main$e, { __name: "NuxtImg" });
const avatarGroupInjectionKey = /* @__PURE__ */ Symbol("nuxt-ui.avatar-group");
function useAvatarGroup(props) {
  const avatarGroup = inject(avatarGroupInjectionKey, void 0);
  const size = computed(() => props.size ?? avatarGroup?.value.size);
  provide(avatarGroupInjectionKey, computed(() => ({ size: size.value })));
  return {
    size
  };
}
const theme$6 = {
  "slots": {
    "root": "relative inline-flex items-center justify-center shrink-0",
    "base": "rounded-full ring ring-bg flex items-center justify-center text-inverted font-medium whitespace-nowrap"
  },
  "variants": {
    "color": {
      "primary": "bg-primary",
      "secondary": "bg-secondary",
      "success": "bg-success",
      "info": "bg-info",
      "warning": "bg-warning",
      "error": "bg-error",
      "neutral": "bg-inverted"
    },
    "size": {
      "3xs": "h-[4px] min-w-[4px] text-[4px]",
      "2xs": "h-[5px] min-w-[5px] text-[5px]",
      "xs": "h-[6px] min-w-[6px] text-[6px]",
      "sm": "h-[7px] min-w-[7px] text-[7px]",
      "md": "h-[8px] min-w-[8px] text-[8px]",
      "lg": "h-[9px] min-w-[9px] text-[9px]",
      "xl": "h-[10px] min-w-[10px] text-[10px]",
      "2xl": "h-[11px] min-w-[11px] text-[11px]",
      "3xl": "h-[12px] min-w-[12px] text-[12px]"
    },
    "position": {
      "top-right": "top-0 right-0",
      "bottom-right": "bottom-0 right-0",
      "top-left": "top-0 left-0",
      "bottom-left": "bottom-0 left-0"
    },
    "inset": {
      "false": ""
    },
    "standalone": {
      "false": "absolute"
    }
  },
  "compoundVariants": [
    {
      "position": "top-right",
      "inset": false,
      "class": "-translate-y-1/2 translate-x-1/2 transform"
    },
    {
      "position": "bottom-right",
      "inset": false,
      "class": "translate-y-1/2 translate-x-1/2 transform"
    },
    {
      "position": "top-left",
      "inset": false,
      "class": "-translate-y-1/2 -translate-x-1/2 transform"
    },
    {
      "position": "bottom-left",
      "inset": false,
      "class": "translate-y-1/2 -translate-x-1/2 transform"
    }
  ],
  "defaultVariants": {
    "size": "md",
    "color": "primary",
    "position": "top-right"
  }
};
const _sfc_main$d = /* @__PURE__ */ Object.assign({ inheritAttrs: false }, {
  __name: "UChip",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    as: { type: null, required: false },
    text: { type: [String, Number], required: false },
    color: { type: null, required: false },
    size: { type: null, required: false },
    position: { type: null, required: false },
    inset: { type: Boolean, required: false, default: false },
    standalone: { type: Boolean, required: false, default: false },
    class: { type: null, required: false },
    ui: { type: null, required: false }
  }, {
    "show": { type: Boolean, ...{ default: true } },
    "showModifiers": {}
  }),
  emits: ["update:show"],
  setup(__props) {
    const props = __props;
    const show = useModel(__props, "show", { type: Boolean, ...{ default: true } });
    const { size } = useAvatarGroup(props);
    const appConfig2 = useAppConfig();
    const ui = computed(() => tv({ extend: tv(theme$6), ...appConfig2.ui?.chip || {} })({
      color: props.color,
      size: size.value,
      position: props.position,
      inset: props.inset,
      standalone: props.standalone
    }));
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Primitive), mergeProps({
        as: __props.as,
        "data-slot": "root",
        class: ui.value.root({ class: [props.ui?.root, props.class] })
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Slot), _ctx.$attrs, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push3, _parent3, _scopeId2);
                } else {
                  return [
                    renderSlot(_ctx.$slots, "default")
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
            if (show.value) {
              _push2(`<span data-slot="base" class="${ssrRenderClass(ui.value.base({ class: props.ui?.base }))}"${_scopeId}>`);
              ssrRenderSlot(_ctx.$slots, "content", {}, () => {
                _push2(`${ssrInterpolate(__props.text)}`);
              }, _push2, _parent2, _scopeId);
              _push2(`</span>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode(unref(Slot), _ctx.$attrs, {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "default")
                ]),
                _: 3
              }, 16),
              show.value ? (openBlock(), createBlock("span", {
                key: 0,
                "data-slot": "base",
                class: ui.value.base({ class: props.ui?.base })
              }, [
                renderSlot(_ctx.$slots, "content", {}, () => [
                  createTextVNode(toDisplayString(__props.text), 1)
                ])
              ], 2)) : createCommentVNode("", true)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/Chip.vue");
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : void 0;
};
const theme$5 = {
  "slots": {
    "root": "inline-flex items-center justify-center shrink-0 select-none rounded-full align-middle bg-elevated",
    "image": "h-full w-full rounded-[inherit] object-cover",
    "fallback": "font-medium leading-none text-muted truncate",
    "icon": "text-muted shrink-0"
  },
  "variants": {
    "size": {
      "3xs": {
        "root": "size-4 text-[8px]"
      },
      "2xs": {
        "root": "size-5 text-[10px]"
      },
      "xs": {
        "root": "size-6 text-xs"
      },
      "sm": {
        "root": "size-7 text-sm"
      },
      "md": {
        "root": "size-8 text-base"
      },
      "lg": {
        "root": "size-9 text-lg"
      },
      "xl": {
        "root": "size-10 text-xl"
      },
      "2xl": {
        "root": "size-11 text-[22px]"
      },
      "3xl": {
        "root": "size-12 text-2xl"
      }
    }
  },
  "defaultVariants": {
    "size": "md"
  }
};
const _sfc_main$c = /* @__PURE__ */ Object.assign({ inheritAttrs: false }, {
  __name: "UAvatar",
  __ssrInlineRender: true,
  props: {
    as: { type: null, required: false },
    src: { type: String, required: false },
    alt: { type: String, required: false },
    icon: { type: null, required: false },
    text: { type: String, required: false },
    size: { type: null, required: false },
    chip: { type: [Boolean, Object], required: false },
    class: { type: null, required: false },
    style: { type: null, required: false },
    ui: { type: null, required: false }
  },
  setup(__props) {
    const props = __props;
    const as = computed(() => {
      if (typeof props.as === "string" || typeof props.as?.render === "function") {
        return { root: props.as };
      }
      return defu(props.as, { root: "span" });
    });
    const fallback = computed(() => props.text || (props.alt || "").split(" ").map((word) => word.charAt(0)).join("").substring(0, 2));
    const appConfig2 = useAppConfig();
    const { size } = useAvatarGroup(props);
    const ui = computed(() => tv({ extend: tv(theme$5), ...appConfig2.ui?.avatar || {} })({
      size: size.value
    }));
    const sizePx = computed(() => ({
      "3xs": 16,
      "2xs": 20,
      "xs": 24,
      "sm": 28,
      "md": 32,
      "lg": 36,
      "xl": 40,
      "2xl": 44,
      "3xl": 48
    })[props.size || "md"]);
    const error = ref(false);
    watch(() => props.src, () => {
      if (error.value) {
        error.value = false;
      }
    });
    function onError() {
      error.value = true;
    }
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(props.chip ? _sfc_main$d : unref(Primitive)), mergeProps({
        as: as.value.root
      }, props.chip ? typeof props.chip === "object" ? { inset: true, ...props.chip } : { inset: true } : {}, {
        "data-slot": "root",
        class: ui.value.root({ class: [props.ui?.root, props.class] }),
        style: props.style
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (__props.src && !error.value) {
              ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(as.value.img || unref(__nuxt_component_5)), mergeProps({
                src: __props.src,
                alt: __props.alt,
                width: sizePx.value,
                height: sizePx.value
              }, _ctx.$attrs, {
                "data-slot": "image",
                class: ui.value.image({ class: props.ui?.image }),
                onError
              }), null), _parent2, _scopeId);
            } else {
              _push2(ssrRenderComponent(unref(Slot), _ctx.$attrs, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    ssrRenderSlot(_ctx.$slots, "default", {}, () => {
                      if (__props.icon) {
                        _push3(ssrRenderComponent(_sfc_main$f, {
                          name: __props.icon,
                          "data-slot": "icon",
                          class: ui.value.icon({ class: props.ui?.icon })
                        }, null, _parent3, _scopeId2));
                      } else {
                        _push3(`<span data-slot="fallback" class="${ssrRenderClass(ui.value.fallback({ class: props.ui?.fallback }))}"${_scopeId2}>${ssrInterpolate(fallback.value || " ")}</span>`);
                      }
                    }, _push3, _parent3, _scopeId2);
                  } else {
                    return [
                      renderSlot(_ctx.$slots, "default", {}, () => [
                        __props.icon ? (openBlock(), createBlock(_sfc_main$f, {
                          key: 0,
                          name: __props.icon,
                          "data-slot": "icon",
                          class: ui.value.icon({ class: props.ui?.icon })
                        }, null, 8, ["name", "class"])) : (openBlock(), createBlock("span", {
                          key: 1,
                          "data-slot": "fallback",
                          class: ui.value.fallback({ class: props.ui?.fallback })
                        }, toDisplayString(fallback.value || " "), 3))
                      ])
                    ];
                  }
                }),
                _: 3
              }, _parent2, _scopeId));
            }
          } else {
            return [
              __props.src && !error.value ? (openBlock(), createBlock(resolveDynamicComponent(as.value.img || unref(__nuxt_component_5)), mergeProps({
                key: 0,
                src: __props.src,
                alt: __props.alt,
                width: sizePx.value,
                height: sizePx.value
              }, _ctx.$attrs, {
                "data-slot": "image",
                class: ui.value.image({ class: props.ui?.image }),
                onError
              }), null, 16, ["src", "alt", "width", "height", "class"])) : (openBlock(), createBlock(unref(Slot), mergeProps({ key: 1 }, _ctx.$attrs), {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "default", {}, () => [
                    __props.icon ? (openBlock(), createBlock(_sfc_main$f, {
                      key: 0,
                      name: __props.icon,
                      "data-slot": "icon",
                      class: ui.value.icon({ class: props.ui?.icon })
                    }, null, 8, ["name", "class"])) : (openBlock(), createBlock("span", {
                      key: 1,
                      "data-slot": "fallback",
                      class: ui.value.fallback({ class: props.ui?.fallback })
                    }, toDisplayString(fallback.value || " "), 3))
                  ])
                ]),
                _: 3
              }, 16))
            ];
          }
        }),
        _: 3
      }), _parent);
    };
  }
});
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/Avatar.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
function useComponentIcons(componentProps) {
  const appConfig2 = useAppConfig();
  const props = computed(() => toValue(componentProps));
  const isLeading = computed(() => props.value.icon && props.value.leading || props.value.icon && !props.value.trailing || props.value.loading && !props.value.trailing || !!props.value.leadingIcon);
  const isTrailing = computed(() => props.value.icon && props.value.trailing || props.value.loading && props.value.trailing || !!props.value.trailingIcon);
  const leadingIconName = computed(() => {
    if (props.value.loading) {
      return props.value.loadingIcon || appConfig2.ui.icons.loading;
    }
    return props.value.leadingIcon || props.value.icon;
  });
  const trailingIconName = computed(() => {
    if (props.value.loading && !isLeading.value) {
      return props.value.loadingIcon || appConfig2.ui.icons.loading;
    }
    return props.value.trailingIcon || props.value.icon;
  });
  return {
    isLeading,
    isTrailing,
    leadingIconName,
    trailingIconName
  };
}
const fieldGroupInjectionKey = /* @__PURE__ */ Symbol("nuxt-ui.field-group");
function useFieldGroup(props) {
  const fieldGroup = inject(fieldGroupInjectionKey, void 0);
  return {
    orientation: computed(() => fieldGroup?.value.orientation),
    size: computed(() => props?.size ?? fieldGroup?.value.size)
  };
}
const formOptionsInjectionKey = /* @__PURE__ */ Symbol("nuxt-ui.form-options");
const formBusInjectionKey = /* @__PURE__ */ Symbol("nuxt-ui.form-events");
const formFieldInjectionKey = /* @__PURE__ */ Symbol("nuxt-ui.form-field");
const inputIdInjectionKey = /* @__PURE__ */ Symbol("nuxt-ui.input-id");
const formInputsInjectionKey = /* @__PURE__ */ Symbol("nuxt-ui.form-inputs");
const formLoadingInjectionKey = /* @__PURE__ */ Symbol("nuxt-ui.form-loading");
const formErrorsInjectionKey = /* @__PURE__ */ Symbol("nuxt-ui.form-errors");
function useFormField(props, opts) {
  const formOptions = inject(formOptionsInjectionKey, void 0);
  const formBus = inject(formBusInjectionKey, void 0);
  const formField = inject(formFieldInjectionKey, void 0);
  const inputId = inject(inputIdInjectionKey, void 0);
  provide(formFieldInjectionKey, void 0);
  if (formField && inputId) {
    if (opts?.bind === false) {
      inputId.value = void 0;
    } else if (props?.id) {
      inputId.value = props?.id;
    }
  }
  function emitFormEvent(type, name, eager) {
    if (formBus && formField && name) {
      formBus.emit({ type, name, eager });
    }
  }
  function emitFormBlur() {
    emitFormEvent("blur", formField?.value.name);
  }
  function emitFormFocus() {
    emitFormEvent("focus", formField?.value.name);
  }
  function emitFormChange() {
    emitFormEvent("change", formField?.value.name);
  }
  const emitFormInput = useDebounceFn(
    () => {
      emitFormEvent("input", formField?.value.name, !opts?.deferInputValidation || formField?.value.eagerValidation);
    },
    formField?.value.validateOnInputDelay ?? formOptions?.value.validateOnInputDelay ?? 0
  );
  return {
    id: computed(() => props?.id ?? inputId?.value),
    name: computed(() => props?.name ?? formField?.value.name),
    size: computed(() => props?.size ?? formField?.value.size),
    color: computed(() => formField?.value.error ? "error" : props?.color),
    highlight: computed(() => formField?.value.error ? true : props?.highlight),
    disabled: computed(() => formOptions?.value.disabled || props?.disabled),
    emitFormBlur,
    emitFormInput,
    emitFormChange,
    emitFormFocus,
    ariaAttrs: computed(() => {
      if (!formField?.value) return;
      const descriptiveAttrs = ["error", "hint", "description", "help"].filter((type) => formField?.value?.[type]).map((type) => `${formField?.value.ariaId}-${type}`) || [];
      const attrs = {
        "aria-invalid": !!formField?.value.error
      };
      if (descriptiveAttrs.length > 0) {
        attrs["aria-describedby"] = descriptiveAttrs.join(" ");
      }
      return attrs;
    })
  };
}
const linkKeys = [
  "active",
  "activeClass",
  "ariaCurrentValue",
  "as",
  "disabled",
  "download",
  "exact",
  "exactActiveClass",
  "exactHash",
  "exactQuery",
  "external",
  "form",
  "formaction",
  "formenctype",
  "formmethod",
  "formnovalidate",
  "formtarget",
  "href",
  "hreflang",
  "inactiveClass",
  "media",
  "noPrefetch",
  "noRel",
  "onClick",
  "ping",
  "prefetch",
  "prefetchOn",
  "prefetchedClass",
  "referrerpolicy",
  "rel",
  "replace",
  "target",
  "title",
  "to",
  "trailingSlash",
  "type",
  "viewTransition"
];
function pickLinkProps(link) {
  const keys = Object.keys(link);
  const ariaKeys = keys.filter((key) => key.startsWith("aria-"));
  const dataKeys = keys.filter((key) => key.startsWith("data-"));
  const propsToInclude = [
    ...linkKeys,
    ...ariaKeys,
    ...dataKeys
  ];
  return reactivePick(link, ...propsToInclude);
}
function isPartiallyEqual(item1, item2) {
  const diffedKeys = diff(item1, item2).reduce((filtered, q) => {
    if (q.type === "added") {
      filtered.add(q.key);
    }
    return filtered;
  }, /* @__PURE__ */ new Set());
  const item1Filtered = Object.fromEntries(Object.entries(item1).filter(([key]) => !diffedKeys.has(key)));
  const item2Filtered = Object.fromEntries(Object.entries(item2).filter(([key]) => !diffedKeys.has(key)));
  return isEqual(item1Filtered, item2Filtered);
}
const _sfc_main$b = {
  __name: "ULinkBase",
  __ssrInlineRender: true,
  props: {
    as: { type: String, required: false, default: "button" },
    type: { type: String, required: false, default: "button" },
    disabled: { type: Boolean, required: false },
    onClick: { type: [Function, Array], required: false },
    href: { type: String, required: false },
    navigate: { type: Function, required: false },
    target: { type: [String, Object, null], required: false },
    rel: { type: [String, Object, null], required: false },
    active: { type: Boolean, required: false },
    isExternal: { type: Boolean, required: false }
  },
  setup(__props) {
    const props = __props;
    function onClickWrapper(e) {
      if (props.disabled) {
        e.stopPropagation();
        e.preventDefault();
        return;
      }
      if (props.onClick) {
        for (const onClick of Array.isArray(props.onClick) ? props.onClick : [props.onClick]) {
          onClick(e);
        }
      }
      if (props.href && props.navigate && !props.isExternal) {
        props.navigate(e);
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Primitive), mergeProps(__props.href ? {
        "as": "a",
        "href": __props.disabled ? void 0 : __props.href,
        "aria-disabled": __props.disabled ? "true" : void 0,
        "role": __props.disabled ? "link" : void 0,
        "tabindex": __props.disabled ? -1 : void 0
      } : __props.as === "button" ? {
        as: __props.as,
        type: __props.type,
        disabled: __props.disabled
      } : {
        as: __props.as
      }, {
        rel: __props.rel,
        target: __props.target,
        onClick: onClickWrapper
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
};
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/LinkBase.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const theme$4 = {
  "base": "focus-visible:outline-primary",
  "variants": {
    "active": {
      "true": "text-primary",
      "false": "text-muted"
    },
    "disabled": {
      "true": "cursor-not-allowed opacity-75"
    }
  },
  "compoundVariants": [
    {
      "active": false,
      "disabled": false,
      "class": [
        "hover:text-default",
        "transition-colors"
      ]
    }
  ]
};
const _sfc_main$a = /* @__PURE__ */ Object.assign({ inheritAttrs: false }, {
  __name: "ULink",
  __ssrInlineRender: true,
  props: {
    as: { type: null, required: false, default: "button" },
    type: { type: null, required: false, default: "button" },
    disabled: { type: Boolean, required: false },
    active: { type: Boolean, required: false, default: void 0 },
    exact: { type: Boolean, required: false },
    exactQuery: { type: [Boolean, String], required: false },
    exactHash: { type: Boolean, required: false },
    inactiveClass: { type: String, required: false },
    custom: { type: Boolean, required: false },
    raw: { type: Boolean, required: false },
    class: { type: null, required: false },
    to: { type: null, required: false },
    href: { type: null, required: false },
    external: { type: Boolean, required: false },
    target: { type: [String, Object, null], required: false },
    rel: { type: [String, Object, null], required: false },
    noRel: { type: Boolean, required: false },
    prefetchedClass: { type: String, required: false },
    prefetch: { type: Boolean, required: false },
    prefetchOn: { type: [String, Object], required: false },
    noPrefetch: { type: Boolean, required: false },
    trailingSlash: { type: String, required: false },
    activeClass: { type: String, required: false },
    exactActiveClass: { type: String, required: false },
    ariaCurrentValue: { type: String, required: false, default: "page" },
    viewTransition: { type: Boolean, required: false },
    replace: { type: Boolean, required: false }
  },
  setup(__props) {
    const props = __props;
    const route = useRoute();
    const appConfig2 = useAppConfig();
    const nuxtLinkProps = useForwardProps(reactiveOmit(props, "as", "type", "disabled", "active", "exact", "exactQuery", "exactHash", "activeClass", "inactiveClass", "to", "href", "raw", "custom", "class"));
    const ui = computed(() => tv({
      extend: tv(theme$4),
      ...defu({
        variants: {
          active: {
            true: mergeClasses(appConfig2.ui?.link?.variants?.active?.true, props.activeClass),
            false: mergeClasses(appConfig2.ui?.link?.variants?.active?.false, props.inactiveClass)
          }
        }
      }, appConfig2.ui?.link || {})
    }));
    const to = computed(() => props.to ?? props.href);
    function isLinkActive({ route: linkRoute, isActive, isExactActive }) {
      if (props.active !== void 0) {
        return props.active;
      }
      if (props.exactQuery === "partial") {
        if (!isPartiallyEqual(linkRoute.query, route.query)) return false;
      } else if (props.exactQuery === true) {
        if (!isEqual(linkRoute.query, route.query)) return false;
      }
      if (props.exactHash && linkRoute.hash !== route.hash) {
        return false;
      }
      if (props.exact && isExactActive) {
        return true;
      }
      if (!props.exact && isActive) {
        return true;
      }
      return false;
    }
    function resolveLinkClass({ route: route2, isActive, isExactActive }) {
      const active = isLinkActive({ route: route2, isActive, isExactActive });
      if (props.raw) {
        return [props.class, active ? props.activeClass : props.inactiveClass];
      }
      return ui.value({ class: props.class, active, disabled: props.disabled });
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_1;
      _push(ssrRenderComponent(_component_NuxtLink, mergeProps(unref(nuxtLinkProps), {
        to: to.value,
        custom: ""
      }, _attrs), {
        default: withCtx(({ href, navigate, route: linkRoute, rel, target, isExternal, isActive, isExactActive }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (__props.custom) {
              ssrRenderSlot(_ctx.$slots, "default", {
                ..._ctx.$attrs,
                ...__props.exact && isExactActive ? { "aria-current": props.ariaCurrentValue } : {},
                as: __props.as,
                type: __props.type,
                disabled: __props.disabled,
                href,
                navigate,
                rel,
                target,
                isExternal,
                active: isLinkActive({ route: linkRoute, isActive, isExactActive })
              }, null, _push2, _parent2, _scopeId);
            } else {
              _push2(ssrRenderComponent(_sfc_main$b, mergeProps({
                ..._ctx.$attrs,
                ...__props.exact && isExactActive ? { "aria-current": props.ariaCurrentValue } : {},
                as: __props.as,
                type: __props.type,
                disabled: __props.disabled,
                href,
                navigate,
                rel,
                target,
                isExternal
              }, {
                class: resolveLinkClass({ route: linkRoute, isActive, isExactActive })
              }), {
                default: withCtx((_, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    ssrRenderSlot(_ctx.$slots, "default", {
                      active: isLinkActive({ route: linkRoute, isActive, isExactActive })
                    }, null, _push3, _parent3, _scopeId2);
                  } else {
                    return [
                      renderSlot(_ctx.$slots, "default", {
                        active: isLinkActive({ route: linkRoute, isActive, isExactActive })
                      })
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            }
          } else {
            return [
              __props.custom ? renderSlot(_ctx.$slots, "default", mergeProps({ key: 0 }, {
                ..._ctx.$attrs,
                ...__props.exact && isExactActive ? { "aria-current": props.ariaCurrentValue } : {},
                as: __props.as,
                type: __props.type,
                disabled: __props.disabled,
                href,
                navigate,
                rel,
                target,
                isExternal,
                active: isLinkActive({ route: linkRoute, isActive, isExactActive })
              })) : (openBlock(), createBlock(_sfc_main$b, mergeProps({ key: 1 }, {
                ..._ctx.$attrs,
                ...__props.exact && isExactActive ? { "aria-current": props.ariaCurrentValue } : {},
                as: __props.as,
                type: __props.type,
                disabled: __props.disabled,
                href,
                navigate,
                rel,
                target,
                isExternal
              }, {
                class: resolveLinkClass({ route: linkRoute, isActive, isExactActive })
              }), {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "default", {
                    active: isLinkActive({ route: linkRoute, isActive, isExactActive })
                  })
                ]),
                _: 2
              }, 1040, ["class"]))
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/Link.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const theme$3 = {
  "slots": {
    "base": [
      "rounded-md font-medium inline-flex items-center disabled:cursor-not-allowed aria-disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:opacity-75",
      "transition-colors"
    ],
    "label": "truncate",
    "leadingIcon": "shrink-0",
    "leadingAvatar": "shrink-0",
    "leadingAvatarSize": "",
    "trailingIcon": "shrink-0"
  },
  "variants": {
    "fieldGroup": {
      "horizontal": "not-only:first:rounded-e-none not-only:last:rounded-s-none not-last:not-first:rounded-none focus-visible:z-[1]",
      "vertical": "not-only:first:rounded-b-none not-only:last:rounded-t-none not-last:not-first:rounded-none focus-visible:z-[1]"
    },
    "color": {
      "primary": "",
      "secondary": "",
      "success": "",
      "info": "",
      "warning": "",
      "error": "",
      "neutral": ""
    },
    "variant": {
      "solid": "",
      "outline": "",
      "soft": "",
      "subtle": "",
      "ghost": "",
      "link": ""
    },
    "size": {
      "xs": {
        "base": "px-2 py-1 text-xs gap-1",
        "leadingIcon": "size-4",
        "leadingAvatarSize": "3xs",
        "trailingIcon": "size-4"
      },
      "sm": {
        "base": "px-2.5 py-1.5 text-xs gap-1.5",
        "leadingIcon": "size-4",
        "leadingAvatarSize": "3xs",
        "trailingIcon": "size-4"
      },
      "md": {
        "base": "px-2.5 py-1.5 text-sm gap-1.5",
        "leadingIcon": "size-5",
        "leadingAvatarSize": "2xs",
        "trailingIcon": "size-5"
      },
      "lg": {
        "base": "px-3 py-2 text-sm gap-2",
        "leadingIcon": "size-5",
        "leadingAvatarSize": "2xs",
        "trailingIcon": "size-5"
      },
      "xl": {
        "base": "px-3 py-2 text-base gap-2",
        "leadingIcon": "size-6",
        "leadingAvatarSize": "xs",
        "trailingIcon": "size-6"
      }
    },
    "block": {
      "true": {
        "base": "w-full justify-center",
        "trailingIcon": "ms-auto"
      }
    },
    "square": {
      "true": ""
    },
    "leading": {
      "true": ""
    },
    "trailing": {
      "true": ""
    },
    "loading": {
      "true": ""
    },
    "active": {
      "true": {
        "base": ""
      },
      "false": {
        "base": ""
      }
    }
  },
  "compoundVariants": [
    {
      "color": "primary",
      "variant": "solid",
      "class": "text-inverted bg-primary hover:bg-primary/75 active:bg-primary/75 disabled:bg-primary aria-disabled:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    },
    {
      "color": "secondary",
      "variant": "solid",
      "class": "text-inverted bg-secondary hover:bg-secondary/75 active:bg-secondary/75 disabled:bg-secondary aria-disabled:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
    },
    {
      "color": "success",
      "variant": "solid",
      "class": "text-inverted bg-success hover:bg-success/75 active:bg-success/75 disabled:bg-success aria-disabled:bg-success focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-success"
    },
    {
      "color": "info",
      "variant": "solid",
      "class": "text-inverted bg-info hover:bg-info/75 active:bg-info/75 disabled:bg-info aria-disabled:bg-info focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-info"
    },
    {
      "color": "warning",
      "variant": "solid",
      "class": "text-inverted bg-warning hover:bg-warning/75 active:bg-warning/75 disabled:bg-warning aria-disabled:bg-warning focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warning"
    },
    {
      "color": "error",
      "variant": "solid",
      "class": "text-inverted bg-error hover:bg-error/75 active:bg-error/75 disabled:bg-error aria-disabled:bg-error focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-error"
    },
    {
      "color": "primary",
      "variant": "outline",
      "class": "ring ring-inset ring-primary/50 text-primary hover:bg-primary/10 active:bg-primary/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    },
    {
      "color": "secondary",
      "variant": "outline",
      "class": "ring ring-inset ring-secondary/50 text-secondary hover:bg-secondary/10 active:bg-secondary/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
    },
    {
      "color": "success",
      "variant": "outline",
      "class": "ring ring-inset ring-success/50 text-success hover:bg-success/10 active:bg-success/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-success"
    },
    {
      "color": "info",
      "variant": "outline",
      "class": "ring ring-inset ring-info/50 text-info hover:bg-info/10 active:bg-info/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-info"
    },
    {
      "color": "warning",
      "variant": "outline",
      "class": "ring ring-inset ring-warning/50 text-warning hover:bg-warning/10 active:bg-warning/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-warning"
    },
    {
      "color": "error",
      "variant": "outline",
      "class": "ring ring-inset ring-error/50 text-error hover:bg-error/10 active:bg-error/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-error"
    },
    {
      "color": "primary",
      "variant": "soft",
      "class": "text-primary bg-primary/10 hover:bg-primary/15 active:bg-primary/15 focus:outline-none focus-visible:bg-primary/15 disabled:bg-primary/10 aria-disabled:bg-primary/10"
    },
    {
      "color": "secondary",
      "variant": "soft",
      "class": "text-secondary bg-secondary/10 hover:bg-secondary/15 active:bg-secondary/15 focus:outline-none focus-visible:bg-secondary/15 disabled:bg-secondary/10 aria-disabled:bg-secondary/10"
    },
    {
      "color": "success",
      "variant": "soft",
      "class": "text-success bg-success/10 hover:bg-success/15 active:bg-success/15 focus:outline-none focus-visible:bg-success/15 disabled:bg-success/10 aria-disabled:bg-success/10"
    },
    {
      "color": "info",
      "variant": "soft",
      "class": "text-info bg-info/10 hover:bg-info/15 active:bg-info/15 focus:outline-none focus-visible:bg-info/15 disabled:bg-info/10 aria-disabled:bg-info/10"
    },
    {
      "color": "warning",
      "variant": "soft",
      "class": "text-warning bg-warning/10 hover:bg-warning/15 active:bg-warning/15 focus:outline-none focus-visible:bg-warning/15 disabled:bg-warning/10 aria-disabled:bg-warning/10"
    },
    {
      "color": "error",
      "variant": "soft",
      "class": "text-error bg-error/10 hover:bg-error/15 active:bg-error/15 focus:outline-none focus-visible:bg-error/15 disabled:bg-error/10 aria-disabled:bg-error/10"
    },
    {
      "color": "primary",
      "variant": "subtle",
      "class": "text-primary ring ring-inset ring-primary/25 bg-primary/10 hover:bg-primary/15 active:bg-primary/15 disabled:bg-primary/10 aria-disabled:bg-primary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    },
    {
      "color": "secondary",
      "variant": "subtle",
      "class": "text-secondary ring ring-inset ring-secondary/25 bg-secondary/10 hover:bg-secondary/15 active:bg-secondary/15 disabled:bg-secondary/10 aria-disabled:bg-secondary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
    },
    {
      "color": "success",
      "variant": "subtle",
      "class": "text-success ring ring-inset ring-success/25 bg-success/10 hover:bg-success/15 active:bg-success/15 disabled:bg-success/10 aria-disabled:bg-success/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-success"
    },
    {
      "color": "info",
      "variant": "subtle",
      "class": "text-info ring ring-inset ring-info/25 bg-info/10 hover:bg-info/15 active:bg-info/15 disabled:bg-info/10 aria-disabled:bg-info/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-info"
    },
    {
      "color": "warning",
      "variant": "subtle",
      "class": "text-warning ring ring-inset ring-warning/25 bg-warning/10 hover:bg-warning/15 active:bg-warning/15 disabled:bg-warning/10 aria-disabled:bg-warning/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-warning"
    },
    {
      "color": "error",
      "variant": "subtle",
      "class": "text-error ring ring-inset ring-error/25 bg-error/10 hover:bg-error/15 active:bg-error/15 disabled:bg-error/10 aria-disabled:bg-error/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-error"
    },
    {
      "color": "primary",
      "variant": "ghost",
      "class": "text-primary hover:bg-primary/10 active:bg-primary/10 focus:outline-none focus-visible:bg-primary/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent"
    },
    {
      "color": "secondary",
      "variant": "ghost",
      "class": "text-secondary hover:bg-secondary/10 active:bg-secondary/10 focus:outline-none focus-visible:bg-secondary/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent"
    },
    {
      "color": "success",
      "variant": "ghost",
      "class": "text-success hover:bg-success/10 active:bg-success/10 focus:outline-none focus-visible:bg-success/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent"
    },
    {
      "color": "info",
      "variant": "ghost",
      "class": "text-info hover:bg-info/10 active:bg-info/10 focus:outline-none focus-visible:bg-info/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent"
    },
    {
      "color": "warning",
      "variant": "ghost",
      "class": "text-warning hover:bg-warning/10 active:bg-warning/10 focus:outline-none focus-visible:bg-warning/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent"
    },
    {
      "color": "error",
      "variant": "ghost",
      "class": "text-error hover:bg-error/10 active:bg-error/10 focus:outline-none focus-visible:bg-error/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent"
    },
    {
      "color": "primary",
      "variant": "link",
      "class": "text-primary hover:text-primary/75 active:text-primary/75 disabled:text-primary aria-disabled:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
    },
    {
      "color": "secondary",
      "variant": "link",
      "class": "text-secondary hover:text-secondary/75 active:text-secondary/75 disabled:text-secondary aria-disabled:text-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-secondary"
    },
    {
      "color": "success",
      "variant": "link",
      "class": "text-success hover:text-success/75 active:text-success/75 disabled:text-success aria-disabled:text-success focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-success"
    },
    {
      "color": "info",
      "variant": "link",
      "class": "text-info hover:text-info/75 active:text-info/75 disabled:text-info aria-disabled:text-info focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-info"
    },
    {
      "color": "warning",
      "variant": "link",
      "class": "text-warning hover:text-warning/75 active:text-warning/75 disabled:text-warning aria-disabled:text-warning focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-warning"
    },
    {
      "color": "error",
      "variant": "link",
      "class": "text-error hover:text-error/75 active:text-error/75 disabled:text-error aria-disabled:text-error focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-error"
    },
    {
      "color": "neutral",
      "variant": "solid",
      "class": "text-inverted bg-inverted hover:bg-inverted/90 active:bg-inverted/90 disabled:bg-inverted aria-disabled:bg-inverted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inverted"
    },
    {
      "color": "neutral",
      "variant": "outline",
      "class": "ring ring-inset ring-accented text-default bg-default hover:bg-elevated active:bg-elevated disabled:bg-default aria-disabled:bg-default focus:outline-none focus-visible:ring-2 focus-visible:ring-inverted"
    },
    {
      "color": "neutral",
      "variant": "soft",
      "class": "text-default bg-elevated hover:bg-accented/75 active:bg-accented/75 focus:outline-none focus-visible:bg-accented/75 disabled:bg-elevated aria-disabled:bg-elevated"
    },
    {
      "color": "neutral",
      "variant": "subtle",
      "class": "ring ring-inset ring-accented text-default bg-elevated hover:bg-accented/75 active:bg-accented/75 disabled:bg-elevated aria-disabled:bg-elevated focus:outline-none focus-visible:ring-2 focus-visible:ring-inverted"
    },
    {
      "color": "neutral",
      "variant": "ghost",
      "class": "text-default hover:bg-elevated active:bg-elevated focus:outline-none focus-visible:bg-elevated hover:disabled:bg-transparent dark:hover:disabled:bg-transparent hover:aria-disabled:bg-transparent dark:hover:aria-disabled:bg-transparent"
    },
    {
      "color": "neutral",
      "variant": "link",
      "class": "text-muted hover:text-default active:text-default disabled:text-muted aria-disabled:text-muted focus:outline-none focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-inverted"
    },
    {
      "size": "xs",
      "square": true,
      "class": "p-1"
    },
    {
      "size": "sm",
      "square": true,
      "class": "p-1.5"
    },
    {
      "size": "md",
      "square": true,
      "class": "p-1.5"
    },
    {
      "size": "lg",
      "square": true,
      "class": "p-2"
    },
    {
      "size": "xl",
      "square": true,
      "class": "p-2"
    },
    {
      "loading": true,
      "leading": true,
      "class": {
        "leadingIcon": "animate-spin"
      }
    },
    {
      "loading": true,
      "leading": false,
      "trailing": true,
      "class": {
        "trailingIcon": "animate-spin"
      }
    }
  ],
  "defaultVariants": {
    "color": "primary",
    "variant": "solid",
    "size": "md"
  }
};
const _sfc_main$9 = {
  __name: "UButton",
  __ssrInlineRender: true,
  props: {
    label: { type: String, required: false },
    color: { type: null, required: false },
    activeColor: { type: null, required: false },
    variant: { type: null, required: false },
    activeVariant: { type: null, required: false },
    size: { type: null, required: false },
    square: { type: Boolean, required: false },
    block: { type: Boolean, required: false },
    loadingAuto: { type: Boolean, required: false },
    onClick: { type: [Function, Array], required: false },
    class: { type: null, required: false },
    ui: { type: null, required: false },
    icon: { type: null, required: false },
    avatar: { type: Object, required: false },
    leading: { type: Boolean, required: false },
    leadingIcon: { type: null, required: false },
    trailing: { type: Boolean, required: false },
    trailingIcon: { type: null, required: false },
    loading: { type: Boolean, required: false },
    loadingIcon: { type: null, required: false },
    as: { type: null, required: false },
    type: { type: null, required: false },
    disabled: { type: Boolean, required: false },
    active: { type: Boolean, required: false },
    exact: { type: Boolean, required: false },
    exactQuery: { type: [Boolean, String], required: false },
    exactHash: { type: Boolean, required: false },
    inactiveClass: { type: String, required: false },
    to: { type: null, required: false },
    href: { type: null, required: false },
    external: { type: Boolean, required: false },
    target: { type: [String, Object, null], required: false },
    rel: { type: [String, Object, null], required: false },
    noRel: { type: Boolean, required: false },
    prefetchedClass: { type: String, required: false },
    prefetch: { type: Boolean, required: false },
    prefetchOn: { type: [String, Object], required: false },
    noPrefetch: { type: Boolean, required: false },
    trailingSlash: { type: String, required: false },
    activeClass: { type: String, required: false },
    exactActiveClass: { type: String, required: false },
    ariaCurrentValue: { type: String, required: false },
    viewTransition: { type: Boolean, required: false },
    replace: { type: Boolean, required: false }
  },
  setup(__props) {
    const props = __props;
    const slots = useSlots();
    const appConfig2 = useAppConfig();
    const { orientation, size: buttonSize } = useFieldGroup(props);
    const linkProps = useForwardProps(pickLinkProps(props));
    const loadingAutoState = ref(false);
    const formLoading = inject(formLoadingInjectionKey, void 0);
    async function onClickWrapper(event) {
      loadingAutoState.value = true;
      const callbacks = Array.isArray(props.onClick) ? props.onClick : [props.onClick];
      try {
        await Promise.all(callbacks.map((fn) => fn?.(event)));
      } finally {
        loadingAutoState.value = false;
      }
    }
    const isLoading = computed(() => {
      return props.loading || props.loadingAuto && (loadingAutoState.value || formLoading?.value && props.type === "submit");
    });
    const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(
      computed(() => ({ ...props, loading: isLoading.value }))
    );
    const ui = computed(() => tv({
      extend: tv(theme$3),
      ...defu({
        variants: {
          active: {
            true: {
              base: mergeClasses(appConfig2.ui?.button?.variants?.active?.true?.base, props.activeClass)
            },
            false: {
              base: mergeClasses(appConfig2.ui?.button?.variants?.active?.false?.base, props.inactiveClass)
            }
          }
        }
      }, appConfig2.ui?.button || {})
    })({
      color: props.color,
      variant: props.variant,
      size: buttonSize.value,
      loading: isLoading.value,
      block: props.block,
      square: props.square || !slots.default && !props.label,
      leading: isLeading.value,
      trailing: isTrailing.value,
      fieldGroup: orientation.value
    }));
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$a, mergeProps({
        type: __props.type,
        disabled: __props.disabled || isLoading.value
      }, unref(omit)(unref(linkProps), ["type", "disabled", "onClick"]), { custom: "" }, _attrs), {
        default: withCtx(({ active, ...slotProps }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$b, mergeProps(slotProps, {
              "data-slot": "base",
              class: ui.value.base({
                class: [props.ui?.base, props.class],
                active,
                ...active && __props.activeVariant ? { variant: __props.activeVariant } : {},
                ...active && __props.activeColor ? { color: __props.activeColor } : {}
              }),
              onClick: onClickWrapper
            }), {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  ssrRenderSlot(_ctx.$slots, "leading", { ui: ui.value }, () => {
                    if (unref(isLeading) && unref(leadingIconName)) {
                      _push3(ssrRenderComponent(_sfc_main$f, {
                        name: unref(leadingIconName),
                        "data-slot": "leadingIcon",
                        class: ui.value.leadingIcon({ class: props.ui?.leadingIcon, active })
                      }, null, _parent3, _scopeId2));
                    } else if (!!__props.avatar) {
                      _push3(ssrRenderComponent(_sfc_main$c, mergeProps({
                        size: props.ui?.leadingAvatarSize || ui.value.leadingAvatarSize()
                      }, __props.avatar, {
                        "data-slot": "leadingAvatar",
                        class: ui.value.leadingAvatar({ class: props.ui?.leadingAvatar, active })
                      }), null, _parent3, _scopeId2));
                    } else {
                      _push3(`<!---->`);
                    }
                  }, _push3, _parent3, _scopeId2);
                  ssrRenderSlot(_ctx.$slots, "default", { ui: ui.value }, () => {
                    if (__props.label !== void 0 && __props.label !== null) {
                      _push3(`<span data-slot="label" class="${ssrRenderClass(ui.value.label({ class: props.ui?.label, active }))}"${_scopeId2}>${ssrInterpolate(__props.label)}</span>`);
                    } else {
                      _push3(`<!---->`);
                    }
                  }, _push3, _parent3, _scopeId2);
                  ssrRenderSlot(_ctx.$slots, "trailing", { ui: ui.value }, () => {
                    if (unref(isTrailing) && unref(trailingIconName)) {
                      _push3(ssrRenderComponent(_sfc_main$f, {
                        name: unref(trailingIconName),
                        "data-slot": "trailingIcon",
                        class: ui.value.trailingIcon({ class: props.ui?.trailingIcon, active })
                      }, null, _parent3, _scopeId2));
                    } else {
                      _push3(`<!---->`);
                    }
                  }, _push3, _parent3, _scopeId2);
                } else {
                  return [
                    renderSlot(_ctx.$slots, "leading", { ui: ui.value }, () => [
                      unref(isLeading) && unref(leadingIconName) ? (openBlock(), createBlock(_sfc_main$f, {
                        key: 0,
                        name: unref(leadingIconName),
                        "data-slot": "leadingIcon",
                        class: ui.value.leadingIcon({ class: props.ui?.leadingIcon, active })
                      }, null, 8, ["name", "class"])) : !!__props.avatar ? (openBlock(), createBlock(_sfc_main$c, mergeProps({
                        key: 1,
                        size: props.ui?.leadingAvatarSize || ui.value.leadingAvatarSize()
                      }, __props.avatar, {
                        "data-slot": "leadingAvatar",
                        class: ui.value.leadingAvatar({ class: props.ui?.leadingAvatar, active })
                      }), null, 16, ["size", "class"])) : createCommentVNode("", true)
                    ]),
                    renderSlot(_ctx.$slots, "default", { ui: ui.value }, () => [
                      __props.label !== void 0 && __props.label !== null ? (openBlock(), createBlock("span", {
                        key: 0,
                        "data-slot": "label",
                        class: ui.value.label({ class: props.ui?.label, active })
                      }, toDisplayString(__props.label), 3)) : createCommentVNode("", true)
                    ]),
                    renderSlot(_ctx.$slots, "trailing", { ui: ui.value }, () => [
                      unref(isTrailing) && unref(trailingIconName) ? (openBlock(), createBlock(_sfc_main$f, {
                        key: 0,
                        name: unref(trailingIconName),
                        "data-slot": "trailingIcon",
                        class: ui.value.trailingIcon({ class: props.ui?.trailingIcon, active })
                      }, null, 8, ["name", "class"])) : createCommentVNode("", true)
                    ])
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_sfc_main$b, mergeProps(slotProps, {
                "data-slot": "base",
                class: ui.value.base({
                  class: [props.ui?.base, props.class],
                  active,
                  ...active && __props.activeVariant ? { variant: __props.activeVariant } : {},
                  ...active && __props.activeColor ? { color: __props.activeColor } : {}
                }),
                onClick: onClickWrapper
              }), {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "leading", { ui: ui.value }, () => [
                    unref(isLeading) && unref(leadingIconName) ? (openBlock(), createBlock(_sfc_main$f, {
                      key: 0,
                      name: unref(leadingIconName),
                      "data-slot": "leadingIcon",
                      class: ui.value.leadingIcon({ class: props.ui?.leadingIcon, active })
                    }, null, 8, ["name", "class"])) : !!__props.avatar ? (openBlock(), createBlock(_sfc_main$c, mergeProps({
                      key: 1,
                      size: props.ui?.leadingAvatarSize || ui.value.leadingAvatarSize()
                    }, __props.avatar, {
                      "data-slot": "leadingAvatar",
                      class: ui.value.leadingAvatar({ class: props.ui?.leadingAvatar, active })
                    }), null, 16, ["size", "class"])) : createCommentVNode("", true)
                  ]),
                  renderSlot(_ctx.$slots, "default", { ui: ui.value }, () => [
                    __props.label !== void 0 && __props.label !== null ? (openBlock(), createBlock("span", {
                      key: 0,
                      "data-slot": "label",
                      class: ui.value.label({ class: props.ui?.label, active })
                    }, toDisplayString(__props.label), 3)) : createCommentVNode("", true)
                  ]),
                  renderSlot(_ctx.$slots, "trailing", { ui: ui.value }, () => [
                    unref(isTrailing) && unref(trailingIconName) ? (openBlock(), createBlock(_sfc_main$f, {
                      key: 0,
                      name: unref(trailingIconName),
                      "data-slot": "trailingIcon",
                      class: ui.value.trailingIcon({ class: props.ui?.trailingIcon, active })
                    }, null, 8, ["name", "class"])) : createCommentVNode("", true)
                  ])
                ]),
                _: 2
              }, 1040, ["class"])
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
};
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/Button.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const theme$2 = {
  "slots": {
    "root": "gap-2",
    "base": "relative overflow-hidden rounded-full bg-accented",
    "indicator": "rounded-full size-full transition-transform duration-200 ease-out",
    "status": "flex text-dimmed transition-[width] duration-200",
    "steps": "grid items-end",
    "step": "truncate text-end row-start-1 col-start-1 transition-opacity"
  },
  "variants": {
    "animation": {
      "carousel": "",
      "carousel-inverse": "",
      "swing": "",
      "elastic": ""
    },
    "color": {
      "primary": {
        "indicator": "bg-primary",
        "steps": "text-primary"
      },
      "secondary": {
        "indicator": "bg-secondary",
        "steps": "text-secondary"
      },
      "success": {
        "indicator": "bg-success",
        "steps": "text-success"
      },
      "info": {
        "indicator": "bg-info",
        "steps": "text-info"
      },
      "warning": {
        "indicator": "bg-warning",
        "steps": "text-warning"
      },
      "error": {
        "indicator": "bg-error",
        "steps": "text-error"
      },
      "neutral": {
        "indicator": "bg-inverted",
        "steps": "text-inverted"
      }
    },
    "size": {
      "2xs": {
        "status": "text-xs",
        "steps": "text-xs"
      },
      "xs": {
        "status": "text-xs",
        "steps": "text-xs"
      },
      "sm": {
        "status": "text-sm",
        "steps": "text-sm"
      },
      "md": {
        "status": "text-sm",
        "steps": "text-sm"
      },
      "lg": {
        "status": "text-sm",
        "steps": "text-sm"
      },
      "xl": {
        "status": "text-base",
        "steps": "text-base"
      },
      "2xl": {
        "status": "text-base",
        "steps": "text-base"
      }
    },
    "step": {
      "active": {
        "step": "opacity-100"
      },
      "first": {
        "step": "opacity-100 text-muted"
      },
      "other": {
        "step": "opacity-0"
      },
      "last": {
        "step": ""
      }
    },
    "orientation": {
      "horizontal": {
        "root": "w-full flex flex-col",
        "base": "w-full",
        "status": "flex-row items-center justify-end min-w-fit"
      },
      "vertical": {
        "root": "h-full flex flex-row-reverse",
        "base": "h-full",
        "status": "flex-col justify-end min-h-fit"
      }
    },
    "inverted": {
      "true": {
        "status": "self-end"
      }
    }
  },
  "compoundVariants": [
    {
      "inverted": true,
      "orientation": "horizontal",
      "class": {
        "step": "text-start",
        "status": "flex-row-reverse"
      }
    },
    {
      "inverted": true,
      "orientation": "vertical",
      "class": {
        "steps": "items-start",
        "status": "flex-col-reverse"
      }
    },
    {
      "orientation": "horizontal",
      "size": "2xs",
      "class": "h-px"
    },
    {
      "orientation": "horizontal",
      "size": "xs",
      "class": "h-0.5"
    },
    {
      "orientation": "horizontal",
      "size": "sm",
      "class": "h-1"
    },
    {
      "orientation": "horizontal",
      "size": "md",
      "class": "h-2"
    },
    {
      "orientation": "horizontal",
      "size": "lg",
      "class": "h-3"
    },
    {
      "orientation": "horizontal",
      "size": "xl",
      "class": "h-4"
    },
    {
      "orientation": "horizontal",
      "size": "2xl",
      "class": "h-5"
    },
    {
      "orientation": "vertical",
      "size": "2xs",
      "class": "w-px"
    },
    {
      "orientation": "vertical",
      "size": "xs",
      "class": "w-0.5"
    },
    {
      "orientation": "vertical",
      "size": "sm",
      "class": "w-1"
    },
    {
      "orientation": "vertical",
      "size": "md",
      "class": "w-2"
    },
    {
      "orientation": "vertical",
      "size": "lg",
      "class": "w-3"
    },
    {
      "orientation": "vertical",
      "size": "xl",
      "class": "w-4"
    },
    {
      "orientation": "vertical",
      "size": "2xl",
      "class": "w-5"
    },
    {
      "orientation": "horizontal",
      "animation": "carousel",
      "class": {
        "indicator": "data-[state=indeterminate]:animate-[carousel_2s_ease-in-out_infinite] data-[state=indeterminate]:rtl:animate-[carousel-rtl_2s_ease-in-out_infinite]"
      }
    },
    {
      "orientation": "vertical",
      "animation": "carousel",
      "class": {
        "indicator": "data-[state=indeterminate]:animate-[carousel-vertical_2s_ease-in-out_infinite]"
      }
    },
    {
      "orientation": "horizontal",
      "animation": "carousel-inverse",
      "class": {
        "indicator": "data-[state=indeterminate]:animate-[carousel-inverse_2s_ease-in-out_infinite] data-[state=indeterminate]:rtl:animate-[carousel-inverse-rtl_2s_ease-in-out_infinite]"
      }
    },
    {
      "orientation": "vertical",
      "animation": "carousel-inverse",
      "class": {
        "indicator": "data-[state=indeterminate]:animate-[carousel-inverse-vertical_2s_ease-in-out_infinite]"
      }
    },
    {
      "orientation": "horizontal",
      "animation": "swing",
      "class": {
        "indicator": "data-[state=indeterminate]:animate-[swing_2s_ease-in-out_infinite]"
      }
    },
    {
      "orientation": "vertical",
      "animation": "swing",
      "class": {
        "indicator": "data-[state=indeterminate]:animate-[swing-vertical_2s_ease-in-out_infinite]"
      }
    },
    {
      "orientation": "horizontal",
      "animation": "elastic",
      "class": {
        "indicator": "data-[state=indeterminate]:animate-[elastic_2s_ease-in-out_infinite]"
      }
    },
    {
      "orientation": "vertical",
      "animation": "elastic",
      "class": {
        "indicator": "data-[state=indeterminate]:animate-[elastic-vertical_2s_ease-in-out_infinite]"
      }
    }
  ],
  "defaultVariants": {
    "animation": "carousel",
    "color": "primary",
    "size": "md"
  }
};
const _sfc_main$8 = {
  __name: "UProgress",
  __ssrInlineRender: true,
  props: {
    as: { type: null, required: false },
    max: { type: [Number, Array], required: false },
    status: { type: Boolean, required: false },
    inverted: { type: Boolean, required: false, default: false },
    size: { type: null, required: false },
    color: { type: null, required: false },
    orientation: { type: null, required: false, default: "horizontal" },
    animation: { type: null, required: false },
    class: { type: null, required: false },
    ui: { type: null, required: false },
    getValueLabel: { type: Function, required: false },
    getValueText: { type: Function, required: false },
    modelValue: { type: [Number, null], required: false, default: null }
  },
  emits: ["update:modelValue", "update:max"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const slots = useSlots();
    const { dir } = useLocale();
    const appConfig2 = useAppConfig();
    const rootProps = useForwardPropsEmits(reactivePick(props, "getValueLabel", "getValueText", "modelValue"), emits);
    const isIndeterminate = computed(() => rootProps.value.modelValue === null);
    const hasSteps = computed(() => Array.isArray(props.max));
    const realMax = computed(() => {
      if (isIndeterminate.value || !props.max) {
        return void 0;
      }
      if (Array.isArray(props.max)) {
        return props.max.length - 1;
      }
      return Number(props.max);
    });
    const percent = computed(() => {
      if (isIndeterminate.value) {
        return void 0;
      }
      switch (true) {
        case rootProps.value.modelValue < 0:
          return 0;
        case rootProps.value.modelValue > (realMax.value ?? 100):
          return 100;
        default:
          return Math.round(rootProps.value.modelValue / (realMax.value ?? 100) * 100);
      }
    });
    const indicatorStyle = computed(() => {
      if (percent.value === void 0) {
        return;
      }
      if (props.orientation === "vertical") {
        return {
          transform: `translateY(${props.inverted ? "" : "-"}${100 - percent.value}%)`
        };
      } else {
        if (dir.value === "rtl") {
          return {
            transform: `translateX(${props.inverted ? "-" : ""}${100 - percent.value}%)`
          };
        } else {
          return {
            transform: `translateX(${props.inverted ? "" : "-"}${100 - percent.value}%)`
          };
        }
      }
    });
    const statusStyle = computed(() => {
      const value = `${Math.max(percent.value ?? 0, 0)}%`;
      return props.orientation === "vertical" ? { height: value } : { width: value };
    });
    function isActive(index2) {
      return index2 === Number(props.modelValue);
    }
    function isFirst(index2) {
      return index2 === 0;
    }
    function isLast(index2) {
      return index2 === realMax.value;
    }
    function stepVariant(index2) {
      index2 = Number(index2);
      if (isActive(index2) && !isFirst(index2)) {
        return "active";
      }
      if (isFirst(index2) && isActive(index2)) {
        return "first";
      }
      if (isLast(index2) && isActive(index2)) {
        return "last";
      }
      return "other";
    }
    const ui = computed(() => tv({ extend: tv(theme$2), ...appConfig2.ui?.progress || {} })({
      animation: props.animation,
      size: props.size,
      color: props.color,
      orientation: props.orientation,
      inverted: props.inverted
    }));
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Primitive), mergeProps({
        as: __props.as,
        "data-orientation": __props.orientation,
        "data-slot": "root",
        class: ui.value.root({ class: [props.ui?.root, props.class] })
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (!isIndeterminate.value && (__props.status || !!slots.status)) {
              _push2(`<div data-slot="status" class="${ssrRenderClass(ui.value.status({ class: props.ui?.status }))}" style="${ssrRenderStyle(statusStyle.value)}"${_scopeId}>`);
              ssrRenderSlot(_ctx.$slots, "status", { percent: percent.value }, () => {
                _push2(`${ssrInterpolate(percent.value)}% `);
              }, _push2, _parent2, _scopeId);
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(unref(ProgressRoot), mergeProps(unref(rootProps), {
              max: realMax.value,
              "data-slot": "base",
              class: ui.value.base({ class: props.ui?.base }),
              style: { "transform": "translateZ(0)" }
            }), {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(ProgressIndicator), {
                    "data-slot": "indicator",
                    class: ui.value.indicator({ class: props.ui?.indicator }),
                    style: indicatorStyle.value
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(ProgressIndicator), {
                      "data-slot": "indicator",
                      class: ui.value.indicator({ class: props.ui?.indicator }),
                      style: indicatorStyle.value
                    }, null, 8, ["class", "style"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (hasSteps.value) {
              _push2(`<div data-slot="steps" class="${ssrRenderClass(ui.value.steps({ class: props.ui?.steps }))}"${_scopeId}><!--[-->`);
              ssrRenderList(__props.max, (step, index2) => {
                _push2(`<div data-slot="step" class="${ssrRenderClass(ui.value.step({ class: props.ui?.step, step: stepVariant(index2) }))}"${_scopeId}>`);
                ssrRenderSlot(_ctx.$slots, `step-${index2}`, { step }, () => {
                  _push2(`${ssrInterpolate(step)}`);
                }, _push2, _parent2, _scopeId);
                _push2(`</div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              !isIndeterminate.value && (__props.status || !!slots.status) ? (openBlock(), createBlock("div", {
                key: 0,
                "data-slot": "status",
                class: ui.value.status({ class: props.ui?.status }),
                style: statusStyle.value
              }, [
                renderSlot(_ctx.$slots, "status", { percent: percent.value }, () => [
                  createTextVNode(toDisplayString(percent.value) + "% ", 1)
                ])
              ], 6)) : createCommentVNode("", true),
              createVNode(unref(ProgressRoot), mergeProps(unref(rootProps), {
                max: realMax.value,
                "data-slot": "base",
                class: ui.value.base({ class: props.ui?.base }),
                style: { "transform": "translateZ(0)" }
              }), {
                default: withCtx(() => [
                  createVNode(unref(ProgressIndicator), {
                    "data-slot": "indicator",
                    class: ui.value.indicator({ class: props.ui?.indicator }),
                    style: indicatorStyle.value
                  }, null, 8, ["class", "style"])
                ]),
                _: 1
              }, 16, ["max", "class"]),
              hasSteps.value ? (openBlock(), createBlock("div", {
                key: 1,
                "data-slot": "steps",
                class: ui.value.steps({ class: props.ui?.steps })
              }, [
                (openBlock(true), createBlock(Fragment, null, renderList(__props.max, (step, index2) => {
                  return openBlock(), createBlock("div", {
                    key: index2,
                    "data-slot": "step",
                    class: ui.value.step({ class: props.ui?.step, step: stepVariant(index2) })
                  }, [
                    renderSlot(_ctx.$slots, `step-${index2}`, { step }, () => [
                      createTextVNode(toDisplayString(step), 1)
                    ])
                  ], 2);
                }), 128))
              ], 2)) : createCommentVNode("", true)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
};
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/Progress.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const theme$1 = {
  "slots": {
    "root": "relative group overflow-hidden bg-default shadow-lg rounded-lg ring ring-default p-4 flex gap-2.5 focus:outline-none",
    "wrapper": "w-0 flex-1 flex flex-col",
    "title": "text-sm font-medium text-highlighted",
    "description": "text-sm text-muted",
    "icon": "shrink-0 size-5",
    "avatar": "shrink-0",
    "avatarSize": "2xl",
    "actions": "flex gap-1.5 shrink-0",
    "progress": "absolute inset-x-0 bottom-0",
    "close": "p-0"
  },
  "variants": {
    "color": {
      "primary": {
        "root": "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary",
        "icon": "text-primary"
      },
      "secondary": {
        "root": "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-secondary",
        "icon": "text-secondary"
      },
      "success": {
        "root": "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-success",
        "icon": "text-success"
      },
      "info": {
        "root": "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-info",
        "icon": "text-info"
      },
      "warning": {
        "root": "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-warning",
        "icon": "text-warning"
      },
      "error": {
        "root": "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-error",
        "icon": "text-error"
      },
      "neutral": {
        "root": "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-inverted",
        "icon": "text-highlighted"
      }
    },
    "orientation": {
      "horizontal": {
        "root": "items-center",
        "actions": "items-center"
      },
      "vertical": {
        "root": "items-start",
        "actions": "items-start mt-2.5"
      }
    },
    "title": {
      "true": {
        "description": "mt-1"
      }
    }
  },
  "defaultVariants": {
    "color": "primary"
  }
};
const _sfc_main$7 = {
  __name: "UToast",
  __ssrInlineRender: true,
  props: {
    as: { type: null, required: false },
    title: { type: [String, Object, Function], required: false },
    description: { type: [String, Object, Function], required: false },
    icon: { type: null, required: false },
    avatar: { type: Object, required: false },
    color: { type: null, required: false },
    orientation: { type: null, required: false, default: "vertical" },
    close: { type: [Boolean, Object], required: false, default: true },
    closeIcon: { type: null, required: false },
    actions: { type: Array, required: false },
    progress: { type: [Boolean, Object], required: false, default: true },
    class: { type: null, required: false },
    ui: { type: null, required: false },
    defaultOpen: { type: Boolean, required: false },
    open: { type: Boolean, required: false },
    type: { type: String, required: false },
    duration: { type: Number, required: false }
  },
  emits: ["escapeKeyDown", "pause", "resume", "swipeStart", "swipeMove", "swipeCancel", "swipeEnd", "update:open"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const slots = useSlots();
    const { t } = useLocale();
    const appConfig2 = useAppConfig();
    const rootProps = useForwardPropsEmits(reactivePick(props, "as", "defaultOpen", "open", "duration", "type"), emits);
    const ui = computed(() => tv({ extend: tv(theme$1), ...appConfig2.ui?.toast || {} })({
      color: props.color,
      orientation: props.orientation,
      title: !!props.title || !!slots.title
    }));
    const rootRef = useTemplateRef("rootRef");
    const height = ref(0);
    __expose({
      height
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(ToastRoot), mergeProps({
        ref_key: "rootRef",
        ref: rootRef
      }, unref(rootProps), {
        "data-orientation": __props.orientation,
        "data-slot": "root",
        class: ui.value.root({ class: [props.ui?.root, props.class] }),
        style: { "--height": height.value }
      }, _attrs), {
        default: withCtx(({ remaining, duration, open }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "leading", { ui: ui.value }, () => {
              if (__props.avatar) {
                _push2(ssrRenderComponent(_sfc_main$c, mergeProps({
                  size: props.ui?.avatarSize || ui.value.avatarSize()
                }, __props.avatar, {
                  "data-slot": "avatar",
                  class: ui.value.avatar({ class: props.ui?.avatar })
                }), null, _parent2, _scopeId));
              } else if (__props.icon) {
                _push2(ssrRenderComponent(_sfc_main$f, {
                  name: __props.icon,
                  "data-slot": "icon",
                  class: ui.value.icon({ class: props.ui?.icon })
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
            }, _push2, _parent2, _scopeId);
            _push2(`<div data-slot="wrapper" class="${ssrRenderClass(ui.value.wrapper({ class: props.ui?.wrapper }))}"${_scopeId}>`);
            if (__props.title || !!slots.title) {
              _push2(ssrRenderComponent(unref(ToastTitle), {
                "data-slot": "title",
                class: ui.value.title({ class: props.ui?.title })
              }, {
                default: withCtx((_, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    ssrRenderSlot(_ctx.$slots, "title", {}, () => {
                      if (typeof __props.title === "function") {
                        ssrRenderVNode(_push3, createVNode(resolveDynamicComponent(__props.title()), null, null), _parent3, _scopeId2);
                      } else if (typeof __props.title === "object") {
                        ssrRenderVNode(_push3, createVNode(resolveDynamicComponent(__props.title), null, null), _parent3, _scopeId2);
                      } else {
                        _push3(`<!--[-->${ssrInterpolate(__props.title)}<!--]-->`);
                      }
                    }, _push3, _parent3, _scopeId2);
                  } else {
                    return [
                      renderSlot(_ctx.$slots, "title", {}, () => [
                        typeof __props.title === "function" ? (openBlock(), createBlock(resolveDynamicComponent(__props.title()), { key: 0 })) : typeof __props.title === "object" ? (openBlock(), createBlock(resolveDynamicComponent(__props.title), { key: 1 })) : (openBlock(), createBlock(Fragment, { key: 2 }, [
                          createTextVNode(toDisplayString(__props.title), 1)
                        ], 64))
                      ])
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (__props.description || !!slots.description) {
              _push2(ssrRenderComponent(unref(ToastDescription), {
                "data-slot": "description",
                class: ui.value.description({ class: props.ui?.description })
              }, {
                default: withCtx((_, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    ssrRenderSlot(_ctx.$slots, "description", {}, () => {
                      if (typeof __props.description === "function") {
                        ssrRenderVNode(_push3, createVNode(resolveDynamicComponent(__props.description()), null, null), _parent3, _scopeId2);
                      } else if (typeof __props.description === "object") {
                        ssrRenderVNode(_push3, createVNode(resolveDynamicComponent(__props.description), null, null), _parent3, _scopeId2);
                      } else {
                        _push3(`<!--[-->${ssrInterpolate(__props.description)}<!--]-->`);
                      }
                    }, _push3, _parent3, _scopeId2);
                  } else {
                    return [
                      renderSlot(_ctx.$slots, "description", {}, () => [
                        typeof __props.description === "function" ? (openBlock(), createBlock(resolveDynamicComponent(__props.description()), { key: 0 })) : typeof __props.description === "object" ? (openBlock(), createBlock(resolveDynamicComponent(__props.description), { key: 1 })) : (openBlock(), createBlock(Fragment, { key: 2 }, [
                          createTextVNode(toDisplayString(__props.description), 1)
                        ], 64))
                      ])
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (__props.orientation === "vertical" && (__props.actions?.length || !!slots.actions)) {
              _push2(`<div data-slot="actions" class="${ssrRenderClass(ui.value.actions({ class: props.ui?.actions }))}"${_scopeId}>`);
              ssrRenderSlot(_ctx.$slots, "actions", {}, () => {
                _push2(`<!--[-->`);
                ssrRenderList(__props.actions, (action, index2) => {
                  _push2(ssrRenderComponent(unref(ToastAction), {
                    key: index2,
                    "alt-text": action.label || "Action",
                    "as-child": "",
                    onClick: () => {
                    }
                  }, {
                    default: withCtx((_, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(ssrRenderComponent(_sfc_main$9, mergeProps({
                          size: "xs",
                          color: __props.color
                        }, { ref_for: true }, action), null, _parent3, _scopeId2));
                      } else {
                        return [
                          createVNode(_sfc_main$9, mergeProps({
                            size: "xs",
                            color: __props.color
                          }, { ref_for: true }, action), null, 16, ["color"])
                        ];
                      }
                    }),
                    _: 2
                  }, _parent2, _scopeId));
                });
                _push2(`<!--]-->`);
              }, _push2, _parent2, _scopeId);
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            if (__props.orientation === "horizontal" && (__props.actions?.length || !!slots.actions) || __props.close) {
              _push2(`<div data-slot="actions" class="${ssrRenderClass(ui.value.actions({ class: props.ui?.actions, orientation: "horizontal" }))}"${_scopeId}>`);
              if (__props.orientation === "horizontal" && (__props.actions?.length || !!slots.actions)) {
                ssrRenderSlot(_ctx.$slots, "actions", {}, () => {
                  _push2(`<!--[-->`);
                  ssrRenderList(__props.actions, (action, index2) => {
                    _push2(ssrRenderComponent(unref(ToastAction), {
                      key: index2,
                      "alt-text": action.label || "Action",
                      "as-child": "",
                      onClick: () => {
                      }
                    }, {
                      default: withCtx((_, _push3, _parent3, _scopeId2) => {
                        if (_push3) {
                          _push3(ssrRenderComponent(_sfc_main$9, mergeProps({
                            size: "xs",
                            color: __props.color
                          }, { ref_for: true }, action), null, _parent3, _scopeId2));
                        } else {
                          return [
                            createVNode(_sfc_main$9, mergeProps({
                              size: "xs",
                              color: __props.color
                            }, { ref_for: true }, action), null, 16, ["color"])
                          ];
                        }
                      }),
                      _: 2
                    }, _parent2, _scopeId));
                  });
                  _push2(`<!--]-->`);
                }, _push2, _parent2, _scopeId);
              } else {
                _push2(`<!---->`);
              }
              if (__props.close || !!slots.close) {
                _push2(ssrRenderComponent(unref(ToastClose), { "as-child": "" }, {
                  default: withCtx((_, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      ssrRenderSlot(_ctx.$slots, "close", { ui: ui.value }, () => {
                        if (__props.close) {
                          _push3(ssrRenderComponent(_sfc_main$9, mergeProps({
                            icon: __props.closeIcon || unref(appConfig2).ui.icons.close,
                            color: "neutral",
                            variant: "link",
                            "aria-label": unref(t)("toast.close")
                          }, typeof __props.close === "object" ? __props.close : {}, {
                            "data-slot": "close",
                            class: ui.value.close({ class: props.ui?.close }),
                            onClick: () => {
                            }
                          }), null, _parent3, _scopeId2));
                        } else {
                          _push3(`<!---->`);
                        }
                      }, _push3, _parent3, _scopeId2);
                    } else {
                      return [
                        renderSlot(_ctx.$slots, "close", { ui: ui.value }, () => [
                          __props.close ? (openBlock(), createBlock(_sfc_main$9, mergeProps({
                            key: 0,
                            icon: __props.closeIcon || unref(appConfig2).ui.icons.close,
                            color: "neutral",
                            variant: "link",
                            "aria-label": unref(t)("toast.close")
                          }, typeof __props.close === "object" ? __props.close : {}, {
                            "data-slot": "close",
                            class: ui.value.close({ class: props.ui?.close }),
                            onClick: withModifiers(() => {
                            }, ["stop"])
                          }), null, 16, ["icon", "aria-label", "class", "onClick"])) : createCommentVNode("", true)
                        ])
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.progress && open && remaining > 0 && duration) {
              _push2(ssrRenderComponent(_sfc_main$8, mergeProps({
                "model-value": remaining / duration * 100,
                color: __props.color
              }, typeof __props.progress === "object" ? __props.progress : {}, {
                size: "sm",
                "data-slot": "progress",
                class: ui.value.progress({ class: props.ui?.progress })
              }), null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              renderSlot(_ctx.$slots, "leading", { ui: ui.value }, () => [
                __props.avatar ? (openBlock(), createBlock(_sfc_main$c, mergeProps({
                  key: 0,
                  size: props.ui?.avatarSize || ui.value.avatarSize()
                }, __props.avatar, {
                  "data-slot": "avatar",
                  class: ui.value.avatar({ class: props.ui?.avatar })
                }), null, 16, ["size", "class"])) : __props.icon ? (openBlock(), createBlock(_sfc_main$f, {
                  key: 1,
                  name: __props.icon,
                  "data-slot": "icon",
                  class: ui.value.icon({ class: props.ui?.icon })
                }, null, 8, ["name", "class"])) : createCommentVNode("", true)
              ]),
              createVNode("div", {
                "data-slot": "wrapper",
                class: ui.value.wrapper({ class: props.ui?.wrapper })
              }, [
                __props.title || !!slots.title ? (openBlock(), createBlock(unref(ToastTitle), {
                  key: 0,
                  "data-slot": "title",
                  class: ui.value.title({ class: props.ui?.title })
                }, {
                  default: withCtx(() => [
                    renderSlot(_ctx.$slots, "title", {}, () => [
                      typeof __props.title === "function" ? (openBlock(), createBlock(resolveDynamicComponent(__props.title()), { key: 0 })) : typeof __props.title === "object" ? (openBlock(), createBlock(resolveDynamicComponent(__props.title), { key: 1 })) : (openBlock(), createBlock(Fragment, { key: 2 }, [
                        createTextVNode(toDisplayString(__props.title), 1)
                      ], 64))
                    ])
                  ]),
                  _: 3
                }, 8, ["class"])) : createCommentVNode("", true),
                __props.description || !!slots.description ? (openBlock(), createBlock(unref(ToastDescription), {
                  key: 1,
                  "data-slot": "description",
                  class: ui.value.description({ class: props.ui?.description })
                }, {
                  default: withCtx(() => [
                    renderSlot(_ctx.$slots, "description", {}, () => [
                      typeof __props.description === "function" ? (openBlock(), createBlock(resolveDynamicComponent(__props.description()), { key: 0 })) : typeof __props.description === "object" ? (openBlock(), createBlock(resolveDynamicComponent(__props.description), { key: 1 })) : (openBlock(), createBlock(Fragment, { key: 2 }, [
                        createTextVNode(toDisplayString(__props.description), 1)
                      ], 64))
                    ])
                  ]),
                  _: 3
                }, 8, ["class"])) : createCommentVNode("", true),
                __props.orientation === "vertical" && (__props.actions?.length || !!slots.actions) ? (openBlock(), createBlock("div", {
                  key: 2,
                  "data-slot": "actions",
                  class: ui.value.actions({ class: props.ui?.actions })
                }, [
                  renderSlot(_ctx.$slots, "actions", {}, () => [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.actions, (action, index2) => {
                      return openBlock(), createBlock(unref(ToastAction), {
                        key: index2,
                        "alt-text": action.label || "Action",
                        "as-child": "",
                        onClick: withModifiers(() => {
                        }, ["stop"])
                      }, {
                        default: withCtx(() => [
                          createVNode(_sfc_main$9, mergeProps({
                            size: "xs",
                            color: __props.color
                          }, { ref_for: true }, action), null, 16, ["color"])
                        ]),
                        _: 2
                      }, 1032, ["alt-text", "onClick"]);
                    }), 128))
                  ])
                ], 2)) : createCommentVNode("", true)
              ], 2),
              __props.orientation === "horizontal" && (__props.actions?.length || !!slots.actions) || __props.close ? (openBlock(), createBlock("div", {
                key: 0,
                "data-slot": "actions",
                class: ui.value.actions({ class: props.ui?.actions, orientation: "horizontal" })
              }, [
                __props.orientation === "horizontal" && (__props.actions?.length || !!slots.actions) ? renderSlot(_ctx.$slots, "actions", { key: 0 }, () => [
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.actions, (action, index2) => {
                    return openBlock(), createBlock(unref(ToastAction), {
                      key: index2,
                      "alt-text": action.label || "Action",
                      "as-child": "",
                      onClick: withModifiers(() => {
                      }, ["stop"])
                    }, {
                      default: withCtx(() => [
                        createVNode(_sfc_main$9, mergeProps({
                          size: "xs",
                          color: __props.color
                        }, { ref_for: true }, action), null, 16, ["color"])
                      ]),
                      _: 2
                    }, 1032, ["alt-text", "onClick"]);
                  }), 128))
                ]) : createCommentVNode("", true),
                __props.close || !!slots.close ? (openBlock(), createBlock(unref(ToastClose), {
                  key: 1,
                  "as-child": ""
                }, {
                  default: withCtx(() => [
                    renderSlot(_ctx.$slots, "close", { ui: ui.value }, () => [
                      __props.close ? (openBlock(), createBlock(_sfc_main$9, mergeProps({
                        key: 0,
                        icon: __props.closeIcon || unref(appConfig2).ui.icons.close,
                        color: "neutral",
                        variant: "link",
                        "aria-label": unref(t)("toast.close")
                      }, typeof __props.close === "object" ? __props.close : {}, {
                        "data-slot": "close",
                        class: ui.value.close({ class: props.ui?.close }),
                        onClick: withModifiers(() => {
                        }, ["stop"])
                      }), null, 16, ["icon", "aria-label", "class", "onClick"])) : createCommentVNode("", true)
                    ])
                  ]),
                  _: 3
                })) : createCommentVNode("", true)
              ], 2)) : createCommentVNode("", true),
              __props.progress && open && remaining > 0 && duration ? (openBlock(), createBlock(_sfc_main$8, mergeProps({
                key: 1,
                "model-value": remaining / duration * 100,
                color: __props.color
              }, typeof __props.progress === "object" ? __props.progress : {}, {
                size: "sm",
                "data-slot": "progress",
                class: ui.value.progress({ class: props.ui?.progress })
              }), null, 16, ["model-value", "color", "class"])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
};
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/Toast.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const theme = {
  "slots": {
    "viewport": "fixed flex flex-col w-[calc(100%-2rem)] sm:w-96 z-[100] data-[expanded=true]:h-(--height) focus:outline-none",
    "base": "pointer-events-auto absolute inset-x-0 z-(--index) transform-(--transform) data-[expanded=false]:data-[front=false]:h-(--front-height) data-[expanded=false]:data-[front=false]:*:opacity-0 data-[front=false]:*:transition-opacity data-[front=false]:*:duration-100 data-[state=closed]:animate-[toast-closed_200ms_ease-in-out] data-[state=closed]:data-[expanded=false]:data-[front=false]:animate-[toast-collapsed-closed_200ms_ease-in-out] data-[swipe=move]:transition-none transition-[transform,translate,height] duration-200 ease-out"
  },
  "variants": {
    "position": {
      "top-left": {
        "viewport": "left-4"
      },
      "top-center": {
        "viewport": "left-1/2 transform -translate-x-1/2"
      },
      "top-right": {
        "viewport": "right-4"
      },
      "bottom-left": {
        "viewport": "left-4"
      },
      "bottom-center": {
        "viewport": "left-1/2 transform -translate-x-1/2"
      },
      "bottom-right": {
        "viewport": "right-4"
      }
    },
    "swipeDirection": {
      "up": "data-[swipe=end]:animate-[toast-slide-up_200ms_ease-out]",
      "right": "data-[swipe=end]:animate-[toast-slide-right_200ms_ease-out]",
      "down": "data-[swipe=end]:animate-[toast-slide-down_200ms_ease-out]",
      "left": "data-[swipe=end]:animate-[toast-slide-left_200ms_ease-out]"
    }
  },
  "compoundVariants": [
    {
      "position": [
        "top-left",
        "top-center",
        "top-right"
      ],
      "class": {
        "viewport": "top-4",
        "base": "top-0 data-[state=open]:animate-[slide-in-from-top_200ms_ease-in-out]"
      }
    },
    {
      "position": [
        "bottom-left",
        "bottom-center",
        "bottom-right"
      ],
      "class": {
        "viewport": "bottom-4",
        "base": "bottom-0 data-[state=open]:animate-[slide-in-from-bottom_200ms_ease-in-out]"
      }
    },
    {
      "swipeDirection": [
        "left",
        "right"
      ],
      "class": "data-[swipe=move]:translate-x-(--reka-toast-swipe-move-x) data-[swipe=end]:translate-x-(--reka-toast-swipe-end-x) data-[swipe=cancel]:translate-x-0"
    },
    {
      "swipeDirection": [
        "up",
        "down"
      ],
      "class": "data-[swipe=move]:translate-y-(--reka-toast-swipe-move-y) data-[swipe=end]:translate-y-(--reka-toast-swipe-end-y) data-[swipe=cancel]:translate-y-0"
    }
  ],
  "defaultVariants": {
    "position": "bottom-right"
  }
};
const __default__$1 = {
  name: "Toaster"
};
const _sfc_main$6 = /* @__PURE__ */ Object.assign(__default__$1, {
  __ssrInlineRender: true,
  props: {
    position: { type: null, required: false },
    expand: { type: Boolean, required: false, default: true },
    progress: { type: Boolean, required: false, default: true },
    portal: { type: [Boolean, String], required: false, skipCheck: true, default: true },
    max: { type: Number, required: false, default: 5 },
    class: { type: null, required: false },
    ui: { type: null, required: false },
    label: { type: String, required: false },
    duration: { type: Number, required: false, default: 5e3 },
    disableSwipe: { type: Boolean, required: false },
    swipeThreshold: { type: Number, required: false }
  },
  setup(__props) {
    const props = __props;
    const { toasts, remove } = useToast();
    const appConfig2 = useAppConfig();
    provide(toastMaxInjectionKey, toRef(() => props.max));
    const providerProps = useForwardProps(reactivePick(props, "duration", "label", "swipeThreshold", "disableSwipe"));
    const portalProps = usePortal(toRef(() => props.portal));
    const swipeDirection = computed(() => {
      switch (props.position) {
        case "top-center":
          return "up";
        case "top-right":
        case "bottom-right":
          return "right";
        case "bottom-center":
          return "down";
        case "top-left":
        case "bottom-left":
          return "left";
      }
      return "right";
    });
    const ui = computed(() => tv({ extend: tv(theme), ...appConfig2.ui?.toaster || {} })({
      position: props.position,
      swipeDirection: swipeDirection.value
    }));
    function onUpdateOpen(value, id) {
      if (value) {
        return;
      }
      remove(id);
    }
    const hovered = ref(false);
    const expanded = computed(() => props.expand || hovered.value);
    const refs = ref([]);
    const height = computed(() => refs.value.reduce((acc, { height: height2 }) => acc + height2 + 16, 0));
    const frontHeight = computed(() => refs.value[refs.value.length - 1]?.height || 0);
    function getOffset(index2) {
      return refs.value.slice(index2 + 1).reduce((acc, { height: height2 }) => acc + height2 + 16, 0);
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(ToastProvider), mergeProps({ "swipe-direction": swipeDirection.value }, unref(providerProps), _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
            _push2(`<!--[-->`);
            ssrRenderList(unref(toasts), (toast, index2) => {
              _push2(ssrRenderComponent(_sfc_main$7, mergeProps({
                key: toast.id,
                ref_for: true,
                ref_key: "refs",
                ref: refs,
                progress: __props.progress
              }, { ref_for: true }, unref(omit)(toast, ["id", "close"]), {
                close: toast.close,
                "data-expanded": expanded.value,
                "data-front": !expanded.value && index2 === unref(toasts).length - 1,
                style: {
                  "--index": index2 - unref(toasts).length + unref(toasts).length,
                  "--before": unref(toasts).length - 1 - index2,
                  "--offset": getOffset(index2),
                  "--scale": expanded.value ? "1" : "calc(1 - var(--before) * var(--scale-factor))",
                  "--translate": expanded.value ? "calc(var(--offset) * var(--translate-factor))" : "calc(var(--before) * var(--gap))",
                  "--transform": "translateY(var(--translate)) scale(var(--scale))"
                },
                "data-slot": "base",
                class: ui.value.base({ class: [props.ui?.base, toast.onClick ? "cursor-pointer" : void 0] }),
                "onUpdate:open": ($event) => onUpdateOpen($event, toast.id),
                onClick: ($event) => toast.onClick && toast.onClick(toast)
              }), null, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
            _push2(ssrRenderComponent(unref(ToastPortal), unref(portalProps), {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(ToastViewport), {
                    "data-expanded": expanded.value,
                    "data-slot": "viewport",
                    class: ui.value.viewport({ class: [props.ui?.viewport, props.class] }),
                    style: {
                      "--scale-factor": "0.05",
                      "--translate-factor": __props.position?.startsWith("top") ? "1px" : "-1px",
                      "--gap": __props.position?.startsWith("top") ? "16px" : "-16px",
                      "--front-height": `${frontHeight.value}px`,
                      "--height": `${height.value}px`
                    },
                    onMouseenter: ($event) => hovered.value = true,
                    onMouseleave: ($event) => hovered.value = false
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(ToastViewport), {
                      "data-expanded": expanded.value,
                      "data-slot": "viewport",
                      class: ui.value.viewport({ class: [props.ui?.viewport, props.class] }),
                      style: {
                        "--scale-factor": "0.05",
                        "--translate-factor": __props.position?.startsWith("top") ? "1px" : "-1px",
                        "--gap": __props.position?.startsWith("top") ? "16px" : "-16px",
                        "--front-height": `${frontHeight.value}px`,
                        "--height": `${height.value}px`
                      },
                      onMouseenter: ($event) => hovered.value = true,
                      onMouseleave: ($event) => hovered.value = false
                    }, null, 8, ["data-expanded", "class", "style", "onMouseenter", "onMouseleave"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              renderSlot(_ctx.$slots, "default"),
              (openBlock(true), createBlock(Fragment, null, renderList(unref(toasts), (toast, index2) => {
                return openBlock(), createBlock(_sfc_main$7, mergeProps({
                  key: toast.id,
                  ref_for: true,
                  ref_key: "refs",
                  ref: refs,
                  progress: __props.progress
                }, { ref_for: true }, unref(omit)(toast, ["id", "close"]), {
                  close: toast.close,
                  "data-expanded": expanded.value,
                  "data-front": !expanded.value && index2 === unref(toasts).length - 1,
                  style: {
                    "--index": index2 - unref(toasts).length + unref(toasts).length,
                    "--before": unref(toasts).length - 1 - index2,
                    "--offset": getOffset(index2),
                    "--scale": expanded.value ? "1" : "calc(1 - var(--before) * var(--scale-factor))",
                    "--translate": expanded.value ? "calc(var(--offset) * var(--translate-factor))" : "calc(var(--before) * var(--gap))",
                    "--transform": "translateY(var(--translate)) scale(var(--scale))"
                  },
                  "data-slot": "base",
                  class: ui.value.base({ class: [props.ui?.base, toast.onClick ? "cursor-pointer" : void 0] }),
                  "onUpdate:open": ($event) => onUpdateOpen($event, toast.id),
                  onClick: ($event) => toast.onClick && toast.onClick(toast)
                }), null, 16, ["progress", "close", "data-expanded", "data-front", "style", "class", "onUpdate:open", "onClick"]);
              }), 128)),
              createVNode(unref(ToastPortal), unref(portalProps), {
                default: withCtx(() => [
                  createVNode(unref(ToastViewport), {
                    "data-expanded": expanded.value,
                    "data-slot": "viewport",
                    class: ui.value.viewport({ class: [props.ui?.viewport, props.class] }),
                    style: {
                      "--scale-factor": "0.05",
                      "--translate-factor": __props.position?.startsWith("top") ? "1px" : "-1px",
                      "--gap": __props.position?.startsWith("top") ? "16px" : "-16px",
                      "--front-height": `${frontHeight.value}px`,
                      "--height": `${height.value}px`
                    },
                    onMouseenter: ($event) => hovered.value = true,
                    onMouseleave: ($event) => hovered.value = false
                  }, null, 8, ["data-expanded", "class", "style", "onMouseenter", "onMouseleave"])
                ]),
                _: 1
              }, 16)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/Toaster.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const UToaster = Object.assign(_sfc_main$6, { __name: "UToaster" });
function _useOverlay() {
  const overlays = shallowReactive([]);
  const create = (component, _options) => {
    const { props, defaultOpen, destroyOnClose } = _options || {};
    const options = reactive({
      id: /* @__PURE__ */ Symbol(""),
      isOpen: !!defaultOpen,
      component: markRaw(component),
      isMounted: !!defaultOpen,
      destroyOnClose: !!destroyOnClose,
      originalProps: props || {},
      props: { ...props }
    });
    overlays.push(options);
    return {
      ...options,
      open: (props2) => open(options.id, props2),
      close: (value) => close(options.id, value),
      patch: (props2) => patch(options.id, props2)
    };
  };
  const open = (id, props) => {
    const overlay = getOverlay(id);
    if (props) {
      overlay.props = { ...overlay.originalProps, ...props };
    } else {
      overlay.props = { ...overlay.originalProps };
    }
    overlay.isOpen = true;
    overlay.isMounted = true;
    const result = new Promise((resolve) => overlay.resolvePromise = resolve);
    return Object.assign(result, {
      id,
      isMounted: overlay.isMounted,
      isOpen: overlay.isOpen,
      result
    });
  };
  const close = (id, value) => {
    const overlay = getOverlay(id);
    overlay.isOpen = false;
    if (overlay.resolvePromise) {
      overlay.resolvePromise(value);
      overlay.resolvePromise = void 0;
    }
  };
  const closeAll = () => {
    overlays.forEach((overlay) => close(overlay.id));
  };
  const unmount = (id) => {
    const overlay = getOverlay(id);
    overlay.isMounted = false;
    if (overlay.destroyOnClose) {
      const index2 = overlays.findIndex((overlay2) => overlay2.id === id);
      overlays.splice(index2, 1);
    }
  };
  const patch = (id, props) => {
    const overlay = getOverlay(id);
    overlay.props = { ...overlay.props, ...props };
  };
  const getOverlay = (id) => {
    const overlay = overlays.find((overlay2) => overlay2.id === id);
    if (!overlay) {
      throw new Error("Overlay not found");
    }
    return overlay;
  };
  const isOpen = (id) => {
    const overlay = getOverlay(id);
    return overlay.isOpen;
  };
  return {
    overlays,
    open,
    close,
    closeAll,
    create,
    patch,
    unmount,
    isOpen
  };
}
const useOverlay = /* @__PURE__ */ createSharedComposable(_useOverlay);
const _sfc_main$5 = {
  __name: "UOverlayProvider",
  __ssrInlineRender: true,
  setup(__props) {
    const { overlays, unmount, close } = useOverlay();
    const mountedOverlays = computed(() => overlays.filter((overlay) => overlay.isMounted));
    const onAfterLeave = (id) => {
      close(id);
      unmount(id);
    };
    const onClose = (id, value) => {
      close(id, value);
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      ssrRenderList(mountedOverlays.value, (overlay) => {
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(overlay.component), mergeProps({
          key: overlay.id
        }, { ref_for: true }, overlay.props, {
          open: overlay.isOpen,
          "onUpdate:open": ($event) => overlay.isOpen = $event,
          onClose: (value) => onClose(overlay.id, value),
          "onAfter:leave": ($event) => onAfterLeave(overlay.id)
        }), null), _parent);
      });
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/OverlayProvider.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const __default__ = {
  name: "App"
};
const _sfc_main$4 = /* @__PURE__ */ Object.assign(__default__, {
  __ssrInlineRender: true,
  props: {
    tooltip: { type: Object, required: false },
    toaster: { type: [Object, null], required: false },
    locale: { type: Object, required: false },
    portal: { type: [Boolean, String], required: false, skipCheck: true, default: "body" },
    dir: { type: String, required: false },
    scrollBody: { type: [Boolean, Object], required: false },
    nonce: { type: String, required: false }
  },
  setup(__props) {
    const props = __props;
    const configProviderProps = useForwardProps(reactivePick(props, "scrollBody"));
    const tooltipProps = toRef(() => props.tooltip);
    const toasterProps = toRef(() => props.toaster);
    const locale = toRef(() => props.locale);
    provide(localeContextInjectionKey, locale);
    const portal = toRef(() => props.portal);
    provide(portalTargetInjectionKey, portal);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(ConfigProvider), mergeProps({
        "use-id": () => useId(),
        dir: props.dir || locale.value?.dir,
        locale: locale.value?.code
      }, unref(configProviderProps), _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(TooltipProvider), tooltipProps.value, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (__props.toaster !== null) {
                    _push3(ssrRenderComponent(UToaster, toasterProps.value, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          ssrRenderSlot(_ctx.$slots, "default", {}, null, _push4, _parent4, _scopeId3);
                        } else {
                          return [
                            renderSlot(_ctx.$slots, "default")
                          ];
                        }
                      }),
                      _: 3
                    }, _parent3, _scopeId2));
                  } else {
                    ssrRenderSlot(_ctx.$slots, "default", {}, null, _push3, _parent3, _scopeId2);
                  }
                  _push3(ssrRenderComponent(_sfc_main$5, null, null, _parent3, _scopeId2));
                } else {
                  return [
                    __props.toaster !== null ? (openBlock(), createBlock(UToaster, mergeProps({ key: 0 }, toasterProps.value), {
                      default: withCtx(() => [
                        renderSlot(_ctx.$slots, "default")
                      ]),
                      _: 3
                    }, 16)) : renderSlot(_ctx.$slots, "default", { key: 1 }),
                    createVNode(_sfc_main$5)
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(TooltipProvider), tooltipProps.value, {
                default: withCtx(() => [
                  __props.toaster !== null ? (openBlock(), createBlock(UToaster, mergeProps({ key: 0 }, toasterProps.value), {
                    default: withCtx(() => [
                      renderSlot(_ctx.$slots, "default")
                    ]),
                    _: 3
                  }, 16)) : renderSlot(_ctx.$slots, "default", { key: 1 }),
                  createVNode(_sfc_main$5)
                ]),
                _: 3
              }, 16)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/@nuxt/ui/dist/runtime/components/App.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_0$1 = Object.assign(_sfc_main$4, { __name: "UApp" });
const layouts = {
  admin: defineAsyncComponent(() => import('./admin-FEdK2xZ6.mjs').then((m) => m.default || m)),
  auth: defineAsyncComponent(() => import('./auth-BYfA1dYN.mjs').then((m) => m.default || m)),
  blank: defineAsyncComponent(() => import('./blank-D7UwsMKw.mjs').then((m) => m.default || m)),
  dashboard: defineAsyncComponent(() => import('./dashboard-B68gW0YB.mjs').then((m) => m.default || m)),
  default: defineAsyncComponent(() => import('./default-DiK8G7Mc.mjs').then((m) => m.default || m)),
  workspace: defineAsyncComponent(() => import('./workspace-DzI12agm.mjs').then((m) => m.default || m))
};
const routeRulesMatcher = _routeRulesMatcher;
const LayoutLoader = defineComponent({
  name: "LayoutLoader",
  inheritAttrs: false,
  props: {
    name: String,
    layoutProps: Object
  },
  setup(props, context) {
    return () => h(layouts[props.name], props.layoutProps, context.slots);
  }
});
const nuxtLayoutProps = {
  name: {
    type: [String, Boolean, Object],
    default: null
  },
  fallback: {
    type: [String, Object],
    default: null
  }
};
const __nuxt_component_0 = defineComponent({
  name: "NuxtLayout",
  inheritAttrs: false,
  props: nuxtLayoutProps,
  setup(props, context) {
    const nuxtApp = useNuxtApp();
    const injectedRoute = inject(PageRouteSymbol);
    const shouldUseEagerRoute = !injectedRoute || injectedRoute === useRoute();
    const route = shouldUseEagerRoute ? useRoute$1() : injectedRoute;
    const layout = computed(() => {
      let layout2 = unref(props.name) ?? route?.meta.layout ?? routeRulesMatcher(route?.path).appLayout ?? "default";
      if (layout2 && !(layout2 in layouts)) {
        if (props.fallback) {
          layout2 = unref(props.fallback);
        }
      }
      return layout2;
    });
    const layoutRef = shallowRef();
    context.expose({ layoutRef });
    const done = nuxtApp.deferHydration();
    let lastLayout;
    return () => {
      const hasLayout = layout.value && layout.value in layouts;
      const transitionProps = route?.meta.layoutTransition ?? appLayoutTransition;
      const previouslyRenderedLayout = lastLayout;
      lastLayout = layout.value;
      return _wrapInTransition(hasLayout && transitionProps, {
        default: () => h(Suspense, { suspensible: true, onResolve: () => {
          nextTick(done);
        } }, {
          default: () => h(
            LayoutProvider,
            {
              layoutProps: mergeProps(context.attrs, route.meta.layoutProps ?? {}, { ref: layoutRef }),
              key: layout.value || void 0,
              name: layout.value,
              shouldProvide: !props.name,
              isRenderingNewLayout: (name) => {
                return name !== previouslyRenderedLayout && name === layout.value;
              },
              hasTransition: !!transitionProps
            },
            context.slots
          )
        })
      }).default();
    };
  }
});
const LayoutProvider = defineComponent({
  name: "NuxtLayoutProvider",
  inheritAttrs: false,
  props: {
    name: {
      type: [String, Boolean]
    },
    layoutProps: {
      type: Object
    },
    hasTransition: {
      type: Boolean
    },
    shouldProvide: {
      type: Boolean
    },
    isRenderingNewLayout: {
      type: Function,
      required: true
    }
  },
  setup(props, context) {
    const name = props.name;
    if (props.shouldProvide) {
      provide(LayoutMetaSymbol, {
        // When name=false, always return true so NuxtPage doesn't skip rendering
        isCurrent: (route) => name === false || name === (route.meta.layout ?? routeRulesMatcher(route.path).appLayout ?? "default")
      });
    }
    const injectedRoute = inject(PageRouteSymbol);
    const isNotWithinNuxtPage = injectedRoute && injectedRoute === useRoute();
    if (isNotWithinNuxtPage) {
      const vueRouterRoute = useRoute$1();
      const reactiveChildRoute = {};
      for (const _key in vueRouterRoute) {
        const key = _key;
        Object.defineProperty(reactiveChildRoute, key, {
          enumerable: true,
          get: () => {
            return props.isRenderingNewLayout(props.name) ? vueRouterRoute[key] : injectedRoute[key];
          }
        });
      }
      provide(PageRouteSymbol, shallowReactive(reactiveChildRoute));
    }
    return () => {
      if (!name || typeof name === "string" && !(name in layouts)) {
        return context.slots.default?.();
      }
      return h(
        LayoutLoader,
        { key: name, layoutProps: props.layoutProps, name },
        context.slots
      );
    };
  }
});
const defineRouteProvider = (name = "RouteProvider") => defineComponent({
  name,
  props: {
    route: {
      type: Object,
      required: true
    },
    vnode: Object,
    vnodeRef: Object,
    renderKey: String,
    trackRootNodes: Boolean
  },
  setup(props) {
    const previousKey = props.renderKey;
    const previousRoute = props.route;
    const route = {};
    for (const key in props.route) {
      Object.defineProperty(route, key, {
        get: () => previousKey === props.renderKey ? props.route[key] : previousRoute[key],
        enumerable: true
      });
    }
    provide(PageRouteSymbol, shallowReactive(route));
    return () => {
      if (!props.vnode) {
        return props.vnode;
      }
      return h(props.vnode, { ref: props.vnodeRef });
    };
  }
});
const RouteProvider = defineRouteProvider();
const __nuxt_component_3 = defineComponent({
  name: "NuxtPage",
  inheritAttrs: false,
  props: {
    name: {
      type: String
    },
    transition: {
      type: [Boolean, Object],
      default: void 0
    },
    keepalive: {
      type: [Boolean, Object],
      default: void 0
    },
    route: {
      type: Object
    },
    pageKey: {
      type: [Function, String],
      default: null
    }
  },
  setup(props, { attrs, slots, expose }) {
    const nuxtApp = useNuxtApp();
    const pageRef = ref();
    inject(PageRouteSymbol, null);
    expose({ pageRef });
    inject(LayoutMetaSymbol, null);
    nuxtApp.deferHydration();
    return () => {
      return h(RouterView, { name: props.name, route: props.route, ...attrs }, {
        default: (routeProps) => {
          return h(Suspense, { suspensible: true }, {
            default() {
              return h(RouteProvider, {
                vnode: slots.default ? normalizeSlot(slots.default, routeProps) : routeProps.Component,
                route: routeProps.route,
                vnodeRef: pageRef
              });
            }
          });
        }
      });
    };
  }
});
function normalizeSlot(slot, data) {
  const slotContent = slot(data);
  return slotContent.length === 1 ? h(slotContent[0]) : h(Fragment, void 0, slotContent);
}
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "DevApiBaseIndicator",
  __ssrInlineRender: true,
  setup(__props) {
    const config = /* @__PURE__ */ useRuntimeConfig();
    const dev = false;
    const apiBaseUrl = config.public.apiBaseUrl;
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(dev)) {
        _push(`<div${ssrRenderAttrs(mergeProps({
          class: "fixed bottom-3 right-3 z-[9999] rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/30 px-2 py-1.5 text-xs font-mono text-amber-800 dark:text-amber-200 shadow-md",
          title: "API base URL (dev only)"
        }, _attrs))}> API: ${ssrInterpolate(unref(apiBaseUrl))}</div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/DevApiBaseIndicator.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_4 = Object.assign(_sfc_main$3, { __name: "DevApiBaseIndicator" });
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$2 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_UApp = __nuxt_component_0$1;
  const _component_NuxtRouteAnnouncer = __nuxt_component_2$1;
  const _component_NuxtLayout = __nuxt_component_0;
  const _component_NuxtPage = __nuxt_component_3;
  const _component_DevApiBaseIndicator = __nuxt_component_4;
  _push(ssrRenderComponent(_component_UApp, _attrs, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent(_component_NuxtRouteAnnouncer, null, null, _parent2, _scopeId));
        _push2(ssrRenderComponent(_component_NuxtLayout, null, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(ssrRenderComponent(_component_NuxtPage, null, null, _parent3, _scopeId2));
            } else {
              return [
                createVNode(_component_NuxtPage)
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
        _push2(ssrRenderComponent(_component_DevApiBaseIndicator, null, null, _parent2, _scopeId));
      } else {
        return [
          createVNode(_component_NuxtRouteAnnouncer),
          createVNode(_component_NuxtLayout, null, {
            default: withCtx(() => [
              createVNode(_component_NuxtPage)
            ]),
            _: 1
          }),
          createVNode(_component_DevApiBaseIndicator)
        ];
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const AppComponent = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender]]);
const EXCLUDED_PAGE_PREFIXES = ["/admin", "/auth", "/dashboard"];
let lastTrackedPagePath = null;
function normalizePath(path) {
  if (!path) return "/";
  return path.split("#")[0]?.split("?")[0] || "/";
}
function shouldTrackPage(path) {
  return !EXCLUDED_PAGE_PREFIXES.some((prefix) => path.startsWith(prefix));
}
function sanitizeString(value, maxLength = 240) {
  const normalized = value.replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "[redacted-email]").replace(/\bBearer\s+[A-Za-z0-9\-._~+/]+=*\b/gi, "Bearer [redacted]").replace(/\beyJ[A-Za-z0-9._-]+\b/g, "[redacted-token]").replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength)}...`;
}
function useAnalyticsTracking() {
  const route = useRoute();
  const { $api } = useNuxtApp();
  function currentPath() {
    return normalizePath(route.path);
  }
  async function trackEvent(payload, options) {
    return null;
  }
  function trackPageView(metadata) {
    const path = currentPath();
    if (!shouldTrackPage(path)) return null;
    if (lastTrackedPagePath === path) return null;
    lastTrackedPagePath = path;
    return trackEvent({
      metadata: {
        ...metadata,
        route_name: typeof route.name === "string" ? route.name : void 0
      }
    });
  }
  function trackSearch(query, metadata, options) {
    const trimmed = query.trim();
    if (!trimmed) return null;
    return trackEvent({
      path: currentPath(),
      metadata: {
        query: sanitizeString(trimmed, 120),
        ...metadata
      }
    });
  }
  function trackProductView(metadata, options) {
    return trackEvent({
      path: currentPath()
    });
  }
  function trackShopView(metadata, options) {
    return trackEvent({
      path: currentPath()
    });
  }
  function trackQuoteStart(metadata, options) {
    return trackEvent({
      path: currentPath()
    });
  }
  function trackQuoteSubmit(metadata, options) {
    return trackEvent({
      path: currentPath()
    });
  }
  function trackFrontendError(error, context) {
    return null;
  }
  return {
    trackEvent,
    trackPageView,
    trackSearch,
    trackProductView,
    trackShopView,
    trackQuoteStart,
    trackQuoteSubmit,
    trackFrontendError
  };
}
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "error",
  __ssrInlineRender: true,
  setup(__props) {
    const error = /* @__PURE__ */ useError();
    useAnalyticsTracking();
    function handleRetry() {
      clearError({ redirect: "/" });
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$f;
      const _component_UButton = _sfc_main$9;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 p-6" }, _attrs))}><div class="max-w-md w-full text-center"><div class="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 mb-6">`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-lucide-alert-circle",
        class: "w-8 h-8"
      }, null, _parent));
      _push(`</div><h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2"> Something went wrong </h1><p class="text-gray-600 dark:text-gray-400 mb-6">${ssrInterpolate(unref(error)?.message ?? "An unexpected error occurred.")}</p><div class="flex flex-col sm:flex-row gap-3 justify-center">`);
      _push(ssrRenderComponent(_component_UButton, {
        color: "primary",
        size: "lg",
        onClick: handleRetry
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Try again `);
          } else {
            return [
              createTextVNode(" Try again ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_UButton, {
        to: "/",
        variant: "outline",
        size: "lg"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Go home `);
          } else {
            return [
              createTextVNode(" Go home ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("error.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const IslandRenderer = defineAsyncComponent(() => import('./island-renderer-BFpLvjQB.mjs').then((r) => r.default || r));
    const nuxtApp = useNuxtApp();
    nuxtApp.deferHydration();
    nuxtApp.ssrContext.url;
    const SingleRenderer = false;
    provide(PageRouteSymbol, useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = /* @__PURE__ */ useError();
    const abortRender = error.value && !nuxtApp.ssrContext.error;
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        const p = nuxtApp.runWithContext(() => showError(err));
        onServerPrefetch(() => p);
        return false;
      }
    });
    const islandContext = nuxtApp.ssrContext.islandContext;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(abortRender)) {
            _push(`<div></div>`);
          } else if (unref(error)) {
            _push(ssrRenderComponent(unref(_sfc_main$1), { error: unref(error) }, null, _parent));
          } else if (unref(islandContext)) {
            _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
          } else if (unref(SingleRenderer)) {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
          } else {
            _push(ssrRenderComponent(unref(AppComponent), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
let entry;
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = createApp(_sfc_main);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (error) {
      await nuxt.hooks.callHook("app:error", error);
      nuxt.payload.error ||= createError(error);
    }
    if (ssrContext && (ssrContext["~renderResponse"] || ssrContext._renderResponse)) {
      throw new Error("skipping render");
    }
    return vueApp;
  };
}
const entry_default = ((ssrContext) => entry(ssrContext));

const server = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  A: API,
  B: looseToNumber,
  C: get,
  D: useLocale,
  E: usePortal,
  F: isArrayOfArray,
  G: compare,
  H: _sfc_main$d,
  I: getDisplayValue,
  J: usePublicApi,
  K: useState,
  L: useRouter,
  M: extractApiFeedback,
  N: __nuxt_component_0,
  O: formErrorsInjectionKey,
  P: formInputsInjectionKey,
  Q: inputIdInjectionKey,
  R: formFieldInjectionKey,
  S: __nuxt_component_2$1,
  T: defineNuxtRouteMiddleware,
  U: useCookie,
  V: __nuxt_component_0$2,
  W: useOgImageRuntimeConfig,
  X: useSiteConfig,
  _: __nuxt_component_1,
  a: _sfc_main$f,
  b: _sfc_main$9,
  c: createError,
  d: __nuxt_component_2,
  default: entry_default,
  e: useAuthStore,
  f: useToast,
  g: useRoute,
  h: useAnalyticsTracking,
  i: injectHead,
  j: useRuntimeConfig,
  k: useApi,
  l: _sfc_main$c,
  m: __nuxt_component_5,
  n: navigateTo,
  o: useAppConfig,
  p: useFieldGroup,
  q: useComponentIcons,
  r: useNuxtApp,
  s: safeLogError,
  t: tv,
  u: useAsyncData,
  v: parseApiError,
  w: usePublicApiNoAuth,
  x: useHead,
  y: _export_sfc,
  z: useFormField
}, Symbol.toStringTag, { value: 'Module' }));

export { resolvableDateToIso as $, API as A, isArrayOfArray as B, get as C, compare as D, _sfc_main$d as E, looseToNumber as F, getDisplayValue as G, useState as H, useRouter as I, extractApiFeedback as J, __nuxt_component_5 as K, __nuxt_component_0 as L, formErrorsInjectionKey as M, formInputsInjectionKey as N, inputIdInjectionKey as O, formFieldInjectionKey as P, __nuxt_component_2$1 as Q, defineNuxtRouteMiddleware as R, useCookie as S, injectHead as T, createError as U, defineSchemaOrgResolver as V, resolveRelation as W, setIfEmpty as X, asArray as Y, resolveWithBase as Z, __nuxt_component_1 as _, _sfc_main$f as a, idReference as a0, resolveAsGraphKey as a1, IdentityId as a2, prefixId as a3, imageResolver as a4, resolveDefaultType as a5, trimLength as a6, resolvableDateToDate as a7, resolveNode as a8, dedupeMerge as a9, __nuxt_component_0$2 as aa, useOgImageRuntimeConfig as ab, useSiteConfig as ac, server as ad, _sfc_main$9 as b, __nuxt_component_2 as c, useAuthStore as d, useToast as e, useRoute as f, useAnalyticsTracking as g, useRuntimeConfig as h, useAppConfig as i, useFieldGroup as j, useComponentIcons as k, _sfc_main$c as l, useNuxtApp as m, navigateTo as n, useApi as o, parseApiError as p, usePublicApiNoAuth as q, usePublicApi as r, safeLogError as s, tv as t, useAsyncData as u, useHead as v, _export_sfc as w, useLocale as x, usePortal as y, useFormField as z };
//# sourceMappingURL=server.mjs.map
