<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { ArrowLeft, ArrowRight, Check, ChevronDown, RotateCcw, Table2, Undo2 } from 'lucide-vue-next'
import { cx } from '../../../utils/design/cx'
import { useApi } from '../../../composables/useApi'
import { API } from '../../../shared/api-paths'
import { getApiErrorMessage } from '../../../shared/api'
import {
  deriveRow,
  fromRateCard,
  previewOf,
  progressOf,
  setupWarnings,
  toRateCardPayload,
  type SetupBundle,
} from '../../../utils/design/printer-setup'

const props = defineProps<{ initial: SetupBundle }>()

const { api } = useApi()
const bundle = ref<SetupBundle>(JSON.parse(JSON.stringify(props.initial)) as SetupBundle)
const step = ref(1)
const saveState = ref<'idle' | 'saving' | 'saved' | 'error'>('idle')
const showAllPapers = ref(false)
const openBreakdown = ref<Record<string, boolean>>({})
const advanced = ref(false)
const previewOpen = ref(false)
const confirmError = ref<string | null>(null)
const lastPatch = ref<string | null>(null)
let timer: ReturnType<typeof setTimeout> | null = null

const setup = computed(() => bundle.value.setup)
const onPapers = computed(() => setup.value.papers.filter((p) => p.on))

const number = (v: string) => (v === '' ? null : Number(v))

function refreshLocal() {
  for (const paper of bundle.value.setup.papers) {
    paper.derived = deriveRow(
      { id: paper.id, gsm: paper.gsm, oneSideOnly: paper.oneSideOnly, paperCost: paper.paperCost },
      bundle.value.setup.numbers,
    )
  }
  bundle.value.setup.warnings = setupWarnings(
    bundle.value.setup.papers.filter((p) => p.on).map((p) => p.derived),
    bundle.value.setup.papers.filter((p) => p.on).map((p) => ({ id: p.id, name: p.name, paperCost: p.paperCost })),
  )
  bundle.value.progress = progressOf(bundle.value.setup)
  bundle.value.preview = previewOf(bundle.value.setup)
}

function scheduleSave(token: string) {
  lastPatch.value = token
  saveState.value = 'saving'
  if (timer) clearTimeout(timer)
  timer = setTimeout(async () => {
    try {
      const payload = await api<any>(API.rateCard.setup, { method: 'PATCH', body: toRateCardPayload(bundle.value) })
      bundle.value = fromRateCard(payload)
      saveState.value = 'saved'
    } catch {
      saveState.value = 'error'
    }
  }, 350)
}

async function undo() {
  if (!lastPatch.value) return
  try {
    const payload = await api<any>(API.rateCard.setup)
    bundle.value = fromRateCard(payload)
  } catch {
    saveState.value = 'error'
  }
}

async function confirmSetup() {
  confirmError.value = null
  try {
    await api(API.rateCard.complete, { method: 'POST' })
    const payload = await api<any>(API.rateCard.setup)
    bundle.value = fromRateCard(payload)
  } catch (error) {
    confirmError.value = getApiErrorMessage(error, 'Not ready yet')
  }
}

function togglePaper(id: string) {
  const paper = setup.value.papers.find((p) => p.id === id)
  if (!paper) return
  paper.on = !paper.on
  refreshLocal()
  scheduleSave(`paper:${id}`)
}

function setNumber(key: keyof typeof setup.value.numbers, value: string) {
  ;(setup.value.numbers as any)[key] = key === 'twoSideMode' ? value : number(value)
  refreshLocal()
  scheduleSave(String(key))
}

function setTwoSideMode(mode: 'twice' | 'price') {
  setup.value.numbers.twoSideMode = mode
  if (mode === 'twice') setup.value.numbers.twoSidePrice = null
  refreshLocal()
  scheduleSave('2s')
}

function setPaperCost(id: string, value: string) {
  const paper = setup.value.papers.find((p) => p.id === id)
  if (!paper) return
  paper.paperCost = Number(value)
  refreshLocal()
  scheduleSave(`cost:${id}`)
}

function resetPaper(id: string) {
  const paper = setup.value.papers.find((p) => p.id === id)
  if (!paper) return
  paper.paperCost = paper.defaultPaperCost
  refreshLocal()
  scheduleSave(`reset:${id}`)
}

function toggleService(id: string) {
  const service = setup.value.services.find((s) => s.id === id)
  if (!service) return
  service.on = !service.on
  refreshLocal()
  scheduleSave(`svc:${id}`)
}

