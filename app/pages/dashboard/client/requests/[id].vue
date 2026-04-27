<!-- Purpose: Client request detail page with shop response comparison. -->
<template>
  <DashboardShell sidebar-tone="light">
    <template #sidebar>
      <ClientSidebarNav />
    </template>

    <div class="space-y-6">
      <!-- Back nav -->
      <div>
        <NuxtLink
          to="/dashboard/client/requests"
          class="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--p-text-muted)] transition hover:text-[var(--p-text)]"
        >
          <Icon name="lucide:arrow-left" class="size-4" />
          My Requests
        </NuxtLink>
      </div>

      <!-- Loading state -->
      <div
        v-if="loading && !request"
        class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-10"
      >
        <div class="flex items-center justify-center gap-2 py-10 text-sm text-[var(--p-text-muted)]">
          <Icon name="lucide:loader-2" class="size-5 animate-spin" />
          Loading request...
        </div>
      </div>

      <!-- Error state -->
      <div
        v-else-if="loadError"
        class="rounded-2xl border border-[var(--p-error)]/30 bg-[var(--p-error-soft)] p-6 text-center"
      >
        <p class="font-semibold text-[var(--p-error)]">We couldn't load this request. Please try again.</p>
        <BaseButton variant="outline" size="sm" class="mt-4" @click="load">Try again</BaseButton>
      </div>

      <template v-else-if="request">

        <!-- ── 1. Request header ──────────────────────────────── -->
        <div class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm">
          <div class="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div class="min-w-0 space-y-3">
              <div class="flex flex-wrap items-center gap-2">
                <h1 class="text-2xl font-bold tracking-tight text-[var(--p-text)]">
                  {{ requestTitle }}
                </h1>
                <BaseBadge :tone="statusBadge.tone">{{ statusBadge.label }}</BaseBadge>
              </div>

              <div class="flex flex-col gap-1.5 text-sm text-[var(--p-text-muted)]">
                <div class="flex items-center gap-2">
                  <Icon name="lucide:layers" class="size-4 shrink-0" />
                  <span class="font-medium text-[var(--p-text)]">{{ specSummary }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <Icon name="lucide:store" class="size-4 shrink-0" />
                  <span>{{ shopsSummary }}</span>
                </div>
                <div v-if="createdLabel" class="flex items-center gap-2 text-xs">
                  <Icon name="lucide:calendar" class="size-3.5 shrink-0" />
                  <span>{{ createdLabel }}</span>
                </div>
              </div>
            </div>

            <!-- Header actions -->
            <div class="flex shrink-0 flex-wrap gap-2">
              <BaseButton
                v-if="responses.length"
                variant="primary"
                size="sm"
                @click="scrollToComparison"
              >
                Compare {{ responses.length }} responses
              </BaseButton>
              <BaseButton
                variant="outline"
                size="sm"
                disabled
                title="Ask all shops a question — coming soon"
              >
                <Icon name="lucide:message-square" class="mr-1.5 size-4" />
                Ask a question
              </BaseButton>
              <BaseButton
                variant="outline"
                size="sm"
                :disabled="briefBusy"
                @click="shareBrief"
              >
                <Icon name="lucide:share-2" class="mr-1.5 size-4" />
                Share brief
              </BaseButton>
              <BaseButton
                variant="outline"
                size="sm"
                :disabled="briefBusy"
                @click="downloadBriefPdf"
              >
                <Icon name="lucide:file-down" class="mr-1.5 size-4" />
                Download PDF
              </BaseButton>
              <BaseButton
                v-if="canEdit"
                variant="outline"
                size="sm"
                disabled
                title="Edit request — coming soon"
              >
                Edit request
              </BaseButton>
            </div>
          </div>
        </div>

        <!-- ── 2. Buyer reassurance ──────────────────────────── -->
        <div class="flex items-center gap-2 px-2 text-sm text-[var(--p-text-muted)]">
          <Icon name="lucide:shield-check" class="size-4 text-[var(--p-primary)]" />
          <p>Nothing is final until you accept a shop’s quote.</p>
        </div>

        <!-- ── 3. Smart summary cards ────────────────────────── -->
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <div
            v-for="card in summaryCards"
            :key="card.label"
            class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-4"
          >
            <p class="text-[11px] font-semibold uppercase tracking-widest text-[var(--p-text-muted)]">{{ card.label }}</p>
            <p class="mt-1 text-2xl font-semibold tracking-tight text-[var(--p-text)]">{{ card.value }}</p>
            <p v-if="card.sub" class="mt-0.5 text-xs text-[var(--p-text-muted)]">{{ card.sub }}</p>
          </div>
        </div>

        <!-- ── No responses empty state ──────────────────────── -->
        <template v-if="!responses.length && !pendingShops.length">
          <div
            v-if="strField(request, 'status') === 'draft'"
            class="rounded-3xl border border-dashed border-[var(--p-border)] p-12 text-center"
          >
            <Icon name="lucide:file-pen-line" class="mx-auto mb-4 size-12 text-[var(--p-text-muted)]" />
            <p class="text-lg font-bold text-[var(--p-text)]">This request has not been sent yet.</p>
            <p class="mt-1 text-sm text-[var(--p-text-muted)]">Customize your job and send it to shops to get quotes.</p>
            <BaseButton variant="primary" size="sm" class="mt-6 px-8" to="/">Send to shops</BaseButton>
          </div>

          <div v-else class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-bg-soft)] p-12 text-center">
            <Icon name="lucide:clock" class="mx-auto mb-4 size-12 text-[var(--p-text-muted)]" />
            <p class="text-lg font-bold text-[var(--p-text)]">Waiting for shop responses</p>
            <p class="mt-1 text-sm text-[var(--p-text-muted)]">
              Your request has been sent to {{ allRelatedRequests.length }} shops. We'll show prices here as they respond.
            </p>
          </div>
        </template>

        <template v-else>

          <!-- ── 3. Confirmation needs summary ────────────────── -->
          <div
            v-if="needsConfirmationResponses.length"
            class="rounded-3xl border border-[var(--p-warning)]/30 bg-[var(--p-warning-soft)] p-6"
          >
            <div class="flex items-start gap-4">
              <div class="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--p-warning)]/10 text-[var(--p-warning)]">
                <Icon name="lucide:alert-triangle" class="size-6" />
              </div>
              <div class="min-w-0 space-y-1">
                <h3 class="font-bold text-[var(--p-text)]">What still needs confirmation</h3>
                <p class="text-sm text-[var(--p-text-muted)]">
                  Some shops need extra details to finalize their price. You can ask them to confirm these points once you start a chat.
                </p>
                <div class="mt-4 flex flex-wrap gap-2">
                  <BaseBadge
                    v-for="item in Array.from(new Set(needsConfirmationResponses.flatMap(r => r.needs_confirmation)))"
                    :key="item"
                    tone="warning"
                  >
                    {{ item }}
                  </BaseBadge>
                </div>
              </div>
            </div>
          </div>

          <!-- ── 4. Response comparison cards ──────────────── -->
          <div ref="comparisonRef" class="space-y-6">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-bold text-[var(--p-text)]">Shop Responses</h2>
              <span class="text-xs text-[var(--p-text-muted)]">Prices are estimates until accepted</span>
            </div>

            <div class="space-y-4">
              <div
                v-for="resp in responses"
                :key="resp.id"
                class="relative overflow-hidden rounded-3xl border bg-[var(--p-surface)] shadow-sm transition hover:shadow-md"
                :class="resp.is_best_match ? 'border-[var(--p-primary)]' : 'border-[var(--p-border)]'"
              >
                <!-- Best match accent bar -->
                <div
                  v-if="resp.is_best_match"
                  class="h-1 w-full bg-[var(--p-primary)]"
                />

                <div class="p-6">
                  <!-- Shop identity row -->
                  <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div class="space-y-1.5">
                      <div class="flex flex-wrap items-center gap-2">
                        <p class="text-lg font-bold text-[var(--p-text)]">{{ resp.shop_name }}</p>
                        <BaseBadge :tone="matchBadgeTone(resp.match_type)">
                          {{ matchBadgeLabel(resp.match_type) }}
                          <span v-if="resp.match_score">· {{ resp.match_score }}%</span>
                        </BaseBadge>
                      </div>
                      <div class="flex items-center gap-3 text-xs text-[var(--p-text-muted)]">
                        <span v-if="resp.location_label" class="flex items-center gap-1">
                          <Icon name="lucide:map-pin" class="size-3" />
                          {{ resp.location_label }}
                        </span>
                        <span>Updated {{ formatDate(resp.updated_at) }}</span>
                      </div>
                    </div>

                    <!-- Best-option badges -->
                    <div class="flex flex-wrap gap-1.5">
                      <BaseBadge v-if="resp.is_lowest_price" tone="success">Best price</BaseBadge>
                      <BaseBadge v-if="resp.is_fastest" tone="info">Fastest</BaseBadge>
                      <BaseBadge v-if="resp.is_best_match" tone="primary">Best match</BaseBadge>
                    </div>
                  </div>

                  <!-- Price & Turnaround highlight -->
                  <div class="mt-6 grid grid-cols-1 gap-4 rounded-2xl bg-[var(--p-bg-soft)] p-4 sm:grid-cols-2">
                    <div class="space-y-1">
                      <p class="text-[10px] font-bold uppercase tracking-widest text-[var(--p-text-muted)]">Estimated Price</p>
                      <div class="flex items-baseline gap-2">
                        <p class="text-2xl font-black text-[var(--p-text)]">
                          {{ resp.price ? `${resp.currency} ${Number(resp.price).toLocaleString()}` : '—' }}
                        </p>
                        <BaseBadge tone="neutral" class="text-[9px]">
                          {{ priceConfidence(resp) }} Confidence
                        </BaseBadge>
                      </div>
                      <p v-if="resp.price_range_label" class="text-xs text-[var(--p-text-muted)]">
                        Range: {{ resp.price_range_label }}
                      </p>
                    </div>
                    <div class="space-y-1">
                      <p class="text-[10px] font-bold uppercase tracking-widest text-[var(--p-text-muted)]">Turnaround</p>
                      <div class="flex items-center gap-2">
                        <Icon name="lucide:zap" class="size-4 text-[var(--p-info)]" />
                        <p class="text-lg font-bold text-[var(--p-text)]">{{ resp.turnaround_label ?? 'Ready time on request' }}</p>
                      </div>
                      <p v-if="resp.availability_status" class="text-xs text-[var(--p-text-muted)]">
                        {{ resp.availability_status }}
                      </p>
                    </div>
                  </div>

                  <!-- Details grid -->
                  <div class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <!-- What's included -->
                    <div v-if="resp.included_items?.length" class="space-y-2">
                      <p class="text-[11px] font-bold uppercase tracking-widest text-[var(--p-text-muted)]">Can handle</p>
                      <div class="flex flex-wrap gap-1.5">
                        <span
                          v-for="item in resp.included_items"
                          :key="item"
                          class="inline-flex items-center rounded-lg bg-[var(--p-success-soft)] px-2 py-1 text-xs font-medium text-[var(--p-success)]"
                        >
                          <Icon name="lucide:check" class="mr-1 size-3" />
                          {{ item }}
                        </span>
                      </div>
                    </div>

                    <div v-if="resp.confirmed_specs?.length" class="space-y-2">
                      <p class="text-[11px] font-bold uppercase tracking-widest text-[var(--p-text-muted)]">Confirmed specs</p>
                      <div class="flex flex-wrap gap-1.5">
                        <span
                          v-for="item in resp.confirmed_specs"
                          :key="item"
                          class="inline-flex items-center rounded-lg bg-[var(--p-info-soft)] px-2 py-1 text-xs font-medium text-[var(--p-info)]"
                        >
                          <Icon name="lucide:badge-check" class="mr-1 size-3" />
                          {{ item }}
                        </span>
                      </div>
                    </div>

                    <!-- Needs confirmation -->
                    <div v-if="resp.needs_confirmation?.length" class="space-y-2">
                      <p class="text-[11px] font-bold uppercase tracking-widest text-[var(--p-warning)]">Needs confirmation</p>
                      <div class="flex flex-wrap gap-1.5">
                        <span
                          v-for="item in resp.needs_confirmation"
                          :key="item"
                          class="inline-flex items-center rounded-lg bg-[var(--p-warning-soft)] px-2 py-1 text-xs font-medium text-[var(--p-warning)]"
                        >
                          <Icon name="lucide:alert-circle" class="mr-1 size-3" />
                          {{ item }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Shop note -->
                  <div
                    v-if="resp.shop_note"
                    class="mt-6 rounded-2xl border border-[var(--p-border)] px-4 py-3 text-sm italic text-[var(--p-text-muted)]"
                  >
                    "{{ resp.shop_note }}"
                  </div>

                  <div
                    v-if="resp.alternative_suggestion"
                    class="mt-4 rounded-2xl border border-[var(--p-info)]/20 bg-[var(--p-info-soft)] px-4 py-3 text-sm text-[var(--p-text)]"
                  >
                    Alternative: {{ resp.alternative_suggestion }}
                  </div>

                  <!-- Per-response actions -->
                  <div class="mt-6 flex flex-wrap items-center gap-3 border-t border-[var(--p-border)] pt-6">
                    <template v-if="resp.status === 'pending' || resp.status === 'modified' || resp.status === 'sent' || resp.status === 'revised'">
                      <BaseButton
                        v-if="!resp.needs_confirmation?.length"
                        variant="primary"
                        size="sm"
                        class="px-8"
                        :disabled="acceptingId === resp.id"
                        @click="acceptQuote(resp)"
                      >
                        <Icon v-if="acceptingId === resp.id" name="lucide:loader-2" class="mr-1.5 size-3.5 animate-spin" />
                        Accept quote
                      </BaseButton>

                      <BaseButton
                        v-else
                        variant="primary"
                        size="sm"
                        disabled
                        title="Ask shop to confirm details — coming soon"
                      >
                        Ask shop to confirm
                      </BaseButton>

                      <BaseButton
                        variant="outline"
                        size="sm"
                        disabled
                        title="Ask a question — coming soon"
                      >
                        Ask question
                      </BaseButton>

                      <BaseButton
                        v-if="resp.whatsapp_available && resp.whatsapp_url"
                        variant="outline"
                        size="sm"
                        :to="resp.whatsapp_url"
                        target="_blank"
                      >
                        <Icon name="logos:whatsapp-icon" class="mr-1.5 size-4" />
                        {{ resp.whatsapp_label || 'WhatsApp' }}
                      </BaseButton>
                      <span
                        v-else-if="resp.whatsapp_label"
                        class="inline-flex items-center rounded-full bg-[var(--p-bg-soft)] px-3 py-1.5 text-xs font-medium text-[var(--p-text-muted)]"
                      >
                        {{ resp.whatsapp_label }}
                      </span>

                      <BaseButton
                        variant="ghost"
                        size="sm"
                        :to="`/shops/${resp.shop_slug}`"
                      >
                        View shop
                      </BaseButton>
                    </template>

                    <template v-else-if="resp.status === 'accepted'">
                      <div class="flex items-center gap-2 text-[var(--p-success)]">
                        <Icon name="lucide:check-circle-2" class="size-5" />
                        <span class="font-bold">Quote Accepted</span>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ── 5. Pending shops ──────────────────────────────── -->
          <div v-if="pendingShops.length" class="space-y-4">
            <h3 class="text-sm font-bold uppercase tracking-widest text-[var(--p-text-muted)]">Waiting for response</h3>
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div
                v-for="pending in pendingShops"
                :key="pending.id"
                class="rounded-2xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface)]/50 p-4"
              >
                <div class="flex items-center justify-between">
                  <p class="font-semibold text-[var(--p-text-muted)]">{{ pending.shop_name }}</p>
                  <Icon name="lucide:clock" class="size-4 animate-pulse text-[var(--p-text-muted)]" />
                </div>
                <p class="mt-1 text-xs text-[var(--p-text-muted)]">Sent {{ formatDate(String(pending.created_at ?? '')) }}</p>
                <BaseButton variant="ghost" size="sm" class="mt-3 w-full" disabled>Send reminder</BaseButton>
              </div>
            </div>
          </div>
        </template>

        <!-- ── 8. Request timeline ────────────────────────────── -->
        <DashboardSectionCard title="Timeline">
          <div class="relative space-y-5 pl-5 before:absolute before:inset-y-0 before:left-1.5 before:border-l before:border-dashed before:border-[var(--p-border)]">
            <div
              v-for="(event, i) in timelineEvents"
              :key="i"
              class="relative flex items-start gap-3"
            >
              <div
                class="absolute -left-5 top-0.5 size-3 rounded-full border-2 border-[var(--p-surface)]"
                :style="{ background: event.done ? 'var(--p-primary)' : 'var(--p-border-strong)' }"
              />
              <div>
                <p class="text-sm font-medium text-[var(--p-text)]">{{ event.label }}</p>
                <p v-if="event.time" class="text-xs text-[var(--p-text-muted)]">{{ event.time }}</p>
              </div>
            </div>
          </div>
        </DashboardSectionCard>

        <!-- ── 9. Files / artwork section ────────────────────── -->
        <DashboardSectionCard title="Artwork &amp; files">
          <template v-if="artworkFiles.length">
            <div class="space-y-2">
              <div
                v-for="file in artworkFiles"
                :key="file.id ?? file.name"
                class="flex items-center gap-3 rounded-2xl border border-[var(--p-border)] p-3 text-sm"
              >
                <Icon name="lucide:file" class="size-5 shrink-0 text-[var(--p-text-muted)]" />
                <div class="min-w-0 flex-1">
                  <p class="truncate font-medium text-[var(--p-text)]">{{ file.name }}</p>
                  <p v-if="file.type || file.uploaded_at" class="text-xs text-[var(--p-text-muted)]">
                    <span v-if="file.type">{{ file.type }}</span>
                    <span v-if="file.type && file.uploaded_at"> · </span>
                    <span v-if="file.uploaded_at">{{ formatDate(file.uploaded_at) }}</span>
                  </p>
                </div>
              </div>
            </div>
          </template>
          <div v-else class="rounded-2xl border border-dashed border-[var(--p-border)] p-8 text-center">
            <Icon name="lucide:file-image" class="mx-auto mb-2 size-9 text-[var(--p-text-muted)]" />
            <p class="font-medium text-[var(--p-text)]">No artwork uploaded</p>
            <p class="mt-0.5 text-sm text-[var(--p-text-muted)]">Clear artwork helps shops quote faster.</p>
            <BaseButton variant="outline" size="sm" class="mt-4" to="/dashboard/client/files">
              Upload artwork
            </BaseButton>
          </div>
        </DashboardSectionCard>

      </template>

      <div
        v-else
        class="rounded-3xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface)] p-12 text-center"
      >
        <Icon name="lucide:file-search" class="mx-auto mb-4 size-10 text-[var(--p-text-muted)]" />
        <p class="text-lg font-bold text-[var(--p-text)]">This request is not available.</p>
        <p class="mt-1 text-sm text-[var(--p-text-muted)]">It may have been removed or you may not have access to it.</p>
        <BaseButton variant="outline" size="sm" class="mt-5" to="/dashboard/client/requests">Back to requests</BaseButton>
      </div>
    </div>
  </DashboardShell>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useNotification } from '~/composables/useNotification'
