<template>
  <div class="rounded-2xl border p-4" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
    <div class="flex items-center gap-2">
      <UserPlus :size="13" style="color: var(--accent)" />
      <ML>Add a client</ML>
    </div>
    <p class="mt-1.5 text-[11.5px] leading-relaxed text-[var(--sub)]">
      Enter the client's name and phone to start a request on their behalf. A phone number is
      enough — the client needs no email or account.
    </p>

    <form class="mt-3 grid gap-3 sm:grid-cols-2" @submit.prevent="submit">
      <label class="block">
        <span class="font-mono2 text-[9px] uppercase tracking-[0.12em] text-[var(--sub)]">Client name</span>
        <input
          v-model="name"
          type="text"
          autocomplete="name"
          placeholder="Full name"
          class="mt-1 w-full rounded-xl border px-3 py-2 text-[13px]"
          :style="fieldStyle"
          data-test="client-name"
        />
      </label>
      <label class="block">
        <span class="font-mono2 text-[9px] uppercase tracking-[0.12em] text-[var(--sub)]">Phone</span>
        <input
          v-model="phone"
          type="tel"
          autocomplete="tel"
          placeholder="07XX XXX XXX"
          class="mt-1 w-full rounded-xl border px-3 py-2 text-[13px]"
          :style="fieldStyle"
          data-test="client-phone"
        />
      </label>
      <label class="block sm:col-span-2">
        <span class="font-mono2 text-[9px] uppercase tracking-[0.12em] text-[var(--sub)]">Email (optional)</span>
        <input
          v-model="email"
          type="email"
          autocomplete="email"
          placeholder="name@example.com"
          class="mt-1 w-full rounded-xl border px-3 py-2 text-[13px]"
          :style="fieldStyle"
          data-test="client-email"
        />
      </label>

      <div class="sm:col-span-2 mt-1 border-t pt-3" :style="{ borderColor: 'var(--line)' }">
        <p class="font-mono2 text-[9px] uppercase tracking-[0.14em] text-[var(--sub)]">Job details</p>
        <p class="mt-1 text-[11px] leading-snug text-[var(--sub)]">
          Enough to price the job now — the quote is calculated from these specs.
        </p>
      </div>

      <label class="block">
        <span class="font-mono2 text-[9px] uppercase tracking-[0.12em] text-[var(--sub)]">Product</span>
        <select
          v-model="productType"
          class="mt-1 w-full rounded-xl border px-3 py-2 text-[13px]"
          :style="fieldStyle"
          data-test="client-product"
        >
          <option value="business_card">Business cards</option>
          <option value="flyer">Flyers</option>
          <option value="poster">Posters</option>
          <option value="brochure">Brochures</option>
          <option value="letterhead">Letterheads</option>
          <option value="sticker">Stickers</option>
        </select>
      </label>
      <label class="block">
        <span class="font-mono2 text-[9px] uppercase tracking-[0.12em] text-[var(--sub)]">Quantity</span>
        <input
          v-model="quantity"
          type="number"
          min="1"
          inputmode="numeric"
          placeholder="e.g. 500"
          class="mt-1 w-full rounded-xl border px-3 py-2 text-[13px]"
          :style="fieldStyle"
          data-test="client-quantity"
        />
      </label>
      <label class="block">
        <span class="font-mono2 text-[9px] uppercase tracking-[0.12em] text-[var(--sub)]">Width (mm)</span>
        <input
          v-model="widthMm"
          type="number"
          min="1"
          inputmode="numeric"
          placeholder="90"
          class="mt-1 w-full rounded-xl border px-3 py-2 text-[13px]"
          :style="fieldStyle"
          data-test="client-width"
        />
      </label>
      <label class="block">
        <span class="font-mono2 text-[9px] uppercase tracking-[0.12em] text-[var(--sub)]">Height (mm)</span>
        <input
          v-model="heightMm"
          type="number"
          min="1"
          inputmode="numeric"
          placeholder="55"
          class="mt-1 w-full rounded-xl border px-3 py-2 text-[13px]"
          :style="fieldStyle"
          data-test="client-height"
        />
      </label>
      <label class="block">
        <span class="font-mono2 text-[9px] uppercase tracking-[0.12em] text-[var(--sub)]">Paper (gsm)</span>
        <input
          v-model="gsm"
          type="number"
          min="1"
          inputmode="numeric"
          placeholder="350"
          class="mt-1 w-full rounded-xl border px-3 py-2 text-[13px]"
          :style="fieldStyle"
          data-test="client-gsm"
        />
      </label>
      <label class="block">
        <span class="font-mono2 text-[9px] uppercase tracking-[0.12em] text-[var(--sub)]">Paper type</span>
        <input
          v-model="paperCategory"
          type="text"
          placeholder="e.g. matt art card"
          class="mt-1 w-full rounded-xl border px-3 py-2 text-[13px]"
          :style="fieldStyle"
          data-test="client-paper"
        />
      </label>
      <label class="block">
        <span class="font-mono2 text-[9px] uppercase tracking-[0.12em] text-[var(--sub)]">Sides</span>
        <select
          v-model="printSides"
          class="mt-1 w-full rounded-xl border px-3 py-2 text-[13px]"
          :style="fieldStyle"
          data-test="client-sides"
        >
          <option value="DUPLEX">Double sided</option>
          <option value="SIMPLEX">Single sided</option>
        </select>
      </label>
      <label class="block">
        <span class="font-mono2 text-[9px] uppercase tracking-[0.12em] text-[var(--sub)]">Color</span>
        <select
          v-model="colorMode"
          class="mt-1 w-full rounded-xl border px-3 py-2 text-[13px]"
          :style="fieldStyle"
          data-test="client-color"
        >
          <option value="COLOR">Full color</option>
          <option value="BW">Black &amp; white</option>
        </select>
      </label>
      <label class="block sm:col-span-2">
        <span class="font-mono2 text-[9px] uppercase tracking-[0.12em] text-[var(--sub)]">Finishing / notes</span>
        <input
          v-model="clientNotes"
          type="text"
          placeholder="e.g. Matt lamination, round corners"
          class="mt-1 w-full rounded-xl border px-3 py-2 text-[13px]"
          :style="fieldStyle"
          data-test="client-notes"
        />
      </label>

      <label class="flex items-start gap-2.5 sm:col-span-2" data-test="contact-permission">
        <input
          v-model="contactPermitted"
          type="checkbox"
          class="mt-0.5 h-4 w-4 shrink-0"
          style="accent-color: var(--accent)"
          data-test="contact-checkbox"
        />
        <span class="text-[12px] leading-snug text-[var(--ink)]">
          I confirm this client has given permission to be contacted about this job.
          <span class="text-[var(--sub)]">They can opt out at any time.</span>
        </span>
      </label>

      <DesignAlert v-if="error" tone="error" class="sm:col-span-2" data-test="add-client-error">
        {{ error }}
      </DesignAlert>

      <div class="sm:col-span-2">
        <button
          type="submit"
          class="press-key inline-flex items-center gap-2 rounded-xl px-4 py-2.5 font-mono2 text-[10px] font-bold uppercase tracking-[0.12em] disabled:opacity-50"
          :style="{ background: 'var(--accent)', color: 'var(--accentInk)' }"
          :disabled="busy || !canSubmit"
          data-test="add-client-submit"
        >
          <Loader2 v-if="busy" :size="12" class="animate-spin" /> <UserPlus v-else :size="12" />
          Start request for client
        </button>
        <p v-if="!contactPermitted" class="mt-2 text-[11px] leading-snug text-[var(--sub)]" data-test="permission-hint">
          Tick the permission box to continue — law 10.5 requires it.
        </p>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Loader2, UserPlus } from 'lucide-vue-next'
