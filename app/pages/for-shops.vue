<template>
  <div class="min-h-screen bg-[linear-gradient(180deg,#fffaf7_0%,#f6efe9_48%,#f3f4f6_100%)] font-[Montserrat] text-[#111827]">
    <nav class="sticky top-0 z-40 border-b border-[#ead6cb] bg-white/90 backdrop-blur">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <NuxtLink to="/" class="flex items-center gap-3 transition-opacity hover:opacity-90">
          <div class="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-[#e13515]">
            <img src="/assets/logo-mark/light/printy-logo-mark-01.svg" alt="" class="h-full w-full object-cover">
          </div>
          <img src="/assets/word-mark/dark/printy-word-mark-03.svg" alt="Printy" class="h-4 w-auto">
          <span class="hidden rounded-full border border-[#e13515]/20 bg-[#fff1ee] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#e13515] sm:inline-flex">
            For Shop Owners
          </span>
        </NuxtLink>

        <div class="flex items-center gap-3">
          <NuxtLink to="/auth/login" class="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900">
            Login
          </NuxtLink>
          <NuxtLink
            :to="buildShopOwnerSignupRoute()"
            class="rounded-full bg-[#e13515] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#c42e11]"
          >
            Build my rate card
          </NuxtLink>
        </div>
      </div>
    </nav>

    <main class="mx-auto max-w-7xl px-4 py-8 md:py-10">
      <section class="builder-shell grid gap-5 rounded-[2.2rem] border p-4 shadow-[0_30px_90px_-58px_rgba(15,23,42,0.72)] md:p-5 lg:grid-cols-[minmax(0,1.2fr)_380px]">
        <div class="space-y-4">
          <section class="builder-panel px-5 py-5 md:px-6">
            <p class="builder-kicker">Validation-first rate-card builder</p>
            <h1 class="mt-3 text-3xl font-black tracking-tight md:text-5xl">
              Build your shop rate card once. Quote faster every time.
            </h1>
            <p class="builder-copy mt-4 max-w-3xl text-base leading-7">
              Add your paper and finishing prices once, then reuse them for cleaner requests, faster quotes, and fewer pricing mistakes.
            </p>

            <div class="mt-6 grid gap-3 md:grid-cols-3">
              <div class="builder-chip">
                <p class="builder-chip-kicker">Manual quoting pain</p>
                <p class="mt-2 text-sm">Stop repeating the same stock and finishing prices every time a buyer asks for a quote.</p>
              </div>
              <div class="builder-chip">
                <p class="builder-chip-kicker">Margin protection</p>
                <p class="mt-2 text-sm">Keep one reusable source so rushed quoting does not drift or miss charges.</p>
              </div>
              <div class="builder-chip">
                <p class="builder-chip-kicker">Reusable logic</p>
                <p class="mt-2 text-sm">Your rate card becomes reusable quoting logic for repeat requests.</p>
              </div>
            </div>
          </section>

          <section class="builder-panel p-4 md:p-5">
            <div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p class="builder-kicker">1. Digital press paper prices</p>
                <h2 class="mt-2 text-2xl font-black">Paper prices</h2>
                <p class="builder-copy mt-2 text-sm leading-6">
                  The paper rows are fixed already. Enter the final inclusive single-side and double-side prices your team actually uses.
                </p>
              </div>
              <div class="builder-pill">
                Predefined paper labels
              </div>
            </div>

            <div class="mt-4 space-y-2.5">
              <div
                v-for="row in paperRows"
                :key="row.id"
                class="compact-rate-row transition"
                :class="paperRowClass(row)"
              >
                <div class="flex flex-col gap-2 xl:flex-row xl:items-start xl:justify-between">
                  <div class="grid flex-1 gap-2 md:grid-cols-2 xl:grid-cols-[1.15fr_0.82fr_0.82fr_auto]">
                    <div class="compact-readout">
                      <p class="text-sm font-semibold">{{ row.label }}</p>
                      <p class="mt-1 text-xs text-[#6b7280]">{{ row.size }} • {{ row.category }}</p>
                    </div>

                    <label class="space-y-2 text-sm">
                      <span class="font-semibold text-[#374151]">Single price</span>
                      <input
                        v-model="row.single_side_price"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="KES"
                        class="w-full rounded-xl border border-[#e5ddd7] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#e13515]"
                      >
                      <div class="rounded-xl border border-[#efe5df] bg-[#faf7f5] px-3 py-3 text-xs text-[#6b7280]">
                        <p class="font-semibold text-[#374151]">{{ marketLabel }}</p>
                        <template v-if="marketGuideFor(row.key, 'single_side_price')?.has_enough_data">
                          <p class="mt-1">Range: {{ formatKes(marketGuideFor(row.key, 'single_side_price')?.min) }} - {{ formatKes(marketGuideFor(row.key, 'single_side_price')?.max) }}</p>
                          <p class="mt-1">Median: {{ formatKes(marketGuideFor(row.key, 'single_side_price')?.median) }}</p>
                          <p class="mt-1">Mean: {{ formatKes(marketGuideFor(row.key, 'single_side_price')?.mean) }}</p>
                        </template>
                        <p v-else class="mt-1">{{ marketGuideText(marketGuideFor(row.key, 'single_side_price')) }}</p>
                      </div>
                    </label>

                    <label class="space-y-2 text-sm">
                      <span class="font-semibold text-[#374151]">Double price</span>
                      <input
                        v-model="row.double_side_price"
                        type="number"
                        min="0"
                        step="0.01"
                        :placeholder="row.supports_double_side ? 'KES' : 'Not used'"
                        :disabled="!row.supports_double_side"
                        class="w-full rounded-xl border border-[#e5ddd7] bg-white px-3 py-2.5 text-sm outline-none transition disabled:cursor-not-allowed disabled:bg-[#f3f4f6] focus:border-[#e13515]"
                      >
                      <div class="rounded-xl border border-[#efe5df] bg-[#faf7f5] px-3 py-3 text-xs text-[#6b7280]">
                        <p class="font-semibold text-[#374151]">{{ marketLabel }}</p>
                        <template v-if="row.supports_double_side && marketGuideFor(row.key, 'double_side_price')?.has_enough_data">
                          <p class="mt-1">Range: {{ formatKes(marketGuideFor(row.key, 'double_side_price')?.min) }} - {{ formatKes(marketGuideFor(row.key, 'double_side_price')?.max) }}</p>
                          <p class="mt-1">Median: {{ formatKes(marketGuideFor(row.key, 'double_side_price')?.median) }}</p>
                          <p class="mt-1">Mean: {{ formatKes(marketGuideFor(row.key, 'double_side_price')?.mean) }}</p>
                        </template>
                        <p v-else class="mt-1">{{ row.supports_double_side ? marketGuideText(marketGuideFor(row.key, 'double_side_price')) : 'This row uses single-side pricing only.' }}</p>
                      </div>
                    </label>

                    <label class="flex items-center gap-3 rounded-xl border border-[#efe5df] bg-[#faf7f5] px-3 py-2.5 text-sm font-semibold text-[#374151]">
                      <input v-model="row.active" type="checkbox" class="h-4 w-4 rounded border-[#d2c2b8] text-[#e13515] focus:ring-[#e13515]">
                      Active
                    </label>
                  </div>
                </div>

                <p v-if="paperRowError(row)" class="mt-3 text-sm text-[#b42318]">{{ paperRowError(row) }}</p>
                <p v-else-if="row.active" class="mt-3 text-sm text-[#6b7280]">
                  {{ row.label }} | Single {{ formatKes(row.single_side_price) }} | Double {{ row.supports_double_side ? formatKes(row.double_side_price) : 'N/A' }}
                </p>
              </div>
            </div>
          </section>

          <section
            v-if="showFinishingSection"
            class="builder-panel p-4 md:p-5"
          >
            <div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p class="builder-kicker">2. Finishings</p>
                <h2 class="mt-2 text-2xl font-black">Finishing prices</h2>
                <p class="builder-copy mt-2 text-sm leading-6">
                  Keep lamination, cutting, and similar charges in the same reusable rate card so they do not get left out under pressure.
                </p>
              </div>
              <div class="builder-pill">
                Predefined finishing labels
              </div>
            </div>

            <div class="mt-4 space-y-2.5">
              <div
                v-for="row in finishingRows"
                :key="row.id"
                class="compact-rate-row transition"
                :class="finishingRowClass(row)"
              >
                <div class="flex flex-col gap-2 xl:flex-row xl:items-start xl:justify-between">
                  <div class="grid flex-1 gap-2 md:grid-cols-2 xl:grid-cols-[1.1fr_0.9fr_auto]">
                    <div class="compact-readout">
                      <p class="text-sm font-semibold">{{ row.label }}</p>
                      <p class="mt-1 text-xs text-[#6b7280]">{{ row.pricing_mode }} • per {{ row.unit }}</p>
                    </div>

                    <label class="space-y-2 text-sm">
                      <span class="font-semibold text-[#374151]">Price</span>
                      <input
                        v-model="row.price"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="KES"
                        class="w-full rounded-xl border border-[#e5ddd7] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#e13515]"
                      >
                      <div class="rounded-xl border border-[#efe5df] bg-[#faf7f5] px-3 py-3 text-xs text-[#6b7280]">
                        <p class="font-semibold text-[#374151]">{{ marketLabel }}</p>
                        <template v-if="marketGuideFor(row.key, 'price')?.has_enough_data">
                          <p class="mt-1">Range: {{ formatKes(marketGuideFor(row.key, 'price')?.min) }} - {{ formatKes(marketGuideFor(row.key, 'price')?.max) }}</p>
                          <p class="mt-1">Median: {{ formatKes(marketGuideFor(row.key, 'price')?.median) }}</p>
                          <p class="mt-1">Mean: {{ formatKes(marketGuideFor(row.key, 'price')?.mean) }}</p>
                        </template>
                        <p v-else class="mt-1">{{ marketGuideText(marketGuideFor(row.key, 'price')) }}</p>
                      </div>
                    </label>

                    <label class="flex items-center gap-3 rounded-xl border border-[#efe5df] bg-[#faf7f5] px-3 py-2.5 text-sm font-semibold text-[#374151]">
                      <input v-model="row.active" type="checkbox" class="h-4 w-4 rounded border-[#d2c2b8] text-[#e13515] focus:ring-[#e13515]">
                      Active
                    </label>
                  </div>
                </div>

                <p v-if="finishingRowError(row)" class="mt-3 text-sm text-[#b42318]">{{ finishingRowError(row) }}</p>
                <p v-else-if="row.active" class="mt-3 text-sm text-[#6b7280]">
                  {{ row.label }} | {{ row.pricing_mode }} | {{ formatKes(row.price) }}
                </p>
              </div>
            </div>
          </section>

          <section
            v-if="showShopDetailsSection"
            class="builder-panel p-4 md:p-5"
          >
            <p class="builder-kicker">3. Save to shop</p>
            <h2 class="mt-2 text-2xl font-black">Attach this rate card to your shop</h2>
            <p class="builder-copy mt-2 text-sm leading-6">
              These details identify the shop that will keep reusing this rate card.
            </p>

            <div class="mt-5 grid gap-4 md:grid-cols-3">
              <label class="space-y-2 text-sm">
                <span class="font-semibold text-[#374151]">Shop name</span>
                <input
                  v-model="shopDetails.shop_name"
                  type="text"
                  placeholder="Sample Print Shop"
                  class="w-full rounded-xl border border-[#e5ddd7] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#e13515]"
                >
              </label>

              <label class="space-y-2 text-sm">
                <span class="font-semibold text-[#374151]">WhatsApp number</span>
                <input
                  v-model="shopDetails.whatsapp_number"
                  type="text"
                  placeholder="+254 7xx xxx xxx"
                  class="w-full rounded-xl border border-[#e5ddd7] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#e13515]"
                >
              </label>

              <label class="space-y-2 text-sm">
                <span class="font-semibold text-[#374151]">Location / area</span>
                <input
                  v-model="shopDetails.location_area"
                  type="text"
                  placeholder="Nairobi CBD"
                  class="w-full rounded-xl border border-[#e5ddd7] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#e13515]"
                >
              </label>
            </div>

            <div v-if="!isAuthenticated" class="builder-note mt-4">
              Sign up after this step and the saved draft will resume automatically so the rate card attaches to your shop.
            </div>
          </section>

          <section class="builder-panel p-4 md:p-5">
            <p class="builder-kicker">Still validating with print shops</p>
            <p class="builder-copy mt-2 text-sm leading-6">
              We are speaking with Nairobi print shop owners to confirm where quoting wastes the most time. No fake testimonials. No invented numbers. The product will keep changing based on what shop owners confirm.
            </p>
          </section>
        </div>

        <aside class="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <section class="builder-preview p-4">
            <p class="builder-kicker">Live example</p>
            <h2 class="mt-2 text-2xl font-black">{{ exampleQuote.title || 'Example quote: 100 business cards' }}</h2>

            <div v-if="previewLoading" class="mt-4 flex items-center gap-2 text-sm text-[#e5e7eb]">
              <Icon name="lucide:loader-2" class="size-4 animate-spin" />
              <span>Updating example quote...</span>
            </div>

            <div v-else-if="previewError" class="mt-4 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {{ previewError }}
            </div>

            <div v-else class="mt-4 space-y-4">
              <div
                class="rounded-[1.5rem] border p-4 transition"
                :class="exampleQuote.is_complete ? 'border-[#f7a58d] bg-white/10' : 'border-white/10 bg-white/5 opacity-80'"
              >
                <p class="text-sm font-semibold text-white">{{ exampleQuote.paper_label }}</p>
                <p class="mt-2 text-sm text-[#d1d5db]">{{ exampleQuote.status_text }}</p>
                <div class="mt-4 space-y-3">
                  <div
                    v-for="item in exampleQuote.line_items"
                    :key="item.key"
                    class="rounded-xl border px-3 py-3"
                    :class="item.active ? 'border-[#f7a58d]/40 bg-[#e13515]/10' : 'border-white/10 bg-black/10'"
                  >
                    <div class="flex items-start justify-between gap-3">
                      <div>
                        <p class="font-semibold text-white">{{ item.label }}</p>
                        <p class="mt-1 text-sm text-[#d1d5db]">{{ item.detail }}</p>
                      </div>
                      <p class="text-sm font-bold text-white">{{ item.total ? formatKes(item.total) : 'KES -' }}</p>
                    </div>
                  </div>
                </div>
                <div class="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                  <p class="text-sm font-semibold text-[#d1d5db]">Estimated total</p>
                  <p class="text-lg font-black text-white">{{ exampleQuote.estimated_total ? formatKes(exampleQuote.estimated_total) : 'KES -' }}</p>
                </div>
              </div>

              <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <div class="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                  <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#cbd5e1]">Progress</p>
                  <p class="mt-2 text-2xl font-black">{{ summary.pricing_items_added }}</p>
                  <p class="mt-1 text-sm text-[#e5e7eb]">pricing items added</p>
                </div>
                <div class="rounded-[1.5rem] border border-[#e13515]/30 bg-[#e13515]/12 p-4">
                  <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ffb49f]">Unlocked</p>
                  <p class="mt-2 text-2xl font-black">{{ summary.products_unlocked }}</p>
                  <p class="mt-1 text-sm text-[#ffe0d6]">products unlocked</p>
                </div>
              </div>

              <div class="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#cbd5e1]">You can now price</p>
                <div v-if="summary.unlocked_products.length" class="mt-3 space-y-2">
                  <div
                    v-for="product in summary.unlocked_products"
                    :key="product.key"
                    class="rounded-xl border border-white/10 bg-black/10 px-3 py-3"
                  >
                    <p class="font-semibold text-white">{{ product.label }}</p>
                    <p class="mt-1 text-sm text-[#d1d5db]">{{ product.reason }}</p>
                  </div>
                </div>
                <p v-else class="mt-3 text-sm leading-6 text-[#d1d5db]">
                  Add your first active paper row to start unlocking quote-ready products.
                </p>
              </div>

              <div v-if="summary.completion_feed.length" class="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#cbd5e1]">What changed</p>
                <div class="mt-3 space-y-2">
                  <p v-for="item in summary.completion_feed" :key="item" class="text-sm leading-6 text-[#f3f4f6]">{{ item }}</p>
                </div>
              </div>

              <div v-if="summary.next_suggestions.length" class="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#cbd5e1]">Next useful section</p>
                <div class="mt-3 space-y-2">
                  <p v-for="item in summary.next_suggestions" :key="item" class="text-sm leading-6 text-[#d1d5db]">{{ item }}</p>
                </div>
              </div>
            </div>
          </section>

          <section class="builder-panel p-4">
            <div v-if="authStatusMessage" class="builder-note">
              {{ authStatusMessage }}
            </div>
            <div v-if="saveMessage" class="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {{ saveMessage }}
            </div>
            <div v-if="saveError" class="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {{ saveError }}
            </div>

            <button
              type="button"
              class="mt-4 w-full rounded-full bg-[#e13515] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c42e11] disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="saveLoading || authRedirectLoading || hasBlockingErrors"
              @click="handleSaveClick"
            >
              {{ saveLoading ? 'Saving your price list...' : (authRedirectLoading ? 'Opening sign up...' : 'Build my rate card') }}
            </button>

            <p class="mt-3 text-center text-xs leading-5 opacity-70">
              {{ isAuthenticated ? 'This saves to your current shop account.' : 'Your draft stays in place while you log in or sign up.' }}
            </p>
          </section>
        </aside>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { API } from '~/shared/api-paths'
