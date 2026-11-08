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
          index="MR"
          kicker="Pricing guidance"
          title="Production price guidance."
          description="Backend default print rates are shown until enough production shops provide live pricing samples. This guides the client-facing prices you set."
        />
      </div>

      <DesignAlert v-if="pageError" tone="error">
        {{ pageError }}
      </DesignAlert>
      <DesignAlert v-if="saveMessage" tone="success">
        {{ saveMessage }}
      </DesignAlert>

      <section class="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <DesignCard class="p-5">
          <DesignStat label="Rows loaded" :value="String(activeRows.length)" hint="From Django rate defaults" />
        </DesignCard>
        <DesignCard class="p-5">
          <DesignStat label="Live samples" :value="String(highConfidenceCount)" tone="brand" hint="High confidence rows" />
        </DesignCard>
        <DesignCard class="p-5">
          <DesignStat label="Backend defaults" :value="String(estimatedCount)" hint="Used when market data is thin" />
        </DesignCard>
        <DesignCard class="p-5">
          <div class="font-mono text-[10px] font-semibold tracking-[0.14em] text-ink-3 uppercase">Updated</div>
          <div class="mt-2 text-[13px] font-semibold text-ink">{{ lastUpdatedLabel }}</div>
          <div class="mt-1 text-[11.5px] text-ink-2">{{ firstUpdatedText }}</div>
        </DesignCard>
      </section>

      <section class="grid items-start gap-6 lg:grid-cols-[1fr_320px]">
        <DesignCard class="overflow-hidden">
          <div class="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
            <div>
              <h2 class="text-[15px] font-bold tracking-tight text-ink">Backend price rows</h2>
              <p class="mt-1 text-[12px] text-ink-2">Simplex and duplex totals are calculated from backend defaults and active shop samples.</p>
            </div>
            <button
              class="inline-flex items-center gap-1.5 rounded-xl border border-brand px-3.5 py-2 font-mono text-[9.5px] font-bold tracking-[0.12em] text-brand uppercase transition-colors hover:bg-mint disabled:opacity-50"
              :disabled="loading"
              @click="loadMarketRates"
            >
              <Loader2 v-if="loading" :size="11" class="animate-spin" />
              <RefreshCw v-else :size="11" /> Refresh
            </button>
          </div>

          <DesignLoading v-if="loading" variant="skeleton" :rows="6" label="Loading backend price rows…" class="p-5" />
          <div v-else-if="marketRows.length" class="overflow-x-auto">
            <table class="w-full min-w-[880px] text-left text-[12.5px]">
              <thead class="border-b border-line bg-paper-2 font-mono text-[9px] font-semibold tracking-[0.14em] text-ink-3 uppercase">
                <tr>
                  <th class="px-5 py-3">Paper</th>
                  <th class="px-5 py-3">Product</th>
                  <th class="px-5 py-3">Simplex production</th>
                  <th class="px-5 py-3">Duplex production</th>
                  <th class="px-5 py-3">Client guide</th>
                  <th class="px-5 py-3">Source</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-line">
                <tr v-for="row in marketRows" :key="row.key" class="transition-colors hover:bg-paper-2/60">
                  <td class="px-5 py-4">
                    <p class="font-semibold text-ink">{{ row.paper_name }}</p>
                    <p class="text-[11px] text-ink-2">{{ row.gsm }}gsm · {{ row.sample_job_label }}</p>
                  </td>
                  <td class="px-5 py-4 text-ink-2">{{ row.product_label }}</td>
                  <td class="px-5 py-4">
                    <p class="font-semibold text-ink">{{ formatMoney(sideTotal(row, 'single')) }}</p>
                    <p class="text-[11px] text-ink-2">{{ formatMoney(sideUnit(row, 'single')) }} each</p>
                  </td>
                  <td class="px-5 py-4">
                    <template v-if="row.double_sided_enabled && row.market_double">
                      <p class="font-semibold text-ink">{{ formatMoney(sideTotal(row, 'double')) }}</p>
                      <p class="text-[11px] text-ink-2">{{ formatMoney(sideUnit(row, 'double')) }} each</p>
                    </template>
                    <span v-else class="text-[11px] font-semibold text-ink-2">Not available</span>
                  </td>
                  <td class="px-5 py-4">
                    <p class="font-semibold text-green">{{ formatMoney(markedUpTotal(sideTotal(row, 'single'))) }}</p>
                    <p class="text-[11px] text-ink-2">with {{ roundPercent }}% markup</p>
                  </td>
                  <td class="px-5 py-4">
                    <span
                      class="inline-block rounded-full px-2 py-[2px] font-mono text-[8.5px] font-semibold tracking-[0.1em] uppercase"
                      :style="qualityBadgeStyle(row.data_quality)"
                    >{{ qualityBadgeLabel(row.data_quality) }}</span>
                    <p class="mt-1 max-w-[180px] text-[11px] text-ink-2">{{ row.explanation }}</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <DesignEmptyNote
            v-else
            icon="Gauge"
            title="No rate rows are available yet"
            hint="Backend rate-card defaults have not been seeded."
            class="m-5"
          />
        </DesignCard>

        <aside class="h-fit">
          <DesignCard class="p-5">
            <h2 class="text-[15px] font-bold tracking-tight text-ink">Default markup</h2>
            <p class="mt-1 text-[12px] text-ink-2">This controls the quick client guide shown beside production costs.</p>
            <label class="mt-5 block font-mono text-[9px] font-semibold tracking-[0.16em] text-ink-3 uppercase" for="manager-markup">Markup percent</label>
            <div class="mt-2 flex items-center gap-2 rounded-xl border border-line bg-paper-2 px-3 py-2">
              <input id="manager-markup" v-model="markupPercent" type="number" min="0" class="w-full border-0 bg-transparent text-[26px] font-bold text-ink outline-none">
              <span class="text-[16px] font-bold text-ink-2">%</span>
            </div>
            <button
              class="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 font-mono text-[10px] font-bold tracking-[0.12em] text-white uppercase transition-colors hover:bg-brand-deep disabled:opacity-50"
              :disabled="savingMarkup"
              @click="saveMarkup"
            >
              <Loader2 v-if="savingMarkup" :size="11" class="animate-spin" /> Save markup
            </button>
            <div class="mt-5 rounded-xl bg-green-soft p-4">
              <p class="font-mono text-[9px] font-bold tracking-[0.16em] text-green uppercase">Example</p>
              <p class="mt-2 text-[12.5px] leading-relaxed text-ink">
                A KSh 1,000 production cost becomes <strong>{{ formatMoney(markedUpTotal(1000)) }}</strong>.
              </p>
            </div>
          </DesignCard>
        </aside>
      </section>
    </div>
  </DesignManagerSurface>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ArrowLeft, Loader2, RefreshCw } from 'lucide-vue-next'
