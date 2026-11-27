<script setup lang="ts">
/**
 * Manager quotes list.
 *
 * Selecting a row opens the canonical quote detail. No quote breakdown,
 * production options or action panels are rendered here.
 */
import { computed, onMounted, ref } from 'vue'
import { ArrowLeft, BadgeCheck, RefreshCw, UserPlus } from 'lucide-vue-next'
import DesignManagerSurface from '~/components/design/manager/ManagerSurface.vue'
import DesignManagerPageHeader from '~/components/design/manager/ManagerPageHeader.vue'
import DesignManagerSection from '~/components/design/manager/ManagerSection.vue'
import DesignAlert from '~/components/design/ui/Alert.vue'
import DesignLoading from '~/components/design/ui/Loading.vue'
import DesignEmptyNote from '~/components/design/ui/EmptyNote.vue'
import ManagerAddClientPanel from '~/components/workbench/views/ManagerAddClientPanel.vue'
import { useManagerStore } from '~/stores/manager'
import { needsAttention, sectionsFromServer } from '~/shared/list-sections'
import type { ManagerClientRequestResult, ManagerQuoteRow } from '~/shared/types'

const m = useManagerStore()
const router = useRouter()

const showAddClient = ref(false)
const clientCreatedNote = ref('')

const quoteSections = computed(() => sectionsFromServer(m.quotes))

function statusStyle(raw: string) {
  const value = (raw || '').toLowerCase()
  if (value.includes('sent')) return { background: 'rgba(14,122,69,.12)', color: '#0E7A45' }
  if (value.includes('reject') || value.includes('declin')) return { background: 'rgba(200,30,68,.12)', color: '#C81E44' }
  if (value.includes('accept') || value.includes('complete') || value.includes('paid')) return { background: 'rgba(14,122,69,.14)', color: '#0E7A45' }
  return { background: 'var(--panel2)', color: 'var(--sub)' }
}

function openQuote(row: ManagerQuoteRow) {
  void router.push(`/app/manager/quotes/${row.id}`)
}

async function onClientCreated(result: ManagerClientRequestResult) {
  showAddClient.value = false
  clientCreatedNote.value = `Request ${result.request_reference || result.code || result.quote_request_id} started for ${result.client_name || 'your client'}.`
  await m.fetchQuotes()
  await router.push({ path: `/app/manager/quotes/${result.quote_request_id}`, query: { created: result.request_reference || result.code || String(result.quote_request_id) } })
}

onMounted(() => {
  void m.fetchQuotes()
})
</script>

<template>
  <DesignManagerSurface>
    <div class="flex flex-col gap-8 pb-32">
      <div class="flex flex-col gap-3">
        <NuxtLink
          to="/app/manager"
          class="inline-flex w-fit items-center gap-1.5 font-mono text-[10px] tracking-[0.16em] text-ink-3 uppercase transition-colors hover:text-brand"
        >
          <ArrowLeft :size="12" /> Back to dashboard
        </NuxtLink>
        <DesignManagerPageHeader
          index="MQ"
          kicker="Manager desk"
          title="Quotes"
          subtitle="Every quote request in one list."
          description="Open a quote to price it, review artwork, add production options or send it to the client."
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
        </DesignAlert>
      </div>

      <DesignLoading v-if="m.loading && !m.hasQuotes" label="Loading your quote workload…" />

      <DesignAlert v-else-if="m.error && !m.hasQuotes" tone="error">
        <p class="max-w-[52ch] leading-relaxed">{{ m.error }}</p>
        <template #actions>
          <button class="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 font-mono text-[10px] font-semibold tracking-[0.14em] text-white uppercase" @click="m.fetchQuotes()">
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

      <aside v-else class="w-full max-w-[760px]">
        <DesignManagerSection index="01" title="Quote workload" :hint="String(m.quotes.length)">
          <div class="space-y-5">
            <div v-for="section in quoteSections" :key="section.key" class="space-y-2">
              <div class="flex items-center gap-2 pl-1">
                <h3 class="font-mono text-[10px] font-semibold tracking-[0.18em] uppercase" :style="{ color: section.muted ? 'var(--sub)' : 'var(--ink)' }">{{ section.label }}</h3>
                <span class="rounded-full bg-paper-2 px-2 py-[1px] font-mono text-[9px] font-semibold text-ink-2">{{ section.items.length }}</span>
              </div>
              <button
                v-for="row in section.items"
                :key="row.id"
                class="w-full rounded-2xl border p-4 text-left transition-colors hover:border-brand/60"
                :class="[section.muted ? 'opacity-60' : '', needsAttention(row) ? 'ring-2' : '']"
                :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }"
                :data-test="`manager-quote-row-${row.id}`"
                @click="openQuote(row)"
              >
                <div class="flex items-center justify-between gap-2">
                  <span class="font-mono text-[10px] tracking-[0.12em] text-brand" :class="{ 'font-bold': needsAttention(row) }">{{ row.quote_request_reference || row.reference }}</span>
                  <span class="rounded-full px-2 py-[1px] font-mono text-[9px] tracking-[0.1em] uppercase" :style="statusStyle(row.raw_status)">{{ row.status_label || row.raw_status }}</span>
                </div>
                <div class="mt-1.5 truncate text-[14px] font-bold tracking-tight">{{ row.product || 'Print job' }}</div>
                <div class="mt-1 truncate text-[11.5px] text-ink-2">{{ row.customer_name || 'Client' }}<span v-if="row.shop_name"> · {{ row.shop_name }}</span></div>
                <div class="mt-2 flex flex-wrap items-center gap-2">
                  <span v-if="row.fee_waived" data-test="quote-row-fee-waived" class="inline-flex items-center gap-1 rounded-full bg-mint px-2 py-[1px] font-mono text-[8.5px] tracking-[0.1em] text-brand-deep uppercase">
                    <BadgeCheck :size="9" /> 0% Printy fee: your own client
                  </span>
                  <span class="ml-auto font-mono text-[9px] font-semibold tracking-[0.1em] text-brand uppercase">Open quote</span>
                </div>
              </button>
            </div>
          </div>
        </DesignManagerSection>
      </aside>
    </div>
  </DesignManagerSurface>
</template>
