<template>
  <div class="mx-auto w-full max-w-[1180px] px-4 pb-24 pt-6 sm:px-6">
    <div class="flex flex-wrap items-center gap-x-5 gap-y-2">      <h1 class="font-disp text-[26px] font-bold tracking-tight">Control room</h1>      <span class="font-mono2 text-[10px] uppercase tracking-[0.18em] text-[var(--sub)]">{{ m.jobs.length }} jobs in follow-up</span>      <div class="ml-auto flex flex-wrap items-center gap-2">        <div v-if="m.saving" class="flex items-center gap-2 font-mono2 text-[10px] uppercase tracking-[0.14em] text-[var(--sub)]">          <Loader2 :size="12" class="animate-spin" style="color: var(--accent)" /> syncing…        </div>      </div>    </div>
    <!-- 4-card stats row -->    <section class="mb-4">      <div class="grid grid-cols-2 gap-3 md:grid-cols-4">        <!-- Quotes Awaiting Action -->        <div class="rounded-xl border p-4" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">          <div class="flex items-center gap-2">            <Handshake :size="16" style="color: var(--accent)" />            <div>              <div class="font-mono2 text-[10px] uppercase tracking-[0.14em] text-[var(--sub)]">Quotes awaiting action</div>              <div class="font-disp text-[20px] font-bold tracking-tight" :style="{ color: m.quotes.length > 0 ? 'var(--accent)' : 'var(--sub)' }">{{ m.quotes.length }}</div>            </div>          </div>        </div>
        <!-- Jobs In Progress -->        <div class="rounded-xl border p-4" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">          <div class="flex items-center gap-2">            <Rocket :size="16" style="color: var(--accent)" />            <div>              <div class="font-mono2 text-[10px] uppercase tracking-[0.14em] text-[var(--sub)]">Jobs in progress</div>              <div class="font-disp text-[20px] font-bold tracking-tight" :style="{ color: m.dispatchableJobs.length > 0 ? 'var(--accent)' : 'var(--sub)' }">{{ m.dispatchableJobs.length }}</div>            </div>          </div>        </div>
        <!-- Clients With Open Quotes -->        <div class="rounded-xl border p-4" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">          <div class="flex items-center gap-2">            <Users :size="16" style="color: var(--accent)" />            <div>              <div class="font-mono2 text-[10px] uppercase tracking-[0.14em] text-[var(--sub)]">Clients with open quotes</div>              <div class="font-disp text-[20px] font-bold tracking-tight" :style="{ color: m.clients.length > 0 ? 'var(--accent)' : 'var(--sub)' }">{{ m.clients.length }}</div>            </div>          </div>        </div>
        <!-- Active Assignments -->        <div class="rounded-xl border p-4" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">          <div class="flex items-center gap-2">            <Briefcase :size="16" style="color: var(--accent)" />            <div>              <div class="font-mono2 text-[10px] uppercase tracking-[0.14em] text-[var(--sub)]">Active assignments</div>              <div class="font-disp text-[20px] font-bold tracking-tight" :style="{ color: m.jobs.length > 0 ? 'var(--accent)' : 'var(--sub)' }">{{ m.jobs.length }}</div>            </div>          </div>        </div>      </div>    </section>

    <section v-if="m.loading && m.jobs.length === 0 && m.quotes.length === 0" class="mt-8 flex items-center justify-center gap-2 rounded-2xl border py-10 font-mono2 text-[10px] uppercase tracking-[0.18em] text-[var(--sub)]" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">      <Loader2 :size="14" class="animate-spin" style="color: var(--accent)" /> Loading your workspace…    </section>

    <section v-else class="mt-8">      <div class="flex items-center gap-2">        <Flame :size="13" :style="{ color: '#FF6B4A' }" />        <ML class="!text-[11px]">What needs my attention</ML>      </div>

      <div v-if="attentionJobs.length" class="mt-3 grid gap-3 md:grid-cols-3">        <NuxtLink
          v-for="job in attentionJobs"
          :key="job.id"
          to="/app/manager/jobs"
          class="group overflow-hidden rounded-2xl border p-4 text-left transition-transform hover:-translate-y-0.5"          :style="{ borderColor: `${ATTENTION_TONE}55`, background: 'var(--panel)' }"        >          <div class="flex items-center justify-between gap-2">            <span class="font-mono2 text-[10px] font-semibold tracking-[0.14em] text-[var(--accent)]">{{ job.job_reference || job.reference }}</span>            <span class="rounded-full px-2 py-[2px] font-mono2 text-[8.5px] uppercase tracking-[0.1em]" :style="attentionChip">{{ job.payment_status.replace(/_/g, ' ') }}</span>          </div>          <div class="mt-2 font-disp text-[15px] font-bold leading-snug tracking-tight">{{ job.title }}</div>          <div class="mt-2.5 space-y-1.5">            <div class="flex items-center gap-2 text-[12px] text-[var(--sub)]">              <span class="truncate"><span class="font-semibold text-[var(--ink)]">{{ job.client_name }}</span> — payment confirmed, artwork ready</span>            </div>          </div>          <div class="mt-3 flex items-center gap-1.5 font-mono2 text-[9.5px] uppercase tracking-[0.16em] text-[var(--sub)] transition-colors group-hover:text-[var(--accent)]">            Open dispatch <ChevronRight :size="11" />          </div>        </NuxtLink>      </div>

      <div v-else class="mt-3 rounded-2xl border p-6 text-center" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">        <ML>Nothing is waiting on you right now.</ML>        <p class="mx-auto mt-1.5 max-w-[44ch] text-[12.5px] leading-relaxed text-[var(--sub)]">          Once a client's payment confirms, the job appears here ready for dispatch to the production shop.        </p>      </div>    </section>  </div></template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { ChevronRight, Flame, Gauge, Handshake, Loader2, Rocket, Users } from 'lucide-vue-next'
import { useManagerStore } from '~/stores/manager'

const m = useManagerStore()

const quoteCount = computed(() => m.quotes.length)
const attentionJobs = computed(() => m.dispatchableJobs.slice(0, 3))
const ATTENTION_TONE = '#0E7A45'
const attentionChip = { background: 'rgba(14,122,69,.12)', color: '#0E7A45' }

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