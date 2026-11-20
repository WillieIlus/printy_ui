<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { ArrowLeft, ArrowRight, Check, ChevronDown, Loader2, Table2 } from 'lucide-vue-next'
import { useApi } from '../../../composables/useApi'
import { useShopStore } from '../../../stores/shop'
import { API } from '../../../shared/api-paths'
import { getApiErrorMessage } from '../../../shared/api'
import {
  deriveRow,
  fromRateCard,
  previewOf,
  SETUP_STEPS,
  setupStepDone,
  setupStepGuidance,
  setupWarnings,
  toRateCardPayload,
  type SetupBundle,
  type SetupStatusPayload,
} from '../../../utils/design/printer-setup'

const props = defineProps<{ initial: SetupBundle }>()

const { api } = useApi()
const shopStore = useShopStore()
const bundle = ref<SetupBundle>(JSON.parse(JSON.stringify(props.initial)) as SetupBundle)
const status = ref<SetupStatusPayload | null>(null)
const step = ref(1)
const advanced = ref(false)
const saveState = ref<'idle' | 'saving' | 'saved' | 'error'>('idle')
const saveError = ref('')
const machineError = ref('')
const confirmError = ref('')
let timer: ReturnType<typeof setTimeout> | null = null

const setup = computed(() => bundle.value.setup)
const machines = computed(() => shopStore.machines.filter(machine => machine.is_active))
const current = computed(() => SETUP_STEPS[Math.max(0, Math.min(step.value - 1, SETUP_STEPS.length - 1))]!)
const guidance = computed(() => setupStepGuidance(status.value))
const progressPercent = computed(() => (step.value / SETUP_STEPS.length) * 100)
const onPapers = computed(() => setup.value.papers.filter(paper => paper.on))
const firstPaper = computed(() => onPapers.value[0] ?? null)
const firstMachine = computed(() => machines.value[0] ?? null)

const shopForm = reactive({
  name: '',
  whatsapp: '',
  location: '',
  turnaround: '',
})

const machineForm = reactive({
  name: '',
  machine_type: 'digital',
  max_width_mm: 330,
  max_height_mm: 488,
  min_gsm: 80,
  max_gsm: 400,
})

function text(value: unknown): string {
  return value == null ? '' : String(value)
}

function syncShopForm() {
  const details = bundle.value.raw?.shop_details ?? {}
  shopForm.name = text(details.shop_name || setup.value.shopName)
  shopForm.whatsapp = text(details.whatsapp_number)
  shopForm.location = text(details.location_area)
  shopForm.turnaround = text(details.standard_turnaround_hours)
}

function refreshLocal() {
  for (const paper of bundle.value.setup.papers) {
    paper.derived = deriveRow(
      { id: paper.id, gsm: paper.gsm, oneSideOnly: paper.oneSideOnly, paperCost: paper.paperCost },
      bundle.value.setup.numbers,
    )
  }
  bundle.value.setup.warnings = setupWarnings(
    bundle.value.setup.papers.filter(paper => paper.on).map(paper => paper.derived),
    bundle.value.setup.papers.filter(paper => paper.on).map(paper => ({ id: paper.id, name: paper.name, paperCost: paper.paperCost })),
  )
  bundle.value.preview = previewOf(bundle.value.setup)
}

function payloadForSave() {
  const payload = toRateCardPayload(bundle.value) as Record<string, any>
  payload.shop_details = {
    ...(bundle.value.raw?.shop_details ?? {}),
    shop_name: shopForm.name.trim(),
    whatsapp_number: shopForm.whatsapp.trim(),
    location_area: shopForm.location.trim(),
    standard_turnaround_hours: shopForm.turnaround.trim(),
  }
  return payload
}

async function refreshStatus() {
  const [statusPayload, setupPayload] = await Promise.all([
    api<SetupStatusPayload>(API.rateCard.setupStatus),
    api<any>(API.rateCard.setup),
  ])
  status.value = statusPayload
  bundle.value = fromRateCard(setupPayload)
  syncShopForm()
  refreshLocal()
}

