<template>
  <div class="min-h-screen bg-[var(--p-surface)]">
    <main class="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
      <CommonLoadingSpinner v-if="isAuthenticated && quoteDraftStore.isLoading && !quoteDraftStore.activeDraft" />

      <template v-else-if="displayDraft">
        <section class="relative mb-10 overflow-hidden rounded-[2rem] bg-[var(--p-surface-container-low)] p-8 md:p-12">
          <div class="relative z-10 grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <span class="inline-flex rounded-full bg-[var(--p-primary-fixed)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--p-on-primary-fixed-variant,theme(colors.slate.700))]">
                Project Workspace
              </span>
              <h1 class="mt-6 text-4xl font-extrabold tracking-tight text-[var(--p-text)] md:text-5xl">
                Drafts and <br><span class="text-[var(--p-primary)]">Quotations</span>
              </h1>
              <p class="mt-4 max-w-md text-lg leading-8 text-[var(--p-text-muted)]">
                Refine your upcoming print project, review specifications, and submit a cleaner brief to the shop.
              </p>
            </div>

            <div class="flex justify-end">
              <div class="max-w-xs rounded-2xl border-l-4 border-[var(--p-primary)] bg-white p-6 shadow-sm">
                <p class="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Active Draft</p>
                <p class="mt-2 text-4xl font-extrabold tracking-tight text-[var(--p-text)]">{{ filteredItems.length }}</p>
                <p class="mt-3 text-sm text-[var(--p-text-muted)]">{{ displayDraft.shop_name }}</p>
                <div class="mt-5 flex flex-wrap gap-2">
                  <span class="rounded-full bg-[var(--p-surface-container)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--p-text-muted)]">
                    {{ draftStatusLabel }}
                  </span>
                  <span class="rounded-full bg-[var(--p-surface-container)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--p-text-muted)]">
                    {{ isGuest ? 'Guest Draft' : 'Signed In' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-[var(--p-primary)]/8 blur-3xl" />
        </section>

        <section class="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div class="relative w-full max-w-md">
            <UIcon name="i-lucide-search" class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--p-text-muted)]" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Find an item in this project..."
              class="w-full rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-container-low)] py-3 pl-12 pr-4 text-[var(--p-text)] outline-none transition-all focus:border-[var(--p-primary)] focus:ring-2 focus:ring-[var(--p-primary)]/15"
            >
          </div>

          <div class="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            <button
              v-for="chip in filterChips"
              :key="chip.value"
              type="button"
              class="whitespace-nowrap rounded-xl px-5 py-2.5 text-sm font-semibold transition-all"
              :class="activeFilter === chip.value
                ? 'bg-[var(--p-text)] text-white'
                : 'bg-[var(--p-surface-container-low)] text-[var(--p-text-muted)] hover:bg-[var(--p-surface-container)] hover:text-[var(--p-text)]'"
              @click="activeFilter = chip.value"
            >
              {{ chip.label }}
            </button>
          </div>
        </section>

        <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <section class="space-y-6 lg:col-span-2">
            <article
              v-for="item in filteredItems"
              :key="String(item.id)"
              class="group rounded-[1.5rem] bg-[var(--p-surface)] p-6 transition-all duration-300 hover:shadow-[0px_20px_40px_rgba(20,27,44,0.06)]"
            >
              <div class="flex flex-col gap-6 md:flex-row">
                <div class="aspect-video w-full overflow-hidden rounded-xl bg-[var(--p-surface-container-low)] md:w-56 md:shrink-0">
                  <div class="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(225,53,21,0.16),_transparent_55%),linear-gradient(135deg,var(--p-surface-container),var(--p-surface-container-low))]">
                    <UIcon :name="itemIcon(item)" class="h-14 w-14 text-[var(--p-primary)]/70" />
                  </div>
                </div>

                <div class="flex min-w-0 flex-1 flex-col justify-between">
                  <div>
                    <div class="mb-2 flex items-start justify-between gap-3">
                      <h2 class="text-xl font-bold text-[var(--p-text)]">
                        {{ itemTitle(item) }}
                      </h2>
                      <span
                        class="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em]"
                        :class="item.item_type === 'CUSTOM'
                          ? 'bg-[var(--p-primary-fixed)] text-[var(--p-primary)]'
                          : 'bg-[var(--p-surface-container)] text-[var(--p-text-muted)]'"
                      >
                        {{ item.item_type === 'CUSTOM' ? 'Custom' : 'Product' }}
                      </span>
                    </div>

                    <p class="text-sm leading-6 text-[var(--p-text-muted)]">
                      {{ itemDescription(item) }}
                    </p>

                    <div class="mt-4 flex flex-wrap gap-2">
                      <span
                        v-for="tag in itemTags(item)"
                        :key="tag"
                        class="rounded-full bg-[var(--p-surface-container-low)] px-3 py-1 text-[11px] font-medium text-[var(--p-text-muted)]"
                      >
                        {{ tag }}
                      </span>
                    </div>
                  </div>

                  <div class="mt-6 flex flex-col gap-4 border-t border-[var(--p-border)] pt-4 xl:flex-row xl:items-center xl:justify-between">
                    <div>
                      <p class="text-sm font-medium text-[var(--p-text-muted)]">{{ itemFootnote(item) }}</p>
                      <p class="mt-1 text-sm text-[var(--p-text-muted)]">
                        {{ item.unit_price || item.line_total ? pricingLine(item) : guestPricingLine }}
                      </p>
                    </div>

                    <div class="flex flex-wrap items-center gap-3">
                      <div class="flex items-center gap-1 rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-container-low)]">
                        <UButton
                          :disabled="!canEdit"
                          :loading="mutatingItemId === item.id && mutatingAction === 'qty'"
                          variant="soft"
                          size="xs"
                          color="neutral"
                          icon="i-lucide-minus"
                          class="rounded-r-none"
                          @click="onQtyChange(item, -10)"
                        />
                        <input
                          type="number"
                          :value="item.quantity"
                          :min="MIN_QUANTITY"
                          :disabled="!canEdit"
                          class="w-16 appearance-none border-none bg-transparent text-center text-sm font-medium text-[var(--p-text)] outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                          @change="onQtyInput(item, $event)"
                          @blur="onQtyInput(item, $event)"
                        >
                        <UButton
                          :disabled="!canEdit"
                          :loading="mutatingItemId === item.id && mutatingAction === 'qty'"
                          variant="soft"
                          size="xs"
                          color="neutral"
                          icon="i-lucide-plus"
                          class="rounded-l-none"
                          @click="onQtyChange(item, 10)"
                        />
                      </div>

                      <UButton
                        v-if="canEdit && !isGuest && item.item_type === 'PRODUCT' && item.product"
                        variant="soft"
                        size="xs"
                        color="primary"
                        @click="openTweak(item)"
                      >
                        <UIcon name="i-lucide-sliders-horizontal" class="mr-1 h-3.5 w-3.5" />
                        Tweak
                      </UButton>

                      <UButton
                        :disabled="!canEdit"
                        :loading="mutatingItemId === item.id && mutatingAction === 'remove'"
                        variant="soft"
                        size="xs"
                        color="error"
                        icon="i-lucide-trash-2"
                        @click="onRemove(item)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </article>

            <article
              class="group rounded-[1.5rem] border-2 border-dashed border-[var(--p-border)] bg-[var(--p-surface)] p-6"
            >
              <div class="flex h-full flex-col items-center justify-center py-10 text-center">
                <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--p-primary-fixed)]">
                  <UIcon name="i-lucide-plus" class="h-8 w-8 text-[var(--p-primary)]" />
                </div>
                <h3 class="text-lg font-bold text-[var(--p-text)]">Start another print configuration</h3>
                <p class="mt-2 max-w-sm text-sm leading-6 text-[var(--p-text-muted)]">
                  Add more products from a shop catalog or begin a custom print request from scratch.
                </p>
                <UButton to="/shops" variant="soft" color="primary" class="mt-6">
                  Browse shops
                </UButton>
              </div>
            </article>
          </section>

          <aside class="space-y-6">
            <article class="overflow-hidden rounded-[1.5rem] bg-[var(--p-text)] p-8 text-white">
              <div class="relative z-10">
                <h3 class="text-2xl font-bold tracking-tight">Ready to complete this quote?</h3>
                <p class="mt-3 text-sm leading-6 text-slate-300">
                  Review quantities, tweak product specs where needed, then send the request to the shop for final pricing.
                </p>

                <div class="mt-6 flex flex-wrap gap-2">
                  <span class="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/80">
                    {{ displayDraft.shop_name }}
                  </span>
                  <span class="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/80">
                    {{ filteredItems.length }} item{{ filteredItems.length === 1 ? '' : 's' }}
                  </span>
                </div>
              </div>
              <div class="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            </article>

            <article class="rounded-[1.5rem] bg-[var(--p-surface)] p-6 shadow-sm">
              <h3 class="text-lg font-bold text-[var(--p-text)]">Project summary</h3>
              <div class="mt-5 space-y-3">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-[var(--p-text-muted)]">Shop</span>
                  <span class="font-medium text-[var(--p-text)]">{{ displayDraft.shop_name }}</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span class="text-[var(--p-text-muted)]">Items</span>
                  <span class="font-medium text-[var(--p-text)]">{{ filteredItems.length }}</span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span class="text-[var(--p-text-muted)]">Subtotal</span>
                  <span class="font-medium text-[var(--p-text)]">{{ isGuest ? 'Pending' : formatCurrency(computedSubtotal, displayCurrency) }}</span>
                </div>
                <div class="flex items-center justify-between border-t border-[var(--p-border)] pt-3 text-sm font-semibold">
                  <span class="text-[var(--p-text)]">Total</span>
                  <span class="text-[var(--p-text)]">{{ isGuest ? 'Est. pending' : formatCurrency(computedTotal, displayCurrency) }}</span>
                </div>
              </div>
            </article>

            <div v-if="!isGuest">
              <QuotesQuotePreviewPrice
                :draft-id="displayDraft.id"
                :has-items="(displayDraft.items?.length ?? 0) > 0"
              />
            </div>
            <article v-else class="rounded-[1.5rem] bg-[var(--p-surface)] p-6 shadow-sm">
              <h3 class="text-lg font-bold text-[var(--p-text)]">Pricing preview</h3>
              <p class="mt-3 text-sm leading-6 text-[var(--p-text-muted)]">
                Sign in and submit this draft to get a live estimate from the shop.
              </p>
            </article>

            <article class="rounded-[1.5rem] bg-[var(--p-surface-container)] p-8 text-center">
              <h4 class="text-xl font-bold text-[var(--p-text)]">Need personalized assistance?</h4>
              <p class="mt-3 text-sm leading-6 text-[var(--p-text-muted)]">
                Speak with a print expert, refine unusual specs, or review previous quote activity.
              </p>
              <div class="mt-6 flex flex-col gap-3">
                <UButton to="/shops" variant="solid" color="primary" block>Speak to an expert</UButton>
                <UButton to="/quotes" variant="soft" color="neutral" block>View quote history</UButton>
              </div>
            </article>

            <div v-if="canEdit && (displayDraft.items?.length ?? 0) > 0" class="space-y-3">
              <p v-if="isGuest" class="text-xs text-[var(--p-text-muted)]">
                By submitting, you create an account and we use your email to send the quote.
              </p>
              <UButton
                color="primary"
                size="lg"
                block
                :loading="submitting"
                @click="isGuest ? (submitModalOpen = true) : onRequestQuote()"
              >
                <UIcon name="i-lucide-send" class="mr-2 h-4 w-4" />
                {{ isGuest ? 'Sign in to submit' : 'Complete Quote' }}
              </UButton>
            </div>
          </aside>
        </div>

        <QuotesQuoteTweakItemModal
          v-if="!isGuest"
          v-model:open="tweakModalOpen"
          :item="tweakItem"
          :shop-slug="displayDraft?.shop_slug ?? ''"
          @updated="quoteDraftStore.refreshDraft(); tweakItem = null"
        />

        <QuotesGuestSubmitModal
          v-model:open="submitModalOpen"
          :shop-slug="displayDraft.shop_slug"
          @submitted="onGuestSubmitted"
        />
      </template>

      <div v-else class="mx-auto max-w-3xl rounded-[2rem] border border-[var(--p-border)] bg-[var(--p-surface)] p-12 text-center shadow-sm">
        <UIcon name="i-lucide-shopping-cart" class="mx-auto h-16 w-16 text-[var(--p-border)]" />
        <h3 class="mt-4 text-xl font-medium text-[var(--p-text)]">No items in your workspace yet</h3>
        <p class="mt-2 text-sm leading-6 text-[var(--p-text-muted)]">
          Browse shops, add products, or request a custom print to start building a quote.
        </p>
        <UButton to="/shops" color="primary" class="mt-6">Browse shops</UButton>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAnalyticsTracking } from '~/composables/useAnalyticsTracking'
