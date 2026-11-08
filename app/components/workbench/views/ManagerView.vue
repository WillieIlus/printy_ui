<template>
  <DesignManagerSurface>
    <div class="flex flex-col gap-9">
      <DesignManagerPageHeader index="MG" kicker="Manager workspace" :title="greeting" :description="todayLine">
        <template #actions>
          <div class="relative w-full max-w-xs">
            <Search :size="15" class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
            <input
              v-model="search"
              type="search"
              placeholder="Search quotes, jobs or clients"
              class="h-10 w-full rounded-xl border border-line bg-card pl-9 pr-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-brand"
            >
          </div>
          <span v-if="m.saving" class="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.14em] text-ink-3 uppercase">
            <Loader2 :size="12" class="animate-spin text-brand" /> syncing…
          </span>
        </template>
      </DesignManagerPageHeader>

      <section v-if="initializing" class="flex items-center justify-center gap-2 rounded-2xl border border-line bg-card py-12 font-mono text-[10px] tracking-[0.18em] text-ink-3 uppercase">
        <Loader2 :size="14" class="animate-spin text-brand" /> Loading your workspace…
      </section>

      <template v-else>
        <section class="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <DesignCard class="p-5">
            <DesignStat label="Quotes to prepare" :value="quoteCountLabel" :tone="quoteCount ? 'amber' : 'ink'" hint="from your workload" />
          </DesignCard>
          <DesignCard class="p-5">
            <DesignStat label="Jobs in follow-up" :value="countLabel(m.jobs.length, 'job')" tone="brand" hint="production follow-up" />
          </DesignCard>
          <DesignCard class="p-5">
            <DesignStat label="Ready to dispatch" :value="countLabel(m.dispatchableJobs.length, 'job')" :tone="m.dispatchableJobs.length ? 'green' : 'ink'" hint="payment confirmed" />
          </DesignCard>
          <DesignCard class="p-5">
            <DesignStat label="Clients / shops" :value="`${m.clients.length} / ${m.productionShops.length}`" hint="your network" />
          </DesignCard>
        </section>

        <DesignManagerSection id="attention" index="01" title="What needs my attention" hint="paid jobs waiting for dispatch">
          <div v-if="attentionJobs.length" class="grid gap-4 md:grid-cols-3">
            <NuxtLink
              v-for="job in attentionJobs"
              :key="job.id"
              to="/app/manager/jobs"
              class="group flex flex-col rounded-2xl border border-line bg-card p-5 shadow-card transition-colors hover:border-brand/60"
            >
              <div class="flex items-center justify-between gap-2">
                <span class="font-mono text-[10px] font-semibold tracking-[0.14em] text-brand">{{ job.job_reference || job.reference }}</span>
                <span class="rounded-full px-2 py-[2px] font-mono text-[8.5px] tracking-[0.1em] uppercase" :style="attentionChip">{{ job.payment_status.replace(/_/g, ' ') }}</span>
              </div>
              <div class="mt-2 text-[15px] font-bold leading-snug tracking-tight">{{ attentionTitle(job) }}</div>
              <p class="mt-2.5 text-[12px] leading-relaxed text-ink-2">{{ attentionLine(job) }}</p>
              <div class="mt-auto flex items-center gap-1.5 pt-3 font-mono text-[9.5px] tracking-[0.16em] text-ink-3 uppercase transition-colors group-hover:text-brand">
                Open dispatch <ChevronRight :size="11" />
              </div>
            </NuxtLink>
          </div>

          <DesignCard v-else class="p-8 text-center">
            <p class="font-medium text-ink">Nothing is waiting on you right now.</p>
            <p class="mx-auto mt-1.5 max-w-[44ch] text-[12.5px] leading-relaxed text-ink-2">
              Once a client's payment confirms, the job appears here ready for dispatch to the production shop.
            </p>
          </DesignCard>
        </DesignManagerSection>

        <section class="grid gap-4 sm:grid-cols-2">
          <NuxtLink
            id="quotes"
            to="/app/manager/quotes"
            class="group flex scroll-mt-24 flex-col gap-4 rounded-2xl border border-line bg-card p-5 shadow-card transition-colors hover:border-brand/60"
          >
            <div class="flex items-center gap-3">
              <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mint text-brand-deep">
                <Handshake :size="18" />
              </span>
              <div class="min-w-0 flex-1">
                <div class="text-[16px] font-bold tracking-tight">Quote prep</div>
                <div class="text-[11.5px] leading-snug text-ink-2">Prepare a quote, add your margin, and send it to the client.</div>
              </div>
              <ChevronRight :size="17" class="shrink-0 text-brand transition-transform group-hover:translate-x-0.5" />
            </div>
            <div class="flex flex-wrap items-center gap-2 border-t border-line pt-3">
              <span class="rounded-full px-2.5 py-[3px] font-mono text-[10px] font-semibold tracking-[0.12em] uppercase" :style="chip(quoteCount, '#F5A623')">
                {{ quoteCountLabel }}
              </span>
              <span v-if="m.quotes.length" class="font-mono text-[9px] tracking-[0.12em] text-ink-3 uppercase">open workload</span>
            </div>
          </NuxtLink>

          <NuxtLink
            id="jobs"
            to="/app/manager/jobs"
            class="group flex scroll-mt-24 flex-col gap-4 rounded-2xl border border-line bg-card p-5 shadow-card transition-colors hover:border-brand/60"
          >
            <div class="flex items-center gap-3">
              <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mint text-brand-deep">
                <Rocket :size="18" />
              </span>
              <div class="min-w-0 flex-1">
                <div class="text-[16px] font-bold tracking-tight">Production follow-up</div>
                <div class="text-[11.5px] leading-snug text-ink-2">Send paid jobs to the shop, and keep track of the rest.</div>
              </div>
              <ChevronRight :size="17" class="shrink-0 text-brand transition-transform group-hover:translate-x-0.5" />
            </div>
            <div class="flex flex-wrap items-center gap-2 border-t border-line pt-3">
              <span class="rounded-full px-2.5 py-[3px] font-mono text-[10px] font-semibold tracking-[0.12em] uppercase" :style="m.dispatchableJobs.length ? chip(m.dispatchableJobs.length, '#2FBF71') : chip(m.jobs.length, 'var(--accent)')">
                {{ dispatchLabel }}
              </span>
              <span v-if="m.jobs.length" class="font-mono text-[9px] tracking-[0.12em] text-ink-3 uppercase">{{ m.jobs.length }} total</span>
            </div>
          </NuxtLink>

          <NuxtLink
            id="clients"
            to="/app/manager/clients"
            class="group flex scroll-mt-24 flex-col gap-4 rounded-2xl border border-line bg-card p-5 shadow-card transition-colors hover:border-brand/60"
          >
            <div class="flex items-center gap-3">
              <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mint text-brand-deep">
                <Users :size="18" />
              </span>
              <div class="min-w-0 flex-1">
                <div class="text-[16px] font-bold tracking-tight">Clients &amp; shops</div>
                <div class="text-[11.5px] leading-snug text-ink-2">Your clients, their quote history, and the shops you can use.</div>
              </div>
              <ChevronRight :size="17" class="shrink-0 text-brand transition-transform group-hover:translate-x-0.5" />
            </div>
            <div class="flex flex-wrap items-center gap-2 border-t border-line pt-3">
              <span class="rounded-full px-2.5 py-[3px] font-mono text-[10px] font-semibold tracking-[0.12em] uppercase" :style="chip(m.clients.length, 'var(--accent)')">
                {{ countLabel(m.clients.length, 'client') }}
              </span>
              <span v-if="m.productionShops.length" class="rounded-full px-2.5 py-[3px] font-mono text-[10px] font-semibold tracking-[0.12em] uppercase" :style="chip(m.productionShops.length, 'var(--accent)')">
                {{ countLabel(m.productionShops.length, 'shop') }}
              </span>
            </div>
          </NuxtLink>

          <NuxtLink
            id="rates"
            to="/app/manager/rates"
            class="group flex scroll-mt-24 flex-col gap-4 rounded-2xl border border-line bg-card p-5 shadow-card transition-colors hover:border-brand/60"
          >
            <div class="flex items-center gap-3">
              <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mint text-brand-deep">
                <Gauge :size="18" />
              </span>
              <div class="min-w-0 flex-1">
                <div class="text-[16px] font-bold tracking-tight">Pricing guidance</div>
                <div class="text-[11.5px] leading-snug text-ink-2">Set your default markup and see what the market is charging.</div>
              </div>
              <ChevronRight :size="17" class="shrink-0 text-brand transition-transform group-hover:translate-x-0.5" />
            </div>
            <div class="flex items-center gap-2 border-t border-line pt-3">
              <span class="rounded-full px-2.5 py-[3px] font-mono text-[10px] font-semibold tracking-[0.12em] uppercase" :style="chip(Math.round(m.defaultMarkupRate * 100), '#F5A623')">
                {{ Math.round(m.defaultMarkupRate * 100) }}% default markup
              </span>
              <span v-if="m.marketRates.length" class="font-mono text-[9px] tracking-[0.12em] text-ink-3 uppercase">{{ countLabel(m.marketRates.length, 'price row') }}</span>
            </div>
          </NuxtLink>
        </section>

        <div class="grid items-start gap-8 lg:grid-cols-2">
          <DesignManagerSection id="messages" index="06" title="Messages" hint="client threads">
            <DesignCard class="flex flex-wrap items-center justify-between gap-4 p-5">
              <div class="min-w-0">
                <p class="text-[14px] font-semibold tracking-tight">Client conversations</p>
                <p class="mt-1 text-[12.5px] leading-relaxed text-ink-2">Quote questions, artwork and dispatch notes stay in one thread.</p>
              </div>
              <NuxtLink to="/app/messages" class="inline-flex items-center gap-1.5 rounded-xl border border-line-strong bg-card px-3.5 py-2 font-mono text-[10px] font-semibold tracking-[0.1em] text-ink-2 uppercase transition-colors hover:border-brand hover:text-brand">
                Open messages <ChevronRight :size="12" />
              </NuxtLink>
            </DesignCard>
          </DesignManagerSection>

          <DesignManagerSection id="notifications" index="07" title="Notifications" hint="queue alerts">
            <DesignCard class="flex flex-wrap items-center justify-between gap-4 p-5">
              <div class="min-w-0">
                <p class="text-[14px] font-semibold tracking-tight">Queue notifications</p>
                <p class="mt-1 text-[12.5px] leading-relaxed text-ink-2">Payment confirmations, artwork claims and dispatch updates land here.</p>
              </div>
              <NuxtLink to="/notifications" class="inline-flex items-center gap-1.5 rounded-xl border border-line-strong bg-card px-3.5 py-2 font-mono text-[10px] font-semibold tracking-[0.1em] text-ink-2 uppercase transition-colors hover:border-brand hover:text-brand">
                Open notifications <ChevronRight :size="12" />
              </NuxtLink>
            </DesignCard>
          </DesignManagerSection>
        </div>
      </template>
    </div>
  </DesignManagerSurface>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ChevronRight, Gauge, Handshake, Loader2, Rocket, Search, Users } from 'lucide-vue-next'
