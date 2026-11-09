<template>
  <DesignBuyerSurface>
    <!-- instant quote flow: an action on the orders page, never a second tab -->
    <div v-if="w.buyerQuoteOpen" class="pt-2">
      <div class="mx-auto w-full max-w-[1180px]">
        <button
          type="button"
          class="mb-4 inline-flex items-center gap-1.5 font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-3 transition-colors hover:text-brand"
          @click="closeNewQuote"
        >
          <ArrowLeft :size="13" /> Back to my orders
        </button>
        <DesignCalculatorSurface>
          <DesignCalculator authed @quote-created="onQuoteCreated" />
        </DesignCalculatorSurface>
        <div class="pb-8" />
      </div>
    </div>

    <div v-else class="mx-auto flex w-full max-w-[1180px] flex-col gap-9">
      <!-- Law 7.12: paid, owned jobs appear here with zero clicks, above
           everything else on the buyer dashboard. Hidden when there are none. -->
      <BuyerJobsInProgress class="pt-2" />

      <!-- B1.3 — the managers this client already works with, pinned above
           everything else. Hidden when the client has none. -->
      <ClientMyManagersPanel />

      <header class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <DesignSectionLabel index="01" tone="brand">Client dashboard</DesignSectionLabel>
          <h1 class="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">{{ greeting }}</h1>
          <p class="mt-1.5 max-w-xl text-[14px] font-light text-ink-2">
            Every price is locked after acceptance. Every date shift needs your approval.
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <input
            v-model="search"
            type="search"
            placeholder="Search your orders"
            aria-label="Search your orders"
            class="w-full min-w-[190px] rounded-xl border border-line-strong bg-card px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-ink-3 focus:border-brand sm:w-56"
          >
          <span v-if="search.trim()" class="font-mono text-[10.5px] text-ink-3">
            Filtering &ldquo;{{ search.trim() }}&rdquo;
          </span>
          <button
            type="button"
            class="press-key inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white shadow-brand transition-colors hover:bg-brand-deep"
            @click="openNewQuote"
          >
            <Plus :size="16" /> New quote
          </button>
        </div>
      </header>

      <section
        v-if="approvals.length"
        class="rounded-2xl border border-amber/40 bg-amber-soft p-5 shadow-card"
      >
        <div class="mb-4 flex flex-wrap items-center gap-2">
          <AlertTriangle :size="18" class="text-amber" />
          <h2 class="text-sm font-bold tracking-tight text-ink">Needs your approval</h2>
          <span class="rounded-full border border-amber/40 bg-card px-2 py-0.5 font-mono text-[10px] font-semibold text-amber">{{ approvals.length }}</span>
          <span class="ml-auto hidden font-mono text-[10.5px] text-amber sm:block">Prices &amp; dates never change silently</span>
        </div>
        <div class="space-y-3">
          <div
            v-for="approval in approvals"
            :key="approval.key"
            class="flex flex-col gap-4 rounded-xl border border-line bg-card p-4 md:flex-row md:items-center"
          >
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" :class="approval.iconClass">
              <component :is="approval.icon" :size="18" />
            </div>
            <div class="min-w-0 flex-1">
              <div class="mb-1 flex flex-wrap items-center gap-2">
                <span class="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider" :class="approval.chipClass">{{ approval.label }}</span>
                <span class="text-xs font-medium text-ink-2">{{ approval.reference }}</span>
              </div>
              <p class="text-sm text-ink">
                <span v-if="approval.oldValue" class="mr-2 text-ink-3 line-through">{{ approval.oldValue }}</span>
                <strong class="font-bold text-ink">{{ approval.newValue }}</strong>
              </p>
              <p class="mt-1 text-xs text-ink-2">{{ approval.reason }}</p>
            </div>
            <div class="flex shrink-0 gap-2">
              <button
                type="button"
                class="press-key rounded-xl bg-amber px-4 py-2 text-xs font-bold text-white transition-colors hover:brightness-95"
                @click="scrollTo(approval.target)"
              >
                Review
              </button>
              <NuxtLink
                to="/app/messages"
                class="rounded-xl border border-line-strong px-4 py-2 text-xs font-semibold text-ink-2 transition-colors hover:bg-paper-2"
              >
                Discussion
              </NuxtLink>
            </div>
          </div>
        </div>
      </section>

      <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <DesignCard class="p-5">
          <div class="flex items-start justify-between gap-3">
            <DesignStat label="Escrow" :value="escrowAmount" tone="brand" hint="Released only on your approval" />
            <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-soft">
              <Lock :size="17" class="text-green" />
            </div>
          </div>
        </DesignCard>
        <DesignCard class="p-5">
          <div class="flex items-start justify-between gap-3">
            <DesignStat label="Active jobs" :value="String(activeJobs)" hint="All price-locked" />
            <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-mint">
              <Package :size="17" class="text-brand" />
            </div>
          </div>
        </DesignCard>
        <DesignCard class="p-5">
          <div class="flex items-start justify-between gap-3">
            <DesignStat
              label="Quotes to review"
              :value="String(quotesToReview)"
              :tone="quotesToReview > 0 ? 'amber' : 'ink'"
              hint="All under fair-price cap"
            />
            <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-soft">
              <FileText :size="17" class="text-amber" />
            </div>
          </div>
        </DesignCard>
        <DesignCard class="p-5">
          <div class="flex items-start justify-between gap-3">
            <DesignStat label="Next due" :value="nextDueDate || '—'" hint="Acknowledged by you" />
            <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-mint">
              <CalendarRange :size="17" class="text-brand" />
            </div>
          </div>
        </DesignCard>
      </div>

      <DesignBuyerSection
        index="02"
        title="Your jobs"
        hint="My orders &mdash; one workflow, live for everyone"
      >
        <template #action>
          <button
            type="button"
            class="text-xs font-semibold text-brand transition-colors hover:text-brand-deep"
            @click="scrollTo('#jobs')"
          >
            View all
          </button>
        </template>

        <DesignCard class="overflow-hidden">
          <div v-if="filteredJobs.length" class="overflow-x-auto">
            <table class="w-full min-w-[720px] text-sm">
              <thead>
                <tr class="border-b border-line bg-paper-2">
                  <th class="px-5 py-3 text-left font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-ink-3">Job</th>
                  <th class="px-4 py-3 text-left font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-ink-3">Held by</th>
                  <th class="px-4 py-3 text-left font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-ink-3">Status</th>
                  <th class="px-4 py-3 text-left font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-ink-3">Due</th>
                  <th class="px-4 py-3 text-right font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-ink-3">Your price</th>
                  <th class="w-12 px-4 py-3">
                    <span class="sr-only">Open</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="job in filteredJobs.slice(0, 5)"
                  :key="job.id"
                  class="border-b border-line last:border-0 hover:bg-paper-2/50"
                >
                  <td class="px-5 py-3.5">
                    <div class="font-mono text-[13px] font-semibold text-ink">{{ jobCode(job) }}</div>
                    <div class="mt-0.5 max-w-[220px] truncate text-xs text-ink-2">
                      {{ job.title }}<template v-if="jobQuantity(job)"> &middot; {{ jobQuantity(job).toLocaleString() }} pcs</template>
                    </div>
                  </td>
                  <td class="px-4 py-3.5">
                    <span class="inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold" :class="holderMeta(job).cls">{{ holderMeta(job).label }}</span>
                    <div v-if="job.timing?.next_action" class="mt-1 max-w-[160px] truncate text-[10px] text-ink-3">{{ job.timing.next_action }}</div>
                  </td>
                  <td class="px-4 py-3.5">
                    <span class="inline-flex items-center gap-1.5 text-xs font-semibold text-ink">
                      <span class="h-1.5 w-1.5 rounded-full" :class="statusDot(job)" />
                      {{ jobStatusLabel(job) }}
                    </span>
                  </td>
                  <td class="px-4 py-3.5">
                    <div class="text-xs font-semibold text-ink">{{ jobDue(job) || '—' }}</div>
                    <div class="mt-0.5 text-[10px] text-ink-3">EAT &middot; Nairobi</div>
                  </td>
                  <td class="px-4 py-3.5 text-right">
                    <div class="font-mono text-[13px] font-semibold text-ink">{{ jobPrice(job) }}</div>
                    <div v-if="jobPerPiece(job)" class="mt-0.5 font-mono text-[10px] text-ink-3">{{ jobPerPiece(job) }}/pc</div>
                    <span v-else-if="job.payment_confirmed" class="mt-1 inline-flex rounded-full bg-green-soft px-2 py-0.5 text-[9px] font-bold text-green">In escrow</span>
                  </td>
                  <td class="px-4 py-3.5 text-right">
                    <button
                      type="button"
                      class="rounded-xl p-2 text-ink-3 transition-colors hover:bg-paper-2 hover:text-brand"
                      title="Open job"
                      @click="scrollTo('#jobs')"
                    >
                      <Eye :size="16" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <DesignEmptyNote
            v-else
            icon="PackageCheck"
            title="No jobs yet"
            hint="Accept a quote and it becomes a live job here — price-locked, escrow-protected and tracked to delivery."
          >
            <button type="button" class="press-key rounded-xl bg-brand px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-brand-deep" @click="openNewQuote">
              Start a quote
            </button>
          </DesignEmptyNote>

          <div class="flex items-start gap-2 border-t border-line px-5 py-3 text-[11px] text-ink-3">
            <ShieldCheck :size="14" class="mt-0.5 shrink-0 text-green" />
            You never see press sheet math. Your price, dates and approvals are the whole story.
          </div>
        </DesignCard>
      </DesignBuyerSection>

      <div class="grid items-start gap-8 lg:grid-cols-3">
        <DesignBuyerSection
          class="lg:col-span-2"
          index="03"
          title="Capped quotes awaiting you"
          hint="Every offer is under the fair-price cap &mdash; accept, counter or decline."
        >
          <template #action>
            <button
              type="button"
              class="shrink-0 text-xs font-semibold text-brand transition-colors hover:text-brand-deep"
              @click="scrollTo('#quotes')"
            >
              See all
            </button>
          </template>

          <DesignCard class="overflow-hidden">
            <div v-if="overviewQuotes.length" class="divide-y divide-line">
              <div v-for="quote in overviewQuotes" :key="`${quote.kind}-${quote.id}`" class="flex flex-wrap items-center gap-4 px-5 py-4">
                <div class="min-w-0 flex-1">
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="font-mono text-[10px] font-semibold uppercase tracking-wider text-brand">{{ quote.reference }}</span>
                    <span v-if="quote.needs_attention" class="rounded-full bg-amber-soft px-2 py-0.5 text-[9px] font-bold text-amber">Needs review</span>
                  </div>
                  <div class="mt-1 truncate text-sm font-bold text-ink">{{ quote.title }}</div>
                  <div class="mt-0.5 text-[10px] text-ink-3">
                    {{ quote.holder ? `Held by ${quote.holder}` : 'With your print partner' }}<template v-if="quote.readyText"> &middot; Ready {{ quote.readyText }}</template>
                  </div>
                </div>
                <div class="text-right">
                  <div class="font-mono text-[13px] font-semibold text-ink">{{ quote.total !== null ? money(quote.total) : 'Pricing' }}</div>
                  <div v-if="quote.perPiece !== null" class="font-mono text-[10px] text-ink-3">{{ money(quote.perPiece) }}/pc</div>
                </div>
                <div class="flex w-full shrink-0 gap-2 sm:w-auto">
                  <button
                    type="button"
                    class="press-key flex-1 rounded-xl bg-brand px-3 py-2 text-[11px] font-bold text-white transition-colors hover:bg-brand-deep sm:flex-none"
                    @click="scrollTo('#quotes')"
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    class="flex-1 rounded-xl border border-line-strong px-3 py-2 text-[11px] font-bold text-ink-2 hover:bg-paper-2 sm:flex-none"
                    @click="scrollTo('#quotes')"
                  >
                    Counter
                  </button>
                  <button
                    type="button"
                    class="flex-1 rounded-xl border border-line-strong px-3 py-2 text-[11px] font-bold text-red hover:bg-paper-2 sm:flex-none"
                    @click="scrollTo('#quotes')"
                  >
                    Decline
                  </button>
                </div>
              </div>
            </div>

            <DesignEmptyNote
              v-else
              icon="ReceiptText"
              title="No quotes waiting"
              hint="Start a new quote and offers from your print partner will land here."
            >
              <button type="button" class="press-key rounded-xl bg-brand px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-brand-deep" @click="openNewQuote">
                New quote
              </button>
            </DesignEmptyNote>
          </DesignCard>
        </DesignBuyerSection>

        <DesignCard class="p-5">
          <div class="flex items-center gap-2">
            <ShieldCheck :size="18" class="text-green" />
            <h2 class="text-base font-bold tracking-tight text-ink">Your money, protected</h2>
          </div>
          <div class="mt-4 space-y-4">
            <div v-for="row in trustRows" :key="row.title" class="flex gap-3">
              <div class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-green-soft">
                <Check :size="14" class="text-green" />
              </div>
              <div>
                <div class="text-sm font-bold text-ink">{{ row.title }}</div>
                <p class="mt-0.5 text-[11px] leading-relaxed text-ink-2">{{ row.body }}</p>
              </div>
            </div>
          </div>
        </DesignCard>
      </div>

      <DesignBuyerSection
        id="quotes"
        index="04"
        title="My quotes"
        hint="Offers from your print partner and drafts you're still building."
      >
        <template #action>
          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-xl border border-line-strong px-3 py-2 text-xs font-semibold text-ink transition-colors hover:bg-paper-2"
            @click="openNewQuote"
          >
            <Plus :size="14" /> New quote
          </button>
        </template>

        <QuoteResponsesPanel />

        <DesignCard v-if="draftSummaries.length" class="mt-4 overflow-hidden">
          <div class="border-b border-line px-5 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-3">Drafts</div>
          <div class="divide-y divide-line">
            <div v-for="draft in draftSummaries" :key="`draft-${draft.id}`" class="flex flex-wrap items-center gap-3 px-5 py-4">
              <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-paper-2"><FileText :size="16" class="text-ink-3" /></div>
              <div class="min-w-0 flex-1">
                <div class="truncate text-sm font-bold text-ink">{{ draft.title }}</div>
                <div class="mt-0.5 text-[10px] text-ink-3">{{ draft.reference }} &middot; updated {{ draft.updated || draft.created }}</div>
              </div>
              <span class="font-mono text-xs font-semibold text-ink-2">{{ draft.total !== null ? money(draft.total) : 'Price locked' }}</span>
              <button type="button" class="inline-flex items-center gap-1 rounded-xl border border-line-strong px-3 py-2 text-[11px] font-bold text-ink hover:bg-paper-2" @click="continueDraft(draft.reference)">
                Open <ArrowRight :size="12" />
              </button>
            </div>
          </div>
        </DesignCard>

        <DesignEmptyNote
          v-else-if="!loadingQuotes && !responses.hasResponses"
          icon="ReceiptText"
          title="No quotes here yet"
          hint="Build a quote in about 30 seconds. It lands here as a draft, then moves to your print partner when you send it."
          class="mt-4"
        >
          <button type="button" class="press-key inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-brand-deep" @click="openNewQuote">
            Build your first quote <ArrowRight :size="13" />
          </button>
        </DesignEmptyNote>

        <DesignAlert v-if="quotesError" tone="error" class="mt-4">
          {{ quotesError }}
        </DesignAlert>
      </DesignBuyerSection>

      <DesignBuyerSection
        id="jobs"
        index="05"
        title="Active jobs"
        hint="My orders &mdash; one workflow, same job, live for everyone."
      >
        <ClientJobsPanel />
      </DesignBuyerSection>

      <DesignBuyerSection
        id="payments"
        index="06"
        title="Payments"
        hint="What you paid and what is held in escrow."
      >
        <template #action>
          <button
            type="button"
            class="rounded-xl border border-line-strong px-3 py-2 text-xs font-semibold text-ink transition-colors hover:bg-paper-2"
            @click="jobsStore.fetchPaymentHistory()"
          >
            Refresh
          </button>
        </template>

        <div v-if="jobsStore.paymentHistory.length" class="overflow-x-auto rounded-2xl border border-line bg-card shadow-card">
          <table class="w-full min-w-[620px] text-sm">
            <thead>
              <tr class="border-b border-line bg-paper-2">
                <th class="px-5 py-3 text-left font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-ink-3">Job</th>
                <th class="px-4 py-3 text-left font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-ink-3">Payment ref</th>
                <th class="px-4 py-3 text-right font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-ink-3">Amount</th>
                <th class="px-4 py-3 text-left font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-ink-3">Channel</th>
                <th class="px-4 py-3 text-left font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-ink-3">Status</th>
                <th class="px-4 py-3 text-left font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-ink-3">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="payment in jobsStore.paymentHistory" :key="payment.id" class="border-b border-line last:border-0">
                <td class="px-5 py-3 font-mono text-[12.5px] font-semibold text-ink">{{ payment.job_reference }}</td>
                <td class="px-4 py-3 text-xs text-ink-2">{{ payment.payment_reference || payment.reference }}</td>
                <td class="px-4 py-3 text-right font-mono text-[12.5px] font-semibold text-ink">{{ formatKSh(Number(payment.amount ?? 0), 0) }}</td>
                <td class="px-4 py-3 text-xs capitalize text-ink-2">{{ payment.channel || '—' }}</td>
                <td class="px-4 py-3">
                  <span class="rounded-full bg-paper-2 px-2 py-0.5 text-[10px] font-bold capitalize text-ink-2">{{ payment.payment_status }}</span>
                </td>
                <td class="px-4 py-3 text-xs text-ink-2">{{ formatDate(payment.created_at) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <DesignEmptyNote
          v-else
          icon="Banknote"
          title="No payments yet"
          hint="Escrow is created when you accept a quote."
        />
      </DesignBuyerSection>

      <DesignBuyerSection
        id="upload"
        index="07"
        title="Upload artwork"
        hint="Send print-ready files for jobs that are waiting on artwork."
      >
        <DesignAlert v-if="uploadError" tone="error" class="mb-3">
          {{ uploadError }}
        </DesignAlert>

        <div v-if="artworkJobs.length" class="space-y-3">
          <div v-for="job in artworkJobs" :key="job.id" class="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-card p-4 shadow-card">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-mint"><Upload :size="18" class="text-brand" /></div>
            <div class="min-w-0 flex-1">
              <div class="text-sm font-bold text-ink">{{ jobCode(job) }} &middot; {{ job.title }}</div>
              <div class="mt-0.5 text-[11px] text-ink-2">{{ job.artwork_status_label || (job.artwork_missing ? 'Artwork needed' : 'Waiting for your file') }}</div>
            </div>
            <label class="press-key inline-flex cursor-pointer items-center gap-2 rounded-xl bg-brand px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-brand-deep">
              <Loader2 v-if="uploadingJobId === job.id" :size="14" class="animate-spin" />
              <Upload v-else :size="14" />
              {{ uploadingJobId === job.id ? 'Uploading…' : 'Upload artwork' }}
              <input
                type="file"
                class="hidden"
                accept=".pdf,.png,.jpg,.jpeg,.tif,.tiff,.ai,.eps"
                :disabled="uploadingJobId === job.id"
                @change="onArtwork(job, $event)"
              >
            </label>
          </div>
        </div>
        <DesignEmptyNote
          v-else
          icon="ImageUp"
          title="Nothing to upload right now"
          hint="We'll flag a job here when artwork is needed."
        />
      </DesignBuyerSection>

      <DesignBuyerSection
        id="history"
        index="08"
        title="History"
        hint="Completed and closed jobs, kept for your records."
      >
        <div v-if="completedJobs.length" class="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-card shadow-card">
          <div v-for="job in completedJobs" :key="job.id" class="flex flex-wrap items-center gap-3 px-5 py-4">
            <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-green-soft"><Check :size="16" class="text-green" /></div>
            <div class="min-w-0 flex-1">
              <div class="text-sm font-bold text-ink">{{ jobCode(job) }} &middot; {{ job.title }}</div>
              <div class="mt-0.5 text-[10px] text-ink-3">{{ jobStatusLabel(job) }} &middot; {{ jobDue(job) || 'No due date' }}</div>
            </div>
            <div class="font-mono text-[13px] font-semibold text-ink">{{ jobPrice(job) }}</div>
            <NuxtLink v-if="job.tracking_url" :to="job.tracking_url" class="rounded-xl border border-line-strong px-3 py-2 text-[11px] font-bold text-ink hover:bg-paper-2">
              View
            </NuxtLink>
          </div>
        </div>
        <DesignEmptyNote
          v-else
          icon="CheckCircle2"
          title="No completed jobs yet"
          hint="Your first delivery will be archived here."
        />
      </DesignBuyerSection>

      <div class="grid gap-6 lg:grid-cols-2">
        <DesignBuyerSection
          id="messages"
          index="09"
          title="Messages"
          hint="Quote threads with your print partner"
        >
          <DesignCard class="flex flex-wrap items-center justify-between gap-4 p-5">
            <p class="max-w-[36ch] text-sm leading-relaxed text-ink-2">
              Quote conversations, artwork notes and change requests live in your inbox.
            </p>
            <NuxtLink
              to="/app/messages"
              class="inline-flex items-center gap-1.5 rounded-xl border border-line-strong px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-paper-2"
            >
              Open messages <ArrowRight :size="13" />
            </NuxtLink>
          </DesignCard>
        </DesignBuyerSection>

        <DesignBuyerSection
          id="notifications"
          index="10"
          title="Notifications"
          hint="Price, date and job updates"
        >
          <DesignCard class="flex flex-wrap items-center justify-between gap-4 p-5">
            <p class="max-w-[36ch] text-sm leading-relaxed text-ink-2">
              Every price update, approval and stage change is recorded in your notification feed.
            </p>
            <NuxtLink
              to="/notifications"
              class="inline-flex items-center gap-1.5 rounded-xl border border-line-strong px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-paper-2"
            >
              Open notifications <ArrowRight :size="13" />
            </NuxtLink>
          </DesignCard>
        </DesignBuyerSection>
      </div>

      <div class="pb-2" />
    </div>
  </DesignBuyerSurface>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { Component } from 'vue'
import {
  AlertCircle, AlertTriangle, ArrowLeft, ArrowRight, ArrowUpRight, CalendarRange, Check,
  CreditCard, Eye, FileText, Loader2, Lock, Package, Plus, ShieldCheck, Sparkles, Upload,
} from 'lucide-vue-next'
import { money } from '~/shared/workflow/printy'
import { getApiErrorMessage } from '~/shared/api'
import { summarizeBuyerItem } from '~/shared/quote-handoff'
import { formatKSh } from '~/utils/money'
import type { BuyerQuoteItem, ClientJobRecord } from '~/shared/types'
import { useWorkflowStore } from '~/stores/workflow'
import { useCalculatorStore } from '~/stores/calculator'
import { useAuthStore } from '~/stores/auth'
import { useClientJobsStore } from '~/stores/client-jobs'
import { useClientResponsesStore } from '~/stores/responses'
import DesignAlert from '~/components/design/ui/Alert.vue'
import DesignEmptyNote from '~/components/design/ui/EmptyNote.vue'

interface ApprovalItem {
  key: string
  icon: Component
  iconClass: string
  chipClass: string
  label: string
  reference: string
  oldValue?: string
  newValue: string
  reason: string
  target: string
}

const w = useWorkflowStore()
const calcStore = useCalculatorStore()
const auth = useAuthStore()
const jobsStore = useClientJobsStore()
const responses = useClientResponsesStore()

const search = useState<string>('client-search', () => '')
const navQuoteCount = useState<number>('client-nav-quote-count', () => 0)

const route = useRoute()
if (route.query.tab === 'quote' || route.query.quote === '1') {
  w.buyerQuoteOpen = true
}

const quotes = ref<BuyerQuoteItem[]>([])
const loadingQuotes = ref(false)
const quotesError = ref('')
const uploadingJobId = ref<number | null>(null)
const uploadError = ref('')

const summaries = computed(() => quotes.value.map(summarizeBuyerItem))

const filteredJobs = computed(() => {
  const query = search.value.trim().toLowerCase()
  if (!query) {
    return jobsStore.jobs
  }
  return jobsStore.jobs.filter((job) => {
    return `${jobCode(job)} ${job.title} ${job.status} ${job.timing?.stage_label ?? ''}`.toLowerCase().includes(query)
  })
})

const filteredSummaries = computed(() => {
  const query = search.value.trim().toLowerCase()
  if (!query) {
    return summaries.value
  }
  return summaries.value.filter((quote) => {
    return `${quote.reference} ${quote.title} ${quote.statusLabel}`.toLowerCase().includes(query)
  })
})

const overviewQuotes = computed(() =>
  filteredSummaries.value.filter(quote => quote.total !== null && !quote.muted).slice(0, 3),
)
const draftSummaries = computed(() => filteredSummaries.value.filter(quote => quote.kind === 'draft'))

const activeJobs = computed(() =>
  jobsStore.jobs.filter(job => !['completed', 'delivered', 'cancelled'].includes(String(job.status).toLowerCase())).length,
)

const quotesToReview = computed(() =>
  Math.max(quotes.value.filter(quote => quote.needs_attention).length, responses.pending.length),
)

const completedJobs = computed(() =>
  filteredJobs.value.filter(job => ['completed', 'delivered', 'cancelled'].includes(String(job.status).toLowerCase())),
)

const artworkJobs = computed(() =>
  filteredJobs.value.filter((job) => {
    const done = ['completed', 'delivered', 'cancelled'].includes(String(job.status).toLowerCase())
    return !done && ((job.artwork_required && !job.artwork_uploaded) || job.artwork_missing)
  }),
)

const approvals = computed<ApprovalItem[]>(() => {
  const list: ApprovalItem[] = []

  for (const response of responses.items) {
    if (response.price_updated) {
      list.push({
        key: `price-${response.id}`,
        icon: CreditCard,
        iconClass: 'tone-accent text-[var(--accent)]',
        chipClass: 'tone-accent text-[var(--accent)]',
        label: 'Price updated',
        reference: `Offer #${response.id}`,
        oldValue: formatKSh(Number(response.price_updated_old_total ?? 0), 0),
        newValue: formatKSh(Number(response.price_updated_new_total ?? response.price ?? 0), 0),
        reason: 'Your print partner updated the price — acknowledge it to keep moving.',
        target: '#quotes',
      })
    }
    if (response.date_updated) {
      list.push({
        key: `date-${response.id}`,
        icon: CalendarRange,
        iconClass: 'tone-accent text-[var(--accent)]',
        chipClass: 'tone-accent text-[var(--accent)]',
        label: 'Date updated',
        reference: `Offer #${response.id}`,
        oldValue: response.date_updated_old ? formatDate(response.date_updated_old) : undefined,
        newValue: response.date_updated_new ? formatDate(response.date_updated_new) : 'New date proposed',
        reason: 'A delivery date moved — approve the new date before production continues.',
        target: '#quotes',
      })
    }
  }

  for (const job of jobsStore.jobs) {
    if (job.artwork_confirmation?.state === 'requested') {
      list.push({
        key: `artwork-${job.id}`,
        icon: AlertCircle,
        iconClass: 'tone-warn text-[#8A5A00]',
        chipClass: 'tone-warn text-[#8A5A00]',
        label: 'Action needed',
        reference: jobCode(job),
        newValue: 'Artwork sign-off required',
        reason: 'Confirm the artwork before this job goes to production.',
        target: '#jobs',
      })
    } else if (!job.payment_confirmed && ['awaiting_payment', 'payment_pending'].includes(String(job.payment_status))) {
      list.push({
        key: `payment-${job.id}`,
        icon: CreditCard,
        iconClass: 'tone-accent text-[var(--accent)]',
        chipClass: 'tone-accent text-[var(--accent)]',
        label: 'Payment due',
        reference: jobCode(job),
        newValue: formatKSh(jobTotal(job), 0),
        reason: 'Payment is required before production starts.',
        target: '#jobs',
      })
    }
  }

  for (const quote of quotes.value) {
    if (quote.needs_attention) {
      const summary = summarizeBuyerItem(quote)
      list.push({
        key: `quote-${quote.item_type}-${summary.id}`,
        icon: FileText,
        iconClass: 'tone-accent text-[var(--accent)]',
        chipClass: 'tone-accent text-[var(--accent)]',
        label: 'Quote review',
        reference: summary.reference,
        newValue: summary.title,
        reason: 'A quote is waiting for your review.',
        target: '#quotes',
      })
    }
  }

  return list
})

watch(quotesToReview, (count) => {
  navQuoteCount.value = count
}, { immediate: true })

async function loadQuotes() {
  if (loadingQuotes.value) {
    return
  }
  loadingQuotes.value = true
  quotesError.value = ''
  try {
    quotes.value = await calcStore.fetchBuyerQuotes()
  } catch (e) {
    quotesError.value = getApiErrorMessage(e, "We couldn't load your quotes. Please try again.")
  } finally {
    loadingQuotes.value = false
  }
}

function openNewQuote() {
  w.buyerQuoteOpen = true
  quotesError.value = ''
}

function closeNewQuote() {
  w.buyerQuoteOpen = false
}

function continueDraft(reference: string) {
  const item = quotes.value.find(q => q.item_type === 'draft' && q.draft.draft_reference === reference)
  if (item?.item_type === 'draft') {
    const snapshot = item.draft.calculator_inputs_snapshot
    const productKey = typeof snapshot?.product_type === 'string' ? snapshot.product_type : ''
    void continueIntoProduct(productKey, snapshot)
  }
  w.buyerQuoteOpen = true
}

async function continueIntoProduct(productKey: string, snapshot: Record<string, unknown> | null) {
  if (calcStore.configStatus !== 'ready' && calcStore.configStatus !== 'error') {
    try {
      await calcStore.loadConfig()
    } catch {
      /* the calculator surfaces config failures itself */
    }
  }
  const product = calcStore.config?.products.find(p => p.key === productKey) ?? null
  if (product) {
    calcStore.adoptSpec(snapshot, product.key)
  } else if (calcStore.config?.products[0]) {
    calcStore.setProduct(calcStore.config.products[0].key)
  }
}

async function onQuoteCreated() {
  w.buyerQuoteOpen = false
  await loadQuotes()
}

onMounted(() => {
  jobsStore.fetchJobs()
  jobsStore.fetchPaymentHistory()
  loadQuotes()
})

const nextDueDate = computed(() => {
  const dueDates = jobsStore.jobs
    .filter(job => !['completed', 'delivered', 'cancelled'].includes(String(job.status).toLowerCase()))
    .map(job => job.timing?.due_date)
    .filter((value): value is string => Boolean(value))
    .map(value => new Date(value))
    .filter(date => !Number.isNaN(date.getTime()))
  if (dueDates.length === 0) return null
  dueDates.sort((a, b) => a.getTime() - b.getTime())
  return dueDates[0]!.toLocaleDateString('en-KE', { weekday: 'short', day: 'numeric', month: 'short' })
})

const escrowAmount = computed(() => {
  const total = jobsStore.jobs
    .filter(job => !['completed', 'delivered', 'cancelled'].includes(String(job.status).toLowerCase()))
    .filter(job => job.escrow_amount !== undefined && job.escrow_amount !== null)
    .map(job => Number(job.escrow_amount))
    .reduce((sum, amount) => sum + amount, 0)
  return total > 0 ? formatKSh(total, 0) : formatKSh(0, 0)
})

const firstName = computed(() => auth.user?.name?.trim().split(' ')[0] || '')
const greeting = computed(() => {
  const hour = new Date().getHours()
  const part = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  return firstName.value ? `${part}, ${firstName.value}` : part
})

const trustRows = [
  { title: 'Only pay for what\'s accepted', body: 'Each quote is capped at the fair market rate. Your final price never changes silently.' },
  { title: 'Funds held in escrow', body: 'Your money sits in a protected account until you approve delivery.' },
  { title: 'No hidden fees', body: 'The price you accept is the price you pay — itemised upfront.' },
  { title: 'Every change needs you', body: 'Production will not start or change without your explicit sign-off.' },
]

function jobCode(job: ClientJobRecord) {
  return job.code || job.job_reference || job.reference
}

function jobTotal(job: ClientJobRecord) {
  return Number(job.pricing?.client_total ?? 0)
}

function jobQuantity(job: ClientJobRecord) {
  const raw = job.quantity ?? job.qty
  const quantity = Number(raw)
  return Number.isFinite(quantity) && quantity > 0 ? quantity : 0
}

function jobPrice(job: ClientJobRecord) {
  return jobTotal(job) > 0 ? formatKSh(jobTotal(job), 0) : '—'
}

function jobPerPiece(job: ClientJobRecord) {
  const quantity = jobQuantity(job)
  return quantity > 0 && jobTotal(job) > 0 ? formatKSh(jobTotal(job) / quantity, 2) : ''
}

function jobDue(job: ClientJobRecord) {
  const value = job.timing?.due_date || job.requested_deadline
  return value ? formatDate(value) : ''
}

function formatDate(value: string | null | undefined) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-KE', { weekday: 'short', day: 'numeric', month: 'short' })
}

function jobStatusLabel(job: ClientJobRecord) {
  if (job.artwork_confirmation?.state === 'requested') return 'Needs sign-off'
  const status = String(job.status || 'in progress').replace(/_/g, ' ')
  return status.charAt(0).toUpperCase() + status.slice(1)
}

function statusDot(job: ClientJobRecord) {
  const status = String(job.status).toLowerCase()
  if (job.artwork_confirmation?.state === 'requested') return 'bg-[#F5A623]'
  if (['completed', 'delivered', 'collected'].includes(status)) return 'bg-[#2FBF71]'
  if (['cancelled', 'rejected', 'failed'].includes(status)) return 'bg-[#FB4D6D]'
  if (['printing', 'in_production', 'production'].includes(status)) return 'bg-[var(--accent)]'
  if (['awaiting_payment', 'payment_pending'].includes(status)) return 'bg-[#F5A623]'
  return 'bg-[var(--accent)]'
}

function holderMeta(job: ClientJobRecord) {
  const owner = String(job.timing?.stage_owner ?? '').toLowerCase()
  if (owner.includes('manager')) return { label: 'Print manager', cls: 'tone-success text-[#0B7A52]' }
  if (owner.includes('printer') || owner.includes('shop')) return { label: 'Printshop', cls: 'tone-accent text-[var(--accent)]' }
  if (owner.includes('buyer') || owner.includes('client')) return { label: 'You', cls: 'tone-accent text-[var(--accent)]' }
  if (owner.includes('courier')) return { label: 'Courier', cls: 'bg-[var(--panel2)] text-[var(--sub)]' }
  return { label: job.timing?.stage_label || 'Printy', cls: 'bg-[var(--panel2)] text-[var(--sub)]' }
}

function scrollTo(target: string) {
  if (!import.meta.client) return
  document.querySelector(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

async function onArtwork(job: ClientJobRecord, event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  uploadError.value = ''
  uploadingJobId.value = job.id
  try {
    await jobsStore.uploadArtwork(job.id, file)
    await jobsStore.fetchJobs()
  } catch (e) {
    uploadError.value = getApiErrorMessage(e, 'We could not upload that file. Please try again.')
  } finally {
    uploadingJobId.value = null
    input.value = ''
  }
}
</script>
