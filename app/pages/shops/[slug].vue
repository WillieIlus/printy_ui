<template>
  <section class="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
    <div class="space-y-8">
      <div class="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.85fr)]">
        <BaseCard class="space-y-6">
          <div class="flex flex-wrap items-center gap-3">
            <BaseBadge :tone="readinessTone(shop)">{{ readinessLabel(shop) }}</BaseBadge>
            <BaseBadge tone="neutral">{{ statusLabel(shop.status) }}</BaseBadge>
            <BaseBadge v-if="ratingCount > 0" tone="secondary">
              {{ ratingText }}
            </BaseBadge>
          </div>

          <div class="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div class="flex items-start gap-4">
              <div v-if="shopLogo" class="size-20 overflow-hidden rounded-[1.5rem] border border-[var(--p-border)] bg-white">
                <img :src="shopLogo" :alt="shop.name || 'Shop logo'" class="h-full w-full object-cover" />
              </div>
              <div v-else class="flex size-20 items-center justify-center rounded-[1.5rem] bg-[var(--p-primary-soft)] text-2xl font-semibold text-[var(--p-primary)]">
                {{ initials(shop.name) }}
              </div>

              <div class="space-y-3">
                <div>
                  <h1 class="text-4xl font-semibold tracking-tight text-[var(--p-text)] md:text-5xl">{{ shop.name }}</h1>
                  <p class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--p-text-muted)]">
                    <span class="inline-flex items-center gap-1">
                      <Icon name="lucide:map-pin" class="size-3.5" />
                      {{ shop.location_label || 'Kenya' }}
                    </span>
                    <span class="inline-flex items-center gap-1">
                      <Icon name="lucide:clock-3" class="size-3.5" />
                      {{ shop.schedule_summary || 'Hours available on profile' }}
                    </span>
                  </p>
                </div>
                <p class="max-w-3xl text-sm leading-6 text-[var(--p-text-muted)]">
                  {{ shop.description || heroSummary }}
                </p>
              </div>
            </div>

            <div class="grid min-w-[13rem] gap-3 md:max-w-[15rem]">
              <BaseButton :to="requestRoute" variant="primary" block>
                Start request in calculator
              </BaseButton>
              <BaseButton v-if="products.length" to="#products" variant="outline" block>
                View products
              </BaseButton>
            </div>
          </div>

          <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-bg-soft)] p-4">
              <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--p-text-muted)]">Rate-card completeness</p>
              <p class="mt-2 text-2xl font-semibold text-[var(--p-text)]">{{ percent(shop.rate_card_completeness) }}</p>
              <p class="mt-1 text-xs text-[var(--p-text-muted)]">{{ readinessLabel(shop) }}</p>
            </div>
            <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-bg-soft)] p-4">
              <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--p-text-muted)]">Turnaround</p>
              <p class="mt-2 text-sm font-semibold text-[var(--p-text)]">{{ shop.turnaround_label || 'On request' }}</p>
              <p class="mt-1 text-xs text-[var(--p-text-muted)]">
                {{ shop.turnaround_configured ? 'Turnaround is configured on active products' : 'Turnaround still needs confirmation' }}
              </p>
            </div>
            <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-bg-soft)] p-4">
              <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--p-text-muted)]">Materials</p>
              <p class="mt-2 text-2xl font-semibold text-[var(--p-text)]">{{ shop.materials_count ?? 0 }}</p>
              <p class="mt-1 text-xs text-[var(--p-text-muted)]">Visible paper stocks or large-format materials</p>
            </div>
            <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-bg-soft)] p-4">
              <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--p-text-muted)]">Finishing</p>
              <p class="mt-2 text-2xl font-semibold text-[var(--p-text)]">{{ shop.finishing_rates_count ?? 0 }}</p>
              <p class="mt-1 text-xs text-[var(--p-text-muted)]">Customer-facing finishing rules exposed publicly</p>
            </div>
          </div>
        </BaseCard>

        <BaseCard tone="soft" class="space-y-4">
          <p class="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--p-primary)]">Request path</p>
          <div class="space-y-3 text-sm leading-6 text-[var(--p-text-muted)]">
            <p v-if="shop.can_price_requests">
              This shop has enough live setup for Printy to attach pricing context before you send the request.
            </p>
            <p v-else-if="shop.can_receive_requests">
              This shop can receive public requests, but some specs may still need manual confirmation.
            </p>
            <p v-else>
              This public profile is visible, but request readiness is still limited.
            </p>
            <p>The request button opens the Printy calculator flow so the shop receives structured specs instead of a plain message.</p>
          </div>
          <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-4">
            <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--p-text-muted)]">Request modes</p>
            <div class="mt-3 flex flex-wrap gap-2">
              <BaseBadge :tone="shop.supports_custom_requests ? 'success' : 'neutral'">Custom jobs</BaseBadge>
              <BaseBadge :tone="shop.supports_catalog_requests ? 'success' : 'neutral'">Catalog jobs</BaseBadge>
              <BaseBadge :tone="shop.can_price_requests ? 'success' : 'warning'">Automatic pricing</BaseBadge>
            </div>
          </div>
        </BaseCard>
      </div>

      <div class="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <BaseCard class="space-y-6">
          <div class="space-y-2">
            <p class="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--p-primary)]">Visible capabilities</p>
            <h2 class="text-2xl font-semibold text-[var(--p-text)]">What this shop is set up to show publicly</h2>
          </div>

          <div class="grid gap-5 md:grid-cols-3">
            <div class="space-y-3">
              <h3 class="text-sm font-semibold text-[var(--p-text)]">Capabilities</h3>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in shop.capability_tags?.length ? shop.capability_tags : ['No public capabilities yet']"
                  :key="tag"
                  class="rounded-full border border-[var(--p-border)] bg-[var(--p-bg-soft)] px-3 py-1.5 text-xs font-medium text-[var(--p-text)]"
                >
                  {{ tag }}
                </span>
              </div>
            </div>

            <div class="space-y-3">
              <h3 class="text-sm font-semibold text-[var(--p-text)]">Materials</h3>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in shop.material_tags?.length ? shop.material_tags : ['No public material tags yet']"
                  :key="tag"
                  class="rounded-full border border-[var(--p-border)] bg-[var(--p-bg-soft)] px-3 py-1.5 text-xs font-medium text-[var(--p-text)]"
                >
                  {{ tag }}
                </span>
              </div>
            </div>

            <div class="space-y-3">
              <h3 class="text-sm font-semibold text-[var(--p-text)]">Finishing</h3>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in shop.finishing_tags?.length ? shop.finishing_tags : ['No public finishing tags yet']"
                  :key="tag"
                  class="rounded-full border border-[var(--p-border)] bg-[var(--p-bg-soft)] px-3 py-1.5 text-xs font-medium text-[var(--p-text)]"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </BaseCard>

        <BaseCard class="space-y-5">
          <div class="space-y-2">
            <p class="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--p-primary)]">Public setup proof</p>
            <h2 class="text-2xl font-semibold text-[var(--p-text)]">Real setup signals</h2>
          </div>
          <div class="grid gap-3 sm:grid-cols-2">
            <div class="rounded-2xl border border-[var(--p-border)] p-4">
              <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--p-text-muted)]">Pricing rules</p>
              <p class="mt-1 text-2xl font-semibold text-[var(--p-text)]">{{ shop.pricing_rules_count ?? 0 }}</p>
            </div>
            <div class="rounded-2xl border border-[var(--p-border)] p-4">
              <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--p-text-muted)]">Products</p>
              <p class="mt-1 text-2xl font-semibold text-[var(--p-text)]">{{ products.length }}</p>
            </div>
          </div>
          <p class="text-sm leading-6 text-[var(--p-text-muted)]">{{ heroSummary }}</p>
        </BaseCard>
      </div>

      <div class="grid gap-6 xl:grid-cols-3">
        <BaseCard class="space-y-4 xl:col-span-2">
          <div class="flex items-center justify-between gap-3">
            <div>
              <p class="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--p-primary)]">Rate-card samples</p>
              <h2 class="mt-2 text-2xl font-semibold text-[var(--p-text)]">Public production inputs</h2>
            </div>
            <BaseBadge tone="neutral">{{ rateCardSummary }}</BaseBadge>
          </div>

          <div class="grid gap-4 md:grid-cols-3">
            <div class="space-y-3 rounded-[1.5rem] border border-[var(--p-border)] p-4">
              <h3 class="text-sm font-semibold text-[var(--p-text)]">Paper</h3>
              <div v-if="papers.length" class="space-y-2 text-sm text-[var(--p-text-muted)]">
                <p v-for="paper in papers" :key="`${paper.sheet_size}-${paper.gsm}-${paper.paper_type}`">
                  {{ paper.sheet_size }} {{ paper.gsm }}gsm {{ paper.paper_type }}
                </p>
              </div>
              <p v-else class="text-sm text-[var(--p-text-muted)]">No public paper prices yet.</p>
            </div>

            <div class="space-y-3 rounded-[1.5rem] border border-[var(--p-border)] p-4">
              <h3 class="text-sm font-semibold text-[var(--p-text)]">Printing</h3>
              <div v-if="printing.length" class="space-y-2 text-sm text-[var(--p-text-muted)]">
                <p v-for="row in printing" :key="`${row.sheet_size}-${row.color_mode}`">
                  {{ row.sheet_size }} {{ row.color_mode }}
                </p>
              </div>
              <p v-else class="text-sm text-[var(--p-text-muted)]">No public printing rows yet.</p>
            </div>

            <div class="space-y-3 rounded-[1.5rem] border border-[var(--p-border)] p-4">
              <h3 class="text-sm font-semibold text-[var(--p-text)]">Finishing</h3>
              <div v-if="finishings.length" class="space-y-2 text-sm text-[var(--p-text-muted)]">
                <p v-for="finishing in finishings" :key="`${finishing.id}-${finishing.name}`">
                  {{ finishing.name }}
                </p>
              </div>
              <p v-else class="text-sm text-[var(--p-text-muted)]">No public finishing rates yet.</p>
            </div>
          </div>
        </BaseCard>

        <BaseCard tone="soft" class="space-y-4">
          <p class="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--p-primary)]">Before you request</p>
          <ul class="space-y-3 text-sm leading-6 text-[var(--p-text-muted)]">
            <li>Use the calculator when you need a structured quote request with quantity, size, finishing, and artwork notes.</li>
            <li v-if="shop.can_price_requests">This shop is configured for stronger automatic pricing previews.</li>
            <li v-else-if="shop.can_receive_requests">Expect some manual confirmation before final pricing.</li>
            <li v-else>This profile may still require direct follow-up while setup catches up.</li>
          </ul>
          <BaseButton :to="requestRoute" variant="primary" block>
            Open request flow
          </BaseButton>
        </BaseCard>
      </div>

      <BaseCard id="products" class="space-y-6">
        <div class="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p class="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--p-primary)]">Catalog visibility</p>
            <h2 class="mt-2 text-2xl font-semibold text-[var(--p-text)]">Public products</h2>
          </div>
          <p class="text-sm text-[var(--p-text-muted)]">{{ products.length }} active public product{{ products.length === 1 ? '' : 's' }}</p>
        </div>

        <div v-if="products.length" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <article
            v-for="product in products.slice(0, 6)"
            :key="product.id ?? product.slug ?? product.name"
            class="rounded-[1.5rem] border border-[var(--p-border)] bg-[var(--p-bg-soft)] p-4"
          >
            <div class="space-y-3">
              <div v-if="productImage(product)" class="aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-white">
                <img :src="productImage(product) ?? undefined" :alt="product.name || 'Product image'" class="h-full w-full object-cover" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-[var(--p-text)]">{{ product.name || product.title || 'Product' }}</h3>
                <p class="mt-1 text-sm text-[var(--p-text-muted)]">{{ product.category_name || categoryLabel(product.category) || 'General print product' }}</p>
              </div>
              <p class="line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-[var(--p-text-muted)]">
                {{ product.description || 'Public catalog product available from this shop.' }}
              </p>
              <BaseButton
                v-if="product.slug"
                :to="`/products/${product.slug}`"
                variant="outline"
                block
              >
                View product
              </BaseButton>
            </div>
          </article>
        </div>

        <div v-else class="rounded-[1.5rem] border border-dashed border-[var(--p-border)] bg-[var(--p-bg-soft)] px-6 py-10 text-center">
          <p class="text-sm text-[var(--p-text-muted)]">This shop has no public products listed yet.</p>
        </div>
      </BaseCard>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Product, ShopPublic } from '~/shared/types'
