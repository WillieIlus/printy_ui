<template>
  <div class="mx-auto w-full max-w-[1180px] px-4 pb-24 pt-6 sm:px-6">
    <div class="flex flex-wrap items-center gap-x-5 gap-y-2">
      <h1 class="font-disp text-[26px] font-bold tracking-tight">Control room</h1>
      <span class="font-mono2 text-[10px] uppercase tracking-[0.18em] text-[var(--sub)]">{{ m.jobs.length }} jobs in follow-up</span>
      <div v-if="m.saving" class="ml-auto flex items-center gap-2 font-mono2 text-[10px] uppercase tracking-[0.14em] text-[var(--sub)]">
        <Loader2 :size="12" class="animate-spin" style="color: var(--accent)" /> syncing…
      </div>
    </div>

    <section class="mt-5 grid gap-3 md:grid-cols-3">
      <NuxtLink
        to="/app/manager/rates"
        class="press-key group rounded-[1.6rem] border-2 border-dashed p-4 transition-colors hover:border-[var(--accent)]"
        :style="{ borderColor: 'var(--accent)', background: 'var(--panel)' }"
      >
        <div class="flex items-center gap-3">
          <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl" :style="{ background: 'var(--accent)' }">
            <Gauge :size="18" style="color: var(--accentInk)" />
          </span>
          <div class="min-w-0 flex-1">
            <div class="font-disp text-[16px] font-bold tracking-tight">Pricing guidance</div>
            <div class="text-[11.5px] leading-snug text-[var(--sub)]">Market-wide price rows and your default client markup.</div>
          </div>
          <ChevronRight :size="17" style="color: var(--accent)" class="shrink-0 transition-transform group-hover:translate-x-0.5" />
        </div>
        <div class="mt-3 flex items-center gap-2 border-t pt-3" :style="{ borderColor: 'var(--line)' }">
          <span class="rounded-full px-2.5 py-[3px] font-mono2 text-[10px] font-semibold uppercase tracking-[0.12em]" :style="chip(Math.round(m.defaultMarkupRate * 100), '#F5A623')">
            {{ Math.round(m.defaultMarkupRate * 100) }}% default markup
          </span>
          <span v-if="m.marketRates.length" class="font-mono2 text-[9px] uppercase tracking-[0.12em] text-[var(--sub)]">{{ m.marketRates.length }} price rows</span>
        </div>
      </NuxtLink>

      <NuxtLink
        to="/app/manager/quotes"
        class="press-key group rounded-[1.6rem] border-2 border-dashed p-4 transition-colors hover:border-[var(--accent)]"
        :style="{ borderColor: 'var(--accent)', background: 'var(--panel)' }"
      >
        <div class="flex items-center gap-3">
          <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl" :style="{ background: 'var(--accent)' }">
            <Handshake :size="18" style="color: var(--accentInk)" />
          </span>
          <div class="min-w-0 flex-1">
            <div class="font-disp text-[16px] font-bold tracking-tight">Quote prep</div>
            <div class="text-[11.5px] leading-snug text-[var(--sub)]">Pull production options, apply your margin, send to the client.</div>
          </div>
          <ChevronRight :size="17" style="color: var(--accent)" class="shrink-0 transition-transform group-hover:translate-x-0.5" />
        </div>
        <div class="mt-3 flex items-center gap-2 border-t pt-3" :style="{ borderColor: 'var(--line)' }">
          <span class="rounded-full px-2.5 py-[3px] font-mono2 text-[10px] font-semibold uppercase tracking-[0.12em]" :style="chip(quoteCount, '#F5A623')">
            {{ quoteCount }} {{ quoteCount === 1 ? 'request' : 'requests' }}
          </span>
          <span v-if="m.quotes.length" class="font-mono2 text-[9px] uppercase tracking-[0.12em] text-[var(--sub)]">open workload</span>
        </div>
      </NuxtLink>

      <NuxtLink
        to="/app/manager/jobs"
        class="press-key group rounded-[1.6rem] border-2 border-dashed p-4 transition-colors hover:border-[var(--accent)]"
        :style="{ borderColor: 'var(--accent)', background: 'var(--panel)' }"
      >
        <div class="flex items-center gap-3">
          <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl" :style="{ background: 'var(--accent)' }">
            <Rocket :size="18" style="color: var(--accentInk)" />
          </span>
          <div class="min-w-0 flex-1">
            <div class="font-disp text-[16px] font-bold tracking-tight">Production follow-up</div>
            <div class="text-[11.5px] leading-snug text-[var(--sub)]">Real paid jobs — dispatch to the shop once payment confirms.</div>
          </div>
          <ChevronRight :size="17" style="color: var(--accent)" class="shrink-0 transition-transform group-hover:translate-x-0.5" />
        </div>
        <div class="mt-3 flex flex-wrap items-center gap-2 border-t pt-3" :style="{ borderColor: 'var(--line)' }">
          <span class="rounded-full px-2.5 py-[3px] font-mono2 text-[10px] font-semibold uppercase tracking-[0.12em]" :style="m.dispatchableJobs.length ? chip(m.dispatchableJobs.length, '#2FBF71') : chip(m.jobs.length, 'var(--accent)')">
            {{ m.dispatchableJobs.length || m.jobs.length }} {{ m.dispatchableJobs.length === 1 ? 'job ready to dispatch' : m.dispatchableJobs.length ? 'jobs ready to dispatch' : 'jobs in progress' }}
          </span>
          <span v-if="m.jobs.length" class="font-mono2 text-[9px] uppercase tracking-[0.12em] text-[var(--sub)]">{{ m.jobs.length }} total</span>
        </div>
      </NuxtLink>

      <NuxtLink
        to="/app/manager/clients"
        class="press-key group rounded-[1.6rem] border-2 border-dashed p-4 transition-colors hover:border-[var(--accent)]"
        :style="{ borderColor: 'var(--accent)', background: 'var(--panel)' }"
      >
        <div class="flex items-center gap-3">
          <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl" :style="{ background: 'var(--accent)' }">
            <Users :size="18" style="color: var(--accentInk)" />
          </span>
          <div class="min-w-0 flex-1">
            <div class="font-disp text-[16px] font-bold tracking-tight">Clients & shops</div>
            <div class="text-[11.5px] leading-snug text-[var(--sub)]">Your quote history as contacts, plus eligible production shops.</div>
          </div>
          <ChevronRight :size="17" style="color: var(--accent)" class="shrink-0 transition-transform group-hover:translate-x-0.5" />
        </div>
        <div class="mt-3 flex flex-wrap items-center gap-2 border-t pt-3" :style="{ borderColor: 'var(--line)' }">
          <span class="rounded-full px-2.5 py-[3px] font-mono2 text-[10px] font-semibold uppercase tracking-[0.12em]" :style="chip(m.clients.length, 'var(--accent)')">
            {{ m.clients.length }} {{ m.clients.length === 1 ? 'client' : 'clients' }}
          </span>
          <span v-if="m.productionShops.length" class="rounded-full px-2.5 py-[3px] font-mono2 text-[10px] font-semibold uppercase tracking-[0.12em]" :style="chip(m.productionShops.length, 'var(--accent)')">
            {{ m.productionShops.length }} {{ m.productionShops.length === 1 ? 'shop' : 'shops' }}
          </span>
        </div>
      </NuxtLink>
    </section>

    <section v-if="m.loading && m.jobs.length === 0 && m.quotes.length === 0" class="mt-8 flex items-center justify-center gap-2 rounded-2xl border py-10 font-mono2 text-[10px] uppercase tracking-[0.18em] text-[var(--sub)]" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
      <Loader2 :size="14" class="animate-spin" style="color: var(--accent)" /> Loading your workspace…
    </section>

    <section v-else class="mt-8">
      <div class="flex items-center gap-2">
        <Flame :size="13" :style="{ color: '#FF6B4A' }" />
        <ML class="!text-[11px]">What needs my attention</ML>
      </div>

      <div v-if="attentionJobs.length" class="mt-3 grid gap-3 md:grid-cols-3">
        <NuxtLink
          v-for="job in attentionJobs"
          :key="job.id"
          to="/app/manager/jobs"
          class="group overflow-hidden rounded-2xl border p-4 text-left transition-transform hover:-translate-y-0.5"
          :style="{ borderColor: `${ATTENTION_TONE}55`, background: 'var(--panel)' }"
        >
          <div class="flex items-center justify-between gap-2">
            <span class="font-mono2 text-[10px] font-semibold tracking-[0.14em] text-[var(--accent)]">{{ job.job_reference || job.reference }}</span>
            <span class="rounded-full px-2 py-[2px] font-mono2 text-[8.5px] uppercase tracking-[0.1em]" :style="attentionChip">{{ job.payment_status.replace(/_/g, ' ') }}</span>
          </div>
          <div class="mt-2 font-disp text-[15px] font-bold leading-snug tracking-tight">{{ job.title }}</div>
          <div class="mt-2.5 space-y-1.5">
            <div class="flex items-center gap-2 text-[12px] text-[var(--sub)]">
              <span class="truncate"><span class="font-semibold text-[var(--ink)]">{{ job.client_name }}</span> — payment confirmed, artwork ready</span>
            </div>
          </div>
          <div class="mt-3 flex items-center gap-1.5 font-mono2 text-[9.5px] uppercase tracking-[0.16em] text-[var(--sub)] transition-colors group-hover:text-[var(--accent)]">
            Open dispatch <ChevronRight :size="11" />
          </div>
        </NuxtLink>
      </div>

      <div v-else class="mt-3 rounded-2xl border p-6 text-center" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
        <ML>Nothing is waiting on you right now.</ML>
        <p class="mx-auto mt-1.5 max-w-[44ch] text-[12.5px] leading-relaxed text-[var(--sub)]">
          Once a client's payment confirms, the job appears here ready for dispatch to the production shop.
        </p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { ChevronRight, Flame, Gauge, Handshake, Loader2, Rocket, Users } from 'lucide-vue-next'
import { useManagerStore } from '~/stores/manager'

const m = useManagerStore()

const quoteCount = computed(() => m.quotes.filter((quote) => !['sent', 'accepted', 'completed', 'closed'].includes(String(quote.status || '').toLowerCase())).length)
const attentionJobs = computed(() => m.dispatchableJobs.slice(0, 3))
const ATTENTION_TONE = '#2FBF71'
const attentionChip = { background: 'rgba(47,191,113,.14)', color: '#2FBF71' }

function chip(count: number, color: string) {
  return {
    background: count ? `${color}22` : 'var(--panel2)',
    color: count ? color : 'var(--sub)',
    boxShadow: count ? `inset 0 0 0 1px ${color}40` : 'none',
  }
}

onMounted(async () => {
  await Promise.all([m.fetchQuotes(), m.fetchJobs(), m.fetchClients(), m.fetchProductionShops(), m.fetchMarketRates()])
})
</script>