async function saveRateCard() {
  saveState.value = 'saving'
  saveError.value = ''
  try {
    const payload = await api<any>(API.rateCard.setup, { method: 'PATCH', body: payloadForSave() })
    bundle.value = fromRateCard(payload)
    syncShopForm()
    refreshLocal()
    status.value = await api<SetupStatusPayload>(API.rateCard.setupStatus)
    saveState.value = 'saved'
    return true
  } catch (error) {
    saveState.value = 'error'
    saveError.value = getApiErrorMessage(error, "We couldn't save that step.")
    return false
  }
}

function scheduleSave() {
  saveState.value = 'saving'
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => { void saveRateCard() }, 350)
}

function setNumber(key: 'oneSidePrice' | 'twoSidePrice' | 'heavyFromGsm' | 'heavyAmount', value: string) {
  const numeric = value === '' ? null : Number(value)
  ;(setup.value.numbers as any)[key] = Number.isFinite(numeric as number) ? numeric : null
  refreshLocal()
  scheduleSave()
}

function togglePaper(id: string) {
  const paper = setup.value.papers.find(row => row.id === id)
  if (!paper) return
  paper.on = !paper.on
  refreshLocal()
  scheduleSave()
}

function setPaperCost(id: string, value: string) {
  const paper = setup.value.papers.find(row => row.id === id)
  if (!paper) return
  paper.paperCost = Number(value) || 0
  refreshLocal()
  scheduleSave()
}

function setService(key: 'rate' | 'minimum', id: string, value: string) {
  const service = setup.value.services.find(row => row.id === id)
  if (!service) return
  service[key] = Number(value) || 0
  const units = service.billUnit === 'job' ? 1 : 100
  const raw = service.billUnit === 'job' ? service.rate : service.rate * units
  service.exampleAmountLabel = `KES ${Math.round(Math.max(service.minimum, raw)).toLocaleString('en-KE')}`
  scheduleSave()
}

function stepIsDone(index: number): boolean {
  if (index === 0) {
    return Boolean(shopForm.name.trim() && shopForm.location.trim())
  }
  return setupStepDone(status.value, SETUP_STEPS[index]!.key, bundle.value)
}

function canOpenStep(index: number): boolean {
  if (index <= step.value - 1) return true
  for (let i = 0; i < index; i += 1) {
    if (!stepIsDone(i)) return false
  }
  return true
}

function goToStep(index: number) {
  if (!canOpenStep(index)) return
  step.value = index + 1
}

async function saveMachine() {
  machineError.value = ''
  if (machines.value.length) {
    step.value = 3
    return
  }
  if (!shopStore.shops.length) await shopStore.fetchShops()
  if (!shopStore.shops.length) {
    machineError.value = 'Save your shop details first so we know which shop this machine belongs to.'
    return
  }
  try {
    await shopStore.createMachine({
      name: machineForm.name.trim() || 'Main press',
      machine_type: machineForm.machine_type,
      max_width_mm: Number(machineForm.max_width_mm) || null,
      max_height_mm: Number(machineForm.max_height_mm) || null,
      min_gsm: Number(machineForm.min_gsm) || null,
      max_gsm: Number(machineForm.max_gsm) || null,
      is_active: true,
    })
    await shopStore.fetchMachines()
    status.value = await api<SetupStatusPayload>(API.rateCard.setupStatus)
    step.value = 3
  } catch (error) {
    machineError.value = getApiErrorMessage(error, "We couldn't save that machine.")
  }
}

async function next() {
  confirmError.value = ''
  if (step.value === 1) {
    if (!shopForm.name.trim()) {
      saveError.value = 'Add your shop name first.'
      return
    }
    if (await saveRateCard()) step.value = 2
    return
  }
  if (step.value === 2) {
    await saveMachine()
    return
  }
  if (step.value === 3) {
    if (!(Number(shopForm.turnaround) > 0)) {
      saveError.value = 'Set a standard turnaround in business hours.'
      return
    }
    if (await saveRateCard()) step.value = 4
    return
  }
  if (step.value === 4) {
    if (!onPapers.value.length) {
      saveError.value = 'Switch on at least one paper so Printy can quote jobs.'
      return
    }
    if (setup.value.numbers.oneSidePrice === null) {
      saveError.value = 'Set the price you charge to print one sheet.'
      return
    }
    if (await saveRateCard()) step.value = 5
    return
  }
  if (step.value === 5) {
    if (status.value?.setup_status?.is_confirmed) {
      await navigateTo('/app/printer')
      return
    }
    await confirmSetup()
  }
}

