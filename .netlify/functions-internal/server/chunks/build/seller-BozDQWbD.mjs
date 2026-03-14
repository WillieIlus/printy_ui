import { l as listSellerShops } from './seller-laoC9_qJ.mjs';
import { ref } from 'vue';
import { defineStore } from 'pinia';

const useSellerStore = defineStore("seller", () => {
  const shops = ref([]);
  const loading = ref(false);
  async function fetchShops() {
    loading.value = true;
    try {
      shops.value = await listSellerShops();
    } catch {
      shops.value = [];
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
  return { shops, loading, fetchShops, getShop, getShopBySlug };
});

export { useSellerStore as u };
//# sourceMappingURL=seller-BozDQWbD.mjs.map