import { API } from '~/shared/api-paths'
import { getShop, getCatalog } from '~/services/public'
import { getRatingSummary } from '~/services/ratings'
import { usePublicApiNoAuth } from '~/shared/api'
import { useMediaUrl } from '~/utils/media'
import BaseBadge from '~/components/ui/BaseBadge.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseCard from '~/components/ui/BaseCard.vue'

type RateCardPaper = {
  gsm?: number | null
  paper_type?: string | null
  sheet_size?: string | null
}

type RateCardPrinting = {
  sheet_size?: string | null
  color_mode?: string | null
}

type RateCardFinishing = {
  id?: number | null
  name?: string | null
}

type PublicRateCardResponse = {
  paper?: RateCardPaper[]
  printing?: RateCardPrinting[]
  finishing?: RateCardFinishing[]
}

const route = useRoute()
const publicApi = usePublicApiNoAuth()
const mediaUrl = useMediaUrl()
const slug = String(route.params.slug || '')

const { data } = await useAsyncData(`public-shop-${slug}`, async () => {
  const [shop, catalog, rating, rateCard] = await Promise.all([
    getShop(slug),
    getCatalog(slug),
    getRatingSummary(slug),
    publicApi<PublicRateCardResponse>(API.shopRateCard(slug)).catch(() => null),
  ])

  if (!shop) {
    throw createError({ statusCode: 404, statusMessage: 'Shop not found' })
  }

  return {
    shop,
    products: catalog?.products ?? [],
    rating,
    rateCard,
  }
})