function setService(key: 'rate' | 'minimum', id: string, value: string) {
  const service = setup.value.services.find((s) => s.id === id)
  if (!service) return
  service[key] = Number(value)
  const example = serviceExample(service.billUnit, service.rate, service.minimum)
  service.exampleLabel = example.label
  service.exampleAmountLabel = `KES ${Math.round(example.amount).toLocaleString('en-KE')}`
  refreshLocal()
  scheduleSave(`${key}:${id}`)
}

function serviceExample(billUnit: string, rate: number, minimum: number) {
  const units = billUnit === 'job' ? 1 : 100
  const noun = billUnit === 'job' ? 'job' : billUnit === 'sheet' ? 'sheets' : billUnit === 'book' ? 'books' : 'pieces'
  const raw = billUnit === 'job' ? rate : rate * units
  return { label: billUnit === 'job' ? '1 job' : `100 ${noun}`, amount: Math.round(Math.max(minimum, raw) * 100) / 100 }
}

function resetService(id: string) {
  const service = setup.value.services.find((s) => s.id === id)
  if (!service) return
  service.rate = service.defaultRate
  service.minimum = service.defaultMinimum
  refreshLocal()
  scheduleSave(`resetSvc:${id}`)
}

watch(() => props.initial, (next) => {
  bundle.value = JSON.parse(JSON.stringify(next)) as SetupBundle
})

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
})
</script>