import DesignManagerSurface from '~/components/design/manager/ManagerSurface.vue'
import DesignManagerSection from '~/components/design/manager/ManagerSection.vue'
import DesignManagerPageHeader from '~/components/design/manager/ManagerPageHeader.vue'
import DesignCard from '~/components/design/ui/Card.vue'
import DesignStat from '~/components/design/ui/Stat.vue'
import type { ManagerJobRow } from '~/shared/types'
import { useAuthStore } from '~/stores/auth'
import { useManagerStore } from '~/stores/manager'

const auth = useAuthStore()
const m = useManagerStore()

const search = useState<string>('partner-search', () => '')
const greetingPart = ref('Welcome back')
const greeting = computed(() => {
  const first = auth.user?.name?.trim().split(/\s+/)[0] || ''
  return first ? `${greetingPart.value}, ${first}` : greetingPart.value
})

const quoteCount = computed(() => m.quotes.filter((quote) => !['sent', 'accepted', 'completed', 'closed'].includes(String(quote.status || '').toLowerCase())).length)
const quoteCountLabel = computed(() => countLabel(quoteCount.value, 'request'))
const attentionJobs = computed(() => m.dispatchableJobs.slice(0, 3))
const initializing = ref(!m.jobs.length && !m.quotes.length)
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
