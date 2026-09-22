<template>
  <div class="mx-auto w-full max-w-[1080px] px-4 pb-28 pt-8 sm:px-6">
    <NuxtLink
      to="/app/printer"
      class="mb-3 inline-flex items-center gap-1.5 font-mono2 text-[10px] uppercase tracking-[0.16em] text-[var(--sub)] transition-colors hover:text-[var(--accent)]"
    >
      <ArrowLeft :size="12" /> Back to the floor
    </NuxtLink>
    <div class="flex items-center gap-2 font-mono2 text-[10px] uppercase tracking-[0.22em] text-[var(--sub)]">
      <Store :size="12" style="color: var(--accent)" /> shop setup
    </div>
    <h1 class="mt-2 font-disp text-[30px] font-bold leading-tight tracking-tight sm:text-[36px]">
      Your shop, your stock, your machines.
    </h1>
    <p class="mt-2 max-w-[58ch] text-[13.5px] leading-relaxed text-[var(--sub)]">
      Keep your profile, paper stock, finishing services and presses up to date. These feed every
      quote and production match Printy builds for you.
    </p>

    <div class="mt-6 flex flex-wrap items-center gap-3">
      <select
        v-if="shop.shops.length > 1"
        :value="shop.activeSlug"
        class="rounded-xl border px-3 py-2 font-mono2 text-[11px]"
        :style="{ borderColor: 'var(--line)', background: 'var(--panel)', color: 'var(--ink)' }"
        @change="onShopChange"
      >
        <option v-for="s in shop.shops" :key="s.slug" :value="s.slug">{{ s.name || s.slug }}</option>
      </select>
    </div>

    <!-- tabs -->
    <div class="mt-6 flex flex-wrap gap-1.5 border-b pb-3" :style="{ borderColor: 'var(--line)' }">
      <button
        v-for="t in tabs"
        :key="t.id"
        class="press-key flex items-center gap-2 rounded-xl px-4 py-2.5 font-mono2 text-[10.5px] font-semibold uppercase tracking-[0.12em] transition-colors"
        :style="{ background: tab === t.id ? 'var(--accent)' : 'var(--panel)', color: tab === t.id ? 'var(--accentInk)' : 'var(--sub)' }"
        @click="tab = t.id"
      >
        <component :is="t.icon" :size="13" /> {{ t.label }}
        <span class="rounded-full px-1.5 py-[1px] text-[9px]" :style="{ background: tab === t.id ? 'rgba(0,0,0,.18)' : 'var(--panel2)' }">{{ t.count }}</span>
      </button>
    </div>

    <div v-if="shop.loading && !shop.hasShop" class="mt-14 flex flex-col items-center gap-3 text-[var(--sub)]">
      <Loader2 :size="22" class="animate-spin" :style="{ color: 'var(--accent)' }" />
      <span class="font-mono2 text-[10px] uppercase tracking-[0.18em]">Loading your shop…</span>
    </div>

    <div v-else-if="!shop.hasShop" class="mt-14 flex flex-col items-center gap-3 rounded-2xl border p-8 text-center" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
      <Store :size="22" style="color: var(--accent)" />
      <p class="max-w-[46ch] text-[13px] leading-relaxed text-[var(--sub)]">
        No shop is linked to this account yet. Complete the rate-card onboarding first — Printy will
        create your shop automatically.
      </p>
      <NuxtLink to="/app/printer/rates" class="press-key mt-1 inline-flex items-center gap-2 rounded-xl px-4 py-2 font-mono2 text-[10px] font-semibold uppercase tracking-[0.14em]" :style="{ background: 'var(--accent)', color: 'var(--accentInk)' }">
        <Coins :size="12" /> Set up my rate card
      </NuxtLink>
    </div>

    <template v-else>
      <p v-if="errorText" class="mt-5 rounded-xl border px-4 py-3 text-[12.5px]" :style="{ borderColor: 'rgba(251,77,109,.4)', background: 'rgba(251,77,109,.08)', color: '#FB4D6D' }">
        {{ errorText }}
      </p>
      <p v-if="savedText" class="mt-5 flex items-center gap-2 rounded-xl border px-4 py-3 text-[12.5px]" :style="{ borderColor: 'rgba(47,191,113,.4)', background: 'rgba(47,191,113,.08)', color: '#2FBF71' }">
        <Check :size="13" /> {{ savedText }}
      </p>

      <!-- PROFILE -->
      <section v-if="tab === 'profile'" class="mt-6 space-y-4">
        <div class="grid gap-3 sm:grid-cols-2">
          <label v-for="f in profileFields" :key="f.key" class="block">
            <span class="font-mono2 text-[9.5px] uppercase tracking-[0.14em] text-[var(--sub)]">{{ f.label }}</span>
            <input
              v-if="f.type !== 'textarea'"
              v-model="profileForm[f.key]"
              :type="f.type"
              class="mt-1 w-full rounded-xl border px-3 py-2.5 text-[13px] outline-none focus:border-[var(--accent)]"
              :style="{ borderColor: 'var(--line)', background: 'var(--panel)', color: 'var(--ink)' }"
            />
            <textarea
              v-else
              v-model="profileForm[f.key]"
              rows="3"
              class="mt-1 w-full rounded-xl border px-3 py-2.5 text-[13px] outline-none focus:border-[var(--accent)]"
              :style="{ borderColor: 'var(--line)', background: 'var(--panel)', color: 'var(--ink)' }"
            />
          </label>
        </div>
        <button class="press-key inline-flex items-center gap-2 rounded-xl px-5 py-3 font-mono2 text-[10.5px] font-bold uppercase tracking-[0.14em] disabled:opacity-50" :style="{ background: 'var(--accent)', color: 'var(--accentInk)' }" :disabled="shop.saving" @click="saveProfile">
          <Loader2 v-if="shop.saving" :size="13" class="animate-spin" /> <Save v-else :size="13" /> Save profile
        </button>
      </section>

      <!-- PAPER -->
      <section v-else-if="tab === 'paper'" class="mt-6 space-y-3">
        <div v-for="paper in shop.papers" :key="paper.id" class="rounded-2xl border p-4" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
          <div class="flex flex-wrap items-center gap-2">
            <input v-model="paper.name" class="min-w-[140px] flex-1 rounded-lg border px-2.5 py-1.5 text-[13px] font-semibold" :style="fieldStyle" />
            <span class="font-mono2 text-[10px] uppercase tracking-[0.12em] text-[var(--sub)]">{{ paper.display_name }}</span>
            <span class="ml-auto flex items-center gap-1.5">
              <button class="rounded-lg border px-2 py-1 font-mono2 text-[12px]" :style="fieldStyle" @click="adjust(paper, -100)">−100</button>
              <button class="rounded-lg border px-2 py-1 font-mono2 text-[12px]" :style="fieldStyle" @click="adjust(paper, 100)">+100</button>
              <span class="font-mono2 text-[12px] font-semibold" :style="{ color: 'var(--accent)' }">{{ paper.quantity_in_stock }}</span>
            </span>
          </div>
          <div class="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <label v-for="f in paperFields" :key="f.key" class="block">
              <span class="font-mono2 text-[8.5px] uppercase tracking-[0.12em] text-[var(--sub)]">{{ f.label }}</span>
              <input v-model="paper[f.key]" :type="f.type" class="mt-1 w-full rounded-lg border px-2.5 py-1.5 text-[12.5px]" :style="fieldStyle" />
            </label>
            <label class="mt-4 flex items-center gap-2">
              <input v-model="paper.is_active" type="checkbox" />
              <span class="font-mono2 text-[9.5px] uppercase tracking-[0.12em] text-[var(--sub)]">active</span>
            </label>
          </div>
          <div class="mt-3 flex gap-2">
            <button class="press-key inline-flex items-center gap-1.5 rounded-lg px-3 py-2 font-mono2 text-[9.5px] font-bold uppercase tracking-[0.12em]" :style="{ background: 'var(--accent)', color: 'var(--accentInk)' }" :disabled="shop.saving" @click="savePaper(paper)">
              <Save :size="11" /> Save paper
            </button>
          </div>
        </div>

        <div class="rounded-2xl border-2 border-dashed p-4" :style="{ borderColor: 'var(--accent)', background: 'var(--panel)' }">
          <ML>Add a paper</ML>
          <div class="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <label v-for="f in newPaperFields" :key="f.key" class="block">
              <span class="font-mono2 text-[8.5px] uppercase tracking-[0.12em] text-[var(--sub)]">{{ f.label }}</span>
              <input v-model="newPaper[f.key]" :type="f.type" class="mt-1 w-full rounded-lg border px-2.5 py-1.5 text-[12.5px]" :style="fieldStyle" />
            </label>
          </div>
          <button class="press-key mt-3 inline-flex items-center gap-1.5 rounded-lg px-4 py-2 font-mono2 text-[9.5px] font-bold uppercase tracking-[0.12em]" :style="{ background: 'var(--accent)', color: 'var(--accentInk)' }" :disabled="shop.saving" @click="addPaper">
            <Plus :size="11" /> Add paper
          </button>
        </div>
      </section>

      <!-- FINISHINGS -->
      <section v-else-if="tab === 'finishings'" class="mt-6 space-y-3">
        <div v-for="rate in shop.finishings" :key="rate.id" class="rounded-2xl border p-4" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
          <div class="flex flex-wrap items-center gap-2">
            <input v-model="rate.name" class="min-w-[140px] flex-1 rounded-lg border px-2.5 py-1.5 text-[13px] font-semibold" :style="fieldStyle" />
            <span class="ml-auto font-mono2 text-[11px] font-semibold" :style="{ color: 'var(--accent)' }">{{ rate.client_price }}</span>
          </div>
          <div class="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <label v-for="f in finishingFields" :key="f.key" class="block">
              <span class="font-mono2 text-[8.5px] uppercase tracking-[0.12em] text-[var(--sub)]">{{ f.label }}</span>
              <select v-if="f.options" v-model="rate[f.key]" class="mt-1 w-full rounded-lg border px-2.5 py-1.5 text-[12.5px]" :style="fieldStyle">
                <option v-for="opt in f.options" :key="opt" :value="opt">{{ opt }}</option>
              </select>
              <input v-else v-model="rate[f.key]" :type="f.type" class="mt-1 w-full rounded-lg border px-2.5 py-1.5 text-[12.5px]" :style="fieldStyle" />
            </label>
            <label class="mt-4 flex items-center gap-2">
              <input v-model="rate.is_active" type="checkbox" />
              <span class="font-mono2 text-[9.5px] uppercase tracking-[0.12em] text-[var(--sub)]">active</span>
            </label>
          </div>
          <button class="press-key mt-3 inline-flex items-center gap-1.5 rounded-lg px-3 py-2 font-mono2 text-[9.5px] font-bold uppercase tracking-[0.12em]" :style="{ background: 'var(--accent)', color: 'var(--accentInk)' }" :disabled="shop.saving" @click="saveFinishing(rate)">
            <Save :size="11" /> Save rate
          </button>
        </div>

        <div class="rounded-2xl border-2 border-dashed p-4" :style="{ borderColor: 'var(--accent)', background: 'var(--panel)' }">
          <ML>Add a finishing service</ML>
          <div class="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <label v-for="f in newFinishingFields" :key="f.key" class="block">
              <span class="font-mono2 text-[8.5px] uppercase tracking-[0.12em] text-[var(--sub)]">{{ f.label }}</span>
              <select v-if="f.options" v-model="newFinishing[f.key]" class="mt-1 w-full rounded-lg border px-2.5 py-1.5 text-[12.5px]" :style="fieldStyle">
                <option v-for="opt in f.options" :key="opt" :value="opt">{{ opt }}</option>
              </select>
              <input v-else v-model="newFinishing[f.key]" :type="f.type" class="mt-1 w-full rounded-lg border px-2.5 py-1.5 text-[12.5px]" :style="fieldStyle" />
            </label>
          </div>
          <button class="press-key mt-3 inline-flex items-center gap-1.5 rounded-lg px-4 py-2 font-mono2 text-[9.5px] font-bold uppercase tracking-[0.12em]" :style="{ background: 'var(--accent)', color: 'var(--accentInk)' }" :disabled="shop.saving" @click="addFinishing">
            <Plus :size="11" /> Add finishing
          </button>
        </div>
      </section>

      <!-- MACHINES -->
      <section v-else class="mt-6 space-y-3">
        <div v-for="machine in shop.machines" :key="machine.id" class="rounded-2xl border p-4" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
          <div class="flex flex-wrap items-center gap-2">
            <input v-model="machine.name" class="min-w-[140px] flex-1 rounded-lg border px-2.5 py-1.5 text-[13px] font-semibold" :style="fieldStyle" />
            <span class="font-mono2 text-[10px] uppercase tracking-[0.12em] text-[var(--sub)]">{{ machine.machine_type }}</span>
          </div>
          <div class="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <label v-for="f in machineFields" :key="f.key" class="block">
              <span class="font-mono2 text-[8.5px] uppercase tracking-[0.12em] text-[var(--sub)]">{{ f.label }}</span>
              <input v-model="machine[f.key]" :type="f.type" class="mt-1 w-full rounded-lg border px-2.5 py-1.5 text-[12.5px]" :style="fieldStyle" />
            </label>
            <label class="mt-4 flex items-center gap-2">
              <input v-model="machine.is_active" type="checkbox" />
              <span class="font-mono2 text-[9.5px] uppercase tracking-[0.12em] text-[var(--sub)]">active</span>
            </label>
          </div>
          <button class="press-key mt-3 inline-flex items-center gap-1.5 rounded-lg px-3 py-2 font-mono2 text-[9.5px] font-bold uppercase tracking-[0.12em]" :style="{ background: 'var(--accent)', color: 'var(--accentInk)' }" :disabled="shop.saving" @click="saveMachine(machine)">
            <Save :size="11" /> Save machine
          </button>
        </div>

        <div class="rounded-2xl border-2 border-dashed p-4" :style="{ borderColor: 'var(--accent)', background: 'var(--panel)' }">
          <ML>Add a machine</ML>
          <div class="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <label v-for="f in newMachineFields" :key="f.key" class="block">
              <span class="font-mono2 text-[8.5px] uppercase tracking-[0.12em] text-[var(--sub)]">{{ f.label }}</span>
              <input v-model="newMachine[f.key]" :type="f.type" class="mt-1 w-full rounded-lg border px-2.5 py-1.5 text-[12.5px]" :style="fieldStyle" />
            </label>
          </div>
          <button class="press-key mt-3 inline-flex items-center gap-1.5 rounded-lg px-4 py-2 font-mono2 text-[9.5px] font-bold uppercase tracking-[0.12em]" :style="{ background: 'var(--accent)', color: 'var(--accentInk)' }" :disabled="shop.saving" @click="addMachine">
            <Plus :size="11" /> Add machine
          </button>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { ArrowLeft, Check, Coins, Layers, Loader2, Plus, Save, Scissors, Store, Wrench } from 'lucide-vue-next'
