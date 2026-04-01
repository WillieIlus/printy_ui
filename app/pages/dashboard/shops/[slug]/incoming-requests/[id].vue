<template>
  <div class="space-y-6">
    <DashboardPageHeader
      :title="`Request #${id}`"
      :subtitle="request?.customer_name || 'Incoming request'"
    >
      <template #actions>
        <UButton
          :to="`/dashboard/shops/${slug}`"
          variant="soft"
          size="sm"
        >
          <UIcon name="i-lucide-calculator" class="mr-2 h-4 w-4" />
          Shop workspace
        </UButton>
        <UButton
          :to="`/dashboard/shops/${slug}/incoming-requests`"
          variant="soft"
          size="sm"
        >
          <UIcon name="i-lucide-arrow-left" class="mr-2 h-4 w-4" />
          Back
        </UButton>
      </template>
    </DashboardPageHeader>

    <CommonLoadingSpinner v-if="loading && !request" />

    <template v-else-if="request">
      <div class="flex flex-wrap items-center gap-3">
        <IncomingRequestStatusBadge :status="request.status" />
        <UBadge
          v-if="latestQuote"
          :color="latestQuote.status === 'accepted' ? 'success' : 'warning'"
          variant="soft"
          size="sm"
        >
          {{ sentQuoteStatusLabel(latestQuote.status) }}
        </UBadge>
      </div>

      <SectionCard>
        <div class="flex flex-col gap-5">
          <div class="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(21rem,0.85fr)]">
            <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-5">
              <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">
                Next action
              </p>
              <h2 class="mt-2 text-2xl font-semibold text-[var(--p-text)]">
                {{ primaryActionTitle }}
              </h2>
              <p class="mt-2 text-sm text-[var(--p-text-muted)]">
                {{ nextStepCopy }}
              </p>
              <div class="mt-4 flex flex-wrap gap-2">
                <UButton
                  v-if="primaryAction"
                  :to="primaryAction.to"
                  :color="primaryAction.color"
                  :variant="primaryAction.variant"
                  :disabled="primaryAction.disabled"
                  :loading="primaryAction.loading"
                  @click="primaryAction.onClick?.()"
                >
                  <UIcon :name="primaryAction.icon" class="mr-2 h-4 w-4" />
                  {{ primaryAction.label }}
                </UButton>
                <UButton
                  v-if="draftFileRoute"
                  :to="draftFileRoute"
                  variant="soft"
                  color="neutral"
                >
                  <UIcon name="i-lucide-files" class="mr-2 h-4 w-4" />
                  Open quote draft file
                </UButton>
              </div>
            </div>

            <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-5">
              <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">
                Client-facing outcome
              </p>
              <p class="mt-2 text-base font-semibold text-[var(--p-text)]">
                {{ clientOutcome.title }}
              </p>
              <p class="mt-2 text-sm text-[var(--p-text-muted)]">
                {{ clientOutcome.description }}
              </p>
              <p
                v-if="clientOutcome.helper"
                class="mt-3 text-xs font-medium uppercase tracking-[0.12em] text-[var(--p-text-muted)]"
              >
                {{ clientOutcome.helper }}
              </p>
            </div>
          </div>

          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">
              Primary action group
            </p>
            <div class="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <UButton
              color="primary"
              class="justify-center"
              :disabled="!canAcceptRequest"
              :loading="accepting"
              @click="onAcceptRequest"
            >
              <UIcon name="i-lucide-check" class="mr-2 h-4 w-4" />
              Accept
            </UButton>

            <UButton
              variant="soft"
              color="neutral"
              class="justify-center"
              :to="tweakQuoteRoute"
              :disabled="!canTweakAndQuote"
            >
              <UIcon name="i-lucide-pencil-ruler" class="mr-2 h-4 w-4" />
              Tweak & Quote
            </UButton>

            <UButton
              variant="soft"
              color="warning"
              class="justify-center"
              :disabled="!canAskQuestion"
              @click="showQuestionForm = !showQuestionForm"
            >
              <UIcon name="i-lucide-message-square-more" class="mr-2 h-4 w-4" />
              Ask Question
            </UButton>

            <UButton
              variant="soft"
              color="error"
              class="justify-center"
              :disabled="!canReject"
              @click="showRejectForm = !showRejectForm"
            >
              <UIcon name="i-lucide-x" class="mr-2 h-4 w-4" />
              Reject
            </UButton>
            </div>
          </div>

          <div v-if="request.items.length > 1" class="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-4 py-3 text-sm text-[var(--p-text-muted)]">
            Tweak & Quote preloads the first request line into the existing workbench. Multi-line requests still need a manual review before you send the final quote.
          </div>

          <div v-if="showQuestionForm && canAskQuestion" class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4">
            <p class="text-sm font-semibold text-[var(--p-text)]">Clarification for the client</p>
            <p class="mt-1 text-sm text-[var(--p-text-muted)]">
              This moves the request to <span class="font-medium">awaiting client reply</span>.
            </p>
            <UTextarea
              v-model="questionBody"
              class="mt-3"
              :rows="4"
              placeholder="Ask for missing artwork, confirm size, stock, quantity, or delivery details."
            />
            <div class="mt-3 flex flex-wrap gap-2">
              <UButton color="warning" :loading="askingQuestion" @click="onAskQuestion">
                Send question
              </UButton>
              <UButton variant="ghost" color="neutral" @click="showQuestionForm = false">
                Cancel
              </UButton>
            </div>
          </div>

          <div v-if="showRejectForm && canReject" class="rounded-xl border border-red-200 bg-red-50 p-4 text-red-950 dark:border-red-900/60 dark:bg-red-950/20 dark:text-red-100">
            <p class="text-sm font-semibold">Reason for rejection</p>
            <p class="mt-1 text-sm opacity-80">
              The client will see this reason on their request timeline.
            </p>
            <UTextarea
              v-model="rejectReason"
              class="mt-3"
              :rows="4"
              placeholder="Explain what cannot be produced or what needs to change."
            />
            <div class="mt-3 flex flex-wrap gap-2">
              <UButton color="error" :loading="rejecting" @click="onRejectRequest">
                Reject request
              </UButton>
              <UButton variant="ghost" color="neutral" @click="showRejectForm = false">
                Cancel
              </UButton>
            </div>
          </div>
        </div>
      </SectionCard>

      <div class="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(21rem,0.95fr)]">
        <div class="space-y-6">
          <SectionCard>
            <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <article
                v-for="stat in summaryStats"
                :key="stat.label"
                class="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4"
              >
                <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">
                  {{ stat.label }}
                </p>
                <p class="mt-2 text-base font-semibold text-[var(--p-text)]">
                  {{ stat.value }}
                </p>
                <p v-if="stat.helper" class="mt-1 text-sm text-[var(--p-text-muted)]">
                  {{ stat.helper }}
                </p>
              </article>
            </div>
          </SectionCard>

          <SectionCard>
            <template #card-header>
              <div>
                <p class="text-sm font-semibold tracking-[0.01em] text-[var(--p-text-dim)]">
                  Request details
                </p>
                <p class="mt-1 text-sm text-[var(--p-text-muted)]">
                  Customer, delivery, and quoted production context.
                </p>
              </div>
            </template>

            <div class="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div class="grid gap-3 sm:grid-cols-2">
                <article
                  v-for="detail in requesterDetails"
                  :key="detail.label"
                  class="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4"
                >
                  <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">
                    {{ detail.label }}
                  </p>
                  <p class="mt-2 break-words text-sm font-medium text-[var(--p-text)]">
                    {{ detail.value }}
                  </p>
                </article>
              </div>

              <div class="space-y-3">
                <article class="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">
                    Delivery
                  </p>
                  <p class="mt-2 text-sm font-medium text-[var(--p-text)]">
                    {{ deliverySummary }}
                  </p>
                </article>

                <article class="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">
                    Client notes
                  </p>
                  <p class="mt-2 whitespace-pre-wrap text-sm text-[var(--p-text)]">
                    {{ request.notes || 'No additional request notes provided.' }}
                  </p>
                </article>
              </div>
            </div>
          </SectionCard>

          <SectionCard>
            <template #card-header>
              <div class="flex items-center justify-between gap-4">
                <div>
                  <p class="text-sm font-semibold tracking-[0.01em] text-[var(--p-text-dim)]">
                    Requested items
                  </p>
                  <p class="mt-1 text-sm text-[var(--p-text-muted)]">
                    Review each line before sending or revising the quote.
                  </p>
                </div>
                <div class="rounded-full border border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">
                  {{ request.items.length }} item{{ request.items.length === 1 ? '' : 's' }}
                </div>
              </div>
            </template>

            <div class="space-y-3">
              <article
                v-for="item in request.items"
                :key="item.id"
                class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4"
              >
                <div class="flex flex-wrap items-start justify-between gap-4">
                  <div class="min-w-0">
                    <p class="font-semibold text-[var(--p-text)]">
                      {{ item.title ?? item.product_name ?? 'Product' }}
                    </p>
                    <p class="mt-1 text-sm text-[var(--p-text-muted)]">
                      {{ item.item_type === 'CUSTOM' ? 'Custom request' : 'Catalog product' }}
                    </p>
                  </div>
                  <div class="text-right">
                    <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">
                      Qty
                    </p>
                    <p class="mt-1 text-sm font-semibold tabular-nums text-[var(--p-text)]">
                      {{ item.quantity }}
                    </p>
                  </div>
                </div>

                <div class="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Size</p>
                    <p class="mt-1 text-sm text-[var(--p-text)]">{{ itemSizeLine(item) }}</p>
                  </div>
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Stock / paper</p>
                    <p class="mt-1 text-sm text-[var(--p-text)]">{{ itemPaperLine(item) }}</p>
                  </div>
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Finishing</p>
                    <p class="mt-1 text-sm text-[var(--p-text)]">{{ itemFinishingLine(item) }}</p>
                  </div>
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Configuration</p>
                    <p class="mt-1 text-sm text-[var(--p-text)]">{{ itemModeLine(item) || 'Not specified' }}</p>
                  </div>
                </div>

                <div class="mt-4 flex items-center justify-between border-t border-[var(--p-border)] pt-3">
                  <span class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">
                    Line total
                  </span>
                  <span class="text-sm font-semibold tabular-nums text-[var(--p-text)]">
                    {{ itemTotalDisplay(item) }}
                  </span>
                </div>
              </article>
            </div>
          </SectionCard>

          <SectionCard v-if="request.attachments?.length">
            <template #card-header>
              <div>
                <p class="text-sm font-semibold tracking-[0.01em] text-[var(--p-text-dim)]">
                  Attachments
                </p>
                <p class="mt-1 text-sm text-[var(--p-text-muted)]">
                  Files supplied with the request.
                </p>
              </div>
            </template>

            <div class="grid gap-3 md:grid-cols-2">
              <a
                v-for="att in request.attachments"
                :key="att.id"
                :href="att.file"
                target="_blank"
                rel="noopener noreferrer"
                class="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4 transition-colors hover:border-flamingo-300"
              >
                <p class="text-sm font-semibold text-[var(--p-text)]">
                  {{ att.name || 'Attachment' }}
                </p>
                <p class="mt-1 text-xs text-[var(--p-text-muted)]">
                  Added {{ formatDate(att.created_at) }}
                </p>
              </a>
            </div>
          </SectionCard>
        </div>

        <div class="space-y-6">
          <SectionCard>
            <template #card-header>
              <div>
                <p class="text-sm font-semibold tracking-[0.01em] text-[var(--p-text-dim)]">
                  Quote workspace
                </p>
                <p class="mt-1 text-sm text-[var(--p-text-muted)]">
                  Keep the request visible while you revise, send, and share the quote.
                </p>
              </div>
            </template>

            <div class="space-y-4">
              <div class="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4">
                <dl class="space-y-2 text-sm">
                  <div class="flex items-start justify-between gap-4">
                    <dt class="text-[var(--p-text-muted)]">Request status</dt>
                    <dd class="font-medium text-[var(--p-text)]">{{ statusLabel(request.status) }}</dd>
                  </div>
                  <div class="flex items-start justify-between gap-4">
                    <dt class="text-[var(--p-text-muted)]">Latest quote</dt>
                    <dd class="font-medium text-[var(--p-text)]">{{ latestQuoteDisplay }}</dd>
                  </div>
                  <div class="flex items-start justify-between gap-4">
                    <dt class="text-[var(--p-text-muted)]">Turnaround</dt>
                    <dd class="font-medium text-[var(--p-text)]">{{ turnaroundDisplay }}</dd>
                  </div>
                  <div class="flex items-start justify-between gap-4">
                    <dt class="text-[var(--p-text-muted)]">Revisions</dt>
                    <dd class="font-medium text-[var(--p-text)]">{{ revisionCount }}</dd>
                  </div>
                </dl>
              </div>

              <div v-if="draftFileRoute" class="rounded-lg border border-primary-200 bg-primary-50 p-4 text-primary-900 dark:border-primary-900/70 dark:bg-primary-950/20 dark:text-primary-100">
                <div class="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p class="text-sm font-semibold">Quote draft file linked</p>
                    <p class="mt-1 text-sm opacity-80">
                      Open the grouped draft workspace for this client before revising or sending.
                    </p>
                  </div>
                  <UButton :to="draftFileRoute" color="primary" variant="soft">
                    <UIcon name="i-lucide-files" class="mr-2 h-4 w-4" />
                    Open draft file
                  </UButton>
                </div>
              </div>

              <div v-if="canSendQuote">
                <SendQuoteForm
                  v-if="showSendForm"
                  :loading="sending"
                  @submit="onSendQuote"
                  @cancel="showSendForm = false"
                />
                <UButton v-else color="primary" block @click="showSendForm = true">
                  <UIcon name="i-lucide-send" class="mr-2 h-4 w-4" />
                  Send Quote
                </UButton>
              </div>

              <div v-if="hasQuoteActions" class="grid gap-2">
                <UButton
                  v-if="latestQuote"
                  :to="`/dashboard/shops/${slug}/sent-quotes/${latestQuote.id}`"
                  variant="soft"
                  block
                >
                  <UIcon name="i-lucide-folder-open" class="mr-2 h-4 w-4" />
                  Open Draft
                </UButton>

                <ReviseQuoteForm
                  v-if="showReviseForm && canRevise"
                  :loading="revising"
                  :initial-total="latestQuote?.total"
                  :initial-note="latestQuote?.note ?? ''"
                  :initial-turnaround="latestQuote?.turnaround_days"
                  @submit="onReviseQuote"
                  @cancel="showReviseForm = false"
                />
                <UButton
                  v-else-if="canRevise"
                  variant="soft"
                  block
                  @click="showReviseForm = true"
                >
                  <UIcon name="i-lucide-refresh-cw" class="mr-2 h-4 w-4" />
                  Revise Quote
                </UButton>

                <UButton
                  v-if="latestQuote"
                  :to="`/dashboard/shops/${slug}/sent-quotes/${latestQuote.id}`"
                  variant="soft"
                  block
                >
                  <UIcon name="i-lucide-send" class="mr-2 h-4 w-4" />
                  Send Quote
                </UButton>

                <ShareActionsBar
                  v-if="request.whatsapp_summary"
                  :summary-text="request.whatsapp_summary"
                  copy-label="Copy Summary"
                  :attachments="request.attachments"
                />

                <UButton
                  v-if="latestQuote"
                  variant="soft"
                  block
                  @click="downloadQuotePdf"
                >
                  <UIcon name="i-lucide-download" class="mr-2 h-4 w-4" />
                  Download PDF
                </UButton>
              </div>
            </div>
          </SectionCard>

          <SectionCard>
            <template #card-header>
              <div>
                <p class="text-sm font-semibold tracking-[0.01em] text-[var(--p-text-dim)]">
                  Timeline & history
                </p>
                <p class="mt-1 text-sm text-[var(--p-text-muted)]">
                  This is what the client can track from their side.
                </p>
              </div>
            </template>

            <div class="space-y-3">
              <article
                v-for="message in timelineMessages"
                :key="message.id"
                class="relative rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4 pl-6"
              >
                <span class="absolute left-3 top-5 h-2.5 w-2.5 rounded-full" :class="timelineDotClass(message)" />
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <p class="text-sm font-semibold text-[var(--p-text)]">
                      {{ timelineTitle(message) }}
                    </p>
                    <p class="text-xs uppercase tracking-[0.12em] text-[var(--p-text-muted)]">
                      {{ timelineMeta(message) }}
                    </p>
                  </div>
                  <span class="text-xs text-[var(--p-text-muted)]">
                    {{ formatDate(message.created_at) }}
                  </span>
                </div>
                <p v-if="message.body" class="mt-3 whitespace-pre-wrap text-sm text-[var(--p-text)]">
                  {{ message.body }}
                </p>
              </article>
            </div>
          </SectionCard>
        </div>
      </div>
    </template>

    <DashboardEmptyState
      v-else
      title="Request not found"
      description="This incoming request may have been removed or you don't have access."
      icon="i-lucide-file-question"
    >
      <UButton :to="`/dashboard/shops/${slug}/incoming-requests`">Incoming Requests</UButton>
    </DashboardEmptyState>
  </div>