import { buildShopOwnerSignupRoute, LEGACY_PENDING_RATE_CARD_DRAFT_KEY, PENDING_RATE_CARD_DRAFT_KEY, ROUTES } from '~/shared/routes'
import { useApi, usePublicApiNoAuth } from '~/shared/api'
import { useAuthStore } from '~/stores/auth'
import { useShopStore } from '~/stores/shop'
import { useNotification } from '~/composables/useNotification'

definePageMeta({ layout: false })

useSeoMeta({
  title: 'For Print Shop Owners - Printy',
  description: 'Build your shop rate card once, then reuse it for faster quotes and fewer pricing mistakes.',
  ogTitle: 'For Print Shop Owners - Printy',
  ogDescription: 'Build your shop rate card once, then reuse it for faster quotes and fewer pricing mistakes.',
})

type PaperRow = {
  key: string
  id: string
  label: string
  paper_name: string
  gsm?: number | null
  paper_type: string
  category: string
  size: string
  supports_double_side: boolean
  single_side_price: string
  double_side_price: string
  active: boolean
}

type FinishingRow = {
  key: string
  id: string
  label: string
  name: string
  pricing_mode: string
  unit: string
  price: string
  active: boolean
}

type ShopDetails = {
  shop_name: string
  whatsapp_number: string
  location_area: string
}