import { useShopStore } from '~/stores/shop'
import type { ShopFinishingRateRecord, ShopMachineRecord, ShopPaperRecord } from '~/shared/types'

type FieldDef = { key: string; label: string; type: string; options?: string[] }

const shop = useShopStore()

const tab = ref<'profile' | 'paper' | 'finishings' | 'machines'>('profile')
const errorText = ref('')
const savedText = ref('')

const tabs = computed(() => [
  { id: 'profile' as const, label: 'Shop', icon: Store, count: 1 },
  { id: 'paper' as const, label: 'Paper stock', icon: Layers, count: shop.papers.length },
  { id: 'finishings' as const, label: 'Finishings', icon: Scissors, count: shop.finishings.length },
  { id: 'machines' as const, label: 'Machines', icon: Wrench, count: shop.machines.length },
])

const fieldStyle = {
  borderColor: 'var(--line)',
  background: 'var(--panel2)',
  color: 'var(--ink)',
}

const profileFields = [
  { key: 'name', label: 'Shop name', type: 'text' },
  { key: 'phone_number', label: 'Phone', type: 'text' },
  { key: 'public_whatsapp_number', label: 'Public WhatsApp', type: 'text' },
  { key: 'service_area', label: 'Service area', type: 'text' },
  { key: 'city', label: 'City', type: 'text' },
  { key: 'turnaround_statement', label: 'Turnaround', type: 'text' },
  { key: 'opening_hours_text', label: 'Opening hours', type: 'text' },
  { key: 'description', label: 'About your shop', type: 'textarea' },
] as const

