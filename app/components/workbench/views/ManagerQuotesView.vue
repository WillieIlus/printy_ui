<template>
  <DesignManagerSurface>
    <div class="flex flex-col gap-8">
      <div class="flex flex-col gap-3">
        <NuxtLink
          to="/app/manager"
          class="inline-flex w-fit items-center gap-1.5 font-mono text-[10px] tracking-[0.16em] text-ink-3 uppercase transition-colors hover:text-brand"
        >
          <ArrowLeft :size="12" /> Back to dashboard
        </NuxtLink>
        <DesignManagerPageHeader
          index="MQ"
          kicker="Quote prep"
          title="One quote screen."
          subtitle="Choose a printer, set one margin, send."
          description="Pick a printer, set your margin, and send the priced quote to your client. Artwork, client and decline details stay on this same screen."
        >
          <template #actions>
            <button
              v-if="!showAddClient"
              class="inline-flex items-center gap-2 rounded-xl border border-brand bg-card px-4 py-2.5 font-mono text-[10px] font-bold tracking-[0.12em] text-brand uppercase transition-colors hover:bg-mint"
              data-test="toggle-add-client"
              @click="showAddClient = true"
            >
              <UserPlus :size="12" /> Add a client
            </button>
            <button
              v-else
              class="inline-flex items-center gap-2 rounded-xl border border-line-strong bg-card px-4 py-2.5 font-mono text-[10px] font-semibold tracking-[0.12em] text-ink-2 uppercase transition-colors hover:border-brand hover:text-brand"
              data-test="close-add-client"
              @click="showAddClient = false"
            >
              Close
            </button>
          </template>
        </DesignManagerPageHeader>

        <div v-if="showAddClient" class="max-w-[640px]">
          <ManagerAddClientPanel @created="onClientCreated" />
        </div>

        <DesignAlert v-if="clientCreatedNote" tone="success" data-test="add-client-note">
          {{ clientCreatedNote }}
          <template #actions>
            <button
              type="button"
              class="font-mono text-[9px] font-bold tracking-[0.12em] uppercase underline underline-offset-2"
              @click="clientCreatedNote = ''"
            >
              Dismiss
            </button>
          </template>
        </DesignAlert>
      </div>

      <DesignLoading
        v-if="m.loading && !m.hasQuotes"
        label="Loading your quote workload…"
      />

      <DesignAlert v-else-if="m.error && !m.hasQuotes" tone="error">
        <p class="max-w-[52ch] leading-relaxed">{{ m.error }}</p>
        <template #actions>
          <button class="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 font-mono text-[10px] font-semibold tracking-[0.14em] text-white uppercase transition-colors hover:bg-brand-deep" @click="m.fetchQuotes()">
            <RefreshCw :size="12" /> Try again
          </button>
        </template>
      </DesignAlert>

      <DesignEmptyNote
        v-else-if="!m.hasQuotes"
        icon="ReceiptText"
        title="No quote requests waiting"
        hint="No quote requests are waiting on you right now."
      />

      <div v-else class="grid gap-6 lg:grid-cols-[320px_1fr]">
        <!-- ── workload list ── -->
        <aside class="space-y-4">
          <DesignManagerSection index="01" title="Quote workload" :hint="String(m.quotes.length)">
            <div class="space-y-4">
              <div v-for="section in quoteSections" :key="section.key" class="space-y-2">
                <div class="flex items-center gap-2 pl-1">
                  <h3 class="font-mono text-[10px] font-semibold tracking-[0.18em] uppercase" :style="{ color: section.muted ? 'var(--sub)' : 'var(--ink)' }">{{ section.label }}</h3>
                  <span class="rounded-full bg-paper-2 px-2 py-[1px] font-mono text-[9px] font-semibold text-ink-2">{{ section.items.length }}</span>
                </div>
                <button
                  v-for="row in section.items"
                  :key="row.id"
                  class="w-full rounded-2xl border p-3.5 text-left transition-colors hover:border-brand/60"
                  :class="[isMuted(row) ? 'opacity-60' : '', needsAttention(row) ? 'ring-2' : '']"
                  :style="{ borderColor: m.activeQuote?.id === row.id ? 'var(--accent)' : 'var(--line)', background: 'var(--panel)' }"
                  @click="select(row)"
                >
                  <div class="flex items-center justify-between gap-2">
                    <span class="font-mono text-[10px] tracking-[0.12em] text-brand" :class="{ 'font-bold': needsAttention(row) }">{{ row.quote_request_reference || row.reference }}</span>
                    <span class="rounded-full px-2 py-[1px] font-mono text-[9px] tracking-[0.1em] uppercase" :style="statusStyle(row.raw_status)">{{ row.status_label || row.raw_status }}</span>
                  </div>
                  <div class="mt-1.5 truncate text-[14px] font-bold tracking-tight">{{ row.product || 'Print job' }}</div>
                  <div class="mt-1 truncate text-[11.5px] text-ink-2">{{ row.customer_name || 'Client' }}<span v-if="row.shop_name"> · {{ row.shop_name }}</span></div>
                  <!-- LAW: the server decided this quote belongs to the manager's own
                       client, so the Printy fee is 0%. -->
                  <span
                    v-if="row.fee_waived"
                    data-test="quote-row-fee-waived"
                    class="mt-1.5 inline-flex items-center gap-1 rounded-full bg-mint px-2 py-[1px] font-mono text-[8.5px] tracking-[0.1em] text-brand-deep uppercase"
                  >
                    <BadgeCheck :size="9" /> 0% Printy fee: your own client
                  </span>
                </button>
              </div>
            </div>
          </DesignManagerSection>
        </aside>

        <!-- ── detail ── -->
        <section class="min-w-0">
          <DesignCard v-if="!m.activeQuote" class="p-8 text-center text-[13px] text-ink-2">
            Pick a request to prepare its quote.
          </DesignCard>

          <div v-else class="space-y-5" data-test="manager-quote-one-screen">
            <DesignCard class="p-5">
              <div class="flex flex-wrap items-center gap-3">
                <div class="min-w-0 flex-1">
                  <div class="text-[18px] font-bold tracking-tight">{{ m.activeQuote.product || 'Print job' }}</div>
                  <div class="mt-0.5 text-[12px] text-ink-2">
                    {{ m.activeQuote.customer_name || 'Client' }} · {{ m.activeQuote.quote_request_reference || m.activeQuote.reference }}
                    <span v-if="m.activeQuote.assigned_manager_name"> · manager {{ m.activeQuote.assigned_manager_name }}</span>
                  </div>
                </div>
                <span class="rounded-full px-2.5 py-1 font-mono text-[9.5px] tracking-[0.1em] uppercase" :style="statusStyle(m.activeQuote.raw_status)">{{ m.activeQuote.status_label || m.activeQuote.raw_status }}</span>
              </div>
              <!-- LAW: 0% Printy fee on the manager's own client, decided by the server. -->
              <div
                v-if="feeWaived"
                data-test="quote-fee-waived"
                class="mt-3 inline-flex items-center gap-1.5 rounded-full bg-mint px-3 py-1 font-mono text-[9.5px] font-bold tracking-[0.1em] text-brand-deep uppercase"
              >
                <BadgeCheck :size="11" /> 0% Printy fee: your own client
              </div>
              <div v-if="prefillRows.length" data-test="manager-prefill" class="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
                <div v-for="p in prefillRows" :key="p.label">
                  <div class="font-mono text-[8.5px] tracking-[0.12em] text-ink-3 uppercase">{{ p.label }}</div>
                  <div class="truncate text-[12.5px] text-ink">{{ p.value }}</div>
                </div>
              </div>
              <p v-if="m.prefill?.client_notes" class="mt-4 rounded-xl bg-paper-2 px-3 py-2 text-[12px] leading-relaxed text-ink-2">
                “{{ m.prefill.client_notes }}”
              </p>
            </DesignCard>

            <!-- Artwork the client sent (or declared) before quoting. -->
            <DesignCard
              v-if="m.activeQuote.artwork"
              data-test="manager-request-artwork"
              class="p-5"
            >
              <div class="flex flex-wrap items-center justify-between gap-2">
                <DesignSectionLabel index="01" tone="brand">Artwork</DesignSectionLabel>
                <span
                  class="rounded-full px-2.5 py-1 font-mono text-[9px] font-bold tracking-[0.1em] uppercase"
                  :class="m.activeQuote.artwork.state === 'missing' ? 'bg-paper-2 text-ink-3' : 'bg-mint text-brand-deep'"
                >
                  {{ m.activeQuote.artwork.state === 'uploaded' ? 'File received' : m.activeQuote.artwork.state === 'with_manager' ? 'Client says you have it' : 'Not received yet' }}
                </span>
              </div>

              <div v-if="m.activeQuote.artwork.state === 'uploaded' && m.activeQuote.artwork.files.length" class="mt-3 space-y-2">
                <a
                  v-for="file in m.activeQuote.artwork.files"
                  :key="file.id"
                  :href="file.download_url"
                  target="_blank"
                  rel="noopener"
                  class="flex items-center justify-between gap-3 rounded-xl border border-line bg-paper-2 px-4 py-3 transition-colors hover:border-brand"
                >
                  <span class="flex min-w-0 items-center gap-2">
                    <Paperclip :size="14" class="shrink-0 text-brand" />
                    <span class="truncate text-[13px] font-semibold text-ink">{{ file.name }}</span>
                  </span>
                  <span class="shrink-0 font-mono text-[9.5px] font-bold tracking-[0.1em] text-brand-deep uppercase">Download</span>
                </a>
              </div>
              <p v-else-if="m.activeQuote.artwork.state === 'with_manager'" class="mt-3 text-[12.5px] leading-relaxed text-ink-2">
                The client says the artwork is already with you. Confirm it before production; you can still quote this request now.
              </p>
              <p v-else class="mt-3 text-[12.5px] leading-relaxed text-ink-2">
                No artwork yet. You can prepare and send the quote; the client can add the file before accepting.
              </p>
            </DesignCard>

            <!-- law 10.6 — the signed single-job client link the client opens -->
            <ManagerClientLinkPanel :quote-request-id="m.activeQuote.id" />

            <!-- production options -->
            <DesignCard class="p-5">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <DesignSectionLabel index="02" tone="brand">Production options</DesignSectionLabel>
                <button class="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3 py-2 font-mono text-[9.5px] font-bold tracking-[0.12em] text-white uppercase transition-colors hover:bg-brand-deep disabled:opacity-50" :disabled="m.saving" @click="loadOptions">
                  <Loader2 v-if="m.saving" :size="12" class="animate-spin" /> <Search v-else :size="12" /> Find printer shops
                </button>
              </div>

              <div v-if="m.shopOptions?.missing_fields?.length" class="mt-3 rounded-xl bg-amber-soft px-3 py-2 text-[11.5px] text-amber">
                Request is missing: {{ m.shopOptions.missing_fields.map((f) => SPEC_MISSING_LABELS[f] ?? f.replace(/[_-]/g, ' ')).join(', ') }}
              </div>

              <div v-if="shops.length" class="mt-4 space-y-2">
                <!-- Item 2 — one shared ExpandableCard per printer option: the
                     header always carries the shop and its quote, the body opens
                     on click with the itemised lines and the imposed sheet. -->
                <ExpandableCard
                  v-for="s in shops"
                  :key="String(s.shop_id ?? s.id)"
                  :id="`shop-option-${shopKey(s)}`"
                  :open="openShopId === shopKey(s)"
                  :attention="selectedShopId === shopKey(s)"
                  :scroll-on-open="false"
                  :class="s.eligible === false ? 'opacity-70' : ''"
                  @toggle="(next: boolean) => onToggleOption(s, next)"
                >
                  <template #summary>
                    <span class="flex h-4 w-4 shrink-0 items-center justify-center rounded-full" :style="selectedShopId === shopKey(s) ? { background: 'var(--accent)' } : { boxShadow: 'inset 0 0 0 1.5px var(--line)' }">
                      <Check v-if="selectedShopId === shopKey(s)" :size="10" stroke-width="4" class="text-[var(--accentInk)]" />
                    </span>
                    <div class="min-w-0 flex-1">
                      <div class="truncate text-[13px] font-semibold">{{ s.name }}</div>
                      <div class="truncate text-[11px] text-[var(--sub)]">{{ s.location || '—' }}<span v-if="s.eligible === false"> · {{ s.ineligible_reason || 'unavailable' }}</span></div>
                    </div>
                    <span v-if="s.eligible !== false" class="shrink-0 text-[14px] font-bold tracking-tight" style="color: var(--accent)">
                      {{ quotedTotal(s) }}
                    </span>
                  </template>

                  <!-- law 7.4a — shop name (above, in the header), then the itemised engine
                       cost lines, then the printer's quote (total and per piece), then the
                       imposed sheet. Item 3: one description line per cost, then rate/amount. -->
                  <div v-if="s.eligible !== false" class="space-y-3 px-3 py-3">
                    <div v-if="shopCostLines(s).length" class="space-y-1.5">
                      <div v-for="(line, i) in shopCostLines(s)" :key="i">
                        <div class="truncate text-[12px] text-[var(--ink)]">{{ lineDescription(line) }}</div>
                        <div class="flex items-baseline justify-between gap-3">
                          <span v-if="lineRate(line, s)" class="font-mono text-[9.5px] text-[var(--sub)]">{{ lineRate(line, s) }}</span>
                          <span v-else></span>
                          <span class="font-mono text-[12px] text-[var(--ink)]">{{ lineAmount(line, s) }}</span>
                        </div>
                      </div>
                    </div>

                    <div class="flex items-center justify-between gap-3 rounded-lg bg-[var(--panel)] px-2.5 py-1.5">
                      <span class="font-mono text-[9px] tracking-[0.12em] text-[var(--sub)] uppercase">Printer's quote</span>
                      <span class="font-mono text-[13px] font-semibold" style="color: var(--accent)">{{ quotedTotal(s) }}<span v-if="quotedPiece(s)" class="font-normal text-[var(--sub)]"> · {{ quotedPiece(s) }}</span></span>
                    </div>

                    <ImpositionSheet v-for="imp in impositionFor(s)" :key="imp.key" :imposition="imp.preview" />
                  </div>

                  <div v-else class="space-y-2 bg-amber-soft/40 px-3 py-2.5">
                    <div class="flex items-center gap-1.5">
                      <Info :size="12" class="text-amber" />
                      <span class="font-mono text-[9px] font-semibold tracking-[0.12em] text-amber uppercase">Needs setup to price this</span>
                    </div>
                    <ul v-if="(s.missing_requirements ?? []).length" class="mt-1.5 space-y-1">
                      <li v-for="r in s.missing_requirements" :key="r" class="flex items-start gap-1.5 text-[11px] leading-snug text-[var(--sub)]">
                        <span class="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-amber" />
                        <span>{{ requirementLabel(r) }}</span>
                      </li>
                    </ul>
                    <p v-if="s.ineligible_reason || s.reason || s.explanation" class="mt-1.5 text-[11px] leading-snug text-[var(--sub)]">
                      {{ s.ineligible_reason || s.reason || s.explanation }}
                    </p>
                    <div class="mt-2 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        class="inline-flex items-center gap-1.5 rounded-lg bg-[var(--panel)] px-2.5 py-1.5 font-mono text-[9px] font-bold tracking-[0.12em] text-[var(--ink)] uppercase"
                        @click="copyRequest(s)"
                      >
                        <Check v-if="copiedShop === (s.shop_id ?? s.id)" :size="11" class="text-green" />
                        <Copy v-else :size="11" />
                        {{ copiedShop === (s.shop_id ?? s.id) ? 'Copied' : 'Copy exact request' }}
                      </button>
                      <a
                        v-if="waLink(s)"
                        :href="waLink(s)"
                        target="_blank"
                        rel="noopener"
                        class="inline-flex items-center gap-1.5 rounded-lg bg-green-soft px-2.5 py-1.5 font-mono text-[9px] font-bold tracking-[0.12em] text-green uppercase"
                      >
                        <MessageCircle :size="11" /> Nudge on WhatsApp
                      </a>
                    </div>
                  </div>
                </ExpandableCard>
              </div>
              <p v-else class="mt-3 text-[12px] text-ink-2">Run the search to see which shops can produce this job.</p>
            </DesignCard>

            <!-- Item 4 — the shared, role-gated margin panel. Every figure it
                 shows (printer_total, markup_pct, markup_amount, printy_fee,
                 manager_total_to_client, per_piece) is a server figure. -->
            <ManagerMarginPanel
              v-model="markupPct"
              :breakdown="m.pricingPreview?.breakdown"
              :calculating="m.saving"
              :disabled="!selectedShopId"
              :currency="selectedShop ? shopCurrency(selectedShop) : 'KES'"
              @calculate="calculate"
            />

            <!-- Send to client — the client section that travels with the send. -->
            <div v-if="!m.activeQuote.on_behalf_of_user_id" class="space-y-2">
              <ManagerSendClientSection
                v-model:name="sendClient.name"
                v-model:phone="sendClient.phone"
                v-model:email="sendClient.email"
                :disabled="m.saving || sending"
              />
              <p class="px-1 text-[11px] leading-snug text-ink-2">
                These details are saved with the quote when you send it.
              </p>
            </div>
            <p
              v-else
              data-test="linked-client-note"
              class="rounded-2xl border px-4 py-3 text-[11.5px] leading-snug text-ink-2"
              style="border-color: var(--line); background: var(--panel)"
            >
              Client: <span class="font-semibold text-ink">{{ m.activeQuote.client_name || m.activeQuote.customer_name || 'Client' }}</span>
              · existing client, already linked to this quote.
            </p>

            <DesignAlert v-if="actionError" tone="error">
              {{ actionError }}
            </DesignAlert>
            <DesignAlert v-if="actionNote" tone="success">
              {{ actionNote }}
            </DesignAlert>
            <div
              v-if="offlineClaimUrl"
              class="flex flex-wrap items-center gap-2 rounded-xl border border-brand/30 bg-mint px-4 py-3"
              data-test="offline-claim-link"
            >
              <span class="text-[12px] font-semibold text-brand-deep">Claim link for the client:</span>
              <input
                :value="offlineClaimUrl"
                readonly
                class="min-w-[240px] flex-1 rounded-lg border border-line bg-card px-3 py-2 text-[11.5px] text-ink"
                aria-label="Client claim link"
              >
              <button
                type="button"
                class="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3 py-2 font-mono text-[9.5px] font-bold tracking-[0.1em] text-white uppercase"
                @click="copyClaimLink"
              >
                <Check v-if="claimCopied" :size="11" /> <Copy v-else :size="11" />
                {{ claimCopied ? 'Copied' : 'Copy link' }}
              </button>
            </div>

            <div class="flex flex-wrap gap-3">
              <button class="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 font-mono text-[10.5px] font-bold tracking-[0.14em] text-white uppercase transition-colors hover:bg-brand-deep disabled:opacity-50" :disabled="m.saving || !canPrepare" @click="prepare">
                <Loader2 v-if="m.saving" :size="13" class="animate-spin" /> <FileCheck v-else :size="13" /> Prepare quote
              </button>
              <button class="inline-flex items-center gap-2 rounded-xl border border-brand bg-card px-5 py-3 font-mono text-[10.5px] font-bold tracking-[0.14em] text-brand uppercase transition-colors hover:bg-mint disabled:opacity-50" :disabled="m.saving || sending || !prepared" @click="send">
                <Loader2 v-if="m.saving || sending" :size="13" class="animate-spin" /> <Send v-else :size="13" /> Send to client
              </button>
            </div>
            <p v-if="!canPrepare" class="mt-2 text-[11px] leading-snug text-ink-2">{{ prepareHint }}</p>

            <div v-if="canDecline" class="mt-4 rounded-2xl border border-line bg-paper-2/50 p-4" data-test="manager-decline">
              <template v-if="!declining">
                <p class="text-[12px] leading-relaxed text-ink-2">
                  Cannot take this request? Decline it explicitly so the client can choose another verified manager.
                </p>
                <button
                  type="button"
                  class="mt-2 inline-flex items-center gap-1.5 rounded-xl border border-red/45 bg-card px-4 py-2 font-mono text-[10px] font-bold tracking-[0.12em] text-red uppercase transition-colors hover:bg-red-soft"
                  data-test="manager-decline-open"
                  @click="declining = true"
                >
                  <X :size="11" /> Decline request
                </button>
              </template>
              <template v-else>
                <label class="font-mono text-[9.5px] tracking-[0.12em] text-ink-3 uppercase" for="manager-decline-reason">Reason for the client</label>
                <input
                  id="manager-decline-reason"
                  v-model="declineReason"
                  data-test="manager-decline-reason"
                  class="mt-1.5 w-full rounded-lg border border-line bg-card px-2.5 py-2 text-[12.5px] text-ink"
                  placeholder="e.g. This finish is outside our press capability"
                >
                <div class="mt-2 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    class="rounded-xl bg-red px-4 py-2 font-mono text-[10px] font-bold tracking-[0.12em] text-white uppercase disabled:opacity-50"
                    data-test="manager-decline-confirm"
                    :disabled="!declineReason.trim() || m.saving"
                    @click="declineRequest"
                  >
                    <Loader2 v-if="m.saving" :size="11" class="inline animate-spin" /> Confirm decline
                  </button>
                  <button type="button" class="font-mono text-[10px] tracking-[0.12em] text-ink-3 uppercase" @click="declining = false">
                    Keep request
                  </button>
                </div>
              </template>
            </div>
          </div>
        </section>
      </div>
    </div>
  </DesignManagerSurface>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { ArrowLeft, BadgeCheck, Check, Copy, FileCheck, Info, Loader2, MessageCircle, Paperclip, RefreshCw, Search, Send, UserPlus, X } from 'lucide-vue-next'
