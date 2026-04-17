<template>
  <section id="shops" class="relative left-1/2 w-screen max-w-none -translate-x-1/2 scroll-mt-28 overflow-hidden border-y border-white/8 bg-[#09111d] py-10 text-white sm:py-14">
    <div class="pointer-events-none absolute inset-0">
      <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,17,31,0.94)_0%,rgba(10,17,30,0.98)_100%)]" />
      <div class="absolute left-[8%] top-0 h-[18rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(247,91,28,0.12)_0%,rgba(247,91,28,0.04)_38%,transparent_72%)] blur-3xl" />
      <div class="absolute right-[10%] bottom-[-5rem] h-[20rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(113,78,52,0.16)_0%,rgba(113,78,52,0.05)_40%,transparent_74%)] blur-3xl" />
    </div>

    <div class="relative mx-auto max-w-[96rem] px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-[90rem]">
        <div class="max-w-3xl">
          <p class="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-flamingo-400/90">
            Shops
          </p>
          <div class="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div class="max-w-2xl">
              <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Compare nearby print shops
              </h2>
              <p class="mt-3 text-sm leading-7 text-slate-300 sm:text-[0.97rem]">
                Search by product, area, or shop name, then move straight into a provider that already fits the work you need to send.
              </p>
            </div>
            <div class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-200">
              <UIcon name="i-lucide-search-check" class="h-3.5 w-3.5 text-flamingo-300" />
              Live shop discovery
            </div>
          </div>
        </div>

        <form
          class="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-3 shadow-[0_24px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl"
          @submit.prevent="applyFilters"
        >
          <div class="grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_minmax(15rem,0.9fr)_minmax(15rem,0.9fr)_auto]">
            <label class="group flex min-h-16 items-center gap-3 rounded-[1.35rem] border border-white/8 bg-[#0e1727]/92 px-4 transition-colors focus-within:border-flamingo-400/55">
              <UIcon name="i-lucide-search" class="h-5 w-5 text-slate-400 transition-colors group-focus-within:text-flamingo-400" />
              <div class="min-w-0 flex-1">
                <span class="block text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-slate-500">Shop or product</span>
                <input
                  v-model="pendingSearch"
                  type="text"
                  placeholder="Business cards, banners, Print Hub Westlands"
                  class="mt-1 w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                >
              </div>
            </label>

            <label class="group flex min-h-16 items-center gap-3 rounded-[1.35rem] border border-white/8 bg-[#0e1727]/92 px-4 transition-colors focus-within:border-flamingo-400/55">
              <UIcon name="i-lucide-package-2" class="h-5 w-5 text-slate-400 transition-colors group-focus-within:text-flamingo-400" />
              <div class="min-w-0 flex-1">
                <span class="block text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-slate-500">Product type</span>
                <select v-model="pendingCategory" class="mt-1 w-full bg-transparent text-sm text-white outline-none">
                  <option v-for="option in categoryOptions" :key="option.value" :value="option.value" class="bg-slate-950 text-white">
                    {{ option.label }}
                  </option>
                </select>
              </div>
            </label>

            <label class="group flex min-h-16 items-center gap-3 rounded-[1.35rem] border border-white/8 bg-[#0e1727]/92 px-4 transition-colors focus-within:border-flamingo-400/55">
              <UIcon name="i-lucide-map-pinned" class="h-5 w-5 text-slate-400 transition-colors group-focus-within:text-flamingo-400" />
              <div class="min-w-0 flex-1">
                <span class="block text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-slate-500">Location</span>
                <select v-model="pendingLocation" class="mt-1 w-full bg-transparent text-sm text-white outline-none">
                  <option v-for="option in locationOptions" :key="option.value" :value="option.value" class="bg-slate-950 text-white">
                    {{ option.label }}
                  </option>
                </select>
              </div>
            </label>

            <button
              type="submit"
              class="inline-flex min-h-16 items-center justify-center rounded-[1.35rem] bg-flamingo-500 px-6 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(247,91,28,0.24)] transition-all hover:bg-flamingo-400 hover:shadow-[0_20px_48px_rgba(247,91,28,0.32)]"
            >
              Find shops
            </button>
          </div>

          <div class="mt-3 flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-medium transition-colors"
              :class="verifiedOnly ? 'border-flamingo-400/45 bg-flamingo-500/12 text-flamingo-100' : 'border-white/10 bg-white/[0.05] text-slate-300 hover:border-flamingo-400/35 hover:text-white'"
              @click="verifiedOnly = !verifiedOnly"
            >
              <span class="h-2 w-2 rounded-full" :class="verifiedOnly ? 'bg-flamingo-400' : 'bg-slate-500'" />
              Verified only
            </button>

            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-medium transition-colors"
              :class="configurableOnly ? 'border-flamingo-400/45 bg-flamingo-500/12 text-flamingo-100' : 'border-white/10 bg-white/[0.05] text-slate-300 hover:border-flamingo-400/35 hover:text-white'"
              @click="configurableOnly = !configurableOnly"
            >
              <span class="h-2 w-2 rounded-full" :class="configurableOnly ? 'bg-flamingo-400' : 'bg-slate-500'" />
              Configurable quotes only
            </button>

            <p class="ml-auto text-xs font-medium text-slate-400">
              {{ filteredShops.length }} shop{{ filteredShops.length === 1 ? '' : 's' }} ready to explore
            </p>
          </div>
        </form>

        <div class="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_24rem]">
          <div v-if="filteredShops.length" class="grid gap-4 md:grid-cols-2">
            <article
              v-for="shop in filteredShops.slice(0, 6)"
              :key="shop.id"
              class="group rounded-[1.8rem] border border-white/10 bg-[#0d1625] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.22)] transition-all hover:-translate-y-0.5 hover:border-flamingo-400/35"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <p class="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-flamingo-400/90">
                    {{ shop.google_place_id ? 'Verified discovery' : 'Marketplace shop' }}
                  </p>
                  <h3 class="mt-1 truncate text-lg font-bold text-white">{{ shop.name }}</h3>
                  <p class="mt-2 line-clamp-2 text-sm leading-6 text-slate-300">
                    {{ shop.descriptionText }}
                  </p>
                </div>
                <button
                  type="button"
                  class="mt-1 inline-flex h-3.5 w-3.5 shrink-0 rounded-full"
                  :class="shop.id === selectedShopId ? 'bg-flamingo-500 shadow-[0_0_0_6px_rgba(247,91,28,0.18),0_0_18px_rgba(247,91,28,0.4)]' : 'bg-slate-500 shadow-[0_0_0_5px_rgba(148,163,184,0.14)]'"
                  @click="selectedShopId = shop.id"
                />
              </div>

              <div class="mt-4 flex flex-wrap gap-2">
                <span
                  v-for="tag in shop.tags.slice(0, 3)"
                  :key="tag"
                  class="rounded-full border border-white/8 bg-white/[0.05] px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-slate-300"
                >
                  {{ tag }}
                </span>
              </div>

              <div class="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-3">
                <div class="text-xs font-medium text-slate-400">
                  {{ shop.secondaryLine }}
                </div>
                <NuxtLink
                  :to="`/shops/${shop.slug}`"
                  class="inline-flex items-center justify-center rounded-xl bg-flamingo-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-flamingo-400"
                >
                  Open shop
                </NuxtLink>
              </div>
            </article>
          </div>

          <div
            v-else
            class="rounded-[2rem] border border-white/10 bg-[#0d1625] p-8 text-center text-slate-300 shadow-[0_30px_80px_rgba(0,0,0,0.22)] lg:col-span-2"
          >
            <p class="text-lg font-semibold text-white">No shops match those filters yet.</p>
            <p class="mt-2 text-sm leading-6 text-slate-400">Try a broader product search or open the full shop directory.</p>
            <NuxtLink
              to="/shops"
              class="mt-5 inline-flex items-center justify-center rounded-xl bg-flamingo-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-flamingo-400"
            >
              Browse all shops
            </NuxtLink>
          </div>

          <aside v-if="selectedShop" class="rounded-[2rem] border border-white/10 bg-[#0d1625] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.22)]">
            <p class="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-flamingo-400/90">
              Selected shop
            </p>
            <h3 class="mt-2 text-2xl font-bold text-white">{{ selectedShop.name }}</h3>
            <p class="mt-3 text-sm leading-7 text-slate-300">{{ selectedShop.descriptionText }}</p>

            <div class="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div class="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Location</p>
                <p class="mt-2 text-sm font-semibold text-white">{{ selectedShop.secondaryLine }}</p>
              </div>
              <div class="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Best fit</p>
                <p class="mt-2 text-sm font-semibold text-white">{{ selectedShop.tags.slice(0, 2).join(' / ') || 'General print work' }}</p>
              </div>
            </div>

            <div class="mt-5 flex flex-wrap gap-2">
              <span
                v-for="tag in selectedShop.tags"
                :key="tag"
                class="rounded-full border border-white/8 bg-white/[0.05] px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-slate-300"
              >
                {{ tag }}
              </span>
            </div>

            <NuxtLink
              :to="`/shops/${selectedShop.slug}`"
              class="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-white text-sm font-semibold text-slate-950 px-4 py-3 transition-colors hover:bg-slate-200"
            >
              View full shop profile
            </NuxtLink>
          </aside>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Product, ShopPublic } from '~/shared/types'
