<template>
  <section class="relative overflow-hidden bg-[var(--p-bg)]">
    <div class="absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(circle_at_top_left,_rgba(225,53,21,0.18),_transparent_45%),radial-gradient(circle_at_top_right,_rgba(255,184,0,0.18),_transparent_36%)]" />
    <div class="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-10 md:px-6">
      <div class="grid w-full gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <BaseCard class="space-y-6">
          <NuxtLink
            to="/"
            aria-label="Go to Printy homepage"
            class="inline-flex items-center gap-3 rounded-full px-1 py-1 transition-opacity hover:opacity-90"
          >
            <span class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-[#e13515]">
              <img
                src="/assets/logo-mark/light/printy-logo-mark-01.svg"
                alt=""
                class="h-full w-full object-cover"
              >
            </span>
            <img
              src="/assets/word-mark/dark/printy-word-mark-03.svg"
              alt="Printy"
              class="h-5 w-auto"
            >
          </NuxtLink>

          <div class="space-y-3">
            <BaseBadge tone="primary">
              {{ requestedRole === 'shop_owner' ? 'Shop owner login' : 'Client login' }}
            </BaseBadge>
            <div class="space-y-2">
              <h1 class="text-3xl font-semibold tracking-tight text-[var(--p-text)] md:text-4xl">
                Welcome back
              </h1>
              <p class="max-w-xl text-sm leading-6 text-[var(--p-text-muted)]">
                {{ requestedRole === 'shop_owner'
                  ? 'Log in to manage your shop and incoming requests.'
                  : 'Log in to your Printy account.' }}
              </p>
            </div>
          </div>

          <form class="space-y-4" novalidate @submit.prevent="submitLogin">
            <div v-if="apiError" class="rounded-2xl border border-[var(--p-error)]/30 bg-[var(--p-error-soft)] px-4 py-3 text-sm text-[var(--p-text)]">
              <p class="font-semibold text-[var(--p-error)]">Login failed.</p>
              <p class="mt-1">{{ apiError }}</p>
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
              placeholder="Enter password"
              type="password"
              name="password"
              autocomplete="current-password"
              :error="fieldErrors.password"
              required
              @blur="validateField('password')"
            />

            <BaseButton type="submit" block size="lg" :loading="isSubmitting">
              Log in
            </BaseButton>
          </form>

          <p class="text-sm text-[var(--p-text-muted)]">
            Don't have an account?
            <NuxtLink :to="signupLink" class="font-semibold text-[var(--p-primary)] hover:underline">
              Sign up
            </NuxtLink>
          </p>
        </BaseCard>

        <BaseCard tone="dark" class="flex flex-col justify-between gap-8">
          <div class="space-y-4">
            <BaseBadge tone="dark">Your workspace</BaseBadge>
            <div class="space-y-2">
              <h2 class="text-3xl font-semibold tracking-tight text-[var(--p-text-on-dark)]">
                {{ requestedRole === 'shop_owner' ? 'Pick up where you left off.' : 'Your print requests, in one place.' }}
              </h2>
              <p class="max-w-lg text-sm leading-6 text-[var(--p-text-on-dark-muted)]">
                {{ requestedRole === 'shop_owner'
                  ? 'Your incoming requests and quotes are waiting. Log in to continue the conversation.'
                  : 'Log in to view your saved quotes, pending shop replies, and print history.' }}
              </p>
            </div>
          </div>
          <div class="grid gap-3">
            <div
              v-for="item in sideSteps"
              :key="item.title"
              class="rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-4"
            >
              <p class="text-sm font-semibold text-[var(--p-text-on-dark)]">{{ item.title }}</p>
              <p class="mt-1 text-sm leading-6 text-[var(--p-text-on-dark-muted)]">{{ item.body }}</p>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import BaseBadge from '~/components/ui/BaseBadge.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseCard from '~/components/ui/BaseCard.vue'
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

const form = reactive({
  email: '',
  password: '',
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

const sideSteps = computed(() =>
  requestedRole.value === 'shop_owner'
    ? [
        { title: 'Incoming requests', body: 'Buyers contact you directly through Printy.' },
        { title: 'Quote management', body: 'Respond, send quotes, and track conversations.' },
        { title: 'Shop dashboard', body: 'Manage your setup, pricing, and availability.' },
      ]
    : [
        { title: 'Saved requests', body: 'Access your print requests and shop replies.' },
        { title: 'Quote history', body: 'Compare offers and track job progress.' },
        { title: 'Continue your flow', body: 'Pick up any in-progress quote where you left off.' },
      ],
)

function validateField(field: LoginField) {
  if (field === 'email') {
    if (!form.email.trim()) {
      fieldErrors.email = 'Enter your email address.'
      return
    }
    fieldErrors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) ? '' : 'Enter a valid email address.'
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
    apiError.value = 'Review the highlighted fields and try again.'
    return
  }

  isSubmitting.value = true

  const result = await authStore.login(form.email.trim().toLowerCase(), form.password)

  isSubmitting.value = false

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
    apiError.value = result.error ?? 'Login failed. Check your email and password.'
    notification.error(apiError.value, 'Login failed')
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

  notification.success('Welcome back!', 'Logged in')
  await router.push(redirectPath)
}
</script>