import ManagerSendClientSection from '~/components/workbench/views/ManagerSendClientSection.vue'
import DesignManagerSurface from '~/components/design/manager/ManagerSurface.vue'
import DesignManagerSection from '~/components/design/manager/ManagerSection.vue'
import DesignManagerPageHeader from '~/components/design/manager/ManagerPageHeader.vue'
import DesignAlert from '~/components/design/ui/Alert.vue'
import DesignCard from '~/components/design/ui/Card.vue'
import DesignEmptyNote from '~/components/design/ui/EmptyNote.vue'
import DesignLoading from '~/components/design/ui/Loading.vue'
import DesignSectionLabel from '~/components/design/ui/SectionLabel.vue'
import { useManagerStore } from '~/stores/manager'
import { useBreadcrumbLeaf } from '~/composables/useBreadcrumbLeaf'
import ImpositionSheet from '~/components/workbench/calculator/ImpositionSheet.vue'
import { isMuted, needsAttention, sectionsFromServer } from '~/shared/list-sections'
import type { CostLine, ManagerClientRequestResult, ManagerPricingShop, ManagerQuoteRow, ServerProductionPreview } from '~/shared/types'

const m = useManagerStore()

const markupPct = ref('75')
const selectedShopId = ref<number | null>(null)
const actionError = ref('')
const actionNote = ref('')
// Creating a client request closes the add-client panel, so its own success
// note is unreachable. Keep the confirmation on the page itself.
const clientCreatedNote = ref('')
const offlineClaimUrl = ref('')
const claimCopied = ref(false)
const prepared = ref(false)
const sending = ref(false)
const showAddClient = ref(false)
const declining = ref(false)
const declineReason = ref('')