</template>

<script setup lang="ts">
import type { IncomingRequestDetail, IncomingRequestItem, QuoteRequestMessage } from '~/shared/types/incomingRequest'
import { useActivityBadgesStore } from '~/stores/activityBadges'
import { formatCurrency, formatDate } from '~/utils/formatters'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'shop-owner'],
})

const route = useRoute()
const slug = computed(() => route.params.slug as string)
const id = computed(() => parseInt(route.params.id as string, 10))
const notification = useNotification()
const activityBadgesStore = useActivityBadgesStore()

const incoming = useIncomingRequests(slug)
const sentQuotes = useSentQuotes()

const request = ref<IncomingRequestDetail | null>(null)
const loading = ref(true)
const sending = ref(false)
const revising = ref(false)
const accepting = ref(false)
const askingQuestion = ref(false)
const rejecting = ref(false)
const showSendForm = ref(false)
const showReviseForm = ref(false)
const showQuestionForm = ref(false)
const showRejectForm = ref(false)
const questionBody = ref('')
const rejectReason = ref('')

const latestQuote = computed(() => {
  const sq = request.value?.sent_quotes
  if (!sq?.length) return null
  return [...sq].sort((a, b) => {
    const da = a.sent_at || a.created_at
    const db = b.sent_at || b.created_at
    return new Date(db).getTime() - new Date(da).getTime()
  })[0] ?? null
})

