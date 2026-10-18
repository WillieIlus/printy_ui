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

      <p v-if="error" class="sm:col-span-2 rounded-xl px-3 py-2 text-[12px]" :style="{ background: 'rgba(200,30,68,.1)', color: '#C81E44' }" data-test="add-client-error">
        {{ error }}
      </p>
      <p v-if="note" class="sm:col-span-2 rounded-xl px-3 py-2 text-[12px]" :style="{ background: 'rgba(14,122,69,.1)', color: '#0E7A45' }" data-test="add-client-note">
        {{ note }}
      </p>

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
const note = ref('')

const fieldStyle = { borderColor: 'var(--line)', background: 'var(--panel2)', color: 'var(--ink)' }

const canSubmit = computed(() => Boolean(name.value.trim() && phone.value.trim() && contactPermitted.value))

async function submit() {
  error.value = ''
  note.value = ''
  if (!name.value.trim()) {
    error.value = "Enter the client's name."
    return
  }
  if (!phone.value.trim()) {
    error.value = "Enter the client's phone number."
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
    })
    if (!result) {
      error.value = m.error || "We couldn't create that client's request."
      return
    }
    note.value = `Request ${result.request_reference || result.code || result.quote_request_id} started for ${result.client_name || name.value.trim()}.`
    name.value = ''
    phone.value = ''
    email.value = ''
    contactPermitted.value = false
    emit('created', result)
  } finally {
    busy.value = false
  }
}
</script>
