<template>
  <AuthShell mode="signup">
    <template #side>
      <div class="inline-flex items-center gap-2 bg-[#1d2939] border border-[#2d3f55] rounded-full px-3.5 py-1.5 mb-8">
        <span class="w-1.5 h-1.5 rounded-full bg-[#e13515]"></span>
        <span class="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#667085]">Kenya&apos;s Print Operating System</span>
      </div>

      <h1 class="text-[2.4rem] xl:text-[2.75rem] font-extrabold text-white leading-[1.15] tracking-tight mb-5">
        Start managing<br>
        print jobs the<br>
        <span class="text-[#e13515]">professional way.</span>
      </h1>

      <p class="text-[#98a2b3] text-[15px] leading-relaxed mb-10 max-w-sm">
        Create quotes, upload artwork, track production, and manage every print order from one workspace - built for how print actually works.
      </p>

      <ul class="space-y-3.5">
        <li v-for="feature in features" :key="feature" class="flex items-center gap-3.5">
          <div class="w-5 h-5 rounded-full bg-[#e13515] flex items-center justify-center shrink-0">
            <svg class="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5"><path d="M5 13l4 4L19 7" /></svg>
          </div>
          <span class="text-[14px] text-[#d0d5dd]">{{ feature }}</span>
        </li>
      </ul>
    </template>

    <template #sideFooter>
      <div class="border-t border-[#1d2939] pt-7">
        <p class="text-[11px] font-semibold uppercase tracking-widest text-[#475467] mb-4">Three workspace types</p>
        <div class="flex flex-col gap-2.5">
          <div v-for="type in workspaceTypes" :key="type.title" class="flex items-center gap-3">
            <div class="w-7 h-7 rounded-lg bg-[#1d2939] border border-[#2d3f55] flex items-center justify-center shrink-0" v-html="type.icon"></div>
            <div>
              <span class="text-[13px] font-semibold text-[#d0d5dd]">{{ type.title }}</span>
              <span class="text-[12px] text-[#667085] ml-1.5">- {{ type.copy }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div class="hidden lg:flex w-full max-w-[580px] justify-end mb-5">
      <div class="flex items-center gap-2">
        <span class="text-[13px] text-[#667085]">Already have an account?</span>
        <NuxtLink :to="loginLink" class="text-[13px] font-semibold text-[#e13515] hover:text-[#b82c10] transition-colors underline underline-offset-2">Sign in</NuxtLink>
      </div>
    </div>

    <div class="w-full max-w-[580px]">
      <div class="flex items-center gap-2 mb-7 lg:hidden">
        <PrintyLogo variant="full" size="md" to="/" />
      </div>

      <BaseCard variant="elevated" padding="xl" radius="xl">
        <div class="mb-7" v-if="!registrationComplete">
          <h2 class="text-[1.55rem] font-extrabold text-[#101828] tracking-tight mb-1.5">Create your Printy account</h2>
          <p class="text-[14px] text-[#667085]">Choose how you want to use Printy.</p>
        </div>

        <div v-else class="space-y-5">
          <div class="rounded-2xl border border-[#abefc6] bg-[#ecfdf3] p-5">
            <p class="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#067647] mb-2">Account created</p>
            <h2 class="text-[1.55rem] font-extrabold text-[#101828] tracking-tight mb-2">Check your email to activate your Printy account</h2>
            <p class="text-[14px] text-[#067647] leading-relaxed">
              We sent a verification link to <span class="font-semibold">{{ registeredEmail }}</span>.
            </p>
          </div>

          <div class="rounded-xl border border-[#e4e7ec] bg-[#f9fafb] p-4 text-[13px] leading-relaxed text-[#667085]">
            Open the email, click the activation link, and then sign in. If you do not see it, check spam, promotions, or other filtered folders first.
          </div>

          <div v-if="successMessage" class="rounded-lg border border-[#abefc6] bg-[#ecfdf3] px-4 py-3">
            <p class="text-[12px] font-semibold text-[#067647] mb-1">Verification email status</p>
            <p class="text-[12px] text-[#067647] leading-snug">{{ successMessage }}</p>
          </div>

          <div v-if="errorMessage" class="rounded-lg border border-[#fda29b] bg-[#fef3f2] px-4 py-3">
            <p class="text-[12px] font-semibold text-[#b42318] mb-1">Verification email issue</p>
            <p class="text-[12px] text-[#b42318] leading-snug">{{ errorMessage }}</p>
          </div>

          <div class="flex flex-col gap-3 sm:flex-row">
            <BaseButton variant="primary" size="lg" :disabled="resendLoading" :loading="resendLoading" @click="resendVerification">
              {{ resendLoading ? 'Sending email' : 'Resend verification email' }}
            </BaseButton>
            <BaseButton :to="confirmEmailLink" variant="secondary" size="lg">
              Open confirmation help
            </BaseButton>
          </div>

          <p class="text-[13px] text-[#667085]">
            Already verified?
            <NuxtLink :to="loginLinkWithEmail" class="font-semibold text-[#e13515] hover:text-[#b82c10] transition-colors underline underline-offset-2">Go to sign in</NuxtLink>
          </p>
        </div>

        <template v-if="!registrationComplete">
        <fieldset class="mb-6">
          <legend class="text-[13px] font-semibold text-[#344054] mb-3">Account type</legend>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label
              v-for="option in accountTypeOptions"
              :key="option.value"
              :class="option.cardClass"
              class="relative flex flex-col gap-3 border-2 border-[#e4e7ec] bg-[#f9fafb] rounded-xl p-4 cursor-pointer transition-all hover:border-[#fda497] hover:bg-[#fff8f7]"
            >
              <input v-model="accountType" type="radio" name="account_type" :value="option.value" class="sr-only">

              <div class="flex items-start justify-between">
                <div class="type-icon w-9 h-9 rounded-lg bg-[#f2f4f7] border border-[#e4e7ec] flex items-center justify-center text-[#667085] transition-all shrink-0" v-html="option.icon"></div>
                <div class="type-radio-ring w-[18px] h-[18px] rounded-full border-2 border-[#d0d5dd] flex items-center justify-center transition-all shrink-0 mt-0.5">
                  <div class="type-radio-dot hidden w-2 h-2 rounded-full bg-[#e13515]"></div>
                </div>
              </div>

              <div>
                <p class="type-label text-[13px] font-bold text-[#344054] transition-colors leading-tight mb-1">{{ option.title }}</p>
                <p class="text-[11px] font-semibold text-[#667085] mb-2 leading-tight">{{ option.quote }}</p>
                <p class="text-[11px] text-[#98a2b3] leading-snug">{{ option.copy }}</p>
              </div>
            </label>
          </div>

          <div class="mt-3 flex items-start gap-2.5 bg-[#f9fafb] border border-[#e4e7ec] rounded-lg px-4 py-3">
            <svg class="w-4 h-4 text-[#667085] shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
            </svg>
            <p class="text-[12px] text-[#667085] leading-snug">
              <span class="font-semibold text-[#344054]">{{ selectedAccountTypeDescription.title }}</span>
              {{ selectedAccountTypeDescription.copy }}
            </p>
          </div>
        </fieldset>

        <div class="mb-6 flex items-center gap-3">
          <div class="flex-1 h-px bg-[#f2f4f7]"></div>
          <span class="text-[11px] font-semibold uppercase tracking-widest text-[#98a2b3]">Your details</span>
          <div class="flex-1 h-px bg-[#f2f4f7]"></div>
        </div>

        <form class="space-y-4" @submit.prevent="submit">
          <div v-if="errorMessage" class="rounded-lg border border-[#fda29b] bg-[#fef3f2] px-4 py-3">
            <p class="text-[12px] font-semibold text-[#b42318] mb-1">Registration failed</p>
            <p class="text-[12px] text-[#b42318] leading-snug">{{ errorMessage }}</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <BaseInput v-model="name" label="Full name" placeholder="Jane Wanjiku" autocomplete="name" :disabled="loading" :error="fieldErrors.name" variant="auth" :icon-left="userIcon" />
            <BaseInput v-model="email" type="email" label="Email address" placeholder="you@company.com" autocomplete="email" :disabled="loading" :error="fieldErrors.email" variant="auth" :icon-left="emailIcon" />
          </div>

          <BaseInput v-model="phone" type="tel" label="Phone number" placeholder="7xx xxx xxx" autocomplete="tel" :disabled="loading" :error="fieldErrors.phone" variant="auth" :icon-left="phoneIcon" />

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <BaseInput v-model="password" :type="showPassword ? 'text' : 'password'" label="Password" placeholder="Min. 8 characters" autocomplete="new-password" :disabled="loading" :error="fieldErrors.password" variant="auth" :icon-left="lockIcon">
                <template #right>
                  <button type="button" class="text-[#98a2b3] hover:text-[#667085] transition-colors" :disabled="loading" @click="showPassword = !showPassword">
                    <svg class="w-[17px] h-[17px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </template>
              </BaseInput>
            </div>

            <div>
              <BaseInput v-model="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" label="Confirm password" placeholder="Repeat password" autocomplete="new-password" :disabled="loading" :error="fieldErrors.confirmPassword" variant="auth" :icon-left="lockIcon">
                <template #right>
                  <button type="button" class="text-[#98a2b3] hover:text-[#667085] transition-colors" :disabled="loading" @click="showConfirmPassword = !showConfirmPassword">
                    <svg class="w-[17px] h-[17px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </template>
              </BaseInput>
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-[11px] text-[#98a2b3]">Password strength</span>
              <span class="text-[11px] font-semibold" :class="passwordStrengthLabelClass">{{ passwordStrengthLabel }}</span>
            </div>
            <div class="flex gap-1">
              <div v-for="(bar, index) in passwordStrengthBars" :key="index" class="h-1 flex-1 rounded-full" :class="bar"></div>
            </div>
          </div>

          <div class="pt-1">
            <label class="flex items-start gap-3 cursor-pointer">
              <div class="mt-0.5 shrink-0">
                <input v-model="acceptedTerms" type="checkbox" name="terms" :disabled="loading" class="w-4 h-4 rounded border border-[#d0d5dd] accent-[#e13515] cursor-pointer">
              </div>
              <p class="text-[13px] text-[#344054] leading-relaxed">
                I agree to Printy&apos;s
                <NuxtLink to="/" class="font-semibold text-[#e13515] hover:text-[#b82c10] underline underline-offset-2 transition-colors">Terms of Service</NuxtLink>
                and
                <NuxtLink to="/" class="font-semibold text-[#e13515] hover:text-[#b82c10] underline underline-offset-2 transition-colors">Privacy Policy</NuxtLink>.
                I understand how my data is used within the platform.
              </p>
            </label>
            <p v-if="fieldErrors.terms" class="mt-1.5 text-[12px] text-[#b42318]">{{ fieldErrors.terms }}</p>
          </div>

          <BaseButton type="submit" variant="primary" size="xl" block :disabled="loading" :loading="loading">
            {{ loading ? 'Creating account' : 'Create account' }}
          </BaseButton>

          <div class="rounded-lg border border-[#e4e7ec] bg-[#f9fafb] px-4 py-3">
            <p class="text-[12px] font-semibold text-[#344054] mb-1">Email verification required</p>
            <p class="text-[12px] text-[#667085] leading-snug">
              Before you can sign in, Printy will send an activation email to this address. Check spam or promotions if it does not arrive quickly.
            </p>
          </div>

          <p class="text-center text-[13px] text-[#667085] pt-1">
            Already have an account?
            <NuxtLink :to="loginLink" class="font-semibold text-[#e13515] hover:text-[#b82c10] transition-colors underline underline-offset-2">Sign in</NuxtLink>
          </p>
        </form>
        </template>

        <div class="mt-6 flex items-center gap-2.5 bg-[#f9fafb] border border-[#e4e7ec] rounded-lg px-4 py-3">
          <svg class="w-4 h-4 text-[#667085] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <p class="text-[12px] text-[#667085] leading-snug">
            Your account is protected with <span class="font-semibold text-[#344054]">secure authentication.</span>
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
import PrintyLogo from '~/components/printy/PrintyLogo.vue'
import { getApiErrorDetail, getApiErrorMessage } from '~/shared/api'

definePageMeta({ layout: false })

useHead({
  title: 'Printy - Create Account',
})

const auth = useAuthStore()
const route = useRoute()
const currentYear = new Date().getFullYear()

const name = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const confirmPassword = ref('')
const acceptedTerms = ref(true)
const loading = ref(false)
const resendLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const registrationComplete = ref(false)
const registeredEmail = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const fieldErrors = ref<Record<string, string>>({})
const nextRoute = computed(() => typeof route.query.next === 'string' ? route.query.next : '')
const pendingQuoteFlag = computed(() => route.query.pendingQuote === '1')

const userIcon = '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>'
const emailIcon = '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>'
const phoneIcon = '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>'
const lockIcon = '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>'

const loginLink = computed(() => {
  const params = new URLSearchParams()
  if (nextRoute.value) {
    params.set('next', nextRoute.value)
  }
  if (pendingQuoteFlag.value) {
    params.set('pendingQuote', '1')
  }
  const query = params.toString()
  return query ? `/auth/login?${query}` : '/auth/login'
})

const loginLinkWithEmail = computed(() => {
  const params = new URLSearchParams()
  if (nextRoute.value) {
    params.set('next', nextRoute.value)
  }
  if (pendingQuoteFlag.value) {
    params.set('pendingQuote', '1')
  }
  if (registeredEmail.value.trim()) {
    params.set('email', registeredEmail.value.trim())
  }
  const query = params.toString()
  return query ? `/auth/login?${query}` : '/auth/login'
})

const confirmEmailLink = computed(() => {
  const params = new URLSearchParams()
  if (registeredEmail.value.trim()) {
    params.set('email', registeredEmail.value.trim())
  }
  if (nextRoute.value) {
    params.set('next', nextRoute.value)
  }
  if (pendingQuoteFlag.value) {
    params.set('pendingQuote', '1')
  }
  return `/auth/confirm-email?${params.toString()}`
})

const normalizedRoleQuery = computed(() => {
  const role = typeof route.query.role === 'string' ? route.query.role : ''
  if (role === 'shop_owner' || role === 'production' || role === 'printer') {
    return 'shop'
  }
  if (role === 'partner' || role === 'broker') {
    return 'partner'
  }
  return 'client'
})

const accountType = ref<'client' | 'partner' | 'shop'>(normalizedRoleQuery.value as 'client' | 'partner' | 'shop')

watch(normalizedRoleQuery, (value) => {
  accountType.value = value as 'client' | 'partner' | 'shop'
})

const accountTypeOptions = [
  {
    value: 'client',
    title: 'Client',
    quote: '"I need print work done"',
    copy: 'For requesting quotes, uploading artwork, tracking jobs, and reordering.',
    cardClass: 'type-card-client',
    icon: '<svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>',
  },
  {
    value: 'partner',
    title: 'Partner',
    quote: '"I manage print jobs for clients"',
    copy: 'For designers, agents, resellers, and print consultants.',
    cardClass: 'type-card-partner',
    icon: '<svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
  },
  {
    value: 'shop',
    title: 'Production Shop',
    quote: '"I fulfil print assignments"',
    copy: 'For verified printers and shop production teams.',
    cardClass: 'type-card-shop',
    icon: '<svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>',
  },
] as const

const features = [
  'Managed print estimates',
  'Payment-confirmed jobs',
  'Artwork and proof tracking',
  'Production-ready tracking',
  'Partner quoting tools',
]

const workspaceTypes = [
  {
    title: 'Client',
    copy: 'Order and track print jobs',
    icon: '<svg class="w-3.5 h-3.5 text-[#e13515]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>',
  },
  {
    title: 'Partner',
    copy: 'Quote and manage clients',
    icon: '<svg class="w-3.5 h-3.5 text-[#e13515]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
  },
  {
    title: 'Production Shop',
    copy: 'Fulfil assignments',
    icon: '<svg class="w-3.5 h-3.5 text-[#e13515]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>',
  },
]

const selectedAccountTypeDescription = computed(() => {
  if (accountType.value === 'partner') {
    return {
      title: 'Partners',
      copy: 'can create quotes, manage clients, and track managed jobs through Printy.',
    }
  }
  if (accountType.value === 'shop') {
    return {
      title: 'Production shops',
      copy: 'are reviewed before they can receive assignments and run the production workspace.',
    }
  }
  return {
    title: 'Clients',
    copy: 'can request quotes, upload artwork, track jobs, and reorder from one dashboard.',
  }
})

const passwordStrength = computed(() => {
  let score = 0
  if (password.value.length >= 8) score += 1
  if (/[A-Z]/.test(password.value) && /[a-z]/.test(password.value)) score += 1
  if (/\d/.test(password.value)) score += 1
  if (/[^A-Za-z0-9]/.test(password.value)) score += 1
  return score
})

const passwordStrengthLabel = computed(() => {
  if (password.value.length === 0) return 'Too weak'
  if (passwordStrength.value <= 1) return 'Weak'
  if (passwordStrength.value <= 3) return 'Moderate'
  return 'Strong'
})

const passwordStrengthLabelClass = computed(() => {
  if (passwordStrength.value <= 1) return 'text-[#b42318]'
  if (passwordStrength.value <= 3) return 'text-[#667085]'
  return 'text-[#067647]'
})

const passwordStrengthBars = computed(() => {
  const filled = passwordStrength.value
  return Array.from({ length: 4 }, (_, index) => {
    if (index >= filled) {
      return 'bg-[#e4e7ec]'
    }
    if (filled >= 4) {
      return 'bg-[#12b76a]'
    }
    return index < 2 ? 'bg-[#e13515]' : 'bg-[#f97316]'
  })
})

async function submit() {
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  fieldErrors.value = {}

  if (!name.value.trim()) fieldErrors.value.name = 'Full name is required.'
  if (!email.value.trim()) fieldErrors.value.email = 'Email address is required.'
  if (!password.value) fieldErrors.value.password = 'Password is required.'
  if (password.value && password.value.length < 8) fieldErrors.value.password = 'Password must be at least 8 characters.'
  if (!confirmPassword.value) fieldErrors.value.confirmPassword = 'Confirm your password.'
  if (password.value && confirmPassword.value && password.value !== confirmPassword.value) fieldErrors.value.confirmPassword = 'Passwords do not match.'
  if (!acceptedTerms.value) fieldErrors.value.terms = 'You must agree to the terms and privacy policy.'

  if (Object.keys(fieldErrors.value).length > 0) {
    loading.value = false
    return
  }

  try {
    const result = await auth.register({
      name: name.value.trim(),
      email: email.value.trim(),
      password: password.value,
      role: accountType.value === 'shop' ? 'production' : accountType.value === 'partner' ? 'partner' : 'client',
      partner_profile_enabled: accountType.value === 'partner',
    })

    registeredEmail.value = result.email || email.value.trim()
    registrationComplete.value = true
    successMessage.value = result.detail
  } catch (error: unknown) {
    const apiData = typeof error === 'object' && error && 'data' in error ? (error as { data?: Record<string, unknown> }).data : undefined
    fieldErrors.value = normalizeApiFieldErrors(apiData)
    errorMessage.value = resolveRegisterErrorMessage(error)
  } finally {
    loading.value = false
  }
}

async function resendVerification() {
  if (!registeredEmail.value.trim()) {
    errorMessage.value = 'We need your email address before we can resend verification.'
    return
  }

  resendLoading.value = true
  errorMessage.value = ''
  try {
    const result = await auth.resendConfirmation(registeredEmail.value.trim())
    successMessage.value = result.detail
  } catch (error: unknown) {
    errorMessage.value = getApiErrorMessage(error, 'Printy could not resend the verification email.')
  } finally {
    resendLoading.value = false
  }
}

function resolveRegisterErrorMessage(error: unknown) {
  const detail = String(getApiErrorDetail(error) || '').toLowerCase()
  if (detail.includes('already') && detail.includes('email')) {
    return 'That email is already registered. Try signing in instead.'
  }
  return getApiErrorMessage(error, 'Printy could not create this account.')
}

function normalizeApiFieldErrors(data?: Record<string, unknown>) {
  if (!data) {
    return {}
  }

  const next: Record<string, string> = {}
  const mappings: Record<string, string> = {
    email: 'email',
    password: 'password',
    name: 'name',
    full_name: 'name',
    non_field_errors: 'form',
    detail: 'form',
  }

  for (const [key, value] of Object.entries(data)) {
    const target = mappings[key]
    if (!target) continue
    if (Array.isArray(value)) {
      next[target] = value.map((item) => String(item)).join(' ')
      continue
    }
    if (typeof value === 'string') {
      next[target] = value
    }
  }

  if (next.form && !errorMessage.value) {
    errorMessage.value = next.form
  }

  return next
}
</script>

<style>
.type-card-client:has(input:checked) {
  border-color: #e13515;
  background-color: #fff8f7;
  box-shadow: 0 0 0 3px #fde8e2;
}

.type-card-client:has(input:checked) .type-icon,
.type-card-partner:has(input:checked) .type-icon,
.type-card-shop:has(input:checked) .type-icon {
  background-color: #fef3f2;
  border-color: #fda497;
  color: #e13515;
}

.type-card-client:has(input:checked) .type-label,
.type-card-partner:has(input:checked) .type-label,
.type-card-shop:has(input:checked) .type-label {
  color: #e13515;
}

.type-card-client:has(input:checked) .type-radio-ring,
.type-card-partner:has(input:checked) .type-radio-ring,
.type-card-shop:has(input:checked) .type-radio-ring {
  border-color: #e13515;
}

.type-card-client:has(input:checked) .type-radio-dot,
.type-card-partner:has(input:checked) .type-radio-dot,
.type-card-shop:has(input:checked) .type-radio-dot {
  display: block;
}

.type-card-partner:has(input:checked),
.type-card-shop:has(input:checked) {
  border-color: #e13515;
  background-color: #fff8f7;
  box-shadow: 0 0 0 3px #fde8e2;
}
</style>