const totalUnits = computed(() =>
  request.value?.items.reduce((sum, item) => sum + (item.quantity || 0), 0) ?? 0,
)

const latestQuoteDisplay = computed(() =>
  latestQuote.value?.total
    ? formatCurrency(latestQuote.value.total, request.value?.shop_currency)
    : 'No quote sent yet',
)

const turnaroundDisplay = computed(() =>
  latestQuote.value?.turnaround_days != null
    ? `${latestQuote.value.turnaround_days} business day${latestQuote.value.turnaround_days === 1 ? '' : 's'}`
    : 'Not set',
)

const revisionCount = computed(() => request.value?.sent_quotes?.length ?? 0)
const draftFileRoute = computed(() =>
  request.value?.quote_draft_file_id ? `/dashboard/quotes/files/${request.value.quote_draft_file_id}` : null,
)

const canAcceptRequest = computed(
  () =>
    request.value != null &&
    ['submitted', 'viewed', 'awaiting_shop_action'].includes(request.value.status) &&
    !latestQuote.value,
)

const canTweakAndQuote = computed(() => Boolean(request.value?.items.length))

const canAskQuestion = computed(
  () =>
    request.value != null &&
    !['quoted', 'rejected', 'expired', 'cancelled', 'closed'].includes(request.value.status),
)