function previous() {
  if (step.value > 1) step.value -= 1
}

async function confirmSetup() {
  confirmError.value = ''
  try {
    await api(API.rateCard.complete, { method: 'POST' })
    await refreshStatus()
  } catch (error) {
    confirmError.value = getApiErrorMessage(error, 'Not ready yet. Check the missing step below.')
  }
}

watch(() => props.initial, (nextBundle) => {
  bundle.value = JSON.parse(JSON.stringify(nextBundle)) as SetupBundle
  syncShopForm()
  refreshLocal()
})

onMounted(async () => {
  await Promise.all([shopStore.fetchShops(), shopStore.fetchMachines()])
  try {
    await refreshStatus()
  } catch {
    // The page already has the initial bundle; the status refresh is additive.
  }
  syncShopForm()
  let first = SETUP_STEPS.length
  for (let index = 0; index < SETUP_STEPS.length; index += 1) {
    if (!stepIsDone(index)) {
      first = index + 1
      break
    }
  }
  step.value = Math.min(SETUP_STEPS.length, Math.max(1, first))
})
</script>

<template>
  <div class="flex flex-col gap-5 pb-40">
    <div>
      <div class="flex flex-wrap items-baseline justify-between gap-2">
        <p class="font-mono text-[10px] font-semibold tracking-[0.16em] text-ink-3 uppercase">
          Step {{ step }} of 5
        </p>
        <p
          class="font-mono text-[10px] tracking-[0.1em] uppercase"
          :class="saveState === 'error' ? 'text-red' : saveState === 'saving' ? 'text-amber' : 'text-ink-3'"
          aria-live="polite"
        >
          {{ saveState === 'saving' ? 'Saving…' : saveState === 'error' ? "Couldn't save" : saveState === 'saved' ? 'Saved' : '' }}
        </p>
      </div>
      <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-paper-3">
        <div class="stage-fill h-full bg-brand" :style="{ width: `${progressPercent}%` }" />
      </div>
    </div>

    <ol class="grid grid-cols-2 gap-2 sm:grid-cols-5" aria-label="Setup steps">
      <li v-for="(definition, index) in SETUP_STEPS" :key="definition.key">
        <button
          type="button"
          :data-test="`setup-step-tab-${definition.key}`"
          :disabled="!canOpenStep(index)"
          class="flex min-h-[44px] w-full items-center gap-2 rounded-xl border px-3 py-2 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-55"
          :class="step === index + 1 ? 'border-brand bg-mint text-brand-deep' : stepIsDone(index) ? 'border-green/40 bg-green-soft text-green' : 'border-line bg-card text-ink-2'"
          @click="goToStep(index)"
        >
          <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current/30 font-mono text-[9px] font-bold">
            <Check v-if="stepIsDone(index)" class="h-3 w-3" :stroke-width="3" />
            <template v-else>{{ index + 1 }}</template>
          </span>
          <span class="truncate text-[11.5px] font-semibold">{{ definition.title }}</span>
        </button>
      </li>
    </ol>

    <div>
      <h2 class="text-[22px] font-bold tracking-tight">{{ current.title }}</h2>
      <p class="mt-1 text-[13.5px] leading-relaxed text-ink-2">{{ current.hint }}</p>
      <p v-if="guidance && (guidance.title || guidance.hint)" class="mt-2 rounded-xl border border-amber/35 bg-amber-soft px-3 py-2 text-[12px] leading-relaxed text-amber">
        <span class="font-semibold">{{ guidance.title }}</span>
        <span v-if="guidance.hint"> — {{ guidance.hint }}</span>
      </p>
    </div>

    <div v-if="step === 1" data-test="setup-step-shop" class="flex flex-col gap-3">
      <label class="block">
        <span class="font-mono text-[9.5px] font-semibold tracking-[0.12em] text-ink-3 uppercase">Shop name</span>
        <input v-model="shopForm.name" data-test="setup-shop-name" type="text" class="mt-1 w-full rounded-xl border border-line bg-card px-3 py-2.5 text-[13.5px] text-ink outline-none focus:border-brand">
      </label>
      <label class="block">
        <span class="font-mono text-[9.5px] font-semibold tracking-[0.12em] text-ink-3 uppercase">WhatsApp number</span>
        <input v-model="shopForm.whatsapp" data-test="setup-shop-whatsapp" type="text" placeholder="07…" class="mt-1 w-full rounded-xl border border-line bg-card px-3 py-2.5 text-[13.5px] text-ink outline-none focus:border-brand">
      </label>
      <label class="block">
        <span class="font-mono text-[9.5px] font-semibold tracking-[0.12em] text-ink-3 uppercase">Area you serve</span>
        <input v-model="shopForm.location" data-test="setup-shop-location" type="text" placeholder="Nairobi CBD" class="mt-1 w-full rounded-xl border border-line bg-card px-3 py-2.5 text-[13.5px] text-ink outline-none focus:border-brand">
      </label>
    </div>

    <div v-else-if="step === 2" data-test="setup-step-machine" class="flex flex-col gap-3">
      <div v-if="machines.length" class="rounded-xl border border-green/40 bg-green-soft px-4 py-3">
        <p class="text-[13px] font-semibold text-green">
          {{ firstMachine?.name }} · {{ firstMachine?.machine_type }}
        </p>
        <p class="mt-0.5 text-[12px] text-green/80">This press is ready for pricing.</p>
      </div>
      <template v-else>
        <label class="block">
          <span class="font-mono text-[9.5px] font-semibold tracking-[0.12em] text-ink-3 uppercase">Machine name</span>
          <input v-model="machineForm.name" data-test="setup-machine-name" type="text" placeholder="e.g. Main digital press" class="mt-1 w-full rounded-xl border border-line bg-card px-3 py-2.5 text-[13.5px] text-ink outline-none focus:border-brand">
        </label>
        <div class="grid grid-cols-2 gap-3">
          <label class="block">
            <span class="font-mono text-[9.5px] font-semibold tracking-[0.12em] text-ink-3 uppercase">Type</span>
            <input v-model="machineForm.machine_type" data-test="setup-machine-type" type="text" class="mt-1 w-full rounded-xl border border-line bg-card px-3 py-2.5 text-[13.5px] text-ink outline-none focus:border-brand">
          </label>
          <label class="block">
            <span class="font-mono text-[9.5px] font-semibold tracking-[0.12em] text-ink-3 uppercase">Largest width (mm)</span>
            <input v-model.number="machineForm.max_width_mm" type="number" class="mt-1 w-full rounded-xl border border-line bg-card px-3 py-2.5 text-[13.5px] text-ink outline-none focus:border-brand">
          </label>
        </div>
        <p class="text-[11.5px] leading-relaxed text-ink-3">
          We only use this to match jobs your press can actually print.
        </p>
      </template>
      <p v-if="machineError" data-test="setup-machine-error" class="text-[12px] text-red">{{ machineError }}</p>
    </div>

    <div v-else-if="step === 3" data-test="setup-step-turnaround" class="flex flex-col gap-3">
      <label class="block max-w-[260px]">
        <span class="font-mono text-[9.5px] font-semibold tracking-[0.12em] text-ink-3 uppercase">Standard turnaround (business hours)</span>
        <input v-model="shopForm.turnaround" data-test="setup-turnaround" type="text" inputmode="numeric" placeholder="e.g. 48" class="mt-1 w-full rounded-xl border border-line bg-card px-3 py-2.5 font-mono text-[15px] font-semibold text-ink outline-none focus:border-brand">
      </label>
      <p class="text-[12.5px] leading-relaxed text-ink-2">
        This is the time a standard job takes. Faster and Fastest are calculated from it; you can
        override them later in the advanced table.
      </p>
    </div>

    <div v-else-if="step === 4" data-test="setup-step-prices" class="flex flex-col gap-4">
      <div>
        <p class="font-mono text-[9.5px] font-semibold tracking-[0.12em] text-ink-3 uppercase">Papers you keep</p>
        <div class="mt-2 grid gap-2 sm:grid-cols-2">
          <button
            v-for="paper in setup.papers"
            :key="paper.id"
            type="button"
            data-test="setup-paper-toggle"
            class="flex min-h-[44px] items-center justify-between gap-2 rounded-xl border px-3 py-2 text-left"
            :class="paper.on ? 'border-brand bg-mint text-brand-deep' : 'border-line bg-card text-ink-2'"
            @click="togglePaper(paper.id)"
          >
            <span class="truncate text-[12.5px] font-semibold">{{ paper.name }} {{ paper.gsm }}</span>
            <Check v-if="paper.on" class="h-4 w-4 shrink-0" :stroke-width="3" />
          </button>
        </div>
      </div>

      <label class="block max-w-[320px]">
        <span class="font-mono text-[9.5px] font-semibold tracking-[0.12em] text-ink-3 uppercase">Printing price per sheet</span>
        <input
          :value="setup.numbers.oneSidePrice ?? ''"
          data-test="setup-print-price"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          class="mt-1 w-full rounded-xl border border-line bg-card px-3 py-2.5 font-mono text-[15px] font-semibold text-ink outline-none focus:border-brand"
          @input="setNumber('oneSidePrice', ($event.target as HTMLInputElement).value)"
        >
        <span class="mt-1 block text-[11.5px] text-ink-3">What you charge for one printed side, before paper cost.</span>
      </label>

      <label v-if="firstPaper" class="block max-w-[320px]">
        <span class="font-mono text-[9.5px] font-semibold tracking-[0.12em] text-ink-3 uppercase">What {{ firstPaper.name }} costs you</span>
        <input
          :value="firstPaper.paperCost"
          data-test="setup-paper-cost"
          type="number"
          min="0"
          step="0.01"
          class="mt-1 w-full rounded-xl border border-line bg-card px-3 py-2.5 font-mono text-[15px] font-semibold text-ink outline-none focus:border-brand"
          @change="setPaperCost(firstPaper.id, ($event.target as HTMLInputElement).value)"
        >
      </label>

      <div class="rounded-xl border border-line bg-paper-2 px-4 py-3" data-test="setup-price-preview">
        <p class="font-mono text-[9px] font-semibold tracking-[0.1em] text-ink-3 uppercase">{{ bundle.preview.sampleLabel }}</p>
        <p v-for="line in bundle.preview.lines" :key="line.label" class="mt-1 flex justify-between gap-3 text-[12.5px] text-ink-2">
          <span>{{ line.label }}</span>
          <span class="font-mono font-semibold text-ink">{{ line.amountLabel }}</span>
        </p>
      </div>
    </div>

    <div v-else data-test="setup-step-confirm" class="flex flex-col gap-3">
      <dl class="rounded-2xl border border-line bg-card p-4 text-[12.5px]">
        <div class="flex justify-between gap-3 py-1"><dt class="text-ink-3">Shop</dt><dd class="font-semibold text-ink">{{ shopForm.name || '—' }}</dd></div>
        <div class="flex justify-between gap-3 py-1"><dt class="text-ink-3">Machine</dt><dd class="font-semibold text-ink">{{ firstMachine?.name || '—' }}</dd></div>
        <div class="flex justify-between gap-3 py-1"><dt class="text-ink-3">Standard turnaround</dt><dd class="font-semibold text-ink">{{ shopForm.turnaround || '—' }} business hours</dd></div>
        <div class="flex justify-between gap-3 py-1"><dt class="text-ink-3">Papers</dt><dd class="font-semibold text-ink">{{ onPapers.length }}</dd></div>
        <div class="flex justify-between gap-3 py-1"><dt class="text-ink-3">Printing price</dt><dd class="font-semibold text-ink">{{ setup.numbers.oneSidePrice ?? '—' }} per sheet</dd></div>
      </dl>
      <div
        v-if="status?.setup_status?.is_confirmed"
        data-test="setup-live"
        class="rounded-xl border border-green/40 bg-green-soft px-4 py-3 text-[13px] font-semibold text-green"
      >
        You are live to managers.
      </div>
      <p v-if="confirmError" data-test="setup-confirm-error" class="text-[12px] text-red">{{ confirmError }}</p>
    </div>

    <p v-if="saveError" data-test="setup-save-error" class="text-[12px] text-red">{{ saveError }}</p>

    <button
      type="button"
      data-test="setup-advanced-toggle"
      class="inline-flex min-h-[40px] items-center gap-1.5 self-start font-mono text-[10px] font-semibold tracking-[0.1em] text-ink-3 uppercase hover:text-ink"
      :aria-expanded="advanced"
      @click="advanced = !advanced"
    >
      <Table2 class="h-3.5 w-3.5" /> {{ advanced ? 'Hide advanced table' : 'Advanced table' }}
      <ChevronDown class="h-3.5 w-3.5 transition-transform" :class="advanced && 'rotate-180'" />
    </button>

    <div v-if="advanced" data-test="setup-advanced-table" class="flex flex-col gap-4">
      <div class="overflow-hidden rounded-2xl border border-line bg-card">
        <div class="overflow-x-auto">
          <table class="w-full min-w-[680px] border-collapse text-left">
            <thead>
              <tr class="border-b border-line bg-paper-2/60">
                <th v-for="heading in ['Paper', 'Cost', 'Print 1s', 'Total 1s', 'On']" :key="heading" class="px-3 py-2.5 font-mono text-[9.5px] font-semibold tracking-[0.12em] text-ink-3 uppercase">{{ heading }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="paper in setup.papers" :key="paper.id" class="border-b border-line/60 last:border-b-0">
                <td class="px-3 py-2 text-[12.5px] font-medium">{{ paper.name }} {{ paper.gsm }}</td>
                <td class="px-3 py-2">
                  <input type="number" :value="paper.paperCost" class="tabular w-20 rounded-lg border border-line bg-paper px-2 py-1 text-right font-mono text-[12px] focus:border-brand focus:outline-none" @change="setPaperCost(paper.id, ($event.target as HTMLInputElement).value)">
                </td>
                <td class="tabular px-3 py-2 text-right font-mono text-[12px]">{{ paper.derived.print1s }}</td>
                <td class="tabular px-3 py-2 text-right font-mono text-[12px] font-semibold">{{ paper.derived.total1s }}</td>
                <td class="px-3 py-2">
                  <button type="button" class="flex h-5 w-9 cursor-pointer items-center rounded-full p-0.5" :class="paper.on ? 'bg-brand' : 'bg-line'" @click="togglePaper(paper.id)">
                    <span class="h-4 w-4 rounded-full bg-white transition-transform" :class="paper.on && 'translate-x-4'" />
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
              <th v-for="heading in ['Finishing', 'Rate', 'Minimum']" :key="heading" class="px-3 py-2.5 font-mono text-[9.5px] font-semibold tracking-[0.12em] text-ink-3 uppercase">{{ heading }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="service in setup.services" :key="service.id" class="border-b border-line/60 last:border-b-0">
              <td class="px-3 py-2 text-[12.5px] font-medium">{{ service.name }}</td>
              <td class="px-3 py-2">
                <input type="number" :value="service.rate" class="tabular w-20 rounded-lg border border-line bg-paper px-2 py-1 text-right font-mono text-[12px] focus:border-brand focus:outline-none" @change="setService('rate', service.id, ($event.target as HTMLInputElement).value)">
              </td>
              <td class="px-3 py-2">
                <input type="number" :value="service.minimum" class="tabular w-20 rounded-lg border border-line bg-paper px-2 py-1 text-right font-mono text-[12px] focus:border-brand focus:outline-none" @change="setService('minimum', service.id, ($event.target as HTMLInputElement).value)">
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <button type="button" class="inline-flex min-h-[40px] items-center gap-2 self-start rounded-xl border border-line-strong bg-card px-3 text-[12px] font-semibold text-ink" @click="saveRateCard">
        <Loader2 v-if="saveState === 'saving'" class="h-3.5 w-3.5 animate-spin" />
        Save advanced edits
      </button>
    </div>

    <div class="mt-2 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
      <button type="button" :disabled="step === 1" data-test="setup-back" class="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-line-strong px-4 text-[13.5px] font-medium disabled:opacity-40" @click="previous">
        <ArrowLeft class="h-4 w-4" /> Back
      </button>
      <button
        type="button"
        data-test="setup-next"
        class="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl bg-ink px-5 text-[13.5px] font-semibold text-paper hover:bg-brand-deep disabled:opacity-50"
        :disabled="saveState === 'saving'"
        @click="next"
      >
        <Loader2 v-if="saveState === 'saving'" class="h-4 w-4 animate-spin" />
        <template v-else>
          {{ step === 5 ? (status?.setup_status?.is_confirmed ? 'Back to my shop' : 'Confirm my setup') : 'Save and continue' }}
          <ArrowRight class="h-4 w-4" />
        </template>
      </button>
    </div>
  </div>
</template>