import type { QuoteItem } from '~/shared/types/buyer'
import type { GuestQuoteItem } from '~/stores/guestQuote'
import { formatCurrency } from '~/utils/formatters'
import { useQuoteDraftStore } from '~/stores/quoteDraft'
import { useGuestQuoteStore } from '~/stores/guestQuote'
import { useAuthStore } from '~/stores/auth'

definePageMeta({ layout: 'default' })

const MIN_QUANTITY = 100

const route = useRoute()
const authStore = useAuthStore()
const quoteDraftStore = useQuoteDraftStore()
const guestQuoteStore = useGuestQuoteStore()
const { trackQuoteSubmit } = useAnalyticsTracking()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const isGuest = computed(() => !isAuthenticated.value && guestQuoteStore.hasItems)
const searchQuery = ref('')
const activeFilter = ref<'all' | 'product' | 'custom'>('all')

const filterChips = [
  { value: 'all' as const, label: 'All Draft Items' },
  { value: 'product' as const, label: 'Products' },
  { value: 'custom' as const, label: 'Custom Work' },
]

const displayDraft = computed(() => {
  if (isAuthenticated.value && quoteDraftStore.activeDraft) {
    const d = quoteDraftStore.activeDraft
    return {
      id: d.id,
      shop_name: d.shop_name,
      shop_slug: d.shop_slug ?? quoteDraftStore.currentShopSlug ?? '',
      items: d.items ?? [],
    }
  }
  const g = guestQuoteStore.quote
  if (g) {
    const items: Array<GuestQuoteItem & { item_type: 'PRODUCT'; product_name?: string; unit_price?: null; line_total?: null }> = g.items.map((i) => ({
      ...i,
      item_type: 'PRODUCT' as const,
      product_name: i.product_name,
      unit_price: undefined,
      line_total: undefined,
    }))
    return {
      id: 0,
      shop_name: g.shopName,
      shop_slug: g.shopSlug,
      items,
    }
  }
  return null
})

