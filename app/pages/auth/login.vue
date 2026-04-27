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
import { useNotification } from '~/composables/useNotification'
import { resolvePostLoginRedirectPath } from '~/composables/useAuth'
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
const notification = useNotification()
const route = useRoute()
const router = useRouter()
const isSubmitting = ref(false)
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

async function submitLogin() {
  apiError.value = ''

  if (!validateForm()) {
    apiError.value = 'Check your email and password and try again.'
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
        notification.info('Check your inbox to verify your email, then log in.', 'Verify your email')
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
      notification.error(apiError.value, 'Sign in failed')
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

    notification.success('Opening your workspace…', 'Welcome back')
    await router.push(redirectPath)
  }
  finally {
    isSubmitting.value = false
  }
}
</script>
