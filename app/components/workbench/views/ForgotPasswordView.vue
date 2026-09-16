<template>
  <div class="mx-auto w-full max-w-[460px] px-4 pb-24 pt-10 lg:pt-16">
    <NuxtLink to="/" class="mb-6 inline-flex items-center gap-1.5 font-mono2 text-[10px] uppercase tracking-[0.16em] text-[var(--sub)] hover:text-[var(--accent)]">
      <ArrowLeft :size="12" /> Back to home
    </NuxtLink>

    <div class="rounded-3xl border p-6 shadow-[0_10px_50px_-24px_rgba(27,23,16,.4)]" style="border-color: var(--line); background: var(--panel)">
      <div
        class="flex h-12 w-12 items-center justify-center rounded-full"
        :style="{ background: done ? 'color-mix(in srgb, #2FBF71 14%, transparent)' : 'color-mix(in srgb, var(--accent) 14%, transparent)' }"
      >
        <MailCheck v-if="done" :size="24" style="color: #2FBF71" />
        <KeyRound v-else :size="24" style="color: var(--accent)" />
      </div>

      <ML class="mt-4">Reset password</ML>
      <h2 class="mt-1 font-disp text-[22px] font-bold tracking-tight">
        {{ done ? 'Check your inbox.' : 'Forgot your password?' }}
      </h2>
      <p class="mt-2 text-[13.5px] leading-relaxed text-[var(--sub)]">
        <template v-if="done">
          If <span class="font-semibold text-[var(--ink)]">{{ email }}</span> exists on Printy, we emailed you a link to reset your password. It expires shortly — check spam if you don't see it.
        </template>
        <template v-else>
          Enter the email on your account and we'll send you a reset link.
        </template>
      </p>

      <form v-if="!done" class="mt-5 space-y-3.5" @submit.prevent="submit">
        <AuthField v-model="email" :icon="Mail" label="Email" type="email" placeholder="you@company.co.ke" autofocus :error="fieldErr" />

        <div v-if="err" class="rounded-xl px-3 py-2.5 text-[12px]" style="background: rgba(251,77,109,.1); color: #B4243F">{{ err }}</div>

        <button
          type="submit"
          :disabled="busy || !email.trim()"
          class="press-key flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 font-mono2 text-[12px] font-bold uppercase tracking-[0.16em] text-white disabled:opacity-50"
          style="background: var(--accent)"
        >
          <Loader2 v-if="busy" :size="15" class="animate-spin" />
          <template v-else>Send reset link <ArrowRight :size="15" /></template>
          <span v-if="busy" class="sr-only">Sending…</span>
        </button>
      </form>

      <div v-else class="mt-5">
        <button
          class="press-key flex w-full items-center justify-center gap-2 rounded-2xl py-3 font-mono2 text-[12px] font-bold uppercase tracking-[0.16em] text-white disabled:opacity-50"
          style="background: var(--accent)"
          :disabled="resending"
          @click="resend"
        >
          <Loader2 v-if="resending" :size="15" class="animate-spin" />
          <template v-else>Resend reset link</template>
        </button>
      </div>

      <div class="mt-5 text-center text-[12.5px] text-[var(--sub)]">
        Remembered it?
        <NuxtLink to="/sign-in" class="font-semibold text-[var(--accent)] underline underline-offset-4">Sign in</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft, ArrowRight, KeyRound, Loader2, Mail, MailCheck } from 'lucide-vue-next'
import { getApiErrorMessage } from '~/shared/api'

const auth = useAuthStore()

const email = ref('')
const busy = ref(false)
const resending = ref(false)
const err = ref('')
const fieldErr = ref('')
const done = ref(false)

function normalizeEmail(value: string) {
  return value.trim().toLowerCase()
}

async function submit() {
  err.value = ''
  fieldErr.value = ''
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(email.value))) {
    fieldErr.value = 'Enter a valid email address.'
    return
  }
  busy.value = true
  try {
    await auth.forgotPassword(normalizeEmail(email.value))
    email.value = normalizeEmail(email.value)
    done.value = true
  } catch (e: any) {
    err.value = getApiErrorMessage(e, 'Printy could not send a reset link.')
  } finally {
    busy.value = false
  }
}

async function resend() {
  resending.value = true
  err.value = ''
  try {
    await auth.forgotPassword(normalizeEmail(email.value))
  } catch (e: any) {
    err.value = getApiErrorMessage(e, 'Printy could not send a reset link.')
  } finally {
    resending.value = false
  }
}
</script>