onMounted(async () => {
  const shopFromQuery = route.query.shop as string | undefined
  if (shopFromQuery) {
    quoteDraftStore.setShop(shopFromQuery)
  }
  if (isAuthenticated.value && quoteDraftStore.currentShopSlug) {
    await quoteDraftStore.loadActiveDraft()
  }
})

const toast = useToast()
const canEdit = computed(() => {
  if (isGuest.value) return true
  return quoteDraftStore.activeDraft?.status === 'draft'
})
const draftStatusLabel = computed(() => {
  const status = quoteDraftStore.activeDraft?.status
  if (!status) return 'Draft'
  return status[0]?.toUpperCase() + status.slice(1)
})

const draft = computed(() => (isAuthenticated.value ? quoteDraftStore.activeDraft : null))
const displayCurrency = computed(() => draft.value?.shop_currency ?? 'KES')

const computedSubtotal = computed(() => {
  const d = draft.value
  if (!d) return null
  const t = d.totals
  if (t && typeof t === 'object' && typeof t.subtotal === 'string') return t.subtotal
  const sum = d.items?.reduce((acc, i) => acc + (parseFloat(String(i.line_total || 0)) || 0), 0)
  return sum > 0 ? String(sum) : null
})

const computedTotal = computed(() => {
  const d = draft.value
  if (!d) return null
  const t = d.totals
  if (typeof t === 'number') return String(t)
  if (t && typeof t === 'object' && typeof t.total === 'string') return t.total
  return computedSubtotal.value
})