const canDecline = computed(() => {
  const quote = m.activeQuote
  if (!quote) return false
  if (['rejected', 'closed', 'cancelled', 'accepted'].includes(String(quote.raw_status || '').toLowerCase())) return false
  return !(quote as unknown as { managed_job?: unknown }).managed_job
})

/* LAW 8 — the client section on the send step. Name and phone/WhatsApp create
   the client; email is optional. Seeded from whatever the request already shows
   so the manager only types what is missing. */
const sendClient = reactive({ name: '', phone: '', email: '' })

// Item 1 — the quote the manager is working on becomes the last breadcrumb, so
// the trail reads "Dashboard > Quotes > REQ-11" (or the job code once created).
useBreadcrumbLeaf(
  computed(
    () =>
      String(
        m.activeQuote?.code || m.activeQuote?.quote_request_reference || m.activeQuote?.reference || '',
      ),
  ),
)

const shops = computed<ManagerPricingShop[]>(() => m.pricingPreview?.eligible_shops ?? m.shopOptions?.results ?? [])

/* LAW — 0% Printy fee on the manager's own client. The flag is the server's
   decision (frozen on the split once the quote is priced), never derived here. */
const feeWaived = computed(
  () => Boolean(m.pricingPreview?.breakdown?.fee_waived ?? m.activeQuote?.fee_waived),
)