import { useQuoteRequests } from '~/composables/useQuoteRequests'
import { useQuoteInboxStore } from '~/stores/quoteInbox'
import type { QuoteResponseRecord } from '~/stores/quoteInbox'
import { API } from '~/shared/api-paths'
import ClientSidebarNav from '~/components/dashboard/client/ClientSidebarNav.vue'
import DashboardShell from '~/components/dashboard/shared/DashboardShell.vue'
import DashboardSectionCard from '~/components/dashboard/shared/DashboardSectionCard.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseBadge from '~/components/ui/BaseBadge.vue'
import { normalizeQuoteRequestStatus, normalizeQuoteResponseStatus, quoteRequestStatusLabel } from '~/utils/quoteStatus'

definePageMeta({ layout: 'dashboard' })

// ── Route ───────────────────────────────────────────────────────────
const route = useRoute()
const id = computed(() => Number(route.params.id))
const toast = useToast()
const notification = useNotification()
const quoteRequests = useQuoteRequests()

// ── Store ────────────────────────────────────────────────────────────
const store = useQuoteInboxStore()
const { clientRequests } = storeToRefs(store)

// ── Local state ──────────────────────────────────────────────────────
const request = ref<Record<string, any> | null>(null)
const loading = ref(true)
const loadError = ref<string | null>(null)
const acceptingId = ref<number | null>(null)
const comparisonRef = ref<HTMLElement | null>(null)
const briefBusy = ref(false)