const filteredItems = computed(() => {
  const items = displayDraft.value?.items ?? []
  const query = searchQuery.value.trim().toLowerCase()
  return items.filter((item) => {
    const matchesFilter =
      activeFilter.value === 'all'
      || (activeFilter.value === 'product' && item.item_type === 'PRODUCT')
      || (activeFilter.value === 'custom' && item.item_type === 'CUSTOM')
    const haystack = [
      itemTitle(item),
      itemDescription(item),
      ...(itemTags(item)),
    ].join(' ').toLowerCase()
    return matchesFilter && (!query || haystack.includes(query))
  })
})

const guestPricingLine = 'Estimated pricing is pending until you sign in and submit.'

const mutatingItemId = ref<number | string | null>(null)
const mutatingAction = ref<'qty' | 'remove'>('qty')
const submitting = ref(false)
const tweakModalOpen = ref(false)
const tweakItem = ref<QuoteItem | null>(null)
const submitModalOpen = ref(false)

function itemTitle(item: QuoteItem | (GuestQuoteItem & { item_type: 'PRODUCT' })) {
  return item.item_type === 'CUSTOM' ? (item.title ?? 'Custom print request') : (item.product_name ?? 'Product')
}

function itemDescription(item: QuoteItem | (GuestQuoteItem & { item_type: 'PRODUCT' })) {
  if (item.item_type === 'CUSTOM') {
    if (item.spec_text) return item.spec_text
    return [item.chosen_width_mm, item.chosen_height_mm].every(Boolean)
      ? `${item.chosen_width_mm} x ${item.chosen_height_mm} mm custom work`
      : 'Custom specification in progress.'
  }
  return item.special_instructions || item.pricing_mode || 'Product configuration in progress.'
}