const profileForm = reactive<Record<string, string>>({})

const paperFields: FieldDef[] = [
  { key: 'sheet_size', label: 'Sheet size', type: 'text' },
  { key: 'gsm', label: 'GSM', type: 'number' },
  { key: 'paper_type', label: 'Type', type: 'text' },
  { key: 'buying_price', label: 'Buy price', type: 'text' },
  { key: 'selling_price', label: 'Sell price', type: 'text' },
]
const newPaperFields: FieldDef[] = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'sheet_size', label: 'Sheet size', type: 'text' },
  { key: 'gsm', label: 'GSM', type: 'number' },
  { key: 'paper_type', label: 'Type', type: 'text' },
  { key: 'buying_price', label: 'Buy price', type: 'text' },
  { key: 'selling_price', label: 'Sell price', type: 'text' },
]

const finishingFields: FieldDef[] = [
  { key: 'price', label: 'Price', type: 'text' },
  { key: 'charge_unit', label: 'Charge unit', type: 'text', options: ['per_piece', 'per_sheet', 'flat', 'per_side'] },
  { key: 'billing_basis', label: 'Billing basis', type: 'text', options: ['per_piece', 'per_sheet', 'flat_per_job'] },
  { key: 'side_mode', label: 'Sides', type: 'text', options: ['ignore_sides', 'per_selected_side'] },
  { key: 'double_side_price', label: 'Double side', type: 'text' },
  { key: 'setup_fee', label: 'Setup fee', type: 'text' },
  { key: 'minimum_charge', label: 'Min charge', type: 'text' },
  { key: 'min_qty', label: 'Min qty', type: 'number' },
]
const newFinishingFields: FieldDef[] = [
  { key: 'name', label: 'Name', type: 'text' },
  ...finishingFields,
]