// ── Siblings Aggregation ─────────────────────────────────────────────
const sourceDraftId = computed(() => request.value?.source_draft || request.value?.source_draft_id)

const siblingRequests = computed(() => {
  if (!sourceDraftId.value) return []
  return clientRequests.value.filter(r => 
    (r.source_draft === sourceDraftId.value || r.id === id.value) && r.id !== id.value
  )
})

const allRelatedRequests = computed(() => {
  const list = [...siblingRequests.value]
  if (request.value) {
    // Merge detail data with store summary data if available
    const summary = clientRequests.value.find(r => r.id === id.value)
    list.push({ ...summary, ...request.value } as any)
  }
  return list
})

// ── Normalized responses from all shops ──────────────────────────────
interface NormalizedResponse {
  id: number
  request_id: number
  shop_id: number | null
  shop_name: string
  shop_slug: string
  location_label: string
  match_type: string
  match_score: number | null
  price: string | null
  price_min: string | null
  price_max: string | null
  price_range_label: string
  currency: string
  turnaround_label: string
  status: string
  included_items: string[]
  confirmed_specs: string[]
  needs_confirmation: string[]
  shop_note: string
  alternative_suggestion: string
  availability_status: string
  is_lowest_price: boolean
  is_fastest: boolean
  is_best_match: boolean
  updated_at: string
  whatsapp_available: boolean
  whatsapp_url: string
  whatsapp_label: string
}

