import { c as useAuthStore, i as useToast, d as _sfc_main$9, k as useApi, A as API } from './server.mjs';
import { ref, computed, defineComponent, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { defineStore } from 'pinia';

async function getFavorites() {
  const api = useApi();
  const data = await api(API.meFavorites());
  if (!Array.isArray(data)) return [];
  return data.map((f) => ({ id: f.shop.id, name: f.shop.name, slug: f.shop.slug }));
}
async function addFavorite(shopId) {
  const api = useApi();
  await api(API.meFavorites(), { method: "POST", body: { shop: shopId } });
}
async function removeFavorite(shopId) {
  const api = useApi();
  await api(API.meFavoriteDetail(shopId), { method: "DELETE" });
}
const useFavoritesStore = defineStore("favorites", () => {
  const favorites = ref([]);
  const loading = ref(false);
  const loaded = ref(false);
  const favoriteIds = computed(() => new Set(favorites.value.map((f) => f.id)));
  function isFavorite(shopId) {
    return favoriteIds.value.has(shopId);
  }
  async function loadFavorites() {
    loading.value = true;
    try {
      favorites.value = await getFavorites();
      loaded.value = true;
    } catch {
      favorites.value = [];
    } finally {
      loading.value = false;
    }
  }
  async function toggleFavorite(shopId, shopName, shopSlug) {
    const wasFavorite = isFavorite(shopId);
    try {
      if (wasFavorite) {
        await removeFavorite(shopId);
        favorites.value = favorites.value.filter((f) => f.id !== shopId);
        return false;
      } else {
        await addFavorite(shopId);
        favorites.value = [...favorites.value, { id: shopId, name: shopName, slug: shopSlug }];
        return true;
      }
    } catch {
      throw new Error("Failed to update favorite");
    }
  }
  return {
    favorites,
    loading,
    loaded,
    favoriteIds,
    isFavorite,
    loadFavorites,
    toggleFavorite
  };
});
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ShopFavoriteToggle",
  __ssrInlineRender: true,
  props: {
    shopId: {},
    shopName: {},
    shopSlug: {}
  },
  setup(__props) {
    const props = __props;
    const authStore = useAuthStore();
    const favoritesStore = useFavoritesStore();
    const toast = useToast();
    const isFav = computed(() => favoritesStore.isFavorite(props.shopId));
    const toggling = ref(false);
    async function onToggle() {
      if (!authStore.isAuthenticated) {
        toast.add({ title: "Sign in to save shops", description: "Create an account to save your favorite shops.", color: "primary" });
        return;
      }
      toggling.value = true;
      try {
        const nowFav = await favoritesStore.toggleFavorite(props.shopId, props.shopName, props.shopSlug);
        toast.add({
          title: nowFav ? "Shop saved" : "Removed from favorites",
          color: nowFav ? "success" : "neutral"
        });
      } catch {
        toast.add({ title: "Could not update", color: "error" });
      } finally {
        toggling.value = false;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$9;
      _push(ssrRenderComponent(_component_UButton, mergeProps({
        icon: unref(isFav) ? "i-lucide-heart" : "i-lucide-heart",
        color: unref(isFav) ? "error" : "neutral",
        variant: unref(isFav) ? "soft" : "ghost",
        size: "xs",
        loading: unref(toggling),
        "aria-label": unref(isFav) ? "Remove from favorites" : "Save shop",
        onClick: onToggle
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/shops/ShopFavoriteToggle.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_3 = Object.assign(_sfc_main, { __name: "ShopsShopFavoriteToggle" });

export { __nuxt_component_3 as _, useFavoritesStore as u };
//# sourceMappingURL=ShopFavoriteToggle-fsoaFo9O.mjs.map
