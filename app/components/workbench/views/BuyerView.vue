<template>
  <!-- instant quote flow: an action on the orders page, never a second tab -->
  <div v-if="w.buyerQuoteOpen" class="pt-4">
    <div class="mx-auto w-full max-w-[1180px]">
      <button
        type="button"
        class="mb-4 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--sub)] transition-colors hover:text-[var(--accent)]"
        @click="closeNewQuote"
      >
        <ArrowLeft :size="13" /> Back to my orders
      </button>
      <CalculatorView authed @quote-created="onQuoteCreated" />
      <div class="pb-8" />
    </div>
  </div>

  <div v-else class="mx-auto w-full max-w-[1200px]">
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div class="flex items-center gap-2 font-mono2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--sub)]">
          <Sparkles :size="12" class="text-[var(--accent)]" /> Client dashboard
        </div>
        <h1 class="mt-1 font-disp text-[26px] font-bold tracking-tight text-[var(--ink)] sm:text-[30px]">{{ greeting }}</h1>
        <p class="mt-1 text-sm text-[var(--sub)]">Every price is locked after acceptance. Every date shift needs your approval.</p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <span v-if="search.trim()" class="text-[11px] font-semibold text-[var(--sub)]">
          Filtering “{{ search.trim() }}”
        </span>
        <button
          type="button"
          class="press-key inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-3 font-mono2 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--accentInk)] transition-colors hover:brightness-95"
          @click="openNewQuote"
        >
          <Plus :size="16" /> New quote
        </button>
      </div>
    </div>

    <div v-if="approvals.length" class="mb-6 rounded-2xl border surface-warn p-5">
      <div class="mb-4 flex flex-wrap items-center gap-2">
        <AlertTriangle :size="18" class="text-[#8A5A00]" />
        <h2 class="text-sm font-extrabold text-[var(--ink)]">Needs your approval</h2>
        <span class="rounded-full tone-warn px-2 py-0.5 text-[10px] font-bold text-[#8A5A00]">{{ approvals.length }}</span>
        <span class="ml-auto hidden text-[11px] font-medium text-[#8A5A00] sm:block">Prices &amp; dates never change silently</span>
      </div>
      <div class="space-y-3">
        <div
          v-for="approval in approvals"
          :key="approval.key"
          class="flex flex-col gap-4 rounded-xl border border-[var(--line)] bg-[var(--panel)] p-4 md:flex-row md:items-center"
        >
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" :class="approval.iconClass">
            <component :is="approval.icon" :size="18" />
          </div>
          <div class="min-w-0 flex-1">
            <div class="mb-1 flex flex-wrap items-center gap-2">
              <span class="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider" :class="approval.chipClass">{{ approval.label }}</span>
              <span class="text-xs font-medium text-[var(--sub)]">{{ approval.reference }}</span>
            </div>
            <p class="text-sm text-[var(--ink)]">
              <span v-if="approval.oldValue" class="mr-2 text-[var(--sub)] line-through">{{ approval.oldValue }}</span>
              <strong class="font-bold text-[var(--ink)]">{{ approval.newValue }}</strong>
            </p>
            <p class="mt-1 text-xs text-[var(--sub)]">{{ approval.reason }}</p>
          </div>
          <div class="flex shrink-0 gap-2">
            <button
              type="button"
              class="press-key rounded-xl bg-[#F5A623] px-4 py-2 text-xs font-bold text-[var(--ink)] transition-colors hover:brightness-95"
              @click="scrollTo(approval.target)"
            >
              Review
            </button>
            <NuxtLink
              to="/app/messages"
              class="rounded-xl border border-[var(--line)] px-4 py-2 text-xs font-semibold text-[var(--sub)] transition-colors hover:bg-[var(--panel2)]"
            >
              Discussion
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <div class="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
      <div class="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-4">
        <div class="flex items-start justify-between">
          <div class="flex h-9 w-9 items-center justify-center rounded-xl tone-success"><Lock :size="17" class="text-[#0B7A52]" /></div>
          <span class="text-[9px] font-bold uppercase tracking-wider text-[var(--sub)]">Escrow</span>
        </div>
        <div class="mt-3 font-disp text-xl font-extrabold tracking-tight text-[var(--ink)]">{{ escrowAmount }}</div>
        <div class="mt-0.5 text-[11px] text-[var(--sub)]">Released only on your approval</div>
      </div>
      <div class="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-4">
        <div class="flex items-start justify-between">
          <div class="flex h-9 w-9 items-center justify-center rounded-xl tone-accent"><Package :size="17" class="text-[var(--accent)]" /></div>
          <span class="text-[9px] font-bold uppercase tracking-wider text-[var(--sub)]">Active</span>
        </div>
        <div class="mt-3 font-disp text-xl font-extrabold tracking-tight text-[var(--ink)]">{{ activeJobs }}</div>
        <div class="mt-0.5 flex items-center gap-1 text-[11px] text-[var(--accent)]">
          All price-locked <ArrowUpRight :size="11" />
        </div>
      </div>
      <div class="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-4">
        <div class="flex items-start justify-between">
          <div class="flex h-9 w-9 items-center justify-center rounded-xl tone-warn"><FileText :size="17" class="text-[#8A5A00]" /></div>
          <span class="text-[9px] font-bold uppercase tracking-wider text-[var(--sub)]">Quotes</span>
        </div>
        <div class="mt-3 font-disp text-xl font-extrabold tracking-tight text-[var(--ink)]">{{ quotesToReview }}</div>
        <div class="mt-0.5 text-[11px] text-[var(--sub)]">All under fair-price cap</div>
      </div>
      <div class="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-4">
        <div class="flex items-start justify-between">
          <div class="flex h-9 w-9 items-center justify-center rounded-xl tone-accent"><CalendarRange :size="17" class="text-[var(--accent)]" /></div>
          <span class="text-[9px] font-bold uppercase tracking-wider text-[var(--sub)]">Due</span>
        </div>
        <div class="mt-3 font-disp text-xl font-extrabold tracking-tight text-[var(--ink)]">{{ nextDueDate || '—' }}</div>
        <div class="mt-0.5 text-[11px] text-[var(--sub)]">Acknowledged by you</div>
      </div>
    </div>

    <div class="mb-6 overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--panel)]">
      <div class="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
        <div>
          <h2 class="font-disp text-base font-extrabold text-[var(--ink)]">Your jobs</h2>
          <p class="mt-0.5 text-[11px] text-[var(--sub)]">My orders · one workflow, live for everyone</p>
        </div>
        <button
          type="button"
          class="text-xs font-bold text-[var(--accent)] transition-colors hover:text-[var(--accent)]"
          @click="scrollTo('#jobs')"
        >
          View all
        </button>
      </div>

      <div v-if="filteredJobs.length" class="overflow-x-auto">
        <table class="w-full min-w-[720px] text-sm">
          <thead>
            <tr class="border-b border-[var(--line)] bg-[var(--panel2)]">
              <th class="px-5 py-3 text-left text-[9px] font-bold uppercase tracking-[0.14em] text-[var(--sub)]">Job</th>
              <th class="px-4 py-3 text-left text-[9px] font-bold uppercase tracking-[0.14em] text-[var(--sub)]">Held by</th>
              <th class="px-4 py-3 text-left text-[9px] font-bold uppercase tracking-[0.14em] text-[var(--sub)]">Status</th>
              <th class="px-4 py-3 text-left text-[9px] font-bold uppercase tracking-[0.14em] text-[var(--sub)]">Due</th>
              <th class="px-4 py-3 text-right text-[9px] font-bold uppercase tracking-[0.14em] text-[var(--sub)]">Your price</th>
              <th class="w-12 px-4 py-3">
                <span class="sr-only">Open</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="job in filteredJobs.slice(0, 5)"
              :key="job.id"
              class="border-b border-[var(--line)] last:border-0 hover:bg-[var(--panel2)]"
            >
              <td class="px-5 py-3.5">
                <div class="font-bold text-[var(--ink)]">{{ jobCode(job) }}</div>
                <div class="mt-0.5 max-w-[220px] truncate text-xs text-[var(--sub)]">
                  {{ job.title }}<template v-if="jobQuantity(job)"> · {{ jobQuantity(job).toLocaleString() }} pcs</template>
                </div>
              </td>
              <td class="px-4 py-3.5">
                <span class="inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold" :class="holderMeta(job).cls">{{ holderMeta(job).label }}</span>
                <div v-if="job.timing?.next_action" class="mt-1 max-w-[160px] truncate text-[10px] text-[var(--sub)]">{{ job.timing.next_action }}</div>
              </td>
              <td class="px-4 py-3.5">
                <span class="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--ink)]">
                  <span class="h-1.5 w-1.5 rounded-full" :class="statusDot(job)" />
                  {{ jobStatusLabel(job) }}
                </span>
              </td>
              <td class="px-4 py-3.5">
                <div class="text-xs font-semibold text-[var(--ink)]">{{ jobDue(job) || '—' }}</div>
                <div class="mt-0.5 text-[10px] text-[var(--sub)]">EAT · Nairobi</div>
              </td>
              <td class="px-4 py-3.5 text-right">
                <div class="text-sm font-extrabold text-[var(--ink)]">{{ jobPrice(job) }}</div>
                <div v-if="jobPerPiece(job)" class="mt-0.5 text-[10px] text-[var(--sub)]">{{ jobPerPiece(job) }}/pc</div>
                <span v-else-if="job.payment_confirmed" class="mt-1 inline-flex rounded-full tone-success px-2 py-0.5 text-[9px] font-bold text-[#0B7A52]">In escrow</span>
              </td>
              <td class="px-4 py-3.5 text-right">
                <button
                  type="button"
                  class="rounded-xl p-2 text-[var(--sub)] transition-colors hover:bg-[var(--panel2)] hover:text-[var(--accent)]"
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

      <div v-else class="px-5 py-10 text-center">
        <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl tone-accent"><Package :size="20" class="text-[var(--accent)]" /></div>
        <h3 class="mt-3 font-disp text-sm font-bold text-[var(--ink)]">No jobs yet</h3>
        <p class="mx-auto mt-1 max-w-[36ch] text-xs text-[var(--sub)]">Accept a quote and it becomes a live job here — price-locked, escrow-protected and tracked to delivery.</p>
        <button type="button" class="press-key mt-4 rounded-xl bg-[var(--accent)] px-4 py-2 text-xs font-bold text-[var(--accentInk)] transition-colors hover:brightness-95" @click="openNewQuote">
          Start a quote
        </button>
      </div>

      <div class="flex items-start gap-2 border-t border-[var(--line)] px-5 py-3 text-[11px] text-[var(--sub)]">
        <ShieldCheck :size="14" class="mt-0.5 shrink-0 text-[#0B7A52]" />
        You never see press sheet math. Your price, dates and approvals are the whole story.
      </div>
    </div>

    <div class="mb-10 grid gap-6 lg:grid-cols-3">
      <div class="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--panel)] lg:col-span-2">
        <div class="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
          <div>
            <h2 class="font-disp text-base font-extrabold text-[var(--ink)]">Capped quotes awaiting you</h2>
            <p class="mt-0.5 text-[11px] text-[var(--sub)]">Every offer is under the fair-price cap — accept, counter or decline.</p>
          </div>
          <button type="button" class="shrink-0 text-xs font-bold text-[var(--accent)] hover:text-[var(--accent)]" @click="scrollTo('#quotes')">
            See all
          </button>
        </div>

        <div v-if="overviewQuotes.length" class="divide-y divide-[var(--line)]">
          <div v-for="quote in overviewQuotes" :key="`${quote.kind}-${quote.id}`" class="flex flex-wrap items-center gap-4 px-5 py-4">
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <span class="text-[10px] font-bold uppercase tracking-wider text-[var(--accent)]">{{ quote.reference }}</span>
                <span v-if="quote.needs_attention" class="rounded-full tone-warn px-2 py-0.5 text-[9px] font-bold text-[#8A5A00]">Needs review</span>
              </div>
              <div class="mt-1 truncate text-sm font-bold text-[var(--ink)]">{{ quote.title }}</div>
              <div class="mt-0.5 text-[10px] text-[var(--sub)]">
                {{ quote.holder ? `Held by ${quote.holder}` : 'With your print partner' }}<template v-if="quote.readyText"> · Ready {{ quote.readyText }}</template>
              </div>
            </div>
            <div class="text-right">
              <div class="text-sm font-extrabold text-[var(--ink)]">{{ quote.total !== null ? money(quote.total) : 'Pricing' }}</div>
              <div v-if="quote.perPiece !== null" class="text-[10px] text-[var(--sub)]">{{ money(quote.perPiece) }}/pc</div>
            </div>
            <div class="flex w-full shrink-0 gap-2 sm:w-auto">
              <button
                type="button"
                class="press-key flex-1 rounded-xl bg-[var(--accent)] px-3 py-2 text-[11px] font-bold text-[var(--accentInk)] transition-colors hover:brightness-95 sm:flex-none"
                @click="scrollTo('#quotes')"
              >
                Accept
              </button>
              <button
                type="button"
                class="flex-1 rounded-xl border border-[var(--line)] px-3 py-2 text-[11px] font-bold text-[var(--sub)] hover:bg-[var(--panel2)] sm:flex-none"
                @click="scrollTo('#quotes')"
              >
                Counter
              </button>
              <button
                type="button"
                class="flex-1 rounded-xl border border-[var(--line)] px-3 py-2 text-[11px] font-bold text-[#B4243F] hover:bg-[var(--panel2)] sm:flex-none"
                @click="scrollTo('#quotes')"
              >
                Decline
              </button>
            </div>
          </div>
        </div>

        <div v-else class="px-5 py-10 text-center">
          <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl tone-warn"><FileText :size="20" class="text-[#8A5A00]" /></div>
          <h3 class="mt-3 font-disp text-sm font-bold text-[var(--ink)]">No quotes waiting</h3>
          <p class="mx-auto mt-1 max-w-[34ch] text-xs text-[var(--sub)]">Start a new quote and offers from your print partner will land here.</p>
          <button type="button" class="press-key mt-4 rounded-xl bg-[var(--accent)] px-4 py-2 text-xs font-bold text-[var(--accentInk)] transition-colors hover:brightness-95" @click="openNewQuote">
            New quote
          </button>
        </div>
      </div>

      <div class="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5">
        <div class="flex items-center gap-2">
          <ShieldCheck :size="18" class="text-[#0B7A52]" />
          <h2 class="font-disp text-base font-extrabold text-[var(--ink)]">Your money, protected</h2>
        </div>
        <div class="mt-4 space-y-4">
          <div v-for="row in trustRows" :key="row.title" class="flex gap-3">
            <div class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl tone-success">
              <Check :size="14" class="text-[#0B7A52]" />
            </div>
            <div>
              <div class="text-sm font-bold text-[var(--ink)]">{{ row.title }}</div>
              <p class="mt-0.5 text-[11px] leading-relaxed text-[var(--sub)]">{{ row.body }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <section id="quotes" class="scroll-mt-24">
      <div class="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 class="font-disp text-base font-extrabold text-[var(--ink)]">My quotes</h2>
          <p class="mt-0.5 text-xs text-[var(--sub)]">Offers from your print partner and drafts you're still building.</p>
        </div>
        <button type="button" class="inline-flex items-center gap-1.5 rounded-xl border border-[var(--line)] px-3 py-2 text-xs font-bold text-[var(--ink)] hover:bg-[var(--panel2)]" @click="openNewQuote">
          <Plus :size="14" /> New quote
        </button>
      </div>

      <QuoteResponsesPanel />

      <div v-if="draftSummaries.length" class="mt-4 overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--panel)]">
        <div class="border-b border-[var(--line)] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--sub)]">Drafts</div>
        <div class="divide-y divide-[var(--line)]">
          <div v-for="draft in draftSummaries" :key="`draft-${draft.id}`" class="flex flex-wrap items-center gap-3 px-5 py-4">
            <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--panel2)]"><FileText :size="16" class="text-[var(--sub)]" /></div>
            <div class="min-w-0 flex-1">
              <div class="truncate text-sm font-bold text-[var(--ink)]">{{ draft.title }}</div>
              <div class="mt-0.5 text-[10px] text-[var(--sub)]">{{ draft.reference }} · updated {{ draft.updated || draft.created }}</div>
            </div>
            <span class="text-xs font-semibold text-[var(--sub)]">{{ draft.total !== null ? money(draft.total) : 'Price locked' }}</span>
            <button type="button" class="inline-flex items-center gap-1 rounded-xl border border-[var(--line)] px-3 py-2 text-[11px] font-bold text-[var(--ink)] hover:bg-[var(--panel2)]" @click="continueDraft(draft.reference)">
              Open <ArrowRight :size="12" />
            </button>
          </div>
        </div>
      </div>

      <div v-else-if="!loadingQuotes && !responses.hasResponses" class="mt-4 rounded-2xl border border-dashed border-[var(--line)] bg-[var(--panel)] px-5 py-10 text-center">
        <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl tone-accent"><FileText :size="20" class="text-[var(--accent)]" /></div>
        <h3 class="mt-3 font-disp text-sm font-bold text-[var(--ink)]">No quotes here yet</h3>
        <p class="mx-auto mt-1 max-w-[40ch] text-xs text-[var(--sub)]">Build a quote in about 30 seconds. It lands here as a draft, then moves to your print partner when you send it.</p>
        <button type="button" class="press-key mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[var(--accent)] px-4 py-2 text-xs font-bold text-[var(--accentInk)] transition-colors hover:brightness-95" @click="openNewQuote">
          Build your first quote <ArrowRight :size="13" />
        </button>
      </div>

      <div v-if="quotesError" class="mt-4 rounded-xl surface-danger px-4 py-3 text-xs text-[#B4243F]">{{ quotesError }}</div>
    </section>

    <section id="jobs" class="mt-10 scroll-mt-24">
      <div class="mb-4">
        <h2 class="font-disp text-base font-extrabold text-[var(--ink)]">Active jobs</h2>
        <p class="mt-0.5 text-xs text-[var(--sub)]">My orders — one workflow, same job, live for everyone.</p>
      </div>
      <ClientJobsPanel />
    </section>

    <section id="payments" class="mt-10 scroll-mt-24">
      <div class="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 class="font-disp text-base font-extrabold text-[var(--ink)]">Payments</h2>
          <p class="mt-0.5 text-xs text-[var(--sub)]">What you paid and what is held in escrow.</p>
        </div>
        <button type="button" class="rounded-xl border border-[var(--line)] px-3 py-2 text-xs font-bold text-[var(--ink)] hover:bg-[var(--panel2)]" @click="jobsStore.fetchPaymentHistory()">
          Refresh
        </button>
      </div>

      <div v-if="jobsStore.paymentHistory.length" class="overflow-x-auto rounded-2xl border border-[var(--line)] bg-[var(--panel)]">
        <table class="w-full min-w-[620px] text-sm">
          <thead>
            <tr class="border-b border-[var(--line)] bg-[var(--panel2)]">
              <th class="px-5 py-3 text-left text-[9px] font-bold uppercase tracking-[0.14em] text-[var(--sub)]">Job</th>
              <th class="px-4 py-3 text-left text-[9px] font-bold uppercase tracking-[0.14em] text-[var(--sub)]">Payment ref</th>
              <th class="px-4 py-3 text-right text-[9px] font-bold uppercase tracking-[0.14em] text-[var(--sub)]">Amount</th>
              <th class="px-4 py-3 text-left text-[9px] font-bold uppercase tracking-[0.14em] text-[var(--sub)]">Channel</th>
              <th class="px-4 py-3 text-left text-[9px] font-bold uppercase tracking-[0.14em] text-[var(--sub)]">Status</th>
              <th class="px-4 py-3 text-left text-[9px] font-bold uppercase tracking-[0.14em] text-[var(--sub)]">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="payment in jobsStore.paymentHistory" :key="payment.id" class="border-b border-[var(--line)] last:border-0">
              <td class="px-5 py-3 font-bold text-[var(--ink)]">{{ payment.job_reference }}</td>
              <td class="px-4 py-3 text-xs text-[var(--sub)]">{{ payment.payment_reference || payment.reference }}</td>
              <td class="px-4 py-3 text-right font-semibold text-[var(--ink)]">{{ formatKSh(Number(payment.amount ?? 0), 0) }}</td>
              <td class="px-4 py-3 text-xs capitalize text-[var(--sub)]">{{ payment.channel || '—' }}</td>
              <td class="px-4 py-3">
                <span class="rounded-full bg-[var(--panel2)] px-2 py-0.5 text-[10px] font-bold capitalize text-[var(--sub)]">{{ payment.payment_status }}</span>
              </td>
              <td class="px-4 py-3 text-xs text-[var(--sub)]">{{ formatDate(payment.created_at) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="rounded-2xl border border-dashed border-[var(--line)] bg-[var(--panel)] px-5 py-8 text-center text-xs text-[var(--sub)]">
        No payments yet. Escrow is created when you accept a quote.
      </div>
    </section>

    <section id="upload" class="mt-10 scroll-mt-24">
      <div class="mb-4">
        <h2 class="font-disp text-base font-extrabold text-[var(--ink)]">Upload artwork</h2>
        <p class="mt-0.5 text-xs text-[var(--sub)]">Send print-ready files for jobs that are waiting on artwork.</p>
      </div>

      <div v-if="uploadError" class="mb-3 rounded-xl surface-danger px-4 py-3 text-xs text-[#B4243F]">{{ uploadError }}</div>

      <div v-if="artworkJobs.length" class="space-y-3">
        <div v-for="job in artworkJobs" :key="job.id" class="flex flex-wrap items-center gap-4 rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-4">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl tone-accent"><Upload :size="18" class="text-[var(--accent)]" /></div>
          <div class="min-w-0 flex-1">
            <div class="text-sm font-bold text-[var(--ink)]">{{ jobCode(job) }} · {{ job.title }}</div>
            <div class="mt-0.5 text-[11px] text-[var(--sub)]">{{ job.artwork_status_label || (job.artwork_missing ? 'Artwork needed' : 'Waiting for your file') }}</div>
          </div>
          <label class="press-key inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2 text-xs font-bold text-[var(--accentInk)] transition-colors hover:brightness-95">
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
      <div v-else class="rounded-2xl border border-dashed border-[var(--line)] bg-[var(--panel)] px-5 py-8 text-center text-xs text-[var(--sub)]">
        Nothing to upload right now. We'll flag a job here when artwork is needed.
      </div>
    </section>

    <section id="history" class="mt-10 scroll-mt-24">
      <div class="mb-4">
        <h2 class="font-disp text-base font-extrabold text-[var(--ink)]">History</h2>
        <p class="mt-0.5 text-xs text-[var(--sub)]">Completed and closed jobs, kept for your records.</p>
      </div>

      <div v-if="completedJobs.length" class="divide-y divide-[var(--line)] overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--panel)]">
        <div v-for="job in completedJobs" :key="job.id" class="flex flex-wrap items-center gap-3 px-5 py-4">
          <div class="flex h-9 w-9 items-center justify-center rounded-xl tone-success"><Check :size="16" class="text-[#0B7A52]" /></div>
          <div class="min-w-0 flex-1">
            <div class="text-sm font-bold text-[var(--ink)]">{{ jobCode(job) }} · {{ job.title }}</div>
            <div class="mt-0.5 text-[10px] text-[var(--sub)]">{{ jobStatusLabel(job) }} · {{ jobDue(job) || 'No due date' }}</div>
          </div>
          <div class="text-sm font-extrabold text-[var(--ink)]">{{ jobPrice(job) }}</div>
          <NuxtLink v-if="job.tracking_url" :to="job.tracking_url" class="rounded-xl border border-[var(--line)] px-3 py-2 text-[11px] font-bold text-[var(--ink)] hover:bg-[var(--panel2)]">
            View
          </NuxtLink>
        </div>
      </div>
      <div v-else class="rounded-2xl border border-dashed border-[var(--line)] bg-[var(--panel)] px-5 py-8 text-center text-xs text-[var(--sub)]">
        No completed jobs yet — your first delivery will be archived here.
      </div>
    </section>
  </div>
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
