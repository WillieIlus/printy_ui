<template>
  <div class="mx-auto w-full max-w-[560px] px-4 pb-28 pt-10 sm:px-6">
    <div class="flex items-center gap-2 font-mono2 text-[10px] uppercase tracking-[0.22em] text-[var(--sub)]">
      <Ticket :size="12" style="color: var(--accent)" /> Client invite
    </div>
    <h1 class="mt-2 font-disp text-[30px] font-bold leading-tight tracking-tight sm:text-[36px]">
      Claim your Printy account<span class="block text-[var(--sub)]">No email required.</span>
    </h1>
    <p class="mt-3 text-[13.5px] leading-relaxed text-[var(--sub)]">
      Your print manager set this up with your phone number. Choose a password to claim your account — the manager never sees it.
    </p>

    <div v-if="claimed" class="mt-6 rounded-2xl border px-5 py-5" style="border-color: rgba(30,142,82,.35); background: rgba(30,142,82,.08)">
      <div class="flex items-center gap-2 font-disp text-[15px] font-bold" style="color: #1E8E52">
        <CheckCheck :size="16" /> Account ready
      </div>
      <p class="mt-1.5 text-[12.5px] leading-relaxed text-[var(--sub)]">
        You are signed in. Your phone number is verified, and any quotes your manager prepared for it are linked to you.
      </p>
      <NuxtLink
        to="/app/buyer"
        class="press-key mt-4 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-mono2 text-[10.5px] font-bold uppercase tracking-[0.14em] text-white"
        style="background: var(--accent)"
      >
        Open my dashboard <ArrowRight :size="13" />
      </NuxtLink>
    </div>

    <form v-else class="mt-6" @submit.prevent="submit">
      <div v-if="error" class="mb-4 flex items-start gap-2 rounded-2xl px-4 py-3 text-[12.5px]" style="background: rgba(251,77,109,.08); color: #B4243F">
        <AlertCircle :size="14" class="mt-0.5 shrink-0" />
        <p>{{ error }}</p>
      </div>
      <div v-if="!token" class="mb-4 flex items-start gap-2 rounded-2xl px-4 py-3 text-[12.5px]" style="background: rgba(251,77,109,.08); color: #B4243F">
        <AlertCircle :size="14" class="mt-0.5 shrink-0" />
        <p>Open the exact invite link your manager sent — it should include a token.</p>
      </div>

      <ML>Your name <span class="normal-case opacity-60">(optional)</span></ML>
      <input
        v-model="name"
        class="mt-1.5 w-full rounded-xl border bg-transparent px-3 py-2.5 text-[13px]"
        :style="{ borderColor: 'var(--line)' }"
        autocomplete="name"
        placeholder="Full name"
      />

      <div class="mt-3.5">
        <ML>Choose a password</ML>
        <input
          v-model="password"
          type="password"
          class="mt-1.5 w-full rounded-xl border bg-transparent px-3 py-2.5 text-[13px]"
          :style="{ borderColor: 'var(--line)' }"
          autocomplete="new-password"
          placeholder="At least 8 characters"
        />
      </div>
      <div class="mt-3.5">
        <ML>Confirm password</ML>
        <input
          v-model="confirmPassword"
          type="password"
          class="mt-1.5 w-full rounded-xl border bg-transparent px-3 py-2.5 text-[13px]"
          :style="{ borderColor: 'var(--line)' }"
          autocomplete="new-password"
          placeholder="Repeat your password"
        />
      </div>

      <button
        type="submit"
        class="press-key mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-mono2 text-[10.5px] font-bold uppercase tracking-[0.14em] text-white disabled:opacity-60"
        style="background: var(--accent)"
        :disabled="busy || !token || !password || !confirmPassword"
      >
        <Loader2 v-if="busy" :size="13" class="animate-spin" />
        Claim account
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ArrowRight, AlertCircle, CheckCheck, Loader2, Ticket } from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()
const route = useRoute()

const token = computed(() => {
  const value = route.query.token ?? route.query.claim_token
  return typeof value === 'string' ? value.trim() : ''
})
const name = ref('')
const password = ref('')
const confirmPassword = ref('')
const busy = ref(false)
const claimed = ref(false)
const error = ref('')

function message(e: any) {
  return e?.data?.detail ?? e?.message ?? e?.statusMessage ?? 'We could not claim this invite.'
}

async function submit() {
  error.value = ''
  if (!token.value) {
    error.value = 'This invite link is missing its token.'
    return
  }
  if (password.value.length < 8) {
    error.value = 'Choose a password with at least 8 characters.'
    return
  }
  if (password.value !== confirmPassword.value) {
    error.value = 'Those passwords do not match.'
    return
  }
  busy.value = true
  try {
    await auth.claimClientInvite({ token: token.value, password: password.value, name: name.value.trim() })
    claimed.value = true
  } catch (e: any) {
    error.value = message(e)
  } finally {
    busy.value = false
  }
}
</script>