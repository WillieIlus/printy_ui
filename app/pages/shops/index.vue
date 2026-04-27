<template>
  <section class="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
    <div class="space-y-8">
      <div class="grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(18rem,0.85fr)]">
        <BaseCard class="space-y-5">
          <BaseBadge tone="primary">Public print shops</BaseBadge>
          <div class="space-y-3">
            <h1 class="max-w-3xl text-4xl font-semibold tracking-tight text-[var(--p-text)] md:text-5xl">
              Quote-ready print shops, not just a directory.
            </h1>
            <p class="max-w-3xl text-sm leading-6 text-[var(--p-text-muted)] md:text-base">
              Browse shops with visible rate-card readiness, finishing setup, materials, and real request pathways before you send a job.
            </p>
          </div>
          <div class="grid gap-3 sm:grid-cols-3">
            <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-bg-soft)] p-4">
              <p class="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--p-text-muted)]">Live shops</p>
              <p class="mt-2 text-2xl font-semibold text-[var(--p-text)]">{{ sortedShops.length }}</p>
            </div>
            <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-bg-soft)] p-4">
              <p class="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--p-text-muted)]">Can price requests</p>
              <p class="mt-2 text-2xl font-semibold text-[var(--p-text)]">{{ readyToPriceCount }}</p>
            </div>
            <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-bg-soft)] p-4">
              <p class="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--p-text-muted)]">Finishing visible</p>
              <p class="mt-2 text-2xl font-semibold text-[var(--p-text)]">{{ finishingVisibleCount }}</p>
            </div>
          </div>
        </BaseCard>

        <BaseCard tone="soft" class="space-y-4">
          <p class="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--p-primary)]">What you can verify here</p>
          <div class="space-y-3 text-sm leading-6 text-[var(--p-text-muted)]">
            <p>Rate-card completeness and whether the shop can price requests automatically.</p>
            <p>Capabilities, materials, and finishing pulled from the shop&apos;s actual setup.</p>
            <p>Public-facing request path into Printy&apos;s quote flow instead of a dead contact card.</p>
          </div>
        </BaseCard>
      </div>

      <div v-if="pending" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <BaseCard v-for="index in 6" :key="index" class="space-y-4">
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="size-14 animate-pulse rounded-2xl bg-[var(--p-bg-soft)]" />
              <div class="space-y-2">
                <div class="h-4 w-40 animate-pulse rounded bg-[var(--p-bg-soft)]" />
                <div class="h-3 w-24 animate-pulse rounded bg-[var(--p-bg-soft)]" />
              </div>
            </div>
            <div class="h-6 w-24 animate-pulse rounded-full bg-[var(--p-bg-soft)]" />
          </div>
          <div class="h-14 animate-pulse rounded-2xl bg-[var(--p-bg-soft)]" />
          <div class="grid grid-cols-2 gap-3">
            <div class="h-20 animate-pulse rounded-2xl bg-[var(--p-bg-soft)]" />
            <div class="h-20 animate-pulse rounded-2xl bg-[var(--p-bg-soft)]" />
          </div>
        </BaseCard>
      </div>

      <div v-else-if="error" class="rounded-[2rem] border border-[var(--p-error)]/30 bg-[var(--p-error-soft)] px-6 py-10 text-sm text-[var(--p-text)]">
        We could not load public shops right now.
      </div>

      <div v-else-if="!sortedShops.length" class="rounded-[2rem] border border-dashed border-[var(--p-border)] bg-[var(--p-bg-soft)] px-6 py-12 text-center">
        <h2 class="text-2xl font-semibold text-[var(--p-text)]">No public shops yet</h2>
        <p class="mt-3 text-sm text-[var(--p-text-muted)]">Shops will appear here after they publish their public profile.</p>
      </div>

      <div v-else class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <BaseCard
          v-for="shop in sortedShops"
          :key="shop.id ?? shop.slug ?? shop.name"
          class="flex h-full flex-col gap-5"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="flex min-w-0 items-center gap-3">
              <div v-if="shopLogo(shop)" class="size-14 overflow-hidden rounded-2xl border border-[var(--p-border)] bg-white">
                <img :src="shopLogo(shop) ?? undefined" :alt="shop.name || 'Shop logo'" class="h-full w-full object-cover" />
              </div>
              <div v-else class="flex size-14 items-center justify-center rounded-2xl bg-[var(--p-primary-soft)] text-lg font-semibold text-[var(--p-primary)]">
                {{ initials(shop.name) }}
              </div>
              <div class="min-w-0">
                <h2 class="truncate text-xl font-semibold text-[var(--p-text)]">{{ shop.name || 'Print shop' }}</h2>
                <p class="mt-1 flex items-center gap-1 text-sm text-[var(--p-text-muted)]">
                  <Icon name="lucide:map-pin" class="size-3.5" />
                  <span class="truncate">{{ shop.location_label || 'Kenya' }}</span>
                </p>
              </div>
            </div>
            <BaseBadge :tone="readinessTone(shop)">{{ readinessLabel(shop) }}</BaseBadge>
          </div>

          <p class="min-h-12 text-sm leading-6 text-[var(--p-text-muted)]">
            {{ shop.description || fallbackSummary(shop) }}
          </p>

          <div class="grid grid-cols-2 gap-3">
            <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-bg-soft)] p-4">
              <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--p-text-muted)]">Rate-card ready</p>
              <p class="mt-2 text-xl font-semibold text-[var(--p-text)]">{{ percent(shop.rate_card_completeness) }}</p>
              <p class="mt-1 text-xs text-[var(--p-text-muted)]">
                {{ shop.can_price_requests ? 'Can price requests' : 'Needs more pricing setup' }}
              </p>
            </div>
            <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-bg-soft)] p-4">
              <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--p-text-muted)]">Turnaround</p>
              <p class="mt-2 text-sm font-semibold text-[var(--p-text)]">{{ shop.turnaround_label || 'On request' }}</p>
              <p class="mt-1 text-xs text-[var(--p-text-muted)]">{{ shop.schedule_summary || statusSummary(shop.status) }}</p>
            </div>
          </div>

          <div class="grid gap-3 sm:grid-cols-3">
            <div class="rounded-2xl border border-[var(--p-border)] px-3 py-3">
              <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--p-text-muted)]">Products</p>
              <p class="mt-1 text-lg font-semibold text-[var(--p-text)]">{{ shop.products_count ?? 0 }}</p>
            </div>
            <div class="rounded-2xl border border-[var(--p-border)] px-3 py-3">
              <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--p-text-muted)]">Materials</p>
              <p class="mt-1 text-lg font-semibold text-[var(--p-text)]">{{ shop.materials_count ?? 0 }}</p>
            </div>
            <div class="rounded-2xl border border-[var(--p-border)] px-3 py-3">
              <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--p-text-muted)]">Finishing</p>
              <p class="mt-1 text-lg font-semibold text-[var(--p-text)]">{{ shop.finishing_rates_count ?? 0 }}</p>
            </div>
          </div>

          <div class="space-y-3">
            <div v-if="shop.capability_tags?.length" class="space-y-2">
              <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--p-text-muted)]">Capabilities</p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in shop.capability_tags.slice(0, 4)"
                  :key="tag"
                  class="rounded-full border border-[var(--p-border)] bg-[var(--p-bg-soft)] px-3 py-1 text-xs font-medium text-[var(--p-text)]"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
            <div v-if="shop.finishing_tags?.length" class="space-y-2">
              <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--p-text-muted)]">Finishing</p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in shop.finishing_tags.slice(0, 4)"
                  :key="tag"
                  class="rounded-full border border-[var(--p-border)] bg-[var(--p-bg-soft)] px-3 py-1 text-xs font-medium text-[var(--p-text)]"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>

          <div class="mt-auto flex flex-col gap-2 pt-2">
            <BaseButton :to="`/shops/${shop.slug}`" variant="primary" block>
              View shop details
            </BaseButton>
            <BaseButton :to="requestRoute(shop.slug)" variant="outline" block>
              Start a request
            </BaseButton>
          </div>
        </BaseCard>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ShopPublic } from '~/shared/types'