type Summary = {
  pricing_items_added: number
  paper_rows_added: number
  finishing_rows_added: number
  products_unlocked: number
  unlocked_products: Array<{ key: string, label: string, reason: string }>
  completion_feed: string[]
  next_suggestions: string[]
}

type MarketGuide = {
  min: string | null
  max: string | null
  median: string | null
  mean: string | null
  sample_count: number
  has_enough_data: boolean
  message: string | null
}

type ExampleQuoteItem = {
  key: string
  label: string
  active: boolean
  detail: string
  total: string | null
}

type ExampleQuote = {
  title: string
  paper_label: string
  sheets_needed: number
  missing_fields: string[]
  is_complete: boolean
  is_active: boolean
  status_text: string
  line_items: ExampleQuoteItem[]
  estimated_total: string | null
}

type ConfigResponse = {
  paper_rows: PaperRow[]
  finishing_rows: FinishingRow[]
  shop_details: ShopDetails
  summary: Summary
  market_guides?: Record<string, Record<string, MarketGuide>>
  example_quote?: ExampleQuote
  market_label?: string
}

type SaveResponse = ConfigResponse & {
  saved: boolean
  shop_slug: string
  redirect_url?: string
}

type PendingDraft = {
  paper_rows: PaperRow[]
  finishing_rows: FinishingRow[]
  shop_details: ShopDetails
}