const machineFields: FieldDef[] = [
  { key: 'machine_type', label: 'Type', type: 'text' },
  { key: 'max_width_mm', label: 'Max width', type: 'number' },
  { key: 'max_height_mm', label: 'Max height', type: 'number' },
  { key: 'min_gsm', label: 'Min GSM', type: 'number' },
  { key: 'max_gsm', label: 'Max GSM', type: 'number' },
]
const newMachineFields: FieldDef[] = [
  { key: 'name', label: 'Name', type: 'text' },
  ...machineFields,
]

const newPaper = reactive<Record<string, any>>({ name: '', sheet_size: 'A4', gsm: 300, paper_type: 'artcard', buying_price: '0.00', selling_price: '0.00', is_active: true })
const newFinishing = reactive<Record<string, any>>({ name: '', price: '0.00', charge_unit: 'per_piece', billing_basis: 'per_piece', side_mode: 'ignore_sides', double_side_price: null, setup_fee: '0.00', minimum_charge: '0.00', min_qty: 1, is_active: true })
const newMachine = reactive<Record<string, any>>({ name: '', machine_type: 'digital', max_width_mm: 330, max_height_mm: 488, min_gsm: 80, max_gsm: 400, is_active: true })

function syncProfile() {
  const active = shop.active
  if (!active) return
  for (const field of profileFields) {
    profileForm[field.key] = (active as any)[field.key] ?? ''
  }
}

