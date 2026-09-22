<template>
  <div class="mx-auto w-full max-w-[1100px] px-4 pb-28 pt-8 sm:px-6">
    <NuxtLink
      to="/app/manager"
      class="mb-3 inline-flex items-center gap-1.5 font-mono2 text-[10px] uppercase tracking-[0.16em] text-[var(--sub)] transition-colors hover:text-[var(--accent)]"
    >
      <ArrowLeft :size="12" /> Back to the control room
    </NuxtLink>
    <div class="flex items-center gap-2 font-mono2 text-[10px] uppercase tracking-[0.22em] text-[var(--sub)]">
      <Gauge :size="12" style="color: var(--accent)" /> pricing guidance
    </div>
    <h1 class="mt-2 font-disp text-[30px] font-bold leading-tight tracking-tight sm:text-[36px]">
      Production price guidance.
    </h1>
    <p class="mt-2 max-w-[62ch] text-[13.5px] leading-relaxed text-[var(--sub)]">
      Backend default print rates are shown until enough production shops provide live pricing samples. This guides the client-facing prices you set.
    </p>

    <div v-if="pageError" class="mt-5 rounded-2xl border p-3.5 text-[12.5px]" style="border-color: #FB4D6D55; background: #FB4D6D14; color: #FB4D6D">
      {{ pageError }}
    </div>
    <div v-if="saveMessage" class="mt-5 rounded-2xl border p-3.5 text-[12.5px]" style="border-color: #2FBF7188; background: #2FBF7114; color: #2FBF71">
      {{ saveMessage }}
    </div>

    <div class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-2xl border p-4" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
        <p class="font-mono2 text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--sub)]">Rows loaded</p>
        <p class="mt-2 font-disp text-[26px] font-bold">{{ activeRows.length }}</p>
        <p class="mt-1 text-[11px] text-[var(--sub)]">From Django rate defaults</p>
      </div>
      <div class="rounded-2xl border p-4" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
        <p class="font-mono2 text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--sub)]">Live samples</p>
        <p class="mt-2 font-disp text-[26px] font-bold">{{ highConfidenceCount }}</p>
        <p class="mt-1 text-[11px] text-[var(--sub)]">High confidence rows</p>
      </div>
      <div class="rounded-2xl border p-4" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
        <p class="font-mono2 text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--sub)]">Backend defaults</p>
        <p class="mt-2 font-disp text-[26px] font-bold">{{ estimatedCount }}</p>
        <p class="mt-1 text-[11px] text-[var(--sub)]">Used when market data is thin</p>
      </div>
      <div class="rounded-2xl border p-4" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
        <p class="font-mono2 text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--sub)]">Updated</p>
        <p class="mt-2 text-[12px] font-semibold text-[var(--ink)]">{{ lastUpdatedLabel }}</p>
        <p class="mt-1 text-[11px] text-[var(--sub)]">{{ firstUpdatedText }}</p>
      </div>
    </div>

    <section class="mt-6 grid gap-5 lg:grid-cols-[1fr_320px]">
      <div class="overflow-hidden rounded-2xl border" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
        <div class="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4" :style="{ borderColor: 'var(--line)' }">
          <div>
            <h2 class="font-disp text-[15px] font-bold tracking-tight">Backend price rows</h2>
            <p class="mt-1 text-[12px] text-[var(--sub)]">Simplex and duplex totals are calculated from backend defaults and active shop samples.</p>
          </div>
          <button class="press-key inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 font-mono2 text-[9.5px] font-bold uppercase tracking-[0.12em] text-[var(--accent)]" :style="{ borderColor: 'var(--accent)' }" :disabled="loading" @click="loadMarketRates">
            <Loader2 v-if="loading" :size="11" class="animate-spin" />
            <RefreshCw v-else :size="11" /> Refresh
          </button>
        </div>

        <div v-if="loading" class="grid gap-3 p-5">
          <div v-for="index in 6" :key="index" class="h-14 animate-pulse rounded-xl" :style="{ background: 'var(--panel2)' }" />
        </div>
        <div v-else-if="marketRows.length" class="overflow-x-auto">
          <table class="w-full min-w-[880px] text-left text-[12.5px]">
            <thead class="border-b font-mono2 text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--sub)]" :style="{ borderColor: 'var(--line)', background: 'var(--panel2)' }">
              <tr>
                <th class="px-5 py-3">Paper</th>
                <th class="px-5 py-3">Product</th>
                <th class="px-5 py-3">Simplex production</th>
                <th class="px-5 py-3">Duplex production</th>
                <th class="px-5 py-3">Client guide</th>
                <th class="px-5 py-3">Source</th>
              </tr>
            </thead>
            <tbody class="divide-y" :style="{ borderColor: 'var(--line)' }">
              <tr v-for="row in marketRows" :key="row.key" class="hover:opacity-90">
                <td class="px-5 py-4">
                  <p class="font-semibold text-[var(--ink)]">{{ row.paper_name }}</p>
                  <p class="text-[11px] text-[var(--sub)]">{{ row.gsm }}gsm · {{ row.sample_job_label }}</p>
                </td>
                <td class="px-5 py-4 text-[var(--sub)]">{{ row.product_label }}</td>
                <td class="px-5 py-4">
                  <p class="font-semibold text-[var(--ink)]">{{ formatMoney(sideTotal(row, 'single')) }}</p>
                  <p class="text-[11px] text-[var(--sub)]">{{ formatMoney(sideUnit(row, 'single')) }} each</p>
                </td>
                <td class="px-5 py-4">
                  <template v-if="row.double_sided_enabled && row.market_double">
                    <p class="font-semibold text-[var(--ink)]">{{ formatMoney(sideTotal(row, 'double')) }}</p>
                    <p class="text-[11px] text-[var(--sub)]">{{ formatMoney(sideUnit(row, 'double')) }} each</p>
                  </template>
                  <span v-else class="text-[11px] font-semibold text-[var(--sub)]">Not available</span>
                </td>
                <td class="px-5 py-4">
                  <p class="font-semibold" style="color: #2FBF71">{{ formatMoney(markedUpTotal(sideTotal(row, 'single'))) }}</p>
                  <p class="text-[11px] text-[var(--sub)]">with {{ roundPercent }}% markup</p>
                </td>
                <td class="px-5 py-4">
                  <span
                    class="inline-block rounded-full px-2 py-[2px] font-mono2 text-[8.5px] font-semibold uppercase tracking-[0.1em]"
                    :style="qualityBadgeStyle(row.data_quality)"
                  >{{ qualityBadgeLabel(row.data_quality) }}</span>
                  <p class="mt-1 max-w-[180px] text-[11px] text-[var(--sub)]">{{ row.explanation }}</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="px-5 py-10 text-center text-[12.5px] text-[var(--sub)]">
          No rate rows are available yet — backend rate-card defaults have not been seeded.
        </div>
      </div>

      <aside class="h-fit rounded-2xl border p-5" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
        <h2 class="font-disp text-[15px] font-bold tracking-tight">Default markup</h2>
        <p class="mt-1 text-[12px] text-[var(--sub)]">This controls the quick client guide shown beside production costs.</p>
        <label class="mt-5 block font-mono2 text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--sub)]" for="manager-markup">Markup percent</label>
        <div class="mt-2 flex items-center gap-2 rounded-xl border px-3 py-2" :style="fieldStyle">
          <input id="manager-markup" v-model="markupPercent" type="number" min="0" class="w-full border-0 bg-transparent font-disp text-[26px] font-bold outline-none" :style="{ color: 'var(--ink)' }">
          <span class="font-disp text-[16px] font-bold text-[var(--sub)]">%</span>
        </div>
        <button class="press-key mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 font-mono2 text-[10px] font-bold uppercase tracking-[0.12em] disabled:opacity-50" :style="{ background: 'var(--accent)', color: 'var(--accentInk)' }" :disabled="savingMarkup" @click="saveMarkup">
          <Loader2 v-if="savingMarkup" :size="11" class="animate-spin" /> Save markup
        </button>
        <div class="mt-5 rounded-xl p-4" style="background: #2FBF7114">
          <p class="font-mono2 text-[9px] font-bold uppercase tracking-[0.16em]" style="color: #2FBF71">Example</p>
          <p class="mt-2 text-[12.5px] leading-relaxed text-[var(--ink)]">
            A KES 1,000 production cost becomes <strong>{{ formatMoney(markedUpTotal(1000)) }}</strong>.
          </p>
        </div>
      </aside>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ArrowLeft, Gauge, Loader2, RefreshCw } from 'lucide-vue-next'
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

const fieldStyle = { borderColor: 'var(--line)', background: 'var(--panel2)', color: 'var(--ink)' }

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
  return `KES ${numeric.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
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
  if (quality === 'good') return { background: 'rgba(47,191,113,.14)', color: '#2FBF71' }
  if (quality === 'limited') return { background: 'rgba(245,166,35,.16)', color: '#F5A623' }
  return { background: 'var(--panel2)', color: 'var(--sub)' }
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