function normalizeResponse(raw: any, requestId: number): NormalizedResponse {
  const snap = raw.response_snapshot ?? {}
  const revised = raw.revised_pricing_snapshot ?? {}
  const currency = snap.currency || 'KES'
  const priceMin = snap.price_min != null ? String(snap.price_min) : null
  const priceMax = snap.price_max != null ? String(snap.price_max) : null
  return {
    id: raw.id,
    request_id: requestId,
    shop_id: typeof raw.shop === 'number' ? raw.shop : null,
    shop_name: snap.shop_name || `Shop ${raw.shop}`,
    shop_slug: snap.shop_slug || '',
    location_label: snap.location_label || '',
    match_type: snap.match_type || raw.status,
    match_score: snap.match_score != null ? Number(snap.match_score) : null,
    price: raw.total ?? revised.total ?? snap.price ?? null,
    price_min: priceMin,
    price_max: priceMax,
    price_range_label: priceMin && priceMax
      ? `${currency} ${Number(priceMin).toLocaleString()} - ${currency} ${Number(priceMax).toLocaleString()}`
      : '',
    currency,
    turnaround_label: snap.turnaround_label
      || (raw.turnaround_days ? `${raw.turnaround_days} day${raw.turnaround_days !== 1 ? 's' : ''}` : ''),
    status: normalizeQuoteResponseStatus(raw.status),
    included_items: extractStringArray(snap.included_items),
    confirmed_specs: extractStringArray(snap.confirmed_specs),
    needs_confirmation: extractStringArray(snap.needs_confirmation),
    shop_note: raw.note ?? snap.shop_note ?? '',
    alternative_suggestion: snap.alternative_suggestion ?? '',
    availability_status: snap.availability_status ?? '',
    is_lowest_price: Boolean(snap.is_lowest_price),
    is_fastest: Boolean(snap.is_fastest),
    is_best_match: Boolean(snap.is_best_match),
    updated_at: raw.sent_at ?? raw.created_at ?? '',
    whatsapp_available: Boolean(raw.whatsapp_available),
    whatsapp_url: typeof raw.whatsapp_url === 'string' ? raw.whatsapp_url : '',
    whatsapp_label: typeof raw.whatsapp_label === 'string' ? raw.whatsapp_label : '',
  }
}

