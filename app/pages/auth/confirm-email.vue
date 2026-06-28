
<script setup lang="ts">
import { navigateTo } from '#app'
import AuthShell from '~/components/layout/AuthShell.vue'
import BaseButton from '~/components/base/BaseButton.vue'
import BaseCard from '~/components/base/BaseCard.vue'
import BaseInput from '~/components/base/BaseInput.vue'
import PrintyLogo from '~/components/printy/PrintyLogo.vue'
import { getApiErrorMessage } from '~/shared/api'

definePageMeta({ layout: false })

useHead({
  title: 'Printy - Confirm Email',
})

const auth = useAuthStore()
const route = useRoute()
const loading = ref(false)
const status = ref<'loading' | 'success' | 'error'>('loading')
const message = ref('Checking your verification link...')
const email = ref(typeof route.query.email === 'string' ? route.query.email : '')
const currentYear = new Date().getFullYear()
const emailIcon = '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>'
const nextRoute = computed(() => typeof route.query.next === 'string' ? route.query.next : '')
const pendingQuoteFlag = computed(() => route.query.pendingQuote === '1')

const checklist = [
  'Verification happens before dashboard access',
  'Resend works from the same screen',
  'Successful activation returns you to sign in',
]

const statusTitle = computed(() => {
  if (status.value === 'success') return 'Email verified'
  if (status.value === 'error') return 'Verification failed'
  return 'Checking link'
})

const loginLink = computed(() => {
  const params = new URLSearchParams()
  if (nextRoute.value) {
    params.set('next', nextRoute.value)
  }
  if (pendingQuoteFlag.value) {
    params.set('pendingQuote', '1')
  }
  if (email.value.trim()) {
    params.set('email', email.value.trim())
  }
  const query = params.toString()
  return query ? `/auth/login?${query}` : '/auth/login'
})

onMounted(async () => {
  const key = typeof route.query.key === 'string' ? route.query.key : ''
  if (!key) {
    status.value = 'error'
    message.value = 'This verification link is missing its key.'
    return
  }

  try {
    const result = await auth.confirmEmail(key)
    status.value = 'success'
    message.value = `${result.detail} Redirecting to sign in...`
    if (result.email) {
      email.value = result.email
    }
    window.setTimeout(() => {
      navigateTo(loginLink.value)
    }, 1800)
  } catch (error: unknown) {
    status.value = 'error'
    message.value = getApiErrorMessage(error, 'This verification link is invalid or expired.')
  }
})

async function resend() {
  loading.value = true
  try {
    const result = await auth.resendConfirmation(email.value.trim())
    status.value = 'success'
    message.value = result.detail
  } catch (error: unknown) {
    status.value = 'error'
    message.value = getApiErrorMessage(error, 'Printy could not resend the verification email.')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthShell>
    <BaseCard class="mx-auto w-full max-w-md p-8">
      <div class="mb-6 flex items-center justify-between">
        <PrintyLogo />
        <span class="rounded-full bg-[#fff4ed] px-3 py-1 text-xs font-semibold text-[#c4471a]">
          Verify
        </span>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div class="flex items-center gap-2 text-sm font-semibold text-slate-900">
          <span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#e13515]" v-html="emailIcon" />
          {{ statusTitle }}
        </div>
        <p class="mt-3 text-sm leading-6 text-slate-600">{{ message }}</p>
      </div>

      <BaseInput
        v-model="email"
        class="mt-6"
        label="Email address"
        type="email"
        placeholder="you@example.com"
      />

      <BaseButton class="mt-4 w-full" :disabled="loading || !email.trim()" @click="resend">
        {{ loading ? 'Sending...' : 'Resend verification email' }}
      </BaseButton>

      <NuxtLink :to="loginLink" class="mt-4 block text-center text-sm font-semibold text-[#e13515]">
        Continue to sign in
      </NuxtLink>

      <ul class="mt-6 space-y-2 text-xs text-slate-500">
        <li v-for="item in checklist" :key="item">{{ item }}</li>
      </ul>

      <p class="mt-6 text-center text-xs text-slate-400">© {{ currentYear }} Printy</p>
    </BaseCard>
  </AuthShell>
</template>