function itemTags(item: QuoteItem | (GuestQuoteItem & { item_type: 'PRODUCT' })) {
  const tags: string[] = [`Qty ${item.quantity}`]
  if (item.pricing_mode) tags.push(item.pricing_mode)
  if (item.sides) tags.push(item.sides)
  if (item.color_mode) tags.push(item.color_mode)
  if (item.has_artwork != null) tags.push(item.has_artwork ? 'Artwork ready' : 'Needs artwork')
  return tags.slice(0, 4)
}

function itemFootnote(item: QuoteItem | (GuestQuoteItem & { item_type: 'PRODUCT' })) {
  return item.item_type === 'CUSTOM' ? 'Custom print configuration' : 'Saved product draft'
}

function pricingLine(item: QuoteItem | (GuestQuoteItem & { item_type: 'PRODUCT' })) {
  return `Unit: ${formatCurrency(item.unit_price, displayCurrency.value)} · Total: ${formatCurrency(item.line_total, displayCurrency.value)}`
}

function itemIcon(item: QuoteItem | (GuestQuoteItem & { item_type: 'PRODUCT' })) {
  const key = `${itemTitle(item)} ${itemDescription(item)}`.toLowerCase()
  if (key.includes('business')) return 'i-lucide-credit-card'
  if (key.includes('brochure')) return 'i-lucide-book-open'
  if (key.includes('flyer')) return 'i-lucide-file-text'
  if (key.includes('sticker') || key.includes('label')) return 'i-lucide-sticker'
  if (key.includes('book')) return 'i-lucide-book'
  return item.item_type === 'CUSTOM' ? 'i-lucide-palette' : 'i-lucide-package'
}

