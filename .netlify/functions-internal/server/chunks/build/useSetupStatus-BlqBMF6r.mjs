import { storeToRefs } from 'pinia';
import { u as useSetupStatusStore } from './setupStatus-BIGAzyB1.mjs';
import { u as useShopStore } from './shop-DqJLBw0V.mjs';
import { I as useRouter, n as navigateTo } from './server.mjs';
import { computed } from 'vue';

const setupStepOrder = ["shop", "machines", "papers", "pricing", "finishing", "products"];
const setupStepDefinitions = [
  { key: "shop", label: "Shop", description: "Create and review the shop workspace.", icon: "i-lucide-store" },
  { key: "machines", label: "Machines", description: "Add the presses and equipment you actually run.", icon: "i-lucide-printer" },
  { key: "papers", label: "Papers", description: "Add paper stock once at least one machine exists.", icon: "i-lucide-file-stack" },
  { key: "pricing", label: "Pricing", description: "Add printing and material pricing after paper exists.", icon: "i-lucide-banknote" },
  { key: "finishing", label: "Finishing", description: "Add finishing services after pricing is in place.", icon: "i-lucide-scissors" },
  { key: "products", label: "Products", description: "Create products after the core production setup exists.", icon: "i-lucide-package" }
];
const setupStepDependencies = {
  shop: [],
  machines: ["shop"],
  papers: ["shop", "machines"],
  pricing: ["shop", "machines", "papers"],
  finishing: ["shop", "machines", "papers", "pricing"],
  products: ["shop", "machines", "papers", "pricing"]
};
function buildSetupStepRoute(step, shopSlug) {
  switch (step) {
    case "shop":
      return shopSlug ? `/dashboard/shops/${shopSlug}` : "/dashboard/shops/create";
    case "machines":
      return shopSlug ? `/dashboard/shops/${shopSlug}/machines` : "/dashboard/shops/create";
    case "papers":
      return shopSlug ? `/dashboard/shops/${shopSlug}/papers` : "/dashboard/shops/create";
    case "pricing":
      return shopSlug ? `/dashboard/shops/${shopSlug}/pricing` : "/dashboard/shops/create";
    case "finishing":
      return shopSlug ? `/dashboard/shops/${shopSlug}/finishing` : "/dashboard/shops/create";
    case "products":
      return shopSlug ? `/dashboard/shops/${shopSlug}/products` : "/dashboard/shops/create";
  }
}
function getSetupCounts(status) {
  return {
    shop: status?.has_shop ? 1 : 0,
    machines: status?.has_machines ? 1 : 0,
    papers: status?.has_papers ? 1 : 0,
    pricing: status?.has_pricing ? 1 : 0,
    finishing: status?.has_finishing ? 1 : 0,
    products: status?.has_products ? 1 : 0
  };
}
function getSetupReadiness(status) {
  const counts = getSetupCounts(status);
  return {
    shop: counts.shop > 0,
    machines: counts.machines > 0,
    papers: counts.papers > 0,
    pricing: counts.pricing > 0,
    finishing: counts.finishing > 0,
    products: counts.products > 0
  };
}
function firstMissingDependency(step, readiness) {
  return setupStepDependencies[step].find((dep) => !readiness[dep]) ?? null;
}
function canAccessSetupStep(step, readiness) {
  return firstMissingDependency(step, readiness) === null;
}
function firstIncompletePriorStep(step, readiness) {
  const stepIndex = setupStepOrder.indexOf(step);
  for (let index = 0; index < stepIndex; index += 1) {
    const candidate = setupStepOrder[index];
    if (!candidate) continue;
    if (!readiness[candidate]) {
      return candidate;
    }
  }
  return null;
}
function getNextRequiredSetupStep(readiness) {
  return setupStepOrder.find((step) => !readiness[step]) ?? null;
}
function blockedHelper(orderBlocker, missingDependency) {
  const blocker = orderBlocker ?? missingDependency;
  if (!blocker) return "Complete the current setup step first.";
  return `Complete ${setupStepDefinitions.find((item) => item.key === blocker)?.label ?? blocker} first.`;
}
function blockedCtaLabel(orderBlocker, missingDependency) {
  const blocker = orderBlocker ?? missingDependency;
  if (!blocker) return "Open step";
  return `Go to ${setupStepDefinitions.find((item) => item.key === blocker)?.label ?? blocker}`;
}
function getSetupRedirectMessage(step, missingDependency) {
  const labels = Object.fromEntries(setupStepDefinitions.map((item) => [item.key, item.label.toLowerCase()]));
  if (step === "machines" && missingDependency === "shop") {
    return {
      title: "Complete setup first",
      description: "Create or open the shop workspace before adding machines."
    };
  }
  return {
    title: "Complete setup first",
    description: `Add ${labels[missingDependency]} first before continuing to ${labels[step]}.`
  };
}
function resolveSetupFlow(status, shopSlug) {
  const counts = getSetupCounts(status);
  const readiness = getSetupReadiness(status);
  const nextRequiredStep = getNextRequiredSetupStep(readiness);
  const steps = setupStepDefinitions.map((definition) => {
    const missingDependency = firstMissingDependency(definition.key, readiness);
    const orderBlocker = firstIncompletePriorStep(definition.key, readiness);
    const done = readiness[definition.key];
    const route = buildSetupStepRoute(definition.key, shopSlug);
    if (done) {
      return {
        ...definition,
        count: counts[definition.key],
        done,
        accessible: true,
        state: "complete",
        route,
        ctaTo: route,
        ctaLabel: "Review",
        helper: definition.key === "shop" ? "Shop workspace is ready." : "Existing setup found.",
        missingDependency,
        orderBlocker
      };
    }
    if (nextRequiredStep === definition.key) {
      return {
        ...definition,
        count: counts[definition.key],
        done,
        accessible: canAccessSetupStep(definition.key, readiness),
        state: "current",
        route,
        ctaTo: route,
        ctaLabel: "Complete now",
        helper: "Next required step.",
        missingDependency,
        orderBlocker
      };
    }
    const blocker = orderBlocker ?? missingDependency;
    return {
      ...definition,
      count: counts[definition.key],
      done,
      accessible: canAccessSetupStep(definition.key, readiness),
      state: "blocked",
      route,
      ctaTo: blocker ? buildSetupStepRoute(blocker, shopSlug) : route,
      ctaLabel: blockedCtaLabel(orderBlocker, missingDependency),
      helper: blockedHelper(orderBlocker, missingDependency),
      missingDependency,
      orderBlocker
    };
  });
  const completedCount = steps.filter((step) => step.done).length;
  const progressPercent = Math.round(completedCount / steps.length * 100);
  return {
    counts,
    readiness,
    steps,
    nextRequiredStep,
    nextRequiredRoute: nextRequiredStep ? buildSetupStepRoute(nextRequiredStep, shopSlug) : shopSlug ? `/dashboard/shops/${shopSlug}` : "/dashboard",
    completedCount,
    progressPercent
  };
}
function useSetupStatus() {
  const setupStore = useSetupStatusStore();
  const shopStore = useShopStore();
  const router = useRouter();
  const { status, loading, loaded, error } = storeToRefs(setupStore);
  const resolvedShopSlug = computed(() => shopStore.selectedShopSlug ?? null);
  const flow = computed(() => resolveSetupFlow(status.value, resolvedShopSlug.value));
  const isSetupComplete = computed(() => flow.value.nextRequiredStep === null);
  const nextRoute = computed(() => flow.value.nextRequiredRoute || status.value?.next_url || "/dashboard");
  async function refresh(shopSlug) {
    const targetShop = shopSlug ?? shopStore.selectedShopSlug ?? null;
    return await setupStore.fetchStatus(targetShop);
  }
  async function refreshAndNavigate(options) {
    const targetShop = options?.shopSlug ?? shopStore.selectedShopSlug ?? null;
    const currentPath = router.currentRoute.value.path;
    const latest = await refresh(targetShop);
    const target = latest?.next_url || options?.fallbackUrl || "/dashboard";
    if (options?.onlyWhenNextUrlChanges && currentPath === target) return latest;
    if (currentPath !== target) {
      await navigateTo(target, { replace: options?.replace ?? true });
    }
    return latest;
  }
  return {
    status,
    loading,
    loaded,
    error,
    flow,
    isSetupComplete,
    nextRoute,
    refresh,
    refreshAndNavigate
  };
}

export { getSetupRedirectMessage as a, firstMissingDependency as f, getSetupReadiness as g, resolveSetupFlow as r, useSetupStatus as u };
//# sourceMappingURL=useSetupStatus-BlqBMF6r.mjs.map
