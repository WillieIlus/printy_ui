<template>
  <AuthShell>
    <div class="space-y-3">
      <BaseBadge tone="primary">Welcome back</BaseBadge>
      <div class="space-y-1.5">
        <h1 class="text-3xl font-semibold tracking-tight text-[var(--p-text)] md:text-4xl">
          Pick up your print requests
        </h1>
        <p class="text-sm leading-6 text-[var(--p-text-muted)]">
          Sign in to view saved quotes, shop replies, and print job progress.
        </p>
      </div>
    </div>

    <form class="space-y-4" novalidate @submit.prevent="submitLogin">
      <div
        v-if="apiError"
        class="rounded-2xl border border-[var(--p-error)]/30 bg-[var(--p-error-soft)] px-4 py-3 text-sm"
      >
        <p class="font-semibold text-[var(--p-error)]">We couldn't sign you in.</p>
        <p class="mt-0.5 text-[var(--p-text)]">{{ apiError }}</p>
      </div>

      <BaseInput
        id="login-email"
        v-model="form.email"
        label="Email address"
        placeholder="you@example.com"
        type="email"
        name="email"
        autocomplete="email"
        :error="fieldErrors.email"
        required
        @blur="validateField('email')"
      />

      <BaseInput
        id="login-password"
        v-model="form.password"
        label="Password"
        placeholder="Enter your password"
        type="password"
        name="password"
        autocomplete="current-password"
        :error="fieldErrors.password"
        required
        @blur="validateField('password')"
      />

      <div class="flex items-center justify-between gap-4">
        <label class="flex cursor-pointer select-none items-center gap-2">
          <input
            v-model="form.rememberMe"
            type="checkbox"
            class="h-4 w-4 rounded border-[var(--p-border)] accent-[var(--p-primary)]"
          >
          <span class="text-sm text-[var(--p-text-muted)]">Stay signed in</span>
        </label>
        <button
          type="button"
          class="text-sm text-[var(--p-primary)] hover:underline focus-visible:outline-none"
          @click="showForgotNote = !showForgotNote"
        >
          Forgot password?
        </button>
      </div>

      <div
        v-if="showForgotNote"
        class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-bg-soft)] px-4 py-3 text-sm text-[var(--p-text-muted)]"
      >
        Password reset is coming soon. Contact
        <a
          href="mailto:support@printy.ke"
          class="font-semibold text-[var(--p-primary)] hover:underline"
        >support@printy.ke</a>
        if you are locked out.
      </div>

      <BaseButton type="submit" block size="lg" :loading="isSubmitting">
        {{ isSubmitting ? 'Opening workspace…' : 'Open my workspace' }}
      </BaseButton>
    </form>

    <div v-if="googleAuth.isConfigured.value" class="relative">
      <div class="absolute inset-0 flex items-center">
        <span class="w-full border-t border-[var(--p-border)]" />
      </div>
      <div class="relative flex justify-center text-xs">
        <span class="bg-[var(--p-bg)] px-3 text-[var(--p-text-muted)]">or continue with</span>
      </div>
    </div>

    <button
      v-if="googleAuth.isConfigured.value"
      type="button"
      class="flex w-full items-center justify-center gap-3 rounded-2xl border border-[var(--p-border)] bg-[var(--p-bg-soft)] px-4 py-3 text-sm font-medium text-[var(--p-text)] transition hover:bg-[var(--p-bg)] focus-visible:outline-none disabled:opacity-60"
      :disabled="isGoogleLoading"
      @click="handleGoogleLogin"
    >
      <svg v-if="isGoogleLoading" class="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
      <svg v-else viewBox="0 0 24 24" class="size-4" aria-hidden="true">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      {{ isGoogleLoading ? 'Connecting…' : 'Continue with Google' }}
    </button>

    <div class="flex flex-wrap gap-2">
      <span class="inline-flex items-center gap-1.5 rounded-full border border-[var(--p-border)] bg-[var(--p-bg-soft)] px-3 py-1 text-xs font-medium text-[var(--p-text-muted)]">
        <svg class="h-3 w-3 flex-shrink-0" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M8 1a3.5 3.5 0 0 0-3.5 3.5V6H4a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-.5V4.5A3.5 3.5 0 0 0 8 1zm2.5 5V4.5a2.5 2.5 0 0 0-5 0V6h5z" clip-rule="evenodd" />
        </svg>
        Secure sign in
      </span>
      <span class="inline-flex items-center rounded-full border border-[var(--p-border)] bg-[var(--p-bg-soft)] px-3 py-1 text-xs font-medium text-[var(--p-text-muted)]">
        Your quote history stays private
      </span>
    </div>

    <p class="text-sm text-[var(--p-text-muted)]">
      Need a new account?
      <NuxtLink :to="signupLink" class="font-semibold text-[var(--p-primary)] hover:underline">
        Create one
      </NuxtLink>
    </p>

    <template #panel>
      <div class="space-y-4">
        <BaseBadge tone="dark">Your workspace</BaseBadge>
        <div class="space-y-2">
          <h2 class="text-3xl font-semibold tracking-tight text-[var(--p-text-on-dark)]">
            Your print work stays organized
          </h2>
          <p class="max-w-lg text-sm leading-6 text-[var(--p-text-on-dark-muted)]">
            Return to saved requests, compare shop replies, or manage your printshop workspace.
          </p>
        </div>
      </div>
      <div class="grid gap-3">
        <div
          v-for="item in panelBenefits"
          :key="item.title"
          class="rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-4"
        >
          <p class="text-sm font-semibold text-[var(--p-text-on-dark)]">{{ item.title }}</p>
          <p class="mt-1 text-sm leading-6 text-[var(--p-text-on-dark-muted)]">{{ item.body }}</p>
        </div>
      </div>
    </template>
  </AuthShell>