import { getAllProducts } from '~/shared/api/gallery'
import { listShops } from '~/services/public'
import { isProductPublic } from '~/utils/product'

type DiscoveryShop = ShopPublic & {
  tags: string[]
  searchText: string
  descriptionText: string
  secondaryLine: string
  categories: string[]
  hasConfigurableQuotes: boolean
}

const searchQuery = ref('')
const categoryFilter = ref('all')
const locationFilter = ref('all')
const pendingSearch = ref('')
const pendingCategory = ref('all')
const pendingLocation = ref('all')
const verifiedOnly = ref(false)
const configurableOnly = ref(false)
const selectedShopId = ref<number | null>(null)
const shops = ref<ShopPublic[]>([])
const products = ref<Product[]>([])

const productsByShop = computed<Record<string, Product[]>>(() => {
  return products.value.reduce<Record<string, Product[]>>((acc, product) => {
    const slug = product.shop?.slug
    if (!slug) return acc
    acc[slug] ||= []
    acc[slug].push(product)
    return acc
  }, {})
})

const discoveryShops = computed<DiscoveryShop[]>(() => {
  return shops.value.map((shop) => {
    const shopProducts = productsByShop.value[shop.slug] ?? []
    const categories = [...new Set(shopProducts.map((product) => productCategory(product)).filter(Boolean))]
    const tags = buildTags(shopProducts)
    const locationLabel = [shop.city, shop.state].filter(Boolean).join(', ')

    return {
      ...shop,
      tags,
      categories,
      hasConfigurableQuotes: shopProducts.length > 0,
      descriptionText: shop.description?.trim() || fallbackDescription(shopProducts),
      secondaryLine: locationLabel || 'Print shop',
      searchText: [
        shop.name,
        shop.slug,
        shop.description ?? '',
        locationLabel,
        ...shopProducts.map((product) => `${product.name} ${productCategory(product)} ${product.pricing_mode}`),
        ...categories,
        ...tags,
      ].join(' ').toLowerCase(),
    }
  })
})

