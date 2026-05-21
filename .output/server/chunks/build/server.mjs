import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import { defineComponent, ref, inject, h, Suspense, shallowRef, getCurrentInstance, provide, cloneVNode, createElementBlock, hasInjectionContext, toRef, isRef, computed, mergeProps, unref, withCtx, renderSlot, resolveComponent, createTextVNode, toDisplayString, openBlock, createBlock, Fragment, customRef, shallowReactive, toValue, onServerPrefetch, reactive, defineAsyncComponent, useSSRContext, createApp, createVNode, createCommentVNode, onErrorCaptured, resolveDynamicComponent, effectScope, nextTick, shallowReadonly, getCurrentScope, isReadonly, toRaw, isShallow, isReactive } from 'vue';
import { F as FetchError, q as hasProtocol, t as isScriptProtocol, v as joinURL, w as klona, x as parseQuery, H as withQuery, z as sanitizeStatusCode, y as parseURL, h as encodePath, d as decodePath, m as getRequestHeader, s as isEqual, A as setCookie, k as getCookie, f as deleteCookie, j as getContext, I as withTrailingSlash, J as withoutTrailingSlash, $ as $fetch, r as hash, e as defu, c as createError$1, i as executeAsync } from '../_/nitro.mjs';
import { u as useHead$1, h as headSymbol, b as baseURL, a as useSeoMeta$1 } from '../routes/renderer.mjs';
import { defineStore, setActivePinia, createPinia, shouldHydrate } from 'pinia';
import { RouterView, useRoute as useRoute$1, createMemoryHistory, createRouter, START_LOCATION } from 'vue-router';
import { isPlainObject } from '@vue/shared';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderSlot, ssrRenderComponent, ssrInterpolate, ssrRenderSuspense, ssrRenderVNode } from 'vue/server-renderer';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';