import { listShops } from '~/services/public'
import { useMediaUrl } from '~/utils/media'
import BaseBadge from '~/components/ui/BaseBadge.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseCard from '~/components/ui/BaseCard.vue'

const mediaUrl = useMediaUrl()

const { data, pending, error } = await useAsyncData('public-shops-index', () => listShops())

const sortedShops = computed<ShopPublic[]>(() =>
  [...(data.value ?? [])].sort((a, b) => {
    const aScore = Number(a.can_price_requests) * 100 + Number(a.can_receive_requests) * 50 + Number(a.rate_card_completeness ?? 0)
    const bScore = Number(b.can_price_requests) * 100 + Number(b.can_receive_requests) * 50 + Number(b.rate_card_completeness ?? 0)
    return bScore - aScore
  }),
)

const readyToPriceCount = computed(() => sortedShops.value.filter(shop => shop.can_price_requests).length)
const finishingVisibleCount = computed(() => sortedShops.value.filter(shop => (shop.finishing_rates_count ?? 0) > 0).length)

function shopLogo(shop: ShopPublic): string | null {
  return mediaUrl(shop.logo as string | null | undefined) ?? null
}

function initials(name?: string | null): string {
  return String(name || 'PS')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part.charAt(0).toUpperCase())
    .join('')
}

function readinessLabel(shop: ShopPublic): string {
  if (shop.can_price_requests) return 'Quote-ready'
  if (shop.can_receive_requests) return 'Request-ready'
  return 'Profile live'
}

function readinessTone(shop: ShopPublic): 'success' | 'info' | 'neutral' {
  if (shop.can_price_requests) return 'success'
  if (shop.can_receive_requests) return 'info'
  return 'neutral'
}

function percent(value?: number | null): string {
  return `${Math.max(0, Math.round(Number(value ?? 0)))}%`
}

function fallbackSummary(shop: ShopPublic): string {
  if (shop.can_price_requests) return 'This shop has visible materials, pricing rules, finishing setup, and a live request path.'
  if (shop.can_receive_requests) return 'This shop can receive requests publicly, but some pricing details still need confirmation.'
  return 'This public profile is visible, but the pricing setup is still in progress.'
}

function requestRoute(slug?: string | null) {
  return {
    path: '/',
    hash: '#calculator',
    query: slug ? { shop: slug } : {},
  }
}

function statusSummary(status?: string | null): string {
  if (status === 'opening') return 'Open now'
  if (status === 'closing_soon') return 'Closing soon'
  return 'Hours available on profile'
}
</script>