const quoteSections = computed(() => sectionsFromServer(m.quotes))

/* Item 6 — show readable labels instead of raw engine values (business_card,
   full_color, ...). Only known tokens are translated; anything else is titleised
   from its snake_case form, so a new backend value still reads sensibly. */
const READABLE_LABELS: Record<string, string> = {
  business_card: 'Business card',
  full_color: 'Full colour',
  full_colour: 'Full colour',
  color: 'Colour',
  colour: 'Colour',
  black_and_white: 'Black & white',
  black_white: 'Black & white',
  greyscale: 'Greyscale',
  grayscale: 'Greyscale',
  single_sided: 'Single-sided',
  double_sided: 'Double-sided',
  one_sided: 'Single-sided',
  both_sides: 'Double-sided',
  same_day: 'Same day',
  next_day: 'Next day',
  standard: 'Standard',
  express: 'Express',
  lamination: 'Lamination',
  cutting: 'Cutting',
  binding: 'Binding',
  stitching: 'Stitching',
  folding: 'Folding',
}

function readable(value: string): string {
  const key = String(value ?? '').trim().toLowerCase()
  if (!key) return ''
  if (READABLE_LABELS[key]) return READABLE_LABELS[key]
  return key.replace(/[_-]/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

function readableSpec(spec: string): string {
  return String(spec ?? '')
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => readable(token))
    .join(' ')
}

const prefillRows = computed(() => {
  const p = m.prefill
  if (!p) return []
  const size = p.size as Record<string, unknown>
  const rows: Array<{ label: string; value: string }> = []
  if (p.quantity) rows.push({ label: 'Quantity', value: String(p.quantity) })
  const sizeLabel = size.label || (size.width_mm && size.height_mm ? `${size.width_mm}×${size.height_mm}mm` : '')
  if (sizeLabel) rows.push({ label: 'Size', value: String(sizeLabel) })
  if (p.paper?.gsm) rows.push({ label: 'Paper', value: `${p.paper.gsm}gsm ${readable(p.paper.type || '')}`.trim() })
  if (p.print?.sides) rows.push({ label: 'Sides', value: readable(p.print.sides) })
  if (p.print?.color_mode) rows.push({ label: 'Colour', value: readable(p.print.color_mode) })
  if (p.turnaround) rows.push({ label: 'Turnaround', value: readable(p.turnaround) })
  if (p.finishing?.length) rows.push({ label: 'Finishing', value: p.finishing.map((f) => readable(f.type)).join(', ') })
  return rows
})

const selectedShop = computed<ManagerPricingShop | null>(
  () => shops.value.find((s) => shopKey(s) === selectedShopId.value) ?? null,
)

/* Item 2 — which printer option card is expanded. It lives outside the store so
   the open state survives the list refreshes that follow a Calculate. */
const openShopId = ref<number | null>(null)

function shopKey(s: ManagerPricingShop): number {
  return Number(s.shop_id ?? s.id)
}

/* Item 2 — the header both picks the printer and opens its body; collapsing the
   card keeps the selection, so the manager can compare without re-pricing. */
async function onToggleOption(s: ManagerPricingShop, next: boolean) {
  if (!next) {
    openShopId.value = null
    return
  }
  openShopId.value = shopKey(s)
  if (s.eligible === false) return
  selectedShopId.value = shopKey(s)
  await calculate()
}

const canPrepare = computed(() => Boolean(selectedShopId.value && m.shopOptions?.pricing_snapshot && m.pricingPreview?.breakdown))

/* Item 6 — a short hint under the disabled Prepare quote button telling the
   manager what to do first, instead of leaving them guessing. */
const prepareHint = computed(() => {
  if (!shops.value.length) return 'Find printer shops, then pick a printer option.'
  if (!selectedShopId.value) return 'Pick a printer option to continue.'
  if (!m.pricingPreview?.breakdown) return 'Press Calculate to price this printer option.'
  return 'Set your margin and calculate to continue.'
})

const SPEC_MISSING_LABELS: Record<string, string> = {
  quantity: 'Quantity',
  finished_size: 'Finished size',
  width_mm: 'Custom width',
  height_mm: 'Custom height',
  paper_stock: 'Paper stock',
  requested_gsm: 'Requested gsm',
  requested_paper_category: 'Paper type',
  cover_stock: 'Cover stock',
  insert_stock: 'Insert stock',
  print_sides: 'Print sides',
  color_mode: 'Colour mode',
  total_pages: 'Total pages',
  material_type: 'Material',
  finishing: 'Finishing',
  product_type: 'Product type',
}

const REQUIREMENT_LABELS: Record<string, string> = {
  finishing: 'A finishing rate (lamination / cutting / binding)',
  cutting: 'A cutting finishing rate',
  lamination: 'A lamination finishing rate',
  paper: 'An active paper stock for this request',
  machine: 'A machine that fits this paper',
  pricing: 'An active printing price for this sheet',
  coating: 'A coating rate',
  binding: 'A binding rate',
  stitching: 'A stitching / booklet rate',
  delivery: 'A delivery rate',
}

function requirementLabel(key: string) {
  return REQUIREMENT_LABELS[key] ?? key.replace(/[_-]/g, ' ')
}

const copiedShop = ref<number | null>(null)

function shopQuote(s: ManagerPricingShop): string {
  return s.printer_quoted_price || s.production_cost || '—'
}

/* law 7.4a — the printer option is rendered in the backend's order: shop name,
   then the itemised cost lines, then the printer's quote (total and per piece),
   then the imposition. Nothing here is calculated on the client; the lines, the
   quote and the imposed sheet projection come from the engine. The shop-options
   search response carries `production_preview` (the canonical sheet projection)
   with each shop, so when the pricing preview (which omits it) replaces the
   list after "Calculate" we recover it by shop id. `preview_snapshot` is the
   raw engine dict and is never fed to the diagram. */
const optionSource = computed<ManagerPricingShop[]>(
  () => (m.shopOptions?.results ?? []) as ManagerPricingShop[],
)

function shopCostLines(s: ManagerPricingShop): CostLine[] {
  if (Array.isArray(s.cost_lines) && s.cost_lines.length) return s.cost_lines
  const match = optionSource.value.find((r) => (r.shop_id ?? r.id) === (s.shop_id ?? s.id))
  return Array.isArray(match?.cost_lines) ? match!.cost_lines! : []
}

function shopPreview(s: ManagerPricingShop): ServerProductionPreview | null {
  if (s.production_preview) return s.production_preview
  const match = optionSource.value.find((r) => (r.shop_id ?? r.id) === (s.shop_id ?? s.id))
  return match?.production_preview ?? null
}

/* A single-entry list so the imposed sheet is only rendered when a real engine
   preview exists, without any non-null assertion in the template. */
function impositionFor(s: ManagerPricingShop): Array<{ key: string; preview: ServerProductionPreview }> {
  const preview = shopPreview(s)
  return preview ? [{ key: String(s.shop_id ?? s.id ?? 'imposition'), preview }] : []
}

function shopCurrency(s: ManagerPricingShop): string {
  const lineCurrency = shopCostLines(s).find((line) => line.currency)?.currency
  return String(s.currency || lineCurrency || 'KES')
}

function formatAmount(value: string | number | null | undefined, currency: string): string {
  if (value === null || value === undefined || value === '') return ''
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) return String(value)
  return `${currency} ${new Intl.NumberFormat('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(numeric)}`
}

