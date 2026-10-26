<template>
  <div class="mx-auto w-full max-w-[1180px] pb-8">
    <div class="flex flex-wrap items-start justify-between gap-x-5 gap-y-2">
      <div>
        <div class="flex items-center gap-2 font-mono2 text-[10px] uppercase tracking-[0.18em] text-[var(--sub)]">
          <LayoutDashboard :size="12" style="color: var(--accent)" /> Dashboard
        </div>
        <h1 class="mt-1 font-disp text-[26px] font-bold tracking-tight">{{ greeting }}</h1>
        <p class="mt-1 max-w-[64ch] text-[13px] leading-relaxed text-[var(--sub)]">{{ todayLine }}</p>
      </div>
      <div v-if="m.saving" class="flex items-center gap-2 font-mono2 text-[10px] uppercase tracking-[0.14em] text-[var(--sub)]">
        <Loader2 :size="12" class="animate-spin" style="color: var(--accent)" /> syncing…
      </div>
    </div>

    <section v-if="initializing" class="mt-8 flex items-center justify-center gap-2 rounded-2xl border py-10 font-mono2 text-[10px] uppercase tracking-[0.18em] text-[var(--sub)]" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
      <Loader2 :size="14" class="animate-spin" style="color: var(--accent)" /> Loading your workspace…
    </section>

    <template v-else>
      <section class="mt-6">
        <div class="flex items-center gap-2">
          <Flag :size="13" style="color: var(--accent)" />
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
            <div class="mt-2 font-disp text-[15px] font-bold leading-snug tracking-tight">{{ attentionTitle(job) }}</div>
            <p class="mt-2.5 text-[12px] leading-relaxed text-[var(--sub)]">{{ attentionLine(job) }}</p>
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

      <section class="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
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
              <div class="text-[11.5px] leading-snug text-[var(--sub)]">Set your default markup and see what the market is charging.</div>
            </div>
            <ChevronRight :size="17" style="color: var(--accent)" class="shrink-0 transition-transform group-hover:translate-x-0.5" />
          </div>
          <div class="mt-3 flex items-center gap-2 border-t pt-3" :style="{ borderColor: 'var(--line)' }">
            <span class="rounded-full px-2.5 py-[3px] font-mono2 text-[10px] font-semibold uppercase tracking-[0.12em]" :style="chip(Math.round(m.defaultMarkupRate * 100), '#F5A623')">
              {{ Math.round(m.defaultMarkupRate * 100) }}% default markup
            </span>
            <span v-if="m.marketRates.length" class="font-mono2 text-[9px] uppercase tracking-[0.12em] text-[var(--sub)]">{{ countLabel(m.marketRates.length, 'price row') }}</span>
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
              <div class="text-[11.5px] leading-snug text-[var(--sub)]">Prepare a quote, add your margin, and send it to the client.</div>
            </div>
            <ChevronRight :size="17" style="color: var(--accent)" class="shrink-0 transition-transform group-hover:translate-x-0.5" />
          </div>
          <div class="mt-3 flex items-center gap-2 border-t pt-3" :style="{ borderColor: 'var(--line)' }">
            <span class="rounded-full px-2.5 py-[3px] font-mono2 text-[10px] font-semibold uppercase tracking-[0.12em]" :style="chip(quoteCount, '#F5A623')">
              {{ quoteCountLabel }}
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
              <div class="text-[11.5px] leading-snug text-[var(--sub)]">Send paid jobs to the shop, and keep track of the rest.</div>
            </div>
            <ChevronRight :size="17" style="color: var(--accent)" class="shrink-0 transition-transform group-hover:translate-x-0.5" />
          </div>
          <div class="mt-3 flex flex-wrap items-center gap-2 border-t pt-3" :style="{ borderColor: 'var(--line)' }">
            <span class="rounded-full px-2.5 py-[3px] font-mono2 text-[10px] font-semibold uppercase tracking-[0.12em]" :style="m.dispatchableJobs.length ? chip(m.dispatchableJobs.length, '#2FBF71') : chip(m.jobs.length, 'var(--accent)')">
              {{ dispatchLabel }}
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
              <div class="font-disp text-[16px] font-bold tracking-tight">Clients &amp; shops</div>
              <div class="text-[11.5px] leading-snug text-[var(--sub)]">Your clients, their quote history, and the shops you can use.</div>
            </div>
            <ChevronRight :size="17" style="color: var(--accent)" class="shrink-0 transition-transform group-hover:translate-x-0.5" />
          </div>
          <div class="mt-3 flex flex-wrap items-center gap-2 border-t pt-3" :style="{ borderColor: 'var(--line)' }">
            <span class="rounded-full px-2.5 py-[3px] font-mono2 text-[10px] font-semibold uppercase tracking-[0.12em]" :style="chip(m.clients.length, 'var(--accent)')">
              {{ countLabel(m.clients.length, 'client') }}
            </span>
            <span v-if="m.productionShops.length" class="rounded-full px-2.5 py-[3px] font-mono2 text-[10px] font-semibold uppercase tracking-[0.12em]" :style="chip(m.productionShops.length, 'var(--accent)')">
              {{ countLabel(m.productionShops.length, 'shop') }}
            </span>
          </div>
        </NuxtLink>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ChevronRight, Flag, Gauge, Handshake, LayoutDashboard, Loader2, Rocket, Users } from 'lucide-vue-next'
