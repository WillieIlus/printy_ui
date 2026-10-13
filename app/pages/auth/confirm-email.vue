<template>
  <div class="mx-auto w-full max-w-[460px] px-4 pb-24 pt-16">
    <div class="rounded-3xl border p-8 text-center" style="border-color: var(--line); background: var(--panel)">
      <div
        class="mx-auto flex h-14 w-14 items-center justify-center rounded-full"
        style="background: color-mix(in srgb, var(--accent) 14%, transparent)"
      >
        <Loader2 v-if="status === 'loading'" :size="24" class="animate-spin" style="color: var(--accent)" />
        <MailCheck v-else-if="status === 'success'" :size="26" style="color: var(--accent)" />
        <Mail v-else-if="status === 'ready'" :size="24" style="color: var(--accent)" />
        <CircleAlert v-else :size="26" style="color: #C81E44" />
      </div>

      <h2 class="mt-4 font-disp text-[24px] font-bold tracking-tight">{{ statusTitle }}</h2>
      <p class="mt-2 text-[13.5px] leading-relaxed text-[var(--sub)]">{{ message }}</p>

      <button
        v-if="status === 'ready'"
        class="press-key mt-5 flex w-full items-center justify-center gap-2 rounded-2xl py-3 font-mono2 text-[12px] font-bold uppercase tracking-[0.16em] text-white"
        style="background: var(--accent)"
        @click="confirm()"
      >
        Confirm my email
      </button>

      <div v-if="status !== 'loading'" class="mt-5 text-left">
        <label class="block">
          <ML>Email address</ML>
          <div class="mt-1.5 flex items-center gap-2.5 rounded-xl border px-3.5 py-3" style="border-color: var(--line); background: var(--panel2)">
            <Mail :size="15" style="color: var(--sub)" class="shrink-0" />
            <input v-model="email" type="email" placeholder="you@example.com" class="w-full bg-transparent text-[14px] outline-none placeholder:text-[var(--sub)] placeholder:opacity-60" />
          </div>
        </label>

        <button
          class="press-key mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-3 font-mono2 text-[12px] font-bold uppercase tracking-[0.16em] text-white disabled:opacity-50"
          style="background: var(--accent)"
          :disabled="resending || !email.trim()"
          @click="resend()"
        >
          <Loader2 v-if="resending" :size="15" class="animate-spin" />
          <template v-else>Resend verification email</template>
        </button>

        <NuxtLink to="/sign-in" class="mt-4 block text-center text-[13px] font-semibold text-[var(--accent)] underline underline-offset-4">
          Continue to sign in
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CircleAlert, Loader2, Mail, MailCheck } from 'lucide-vue-next'
import { getApiErrorCode, getApiErrorMessage } from '~/shared/api'

definePageMeta({ layout: 'default' })

useHead({ title: 'Printy - Confirm Email' })

const auth = useAuthStore()
const route = useRoute()

const status = ref<'ready' | 'loading' | 'success' | 'error'>('ready')
const message = ref('Click the button below to verify your email address.')
const email = ref(typeof route.query.email === 'string' ? route.query.email : '')
const resending = ref(false)
const alreadyVerified = ref(false)
const errorCode = ref<string | null>(null)

const key = computed(() => (
  typeof route.query.key === 'string'
    ? route.query.key
    : typeof route.query.token === 'string'
      ? route.query.token
      : ''
))

const statusTitle = computed(() => {
  if (status.value === 'success') return alreadyVerified.value ? 'Email already verified' : 'Email verified'
  if (status.value === 'error') return errorCode.value === 'TOKEN_EXPIRED' ? 'Link expired' : 'Verification failed'
  if (status.value === 'loading') return 'Verifying your email'
  return 'Confirm your email'
})

function fallbackMessageForCode(code: string | null) {
  if (code === 'TOKEN_EXPIRED') return 'This verification link has expired. Request a new one.'
  if (code === 'TOKEN_INVALID') return 'This verification link is invalid.'
  if (code === 'TOKEN_REQUIRED') return 'This verification link is missing its key.'
  return 'This verification link is invalid or expired.'
}

async function confirm() {
  if (!key.value) return
  status.value = 'loading'
  message.value = 'Verifying your link...'
  try {
    const result = await auth.confirmEmail(key.value)
    alreadyVerified.value = Boolean(result.already_verified)
    status.value = 'success'
    message.value = result.detail
      ?? (alreadyVerified.value
        ? 'Your email was already verified. You can now sign in.'
        : 'Your email is verified. You can now sign in.')
    if (result.email) {
      email.value = result.email
    }
  } catch (error: unknown) {
    const code = getApiErrorCode(error)
    errorCode.value = code
    status.value = 'error'
    message.value = getApiErrorMessage(error, fallbackMessageForCode(code))
  }
}

async function resend() {
  resending.value = true
  try {
    const result = await auth.resendConfirmation(email.value.trim())
    message.value = result.detail ?? 'Activation email sent.'
    status.value = 'success'
  } catch (error: unknown) {
    message.value = getApiErrorMessage(error, 'Printy could not resend the verification email.')
  } finally {
    resending.value = false
  }
}

onMounted(() => {
  // Opening the link (e.g. by an email scanner or link preview) must never
  // consume the single-use token. Confirmation happens only on an explicit
  // "Confirm my email" click, so a preview that follows the link cannot burn it.
  if (!key.value) {
    status.value = 'error'
    errorCode.value = 'TOKEN_REQUIRED'
    message.value = 'This verification link is missing its key.'
  }
})
</script>