const categoryOptions = computed(() => {
  const categories = new Set<string>()
  for (const shop of discoveryShops.value) {
    for (const category of shop.categories) categories.add(category)
  }
  return [
    { value: 'all', label: 'All products' },
    ...[...categories].sort((a, b) => a.localeCompare(b)).map((category) => ({ value: category, label: category })),
  ]
})

const locationOptions = computed(() => {
  const locations = new Set<string>()
  for (const shop of discoveryShops.value) {
    const label = [shop.city, shop.state].filter(Boolean).join(', ')
    if (label) locations.add(label)
  }
  return [
    { value: 'all', label: 'All locations' },
    ...[...locations].sort((a, b) => a.localeCompare(b)).map((location) => ({ value: location, label: location })),
  ]
})

const filteredShops = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  return discoveryShops.value.filter((shop) => {
    const matchesSearch = !query || shop.searchText.includes(query)
    const matchesCategory = categoryFilter.value === 'all' || shop.categories.includes(categoryFilter.value)
    const locationLabel = [shop.city, shop.state].filter(Boolean).join(', ')
    const matchesLocation = locationFilter.value === 'all' || locationLabel === locationFilter.value
    const matchesVerified = !verifiedOnly.value || Boolean(shop.google_place_id)
    const matchesConfigurable = !configurableOnly.value || shop.hasConfigurableQuotes
    return matchesSearch && matchesCategory && matchesLocation && matchesVerified && matchesConfigurable
  })
})

const selectedShop = computed(() => {
  const current = filteredShops.value.find((shop) => shop.id === selectedShopId.value)
  return current ?? filteredShops.value[0] ?? null
})

function productCategory(product: Product) {
  const category = product.category
  if (typeof category === 'string') return category
  if (category && typeof category === 'object') {
    const namedCategory = category as { name?: unknown }
    if (typeof namedCategory.name === 'string') return namedCategory.name
  }
  return ''
}

function buildTags(shopProducts: Product[]) {
  const tags: string[] = []
  for (const product of shopProducts) {
    const category = productCategory(product)
    if (category) tags.push(category)
    if (product.pricing_mode === 'LARGE_FORMAT') tags.push('Large format')
    if (product.pricing_mode === 'SHEET') tags.push('Digital print')
    if (tags.length >= 6) break
  }
  return [...new Set(tags)].slice(0, 4)
}

function fallbackDescription(shopProducts: Product[]) {
  if (!shopProducts.length) return 'Browse this shop for real print work, quick comparisons, and direct quote follow-up.'
  const names = shopProducts.slice(0, 2).map((product) => product.name).join(', ')
  return `Strong fit for ${names}${shopProducts.length > 2 ? ' and other configured jobs' : ''}.`
}

function applyFilters() {
  searchQuery.value = pendingSearch.value
  categoryFilter.value = pendingCategory.value
  locationFilter.value = pendingLocation.value
  if (filteredShops.value[0]) selectedShopId.value = filteredShops.value[0].id
}

onMounted(async () => {
  const [shopList, productList] = await Promise.all([
    listShops(),
    getAllProducts(),
  ])

  shops.value = shopList
  products.value = productList.filter(isProductPublic)
  pendingSearch.value = searchQuery.value
  pendingCategory.value = categoryFilter.value
  pendingLocation.value = locationFilter.value
  if (discoveryShops.value[0]) selectedShopId.value = discoveryShops.value[0].id
})

watch(filteredShops, (next) => {
  if (!next.length) {
    selectedShopId.value = null
    return
  }
  if (!next.find((shop) => shop.id === selectedShopId.value)) {
    selectedShopId.value = next[0]?.id ?? null
  }
}, { deep: true })
</script>