const authStore = useAuthStore()
const shopStore = useShopStore()
const publicApi = usePublicApiNoAuth()
const api = useApi()
const notification = useNotification()

const configLoading = ref(false)
const previewLoading = ref(false)
const saveLoading = ref(false)

const previewError = ref<string | null>(null)
const saveError = ref<string | null>(null)
const saveMessage = ref<string | null>(null)
const authStatusMessage = ref<string | null>(null)
const authRedirectLoading = ref(false)

const paperRows = ref<PaperRow[]>([])
const finishingRows = ref<FinishingRow[]>([])
const shopDetails = reactive<ShopDetails>({
  shop_name: '',
  whatsapp_number: '',
  location_area: '',
})
const summary = ref<Summary>({
  pricing_items_added: 0,
  paper_rows_added: 0,
  finishing_rows_added: 0,
  products_unlocked: 0,
  unlocked_products: [],
  completion_feed: [],
  next_suggestions: [],
})
const marketGuides = ref<Record<string, Record<string, MarketGuide>>>({})
const marketLabel = ref('Nairobi Market Guide')
const exampleQuote = ref<ExampleQuote>({
  title: 'Example: 100 business cards',
  paper_label: '300gsm double-sided',
  sheets_needed: 5,
  missing_fields: ['300gsm double price', 'lamination', 'cutting'],
  is_complete: false,
  is_active: false,
  status_text: 'Waiting for 300gsm double price, lamination, cutting...',
  line_items: [],
  estimated_total: null,
})