const canReject = computed(
  () =>
    request.value != null &&
    !['quoted', 'rejected', 'expired', 'cancelled', 'closed'].includes(request.value.status),
)

const canSendQuote = computed(
  () =>
    request.value != null &&
    !latestQuote.value &&
    ['submitted', 'viewed', 'accepted', 'awaiting_shop_action'].includes(request.value.status),
)

const canRevise = computed(
  () =>
    request.value != null &&
    latestQuote.value != null &&
    ['sent', 'revised'].includes(latestQuote.value.status),
)

const hasQuoteActions = computed(() => Boolean(latestQuote.value))

const requesterDetails = computed(() => [
  { label: 'Client name', value: request.value?.customer_name || 'Not provided' },
  { label: 'Email', value: request.value?.customer_email || 'Not provided' },
  { label: 'Phone', value: request.value?.customer_phone || 'Not provided' },
  { label: 'Request ID', value: request.value ? `#${request.value.id}` : '-' },
])

const summaryStats = computed(() => [
  {
    label: 'Request status',
    value: request.value ? statusLabel(request.value.status) : 'Pending',
    helper: request.value ? `Updated ${formatDate(request.value.updated_at || request.value.created_at)}` : '',
  },
  {
    label: 'Submitted',
    value: request.value ? formatDate(request.value.created_at) : 'Recently',
    helper: request.value ? `Request #${request.value.id}` : '',
  },
  {
    label: 'Items',
    value: request.value ? `${request.value.items.length} line${request.value.items.length === 1 ? '' : 's'}` : '0 lines',
    helper: `${totalUnits.value} total units`,
  },
  {
    label: 'Quote state',
    value: latestQuote.value ? sentQuoteStatusLabel(latestQuote.value.status) : 'Not sent',
    helper: latestQuote.value ? `Revision ${latestQuote.value.revision_number}` : nextStepCopy.value,
  },
])