function lineLabel(line: CostLine): string {
  return line.label || String(line.component || '').replace(/[_-]/g, ' ') || 'Cost'
}

function lineSpec(line: CostLine): string {
  const qty = line.quantity ?? line.qty
  const unit = line.unit
  const quantityText = qty !== null && qty !== undefined && qty !== '' ? `${qty}${unit ? ` ${unit}` : ''}` : ''
  return [readableSpec(String(line.spec ?? '')), quantityText].filter(Boolean).join(' · ')
}

/* Item 3 — the quote renders ONE description line per cost (what was bought),
   then the rate and the amount on the line below it. */
function lineDescription(line: CostLine): string {
  return [lineLabel(line), lineSpec(line)].filter(Boolean).join(', ')
}

function lineAmount(line: CostLine, s: ManagerPricingShop): string {
  return formatAmount(line.total_kes ?? line.total, shopCurrency(s))
}

function lineRate(line: CostLine, s: ManagerPricingShop): string {
  const amount = formatAmount(line.unit_price_kes ?? line.rate, shopCurrency(s))
  if (!amount) return ''
  return line.unit ? `${amount} / ${line.unit}` : amount
}

function quotedTotal(s: ManagerPricingShop): string {
  const raw = shopQuote(s)
  return formatAmount(raw, shopCurrency(s)) || raw
}