const responses = computed((): NormalizedResponse[] => {
  const list: NormalizedResponse[] = []
  allRelatedRequests.value.forEach(req => {
    if (req.latest_response) {
      list.push(normalizeResponse(req.latest_response, req.id))
    }
  })

  // Infer best-option flags across all shops
  if (list.length > 1) {
    if (!list.some(r => r.is_lowest_price)) {
      const prices = list.map(r => r.price ? parseFloat(String(r.price)) : Infinity).filter(isFinite)
      const minPrice = Math.min(...prices)
      if (isFinite(minPrice)) {
        list.forEach(r => {
          if (r.price && Math.abs(parseFloat(String(r.price)) - minPrice) < 0.01) r.is_lowest_price = true
        })
      }
    }
    // ... similar for fastest and best match if needed
  }
  return list
})

const pendingShops = computed(() => {
  return allRelatedRequests.value.filter(req => !req.latest_response)
})

const rawResponses = computed(() => responses.value)

const needsConfirmationResponses = computed(() =>
  responses.value.filter(r => r.needs_confirmation.length > 0),
)

// ── Request display helpers ──────────────────────────────────────────
const requestTitle = computed(() => {
  const title = strField(request.value, 'title')
  if (title) return title
  const snapshot = request.value?.request_snapshot?.calculator_inputs || {}
  const productType = snapshot.product_type || strField(request.value, 'job_type')
  const qty = snapshot.quantity || numField(request.value, 'quantity')
  
  if (productType) {
    const label = String(productType).replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    return qty ? `${label} — ${qty.toLocaleString()} pcs` : label
  }
  return `Request #${id.value}`
})