async function onShopChange(event: Event) {
  shop.setActive((event.target as HTMLSelectElement).value)
  syncProfile()
  await Promise.all([shop.fetchPapers(), shop.fetchFinishings(), shop.fetchMachines()])
}

async function run(action: () => Promise<any>, success: string) {
  errorText.value = ''
  savedText.value = ''
  try {
    await action()
    savedText.value = success
    setTimeout(() => { savedText.value = '' }, 2500)
  } catch {
    errorText.value = shop.error
  }
}

function saveProfile() {
  const patch: Record<string, unknown> = {}
  for (const field of profileFields) patch[field.key] = profileForm[field.key]
  return run(() => shop.updateShop(patch as any), 'Shop profile saved.')
}

function savePaper(paper: ShopPaperRecord) {
  return run(
    () => shop.updatePaper(paper.id, paper as any),
    'Paper stock saved.',
  )
}

function addPaper() {
  return run(() => shop.createPaper(newPaper as any), 'Paper added.')
}

function adjust(paper: ShopPaperRecord, delta: number) {
  return run(() => shop.adjustPaper(paper.id, delta), 'Stock adjusted.')
}

function saveFinishing(rate: ShopFinishingRateRecord) {
  return run(() => shop.updateFinishing(rate.id, rate as any), 'Finishing rate saved.')
}

function addFinishing() {
  return run(() => shop.createFinishing(newFinishing as any), 'Finishing service added.')
}

function saveMachine(machine: ShopMachineRecord) {
  return run(() => shop.updateMachine(machine.id, machine as any), 'Machine saved.')
}

function addMachine() {
  return run(() => shop.createMachine(newMachine as any), 'Machine added.')
}

onMounted(async () => {
  await shop.fetchShops()
  syncProfile()
  if (shop.hasShop) {
    await Promise.all([shop.fetchPapers(), shop.fetchFinishings(), shop.fetchMachines()])
  }
})
</script>