function quotedPiece(s: ManagerPricingShop): string {
  const piece = s.printer_quoted_price_per_piece
  if (!piece) return ''
  return `${formatAmount(piece, shopCurrency(s)) || piece}/pc`
}

function gapSummary(s: ManagerPricingShop) {
  const reqs = (s.missing_requirements ?? []).map(requirementLabel)
  const reason = s.ineligible_reason || s.reason || s.explanation
  const parts = [reqs.length ? reqs.join(', ') : null, reason || null].filter(Boolean)
  return parts.join(' — ')
}

function nudgeMessage(s: ManagerPricingShop) {
  const ref = m.activeQuote?.quote_request_reference || m.activeQuote?.reference || ''
  const lines = [`Printy production request${ref ? ` ${ref}` : ''}`]
  for (const row of prefillRows.value) {
    lines.push(`${row.label}: ${row.value}`)
  }
  lines.push('')
  lines.push(`To quote this job, please add: ${gapSummary(s)}.`)
  return lines.join('\n')
}

async function copyRequest(s: ManagerPricingShop) {
  const text = nudgeMessage(s)
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    const ta = document.createElement('textarea')
    ta.value = text
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
  }
  copiedShop.value = (s.shop_id ?? s.id) as number
}

async function copyClaimLink() {
  if (!offlineClaimUrl.value) return
  try {
    await navigator.clipboard.writeText(offlineClaimUrl.value)
  } catch {
    const ta = document.createElement('textarea')
    ta.value = offlineClaimUrl.value
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
  }
  claimCopied.value = true
}