import DesignManagerSurface from '~/components/design/manager/ManagerSurface.vue'
import DesignManagerPageHeader from '~/components/design/manager/ManagerPageHeader.vue'
import DesignAlert from '~/components/design/ui/Alert.vue'
import DesignCard from '~/components/design/ui/Card.vue'
import DesignEmptyNote from '~/components/design/ui/EmptyNote.vue'
import DesignLoading from '~/components/design/ui/Loading.vue'
import DesignStat from '~/components/design/ui/Stat.vue'
import { useManagerStore } from '~/stores/manager'
import { getApiErrorMessage } from '~/shared/api'
import type { ManagerMarketRate, ManagerMarketSide } from '~/shared/types'

const m = useManagerStore()

definePageMeta({ middleware: 'proto-role' })

const loading = ref(false)
const savingMarkup = ref(false)
const pageError = ref('')
const saveMessage = ref('')
const marketRows = ref<ManagerMarketRate[]>([])
const markupPercent = ref(75)
const lastUpdatedRaw = ref('')

const normalizedMarkupPercent = computed(() => Math.max(0, Number(markupPercent.value || 0)))
const roundPercent = computed(() => Math.round(normalizedMarkupPercent.value))
const activeRows = computed(() => marketRows.value.filter((row) => row?.market_single || row?.market_double))
const highConfidenceCount = computed(() => marketRows.value.filter((row) => row.data_quality === 'good').length)
const estimatedCount = computed(() => marketRows.value.filter((row) => row.data_quality === 'estimated').length)
const firstUpdatedText = computed(() => lastUpdatedRaw.value || 'Backend defaults')
const lastUpdatedLabel = computed(() => {
  if (!lastUpdatedRaw.value) return 'Using backend default rate card'
  const date = new Date(lastUpdatedRaw.value)
  if (Number.isNaN(date.getTime())) return String(lastUpdatedRaw.value)
  return new Intl.DateTimeFormat('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
})

function numberValue(value: unknown) {
  const numeric = Number(String(value ?? '').replace(/[^0-9.-]/g, ''))
  return Number.isFinite(numeric) ? numeric : 0
}

function formatMoney(value: string | number | null | undefined) {
  const numeric = numberValue(value)
  if (!numeric) return '—'
  return formatKSh(numeric, 2)
}

function markedUpTotal(value: string | number | null | undefined) {
  return numberValue(value) * (1 + normalizedMarkupPercent.value / 100)
}

function sideTotal(row: ManagerMarketRate, side: 'single' | 'double') {
  const source: ManagerMarketSide | null | undefined = side === 'double' ? row.market_double : row.market_single
  return source?.median_total_100 || source?.mean_total_100 || source?.median_per_unit || null
}

function sideUnit(row: ManagerMarketRate, side: 'single' | 'double') {
  const source: ManagerMarketSide | null | undefined = side === 'double' ? row.market_double : row.market_single
  return source?.median_per_unit || source?.mean_per_unit || null
}

function qualityBadgeLabel(quality: string | undefined) {
  if (quality === 'good') return 'Live market data'
  if (quality === 'limited') return 'Limited data'
  return 'Backend default'
}

function qualityBadgeStyle(quality: string | undefined) {
  if (quality === 'good') return { background: 'rgba(47,191,113,.14)', color: '#0E7A45' }
  if (quality === 'limited') return { background: 'rgba(245,166,35,.16)', color: '#B45309' }
  return { background: 'var(--color-paper-2)', color: 'var(--color-ink-2)' }
}

async function loadMarketRates() {
  pageError.value = ''
  saveMessage.value = ''
  loading.value = true
  try {
    await m.fetchMarketRates()
    marketRows.value = m.marketRates
    lastUpdatedRaw.value = ''
    markupPercent.value = Math.max(0, Math.round(m.defaultMarkupRate * 100))
  } catch (error) {
    pageError.value = getApiErrorMessage(error, 'We could not load market guidance.')
  } finally {
    loading.value = false
  }
}

async function saveMarkup() {
  saveMessage.value = ''
  pageError.value = ''
  savingMarkup.value = true
  try {
    await m.saveDefaultMarkup(normalizedMarkupPercent.value)
    markupPercent.value = Math.max(0, Math.round(m.defaultMarkupRate * 100))
    saveMessage.value = 'Default markup saved.'
  } catch (error) {
    pageError.value = getApiErrorMessage(error, 'We could not save your default markup.')
  } finally {
    savingMarkup.value = false
  }
}

onMounted(async () => {
  markupPercent.value = Math.max(0, Math.round(m.defaultMarkupRate * 100))
  await Promise.all([m.fetchProfile(), loadMarketRates()])
})
</script>
