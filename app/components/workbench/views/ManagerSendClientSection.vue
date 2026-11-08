<template>
  <section
    data-test="send-client-section"
    class="rounded-2xl border p-4"
    :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }"
  >
    <div class="flex flex-wrap items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <UserPlus :size="13" style="color: var(--accent)" />
        <ML>Client</ML>
      </div>
      <!-- The server decides whether this phone is already a Printy client. When it
           is, we say so and never offer to claim them: they already have an account,
           so the quote is simply linked to it. -->
      <span
        v-if="lookup?.status === 'existing_client'"
        data-test="existing-client-badge"
        class="rounded-full px-2.5 py-[3px] font-mono2 text-[9px] font-bold uppercase tracking-[0.12em]"
        :style="{ background: 'color-mix(in srgb, var(--accent) 14%, transparent)', color: 'var(--accent)' }"
      >
        Existing Printy client
      </span>
    </div>

    <p class="mt-1.5 text-[11.5px] leading-relaxed text-[var(--sub)]">
      The name and WhatsApp number are what create the client. Email is optional — the client never needs a
      password from you.
    </p>

    <div class="mt-3 grid gap-3 sm:grid-cols-2">
      <label class="block">
        <span class="font-mono2 text-[9px] uppercase tracking-[0.12em] text-[var(--sub)]">Client name</span>
        <input
          :value="name"
          type="text"
          autocomplete="name"
          placeholder="Full name"
          data-test="send-client-name"
          class="mt-1 w-full rounded-xl border px-3 py-2 text-[13px]"
          :style="fieldStyle"
          @input="emit('update:name', ($event.target as HTMLInputElement).value)"
        />
      </label>
      <label class="block">
        <span class="font-mono2 text-[9px] uppercase tracking-[0.12em] text-[var(--sub)]">Phone / WhatsApp</span>
        <input
          :value="phone"
          type="tel"
          autocomplete="tel"
          placeholder="07XX XXX XXX"
          data-test="send-client-phone"
          class="mt-1 w-full rounded-xl border px-3 py-2 text-[13px]"
          :style="fieldStyle"
          @input="onPhoneInput(($event.target as HTMLInputElement).value)"
        />
      </label>
      <label class="block sm:col-span-2">
        <span class="font-mono2 text-[9px] uppercase tracking-[0.12em] text-[var(--sub)]">Email (optional)</span>
        <input
          :value="email"
          type="email"
          autocomplete="email"
          placeholder="name@example.com"
          data-test="send-client-email"
          class="mt-1 w-full rounded-xl border px-3 py-2 text-[13px]"
          :style="fieldStyle"
          @input="emit('update:email', ($event.target as HTMLInputElement).value)"
        />
      </label>
    </div>

    <p
      v-if="lookup?.status === 'existing_client'"
      data-test="existing-client-note"
      class="mt-2.5 text-[11.5px] leading-snug text-[var(--sub)]"
    >
      Already on Printy. This quote is linked to their existing account — there is nobody to claim.
    </p>
    <p
      v-else-if="lookup?.status === 'not_a_client'"
      data-test="partner-phone-note"
      class="mt-2.5 text-[11.5px] leading-snug text-amber"
    >
      That number belongs to a Printy partner account, not a client. Use the client's own number.
    </p>
    <p
      v-else-if="lookup?.status === 'new_client'"
      data-test="new-client-note"
      class="mt-2.5 text-[11.5px] leading-snug text-[var(--sub)]"
    >
      New client — sending creates their client record and a claim link you can pass on.
    </p>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { UserPlus } from 'lucide-vue-next'
import { useManagerStore } from '~/stores/manager'
import type { PartnerClientLookupResult } from '~/shared/types'

const props = withDefaults(
  defineProps<{
    name: string
    phone: string
    email: string
    disabled?: boolean
  }>(),
  { disabled: false },
)

const emit = defineEmits<{
  'update:name': [value: string]
  'update:phone': [value: string]
  'update:email': [value: string]
}>()

const m = useManagerStore()

const fieldStyle = { borderColor: 'var(--line)', background: 'var(--panel2)', color: 'var(--ink)' }

const lookup = ref<PartnerClientLookupResult | null>(null)
let timer: ReturnType<typeof setTimeout> | null = null
let requestToken = 0

/** Only a plausible Kenyan mobile number is worth a round trip. */
function looksLikePhone(value: string): boolean {
  const digits = value.replace(/\D/g, '')
  return digits.length >= 9
}

function clearTimer() {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
}

function onPhoneInput(value: string) {
  emit('update:phone', value)
  lookup.value = null
  clearTimer()
  if (!looksLikePhone(value)) return
  // Debounced so typing a number does not ask the server on every keystroke.
  timer = setTimeout(() => {
    void runLookup(value)
  }, 400)
}

async function runLookup(value: string) {
  const token = ++requestToken
  const result = await m.lookupPartnerClient(value)
  // A later keystroke wins; never paint a stale answer.
  if (token !== requestToken) return
  lookup.value = result
}

watch(
  () => props.phone,
  (value) => {
    if (!value || lookup.value) return
    if (looksLikePhone(value)) void runLookup(value)
  },
)

onBeforeUnmount(clearTimer)

defineExpose({ lookup })
</script>