function openTweak(item: QuoteItem | (GuestQuoteItem & { item_type: 'PRODUCT' })) {
  if (isGuest.value || !('product_slug' in item || 'special_instructions' in item || 'finishings' in item)) return
  tweakItem.value = item as QuoteItem
  tweakModalOpen.value = true
}

async function onGuestSubmitted(quoteId: number) {
  submitModalOpen.value = false
  await navigateTo(`/quotes/${quoteId}`)
}

async function onRequestQuote() {
  if (!draft.value || !canEdit.value) return null
  submitting.value = true
  try {
    const updated = await quoteDraftStore.submitDraft()
    if (updated) {
      void trackQuoteSubmit({
        source: 'quote_draft_submit',
        quote_id: updated.id,
        shop_slug: displayDraft.value?.shop_slug,
        item_count: displayDraft.value?.items?.length ?? 0,
      })
      toast.add({ title: 'Request sent to the shop', description: 'The shop will review and get back to you.' })
      await navigateTo(`/quotes/${updated.id}`)
    }
  } catch (err) {
    toast.add({ title: 'Error', description: err instanceof Error ? err.message : 'Failed to submit', color: 'error' })
  } finally {
    submitting.value = false
  }
}

async function onQtyChange(item: QuoteItem | (GuestQuoteItem & { item_type: 'PRODUCT' }), delta: number) {
  if (!canEdit.value) return
  const newQty = Math.max(MIN_QUANTITY, item.quantity + delta)
  mutatingItemId.value = item.id
  mutatingAction.value = 'qty'
  try {
    if (isGuest.value && typeof item.id === 'string') {
      guestQuoteStore.updateItemQty(item.id, newQty)
    } else {
      await quoteDraftStore.updateItemQty(item.id as number, newQty)
    }
  } catch (err) {
    toast.add({ title: 'Error', description: err instanceof Error ? err.message : 'Failed to update', color: 'error' })
  } finally {
    mutatingItemId.value = null
  }
}

function onQtyInput(item: QuoteItem | (GuestQuoteItem & { item_type: 'PRODUCT' }), event: Event) {
  const target = event.target as HTMLInputElement
  let val = parseInt(target.value, 10)
  if (isNaN(val) || val < MIN_QUANTITY) {
    val = MIN_QUANTITY
    target.value = String(val)
  }
  if (val === item.quantity) return
  mutatingItemId.value = item.id
  mutatingAction.value = 'qty'
  if (isGuest.value && typeof item.id === 'string') {
    guestQuoteStore.updateItemQty(item.id, val)
    mutatingItemId.value = null
  } else {
    quoteDraftStore.updateItemQty(item.id as number, val)
      .catch((err: unknown) => {
        toast.add({ title: 'Error', description: err instanceof Error ? err.message : 'Failed to update', color: 'error' })
      })
      .finally(() => { mutatingItemId.value = null })
  }
}

async function onRemove(item: QuoteItem | (GuestQuoteItem & { item_type: 'PRODUCT' })) {
  if (!canEdit.value) return
  mutatingItemId.value = item.id
  mutatingAction.value = 'remove'
  try {
    if (isGuest.value && typeof item.id === 'string') {
      guestQuoteStore.removeItem(item.id)
    } else {
      await quoteDraftStore.removeItemFromDraft(item.id as number)
    }
  } catch (err) {
    toast.add({ title: 'Error', description: err instanceof Error ? err.message : 'Failed to remove', color: 'error' })
  } finally {
    mutatingItemId.value = null
  }
}
</script>