const primaryActionTitle = computed(() => {
  if (canSendQuote.value) return 'Prepare and send the quote'
  if (canAcceptRequest.value) return 'Take ownership of this request'
  if (request.value?.status === 'awaiting_client_reply') return 'Wait for the client reply'
  if (canRevise.value) return 'Review the sent quote and revise if needed'
  if (draftFileRoute.value) return 'Continue from the draft workspace'
  if (request.value?.status === 'rejected') return 'Request closed as rejected'
  return 'Review the request history'
})

const primaryAction = computed(() => {
  if (canSendQuote.value) {
    return {
      label: 'Send quote now',
      icon: 'i-lucide-send',
      color: 'primary' as const,
      variant: 'solid' as const,
      to: undefined as string | undefined,
      disabled: false,
      loading: false,
      onClick: () => { showSendForm.value = true },
    }
  }
  if (canAcceptRequest.value) {
    return {
      label: 'Accept request',
      icon: 'i-lucide-check',
      color: 'primary' as const,
      variant: 'solid' as const,
      to: undefined as string | undefined,
      disabled: false,
      loading: accepting.value,
      onClick: () => { void onAcceptRequest() },
    }
  }
  if (canRevise.value && latestQuote.value) {
    return {
      label: 'Open sent quote',
      icon: 'i-lucide-folder-open',
      color: 'primary' as const,
      variant: 'solid' as const,
      to: `/dashboard/shops/${slug.value}/sent-quotes/${latestQuote.value.id}`,
      disabled: false,
      loading: false,
      onClick: undefined as (() => void) | undefined,
    }
  }
  if (draftFileRoute.value) {
    return {
      label: 'Open draft workspace',
      icon: 'i-lucide-files',
      color: 'primary' as const,
      variant: 'solid' as const,
      to: draftFileRoute.value,
      disabled: false,
      loading: false,
      onClick: undefined as (() => void) | undefined,
    }
  }
  return null
})