function waLink(s: ManagerPricingShop) {
  if (!s.shop_contact) return ''
  let digits = s.shop_contact.replace(/\D/g, '')
  if (!digits) return ''
  if (digits.startsWith('0')) digits = `254${digits.slice(1)}`
  if (!digits.startsWith('254')) digits = `254${digits}`
  return `https://wa.me/${digits}?text=${encodeURIComponent(nudgeMessage(s))}`
}

function statusStyle(raw: string) {
  const s = (raw || '').toLowerCase()
  if (s.includes('sent')) return { background: 'rgba(14,122,69,.12)', color: '#0E7A45' }
  if (s.includes('reject') || s.includes('declin')) return { background: 'rgba(200,30,68,.12)', color: '#C81E44' }
  if (s.includes('accept') || s.includes('complete') || s.includes('paid')) return { background: 'rgba(14,122,69,.14)', color: '#0E7A45' }
  return { background: 'var(--panel2)', color: 'var(--sub)' }
}

function specsBody() {
  const p = m.prefill
  const size = (p?.size ?? {}) as Record<string, unknown>
  return {
    quantity: p?.quantity,
    requested_gsm: p?.paper?.gsm ?? undefined,
    requested_paper_category: p?.paper?.type || undefined,
    print_sides: p?.print?.sides || undefined,
    color_mode: p?.print?.color_mode || undefined,
    width_mm: (size.width_mm as number) || undefined,
    height_mm: (size.height_mm as number) || undefined,
    finished_size: (size.label as string) || undefined,
  }
}

