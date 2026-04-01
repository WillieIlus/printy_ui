import { l as listSellerShops } from './seller-B7IxAeLp.mjs';
import { ref } from 'vue';
import { defineStore } from 'pinia';

const useSellerStore = defineStore("seller", () => {
  const shops = ref([]);
  const loading = ref(false);
  const loaded = ref(false);
  async function fetchShops() {
    loading.value = true;
    try {
      shops.value = await listSellerShops();
      loaded.value = true;
    } catch {
      shops.value = [];
      loaded.value = true;
    } finally {
      loading.value = false;
    }
  }
  function getShop(id) {
    return shops.value.find((s) => s.id === id);
  }
  function getShopBySlug(slug) {
    return shops.value.find((s) => s.slug === slug);
  }
  return { shops, loading, loaded, fetchShops, getShop, getShopBySlug };
});

export { useSellerStore as u };
//# sourceMappingURL=seller-B_HIq8FR.mjs.map