const deliverySummary = computed(() => {
  if (!request.value?.delivery_preference) return 'Delivery preference not specified.'
  const mode = request.value.delivery_preference === 'pickup' ? 'Pickup' : 'Delivery'
  const location = request.value.delivery_address || request.value.delivery_location_name
  return location ? `${mode} / ${location}` : mode
})

const timelineMessages = computed(() => {
  const messages = request.value?.messages ?? []
  if (messages.length) return messages
  if (!request.value) return []
  return [{
    id: -1,
    sender_role: 'system',
    message_kind: 'status',
    body: 'Request received from client.',
    created_at: request.value.created_at,
    updated_at: request.value.created_at,
  } satisfies QuoteRequestMessage]
})

const nextStepCopy = computed(() => {
  const status = request.value?.status
  if (!status) return 'Load request'
  if (status === 'submitted') return 'Accept this request if the shop is ready to work on it, or ask a question before quoting.'
  if (status === 'viewed') return 'The request has been opened. Move it into an active decision so the client sees progress.'
  if (status === 'accepted' || status === 'awaiting_shop_action') return 'Use the workbench or send the quote directly so the client gets a priced response.'
  if (status === 'awaiting_client_reply') return 'The next move is on the client. Leave the request visible and watch the timeline for their reply.'
  if (status === 'quoted') return 'The quote is with the client. Keep the sent quote visible in case they ask for a revision.'
  if (status === 'rejected') return 'The client can now see the rejection reason and this request is closed.'
  if (status === 'cancelled') return 'The client cancelled this request. No further shop action is needed.'
  if (status === 'closed' || status === 'expired') return 'This request is no longer active.'
  return statusLabel(status)
})