async function onClientCreated(result: ManagerClientRequestResult) {
  showAddClient.value = false
  clientCreatedNote.value = `Request ${result.request_reference || result.code || result.quote_request_id} started for ${result.client_name || 'your client'}.`
  await m.fetchQuotes()
  const created = m.quotes.find((row) => row.id === result.quote_request_id)
  if (created) await select(created)
}

async function select(row: ManagerQuoteRow) {
  actionError.value = ''
  actionNote.value = ''
  offlineClaimUrl.value = ''
  claimCopied.value = false
  prepared.value = false
  selectedShopId.value = null
  openShopId.value = null
  sendClient.name = String(row.client_name || row.customer_name || '')
  sendClient.phone = String(row.client_phone || '')
  sendClient.email = String(row.client_email || '')
  m.activeQuote = row
  m.shopOptions = null
  m.pricingPreview = null
  await Promise.all([m.fetchQuote(row.id), m.fetchPrefill(row.id)])
}

/* Only send the client section when the request has no client yet; a linked
   client is never re-typed over. Empty fields are left out so the server keeps
   whatever it already holds. */
async function sendClientBody(): Promise<Record<string, string>> {
  if (m.activeQuote?.on_behalf_of_user_id) return {}
  const body: Record<string, string> = {}
  if (sendClient.name.trim()) body.client_name = sendClient.name.trim()
  if (sendClient.phone.trim()) body.client_phone = sendClient.phone.trim()
  if (sendClient.email.trim()) body.client_email = sendClient.email.trim()
  return body
}

async function loadOptions() {
  if (!m.activeQuote) return
  actionError.value = ''
  actionNote.value = ''
  prepared.value = false
  const result = await m.fetchShopOptions(m.activeQuote.id, specsBody())
  if (!result) actionError.value = m.error
  else {
    const priced = result.results?.find((s) => s.eligible !== false)
    if (priced) {
      selectedShopId.value = priced.shop_id
      // The chosen option opens straight away so its lines and imposed sheet
      // are the ones the manager sees without an extra click.
      openShopId.value = shopKey(priced)
    }
  }
}

async function calculate() {
  if (!m.activeQuote || !selectedShopId.value) return
  actionError.value = ''
  prepared.value = false
  const result = await m.previewPricing(m.activeQuote.id, {
    specs: specsBody(),
    shop_id: selectedShopId.value,
    markup_pct: markupPct.value,
  })
  if (!result) actionError.value = m.error
}

async function prepare() {
  if (!m.activeQuote || !selectedShopId.value || !m.shopOptions?.pricing_snapshot) return
  actionError.value = ''
  const result = await m.prepare(m.activeQuote.id, {
    shop: selectedShopId.value,
    pricing_snapshot: m.shopOptions.pricing_snapshot,
    markup_pct: markupPct.value,
  })
  if (!result) actionError.value = m.error
  else {
    prepared.value = true
    actionNote.value = 'Quote prepared — you can send it to the client now.'
    const trimmed = String(markupPct.value).trim()
    const next = Number(trimmed)
    if (trimmed !== '' && Number.isFinite(next) && next >= 0) {
      void m.saveDefaultMarkup(next)
    }
  }
}

async function send() {
  if (!m.activeQuote || sending.value) return
  sending.value = true
  actionError.value = ''
  try {
    const result = await m.sendToClient(m.activeQuote.id, await sendClientBody())
    if (!result) actionError.value = m.error
    else {
      prepared.value = false
      actionNote.value = result.already_sent
        ? 'Already sent — this quote was delivered to the client.'
        : result.offline_client
          ? 'Sent — the client record was created and a claim link is ready to pass on.'
          : 'Quote sent to the existing client.'
      // A phone-only client has no account yet, so the setup link must use the
      // ClientInvite token that /app/client-invite can actually claim. The
      // offline claim token belongs to an already signed-in client and is a
      // different flow.
      offlineClaimUrl.value = result.offline_client && result.client_invite_token
        ? `${window.location.origin}/app/client-invite?token=${result.client_invite_token}`
        : ''
      // The send links the client, so reload the row it now belongs to.
      await m.fetchQuotes()
      const updated = m.quotes.find((row) => row.id === m.activeQuote?.id)
      if (updated) await m.fetchQuote(updated.id)
    }
  } finally {
    sending.value = false
  }
}

async function declineRequest() {
  if (!m.activeQuote || !declineReason.value.trim()) return
  actionError.value = ''
  actionNote.value = ''
  const result = await m.declineQuote(m.activeQuote.id, declineReason.value.trim())
  if (!result) {
    actionError.value = m.error
    return
  }
  declining.value = false
  declineReason.value = ''
  actionNote.value = 'Request declined. The client can now choose another verified manager.'
  await m.fetchQuote(m.activeQuote.id)
}

onMounted(async () => {
  await m.fetchQuotes()
  await m.fetchProfile()
  markupPct.value = String(Math.round(m.defaultMarkupRate * 100))
})
</script>