import DesignAlert from '~/components/design/ui/Alert.vue'
import { useManagerStore } from '~/stores/manager'
import type { ManagerClientRequestResult } from '~/shared/types'

const emit = defineEmits<{ created: [ManagerClientRequestResult] }>()

const m = useManagerStore()

const name = ref('')
const phone = ref('')
const email = ref('')
const contactPermitted = ref(false)
const busy = ref(false)
const error = ref('')

const productType = ref('business_card')
const quantity = ref('500')
const widthMm = ref('90')
const heightMm = ref('55')
const gsm = ref('350')
const paperCategory = ref('matt art card')
const printSides = ref('DUPLEX')
const colorMode = ref('COLOR')
const clientNotes = ref('')

const fieldStyle = { borderColor: 'var(--line)', background: 'var(--panel2)', color: 'var(--ink)' }

const canSubmit = computed(() => Boolean(
  name.value.trim()
  && phone.value.trim()
  && contactPermitted.value
  && Number(quantity.value) > 0,
))

function requestDetails(): Record<string, unknown> {
  const details: Record<string, unknown> = {
    product_type: productType.value,
    quantity: Number(quantity.value) || undefined,
    print_sides: printSides.value,
    color_mode: colorMode.value,
  }
  if (Number(widthMm.value) > 0 && Number(heightMm.value) > 0) {
    details.width_mm = Number(widthMm.value)
    details.height_mm = Number(heightMm.value)
    details.finished_size = `${widthMm.value}x${heightMm.value}mm`
  }
  if (Number(gsm.value) > 0) details.requested_gsm = Number(gsm.value)
  if (paperCategory.value.trim()) details.requested_paper_category = paperCategory.value.trim()
  const notes = clientNotes.value.trim()
  if (notes) {
    details.custom_brief = notes
    const lower = notes.toLowerCase()
    if (lower.includes('lamination')) details.lamination = 'matte_lamination'
    if (lower.includes('round')) details.finishing = ['round_corner']
  }
  return details
}

async function submit() {
  error.value = ''
  if (!name.value.trim()) {
    error.value = "Enter the client's name."
    return
  }
  if (!phone.value.trim()) {
    error.value = "Enter the client's phone number."
    return
  }
  if (!(Number(quantity.value) > 0)) {
    error.value = "Enter how many pieces the client needs."
    return
  }
  if (!contactPermitted.value) {
    error.value = "Confirm you have the client's permission to contact them."
    return
  }
  busy.value = true
  try {
    const result = await m.createClientRequest({
      name: name.value.trim(),
      phone: phone.value.trim(),
      contact_permitted: contactPermitted.value,
      email: email.value.trim(),
      notes: clientNotes.value.trim(),
      details: requestDetails(),
    })
    if (!result) {
      error.value = m.error || "We couldn't create that client's request."
      return
    }
    name.value = ''
    phone.value = ''
    email.value = ''
    contactPermitted.value = false
    clientNotes.value = ''
    emit('created', result)
  } finally {
    busy.value = false
  }
}
</script>
