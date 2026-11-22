<template>
  <div class="mx-auto w-full max-w-[480px] px-5 pt-12 pb-24 sm:px-8">
    <div class="crop-marks rounded-2xl border border-line bg-card p-7 text-center shadow-card sm:p-8">
      <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-mint">
        <Loader2 v-if="status === 'loading'" :size="24" class="animate-spin text-brand" />
        <MailCheck v-else-if="status === 'success'" :size="26" class="text-brand" />
        <Mail v-else-if="status === 'ready'" :size="24" class="text-brand" />
        <CircleAlert v-else :size="26" class="text-red" />
      </div>

      <DesignAlert
        v-if="status === 'error'"
        tone="error"
        :title="statusTitle"
        class="mt-4 text-left"
      >
        {{ message }}
      </DesignAlert>

      <template v-else>
        <h2 class="mt-4 text-2xl font-bold tracking-tight">{{ statusTitle }}</h2>
        <p class="mt-2 text-[13.5px] leading-relaxed text-ink-2">{{ message }}</p>
      </template>

      <button
        v-if="status !== 'loading' && status !== 'success' && canConfirm"
        class="press-key mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3 font-mono text-[11px] font-bold tracking-[0.14em] text-paper uppercase"
        @click="confirm()"
      >
        Confirm my email
      </button>

      <div v-if="status !== 'loading'" class="mt-5 text-left">
        <label class="block">
          <span class="font-mono text-[10px] tracking-[0.14em] text-ink-3 uppercase">Email address</span>
          <div class="mt-1.5 flex items-center gap-2.5 rounded-xl border border-line bg-paper-2 px-3.5 py-3">
            <Mail :size="15" class="shrink-0 text-ink-3" />
            <input v-model="email" type="email" placeholder="you@example.com" class="w-full bg-transparent text-[14px] outline-none placeholder:text-ink-3" />
          </div>
        </label>

        <button
          class="press-key mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3 font-mono text-[11px] font-bold tracking-[0.14em] text-paper uppercase disabled:opacity-50"
          :disabled="resending || !email.trim()"
          @click="resend()"
        >
          <Loader2 v-if="resending" :size="15" class="animate-spin" />
          <template v-else>Resend verification email</template>
        </button>

        <NuxtLink to="/sign-in" class="mt-4 block text-center text-[13px] font-semibold text-brand underline underline-offset-4">
          Continue to sign in
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CircleAlert, Loader2, Mail, MailCheck } from 'lucide-vue-next'
import DesignAlert from '~/components/design/ui/Alert.vue'
import { getApiErrorCode, getApiErrorMessage } from '~/shared/api'
import { dashboardRouteForRole } from '~/shared/workspace'

definePageMeta({ layout: 'design-auth' })

useHead({ title: 'Printy - Confirm Email' })

const auth = useAuthStore()
const route = useRoute()

const status = ref<'ready' | 'loading' | 'success' | 'error'>('ready')
const message = ref('Click the button below to verify your email address.')

/**
 * The static SPA can mount before Nuxt's router exposes `route.query`, even
 * though the query is already in the browser address bar. Read the live
 * location as a fallback so a real emailed link is never reported as missing
 * its key. The signed key is still the only value sent to the API.
 */
function queryString(name: string): string {
  const fromRoute = route.query[name]
  if (typeof fromRoute === 'string' && fromRoute) {
    return fromRoute
  }
  if (import.meta.client) {
    return new URLSearchParams(window.location.search).get(name) ?? ''
  }
  return ''
}

const email = ref(queryString('email').trim())
const resending = ref(false)
const alreadyVerified = ref(false)
const errorCode = ref<string | null>(null)

const key = computed(() => queryString('key') || queryString('token'))

const canConfirm = computed(() => Boolean(key.value))

const statusTitle = computed(() => {
  if (status.value === 'success') return alreadyVerified.value ? 'Email already verified' : 'Email verified'
  if (status.value === 'error') return errorCode.value === 'TOKEN_EXPIRED' ? 'Link expired' : 'Verification failed'
  if (status.value === 'loading') return 'Verifying your email'
  return 'Confirm your email'
})

function fallbackMessageForCode(code: string | null) {
  if (code === 'TOKEN_EXPIRED') return 'This verification link has expired. Request a new one.'
  if (code === 'TOKEN_INVALID') return 'This verification link is invalid.'
  if (code === 'TOKEN_REQUIRED') return 'This verification link is missing its confirmation key. Request a new verification email.'
  return 'This verification link is invalid or expired.'
}

async function confirm() {
  if (status.value === 'loading') return
  const keyValue = key.value.trim()
  if (!keyValue) {
    status.value = 'error'
    errorCode.value = 'TOKEN_REQUIRED'
    message.value = 'This verification link is missing its confirmation key. Request a new verification email.'
    return
  }
  status.value = 'loading'
  message.value = 'Verifying your link...'
  try {
    const result = await auth.confirmEmail(keyValue)
    alreadyVerified.value = Boolean(result.already_verified)
    status.value = 'success'
    message.value = result.detail
      ?? (alreadyVerified.value
        ? 'Your email was already verified. You can now sign in.'
        : 'Your email is verified. You can now sign in.')
    if (result.email) {
      email.value = result.email
    }
    // Law 9.1 — when the confirmation happens inside a signed-in session, land
    // on the dashboard for the active role instead of leaving the user on the
    // marketing page. Signed-out users keep the "Continue to sign in" path.
    if (auth.isAuthenticated) {
      await navigateTo(dashboardRouteForRole(auth.dashboardRole), { redirectCode: 302 })
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
    if (result.already_verified) {
      message.value = 'This email is already verified. You can sign in.'
      alreadyVerified.value = true
      status.value = 'success'
    } else if (result.sent === false) {
      status.value = 'error'
      errorCode.value = null
      message.value = 'We could not send a new activation email. Check the address and try again.'
    } else {
      message.value = result.detail ?? 'Activation email sent.'
      status.value = 'success'
    }
  } catch (error: unknown) {
    message.value = getApiErrorMessage(error, 'Printy could not resend the verification email.')
  } finally {
    resending.value = false
  }
}

watch(key, (value) => {
  if (!value) return
  // A prerendered page can mount before the router exposes ?key=. When the
  // query arrives, retry instead of leaving the visitor on the false
  // "missing key" error.
  if (status.value === 'error' && errorCode.value === 'TOKEN_REQUIRED') {
    void confirm()
  }
})

watch(() => queryString('email'), (value) => {
  if (value && !email.value) {
    email.value = value
  }
})

onMounted(() => {
  // Activate as soon as the signed link is opened. The address is only a
  // display hint and the API never verifies from it alone.
  if (canConfirm.value) {
    void confirm()
    return
  }
  status.value = 'error'
  errorCode.value = 'TOKEN_REQUIRED'
  message.value = 'This verification link is missing its confirmation key. Request a new verification email.'
})
</script>