const specSummary = computed(() => {
  const snapshot = request.value?.request_snapshot?.calculator_inputs || {}
  const parts: string[] = []
  const size = snapshot.finished_size || strField(request.value, 'size_label')
  const paper = snapshot.paper_stock || strField(request.value, 'paper_label')
  const lamination = snapshot.lamination || strField(request.value, 'finishing_labels')
  
  if (size) parts.push(size)
  if (paper) parts.push(String(paper).replace(/_/g, ' '))
  if (lamination) parts.push(String(lamination).replace(/-/g, ' '))
  return parts.join(' · ')
})

const shopsSummary = computed(() => {
  const total = allRelatedRequests.value.length || numField(request.value, 'shops_contacted_count') || 0
  const responded = responses.value.length
  if (!total) return 'No shops contacted yet'
  return `${responded} of ${total} shop${total !== 1 ? 's' : ''} responded`
})


const createdLabel = computed(() => {
  const created = strField(request.value, 'created_at')
  if (!created) return ''
  return `Sent ${formatDate(created)}`
})

const statusBadge = computed((): { label: string; tone: 'neutral' | 'primary' | 'warning' | 'success' | 'error' } => {
  const status = normalizeQuoteRequestStatus(strField(request.value, 'status'))
  const map: Record<string, { label: string; tone: 'neutral' | 'primary' | 'warning' | 'success' | 'error' }> = {
    pending: { label: 'Waiting on shops', tone: 'primary' },
    sent: { label: 'Sent', tone: 'primary' },
    viewed: { label: 'Viewed', tone: 'neutral' },
    needs_confirmation: { label: 'Needs confirmation', tone: 'warning' },
    responded: { label: 'Responses in', tone: 'warning' },
    accepted: { label: 'Quote accepted', tone: 'success' },
    rejected: { label: 'Rejected', tone: 'error' },
    expired: { label: 'Expired', tone: 'error' },
    cancelled: { label: 'Cancelled', tone: 'error' },
  }
  return map[status] ?? { label: quoteRequestStatusLabel(status), tone: 'neutral' }
})