<template>
  <div class="flex flex-col gap-4 pb-40">
    <div>
      <div class="flex items-baseline justify-between">
        <p class="font-mono text-[10px] font-semibold tracking-[0.16em] text-ink-3 uppercase">
          Step {{ step }} of 5
        </p>
        <p
          class="font-mono text-[10px] tracking-[0.1em] uppercase"
          :class="saveState === 'error' ? 'text-red' : saveState === 'saving' ? 'text-amber' : 'text-ink-3'"
          aria-live="polite"
        >
          {{ saveState === 'saving' ? 'Saving…' : saveState === 'error' ? "Couldn't save — trying again in a moment" : saveState === 'saved' ? 'Saved' : '' }}
        </p>
      </div>
      <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-paper-3">
        <div class="stage-fill h-full bg-brand" :style="{ width: `${(step / 5) * 100}%` }" />
      </div>
    </div>

    <h2 class="text-[22px] font-bold tracking-tight">
      {{ step === 1 ? 'What do you print on?' : step === 2 ? 'What do you charge to print one sheet?' : step === 3 ? 'What does each paper cost you?' : step === 4 ? 'Finishing' : 'Check and confirm' }}
    </h2>

    <template v-if="advanced">
      <div class="flex flex-col gap-4">
        <div class="overflow-hidden rounded-2xl border border-line bg-card">
          <div class="overflow-x-auto">
            <table class="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr class="border-b border-line bg-paper-2/60">
                  <th v-for="h in ['Paper', 'Cost', 'Print 1s', 'Print 2s', 'Surcharge', 'Total 1s', 'Total 2s', 'Quote/sheet', 'On']" :key="h" class="px-3 py-2.5 font-mono text-[9.5px] font-semibold tracking-[0.12em] text-ink-3 uppercase">{{ h }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="p in setup.papers" :key="p.id" class="border-b border-line/60 last:border-b-0">
                  <td class="px-3 py-2 text-[12.5px] font-medium">{{ p.name }} {{ p.gsm }}</td>
                  <td class="px-3 py-2">
                    <input type="number" :value="p.paperCost" class="tabular w-20 rounded-lg border border-line bg-paper px-2 py-1 text-right font-mono text-[12px] focus:border-brand focus:outline-none" @change="setPaperCost(p.id, ($event.target as HTMLInputElement).value)">
                  </td>
                  <td class="tabular px-3 py-2 text-right font-mono text-[12px]">{{ p.derived.print1s }}</td>
                  <td class="tabular px-3 py-2 text-right font-mono text-[12px]">{{ p.derived.print2s === null ? 'One side only' : p.derived.print2s }}</td>
                  <td class="tabular px-3 py-2 text-right font-mono text-[12px]">{{ p.derived.surcharge }}</td>
                  <td class="tabular px-3 py-2 text-right font-mono text-[12px] font-semibold">{{ p.derived.total1s }}</td>
                  <td class="tabular px-3 py-2 text-right font-mono text-[12px] font-semibold">{{ p.derived.total2s === null ? 'One side only' : p.derived.total2s }}</td>
                  <td class="tabular px-3 py-2 text-right font-mono text-[12px]">{{ p.derived.quote1s }}</td>
                  <td class="px-3 py-2">
                    <button type="button" class="flex h-5 w-9 cursor-pointer items-center rounded-full p-0.5" :class="p.on ? 'bg-brand' : 'bg-line'" @click="togglePaper(p.id)">
                      <span class="h-4 w-4 rounded-full bg-white transition-transform" :class="p.on && 'translate-x-4'" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="overflow-hidden rounded-2xl border border-line bg-card">
          <table class="w-full border-collapse text-left">
            <thead>
              <tr class="border-b border-line bg-paper-2/60">
                <th v-for="h in ['Service', 'Bills', 'Rate', 'Minimum', 'On']" :key="h" class="px-3 py-2.5 font-mono text-[9.5px] font-semibold tracking-[0.12em] text-ink-3 uppercase">{{ h }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="v in setup.services" :key="v.id" class="border-b border-line/60 last:border-b-0">
                <td class="px-3 py-2 text-[12.5px] font-medium">{{ v.name }}</td>
                <td class="px-3 py-2 font-mono text-[11px] text-ink-3">{{ v.billUnit }}</td>
                <td class="px-3 py-2">
                  <input type="number" :value="v.rate" class="tabular w-20 rounded-lg border border-line bg-paper px-2 py-1 text-right font-mono text-[12px] focus:border-brand focus:outline-none" @change="setService('rate', v.id, ($event.target as HTMLInputElement).value)">
                </td>
                <td class="px-3 py-2">
                  <input type="number" :value="v.minimum" class="tabular w-20 rounded-lg border border-line bg-paper px-2 py-1 text-right font-mono text-[12px] focus:border-brand focus:outline-none" @change="setService('minimum', v.id, ($event.target as HTMLInputElement).value)">
                </td>
                <td class="px-3 py-2">
                  <button type="button" class="flex h-5 w-9 cursor-pointer items-center rounded-full p-0.5" :class="v.on ? 'bg-brand' : 'bg-line'" @click="toggleService(v.id)">
                    <span class="h-4 w-4 rounded-full bg-white transition-transform" :class="v.on && 'translate-x-4'" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>

    <template v-else>
      <div v-if="step === 1">
        <p class="text-[13.5px] text-ink-2">Pick the papers you actually keep in stock. You can change this any time.</p>
        <div class="mt-4 grid grid-cols-2 gap-3">
          <button
            v-for="p in (showAllPapers ? setup.papers : setup.papers.filter((p) => p.suggested || p.on))"
            :key="p.id"
            type="button"
            :aria-pressed="p.on"
            class="min-h-[76px] cursor-pointer rounded-2xl border p-3.5 text-left transition-colors"
            :class="p.on ? 'border-brand bg-mint' : 'border-line bg-card'"
            @click="togglePaper(p.id)"
          >
            <span class="flex items-start justify-between gap-2">
              <span class="text-[13.5px] font-semibold tracking-tight">{{ p.name }} {{ p.gsm }}gsm</span>
              <span class="mt-0.5 flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors" :class="p.on ? 'bg-brand' : 'bg-line'">
                <span class="h-4 w-4 rounded-full bg-white transition-transform" :class="p.on && 'translate-x-4'" />
              </span>
            </span>
            <span class="mt-1 block font-mono text-[10px] text-ink-3">{{ p.sizeLabel }} · {{ p.finishLabel }}</span>
          </button>
        </div>
        <button type="button" class="mt-3 inline-flex cursor-pointer items-center gap-1 font-mono text-[10.5px] tracking-[0.1em] text-brand uppercase" @click="showAllPapers = !showAllPapers">
          <ChevronDown class="h-3.5 w-3.5 transition-transform" :class="showAllPapers && 'rotate-180'" />
          {{ showAllPapers ? 'Show fewer papers' : 'Show all papers' }}
        </button>
      </div>

      <div v-else-if="step === 2" class="flex flex-col gap-5">
        <label class="block">
          <span class="font-mono text-[10px] tracking-[0.14em] text-ink-3 uppercase">Printing one side of one sheet (KSh)</span>
          <input type="number" inputmode="decimal" :value="setup.numbers.oneSidePrice ?? ''" class="tabular mt-2 w-full rounded-2xl border border-line-strong bg-card px-5 py-4 text-right font-mono text-[28px] font-semibold focus:border-brand focus:outline-none" @input="setNumber('oneSidePrice', ($event.target as HTMLInputElement).value)">
          <span class="mt-2 block text-[13px] text-ink-2">We'll work out two sides, heavy paper and everything else for you.</span>
        </label>
        <div class="rounded-2xl border border-line bg-card p-4">
          <p class="text-[13.5px] font-medium">Do you charge extra for thick paper?</p>
          <div class="mt-3 grid grid-cols-2 gap-3">
            <label class="block">
              <span class="font-mono text-[9.5px] tracking-[0.12em] text-ink-3 uppercase">From how heavy? (gsm)</span>
              <input type="number" :value="setup.numbers.heavyFromGsm ?? ''" class="tabular mt-1 w-full rounded-xl border border-line-strong bg-paper px-3 py-2.5 text-right font-mono text-[14px] focus:border-brand focus:outline-none" @input="setNumber('heavyFromGsm', ($event.target as HTMLInputElement).value)">
            </label>
            <label class="block">
              <span class="font-mono text-[9.5px] tracking-[0.12em] text-ink-3 uppercase">How much extra per sheet?</span>
              <input type="number" :value="setup.numbers.heavyAmount ?? ''" class="tabular mt-1 w-full rounded-xl border border-line-strong bg-paper px-3 py-2.5 text-right font-mono text-[14px] focus:border-brand focus:outline-none" @input="setNumber('heavyAmount', ($event.target as HTMLInputElement).value)">
            </label>
          </div>
        </div>
        <div class="rounded-2xl border border-line bg-card p-4">
          <p class="text-[13.5px] font-medium">Two sides costs:</p>
          <div class="mt-3 flex flex-col gap-2">
            <button type="button" class="min-h-[44px] cursor-pointer rounded-xl border px-4 text-left text-[13.5px] font-medium" :class="setup.numbers.twoSideMode === 'twice' ? 'border-brand bg-mint' : 'border-line bg-paper'" @click="setTwoSideMode('twice')">Twice one side</button>
            <button type="button" class="min-h-[44px] cursor-pointer rounded-xl border px-4 text-left text-[13.5px] font-medium" :class="setup.numbers.twoSideMode === 'price' ? 'border-brand bg-mint' : 'border-line bg-paper'" @click="setTwoSideMode('price')">A different price</button>
            <input v-if="setup.numbers.twoSideMode === 'price'" type="number" :value="setup.numbers.twoSidePrice ?? ''" class="tabular w-full rounded-xl border border-line-strong bg-paper px-3 py-2.5 text-right font-mono text-[14px] focus:border-brand focus:outline-none" @input="setNumber('twoSidePrice', ($event.target as HTMLInputElement).value)">
          </div>
        </div>
      </div>

      <div v-else-if="step === 3" class="flex flex-col gap-3">
        <div v-for="p in onPapers" :key="p.id" class="rounded-2xl border border-line bg-card p-4">
          <div class="flex items-baseline justify-between gap-3">
            <p class="text-[14px] font-semibold tracking-tight">{{ p.name }} {{ p.gsm }}gsm</p>
            <button type="button" class="inline-flex cursor-pointer items-center gap-1 font-mono text-[9.5px] tracking-[0.1em] text-ink-3 uppercase hover:text-brand" @click="resetPaper(p.id)">
              <RotateCcw class="h-3 w-3" /> Reset to Printy defaults
            </button>
          </div>
          <label class="mt-3 block">
            <span class="font-mono text-[9.5px] tracking-[0.12em] text-ink-3 uppercase">Paper cost per sheet</span>
            <input type="number" :value="p.paperCost" class="tabular mt-1 w-full rounded-xl border border-line-strong bg-paper px-4 py-3 text-right font-mono text-[16px] font-semibold focus:border-brand focus:outline-none" @input="setPaperCost(p.id, ($event.target as HTMLInputElement).value)">
          </label>
          <button type="button" class="mt-2 inline-flex cursor-pointer items-center gap-1 font-mono text-[10px] tracking-[0.1em] text-brand uppercase" @click="openBreakdown[p.id] = !openBreakdown[p.id]">
            <ChevronDown class="h-3.5 w-3.5 transition-transform" :class="openBreakdown[p.id] && 'rotate-180'" />
            See how this is worked out
          </button>
          <dl v-if="openBreakdown[p.id]" class="tabular mt-2 grid grid-cols-2 gap-x-4 gap-y-1 rounded-xl bg-paper-2/60 p-3 font-mono text-[11.5px]">
            <dt class="text-ink-3">Print alone 1s</dt><dd class="text-right">{{ p.derived.print1s }}</dd>
            <dt class="text-ink-3">Print alone 2s</dt><dd class="text-right">{{ p.derived.print2s === null ? 'One side only' : p.derived.print2s }}</dd>
            <dt class="text-ink-3">Surcharge</dt><dd class="text-right">{{ p.derived.surcharge }}</dd>
            <dt class="text-ink-3">Total 1s</dt><dd class="text-right font-semibold">{{ p.derived.total1s }}</dd>
            <dt class="text-ink-3">Total 2s</dt><dd class="text-right font-semibold">{{ p.derived.total2s === null ? 'One side only' : p.derived.total2s }}</dd>
            <dt class="text-ink-3">Quote per sheet</dt><dd class="text-right font-semibold">{{ p.derived.quote1s }}</dd>
          </dl>
          <p v-if="p.derived.total2s === null" class="mt-2 rounded-lg bg-paper-2/70 px-3 py-1.5 text-[12px] text-ink-2">One side only</p>
        </div>
        <p v-for="w in setup.warnings" :key="w" class="rounded-xl border border-amber/40 bg-amber-soft px-4 py-2.5 text-[13px] text-amber">{{ w }}</p>
      </div>

      <div v-else-if="step === 4" class="flex flex-col gap-5">
        <div v-for="group in [...new Set(setup.services.map((v) => v.groupName))]" :key="group">
          <p class="font-mono text-[10px] font-semibold tracking-[0.16em] text-ink-3 uppercase">{{ group }}</p>
          <div class="mt-2 flex flex-col gap-2.5">
            <div v-for="v in setup.services.filter((v) => v.groupName === group)" :key="v.id" class="rounded-2xl border border-line bg-card p-4">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="text-[13.5px] font-semibold tracking-tight">{{ v.name }}</p>
                  <p class="mt-0.5 text-[12px] text-ink-2">{{ v.plainNote }}</p>
                </div>
                <button type="button" :aria-pressed="v.on" class="flex h-6 w-10 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors" :class="v.on ? 'bg-brand' : 'bg-line'" @click="toggleService(v.id)">
                  <span class="h-5 w-5 rounded-full bg-white transition-transform" :class="v.on && 'translate-x-4'" />
                </button>
              </div>
              <div v-if="v.on" class="mt-3 grid grid-cols-2 gap-3">
                <label class="block">
                  <span class="font-mono text-[9.5px] tracking-[0.12em] text-ink-3 uppercase">Price ({{ v.billUnit }})</span>
                  <input type="number" :value="v.rate" class="tabular mt-1 w-full rounded-xl border border-line-strong bg-paper px-3 py-2.5 text-right font-mono text-[14px] focus:border-brand focus:outline-none" @input="setService('rate', v.id, ($event.target as HTMLInputElement).value)">
                </label>
                <label class="block">
                  <span class="font-mono text-[9.5px] tracking-[0.12em] text-ink-3 uppercase">Smallest amount you'll charge for this job</span>
                  <input type="number" :value="v.minimum" class="tabular mt-1 w-full rounded-xl border border-line-strong bg-paper px-3 py-2.5 text-right font-mono text-[14px] focus:border-brand focus:outline-none" @input="setService('minimum', v.id, ($event.target as HTMLInputElement).value)">
                </label>
              </div>
              <p class="tabular mt-2 font-mono text-[11px] text-ink-3">{{ v.exampleLabel }} = {{ v.exampleAmountLabel }}</p>
              <button type="button" class="mt-1 inline-flex cursor-pointer items-center gap-1 font-mono text-[9.5px] tracking-[0.1em] text-ink-3 uppercase hover:text-brand" @click="resetService(v.id)">
                <RotateCcw class="h-3 w-3" /> Reset to Printy defaults
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="flex flex-col gap-4">
        <p class="text-[13.5px] text-ink-2">Check your numbers. Confirming is what makes your shop visible to managers.</p>
        <dl class="tabular rounded-2xl border border-line bg-card p-4 font-mono text-[12.5px]">
          <div class="flex justify-between py-1"><dt class="text-ink-3">Papers switched on</dt><dd>{{ onPapers.length }}</dd></div>
          <div class="flex justify-between py-1"><dt class="text-ink-3">One-side price</dt><dd>{{ setup.numbers.oneSidePrice ?? '—' }}</dd></div>
          <div class="flex justify-between py-1"><dt class="text-ink-3">Finishing services on</dt><dd>{{ setup.services.filter((v) => v.on).length }}</dd></div>
        </dl>
        <div v-if="bundle.progress.missing.length > 0" class="rounded-2xl border border-amber/40 bg-amber-soft p-4">
          <p class="font-mono text-[10px] font-semibold tracking-[0.14em] text-amber uppercase">Still needed</p>
          <ul class="mt-2 list-inside list-disc text-[13px] text-amber">
            <li v-for="m in bundle.progress.missing" :key="m">{{ m }}</li>
          </ul>
        </div>
        <p v-if="confirmError" class="rounded-xl border border-red/40 bg-red-soft px-4 py-2.5 text-[13px] text-red">{{ confirmError }}</p>
        <button type="button" :disabled="bundle.progress.missing.length > 0" class="min-h-[52px] cursor-pointer rounded-2xl bg-brand px-6 text-[15px] font-bold text-white shadow-brand transition-colors hover:bg-brand-deep disabled:cursor-not-allowed disabled:opacity-50" @click="confirmSetup">
          {{ bundle.progress.confirmed ? 'Confirmed — your shop is visible to managers' : 'Confirm my setup' }}
        </button>
      </div>
    </template>

    <div class="flex items-center justify-between gap-3">
      <button type="button" :disabled="step === 1" class="inline-flex min-h-[44px] cursor-pointer items-center gap-1.5 rounded-xl border border-line-strong px-4 text-[13.5px] font-medium disabled:opacity-40" @click="step = Math.max(1, step - 1)">
        <ArrowLeft class="h-4 w-4" /> Back
      </button>
      <button type="button" class="inline-flex min-h-[44px] cursor-pointer items-center gap-1.5 font-mono text-[10.5px] tracking-[0.1em] text-ink-3 uppercase hover:text-ink" @click="advanced = !advanced">
        <Table2 class="h-3.5 w-3.5" /> {{ advanced ? 'Guided setup' : 'Advanced table' }}
      </button>
      <button v-if="step < 5" type="button" class="inline-flex min-h-[44px] cursor-pointer items-center gap-1.5 rounded-xl bg-ink px-5 text-[13.5px] font-semibold text-paper hover:bg-brand-deep" @click="step = Math.min(5, step + 1)">
        Next <ArrowRight class="h-4 w-4" />
      </button>
      <button v-else type="button" class="inline-flex min-h-[44px] cursor-pointer items-center gap-1.5 rounded-xl border border-line-strong px-4 text-[13px] font-medium text-ink-2" @click="scheduleSave('noop')">Skip for now</button>
    </div>
    <button v-if="lastPatch && saveState !== 'saving'" type="button" class="inline-flex cursor-pointer items-center gap-1.5 self-start font-mono text-[10.5px] tracking-[0.1em] text-ink-3 uppercase hover:text-ink" @click="undo">
      <Undo2 class="h-3.5 w-3.5" /> Undo last change
    </button>

    <div class="fixed inset-x-4 bottom-[calc(env(safe-area-inset-bottom,0px)+12px)] z-30 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[360px]">
      <div class="overflow-hidden rounded-[24px] border border-line bg-card shadow-lift">
        <button type="button" class="flex w-full cursor-pointer items-center justify-between px-5 py-3" @click="previewOpen = !previewOpen">
          <span class="font-mono text-[10px] font-semibold tracking-[0.16em] text-ink-3 uppercase">What a buyer would pay</span>
          <ChevronDown class="h-4 w-4 text-ink-3 transition-transform" :class="previewOpen && 'rotate-180'" />
        </button>
        <div v-if="previewOpen" class="border-t border-line px-5 py-4">
          <p class="text-[13px] font-medium">{{ bundle.preview.sampleLabel }}</p>
          <dl class="tabular mt-2 flex flex-col gap-1 font-mono text-[12.5px]">
            <div v-for="l in bundle.preview.lines" :key="l.label" class="flex justify-between gap-4">
              <dt class="text-ink-3">{{ l.label }}</dt>
              <dd class="text-right font-semibold">{{ l.amountLabel }}</dd>
            </div>
          </dl>
          <p class="mt-2 text-[11px] text-ink-3">{{ bundle.preview.note }}</p>
        </div>
      </div>
    </div>

    <p v-if="bundle.progress.confirmed" class="flex items-center gap-2 rounded-xl border border-green/40 bg-green-soft px-4 py-2.5 text-[13px] text-green">
      <Check class="h-4 w-4" /> Confirmed — your shop is visible to managers
    </p>
  </div>
</template>
