import { c as useAuthStore, f as useRoute } from './server.mjs';
import { u as useSetupStatus } from './useSetupStatus-CUJDN1af.mjs';
import { u as useShopStore } from './shop-DfXxeXDQ.mjs';
import { computed } from 'vue';
import { u as useSellerStore } from './seller-B_HIq8FR.mjs';

function useSetupChecklist() {
  const shopStore = useShopStore();
  const { status } = useSetupStatus();
  function shopRoute(path, fallback = "/dashboard/shops/create") {
    const slug = shopStore.selectedShopSlug;
    return slug ? `/dashboard/shops/${slug}${path}` : fallback;
  }
  const items = computed(() => {
    const nextStep = status.value?.next_step;
    const definitions = [
      { key: "shop", label: "Shop", description: "Create the shop workspace.", icon: "i-lucide-store", to: "/dashboard/shops/create" },
      { key: "materials", label: "Materials", description: "Add papers and materials.", icon: "i-lucide-file-stack", to: shopRoute("/materials") },
      { key: "pricing", label: "Pricing", description: "Add machine pricing rules.", icon: "i-lucide-banknote", to: shopRoute("/pricing") },
      { key: "finishing", label: "Finishing", description: "Add finishing rules and lamination metadata.", icon: "i-lucide-scissors", to: shopRoute("/finishing") },
      { key: "products", label: "Products", description: "Create the first product.", icon: "i-lucide-package", to: shopRoute("/products") }
    ];
    const doneMap = {
      shop: Boolean(status.value?.has_shop),
      materials: Boolean(status.value?.has_materials),
      pricing: Boolean(status.value?.has_pricing),
      finishing: Boolean(status.value?.has_finishing),
      products: Boolean(status.value?.has_products)
    };
    return definitions.map((definition) => ({
      ...definition,
      done: doneMap[definition.key],
      state: doneMap[definition.key] ? "complete" : nextStep === definition.key ? "required" : "missing"
    }));
  });
  const completedSteps = computed(() => items.value.filter((item) => item.done).length);
  const totalSteps = computed(() => items.value.length);
  const progressPercent = computed(() => Math.round(completedSteps.value / totalSteps.value * 100));
  const summary = computed(() => `${completedSteps.value} of ${totalSteps.value} backend setup steps complete`);
  const nextRequiredItem = computed(() => items.value.find((item) => item.state === "required") ?? null);
  return {
    items,
    completedSteps,
    totalSteps,
    progressPercent,
    summary,
    nextRequiredItem
  };
}
function useAdminWorkspace() {
  const authStore = useAuthStore();
  const shopStore = useShopStore();
  const sellerStore = useSellerStore();
  const { summary } = useSetupChecklist();
  const route = useRoute();
  const routeShopSlug = computed(() => {
    const slug = route.params.slug;
    return typeof slug === "string" ? slug : "";
  });
  const selectedShopSlug = computed(
    () => routeShopSlug.value || shopStore.currentShop?.slug || shopStore.selectedShopSlug || sellerStore.shops[0]?.slug || ""
  );
  const selectedShop = computed(() => shopStore.currentShop);
  const hasShop = computed(() => Boolean(selectedShop.value));
  const isSuperuser = computed(() => Boolean(authStore.user?.is_superuser));
  function shopRoute(path, fallback = "/dashboard/shops/create") {
    return selectedShopSlug.value ? `/dashboard/shops/${selectedShopSlug.value}${path}` : fallback;
  }
  const navSections = computed(() => [
    {
      label: "Workspace",
      kind: "workspace",
      items: [
        { label: "Dashboard", to: "/dashboard", icon: "i-lucide-layout-dashboard", helper: "Owner workspace desk" },
        { label: "Setup Guide", to: "/dashboard/setup-guide", icon: "i-lucide-list-checks", helper: "Backend setup status" },
        { label: "Quote Drafts", to: "/quote-draft", icon: "i-lucide-files", helper: "Client draft workspace" }
      ]
    },
    {
      label: "Shop",
      kind: "shop",
      items: [
        { label: "Shop Home", to: shopRoute(""), icon: "i-lucide-store", helper: "Selected shop workspace" },
        { label: "Materials", to: shopRoute("/materials"), icon: "i-lucide-file-stack", helper: "Papers and materials" },
        { label: "Pricing", to: shopRoute("/pricing"), icon: "i-lucide-banknote", helper: "Machine and material pricing" },
        { label: "Finishing", to: shopRoute("/finishing"), icon: "i-lucide-scissors", helper: "Billing basis and lamination" },
        { label: "Products", to: shopRoute("/products"), icon: "i-lucide-package", helper: "Catalog and product rules" }
      ]
    },
    {
      label: "Utility",
      kind: "utility",
      items: [
        { label: "Home", to: "/", icon: "i-lucide-house", helper: "Public homepage" },
        {
          label: "View Public Shop",
          to: selectedShopSlug.value ? `/shops/${selectedShopSlug.value}` : "/shops",
          icon: "i-lucide-external-link",
          helper: selectedShopSlug.value ? "Open the current shop public page" : "Open the public shops directory"
        },
        {
          label: "Sign out",
          icon: "i-lucide-log-out",
          helper: "End this session",
          action: () => authStore.logout()
        }
      ]
    }
  ].map((section) => ({
    ...section,
    items: section.items.filter((item) => Boolean(item))
  })));
  return {
    selectedShopSlug,
    selectedShop,
    hasShop,
    isSuperuser,
    setupSummary: summary,
    navSections,
    shopRoute
  };
}

export { useSetupChecklist as a, useAdminWorkspace as u };
//# sourceMappingURL=useAdminWorkspace-C08JPEZs.mjs.map