const clientOutcome = computed(() => {
  const status = request.value?.status
  if (latestQuote.value?.status === 'accepted') {
    return {
      title: 'Client accepted the quote.',
      description: 'The client can treat this quote as approved and move forward with the order.',
      helper: `Latest visible quote: revision ${latestQuote.value.revision_number}.`,
    }
  }
  if (status === 'quoted') {
    return {
      title: 'Client can review the quote now.',
      description: 'They can see the latest total, note, turnaround, and any files or summary shared with the quote.',
      helper: latestQuote.value ? `Latest visible quote: revision ${latestQuote.value.revision_number}.` : undefined,
    }
  }
  if (status === 'rejected') {
    return {
      title: 'Client sees the rejection reason.',
      description: 'The request is marked rejected on their timeline, together with the reason you provided.',
      helper: 'No quote can be sent from this state.',
    }
  }
  if (status === 'awaiting_client_reply') {
    return {
      title: 'Client has been asked to respond.',
      description: 'They can see your clarification message and the request is paused until they reply.',
      helper: 'The timeline is now waiting on the client.',
    }
  }
  if (status === 'accepted' || status === 'awaiting_shop_action') {
    return {
      title: 'Client sees that the shop is working on it.',
      description: 'The request shows progress, but the client is still waiting for the actual quote.',
      helper: 'Best next move: send the quote.',
    }
  }
  return {
    title: 'Client is waiting for the shop decision.',
    description: 'They can see the request exists, but they do not yet have a final shop response.',
    helper: 'Accept, ask a question, or reject.',
  }
})

const tweakQuoteRoute = computed(() => ({
  path: `/dashboard/shops/${slug.value}`,
  query: { requestId: String(id.value) },
}))

async function fetchRequest() {
  if (Number.isNaN(id.value)) {
    loading.value = false
    return
  }
  loading.value = true
  try {
    const loadedRequest = await incoming.get(id.value)
    request.value = loadedRequest
    if (loadedRequest.status === 'submitted') {
      request.value = await incoming.markViewed(id.value)
    }
    await activityBadgesStore.fetchSummary(slug.value)
  } catch {
    request.value = null
  } finally {
    loading.value = false
  }
}

async function onAcceptRequest() {
  if (!request.value || accepting.value || !canAcceptRequest.value) return
  accepting.value = true
  try {
    request.value = await incoming.acceptRequest(id.value)
    await activityBadgesStore.fetchSummary(slug.value)
    notification.success('Request accepted')
  } catch (e) {
    notification.error(e instanceof Error ? e.message : 'Failed to accept request')
  } finally {
    accepting.value = false
  }
}

async function onAskQuestion() {
  if (!request.value || askingQuestion.value) return
  if (!questionBody.value.trim()) {
    notification.error('Add a question for the client')
    return
  }
  askingQuestion.value = true
  try {
    request.value = await incoming.askQuestion(id.value, { body: questionBody.value.trim() })
    questionBody.value = ''
    showQuestionForm.value = false
    await activityBadgesStore.fetchSummary(slug.value)
    notification.success('Question sent to client')
  } catch (e) {
    notification.error(e instanceof Error ? e.message : 'Failed to send question')
  } finally {
    askingQuestion.value = false
  }
}

async function onRejectRequest() {
  if (!request.value || rejecting.value) return
  if (!rejectReason.value.trim()) {
    notification.error('Add a rejection reason')
    return
  }
  rejecting.value = true
  try {
    request.value = await incoming.rejectRequest(id.value, { reason: rejectReason.value.trim() })
    rejectReason.value = ''
    showRejectForm.value = false
    await activityBadgesStore.fetchSummary(slug.value)
    notification.success('Request rejected')
  } catch (e) {
    notification.error(e instanceof Error ? e.message : 'Failed to reject request')
  } finally {
    rejecting.value = false
  }
}

