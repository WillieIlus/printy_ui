<template>
  <AuthShell mode="login">
    <template #side>
      <div class="inline-flex items-center gap-2 bg-[#1d2939] border border-[#2d3f55] rounded-full px-3.5 py-1.5 mb-8">
        <span class="w-1.5 h-1.5 rounded-full bg-[#e13515]"></span>
        <span class="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#667085]">Kenya&apos;s Print Operating System</span>
      </div>

      <h1 class="text-[2.6rem] xl:text-[3rem] font-extrabold text-white leading-[1.15] tracking-tight mb-5">
        Manage print jobs<br>
        from quote<br>
        <span class="text-[#e13515]">to delivery.</span>
      </h1>

      <p class="text-[#98a2b3] text-[15px] leading-relaxed mb-10 max-w-sm">
        Sign in to track jobs, manage quotes, and keep every print order organized - all in one place.
      </p>

      <ul class="space-y-4">
        <li v-for="feature in features" :key="feature.title" class="flex items-center gap-4">
          <div class="w-9 h-9 rounded-xl bg-[#1d2939] border border-[#2d3f55] flex items-center justify-center shrink-0" v-html="feature.icon"></div>
          <div>
            <p class="text-[14px] font-semibold text-white">{{ feature.title }}</p>
            <p class="text-[12px] text-[#667085] mt-0.5">{{ feature.copy }}</p>
          </div>
        </li>
      </ul>
    </template>

    <template #sideFooter>
      <div class="border-t border-[#1d2939] pt-7">
        <div class="flex items-start gap-4">
          <div class="shrink-0">
            <div class="flex -space-x-2">
              <div class="w-8 h-8 rounded-full bg-[#e13515] border-2 border-[#101828] flex items-center justify-center">
                <span class="text-[10px] font-bold text-white">MK</span>
              </div>
              <div class="w-8 h-8 rounded-full bg-[#344054] border-2 border-[#101828] flex items-center justify-center">
                <span class="text-[10px] font-bold text-white">JN</span>
              </div>
              <div class="w-8 h-8 rounded-full bg-[#1d2939] border-2 border-[#101828] flex items-center justify-center">
                <span class="text-[10px] font-bold text-[#98a2b3]">+4</span>
              </div>
            </div>
          </div>
          <div>
            <p class="text-[13px] text-[#98a2b3] leading-snug">
              Trusted by clients, partner teams, and production shops across Nairobi.
            </p>
            <div class="flex items-center gap-1 mt-1.5">
              <svg v-for="star in 5" :key="star" class="w-3.5 h-3.5 text-[#e13515]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
              <span class="text-[11px] text-[#475467] ml-1">Verified platform</span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div class="hidden lg:flex absolute top-7 right-8 items-center gap-2">
      <span class="text-sm text-[#667085]">New to Printy?</span>
      <NuxtLink :to="clientRegisterLink" class="text-sm font-semibold text-[#e13515] hover:text-[#b82c10] transition-colors underline underline-offset-2">Create an account</NuxtLink>
    </div>

    <div class="w-full max-w-[440px]">
      <div class="flex items-center gap-2 mb-8 lg:hidden">
        <PrintyLogo variant="full" size="md" to="/" />
      </div>

      <BaseCard variant="elevated" padding="xl" radius="xl">
        <div class="mb-7">
          <h2 class="text-[1.65rem] font-extrabold text-[#101828] tracking-tight mb-1.5">Welcome back</h2>
          <p class="text-[14px] text-[#667085]">Sign in to continue to your workspace.</p>
        </div>

        <form class="space-y-5" @submit.prevent="submit">
          <div v-if="errorMessage" class="rounded-lg border border-[#fda29b] bg-[#fef3f2] px-4 py-3">
            <p class="text-[12px] font-semibold text-[#b42318] mb-1">Sign in failed</p>
            <p class="text-[12px] text-[#b42318] leading-snug">{{ errorMessage }}</p>
            <div v-if="showResendVerification" class="mt-3">
              <BaseButton type="button" variant="secondary" size="sm" :disabled="resendLoading || !email.trim()" :loading="resendLoading" @click="resendVerification">
                {{ resendLoading ? 'Sending email' : 'Resend verification email' }}
              </BaseButton>
            </div>
          </div>

          <div v-if="successMessage" class="rounded-lg border border-[#abefc6] bg-[#ecfdf3] px-4 py-3">
            <p class="text-[12px] font-semibold text-[#067647] mb-1">Verification email sent</p>
            <p class="text-[12px] text-[#067647] leading-snug">{{ successMessage }}</p>
          </div>

          <BaseInput
            v-model="email"
            type="email"
            label="Email address"
            placeholder="you@company.com"
            autocomplete="email"
            :disabled="loading"
            :error="fieldErrors.email"
            variant="auth"
            :icon-left="emailIcon"
          />

          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="block text-[13px] font-semibold text-[#344054]">Password</label>
              <NuxtLink to="/auth/forgot-password" class="text-[12px] font-semibold text-[#e13515] hover:text-[#b82c10] transition-colors">Forgot password?</NuxtLink>
            </div>
            <BaseInput
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter your password"
              autocomplete="current-password"
              :disabled="loading"
              :error="fieldErrors.password"
              variant="auth"
              :icon-left="lockIcon"
            >
              <template #right>
                <button type="button" class="text-[#98a2b3] hover:text-[#667085] cursor-pointer transition-colors" :disabled="loading" @click="showPassword = !showPassword">
                  <svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </template>
            </BaseInput>
          </div>

          <div class="flex items-center gap-2.5 pt-0.5">
            <input id="remember" v-model="rememberMe" type="checkbox" name="remember" :disabled="loading" class="w-4 h-4 rounded border border-[#d0d5dd] text-[#e13515] accent-[#e13515] cursor-pointer">
            <label for="remember" class="text-[13px] text-[#344054] cursor-pointer select-none">Keep me signed in for 30 days</label>
          </div>

          <BaseButton type="submit" variant="primary" size="xl" block :disabled="loading" :loading="loading">
            {{ loading ? 'Signing in' : 'Sign in' }}
          </BaseButton>
        </form>

        <div class="my-6 flex items-center gap-3">
          <div class="flex-1 h-px bg-[#f2f4f7]"></div>
          <span class="text-[12px] text-[#98a2b3] font-medium whitespace-nowrap">New to Printy?</span>
          <div class="flex-1 h-px bg-[#f2f4f7]"></div>
        </div>

        <div class="grid grid-cols-3 gap-3">
          <NuxtLink
            :to="clientRegisterLink"
            class="group flex flex-col items-center gap-2 bg-[#f9fafb] hover:bg-[#fef3f2] border border-[#e4e7ec] hover:border-[#fda497] rounded-xl px-3 py-4 transition-all"
          >
            <div class="w-8 h-8 rounded-lg bg-white group-hover:bg-[#fef3f2] border border-[#e4e7ec] group-hover:border-[#fda497] flex items-center justify-center transition-colors shadow-sm">
              <svg class="w-4 h-4 text-[#667085] group-hover:text-[#e13515] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div class="text-center">
              <p class="text-[12px] font-bold text-[#344054] group-hover:text-[#e13515] transition-colors leading-tight">Client</p>
              <p class="text-[10px] text-[#98a2b3] mt-0.5 leading-tight">Order &amp; track jobs</p>
            </div>
          </NuxtLink>

          <NuxtLink
            :to="partnerRegisterLink"
            class="group flex flex-col items-center gap-2 bg-[#f9fafb] hover:bg-[#fef3f2] border border-[#e4e7ec] hover:border-[#fda497] rounded-xl px-3 py-4 transition-all"
          >
            <div class="w-8 h-8 rounded-lg bg-white group-hover:bg-[#fef3f2] border border-[#e4e7ec] group-hover:border-[#fda497] flex items-center justify-center transition-colors shadow-sm">
              <svg class="w-4 h-4 text-[#667085] group-hover:text-[#e13515] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div class="text-center">
              <p class="text-[12px] font-bold text-[#344054] group-hover:text-[#e13515] transition-colors leading-tight">Partner</p>
              <p class="text-[10px] text-[#98a2b3] mt-0.5 leading-tight">Manage &amp; quote</p>
            </div>
          </NuxtLink>

          <NuxtLink
            :to="shopRegisterLink"
            class="group flex flex-col items-center gap-2 bg-[#f9fafb] hover:bg-[#fef3f2] border border-[#e4e7ec] hover:border-[#fda497] rounded-xl px-3 py-4 transition-all"
          >
            <div class="w-8 h-8 rounded-lg bg-white group-hover:bg-[#fef3f2] border border-[#e4e7ec] group-hover:border-[#fda497] flex items-center justify-center transition-colors shadow-sm">
              <svg class="w-4 h-4 text-[#667085] group-hover:text-[#e13515] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
            </div>
            <div class="text-center">
              <p class="text-[12px] font-bold text-[#344054] group-hover:text-[#e13515] transition-colors leading-tight">Print Shop</p>
              <p class="text-[10px] text-[#98a2b3] mt-0.5 leading-tight">Run production</p>
            </div>
          </NuxtLink>
        </div>

        <div class="mt-6 flex items-center gap-2.5 bg-[#f9fafb] border border-[#e4e7ec] rounded-lg px-4 py-3">
          <svg class="w-4 h-4 text-[#667085] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <p class="text-[12px] text-[#667085] leading-snug">
            Your workspace is protected with <span class="font-semibold text-[#344054]">secure authentication.</span>
          </p>
        </div>
      </BaseCard>

      <div class="mt-6 flex items-center justify-center gap-5">
        <NuxtLink to="/" class="text-[12px] text-[#98a2b3] hover:text-[#667085] transition-colors">Privacy</NuxtLink>
        <span class="text-[#d0d5dd]">&middot;</span>
        <NuxtLink to="/" class="text-[12px] text-[#98a2b3] hover:text-[#667085] transition-colors">Terms</NuxtLink>
        <span class="text-[#d0d5dd]">&middot;</span>
        <NuxtLink to="/auth/forgot-password" class="text-[12px] text-[#98a2b3] hover:text-[#667085] transition-colors">Help</NuxtLink>
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
import { usePendingClientQuote } from '~/composables/usePendingClientQuote'
import { claimGuestCalculatorDraft } from '~/services/quotes'
import PrintyLogo from '~/components/printy/PrintyLogo.vue'
import { getApiErrorDetail, getApiErrorMessage } from '~/shared/api'

definePageMeta({ layout: false })

useHead({
  title: 'Printy - Sign In',
})

const auth = useAuthStore()
const route = useRoute()
const currentYear = new Date().getFullYear()
const pendingClientQuote = usePendingClientQuote()

const email = ref(typeof route.query.email === 'string' ? route.query.email : '')
const password = ref('')
const rememberMe = ref(false)
const loading = ref(false)
const resendLoading = ref(false)
const showPassword = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const fieldErrors = ref<Record<string, string>>({})
const nextRoute = computed(() => typeof route.query.next === 'string' ? route.query.next : '')
const redirectRoute = computed(() => typeof route.query.redirect === 'string' ? route.query.redirect : '')
const pendingQuoteFlag = computed(() => route.query.pendingQuote === '1')

const emailIcon = '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>'
const lockIcon = '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>'

function buildRegisterLink(role?: string) {
  const params = new URLSearchParams()
  if (role) {
    params.set('role', role)
  }
  if (nextRoute.value) {
    params.set('next', nextRoute.value)
  }
  if (pendingQuoteFlag.value) {
    params.set('pendingQuote', '1')
  }
  const query = params.toString()
  return query ? `/auth/register?${query}` : '/auth/register'
}

const clientRegisterLink = computed(() => buildRegisterLink())
const partnerRegisterLink = computed(() => buildRegisterLink('partner'))
const shopRegisterLink = computed(() => buildRegisterLink('production'))

const features = [
  {
    title: 'Instant estimates',
    copy: 'Imposition-based pricing with market-calibrated ranges',
    icon: '<svg class="w-4 h-4 text-[#e13515]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>',
  },
  {
    title: 'Payment-confirmed jobs',
    copy: 'Production only starts after secure payment is cleared',
    icon: '<svg class="w-4 h-4 text-[#e13515]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>',
  },
  {
    title: 'Artwork and proof tracking',
    copy: 'Submit, review, and approve files directly in-platform',
    icon: '<svg class="w-4 h-4 text-[#e13515]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>',
  },
  {
    title: 'Tracked fulfilment',
    copy: 'From quote approval to delivery, every status stays in one place',
    icon: '<svg class="w-4 h-4 text-[#e13515]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>',
  },
]

const showResendVerification = ref(false)

async function submit() {
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  showResendVerification.value = false
  fieldErrors.value = {}

  if (!email.value.trim()) {
    fieldErrors.value.email = 'Email address is required.'
  }
  if (!password.value) {
    fieldErrors.value.password = 'Password is required.'
  }

  if (Object.keys(fieldErrors.value).length > 0) {
    loading.value = false
    return
  }

  try {
    await auth.login({ email: email.value.trim(), password: password.value }, { rememberMe: rememberMe.value })
    const pending = pendingClientQuote.load()
    if (pending?.session_key) {
      try {
        const draft = await claimGuestCalculatorDraft(pending.session_key)
        pendingClientQuote.save({
          draft_id: Number(draft.id || 0) || pending.draft_id || null,
          artwork_token: draft.artwork_token || pending.artwork_token,
          artwork_filename: draft.artwork_filename || pending.artwork_filename || pending.artwork_name,
        })
      } catch {
        // Keep local pending state even if claim fails.
      }
    }
    await navigateTo(nextRoute.value || redirectRoute.value || auth.homeRoute)
  } catch (error: unknown) {
    const data = typeof error === 'object' && error && 'data' in error ? (error as { data?: Record<string, unknown> }).data : undefined
    fieldErrors.value = normalizeApiFieldErrors(data)
    errorMessage.value = resolveLoginErrorMessage(error)
  } finally {
    loading.value = false
  }
}

function resolveLoginErrorMessage(error: unknown) {
  const data = typeof error === 'object' && error && 'data' in error ? (error as { data?: Record<string, unknown> }).data : undefined
  const fieldErrors = data?.field_errors as Record<string, unknown> | undefined
  const fieldErrorCode = Array.isArray(fieldErrors?.code) ? String(fieldErrors.code[0] || '') : String(fieldErrors?.code || '')
  const detail = String(getApiErrorDetail(error) || '').toLowerCase()
  if (fieldErrorCode.toUpperCase() === 'EMAIL_UNVERIFIED' || detail.includes('not verified') || detail.includes('needs email verification')) {
    showResendVerification.value = true
    return 'Your account exists but needs email verification. Check your inbox, spam, or promotions, then try again.'
  }
  if (detail.includes('no active account') || detail.includes('incorrect')) {
    return 'The email or password is incorrect.'
  }
  return getApiErrorMessage(error, 'Printy could not log you in.')
}

function normalizeApiFieldErrors(data?: Record<string, unknown>) {
  if (!data) {
    return {}
  }

  const next: Record<string, string> = {}
  for (const [key, value] of Object.entries(data)) {
    if (key === 'email' || key === 'password') {
      if (Array.isArray(value)) {
        next[key] = value.map((item) => String(item)).join(' ')
      } else if (typeof value === 'string') {
        next[key] = value
      }
    }
  }
  return next
}

async function resendVerification() {
  if (!email.value.trim()) {
    errorMessage.value = 'Enter your email address first so Printy can resend the verification link.'
    return
  }
  resendLoading.value = true
  successMessage.value = ''
  try {
    const result = await auth.resendConfirmation(email.value.trim())
    successMessage.value = result.detail
    showResendVerification.value = true
  } catch (error: unknown) {
    errorMessage.value = getApiErrorMessage(error, 'Printy could not resend the verification email.')
  } finally {
    resendLoading.value = false
  }
}
</script>