import type { ManagerJobRow } from '~/shared/types'
import { useAuthStore } from '~/stores/auth'
import { useManagerStore } from '~/stores/manager'

const auth = useAuthStore()
const m = useManagerStore()

const greetingPart = ref('Welcome back')
const greeting = computed(() => {
  const first = auth.user?.name?.trim().split(/\s+/)[0] || ''
  return first ? `${greetingPart.value}, ${first}` : greetingPart.value
})

const quoteCount = computed(() => m.quotes.filter((quote) => !['sent', 'accepted', 'completed', 'closed'].includes(String(quote.status || '').toLowerCase())).length)
const quoteCountLabel = computed(() => countLabel(quoteCount.value, 'request'))
const attentionJobs = computed(() => m.dispatchableJobs.slice(0, 3))
const initializing = ref(!m.jobs.length && !m.quotes.length)
const ATTENTION_TONE = '#2FBF71'
const attentionChip = { background: 'rgba(47,191,113,.14)', color: '#2FBF71' }

const todayLine = computed(() => {
  const parts: string[] = []
  if (m.jobs.length) parts.push(`${countLabel(m.jobs.length, 'job')} in follow-up`)
  if (m.dispatchableJobs.length) parts.push(`${countLabel(m.dispatchableJobs.length, 'job')} ready to dispatch`)
  if (quoteCount.value) parts.push(`${countLabel(quoteCount.value, 'quote')} to prepare`)
  return parts.length ? `${parts.join(' · ')}.` : 'Nothing needs your attention right now. Your queue is clear.'
})

const dispatchLabel = computed(() => {
  const dispatchable = m.dispatchableJobs.length
  if (dispatchable) return `${countLabel(dispatchable, 'job')} ready to dispatch`
  return `${countLabel(m.jobs.length, 'job')} in progress`
})

const CLIENT_FACING_QUOTE_NOTE = /prepared an exact quote|your print manager/i

function countLabel(count: number, singular: string) {
  return `${count} ${count === 1 ? singular : `${singular}s`}`
}

function attentionTitle(job: ManagerJobRow) {
  const title = String(job.title || '').trim()
  if (!title || CLIENT_FACING_QUOTE_NOTE.test(title)) return 'Ready to dispatch'
  return title
}

function attentionLine(job: ManagerJobRow) {
  const client = String(job.client_name || '').trim()
  const owner = client ? `${client}'s` : "This client's"
  const payment = job.payment_confirmed ? 'payment is confirmed' : 'payment is not confirmed yet'
  const artwork = job.artwork_uploaded
    ? 'the artwork is ready'
    : job.artwork_missing
      ? 'the artwork is still missing'
      : 'the artwork is still in progress'
  const next = job.can_dispatch ? 'You can send this to the shop.' : 'Check the remaining details before you dispatch.'
  return `${owner} ${payment} and ${artwork}. ${next}`
}

function chip(count: number, color: string) {
  if (!count) {
    return { background: 'var(--panel2)', color: 'var(--sub)', boxShadow: 'none' }
  }
  const isVar = color.startsWith('var(')
  return {
    background: isVar ? `color-mix(in srgb, ${color} 14%, transparent)` : `${color}22`,
    color,
    boxShadow: isVar
      ? `inset 0 0 0 1px color-mix(in srgb, ${color} 30%, transparent)`
      : `inset 0 0 0 1px ${color}40`,
  }
}

onMounted(async () => {
  const hour = new Date().getHours()
  greetingPart.value = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  try {
    await Promise.all([m.fetchQuotes(), m.fetchJobs(), m.fetchClients(), m.fetchProductionShops(), m.fetchMarketRates()])
  } finally {
    initializing.value = false
  }
})
</script>