const pendingResume = ref(false)
let previewTimer: ReturnType<typeof setTimeout> | null = null

const isAuthenticated = computed(() => authStore.isAuthenticated)
const showFinishingSection = computed(() => summary.value.paper_rows_added > 0 || paperRows.value.some(row => row.active))
const showShopDetailsSection = computed(() => summary.value.pricing_items_added > 0)
const hasBlockingErrors = computed(() => {
  return paperRows.value.some(row => Boolean(paperRowError(row))) || finishingRows.value.some(row => Boolean(finishingRowError(row)))
})

function clonePaperRow(row: PaperRow): PaperRow {
  return {
    key: row.key,
    id: row.id,
    label: row.label ?? '',
    paper_name: row.paper_name ?? '',
    gsm: row.gsm ?? null,
    paper_type: row.paper_type ?? '',
    category: row.category ?? '',
    size: row.size ?? 'SRA3/A3',
    supports_double_side: row.supports_double_side !== false,
    single_side_price: String(row.single_side_price ?? ''),
    double_side_price: String(row.double_side_price ?? ''),
    active: Boolean(row.active),
  }
}

function cloneFinishingRow(row: FinishingRow): FinishingRow {
  return {
    key: row.key,
    id: row.id,
    label: row.label ?? row.name ?? '',
    name: row.name ?? '',
    pricing_mode: row.pricing_mode ?? 'flat_per_job',
    unit: row.unit ?? 'job',
    price: String(row.price ?? ''),
    active: Boolean(row.active),
  }
}