</template>

<script setup lang="ts">
import AuthShell from '~/components/auth/AuthShell.vue'
import BaseBadge from '~/components/ui/BaseBadge.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseInput from '~/components/ui/BaseInput.vue'
import { resolvePostLoginRedirectPath } from '~/composables/useAuth'
import { useGoogleAuth } from '~/composables/useGoogleAuth'
import { usePrintyToast } from '~/composables/usePrintyToast'
import { useAuthStore } from '~/stores/auth'
import { useProfileStore } from '~/stores/profile'
import { useShopStore } from '~/stores/shop'

type LoginField = 'email' | 'password'

definePageMeta({
  middleware: ['guest'],
})

const authStore = useAuthStore()
const profileStore = useProfileStore()
const shopStore = useShopStore()
const toast = usePrintyToast()
const googleAuth = useGoogleAuth()
const route = useRoute()
const router = useRouter()
const isSubmitting = ref(false)
const isGoogleLoading = ref(false)
const apiError = ref('')
const showForgotNote = ref(false)

const form = reactive({
  email: '',
  password: '',
  rememberMe: false,
})

const fieldErrors = reactive<Record<LoginField, string>>({
  email: '',
  password: '',
})

function getSingleQueryValue(value: unknown): string | undefined {
  if (typeof value === 'string') return value
  if (Array.isArray(value)) return value.find((e): e is string => typeof e === 'string')
  return undefined
}

function normalizeRole(value: string | undefined) {
  if (value === 'shop_owner' || value === 'shop') return 'shop_owner'
  if (value === 'client') return 'client'
  return null
}

function normalizeRedirect(value: string | undefined): string {
  if (!value || !value.startsWith('/')) return '/'
  if (value.startsWith('//') || value.startsWith('/auth')) return '/'
  return value
}

const requestedRole = computed(() => normalizeRole(getSingleQueryValue(route.query.role)))
const requestedRedirect = computed(() => normalizeRedirect(getSingleQueryValue(route.query.redirect)))

const signupLink = computed(() => ({
  path: '/auth/signup',
  query: {
    ...(requestedRedirect.value !== '/' ? { redirect: requestedRedirect.value } : {}),
    role: requestedRole.value ?? 'client',
  },
}))

const panelBenefits = [
  { title: 'Saved requests', body: 'Continue quotes and job details without retyping.' },
  { title: 'Shop replies', body: 'See prices, turnaround, and what each shop needs to confirm.' },
  { title: 'Quote history', body: 'Reuse previous specs and compare what changed.' },
  { title: 'Right workspace', body: 'Clients, staff, and shop owners land where they need to work.' },
]

function validateField(field: LoginField) {
  if (field === 'email') {
    if (!form.email.trim()) {
      fieldErrors.email = 'Enter your email address.'
      return
    }
    fieldErrors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
      ? ''
      : 'Enter a valid email address.'
    return
  }
  fieldErrors.password = form.password ? '' : 'Enter your password.'
}

function validateForm() {
  const fields: LoginField[] = ['email', 'password']
  fields.forEach(validateField)
  return !fields.some(f => fieldErrors[f])
}

async function handleGoogleLogin() {
  apiError.value = ''
  isGoogleLoading.value = true
  try {
    const result = await googleAuth.signInWithGoogle(requestedRole.value === 'shop_owner' ? 'shop_owner' : 'client')
    if (!result.success || !result.access || !result.refresh) {
      apiError.value = result.error ?? 'Google sign-in failed. Please try email login.'
      toast.authFailed(apiError.value)
      return
    }
    await authStore.loginWithSocialToken(result.access, result.refresh)
    await profileStore.fetchProfile().catch(() => {})
    if (authStore.isShopOwner || authStore.isStaffRole) {
      await shopStore.fetchMyShops().catch(() => {})
    }
    const redirectPath = resolvePostLoginRedirectPath(
      authStore.user,
      (shopStore.myShops?.length ?? 0) > 0,
      requestedRedirect.value,
    )
    toast.loginSuccess()
    await router.push(redirectPath)
  } catch (error) {
    apiError.value = error instanceof Error ? error.message : 'Google sign-in failed. Please try again.'
    toast.authFailed(apiError.value)
  } finally {
    isGoogleLoading.value = false
  }
}

async function submitLogin() {
  apiError.value = ''

  if (!validateForm()) {
    apiError.value = 'Check your email and password and try again.'
    toast.authFailed(apiError.value)
    return
  }

  isSubmitting.value = true

  try {
    const result = await authStore.login(
      form.email.trim().toLowerCase(),
      form.password,
      form.rememberMe,
    )

    if (!result.success) {
      if (result.code === 'email_not_verified') {
        toast.info('Verify your email', 'Check your inbox to verify your email, then log in.', { context: 'auth' })
        await router.push({
          path: '/auth/verify-email',
          query: {
            email: form.email.trim().toLowerCase(),
            redirect: requestedRedirect.value,
          },
        })
        return
      }
      apiError.value = result.error ?? "We couldn't sign you in. Check your email and password."
      toast.authFailed(apiError.value)
      return
    }

    await profileStore.fetchProfile().catch(() => {})

    if (authStore.isShopOwner || authStore.isStaffRole) {
      await shopStore.fetchMyShops().catch(() => {})
    }

    const redirectPath = resolvePostLoginRedirectPath(
      authStore.user,
      (shopStore.myShops?.length ?? 0) > 0,
      requestedRedirect.value,
    )

    toast.loginSuccess()
    await router.push(redirectPath)
  }
  finally {
    isSubmitting.value = false
  }
}
</script>