const shop = computed<ShopPublic>(() => data.value?.shop ?? {})
const products = computed<Product[]>(() => data.value?.products ?? [])
const ratingAverage = computed(() => Number(data.value?.rating?.average ?? 0))
const ratingCount = computed(() => Number(data.value?.rating?.count ?? 0))
const papers = computed(() => (data.value?.rateCard?.paper ?? []).slice(0, 5))
const printing = computed(() => (data.value?.rateCard?.printing ?? []).slice(0, 5))
const finishings = computed(() => (data.value?.rateCard?.finishing ?? []).slice(0, 5))

const shopLogo = computed(() => mediaUrl(shop.value.logo as string | null | undefined) ?? null)
const requestRoute = computed(() => ({
  path: '/',
  hash: '#calculator',
  query: slug ? { shop: slug } : {},
}))

const ratingText = computed(() => `${ratingAverage.value.toFixed(1)} stars • ${ratingCount.value} review${ratingCount.value === 1 ? '' : 's'}`)
const rateCardSummary = computed(() => {
  const parts = [
    papers.value.length ? `${papers.value.length} paper` : '',
    printing.value.length ? `${printing.value.length} print` : '',
    finishings.value.length ? `${finishings.value.length} finishing` : '',
  ].filter(Boolean)
  return parts.length ? parts.join(' • ') : 'No public rate-card rows yet'
})