const canEdit = computed(() => ['pending', 'sent'].includes(normalizeQuoteRequestStatus(strField(request.value, 'status'))))
const canCancel = computed(() => !['accepted', 'cancelled', 'expired', 'rejected'].includes(normalizeQuoteRequestStatus(strField(request.value, 'status'))))

// ── Summary cards ────────────────────────────────────────────────────
const summaryCards = computed(() => {
  const contacted = allRelatedRequests.value.length || numField(request.value, 'shops_contacted_count') || 0
  const responded = responses.value.length
  const lowestResp = responses.value.find(r => r.is_lowest_price)
  const fastestResp = responses.value.find(r => r.is_fastest)
  const confirmCount = needsConfirmationResponses.value.length
  
  return [
    { label: 'Shops contacted', value: contacted ? String(contacted) : '—', sub: '' },
    { label: 'Responses', value: responded ? String(responded) : '0', sub: 'From shops' },
    {
      label: 'Best price',
      value: lowestResp?.price ? `${lowestResp.currency} ${Number(lowestResp.price).toLocaleString()}` : '—',
      sub: lowestResp?.shop_name ?? 'Waiting...',
    },
    {
      label: 'Fastest',
      value: fastestResp?.turnaround_label || '—',
      sub: fastestResp?.shop_name ?? 'Waiting...',
    },
    {
      label: 'To confirm',
      value: confirmCount ? String(confirmCount) : '—',
      sub: confirmCount ? `${confirmCount} items` : 'All clear',
    },
  ]
})

// ── Timeline ─────────────────────────────────────────────────────────
const timelineEvents = computed(() => {
  const events = []
  const created = strField(request.value, 'created_at')
  const sent = strField(request.value, 'sent_at')
  const status = normalizeQuoteRequestStatus(strField(request.value, 'status'))
  events.push({ label: 'Request created', time: created ? formatDate(created) : null, done: true })
  events.push({ label: 'Sent to shops', time: sent ? formatDate(sent) : (created ? formatDate(created) : null), done: !!created })
  events.push({ label: 'Shop responses received', time: rawResponses.value.length ? `${rawResponses.value.length} received` : null, done: rawResponses.value.length > 0 })
  events.push({ label: 'Buyer accepted quote', time: null, done: status === 'accepted' })
  events.push({ label: 'Job started', time: null, done: false })
  return events
})

// ── Artwork files ────────────────────────────────────────────────────
interface ArtworkFile { id?: number; name: string; type?: string; uploaded_at?: string }
const artworkFiles = computed((): ArtworkFile[] => {
  const raw = request.value?.artwork_files
  if (!raw) return []
  if (Array.isArray(raw)) return raw as ArtworkFile[]
  return []
})