function readPendingDraft(): PendingDraft | null {
  if (!import.meta.client) return null
  const raw = window.localStorage.getItem(PENDING_RATE_CARD_DRAFT_KEY)
    ?? window.localStorage.getItem(LEGACY_PENDING_RATE_CARD_DRAFT_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as PendingDraft
  } catch {
    return null
  }
}

function persistDraft() {
  if (!import.meta.client) return
  const payload: PendingDraft = {
    paper_rows: paperRows.value.map(clonePaperRow),
    finishing_rows: finishingRows.value.map(cloneFinishingRow),
    shop_details: { ...shopDetails },
  }
  window.localStorage.setItem(PENDING_RATE_CARD_DRAFT_KEY, JSON.stringify(payload))
  window.localStorage.removeItem(LEGACY_PENDING_RATE_CARD_DRAFT_KEY)
}

function clearDraft() {
  if (!import.meta.client) return
  window.localStorage.removeItem(PENDING_RATE_CARD_DRAFT_KEY)
  window.localStorage.removeItem(LEGACY_PENDING_RATE_CARD_DRAFT_KEY)
}

function applyPayload(payload: ConfigResponse | PendingDraft) {
  paperRows.value = (payload.paper_rows || []).map(clonePaperRow)
  finishingRows.value = (payload.finishing_rows || []).map(cloneFinishingRow)
  shopDetails.shop_name = payload.shop_details?.shop_name ?? ''
  shopDetails.whatsapp_number = payload.shop_details?.whatsapp_number ?? ''
  shopDetails.location_area = payload.shop_details?.location_area ?? ''
}

function paperRowError(row: PaperRow) {
  if (!row.active) return ''
  if (row.single_side_price === '' || Number(row.single_side_price) < 0 || Number.isNaN(Number(row.single_side_price))) {
    return 'Enter a valid non-negative single price.'
  }
  if (row.supports_double_side && row.double_side_price !== '' && (Number(row.double_side_price) < 0 || Number.isNaN(Number(row.double_side_price)))) {
    return 'Enter a valid non-negative double price or leave it blank.'
  }
  return ''
}

function finishingRowError(row: FinishingRow) {
  if (!row.active) return ''
  if (row.price === '' || Number(row.price) < 0 || Number.isNaN(Number(row.price))) {
    return 'Enter a valid non-negative finishing price.'
  }
  return ''
}

function formatKes(value: string | number | null | undefined) {
  if (value == null || value === '') return 'KES -'
  const amount = Number(value)
  if (!Number.isFinite(amount)) return `KES ${value}`
  return `KES ${amount.toLocaleString('en-KE', {
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`
}

function paperRowClass(row: PaperRow) {
  if (row.active && !paperRowError(row)) return 'border-[#d6e8dc] bg-[#f6fbf7]'
  if (row.active) return 'border-[#f0c3b7] bg-[#fff7f3]'
  return 'border-[#ece4de] bg-[#fcfbfa]'
}

function finishingRowClass(row: FinishingRow) {
  if (row.active && !finishingRowError(row)) return 'border-[#d6e8dc] bg-[#f6fbf7]'
  if (row.active) return 'border-[#f0c3b7] bg-[#fff7f3]'
  return 'border-[#ece4de] bg-[#fcfbfa]'
}

function normalizedPaperPrices() {
  return paperRows.value.map(row => ({
    key: row.key,
    single_side_price: row.single_side_price === '' ? null : row.single_side_price,
    double_side_price: !row.supports_double_side || row.double_side_price === '' ? null : row.double_side_price,
    active: row.active,
  }))
}

function normalizedFinishings() {
  return finishingRows.value.map(row => ({
    key: row.key,
    price: row.price === '' ? null : row.price,
    active: row.active,
  }))
}

function applyPreviewResponse(response: ConfigResponse) {
  summary.value = response.summary
  marketGuides.value = response.market_guides || {}
  marketLabel.value = response.market_label || 'Nairobi Market Guide'
  if (response.example_quote) {
    exampleQuote.value = response.example_quote
  }
}

function marketGuideFor(rowId: string, field: string): MarketGuide | null {
  return marketGuides.value?.[rowId]?.[field] || null
}

function marketGuideText(guide: MarketGuide | null) {
  if (!guide) return 'No market guide yet.'
  if (!guide.has_enough_data) return guide.message || 'No market guide yet.'
  return `Market range: ${formatKes(guide.min)} - ${formatKes(guide.max)} | Median: ${formatKes(guide.median)} | Mean: ${formatKes(guide.mean)} | Samples: ${guide.sample_count}`
}

