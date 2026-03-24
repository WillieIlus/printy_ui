import { g as useRoute, c as useAuthStore } from './server.mjs';
import { u as useSellerStore } from './seller-D7njK1DD.mjs';
import { u as useSetupStatus } from './useSetupStatus-ioR4SSE7.mjs';
import { computed } from 'vue';

function useSetupChecklist() {
  const route = useRoute();
  const sellerStore = useSellerStore();
  const { status } = useSetupStatus();
  const selectedShopSlug = computed(() => {
    const routeSlug = typeof route.params.slug === "string" ? route.params.slug : "";
    return routeSlug || sellerStore.shops[0]?.slug || "";
  });
  function shopRoute(path, fallback = "/dashboard/shops/create") {
    return selectedShopSlug.value ? `/dashboard/shops/${selectedShopSlug.value}${path}` : fallback;
  }
  const stepOrder = ["shop", "machines", "papers", "pricing", "products"];
  const stepDone = computed(() => ({
    shop: Boolean(status.value?.has_shop),
    machines: Boolean(status.value?.has_machines),
    papers: Boolean(status.value?.has_papers),
    pricing: Boolean(status.value?.has_pricing),
    products: Boolean(status.value?.has_published_products)
  }));
  const requiredKey = computed(() => {
    const next = status.value?.next_step;
    if (!next || next === "done") return null;
    if (stepOrder.includes(next)) return next;
    return null;
  });
  const items = computed(() => [
    {
      key: "shop",
      label: "Shop Profile",
      description: "Business identity, contact details, and address.",
      icon: "i-lucide-store",
      to: shopRoute("/edit"),
      done: stepDone.value.shop,
      state: stepDone.value.shop ? "complete" : requiredKey.value === "shop" ? "required" : "missing"
    },
    {
      key: "machines",
      label: "Machines",
      description: "Equipment, sheet limits, and machine capacity.",
      icon: "i-lucide-printer",
      to: shopRoute("/machines"),
      done: stepDone.value.machines,
      state: stepDone.value.machines ? "complete" : requiredKey.value === "machines" ? "required" : "missing"
    },
    {
      key: "papers",
      label: "Paper Stock",
      description: "Paper lines and stock used in quoting.",
      icon: "i-lucide-file-stack",
      to: shopRoute("/papers"),
      done: stepDone.value.papers,
      state: stepDone.value.papers ? "complete" : requiredKey.value === "papers" ? "required" : "missing"
    },
    {
      key: "pricing",
      label: "Pricing",
      description: "Printing rates, materials, and pricing rules.",
      icon: "i-lucide-banknote",
      to: shopRoute("/pricing"),
      done: stepDone.value.pricing,
      state: stepDone.value.pricing ? "complete" : requiredKey.value === "pricing" ? "required" : "missing"
    },
    {
      key: "products",
      label: "Products",
      description: "Published products ready for quoting.",
      icon: "i-lucide-package",
      to: shopRoute("/products"),
      done: stepDone.value.products,
      state: stepDone.value.products ? "complete" : requiredKey.value === "products" ? "required" : "missing"
    }
  ]);
  const totalSteps = computed(() => items.value.length);
  const completedSteps = computed(() => items.value.filter((item) => item.done).length);
  const progressPercent = computed(() => Math.round(completedSteps.value / totalSteps.value * 100));
  const summary = computed(() => `${completedSteps.value} of ${totalSteps.value} setup steps completed`);
  const nextRequiredItem = computed(() => items.value.find((item) => item.state === "required") ?? null);
  return {
    items,
    completedSteps,
    totalSteps,
    progressPercent,
    summary,
    nextRequiredItem,
    requiredKey
  };
}
function useAdminWorkspace() {
  const route = useRoute();
  const authStore = useAuthStore();
  const sellerStore = useSellerStore();
  const { status } = useSetupStatus();
  const { items: checklistItems, summary } = useSetupChecklist();
  const selectedShopSlug = computed(() => {
    const routeSlug = typeof route.params.slug === "string" ? route.params.slug : "";
    if (routeSlug) return routeSlug;
    return sellerStore.shops[0]?.slug ?? "";
  });
  const selectedShop = computed(
    () => sellerStore.shops.find((shop) => shop.slug === selectedShopSlug.value) ?? sellerStore.shops[0] ?? null
  );
  const hasShop = computed(() => Boolean(selectedShop.value));
  const isSuperuser = computed(() => Boolean(authStore.user?.is_superuser));
  const setupStates = computed(() => ({
    shop: Boolean(status.value?.has_shop),
    machines: Boolean(status.value?.has_machines),
    papers: Boolean(status.value?.has_papers),
    pricing: Boolean(status.value?.has_pricing),
    products: Boolean(status.value?.has_published_products)
  }));
  function sectionBadge(key) {
    const item = checklistItems.value.find((check) => check.key === key);
    if (!item) return null;
    if (item.state === "required") return "Required";
    if (item.state === "missing") return "Missing";
    return null;
  }
  function shopRoute(path, fallback = "/dashboard/shops/create") {
    return selectedShopSlug.value ? `/dashboard/shops/${selectedShopSlug.value}${path}` : fallback;
  }
  const navSections = computed(() => {
    const sections = [
      {
        label: "Dashboard",
        items: [
          {
            label: "Overview",
            to: "/dashboard",
            icon: "i-lucide-layout-dashboard",
            helper: "Workspace summary"
          },
          {
            label: "Setup Guide",
            to: "/dashboard/setup-guide",
            icon: "i-lucide-list-checks",
            helper: "Essential setup status",
            badge: status.value?.next_step === "done" ? null : `${checklistItems.value.filter((item) => item.done).length}/${checklistItems.value.length}`
          }
        ]
      },
      {
        label: "Shop",
        items: [
          {
            label: "Shop Profile",
            to: shopRoute("/edit"),
            icon: "i-lucide-store",
            helper: "Business details",
            setupKey: "shop",
            badge: sectionBadge("shop")
          },
          {
            label: "Machines",
            to: shopRoute("/machines"),
            icon: "i-lucide-printer",
            helper: "Equipment and capacity",
            setupKey: "machines",
            badge: sectionBadge("machines")
          },
          {
            label: "Paper Stock",
            to: shopRoute("/papers"),
            icon: "i-lucide-file-stack",
            helper: "Paper inventory",
            setupKey: "papers",
            badge: sectionBadge("papers")
          },
          {
            label: "Pricing",
            to: shopRoute("/pricing"),
            icon: "i-lucide-banknote",
            helper: "Printing and material rates",
            setupKey: "pricing",
            badge: sectionBadge("pricing")
          },
          {
            label: "Finishings",
            to: shopRoute("/finishing"),
            icon: "i-lucide-scissors",
            helper: "Post-press services"
          },
          {
            label: "Products",
            to: shopRoute("/products"),
            icon: "i-lucide-package",
            helper: "Sellable catalog",
            setupKey: "products",
            badge: sectionBadge("products")
          }
        ]
      },
      {
        label: "Quotes",
        items: [
          {
            label: "Incoming Requests",
            to: shopRoute("/incoming-requests"),
            icon: "i-lucide-inbox",
            helper: "Customer quote requests"
          },
          {
            label: "Draft Quotes",
            to: shopRoute("/sent-quotes?status=draft"),
            icon: "i-lucide-file-pen-line",
            helper: "Unsent or draft pricing work"
          },
          {
            label: "Sent Quotes",
            to: shopRoute("/sent-quotes"),
            icon: "i-lucide-send",
            helper: "Quotes awaiting response"
          }
        ]
      },
      {
        label: "Settings",
        items: [
          {
            label: "Settings",
            to: "/dashboard/settings",
            icon: "i-lucide-settings",
            helper: "Account and workspace settings"
          }
        ]
      }
    ];
    if (isSuperuser.value) {
      sections.push({
        label: "Super Admin",
        items: [
          {
            label: "Analytics",
            to: "/super-admin/analytics",
            icon: "i-lucide-chart-column",
            helper: "Platform-wide analytics"
          }
        ]
      });
    }
    return sections;
  });
  return {
    selectedShopSlug,
    selectedShop,
    hasShop,
    isSuperuser,
    setupStates,
    setupSummary: summary,
    navSections,
    shopRoute
  };
}

export { useSetupChecklist as a, useAdminWorkspace as u };
//# sourceMappingURL=useAdminWorkspace-CXLeD_Ju.mjs.map