const heroSummary = computed(() => {
  if (shop.value.can_price_requests) {
    return 'Printy can show this shop as quote-ready because the public profile, materials, pricing rules, and request path are all live.'
  }
  if (shop.value.can_receive_requests) {
    return 'This shop can receive public requests, but some pricing details still need confirmation before every job can be priced instantly.'
  }
  return 'This profile is public, but the shop still needs more setup before it can behave like a fully quote-ready Printy destination.'
})

function initials(name?: string | null): string {
  return String(name || 'PS')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part.charAt(0).toUpperCase())
    .join('')
}

function readinessLabel(shopValue: ShopPublic): string {
  if (shopValue.can_price_requests) return 'Quote-ready'
  if (shopValue.can_receive_requests) return 'Request-ready'
  return 'Profile live'
}

function readinessTone(shopValue: ShopPublic): 'success' | 'info' | 'neutral' {
  if (shopValue.can_price_requests) return 'success'
  if (shopValue.can_receive_requests) return 'info'
  return 'neutral'
}

function statusLabel(status?: string | null): string {
  if (status === 'opening') return 'Open now'
  if (status === 'closing_soon') return 'Closing soon'
  return 'Hours listed'
}

function percent(value?: number | null): string {
  return `${Math.max(0, Math.round(Number(value ?? 0)))}%`
}

function productImage(product: Product): string | null {
  return mediaUrl((product.primary_image as string | null | undefined) ?? null) ?? null
}

function categoryLabel(category: Product['category']): string | null {
  if (!category) return null
  if (typeof category === 'string') return category
  return category.name || category.title || category.slug || null
}
</script>