function compactMarketGuideText(guide: MarketGuide | null) {
  if (!guide) return 'Reference range unavailable.'
  if (!guide.has_enough_data) return guide.message || 'Reference range unavailable.'
  return `Range ${formatKes(guide.min)} - ${formatKes(guide.max)} | Median ${formatKes(guide.median)}`
}

async function loadConfig() {
  configLoading.value = true
  try {
    const config = await publicApi<ConfigResponse>(API.forShopsRateCardPublicConfig(), { method: 'GET' })
    const draft = readPendingDraft()
    const hasKeyedDraft = Boolean(
      draft
      && draft.paper_rows?.every(row => row.key)
      && draft.finishing_rows?.every(row => row.key),
    )
    applyPayload(hasKeyedDraft ? draft as PendingDraft : config)
    if (!hasKeyedDraft) {
      applyPreviewResponse(config)
    }
    await fetchPreview()
  } catch (error: unknown) {
    previewError.value = 'We could not load the rate-card builder. Please try again.'
  } finally {
    configLoading.value = false
  }
}

async function fetchPreview() {
  previewLoading.value = true
  previewError.value = null
  try {
    const response = await publicApi<ConfigResponse>(API.forShopsRateCardPublicPreview(), {
      method: 'POST',
      body: {
        paper_prices: normalizedPaperPrices(),
        finishings: normalizedFinishings(),
      },
      timeout: 20000,
    })
    applyPreviewResponse(response)
  } catch (error: unknown) {
    previewError.value = 'We could not refresh the example quote. Please try again.'
  } finally {
    previewLoading.value = false
  }
}

function queuePreview() {
  persistDraft()
  if (previewTimer) clearTimeout(previewTimer)
  previewTimer = setTimeout(() => {
    fetchPreview()
  }, 250)
}

async function saveRateCard({ redirectToDashboard = false }: { redirectToDashboard?: boolean } = {}) {
  saveLoading.value = true
  saveError.value = null
  saveMessage.value = null
  authStatusMessage.value = null
  try {
    const response = await api<SaveResponse>(API.forShopsRateCardSave(), {
      method: 'POST',
      body: {
        shop: {
          name: shopDetails.shop_name.trim(),
          whatsapp: shopDetails.whatsapp_number.trim(),
          location: shopDetails.location_area.trim(),
        },
        paper_prices: normalizedPaperPrices(),
        finishings: normalizedFinishings(),
      },
    })

    clearDraft()
    await shopStore.fetchMyShops().catch(() => {})
    saveMessage.value = 'Your shop price list was saved.'
    notification.success('Your rate card is now attached to your shop.', 'Saved')
    if (redirectToDashboard) {
      await navigateTo(response.redirect_url || ROUTES.shopSetup, { replace: true })
    }
    return true
  } catch (error: unknown) {
    saveError.value = 'We could not save your rate card. Please try again.'
    notification.error(saveError.value, 'Save failed')
    return false
  } finally {
    saveLoading.value = false
  }
}

async function resumePendingSave() {
  if (!pendingResume.value || !isAuthenticated.value) return
  pendingResume.value = false
  authStatusMessage.value = 'Saving your price list...'
  await saveRateCard({ redirectToDashboard: true })
}

async function handleSaveClick() {
  if (hasBlockingErrors.value) return
  persistDraft()
  if (!isAuthenticated.value) {
    pendingResume.value = true
    authRedirectLoading.value = true
    authStatusMessage.value = 'Redirecting to sign up. Your price list will be saved right after login.'
    await navigateTo(buildShopOwnerSignupRoute(), { replace: true })
    return
  }
  await saveRateCard({ redirectToDashboard: true })
}

watch(
  () => [
    paperRows.value.map(row => `${row.key}|${row.single_side_price}|${row.double_side_price}|${row.active}`).join('::'),
    finishingRows.value.map(row => `${row.key}|${row.price}|${row.active}`).join('::'),
    shopDetails.shop_name,
    shopDetails.whatsapp_number,
    shopDetails.location_area,
  ],
  () => {
    saveMessage.value = null
    queuePreview()
  },
)

watch(isAuthenticated, async (authenticated) => {
  if (!authenticated) return
  await resumePendingSave()
}, { immediate: true })

onMounted(async () => {
  pendingResume.value = Boolean(readPendingDraft())
  await loadConfig()
  await resumePendingSave()
})

onBeforeUnmount(() => {
  if (previewTimer) clearTimeout(previewTimer)
})
</script>

