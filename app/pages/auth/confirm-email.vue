<template>
  <AuthShell mode="signup">
    <template #side>
      <div class="inline-flex items-center gap-2 bg-[#1d2939] border border-[#2d3f55] rounded-full px-3.5 py-1.5 mb-8">
        <span class="w-1.5 h-1.5 rounded-full bg-[#e13515]"></span>
        <span class="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#667085]">Email verification</span>
      </div>

      <h1 class="text-[2.4rem] xl:text-[2.75rem] font-extrabold text-white leading-[1.15] tracking-tight mb-5">
        Verify your email<br>
        and keep your<br>
        <span class="text-[#e13515]">workspace secure.</span>
      </h1>

      <p class="text-[#98a2b3] text-[15px] leading-relaxed mb-10 max-w-sm">
        Printy verifies every account before sign-in so quotes, artwork, payments, and tracking stay tied to the right person.
      </p>

      <ul class="space-y-3.5">
        <li v-for="item in checklist" :key="item" class="flex items-center gap-3.5">
          <div class="w-5 h-5 rounded-full bg-[#e13515] flex items-center justify-center shrink-0">
            <svg class="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5"><path d="M5 13l4 4L19 7" /></svg>
          </div>
          <span class="text-[14px] text-[#d0d5dd]">{{ item }}</span>
        </li>
      </ul>
    </template>

    <div class="w-full max-w-[520px]">
      <div class="flex items-center gap-2 mb-7 lg:hidden">
        <PrintyLogo variant="full" size="md" to="/" />
      </div>

      <BaseCard variant="elevated" padding="xl" radius="xl">
        <div class="mb-7">
          <h2 class="text-[1.55rem] font-extrabold text-[#101828] tracking-tight mb-1.5">Confirm your email</h2>
          <p class="text-[14px] text-[#667085]">Use the verification link from your inbox, or resend a fresh one below.</p>
        </div>

        <div
          class="rounded-lg border px-4 py-3 mb-5"
          :class="status === 'success'
            ? 'border-[#abefc6] bg-[#ecfdf3]'
            : status === 'error'
              ? 'border-[#fda29b] bg-[#fef3f2]'
              : 'border-[#e4e7ec] bg-[#f9fafb]'"
        >
          <p class="text-[12px] font-semibold mb-1" :class="status === 'success' ? 'text-[#067647]' : status === 'error' ? 'text-[#b42318]' : 'text-[#344054]'">
            {{ statusTitle }}
          </p>
          <p class="text-[12px] leading-snug" :class="status === 'success' ? 'text-[#067647]' : status === 'error' ? 'text-[#b42318]' : 'text-[#667085]'">
            {{ message }}
          </p>
        </div>

        <form class="space-y-4" @submit.prevent="resend">
          <BaseInput
            v-model="email"
            type="email"
            label="Resend verification to"
            placeholder="you@company.com"
            autocomplete="email"
            :disabled="loading"
            variant="auth"
            :icon-left="emailIcon"
          />

          <div class="flex flex-col sm:flex-row gap-3">
            <BaseButton type="submit" variant="primary" size="lg" :disabled="loading || !email.trim()" :loading="loading">
              {{ loading ? 'Sending email' : 'Resend verification' }}
            </BaseButton>
            <BaseButton type="button" variant="secondary" size="lg" @click="navigateTo(loginLink)">
              Go to sign in
            </BaseButton>
          </div>
        </form>
      </BaseCard>

      <div class="mt-6 flex items-center justify-center gap-5">
        <NuxtLink to="/" class="text-[12px] text-[#98a2b3] hover:text-[#667085] transition-colors">Privacy</NuxtLink>
        <span class="text-[#d0d5dd]">&middot;</span>
        <NuxtLink to="/" class="text-[12px] text-[#98a2b3] hover:text-[#667085] transition-colors">Terms</NuxtLink>
        <span class="text-[#d0d5dd]">&middot;</span>
        <NuxtLink :to="loginLink" class="text-[12px] text-[#98a2b3] hover:text-[#667085] transition-colors">Sign in</NuxtLink>
        <span class="text-[#d0d5dd]">&middot;</span>
        <span class="text-[12px] text-[#98a2b3]">&copy; {{ currentYear }} Printy</span>
      </div>
    </div>
  </AuthShell>
</template>

<script setup lang="ts">
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