async function onSendQuote(payload: { total?: number | string | null; note?: string; turnaround_days?: number | null }) {
  if (!request.value || sending.value) return
  sending.value = true
  try {
    request.value = await incoming.sendQuote(id.value, payload)
    showSendForm.value = false
    await activityBadgesStore.fetchSummary(slug.value)
    notification.success('Quote sent')
  } catch (e) {
    notification.error(e instanceof Error ? e.message : 'Failed to send quote')
  } finally {
    sending.value = false
  }
}

async function onReviseQuote(payload: { total?: number | string | null; note?: string; turnaround_days?: number | null }) {
  const sq = latestQuote.value
  if (!sq || revising.value) return
  revising.value = true
  try {
    await sentQuotes.revise(sq.id, payload)
    await fetchRequest()
    showReviseForm.value = false
    await activityBadgesStore.fetchSummary(slug.value)
    notification.success('Quote revised')
  } catch (e) {
    notification.error(e instanceof Error ? e.message : 'Failed to revise quote')
  } finally {
    revising.value = false
  }
}

function downloadQuotePdf() {
  if (!latestQuote.value) return
  window.open(`/dashboard/shops/${slug.value}/sent-quotes/${latestQuote.value.id}?print=1`, '_blank', 'noopener')
}

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    draft: 'Draft',
    submitted: 'Submitted',
    awaiting_shop_action: 'Awaiting shop action',
    awaiting_client_reply: 'Awaiting client reply',
    viewed: 'Viewed',
    quoted: 'Quoted',
    accepted: 'Accepted by shop',
    rejected: 'Rejected',
    expired: 'Expired',
    closed: 'Closed',
    cancelled: 'Cancelled',
  }
  return labels[status] ?? status
}

function sentQuoteStatusLabel(status: string) {
  const labels: Record<string, string> = {
    sent: 'Sent quote',
    revised: 'Revised quote',
    accepted: 'Accepted by client',
  }
  return labels[status] ?? status
}

function timelineTitle(message: QuoteRequestMessage) {
  const labels: Record<string, string> = {
    status: 'Status update',
    question: 'Question sent',
    reply: 'Client reply',
    rejection: 'Request rejected',
    quote: 'Quote update',
    note: 'Note',
  }
  return labels[message.message_kind] ?? 'Update'
}

function timelineMeta(message: QuoteRequestMessage) {
  const role = message.sender_role === 'shop' ? 'Shop' : message.sender_role === 'client' ? 'Client' : 'System'
  const sender = message.sender_name ? ` / ${message.sender_name}` : ''
  return `${role}${sender}`
}

function timelineDotClass(message: QuoteRequestMessage) {
  if (message.message_kind === 'rejection') return 'bg-red-500'
  if (message.message_kind === 'quote') return 'bg-primary-500'
  if (message.message_kind === 'question') return 'bg-amber-500'
  if (message.message_kind === 'reply') return 'bg-emerald-500'
  return 'bg-[var(--p-text-muted)]'
}

function itemSizeLine(item: IncomingRequestItem) {
  if (item.chosen_width_mm && item.chosen_height_mm) return `${item.chosen_width_mm} x ${item.chosen_height_mm} mm`
  if (item.spec_text) return item.spec_text
  return 'Not specified'
}

function itemPaperLine(item: IncomingRequestItem) {
  if (item.paper) return `Paper #${item.paper}`
  if (item.material) return `Material #${item.material}`
  return 'Stock not specified'
}

function itemFinishingLine(item: IncomingRequestItem) {
  const labels = item.finishings?.map(finishing => finishing.finishing_rate_name).filter(Boolean) ?? []
  return labels.length ? labels.join(', ') : 'None'
}

function itemModeLine(item: IncomingRequestItem) {
  const parts: string[] = []
  if (item.pricing_mode) parts.push(item.pricing_mode === 'LARGE_FORMAT' ? 'Large format' : 'Sheet pricing')
  if (item.sides) parts.push(item.sides === 'DUPLEX' ? 'Duplex' : 'Simplex')
  if (item.color_mode) parts.push(item.color_mode === 'BW' ? 'B&W' : 'Colour')
  return parts.join(' / ')
}

function itemTotalDisplay(item: IncomingRequestItem) {
  return item.line_total ? formatCurrency(item.line_total, request.value?.shop_currency) : '—'
}

onMounted(() => fetchRequest())
</script>