<style scoped>
.builder-shell {
  --builder-bg: linear-gradient(135deg, #101828 0%, #1f2937 100%);
  --builder-panel: rgba(255, 255, 255, 0.06);
  --builder-panel-strong: rgba(255, 255, 255, 0.08);
  --builder-border: rgba(255, 255, 255, 0.1);
  --builder-text: #f8fafc;
  --builder-muted: #cbd5e1;
  background: var(--builder-bg);
  border-color: var(--builder-border);
  color: var(--builder-text);
}

:global(.dark) .builder-shell {
  --builder-bg: linear-gradient(180deg, #fffaf7 0%, #ffffff 100%);
  --builder-panel: rgba(255, 255, 255, 0.94);
  --builder-panel-strong: #faf7f5;
  --builder-border: #ead6cb;
  --builder-text: #111827;
  --builder-muted: #6b7280;
}

.builder-panel,
.builder-preview {
  border: 1px solid var(--builder-border);
  background: var(--builder-panel);
  color: var(--builder-text);
  border-radius: 1.65rem;
  box-shadow: 0 20px 55px -42px rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(12px);
}

.builder-kicker {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: #ffb49f;
}

:global(.dark) .builder-kicker {
  color: #c2410c;
}

.builder-copy {
  color: var(--builder-muted);
}

.builder-chip,
.builder-pill,
.builder-note,
.compact-readout,
.compact-toggle,
.compact-input,
.compact-guide {
  border: 1px solid var(--builder-border);
  background: var(--builder-panel-strong);
  color: var(--builder-text);
}

.builder-chip {
  border-radius: 1.25rem;
  padding: 0.9rem 1rem;
}

.builder-chip-kicker {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #ffb49f;
}

:global(.dark) .builder-chip-kicker {
  color: #c2410c;
}

.builder-pill {
  display: inline-flex;
  align-items: center;
  border-radius: 9999px;
  padding: 0.55rem 0.95rem;
  font-size: 0.875rem;
  font-weight: 700;
}

.builder-note {
  border-radius: 1rem;
  padding: 0.9rem 1rem;
  font-size: 0.875rem;
  color: var(--builder-muted);
}

.compact-rate-row {
  border-radius: 1.2rem;
  padding: 0.8rem;
}

.compact-rate-grid {
  display: grid;
  gap: 0.55rem;
  align-items: start;
}

@media (min-width: 1280px) {
  .compact-rate-grid {
    grid-template-columns: 1.15fr 0.82fr 0.82fr auto;
  }

  .compact-rate-grid.compact-rate-grid-finishing {
    grid-template-columns: 1.15fr 0.9fr auto;
  }
}

.compact-readout {
  border-radius: 0.95rem;
  padding: 0.75rem 0.9rem;
}

.compact-field {
  display: grid;
  gap: 0.35rem;
  font-size: 0.875rem;
}

.compact-label {
  font-weight: 700;
  color: var(--builder-text);
}

.compact-input {
  width: 100%;
  border-radius: 0.9rem;
  padding: 0.62rem 0.8rem;
  font-size: 0.875rem;
  outline: none;
}

.compact-input::placeholder {
  color: var(--builder-muted);
}

.compact-input:focus {
  border-color: #e13515;
  box-shadow: 0 0 0 1px #e13515;
}

.compact-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.compact-guide {
  border-radius: 0.85rem;
  padding: 0.45rem 0.65rem;
  font-size: 11px;
  line-height: 1.35;
  color: var(--builder-muted);
}

.compact-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  border-radius: 0.95rem;
  padding: 0.7rem 0.85rem;
  font-size: 0.875rem;
  font-weight: 700;
}

.builder-shell :deep(.text-\[\#111827\]),
.builder-shell :deep(.text-\[\#374151\]),
.builder-shell :deep(.text-\[\#6b7280\]),
.builder-shell :deep(.text-white),
.builder-shell :deep(.text-\[\#d1d5db\]),
.builder-shell :deep(.text-\[\#e5e7eb\]),
.builder-shell :deep(.text-\[\#cbd5e1\]),
.builder-shell :deep(.text-\[\#f3f4f6\]) {
  color: inherit;
}

.builder-shell :deep(.bg-white),
.builder-shell :deep(.bg-\[\#faf7f5\]),
.builder-shell :deep(.bg-\[\#fff7f3\]),
.builder-shell :deep(.bg-white\/5),
.builder-shell :deep(.bg-white\/10),
.builder-shell :deep(.bg-black\/10) {
  background: var(--builder-panel-strong);
}

.builder-shell :deep(.border-\[\#ead6cb\]),
.builder-shell :deep(.border-\[\#d8c8be\]),
.builder-shell :deep(.border-\[\#efe5df\]),
.builder-shell :deep(.border-\[\#f0d9cf\]),
.builder-shell :deep(.border-white\/10) {
  border-color: var(--builder-border);
}
</style>
