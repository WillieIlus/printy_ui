import { s as useNuxtApp, A as API, v as safeLogError } from './server.mjs';
import { p as parseApiError } from './api-error-D1IYk86E.mjs';
import { ref } from 'vue';
import { defineStore } from 'pinia';

const useShopStore = defineStore("shop", () => {
  const shops = ref([]);
  const myShops = ref([]);
  const currentShop = ref(null);
  const nearbyShops = ref([]);
  const shopMembers = ref([]);
  const shopHours = ref([]);
  const shopSocialLinks = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const pagination = ref({
    count: 0,
    next: null,
    previous: null
  });
  async function fetchShops(params) {
    loading.value = true;
    error.value = null;
    try {
      const { $api } = useNuxtApp();
      const response = await $api(API.shops(), { params });
      shops.value = response?.results ?? [];
      pagination.value = {
        count: response?.count ?? 0,
        next: response?.next ?? null,
        previous: response?.previous ?? null
      };
    } catch (err) {
      error.value = parseApiError(err, "Failed to fetch shops");
      safeLogError(err, "shop.fetchShops");
      shops.value = [];
    } finally {
      loading.value = false;
    }
  }
  async function fetchMyShops() {
    loading.value = true;
    error.value = null;
    try {
      const { $api } = useNuxtApp();
      const response = await $api(API.shops());
      const list = Array.isArray(response) ? response : response?.results ?? [];
      myShops.value = list;
    } catch (err) {
      error.value = parseApiError(err, "Failed to fetch my shops");
      safeLogError(err, "shop.fetchMyShops");
    } finally {
      loading.value = false;
    }
  }
  async function fetchShopBySlug(slug) {
    loading.value = true;
    error.value = null;
    const isSameShop = currentShop.value?.slug === slug;
    if (!isSameShop) {
      currentShop.value = null;
    }
    try {
      const { $api } = useNuxtApp();
      const data = await $api(API.shopDetail(slug));
      currentShop.value = data;
    } catch (err) {
      error.value = parseApiError(err, "Failed to fetch shop");
      safeLogError(err, "shop.fetchShopBySlug");
    } finally {
      loading.value = false;
    }
  }
  async function createShop(data) {
    loading.value = true;
    error.value = null;
    try {
      const { $api } = useNuxtApp();
      const shop = await $api(API.shops(), {
        method: "POST",
        body: data
      });
      if (!Array.isArray(myShops.value)) {
        myShops.value = [];
      }
      myShops.value.push(shop);
      return { success: true, shop };
    } catch (err) {
      const message = parseApiError(err, "Failed to create shop");
      error.value = message;
      safeLogError(err, "shop.createShop");
      return { success: false, error: message };
    } finally {
      loading.value = false;
    }
  }
  async function updateShop(slug, data) {
    loading.value = true;
    error.value = null;
    try {
      const { $api } = useNuxtApp();
      const shop = await $api(API.shopDetail(slug), {
        method: "PATCH",
        body: data
      });
      currentShop.value = shop;
      if (Array.isArray(myShops.value)) {
        const idx = myShops.value.findIndex((s) => s.slug === slug);
        if (idx !== -1) myShops.value[idx] = shop;
      }
      return { success: true, shop };
    } catch (err) {
      const message = parseApiError(err, "Failed to update shop");
      error.value = message;
      safeLogError(err, "shop.updateShop");
      return { success: false, error: message };
    } finally {
      loading.value = false;
    }
  }
  async function transferOwnership(slug, newOwnerId) {
    try {
      const { $api } = useNuxtApp();
      await $api(API.shopTransferOwnership(slug), {
        method: "POST",
        body: { new_owner_id: newOwnerId }
      });
      return { success: true };
    } catch (err) {
      const message = parseApiError(err, "Failed to transfer ownership");
      safeLogError(err, "shop.transferOwnership");
      return { success: false, error: message };
    }
  }
  async function fetchShopMembers(slug) {
    try {
      const { $api } = useNuxtApp();
      shopMembers.value = await $api(API.shopMembers(slug));
    } catch (err) {
      error.value = parseApiError(err, "Failed to fetch members");
      safeLogError(err, "shop.fetchShopMembers");
      throw err;
    }
  }
  async function removeShopMember(slug, pk) {
    try {
      const { $api } = useNuxtApp();
      await $api(API.shopMemberDetail(slug, pk), { method: "DELETE" });
      shopMembers.value = shopMembers.value.filter((m) => m.id !== pk);
      return { success: true };
    } catch (err) {
      const message = parseApiError(err, "Failed to remove member");
      safeLogError(err, "shop.removeShopMember");
      return { success: false, error: message };
    }
  }
  async function fetchShopHoursList(slug) {
    try {
      const { $api } = useNuxtApp();
      shopHours.value = await $api(API.shopHours(slug));
    } catch (err) {
      error.value = parseApiError(err, "Failed to fetch hours");
      safeLogError(err, "shop.fetchShopHoursList");
      throw err;
    }
  }
  async function updateShopHoursBulk(slug, hours) {
    try {
      const { $api } = useNuxtApp();
      const updated = await $api(API.shopHoursBulk(slug), {
        method: "POST",
        body: { hours }
      });
      shopHours.value = Array.isArray(updated) ? updated : shopHours.value;
      return { success: true };
    } catch (err) {
      const message = parseApiError(err, "Failed to update hours");
      safeLogError(err, "shop.updateShopHoursBulk");
      return { success: false, error: message };
    }
  }
  async function fetchShopSocialLinksList(slug) {
    try {
      const { $api } = useNuxtApp();
      shopSocialLinks.value = await $api(API.shopSocialLinks(slug));
    } catch (err) {
      error.value = parseApiError(err, "Failed to fetch social links");
      safeLogError(err, "shop.fetchShopSocialLinksList");
      throw err;
    }
  }
  async function addShopSocialLink(slug, link) {
    try {
      const { $api } = useNuxtApp();
      const newLink = await $api(API.shopSocialLinks(slug), {
        method: "POST",
        body: link
      });
      shopSocialLinks.value.push(newLink);
      return { success: true, link: newLink };
    } catch (err) {
      const message = parseApiError(err, "Failed to add link");
      safeLogError(err, "shop.addShopSocialLink");
      return { success: false, error: message };
    }
  }
  async function deleteShopSocialLink(slug, pk) {
    try {
      const { $api } = useNuxtApp();
      await $api(API.shopSocialLinkDetail(slug, pk), { method: "DELETE" });
      shopSocialLinks.value = shopSocialLinks.value.filter((l) => l.id !== pk);
      return { success: true };
    } catch (err) {
      const message = parseApiError(err, "Failed to delete link");
      safeLogError(err, "shop.deleteShopSocialLink");
      return { success: false, error: message };
    }
  }
  async function fetchNearbyShops(params) {
    loading.value = true;
    error.value = null;
    try {
      const { $api } = useNuxtApp();
      nearbyShops.value = await $api(API.shopsNearby(), { params });
    } catch (err) {
      error.value = parseApiError(err, "Failed to fetch nearby shops");
      safeLogError(err, "shop.fetchNearbyShops");
    } finally {
      loading.value = false;
    }
  }
  return {
    // State
    shops,
    myShops,
    currentShop,
    nearbyShops,
    shopMembers,
    shopHours,
    shopSocialLinks,
    loading,
    error,
    pagination,
    // Actions
    fetchShops,
    fetchMyShops,
    fetchShopBySlug,
    createShop,
    updateShop,
    transferOwnership,
    fetchShopMembers,
    removeShopMember,
    fetchShopHoursList,
    updateShopHoursBulk,
    fetchShopSocialLinksList,
    addShopSocialLink,
    deleteShopSocialLink,
    fetchNearbyShops
  };
});

export { useShopStore as u };
//# sourceMappingURL=shop-D6P1awrr.mjs.map