function flatHooks(configHooks, hooks = {}, parentName) {
	for (const key in configHooks) {
		const subHook = configHooks[key];
		const name = parentName ? `${parentName}:${key}` : key;
		if (typeof subHook === "object" && subHook !== null) flatHooks(subHook, hooks, name);
		else if (typeof subHook === "function") hooks[name] = subHook;
	}
	return hooks;
}
const createTask = /* @__PURE__ */ (() => {
	if (console.createTask) return console.createTask;
	const defaultTask = { run: (fn) => fn() };
	return () => defaultTask;
})();
function callHooks(hooks, args, startIndex, task) {
	for (let i = startIndex; i < hooks.length; i += 1) try {
		const result = task ? task.run(() => hooks[i](...args)) : hooks[i](...args);
		if (result && typeof result.then === "function") return Promise.resolve(result).then(() => callHooks(hooks, args, i + 1, task));
	} catch (error) {
		return Promise.reject(error);
	}
}
function serialTaskCaller(hooks, args, name) {
	if (hooks.length > 0) return callHooks(hooks, args, 0, createTask(name));
}
function parallelTaskCaller(hooks, args, name) {
	if (hooks.length > 0) {
		const task = createTask(name);
		return Promise.all(hooks.map((hook) => task.run(() => hook(...args))));
	}
}
function callEachWith(callbacks, arg0) {
	for (const callback of [...callbacks]) callback(arg0);
}
var Hookable = class {
	_hooks;
	_before;
	_after;
	_deprecatedHooks;
	_deprecatedMessages;
	constructor() {
		this._hooks = {};
		this._before = void 0;
		this._after = void 0;
		this._deprecatedMessages = void 0;
		this._deprecatedHooks = {};
		this.hook = this.hook.bind(this);
		this.callHook = this.callHook.bind(this);
		this.callHookWith = this.callHookWith.bind(this);
	}
	hook(name, function_, options = {}) {
		if (!name || typeof function_ !== "function") return () => {};
		const originalName = name;
		let dep;
		while (this._deprecatedHooks[name]) {
			dep = this._deprecatedHooks[name];
			name = dep.to;
		}
		if (dep && !options.allowDeprecated) {
			let message = dep.message;
			if (!message) message = `${originalName} hook has been deprecated` + (dep.to ? `, please use ${dep.to}` : "");
			if (!this._deprecatedMessages) this._deprecatedMessages = /* @__PURE__ */ new Set();
			if (!this._deprecatedMessages.has(message)) {
				console.warn(message);
				this._deprecatedMessages.add(message);
			}
		}
		if (!function_.name) try {
			Object.defineProperty(function_, "name", {
				get: () => "_" + name.replace(/\W+/g, "_") + "_hook_cb",
				configurable: true
			});
		} catch {}
		this._hooks[name] = this._hooks[name] || [];
		this._hooks[name].push(function_);
		return () => {
			if (function_) {
				this.removeHook(name, function_);
				function_ = void 0;
			}
		};
	}
	hookOnce(name, function_) {
		let _unreg;
		let _function = (...arguments_) => {
			if (typeof _unreg === "function") _unreg();
			_unreg = void 0;
			_function = void 0;
			return function_(...arguments_);
		};
		_unreg = this.hook(name, _function);
		return _unreg;
	}
	removeHook(name, function_) {
		const hooks = this._hooks[name];
		if (hooks) {
			const index = hooks.indexOf(function_);
			if (index !== -1) hooks.splice(index, 1);
			if (hooks.length === 0) this._hooks[name] = void 0;
		}
	}
	clearHook(name) {
		this._hooks[name] = void 0;
	}
	deprecateHook(name, deprecated) {
		this._deprecatedHooks[name] = typeof deprecated === "string" ? { to: deprecated } : deprecated;
		const _hooks = this._hooks[name] || [];
		this._hooks[name] = void 0;
		for (const hook of _hooks) this.hook(name, hook);
	}
	deprecateHooks(deprecatedHooks) {
		for (const name in deprecatedHooks) this.deprecateHook(name, deprecatedHooks[name]);
	}
	addHooks(configHooks) {
		const hooks = flatHooks(configHooks);
		const removeFns = Object.keys(hooks).map((key) => this.hook(key, hooks[key]));
		return () => {
			for (const unreg of removeFns) unreg();
			removeFns.length = 0;
		};
	}
	removeHooks(configHooks) {
		const hooks = flatHooks(configHooks);
		for (const key in hooks) this.removeHook(key, hooks[key]);
	}
	removeAllHooks() {
		this._hooks = {};
	}
	callHook(name, ...args) {
		return this.callHookWith(serialTaskCaller, name, args);
	}
	callHookParallel(name, ...args) {
		return this.callHookWith(parallelTaskCaller, name, args);
	}
	callHookWith(caller, name, args) {
		const event = this._before || this._after ? {
			name,
			args,
			context: {}
		} : void 0;
		if (this._before) callEachWith(this._before, event);
		const result = caller(this._hooks[name] ? [...this._hooks[name]] : [], args, name);
		if (result instanceof Promise) return result.finally(() => {
			if (this._after && event) callEachWith(this._after, event);
		});
		if (this._after && event) callEachWith(this._after, event);
		return result;
	}
	beforeEach(function_) {
		this._before = this._before || [];
		this._before.push(function_);
		return () => {
			if (this._before !== void 0) {
				const index = this._before.indexOf(function_);
				if (index !== -1) this._before.splice(index, 1);
			}
		};
	}
	afterEach(function_) {
		this._after = this._after || [];
		this._after.push(function_);
		return () => {
			if (this._after !== void 0) {
				const index = this._after.indexOf(function_);
				if (index !== -1) this._after.splice(index, 1);
			}
		};
	}
};
function createHooks() {
	return new Hookable();
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

function endIndex(str, min, len) {
	const index = str.indexOf(";", min);
	return index === -1 ? len : index;
}
function eqIndex(str, min, max) {
	const index = str.indexOf("=", min);
	return index < max ? index : -1;
}
function valueSlice(str, min, max) {
	if (min === max) return "";
	let start = min;
	let end = max;
	do {
		const code = str.charCodeAt(start);
		if (code !== 32 && code !== 9) break;
	} while (++start < end);
	while (end > start) {
		const code = str.charCodeAt(end - 1);
		if (code !== 32 && code !== 9) break;
		end--;
	}
	return str.slice(start, end);
}
const NullObject = /* @__PURE__ */ (() => {
	const C = function() {};
	C.prototype = Object.create(null);
	return C;
})();
function parse(str, options) {
	const obj = new NullObject();
	const len = str.length;
	if (len < 2) return obj;
	const dec = options?.decode || decode;
	const allowMultiple = options?.allowMultiple || false;
	let index = 0;
	do {
		const eqIdx = eqIndex(str, index, len);
		if (eqIdx === -1) break;
		const endIdx = endIndex(str, index, len);
		if (eqIdx > endIdx) {
			index = str.lastIndexOf(";", eqIdx - 1) + 1;
			continue;
		}
		const key = valueSlice(str, index, eqIdx);
		if (options?.filter && !options.filter(key)) {
			index = endIdx + 1;
			continue;
		}
		const val = dec(valueSlice(str, eqIdx + 1, endIdx));
		if (allowMultiple) {
			const existing = obj[key];
			if (existing === void 0) obj[key] = val;
			else if (Array.isArray(existing)) existing.push(val);
			else obj[key] = [existing, val];
		} else if (obj[key] === void 0) obj[key] = val;
		index = endIdx + 1;
	} while (index < len);
	return obj;
}
function decode(str) {
	if (!str.includes("%")) return str;
	try {
		return decodeURIComponent(str);
	} catch {
		return str;
	}
}

if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch.create({
    baseURL: baseURL()
  });
}
if (!("global" in globalThis)) {
  globalThis.global = globalThis;
}
const appLayoutTransition = false;
const nuxtLinkDefaults = { "componentName": "NuxtLink" };
const asyncDataDefaults = { "deep": false };
const fetchDefaults = {};
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
        return "4.4.6";
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
    _state: shallowReactive({}),
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
    nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, args);
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
const HTML_ATTR_UNSAFE_RE = /[&"'<>]/g;
const HTML_ATTR_ENCODE_MAP = {
  "&": "%26",
  '"': "%22",
  "'": "%27",
  "<": "%3C",
  ">": "%3E"
};
function encodeForHtmlAttr(value) {
  return value.replace(HTML_ATTR_UNSAFE_RE, (c) => HTML_ATTR_ENCODE_MAP[c]);
}
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
        const encodedLoc = encodeForHtmlAttr(location2);
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
  const $0 = { prerender: false };
  return (m, p) => {
    let r = [];
    if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
    let s = p.split("/"), l = s.length;
    if (l > 1) {
      if (s[1] === "track-job") {
        r.unshift({ data: $0, params: { "_": s.slice(2).join("/") } });
      }
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
function freezeHead(head) {
  const realPush = head.push;
  head.push = () => ({ dispose: () => {
  }, patch: () => {
  }, _poll: () => {
  } });
  return () => {
    head.push = realPush;
  };
}
const unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:head",
  enforce: "pre",
  setup(nuxtApp) {
    const head = nuxtApp.ssrContext.head;
    if (nuxtApp.ssrContext.islandContext) {
      const unfreeze = freezeHead(head);
      nuxtApp.hooks.hookOnce("app:created", unfreeze);
    }
    nuxtApp.vueApp.use(head);
  }
});
function toArray$1(value) {
  return Array.isArray(value) ? value : [value];
}
const __nuxt_page_meta$m = { layout: false };
const __nuxt_page_meta$l = {
  layout: false
};
const __nuxt_page_meta$k = { layout: false };
const __nuxt_page_meta$j = { layout: false };
const __nuxt_page_meta$i = { layout: false };
const __nuxt_page_meta$h = { layout: false };
const __nuxt_page_meta$g = { layout: false };
const __nuxt_page_meta$f = { layout: false };
const __nuxt_page_meta$e = { layout: false };
const __nuxt_page_meta$d = {
  layout: false
};
const __nuxt_page_meta$c = { layout: false };
const __nuxt_page_meta$b = { layout: false };
const __nuxt_page_meta$a = {
  layout: false
};
const __nuxt_page_meta$9 = null;
const __nuxt_page_meta$8 = { layout: false };
const __nuxt_page_meta$7 = { layout: false };
const __nuxt_page_meta$6 = { layout: false };
const __nuxt_page_meta$5 = { layout: false };
const __nuxt_page_meta$4 = {
  layout: false
};
const __nuxt_page_meta$3 = null;
const __nuxt_page_meta$2 = {
  layout: false
};
const __nuxt_page_meta$1 = { layout: "track" };
const __nuxt_page_meta = { layout: "track" };
const _routes = [
  {
    name: "dashboard-production-messages",
    path: "/dashboard/production/messages",
    meta: { ...__nuxt_page_meta$m || {}, ...{ "middleware": "auth" } },
    component: () => import('./messages-Cn5mJj9C.mjs')
  },
  {
    name: "dashboard-production-onboarding",
    path: "/dashboard/production/onboarding",
    meta: { ...__nuxt_page_meta$l || {}, ...{ "middleware": "auth" } },
    component: () => import('./onboarding-JgJ8Trg3.mjs')
  },
  {
    name: "dashboard-production-setup",
    path: "/dashboard/production/setup",
    meta: { "middleware": "auth" },
    component: () => import('./setup-6j-mnIAD.mjs')
  },
  {
    name: "shop-jobs-incoming",
    path: "/shop/jobs/incoming",
    meta: { "middleware": "auth" },
    component: () => import('./incoming-BvfTXw8J.mjs')
  },
  {
    name: "dashboard-production-section",
    path: "/dashboard/production/:section()",
    meta: { ...__nuxt_page_meta$j || {}, ...{ "middleware": "auth" } },
    component: () => import('./_section_-CZpixNsH.mjs'),
    children: [
      {
        name: "dashboard-production-section-id",
        path: ":id()",
        meta: { ...__nuxt_page_meta$k || {}, ...{ "middleware": "auth" } },
        component: () => import('./_id_-B1YfMG8-.mjs')
      }
    ]
  },
  {
    name: "shop-jobs-id",
    path: "/shop/jobs/:id()",
    meta: { "middleware": "auth" },
    component: () => import('./_id_-CmpYhT4D.mjs')
  },
  {
    name: "auth-confirm-email",
    path: "/auth/confirm-email",
    meta: __nuxt_page_meta$i || {},
    component: () => import('./confirm-email-pvPL-9qy.mjs')
  },
  {
    name: "auth-forgot-password",
    path: "/auth/forgot-password",
    meta: __nuxt_page_meta$h || {},
    component: () => import('./forgot-password-CtruSw0w.mjs')
  },
  {
    name: "auth-login",
    path: "/auth/login",
    meta: __nuxt_page_meta$g || {},
    component: () => import('./login-Tz7Y4FuK.mjs')
  },
  {
    name: "auth-register",
    path: "/auth/register",
    meta: __nuxt_page_meta$f || {},
    component: () => import('./register-CC1Tt3eE.mjs')
  },
  {
    name: "auth-reset-password",
    path: "/auth/reset-password",
    meta: __nuxt_page_meta$e || {},
    component: () => import('./reset-password-j0Upqid-.mjs')
  },
  {
    name: "dashboard-admin",
    path: "/dashboard/admin",
    meta: { ...__nuxt_page_meta$d || {}, ...{ "middleware": "auth" } },
    component: () => import('./admin-C4oae1LZ.mjs')
  },
  {
    name: __nuxt_page_meta$9?.name,
    path: "/dashboard/client",
    component: () => import('./client-CxYxet2t.mjs'),
    children: [
      {
        name: "dashboard-client-section",
        path: ":section()",
        meta: { ...__nuxt_page_meta$b || {}, ...{ "middleware": "auth" } },
        component: () => import('./_section_-59xOI2NT.mjs'),
        children: [
          {
            name: "dashboard-client-section-id",
            path: ":id()",
            meta: { ...__nuxt_page_meta$c || {}, ...{ "middleware": "auth" } },
            component: () => import('./_id_-BbCLPUZE.mjs')
          }
        ]
      },
      {
        name: "dashboard-client",
        path: "",
        meta: { ...__nuxt_page_meta$a || {}, ...{ "middleware": "auth" } },
        component: () => import('./index-CcPtvfd4.mjs')
      }
    ]
  },
  {
    name: __nuxt_page_meta$3?.name,
    path: "/dashboard/partner",
    component: () => import('./partner-CdLSbZXF.mjs'),
    children: [
      {
        name: "dashboard-partner-messages",
        path: "messages",
        meta: { ...__nuxt_page_meta$8 || {}, ...{ "middleware": "auth" } },
        component: () => import('./messages-DzKEcXH7.mjs')
      },
      {
        name: "dashboard-partner-rate-card",
        path: "rate-card",
        meta: { ...__nuxt_page_meta$7 || {}, ...{ "middleware": "auth" } },
        component: () => import('./rate-card-B80J2D97.mjs')
      },
      {
        name: "dashboard-partner-section",
        path: ":section()",
        meta: { ...__nuxt_page_meta$5 || {}, ...{ "middleware": "auth" } },
        component: () => import('./_section_-ELMC3baV.mjs'),
        children: [
          {
            name: "dashboard-partner-section-id",
            path: ":id()",
            meta: { ...__nuxt_page_meta$6 || {}, ...{ "middleware": "auth" } },
            component: () => import('./_id_-BSOw355_.mjs')
          }
        ]
      },
      {
        name: "dashboard-partner",
        path: "",
        meta: { ...__nuxt_page_meta$4 || {}, ...{ "middleware": "auth" } },
        component: () => import('./index-D34WzOEf.mjs')
      }
    ]
  },
  {
    name: "dashboard-production",
    path: "/dashboard/production",
    meta: { ...__nuxt_page_meta$2 || {}, ...{ "middleware": "auth" } },
    component: () => import('./index-BBsKZc0Y.mjs')
  },
  {
    name: "quotes-id",
    path: "/quotes/:id()",
    meta: { "middleware": "auth" },
    component: () => import('./_id_-C1jAhMXT.mjs')
  },
  {
    name: "dashboard",
    path: "/dashboard",
    meta: { "middleware": "auth" },
    component: () => import('./index-Dq8zukfS.mjs')
  },
  {
    name: "for-shops",
    path: "/for-shops",
    component: () => import('./for-shops-CmqgXQ2F.mjs')
  },
  {
    name: "track-job",
    path: "/track-job",
    meta: __nuxt_page_meta || {},
    component: () => import('./track-job-BN_kmMn7.mjs'),
    children: [
      {
        name: "track-job-token",
        path: ":token()",
        meta: __nuxt_page_meta$1 || {},
        component: () => import('./_token_-C6IeVpBC.mjs')
      }
    ]
  },
  {
    name: "index",
    path: "/",
    component: () => import('./index-Be2Kwpwv.mjs')
  }
];
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
    (comp, index) => comp.components && comp.components.default === from.matched[index]?.components?.default
  );
  if (areComponentsSame) {
    return false;
  }
  return true;
}
function toArray(value) {
  return Array.isArray(value) ? value : [value];
}
function _mergeTransitionProps(routeProps) {
  const _props = [];
  for (const prop of routeProps) {
    if (!prop) {
      continue;
    }
    _props.push({
      ...prop,
      onAfterLeave: prop.onAfterLeave ? toArray(prop.onAfterLeave) : void 0,
      onBeforeLeave: prop.onBeforeLeave ? toArray(prop.onBeforeLeave) : void 0
    });
  }
  return defu(..._props);
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
    if (from === START_LOCATION) {
      return _calculatePosition(to, from, savedPosition, hashScrollBehaviour);
    }
    return new Promise((resolve) => {
      const doScroll = () => {
        requestAnimationFrame(() => resolve(_calculatePosition(to, from, savedPosition, hashScrollBehaviour)));
      };
      nuxtApp.hooks.hookOnce("page:loading:end", () => {
        const transitionPromise = nuxtApp["~transitionPromise"];
        if (transitionPromise) {
          transitionPromise.then(doScroll);
        } else {
          doScroll();
        }
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
  if (to.hash) {
    return {
      el: to.hash,
      top: _getHashElementScrollMarginTop(to.hash),
      behavior: isChangingPage(to, from) ? defaultHashScrollBehaviour : "instant"
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
  auth: () => import('./auth-vgEK-3X3.mjs'),
  guest: () => import('./guest-bzf1ZQlT.mjs')
};
const pageIslandRoutes = {};
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
      const lastTo = to.matched.at(-1)?.components?.default;
      const lastFrom = from.matched.at(-1)?.components?.default;
      if (lastTo === lastFrom) {
        syncCurrentRoute();
        return;
      }
      if (to.matched.length < from.matched.length && to.matched.every((m, i) => m.components?.default === from.matched[i]?.components?.default)) {
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
    const isServerPage = nuxtApp.ssrContext?.islandContext?.name?.startsWith("page_");
    if (!nuxtApp.ssrContext?.islandContext || isServerPage) {
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
    const hasDeferredRoute = false;
    syncCurrentRoute();
    if (nuxtApp.ssrContext?.islandContext && !isServerPage) {
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
      if (!nuxtApp.ssrContext?.islandContext || isServerPage) {
        const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
        for (const component of to.matched) {
          const componentMiddleware = component.meta.middleware;
          if (!componentMiddleware) {
            continue;
          }
          for (const entry2 of toArray$1(componentMiddleware)) {
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
    if (isServerPage) {
      router.beforeResolve((to) => {
        const expected = pageIslandRoutes[nuxtApp.ssrContext.islandContext.name];
        const actual = to.matched.find((m) => m.components?.default?.__nuxt_island)?.components?.default;
        if (!expected || expected !== actual?.__nuxt_island) {
          nuxtApp.ssrContext["~renderResponse"] = {
            statusCode: 400,
            statusMessage: "Invalid island request path"
          };
          return false;
        }
      });
    }
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
        if (hasDeferredRoute) ;
        else {
          await router.replace({
            ...resolvedInitialRoute,
            force: true
          });
        }
        router.options.scrollBehavior = routerOptions.scrollBehavior;
      } catch (error2) {
        await nuxtApp.runWithContext(() => showError(error2));
      }
    });
    return { provide: { router } };
  }
});
const reducers = [
  ["NuxtError", (data) => isNuxtError(data) && data.toJSON()],
  ["EmptyShallowRef", (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["EmptyRef", (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["ShallowRef", (data) => isRef(data) && isShallow(data) && data.value],
  ["ShallowReactive", (data) => isReactive(data) && isShallow(data) && toRaw(data)],
  ["Ref", (data) => isRef(data) && data.value],
  ["Reactive", (data) => isReactive(data) && toRaw(data)]
];
const revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:revive-payload:server",
  setup() {
    for (const [reducer, fn] of reducers) {
      definePayloadReducer(reducer, fn);
    }
  }
});
const __nuxt_component_0$4 = defineComponent({
  name: "ServerPlaceholder",
  render() {
    return createElementBlock("div");
  }
});
const clientOnlySymbol = /* @__PURE__ */ Symbol.for("nuxt:client-only");
const __nuxt_component_0$3 = defineComponent({
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
function defineKeyedFunctionFactory(factory) {
  const placeholder = function() {
    throw new Error(`[nuxt] \`${factory.name}\` is a compiler macro and cannot be called at runtime.`);
  };
  return Object.defineProperty(placeholder, "__nuxt_factory", {
    enumerable: false,
    get: () => factory.factory
  });
}
const createUseAsyncData = defineKeyedFunctionFactory({
  name: "createUseAsyncData",
  factory(options = {}) {
    function useAsyncData2(...args) {
      const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
      if (_isAutoKeyNeeded(args[0], args[1])) {
        args.unshift(autoKey);
      }
      let [_key, _handler, opts = {}] = args;
      const isKeyReactive = isRef(_key) || typeof _key === "function";
      const key = isKeyReactive ? computed(() => toValue(_key)) : { value: _key };
      if (!key.value || typeof key.value !== "string") {
        throw new TypeError("[nuxt] [useAsyncData] key must be a non-empty string.");
      }
      if (typeof _handler !== "function") {
        throw new TypeError("[nuxt] [useAsyncData] handler must be a function.");
      }
      const shouldFactoryOptionsOverride = typeof options === "function";
      const nuxtApp = useNuxtApp();
      const factoryOptions = shouldFactoryOptionsOverride ? options(opts) : options;
      if (!shouldFactoryOptionsOverride) {
        for (const key2 in factoryOptions) {
          if (factoryOptions[key2] === void 0) {
            continue;
          }
          if (opts[key2] !== void 0) {
            continue;
          }
          opts[key2] = factoryOptions[key2];
        }
      }
      opts.server ??= true;
      opts.default ??= getDefault;
      opts.getCachedData ??= getDefaultCachedData;
      opts.lazy ??= false;
      opts.immediate ??= true;
      opts.deep ??= asyncDataDefaults.deep;
      opts.dedupe ??= "cancel";
      if (shouldFactoryOptionsOverride) {
        for (const key2 in factoryOptions) {
          if (factoryOptions[key2] === void 0) {
            continue;
          }
          opts[key2] = factoryOptions[key2];
        }
      }
      nuxtApp._asyncData[key.value];
      function createInitialFetch() {
        const initialFetchOptions = { cause: "initial", dedupe: opts.dedupe };
        const existing = nuxtApp._asyncData[key.value];
        if (!existing?._init) {
          initialFetchOptions.cachedData = opts.getCachedData(key.value, nuxtApp, { cause: "initial" });
          nuxtApp._asyncData[key.value] = buildAsyncData(nuxtApp, key.value, _handler, opts, initialFetchOptions.cachedData);
          nuxtApp._asyncData[key.value]._initialCachedData = initialFetchOptions.cachedData;
        } else {
          initialFetchOptions.cachedData = existing._initialCachedData;
        }
        return () => nuxtApp._asyncData[key.value].execute(initialFetchOptions);
      }
      const initialFetch = createInitialFetch();
      const asyncData = nuxtApp._asyncData[key.value];
      asyncData._deps++;
      const fetchOnServer = opts.server !== false && nuxtApp.payload.serverRendered;
      if (fetchOnServer && opts.immediate) {
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
      Object.defineProperties(asyncDataPromise, {
        then: { enumerable: true, value: asyncDataPromise.then.bind(asyncDataPromise) },
        catch: { enumerable: true, value: asyncDataPromise.catch.bind(asyncDataPromise) },
        finally: { enumerable: true, value: asyncDataPromise.finally.bind(asyncDataPromise) }
      });
      return asyncDataPromise;
    }
    return useAsyncData2;
  }
});
const useAsyncData = createUseAsyncData.__nuxt_factory();
createUseAsyncData.__nuxt_factory({
  lazy: true,
  // @ts-expect-error private property
  _functionName: "useLazyAsyncData"
});
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
    nuxtApp._asyncData[key]._initialCachedData = void 0;
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
function buildAsyncData(nuxtApp, key, _handler, options, initialCachedData) {
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
        if (nuxtApp._asyncDataPromises[key] !== promise) {
          return;
        }
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
        if (nuxtApp._asyncDataPromises[key] !== promise) {
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
        if (nuxtApp._asyncDataPromises[key] === promise) {
          delete nuxtApp._asyncDataPromises[key];
        }
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
  if (init) {
    nuxtApp._state[key] ??= { _default: init };
  }
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
function useRequestFetch() {
  return useRequestEvent()?.$fetch || globalThis.$fetch;
}
function generateOptionSegments(opts) {
  const segments = [
    toValue(opts.method)?.toUpperCase() || "GET",
    toValue(opts.baseURL)
  ];
  for (const _obj of [opts.query || opts.params]) {
    const obj = toValue(_obj);
    if (!obj) {
      continue;
    }
    const unwrapped = {};
    for (const [key, value] of Object.entries(obj)) {
      unwrapped[toValue(key)] = toValue(value);
    }
    segments.push(unwrapped);
  }
  if (opts.body) {
    const value = toValue(opts.body);
    if (!value) {
      segments.push(hash(value));
    } else if (value instanceof ArrayBuffer) {
      segments.push(hash(Object.fromEntries([...new Uint8Array(value).entries()].map(([k, v]) => [k, v.toString()]))));
    } else if (value instanceof FormData) {
      const entries = [];
      for (const entry2 of value.entries()) {
        const [key, val] = entry2;
        entries.push([key, val instanceof File ? `${val.name}:${val.size}:${val.lastModified}` : val]);
      }
      segments.push(hash(entries));
    } else if (isPlainObject(value)) {
      segments.push(hash(reactive(value)));
    } else {
      try {
        segments.push(hash(value));
      } catch {
        console.warn("[useFetch] Failed to hash body", value);
      }
    }
  }
  return segments;
}
const createUseFetch = defineKeyedFunctionFactory({
  name: "createUseFetch",
  factory(options = {}) {
    function useFetch2(request, arg1, arg2) {
      const [opts = {}, autoKey] = typeof arg1 === "string" ? [{}, arg1] : [arg1, arg2];
      const factoryOptions = typeof options === "function" ? options(opts) : options;
      const {
        server,
        lazy,
        default: defaultFn,
        transform,
        pick: pick2,
        watch: watchSources,
        immediate,
        getCachedData,
        deep,
        dedupe,
        timeout,
        ...fetchOptions
      } = {
        ...typeof options === "function" ? {} : factoryOptions,
        ...opts,
        ...typeof options === "function" ? factoryOptions : {}
      };
      const _request = computed(() => toValue(request));
      const key = computed(() => toValue(fetchOptions.key) || "$f" + hash([autoKey, typeof _request.value === "string" ? _request.value : "", ...generateOptionSegments(fetchOptions)]));
      if (!fetchOptions.baseURL && typeof _request.value === "string" && (_request.value[0] === "/" && _request.value[1] === "/")) {
        throw new Error('[nuxt] [useFetch] the request URL must not start with "//".');
      }
      const _fetchOptions = reactive({
        ...fetchDefaults,
        ...fetchOptions,
        cache: typeof fetchOptions.cache === "boolean" ? void 0 : fetchOptions.cache
      });
      const _asyncDataOptions = {
        server,
        lazy,
        default: defaultFn,
        transform,
        pick: pick2,
        immediate,
        getCachedData,
        deep,
        dedupe,
        timeout,
        watch: watchSources === false ? [] : [...watchSources || [], _fetchOptions]
      };
      if (watchSources === false) {
        _asyncDataOptions._keyTriggersExecute = false;
      }
      const asyncData = useAsyncData(key, (_, { signal }) => {
        let _$fetch = fetchOptions.$fetch || globalThis.$fetch;
        if (!fetchOptions.$fetch) {
          const isLocalFetch = typeof _request.value === "string" && _request.value[0] === "/" && (!toValue(fetchOptions.baseURL) || toValue(fetchOptions.baseURL)[0] === "/");
          if (isLocalFetch) {
            _$fetch = useRequestFetch();
          }
        }
        return _$fetch(_request.value, { signal, ..._fetchOptions });
      }, _asyncDataOptions);
      return asyncData;
    }
    return useFetch2;
  }
});
createUseFetch.__nuxt_factory();
createUseFetch.__nuxt_factory({
  lazy: true,
  // @ts-expect-error private property
  _functionName: "useLazyFetch"
});
function parseCookieValue(value) {
  if (value === "undefined") {
    return void 0;
  }
  try {
    const parsed = JSON.parse(value);
    if (typeof parsed === "number" && String(parsed) !== value) {
      return value;
    }
    return parsed;
  } catch {
    return value;
  }
}
const CookieDefaults = {
  path: "/",
  watch: true,
  decode: (val) => val ? parseCookieValue(decodeURIComponent(val)) : val,
  encode: (val) => {
    if (typeof val !== "string" || val === "undefined") {
      return encodeURIComponent(JSON.stringify(val));
    }
    try {
      if (typeof JSON.parse(val) !== "string") {
        return encodeURIComponent(JSON.stringify(val));
      }
    } catch {
    }
    return encodeURIComponent(val);
  },
  refresh: false
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
  const cookie = cookieServerRef(name, cookieValue);
  {
    const nuxtApp = useNuxtApp();
    const writeFinalCookieValue = () => {
      const valueIsSame = isEqual(cookie.value, cookies[name]);
      if (opts.readonly || valueIsSame && !opts.refresh) {
        return;
      }
      nuxtApp._cookiesChanged ||= {};
      if (valueIsSame && opts.refresh && !nuxtApp._cookiesChanged[name]) {
        return;
      }
      nuxtApp._cookies ||= {};
      if (name in nuxtApp._cookies) {
        if (isEqual(cookie.value, nuxtApp._cookies[name])) {
          return;
        }
      }
      nuxtApp._cookies[name] = cookie.value;
      const encoded = cookie.value === null || cookie.value === void 0 ? void 0 : opts.encode(cookie.value);
      writeServerCookie(useRequestEvent(nuxtApp), name, encoded, opts);
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
    return parse(getRequestHeader(useRequestEvent(), "cookie") || "", opts);
  }
}
const identityEncode = (val) => val;
function toSerializeOptions(opts) {
  const { encode: _encode, decode: _decode, ...rest } = opts;
  return { ...rest, encode: identityEncode };
}
function writeServerCookie(event, name, value, opts = {}) {
  if (event) {
    const serializeOpts = toSerializeOptions(opts);
    if (value !== void 0) {
      return setCookie(event, name, value, serializeOpts);
    }
    if (getCookie(event, name) !== void 0) {
      return deleteCookie(event, name, serializeOpts);
    }
  }
}
function cookieServerRef(name, value) {
  const internalRef = ref(value);
  const nuxtApp = useNuxtApp();
  return customRef((track, trigger) => {
    return {
      get() {
        track();
        return internalRef.value;
      },
      set(newValue) {
        nuxtApp._cookiesChanged ||= {};
        nuxtApp._cookiesChanged[name] = true;
        internalRef.value = newValue;
        trigger();
      }
    };
  });
}
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
    const hasTarget = computed(() => !!unref(props.target) && unref(props.target) !== "_self");
    const isAbsoluteUrl = computed(() => {
      const path = unref(props.to) || unref(props.href) || "";
      return typeof path === "string" && hasProtocol(path, { acceptRelative: true });
    });
    const builtinRouterLink = resolveComponent("RouterLink");
    const useBuiltinLink = builtinRouterLink && typeof builtinRouterLink !== "string" ? builtinRouterLink.useLink : void 0;
    const isExternal = computed(() => {
      if (unref(props.external)) {
        return true;
      }
      const path = unref(props.to) || unref(props.href) || "";
      if (typeof path === "object") {
        return false;
      }
      return path === "" || isAbsoluteUrl.value;
    });
    const to = computed(() => {
      const path = unref(props.to) || unref(props.href) || "";
      if (isExternal.value) {
        return path;
      }
      return resolveTrailingSlashBehavior(path, router.resolve, unref(props.trailingSlash));
    });
    const link = isExternal.value ? void 0 : useBuiltinLink?.({ ...props, to, viewTransition: unref(props.viewTransition) });
    const href = computed(() => {
      const effectiveTrailingSlash = unref(props.trailingSlash) ?? options.trailingSlash;
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
        await navigateTo(href.value, { replace: unref(props.replace), external: isExternal.value || hasTarget.value });
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
const __nuxt_component_0$2 = /* @__PURE__ */ defineNuxtLink(nuxtLinkDefaults);
function applyTrailingSlashBehavior(to, trailingSlash) {
  const normalizeFn = trailingSlash === "append" ? withTrailingSlash : withoutTrailingSlash;
  const hasProtocolDifferentFromHttp = hasProtocol(to) && !to.startsWith("http");
  if (hasProtocolDifferentFromHttp) {
    return to;
  }
  return normalizeFn(to, true);
}
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
const components_plugin_4kY4pyzJIYX99vmMAAIorFf3CnAaptHitJgf7JxiED8 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:global-components"
});
const API = {
  auth: {
    registerClient: "/auth/register/client/",
    registerPartner: "/auth/register/partner/",
    registerProduction: "/auth/register/production/",
    login: "/auth/token/",
    refresh: "/auth/token/refresh/",
    me: "/auth/me/",
    confirmEmail: "/auth/confirm-email/",
    resendConfirmation: "/auth/resend-confirmation/",
    forgotPassword: "/auth/password-reset/",
    resetConfirm: "/auth/password-reset/confirm/"
  },
  calculator: {
    config: "/calculator/config/",
    publicPreview: "/calculator/public-preview/"
  },
  dashboard: {
    adminHome: "/dashboard/admin/",
    clientHome: "/dashboard/client-home/",
    partnerHome: "/dashboard/partner-home/",
    productionHome: "/dashboard/production-home/",
    clientQuotes: "/dashboard/client/quotes/",
    clientQuoteDetail: (id) => `/dashboard/client/quotes/${id}/`,
    clientJobs: "/dashboard/client/jobs/",
    clientJobDetail: (id) => `/dashboard/client/jobs/${id}/`,
    clientPayments: "/dashboard/client/payments/",
    partnerQuotes: "/dashboard/partner/quotes/",
    partnerQuoteDetail: (id) => `/dashboard/partner/quotes/${id}/`,
    partnerQuoteSendToClient: (id) => `/dashboard/partner/quotes/${id}/send-to-client/`,
    partnerJobs: "/dashboard/partner/jobs/",
    partnerJobDetail: (id) => `/dashboard/partner/jobs/${id}/`,
    partnerJobDispatch: (id) => `/dashboard/partner/jobs/${id}/dispatch/`,
    partnerClients: "/dashboard/partner/clients/",
    partnerProductionShops: "/dashboard/partner/production-shops/",
    partnerPayments: "/dashboard/partner/payments/",
    productionJobs: "/dashboard/production/jobs/",
    productionJobDetail: (id) => `/dashboard/production/jobs/${id}/`,
    productionPricing: "/dashboard/production/pricing/",
    productionPaperStock: "/dashboard/production/paper-stock/",
    productionFinishings: "/dashboard/production/finishings/",
    productionPayments: "/dashboard/production/payments/"
  },
  jobs: {
    publicManagedTrack: (token) => `/public/managed-jobs/track/${token}/`,
    publicTrack: (token) => `/public/job/${token}/`,
    managedJobs: "/managed-jobs/",
    shopAssignments: "/shop/assignments/",
    managedJobFiles: (id) => `/managed-jobs/${id}/files/`,
    managedJobEvents: (id) => `/managed-jobs/${id}/events/`,
    managedJobPayments: (id) => `/managed-jobs/${id}/payments/`,
    managedJobSettlement: (id) => `/managed-jobs/${id}/settlement/`,
    managedJobStkPush: (id) => `/managed-jobs/${id}/payments/mpesa/stk-push/`,
    managedJobPaymentQuery: (id) => `/managed-jobs/${id}/payments/mpesa/query/`,
    managedJobProofUpload: (id) => `/managed-jobs/${id}/files/proofs/`,
    assignmentAccept: (id) => `/job-assignments/${id}/accept/`,
    assignmentReject: (id) => `/job-assignments/${id}/reject/`,
    assignmentInProduction: (id) => `/job-assignments/${id}/mark-in-production/`,
    assignmentReady: (id) => `/job-assignments/${id}/mark-ready/`,
    assignmentCompleted: (id) => `/job-assignments/${id}/mark-completed/`,
    assignmentReportIssue: (id) => `/job-assignments/${id}/report-issue/`,
    jobFileApprove: (id) => `/job-files/${id}/approve/`,
    jobFileReject: (id) => `/job-files/${id}/reject/`,
    jobFileRequestRevision: (id) => `/job-files/${id}/request-revision/`
  },
  workflow: {
    quoteRequests: "/workflow/quote-requests/",
    clientResponses: "/client/responses/",
    clientRequestDetail: (id) => `/client/requests/${id}/`,
    shopRequestDetail: (id) => `/shop/requests/${id}/`,
    requestResponses: (id) => `/quote-requests/${id}/responses/`,
    clientAcceptResponse: (id) => `/client/responses/${id}/accept/`,
    clientRejectResponse: (id) => `/client/responses/${id}/reject/`,
    clientReplyResponse: (id) => `/client/responses/${id}/reply/`,
    shopReplyResponse: (id) => `/shop/responses/${id}/reply/`,
    dashboardShopHome: "/dashboard/shop-home/"
  },
  partner: {
    quotes: "/partner/quotes/",
    quotePreview: "/partner/quotes/preview/",
    quoteCreate: "/partner/quotes/create/",
    clients: "/dashboard/partner/clients/"
  },
  forShops: {
    publicConfig: "/for-shops/rate-card/public-config/",
    publicPreview: "/for-shops/rate-card/public-preview/",
    setup: "/shops/rate-card/setup/",
    complete: "/shops/rate-card/onboarding-complete/"
  }
};
const DASHBOARD_HOME_ROUTES = {
  super_admin: "/dashboard/admin",
  client: "/dashboard/client",
  partner: "/dashboard/partner",
  production: "/dashboard/production"
};
function normalizeRole(value) {
  if (!value) {
    return null;
  }
  if (value === "super_admin" || value === "admin" || value === "superuser" || value === "staff") {
    return "super_admin";
  }
  if (value === "client" || value === "customer") {
    return "client";
  }
  if (value === "partner" || value === "broker") {
    return "partner";
  }
  if (value === "production" || value === "shop_owner" || value === "printer" || value === "staff") {
    return "production";
  }
  return null;
}
function resolveAccessibleRoles(user) {
  if (!user) {
    return [];
  }
  const roles = /* @__PURE__ */ new Set();
  for (const value of user.roles ?? []) {
    const normalized = normalizeRole(value);
    if (normalized) {
      roles.add(normalized);
    }
  }
  if (user.can_access_admin_dashboard) roles.add("super_admin");
  if (user.can_access_client_dashboard) roles.add("client");
  if (user.can_access_partner_dashboard) roles.add("partner");
  if (user.can_access_production_dashboard) roles.add("production");
  const explicitPrimary = normalizeRole(user.primary_role || user.dashboard_role || user.role);
  if (explicitPrimary) {
    roles.add(explicitPrimary);
  }
  return ["super_admin", "production", "partner", "client"].filter((role) => roles.has(role));
}
function resolveDashboardRole(user) {
  if (!user) {
    return "client";
  }
  const explicitRole = normalizeRole(user.primary_role || user.dashboard_role);
  if (explicitRole) {
    return explicitRole;
  }
  const accessibleRoles = resolveAccessibleRoles(user);
  if (accessibleRoles.length > 0) {
    return accessibleRoles[0] || "client";
  }
  return normalizeRole(user.role) || "client";
}
function dashboardRouteForRole(role) {
  return DASHBOARD_HOME_ROUTES[role];
}
const PROD_FALLBACK_API_BASE = "https://api.printy.ke/api";
function getDefaultApiBase() {
  return PROD_FALLBACK_API_BASE;
}
const DEFAULT_API_BASE = getDefaultApiBase();
function getApiBase(input) {
  if (typeof input === "string") {
    return input.trim().replace(/\/$/, "");
  }
  if (input && typeof input === "object") {
    const value = input.apiBaseUrl || input.apiBase;
    if (typeof value === "string" && value.trim()) {
      return value.trim().replace(/\/$/, "");
    }
  }
  return DEFAULT_API_BASE;
}
function resolveMediaUrl(path) {
  if (!path) {
    return "";
  }
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  const config = /* @__PURE__ */ useRuntimeConfig();
  const origin = getApiBase(config.public).replace(/\/api$/, "");
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}
function useApi() {
  const { $api, $publicApi, $publicApiNoAuth } = useNuxtApp();
  return {
    api: $api,
    publicApi: $publicApi,
    publicApiNoAuth: $publicApiNoAuth,
    getMediaUrl(path) {
      return path ? resolveMediaUrl(path) : null;
    }
  };
}
const THIRTY_DAYS_IN_SECONDS = 60 * 60 * 24 * 30;
function cookieOptions(rememberMe) {
  return {
    sameSite: "lax",
    maxAge: rememberMe ? THIRTY_DAYS_IN_SECONDS : void 0
  };
}
function rememberMeEnabled() {
  return useCookie("printy_remember_me").value === "1";
}
function persistTokens(tokens, rememberMe = rememberMeEnabled()) {
  const access = useCookie("printy_access_token", cookieOptions(rememberMe));
  const refresh = useCookie("printy_refresh_token", cookieOptions(rememberMe));
  const remember = useCookie("printy_remember_me", cookieOptions(rememberMe));
  access.value = tokens?.access ?? null;
  refresh.value = tokens?.refresh ?? null;
  remember.value = tokens ? rememberMe ? "1" : "0" : null;
}
const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    initialized: false
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.user),
    isInitialized: (state) => state.initialized,
    dashboardRole: (state) => resolveDashboardRole(state.user),
    accessibleRoles: (state) => resolveAccessibleRoles(state.user),
    capabilities: (state) => state.user?.capabilities ?? {},
    canManageClients: (state) => {
      if (typeof state.user?.can_access_admin_dashboard === "boolean" && state.user.can_access_admin_dashboard) {
        return true;
      }
      if (typeof state.user?.can_access_partner_dashboard === "boolean") {
        return state.user.can_access_partner_dashboard;
      }
      const capability = state.user?.capabilities?.can_manage_clients;
      if (typeof capability === "boolean") {
        return capability;
      }
      return resolveAccessibleRoles(state.user).includes("partner");
    },
    canReceiveAssignments: (state) => {
      if (typeof state.user?.can_access_admin_dashboard === "boolean" && state.user.can_access_admin_dashboard) {
        return true;
      }
      if (typeof state.user?.can_access_production_dashboard === "boolean") {
        return state.user.can_access_production_dashboard;
      }
      const capability = state.user?.capabilities?.can_receive_assignments;
      if (typeof capability === "boolean") {
        return capability;
      }
      return resolveAccessibleRoles(state.user).includes("production");
    },
    canAccessAdminDashboard: (state) => {
      if (typeof state.user?.can_access_admin_dashboard === "boolean") {
        return state.user.can_access_admin_dashboard;
      }
      return resolveAccessibleRoles(state.user).includes("super_admin");
    },
    canAccessClientDashboard: (state) => {
      if (typeof state.user?.can_access_client_dashboard === "boolean") {
        return state.user.can_access_client_dashboard;
      }
      return resolveAccessibleRoles(state.user).includes("client");
    },
    canAccessPartnerDashboard: (state) => {
      if (typeof state.user?.can_access_partner_dashboard === "boolean") {
        return state.user.can_access_partner_dashboard;
      }
      return resolveAccessibleRoles(state.user).includes("partner");
    },
    canAccessProductionDashboard: (state) => {
      if (typeof state.user?.can_access_production_dashboard === "boolean") {
        return state.user.can_access_production_dashboard;
      }
      return resolveAccessibleRoles(state.user).includes("production");
    },
    isShop: (state) => {
      return resolveAccessibleRoles(state.user).includes("production");
    },
    isPartnerProfile: (state) => {
      return resolveAccessibleRoles(state.user).includes("partner");
    },
    homeRoute: (state) => {
      if (state.user?.home_route) {
        return state.user.home_route;
      }
      return dashboardRouteForRole(resolveDashboardRole(state.user));
    }
  },
  actions: {
    clearSession() {
      persistTokens(null);
      this.user = null;
      this.initialized = true;
    },
    async hydrateSession() {
      const access = useCookie("printy_access_token");
      const refresh = useCookie("printy_refresh_token");
      if (access.value) {
        try {
          return await this.fetchMe();
        } catch {
          if (!refresh.value) {
            this.clearSession();
            return null;
          }
        }
      }
      if (refresh.value) {
        try {
          await this.refreshSession();
          return await this.fetchMe();
        } catch {
          this.clearSession();
          return null;
        }
      }
      this.user = null;
      return null;
    },
    async initialize(force = false) {
      if (this.initialized && !force) {
        return;
      }
      try {
        await this.hydrateSession();
      } finally {
        this.initialized = true;
      }
    },
    async register(payload) {
      const { publicApi } = useApi();
      const endpoint = payload.role === "partner" ? API.auth.registerPartner : payload.role === "production" ? API.auth.registerProduction : API.auth.registerClient;
      return publicApi(endpoint, {
        method: "POST",
        body: payload,
        auth: false
      });
    },
    async login(payload, options = {}) {
      const { publicApi } = useApi();
      const result = await publicApi(API.auth.login, {
        method: "POST",
        body: payload,
        auth: false
      });
      persistTokens(result, Boolean(options.rememberMe));
      this.user = result.user ?? await publicApi(API.auth.me, {
        headers: {
          Authorization: `Bearer ${result.access}`
        }
      });
      this.initialized = true;
      return result;
    },
    async refreshSession() {
      const refresh = useCookie("printy_refresh_token");
      if (!refresh.value) {
        throw new Error("No refresh token found.");
      }
      const { publicApi } = useApi();
      const result = await publicApi(API.auth.refresh, {
        method: "POST",
        body: { refresh: refresh.value },
        auth: false
      });
      persistTokens({ access: result.access, refresh: result.refresh || refresh.value }, rememberMeEnabled());
      return result;
    },
    async fetchMe() {
      const { api } = useApi();
      const user = await api(API.auth.me);
      this.user = user;
      return user;
    },
    async confirmEmail(key) {
      const { publicApi } = useApi();
      return publicApi(API.auth.confirmEmail, {
        method: "POST",
        body: { key },
        auth: false
      });
    },
    async resendConfirmation(email) {
      const { publicApi } = useApi();
      return publicApi(API.auth.resendConfirmation, {
        method: "POST",
        body: { email },
        auth: false
      });
    },
    async forgotPassword(email) {
      const { publicApi } = useApi();
      return publicApi(API.auth.forgotPassword, {
        method: "POST",
        body: { email },
        auth: false
      });
    },
    async resetPassword(payload) {
      const { publicApi } = useApi();
      return publicApi(API.auth.resetConfirm, {
        method: "POST",
        body: payload,
        auth: false
      });
    },
    logout() {
      this.clearSession();
      return navigateTo("/auth/login");
    }
  }
});
const API_UNREACHABLE_MESSAGE = "We could not reach Printy's server. Please check that the API is running and try again.";
function isFailedToFetchMessage(message) {
  return typeof message === "string" && message.toLowerCase().includes("failed to fetch");
}
function getApiErrorDetail(error) {
  if (error instanceof FetchError) {
    const data = error.data;
    if (typeof data?.detail === "string" && data.detail) {
      return data.detail;
    }
    if (typeof data?.message === "string" && data.message) {
      return data.message;
    }
    if (isFailedToFetchMessage(error.message)) {
      return API_UNREACHABLE_MESSAGE;
    }
    return error.message;
  }
  if (error instanceof Error) {
    if (isFailedToFetchMessage(error.message)) {
      return API_UNREACHABLE_MESSAGE;
    }
    return error.message;
  }
  if (error && typeof error === "object" && "statusMessage" in error) {
    const statusMessage = error.statusMessage;
    if (isFailedToFetchMessage(statusMessage)) {
      return API_UNREACHABLE_MESSAGE;
    }
    if (typeof statusMessage === "string" && statusMessage) {
      return statusMessage;
    }
  }
  return null;
}
function getApiErrorMessage(error, fallback = "Printy could not complete this request.") {
  return getApiErrorDetail(error) || fallback;
}
function normalizeApiList(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }
  if (Array.isArray(payload?.results)) {
    return payload.results;
  }
  return [];
}
async function apiRequest(apiBase, path, options = {}, token) {
  try {
    return await $fetch(path, {
      baseURL: apiBase,
      method: options.method || "GET",
      body: options.body,
      query: options.query,
      headers: {
        ...options.headers || {},
        ...token && options.auth !== false ? { Authorization: `Bearer ${token}` } : {}
      }
    });
  } catch (error) {
    const statusCode = error instanceof FetchError ? error.response?.status || 500 : 500;
    if (statusCode === 401 && options.auth !== false && !options.skipAuthRefresh && !options._retried) {
      const auth = useAuthStore();
      try {
        await auth.refreshSession();
        const nextToken = useCookie("printy_access_token").value;
        return await apiRequest(apiBase, path, {
          ...options,
          _retried: true,
          skipAuthRefresh: true
        }, nextToken);
      } catch {
        auth.clearSession();
      }
    }
    throw createError({
      statusCode,
      statusMessage: getApiErrorMessage(error),
      data: error instanceof FetchError ? error.data : void 0
    });
  }
}
function createApiClient(apiBase) {
  return async (path, options = {}) => {
    const token = useCookie("printy_access_token").value;
    return apiRequest(apiBase, path, options, token);
  };
}
function createPublicApiClient(apiBase) {
  return async (path, options = {}) => apiRequest(apiBase, path, options, null);
}
function createPublicApiNoAuthClient(apiBase) {
  return async (path, options = {}) => apiRequest(apiBase, path, { ...options, auth: false }, null);
}
const LOCAL_API_HOSTS = /* @__PURE__ */ new Set(["localhost", "127.0.0.1", "0.0.0.0", "::1", "[::1]"]);
function ensureValidApiBase(apiBase) {
  if (!apiBase.startsWith("http://") && !apiBase.startsWith("https://")) {
    {
      throw new Error("[printy] NUXT_PUBLIC_API_BASE_URL must be an absolute URL in production.");
    }
  }
  {
    try {
      const parsed = new URL(apiBase);
      if (LOCAL_API_HOSTS.has(parsed.hostname.toLowerCase())) {
        throw new Error("[printy] NUXT_PUBLIC_API_BASE_URL cannot point to localhost in production.");
      }
    } catch {
      throw new Error("[printy] NUXT_PUBLIC_API_BASE_URL is invalid in production.");
    }
  }
  return apiBase;
}
const api_84elem0X4yBmBiZUVE7UuQp73h8h21064ANeRANSla4 = /* @__PURE__ */ defineNuxtPlugin(() => {
  const config = /* @__PURE__ */ useRuntimeConfig();
  const apiBase = ensureValidApiBase(getApiBase(config.public));
  return {
    provide: {
      api: createApiClient(apiBase),
      publicApi: createPublicApiClient(apiBase),
      publicApiNoAuth: createPublicApiNoAuthClient(apiBase)
    }
  };
});
const i18n_rgpBWqceGhUXVUoLOJ2oM3jvlmYalZprXt7Hyqw4ZVg = /* @__PURE__ */ defineNuxtPlugin(() => {
  const languageCookie = useCookie("printy-language", { default: () => "en" });
  const locale = useState("app-language", () => languageCookie.value === "sw" ? "sw" : "en");
  return {
    provide: {
      locale
    }
  };
});
const seo_global_server_dCzbnmKc4DepJIcvy_5PCer_5yY5ODX_DB_M4OzqZGA = /* @__PURE__ */ defineNuxtPlugin(() => {
  useSeoMeta({
    titleTemplate: (titleChunk) => titleChunk ? `${titleChunk} | Printy` : "Printy",
    ogSiteName: "Printy",
    twitterCard: "summary_large_image"
  });
});
const plugins = [
  payloadPlugin,
  unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU,
  plugin$1,
  revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms,
  plugin,
  components_plugin_4kY4pyzJIYX99vmMAAIorFf3CnAaptHitJgf7JxiED8,
  api_84elem0X4yBmBiZUVE7UuQp73h8h21064ANeRANSla4,
  i18n_rgpBWqceGhUXVUoLOJ2oM3jvlmYalZprXt7Hyqw4ZVg,
  seo_global_server_dCzbnmKc4DepJIcvy_5PCer_5yY5ODX_DB_M4OzqZGA
];
function defaultEstimatedProgress(duration, elapsed) {
  const completionPercentage = elapsed / duration * 100;
  return 2 / Math.PI * 100 * Math.atan(completionPercentage / 50);
}
function createLoadingIndicator(opts = {}) {
  const { duration = 2e3, throttle = 200, hideDelay = 500, resetDelay = 400 } = opts;
  opts.estimatedProgress || defaultEstimatedProgress;
  const nuxtApp = useNuxtApp();
  const progress = shallowRef(0);
  const isLoading = shallowRef(false);
  const error = shallowRef(false);
  const start = (opts2 = {}) => {
    error.value = false;
    set(0, opts2);
  };
  function set(at = 0, opts2 = {}) {
    if (nuxtApp.isHydrating) {
      return;
    }
    if (at >= 100) {
      return finish({ force: opts2.force });
    }
    progress.value = at < 0 ? 0 : at;
    opts2.force ? 0 : throttle;
    {
      isLoading.value = true;
    }
  }
  function finish(opts2 = {}) {
    progress.value = 100;
    if (opts2.error) {
      error.value = true;
    }
    if (opts2.force) {
      progress.value = 0;
      isLoading.value = false;
    }
  }
  function clear() {
  }
  let _cleanup = () => {
  };
  return {
    _cleanup,
    progress: shallowReadonly(progress),
    isLoading: shallowReadonly(isLoading),
    error: shallowReadonly(error),
    start,
    set,
    finish,
    clear
  };
}
function useLoadingIndicator(opts = {}) {
  const nuxtApp = useNuxtApp();
  const indicator = nuxtApp._loadingIndicator ||= createLoadingIndicator(opts);
  return indicator;
}
const __nuxt_component_1 = defineComponent({
  name: "NuxtLoadingIndicator",
  props: {
    throttle: {
      type: Number,
      default: 200
    },
    duration: {
      type: Number,
      default: 2e3
    },
    hideDelay: {
      type: Number,
      default: 500
    },
    resetDelay: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 3
    },
    color: {
      type: [String, Boolean],
      default: "repeating-linear-gradient(to right,#00dc82 0%,#34cdfe 50%,#0047e1 100%)"
    },
    errorColor: {
      type: String,
      default: "repeating-linear-gradient(to right,#f87171 0%,#ef4444 100%)"
    },
    estimatedProgress: {
      type: Function,
      required: false
    }
  },
  setup(props, { slots, expose }) {
    const { progress, isLoading, error, start, finish, clear } = useLoadingIndicator({
      duration: props.duration,
      throttle: props.throttle,
      hideDelay: props.hideDelay,
      resetDelay: props.resetDelay,
      estimatedProgress: props.estimatedProgress
    });
    expose({
      progress,
      isLoading,
      error,
      start,
      finish,
      clear
    });
    return () => h("div", {
      class: "nuxt-loading-indicator",
      style: {
        position: "fixed",
        top: 0,
        right: 0,
        left: 0,
        pointerEvents: "none",
        width: "auto",
        height: `${props.height}px`,
        opacity: isLoading.value ? 1 : 0,
        background: error.value ? props.errorColor : props.color || void 0,
        backgroundSize: `${progress.value > 0 ? 100 / progress.value * 100 : 0}% auto`,
        transform: `scaleX(${progress.value}%)`,
        transformOrigin: "left",
        transition: "transform 0.1s, height 0.4s, opacity 0.4s",
        zIndex: 999999
      }
    }, slots);
  }
});
const layouts = {
  auth: defineAsyncComponent(() => import('./auth-C7nWTAwc.mjs').then((m) => m.default || m)),
  dashboard: defineAsyncComponent(() => import('./dashboard-CIJEwOtp.mjs').then((m) => m.default || m)),
  default: defineAsyncComponent(() => import('./default-DTO1Ajcg.mjs').then((m) => m.default || m)),
  track: defineAsyncComponent(() => import('./track-CgjvPf35.mjs').then((m) => m.default || m))
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
const __nuxt_component_0$1 = defineComponent({
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
      const hasLayout = !!layout.value && layout.value in layouts;
      const hasTransition = hasLayout && !!(route?.meta.layoutTransition ?? appLayoutTransition);
      const transitionProps = hasTransition && _mergeTransitionProps([
        route?.meta.layoutTransition,
        appLayoutTransition,
        {
          onBeforeLeave() {
            nuxtApp["~transitionPromise"] = new Promise((resolve) => {
              nuxtApp["~transitionFinish"] = resolve;
            });
          },
          onAfterLeave() {
            nuxtApp["~transitionFinish"]?.();
            delete nuxtApp["~transitionFinish"];
            delete nuxtApp["~transitionPromise"];
          }
        }
      ]);
      const previouslyRenderedLayout = lastLayout;
      lastLayout = layout.value;
      return _wrapInTransition(transitionProps, {
        default: () => h(
          Suspense,
          {
            suspensible: true,
            onResolve: async () => {
              await nextTick(done);
            }
          },
          {
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
                hasTransition
              },
              context.slots
            )
          }
        )
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
const __nuxt_component_0 = defineComponent({
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
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$8 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_NuxtRouteAnnouncer = __nuxt_component_0$4;
  const _component_NuxtLoadingIndicator = __nuxt_component_1;
  const _component_NuxtLayout = __nuxt_component_0$1;
  const _component_NuxtPage = __nuxt_component_0;
  _push(`<!--[-->`);
  _push(ssrRenderComponent(_component_NuxtRouteAnnouncer, null, null, _parent));
  _push(ssrRenderComponent(_component_NuxtLoadingIndicator, {
    color: "#e13515",
    height: 3,
    throttle: 0
  }, null, _parent));
  _push(ssrRenderComponent(_component_NuxtLayout, null, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent(_component_NuxtPage, null, null, _parent2, _scopeId));
      } else {
        return [
          createVNode(_component_NuxtPage)
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<!--]-->`);
}
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const AppComponent = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["ssrRender", _sfc_ssrRender]]);
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "BaseCard",
  __ssrInlineRender: true,
  props: {
    variant: { default: "default" },
    padding: { default: "md" },
    radius: { default: "2xl" },
    interactive: { type: Boolean, default: false }
  },
  setup(__props) {
    const props = __props;
    const variantMap = {
      default: "bg-white border border-[#e4e7ec] shadow-sm",
      elevated: "bg-white border border-[#e4e7ec] shadow-xl shadow-[#1018280d]",
      bordered: "bg-white border border-slate-200",
      dark: "bg-[#101828] border border-[#1d2939] text-white",
      soft: "bg-[#f9fafb] border border-[#e4e7ec]",
      glass: "bg-white/5 border border-white/10 backdrop-blur",
      dashboard: "bg-white border border-slate-200 shadow-sm",
      calculator: "bg-white border border-[#e4e7ec] shadow-2xl overflow-hidden"
    };
    const paddingMap = {
      none: "",
      sm: "p-4",
      md: "p-5",
      lg: "p-6",
      xl: "p-8"
    };
    const radiusMap = {
      md: "rounded-lg",
      lg: "rounded-xl",
      xl: "rounded-2xl",
      "2xl": "rounded-[1.75rem]",
      "3xl": "rounded-[2rem]"
    };
    const classes = computed(() => [
      variantMap[props.variant],
      paddingMap[props.padding],
      radiusMap[props.radius],
      props.interactive ? "transition-all hover:shadow-md" : ""
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: unref(classes) }, _attrs))}>`);
      if (_ctx.$slots.header) {
        _push(`<header class="contents">`);
        ssrRenderSlot(_ctx.$slots, "header", {}, null, _push, _parent);
        _push(`</header>`);
      } else {
        _push(`<!---->`);
      }
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      if (_ctx.$slots.footer) {
        _push(`<footer class="contents">`);
        ssrRenderSlot(_ctx.$slots, "footer", {}, null, _push, _parent);
        _push(`</footer>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</section>`);
    };
  }
});
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/base/BaseCard.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const BaseCard = Object.assign(_sfc_main$7, { __name: "BaseCard" });
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "UiCard",
  __ssrInlineRender: true,
  props: {
    padding: { default: "p-6" }
  },
  setup(__props) {
    const props = __props;
    const normalizedPadding = computed(() => {
      if (props.padding.includes("p-8")) return "xl";
      if (props.padding.includes("p-6")) return "lg";
      if (props.padding.includes("p-5")) return "md";
      if (props.padding.includes("p-4")) return "sm";
      return "md";
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(BaseCard, mergeProps({
        padding: unref(normalizedPadding),
        variant: "dashboard"
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
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/UiCard.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const UiCard = Object.assign(_sfc_main$6, { __name: "UiCard" });
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "BaseBadge",
  __ssrInlineRender: true,
  props: {
    variant: { default: "default" },
    size: { default: "md" },
    dot: { type: Boolean, default: false }
  },
  setup(__props) {
    const props = __props;
    const variantMap = {
      default: "bg-slate-50 text-slate-700 border-slate-200",
      orange: "bg-[#fff4ed] text-[#c4471a] border-[#fed7b5]",
      dark: "bg-[#101828] text-white border-[#101828]",
      green: "bg-green-50 text-green-700 border-green-200",
      red: "bg-red-50 text-red-700 border-red-200",
      yellow: "bg-[#fffaeb] text-[#b54708] border-[#fedf89]",
      blue: "bg-blue-50 text-blue-700 border-blue-200",
      gray: "bg-slate-100 text-slate-500 border-slate-200",
      verified: "bg-green-50 text-green-700 border-green-200",
      pending: "bg-amber-50 text-amber-700 border-amber-200",
      accepted: "bg-green-50 text-green-700 border-green-200",
      rejected: "bg-red-50 text-red-700 border-red-200",
      active: "bg-[#fff4ed] text-[#c4471a] border-[#fed7b5]",
      completed: "bg-blue-50 text-blue-700 border-blue-200"
    };
    const dotMap = {
      default: "bg-slate-400",
      orange: "bg-[#e13515]",
      dark: "bg-white",
      green: "bg-green-500",
      red: "bg-red-500",
      yellow: "bg-[#f79009]",
      blue: "bg-blue-500",
      gray: "bg-slate-400",
      verified: "bg-green-500",
      pending: "bg-amber-500",
      accepted: "bg-green-500",
      rejected: "bg-red-500",
      active: "bg-[#e13515]",
      completed: "bg-blue-500"
    };
    const sizeMap = {
      sm: "px-2 py-0.5 text-[11px]",
      md: "px-2.5 py-1 text-xs",
      lg: "px-3 py-1.5 text-sm"
    };
    const classes = computed(() => [
      "inline-flex items-center gap-1.5 rounded-full border font-semibold",
      variantMap[props.variant],
      sizeMap[props.size]
    ]);
    const dotClass = computed(() => dotMap[props.variant]);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<span${ssrRenderAttrs(mergeProps({ class: unref(classes) }, _attrs))}>`);
      if (__props.dot) {
        _push(`<span class="${ssrRenderClass([unref(dotClass), "w-1.5 h-1.5 rounded-full inline-block"])}"></span>`);
      } else {
        _push(`<!---->`);
      }
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</span>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/base/BaseBadge.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const BaseBadge = Object.assign(_sfc_main$5, { __name: "BaseBadge" });
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "UiBadge",
  __ssrInlineRender: true,
  props: {
    tone: { default: "neutral" }
  },
  setup(__props) {
    const props = __props;
    const variant = computed(() => ({
      neutral: "default",
      primary: "orange",
      success: "green",
      warning: "yellow",
      danger: "red"
    })[props.tone]);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(BaseBadge, mergeProps({ variant: unref(variant) }, _attrs), {
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
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/UiBadge.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const UiBadge = Object.assign(_sfc_main$4, { __name: "UiBadge" });
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "BaseButton",
  __ssrInlineRender: true,
  props: {
    to: {},
    variant: { default: "primary" },
    size: { default: "md" },
    block: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    type: { default: "button" },
    iconLeft: {},
    iconRight: {}
  },
  setup(__props) {
    const props = __props;
    const variantMap = {
      primary: "bg-[#e13515] border border-[#e13515] text-white shadow-[0_18px_36px_-22px_rgba(225,53,21,0.9)] hover:bg-[#b82c10] hover:border-[#b82c10]",
      secondary: "bg-white border border-[#d0d5dd] text-[#344054] shadow-sm hover:bg-[#f9fafb]",
      dark: "bg-[#101828] border border-[#101828] text-white shadow-sm hover:bg-[#1d2939]",
      light: "bg-white border border-white/40 text-white hover:bg-white/10",
      ghost: "bg-transparent border border-transparent text-[#667085] hover:bg-[#f9fafb] hover:text-[#344054]",
      outline: "bg-transparent border border-[#475467] text-[#d0d5dd] hover:text-white hover:border-[#667085]",
      danger: "bg-[#d92d20] border border-[#d92d20] text-white hover:bg-[#b42318]",
      success: "bg-[#12b76a] border border-[#12b76a] text-white hover:bg-[#039855]"
    };
    const sizeMap = {
      sm: "px-3 py-2 text-[12px] rounded-lg",
      md: "px-4 py-2.5 text-[13px] rounded-xl",
      lg: "px-5 py-2.5 text-[13.5px] rounded-xl",
      xl: "px-7 py-3.5 text-base rounded-xl"
    };
    const classes = computed(() => [
      "inline-flex items-center justify-center gap-2 font-semibold transition-colors",
      variantMap[props.variant],
      sizeMap[props.size],
      props.block ? "w-full" : "",
      props.disabled || props.loading ? "cursor-not-allowed opacity-60" : ""
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$2;
      if (__props.to) {
        _push(ssrRenderComponent(_component_NuxtLink, mergeProps({
          to: __props.to,
          class: unref(classes)
        }, _attrs), {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "left", {}, () => {
                _push2(`${ssrInterpolate(__props.iconLeft)}`);
              }, _push2, _parent2, _scopeId);
              if (__props.loading) {
                _push2(`<span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current/30 border-t-current"${_scopeId}></span>`);
              } else {
                ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
              }
              ssrRenderSlot(_ctx.$slots, "right", {}, () => {
                _push2(`${ssrInterpolate(__props.iconRight)}`);
              }, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "left", {}, () => [
                  createTextVNode(toDisplayString(__props.iconLeft), 1)
                ]),
                __props.loading ? (openBlock(), createBlock("span", {
                  key: 0,
                  class: "inline-block h-4 w-4 animate-spin rounded-full border-2 border-current/30 border-t-current"
                })) : renderSlot(_ctx.$slots, "default", { key: 1 }),
                renderSlot(_ctx.$slots, "right", {}, () => [
                  createTextVNode(toDisplayString(__props.iconRight), 1)
                ])
              ];
            }
          }),
          _: 3
        }, _parent));
      } else {
        _push(`<button${ssrRenderAttrs(mergeProps({
          type: __props.type,
          disabled: __props.disabled || __props.loading,
          class: unref(classes)
        }, _attrs))}>`);
        ssrRenderSlot(_ctx.$slots, "left", {}, () => {
          _push(`${ssrInterpolate(__props.iconLeft)}`);
        }, _push, _parent);
        if (__props.loading) {
          _push(`<span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current/30 border-t-current"></span>`);
        } else {
          ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
        }
        ssrRenderSlot(_ctx.$slots, "right", {}, () => {
          _push(`${ssrInterpolate(__props.iconRight)}`);
        }, _push, _parent);
        _push(`</button>`);
      }
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/base/BaseButton.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const BaseButton = Object.assign(_sfc_main$3, { __name: "BaseButton" });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "UiButton",
  __ssrInlineRender: true,
  props: {
    to: {},
    type: { default: "button" },
    variant: { default: "primary" },
    size: { default: "md" },
    loading: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    block: { type: Boolean, default: false }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(BaseButton, mergeProps(props, _attrs), {
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
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/UiButton.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const UiButton = Object.assign(_sfc_main$2, { __name: "UiButton" });
function buildShopOwnerSignupRoute() {
  return "/auth/register?role=production";
}
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "error",
  __ssrInlineRender: true,
  props: {
    error: {}
  },
  setup(__props) {
    const props = __props;
    const normalizedCode = computed(() => props.error?.statusCode ?? 500);
    const normalizedMessage = computed(() => props.error?.statusMessage || "The restored frontend shell hit an unexpected issue.");
    const shopSignupLink = buildShopOwnerSignupRoute();
    const showSignupAction = computed(() => normalizedCode.value === 401 || normalizedCode.value === 403 || normalizedCode.value === 404);
    const handleError = () => clearError({ redirect: "/" });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLayout = __nuxt_component_0$1;
      const _component_UiCard = UiCard;
      const _component_UiBadge = UiBadge;
      const _component_UiButton = UiButton;
      _push(ssrRenderComponent(_component_NuxtLayout, mergeProps({ name: "default" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<section class="flex min-h-screen items-center justify-center px-4 py-12"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UiCard, { class: "max-w-xl space-y-4 text-center" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UiBadge, { tone: "warning" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Error ${ssrInterpolate(unref(normalizedCode))}`);
                      } else {
                        return [
                          createTextVNode("Error " + toDisplayString(unref(normalizedCode)), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<h1 class="text-3xl font-semibold tracking-tight text-slate-950"${_scopeId2}>Something interrupted this page.</h1><p class="text-sm text-slate-600"${_scopeId2}>${ssrInterpolate(unref(normalizedMessage))}</p><div class="flex flex-wrap items-center justify-center gap-3"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UiButton, {
                    to: "/",
                    variant: "primary"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Back to homepage`);
                      } else {
                        return [
                          createTextVNode("Back to homepage")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  if (unref(showSignupAction)) {
                    _push3(ssrRenderComponent(_component_UiButton, {
                      to: unref(shopSignupLink),
                      variant: "secondary"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`Go to signup`);
                        } else {
                          return [
                            createTextVNode("Go to signup")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(ssrRenderComponent(_component_UiButton, {
                    variant: "secondary",
                    onClick: handleError
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Clear error`);
                      } else {
                        return [
                          createTextVNode("Clear error")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode(_component_UiBadge, { tone: "warning" }, {
                      default: withCtx(() => [
                        createTextVNode("Error " + toDisplayString(unref(normalizedCode)), 1)
                      ]),
                      _: 1
                    }),
                    createVNode("h1", { class: "text-3xl font-semibold tracking-tight text-slate-950" }, "Something interrupted this page."),
                    createVNode("p", { class: "text-sm text-slate-600" }, toDisplayString(unref(normalizedMessage)), 1),
                    createVNode("div", { class: "flex flex-wrap items-center justify-center gap-3" }, [
                      createVNode(_component_UiButton, {
                        to: "/",
                        variant: "primary"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Back to homepage")
                        ]),
                        _: 1
                      }),
                      unref(showSignupAction) ? (openBlock(), createBlock(_component_UiButton, {
                        key: 0,
                        to: unref(shopSignupLink),
                        variant: "secondary"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Go to signup")
                        ]),
                        _: 1
                      }, 8, ["to"])) : createCommentVNode("", true),
                      createVNode(_component_UiButton, {
                        variant: "secondary",
                        onClick: handleError
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Clear error")
                        ]),
                        _: 1
                      })
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</section>`);
          } else {
            return [
              createVNode("section", { class: "flex min-h-screen items-center justify-center px-4 py-12" }, [
                createVNode(_component_UiCard, { class: "max-w-xl space-y-4 text-center" }, {
                  default: withCtx(() => [
                    createVNode(_component_UiBadge, { tone: "warning" }, {
                      default: withCtx(() => [
                        createTextVNode("Error " + toDisplayString(unref(normalizedCode)), 1)
                      ]),
                      _: 1
                    }),
                    createVNode("h1", { class: "text-3xl font-semibold tracking-tight text-slate-950" }, "Something interrupted this page."),
                    createVNode("p", { class: "text-sm text-slate-600" }, toDisplayString(unref(normalizedMessage)), 1),
                    createVNode("div", { class: "flex flex-wrap items-center justify-center gap-3" }, [
                      createVNode(_component_UiButton, {
                        to: "/",
                        variant: "primary"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Back to homepage")
                        ]),
                        _: 1
                      }),
                      unref(showSignupAction) ? (openBlock(), createBlock(_component_UiButton, {
                        key: 0,
                        to: unref(shopSignupLink),
                        variant: "secondary"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Go to signup")
                        ]),
                        _: 1
                      }, 8, ["to"])) : createCommentVNode("", true),
                      createVNode(_component_UiButton, {
                        variant: "secondary",
                        onClick: handleError
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Clear error")
                        ]),
                        _: 1
                      })
                    ])
                  ]),
                  _: 1
                })
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
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
    const IslandRenderer = () => null;
    const nuxtApp = useNuxtApp();
    nuxtApp.deferHydration();
    nuxtApp.ssrContext.url;
    const SingleRenderer = false;
    provide(PageRouteSymbol, useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup", []);
    const error = /* @__PURE__ */ useError();
    const abortRender = error.value && !nuxtApp.ssrContext.error;
    function invokeAppErrorHandler(err, target, info) {
      const errorHandler = nuxtApp.vueApp.config.errorHandler;
      if (errorHandler && !errorHandler.__nuxt_default) {
        try {
          errorHandler(err, target, info);
        } catch (handlerError) {
          console.error("[nuxt] Error in `app.config.errorHandler`", handlerError);
        }
      }
    }
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info)?.catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        const p = nuxtApp.runWithContext(() => showError(err));
        onServerPrefetch(() => p);
        invokeAppErrorHandler(err, target, info);
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

export { API as A, BaseBadge as B, UiBadge as U, __nuxt_component_0$2 as _, BaseButton as a, BaseCard as b, UiButton as c, UiCard as d, entry_default as default, __nuxt_component_0 as e, __nuxt_component_0$3 as f, _export_sfc as g, defineNuxtRouteMiddleware as h, getApiErrorDetail as i, getApiErrorMessage as j, normalizeApiList as k, useAsyncData as l, useAuthStore as m, navigateTo as n, useCookie as o, useHead as p, useRoute as q, useRouter as r, useRuntimeConfig as s, useState as t, useApi as u };
//# sourceMappingURL=server.mjs.map