// ── Match badge helpers ───────────────────────────────────────────────
function matchBadgeLabel(matchType: string): string {
  const labels: Record<string, string> = {
    exact_match: 'Exact match',
    close_match: 'Close match',
    needs_confirmation: 'Needs confirmation',
    manual_quote: 'Manual quote',
  }
  return labels[matchType] ?? matchType ?? 'Unknown'
}

function matchBadgeTone(matchType: string): 'primary' | 'success' | 'warning' | 'neutral' {
  const tones: Record<string, 'primary' | 'success' | 'warning' | 'neutral'> = {
    exact_match: 'success',
    close_match: 'primary',
    needs_confirmation: 'warning',
    manual_quote: 'neutral',
  }
  return tones[matchType] ?? 'neutral'
}

function priceConfidence(resp: NormalizedResponse): 'High' | 'Medium' | 'Low' {
  if (resp.match_type === 'exact_match') return 'High'
  if (resp.match_type === 'close_match' || resp.match_type === 'needs_confirmation') return 'Medium'
  return 'Low'
}

// ── Data helpers ─────────────────────────────────────────────────────
function strField(obj: any | null, key: string): string {
  const v = obj?.[key]
  return typeof v === 'string' ? v : (v != null ? String(v) : '')
}
function numField(obj: any | null, key: string): number | null {
  const v = obj?.[key]
  return typeof v === 'number' ? v : (v != null ? Number(v) || null : null)
}
function extractStringArray(v: unknown): string[] {
  if (!v) return []
  if (Array.isArray(v)) return v.map(String)
  if (typeof v === 'string') return v.split(',').map(s => s.trim()).filter(Boolean)
  return []
}

// ── Date formatter ────────────────────────────────────────────────────
function formatDate(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60_000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ── Scroll helper ─────────────────────────────────────────────────────
function scrollToComparison() {
  comparisonRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

async function shareBrief() {
  briefBusy.value = true
  try {
    const brief = await quoteRequests.getBrief(id.value)
    const summary = typeof brief.summary === 'string' ? brief.summary : `Printy request #${id.value}`
    if (navigator.share) {
      await navigator.share({
        title: requestTitle.value,
        text: summary,
      })
    } else if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(summary)
      toast.add({ title: 'Brief copied', description: 'The request brief is ready to paste or forward.', color: 'success' })
    } else {
      throw new Error('Sharing is not available in this browser.')
    }
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') return
    toast.add({
      title: 'Share brief failed',
      description: err instanceof Error ? err.message : 'Could not prepare the request brief.',
      color: 'error',
    })
  } finally {
    briefBusy.value = false
  }
}

async function downloadBriefPdf() {
  briefBusy.value = true
  try {
    await quoteRequests.downloadPdf(id.value)
  } catch (err) {
    toast.add({
      title: 'Download failed',
      description: err instanceof Error ? err.message : 'Could not download the request PDF.',
      color: 'error',
    })
  } finally {
    briefBusy.value = false
  }
}

// ── Data fetching ─────────────────────────────────────────────────────
async function load() {
  loading.value = true
  loadError.value = null
  try {
    const { $api } = useNuxtApp()
    
    // Ensure store data is loaded for siblings aggregation
    if (!store.loaded) {
      await store.fetchClientRequests()
    }

    const reqData = await $api<Record<string, unknown>>(API.quoteRequestDetail(id.value))
    request.value = reqData
  } catch (err) {
    loadError.value = err instanceof Error ? err.message : 'Failed to load request.'
    request.value = null
  } finally {
    loading.value = false
  }
}

// ── Accept quote ──────────────────────────────────────────────────────
async function acceptQuote(resp: NormalizedResponse) {
  if (!confirm('Are you sure you want to accept this quote? This will notify the shop and move the request to production.')) return

  acceptingId.value = resp.id
  try {
    const { $api } = useNuxtApp()
    await $api(API.quoteRequestAccept(resp.request_id), {
      method: 'POST',
      body: { sent_quote_id: resp.id },
    })
    await load()
    await store.fetchClientRequests()
    notification.success('The shop has been notified and this request is moving ahead.', 'Quote accepted')
  } catch (err) {
    notification.error(err instanceof Error ? err.message : 'Could not accept this quote.', 'Accept quote failed')
  } finally {
    acceptingId.value = null
  }
}

onMounted(load)
</script>
