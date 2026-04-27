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
            <BaseBadge :tone="hasBuyerHandoff ? 'primary' : 'neutral'">
              {{ hasBuyerHandoff ? 'Buyer handoff in progress' : roleBadge }}
            </BaseBadge>
            <div class="space-y-2">
              <h1 class="text-3xl font-semibold tracking-tight text-[var(--p-text)] md:text-4xl">
                {{ headline }}
              </h1>
              <p class="max-w-xl text-sm leading-6 text-[var(--p-text-muted)]">
                {{ supportingCopy }}
              </p>
            </div>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="chip in reassuranceChips"
                :key="chip"
                class="rounded-full border border-[var(--p-border)] bg-[var(--p-bg-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--p-text-muted)]"
              >
                {{ chip }}
              </span>
            </div>
          </div>

          <form class="space-y-4" novalidate @submit.prevent="submitSignup">
            <div v-if="apiError" class="rounded-2xl border border-[var(--p-error)]/30 bg-[var(--p-error-soft)] px-4 py-3 text-sm text-[var(--p-text)]">
              <p class="font-semibold text-[var(--p-error)]">We couldn&apos;t create your account yet.</p>
              <p class="mt-1">{{ apiError }}</p>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <BaseInput
                id="signup-first-name"
                v-model="form.firstName"
                label="First name"
                placeholder="Amina"
                name="first_name"
                autocomplete="given-name"
                :error="fieldErrors.firstName"
                required
                @blur="validateField('firstName')"
              />
              <BaseInput
                id="signup-last-name"
                v-model="form.lastName"
                label="Last name"
                placeholder="Otieno"
                name="last_name"
                autocomplete="family-name"
                :error="fieldErrors.lastName"
                required
                @blur="validateField('lastName')"
              />
            </div>

            <BaseInput
              id="signup-email"
              v-model="form.email"
              label="Email address"
              placeholder="you@example.com"
              name="email"
              autocomplete="email"
              :error="fieldErrors.email"
              required
              @blur="validateField('email')"
            />

            <BaseSelect
              v-if="!isRoleLocked"
              id="signup-role"
              v-model="form.role"
              label="Account type"
              name="role"
              :options="accountTypes"
              :hint="roleHint"
            />

            <div v-else class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-bg-soft)] px-4 py-3 text-sm text-[var(--p-text)]">
              <p class="font-semibold">{{ lockedRoleLabel }}</p>
              <p class="mt-1 text-[var(--p-text-muted)]">{{ roleHint }}</p>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <BaseInput
                id="signup-password"
                v-model="form.password"
                label="Password"
                placeholder="Create password"
                type="password"
                name="password"
                autocomplete="new-password"
                hint="Use at least 8 characters."
                :error="fieldErrors.password"
                required
                @blur="validateField('password')"
              />
              <BaseInput
                id="signup-password-confirmation"
                v-model="form.passwordConfirmation"
                label="Confirm password"
                placeholder="Repeat password"
                type="password"
                name="password_confirmation"
                autocomplete="new-password"
                :error="fieldErrors.passwordConfirmation"
                required
                @blur="validateField('passwordConfirmation')"
              />
            </div>

            <BaseButton type="submit" block size="lg" :loading="isSubmitting">
              {{ ctaLabel }}
            </BaseButton>

            <p class="text-xs leading-5 text-[var(--p-text-muted)]">
              {{ footerNote }}
            </p>
          </form>

          <p class="text-sm text-[var(--p-text-muted)]">
            Already have an account?
            <NuxtLink :to="loginLink" class="font-semibold text-[var(--p-primary)] hover:underline">
              Log in
            </NuxtLink>
          </p>
        </BaseCard>

        <BaseCard tone="dark" class="flex flex-col justify-between gap-8">
          <div class="space-y-4">
            <BaseBadge tone="dark">What happens next</BaseBadge>
            <div class="space-y-3">
              <h2 class="text-3xl font-semibold tracking-tight text-[var(--p-text-on-dark)]">
                {{ sideTitle }}
              </h2>
              <p class="max-w-lg text-sm leading-6 text-[var(--p-text-on-dark-muted)]">
                {{ sideCopy }}
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
import BaseSelect from '~/components/ui/BaseSelect.vue'
import { useNotification } from '~/composables/useNotification'
import { resolvePostLoginRedirectPath } from '~/composables/useAuth'
import { useAuthStore } from '~/stores/auth'
import { useCalculatorDraftRecoveryStore } from '~/stores/calculatorDraftRecovery'
import { usePendingActionStore } from '~/stores/pendingAction'
import { useProfileStore } from '~/stores/profile'
import { useShopStore } from '~/stores/shop'

type SignupField = 'firstName' | 'lastName' | 'email' | 'password' | 'passwordConfirmation'
type SignupRole = 'client' | 'shop_owner'

definePageMeta({
  middleware: ['guest'],
})

const authStore = useAuthStore()
const profileStore = useProfileStore()
const shopStore = useShopStore()
const pendingActionStore = usePendingActionStore()
const calculatorDraftRecoveryStore = useCalculatorDraftRecoveryStore()
const notification = useNotification()
const route = useRoute()
const router = useRouter()
const isSubmitting = ref(false)
const apiError = ref('')

const accountTypes = [
  { label: 'Client', value: 'client' },
  { label: 'Print shop', value: 'shop_owner' },
]

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  passwordConfirmation: '',
  role: 'client' as SignupRole,
})

const fieldErrors = reactive<Record<SignupField, string>>({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  passwordConfirmation: '',
})

function hydrateFromPendingAction() {
  const payload = pendingActionStore.action?.payload as { requestDetailsSnapshot?: Record<string, unknown> } | undefined
  const requestDetails = payload?.requestDetailsSnapshot ?? {}
  const fullName = typeof requestDetails.customer_name === 'string' ? requestDetails.customer_name.trim() : ''
  const email = typeof requestDetails.customer_email === 'string' ? requestDetails.customer_email.trim().toLowerCase() : ''

  if (fullName && !form.firstName && !form.lastName) {
    const [firstName, ...rest] = fullName.split(/\s+/)
    form.firstName = firstName ?? ''
    form.lastName = rest.join(' ')
  }

  if (email && !form.email) {
    form.email = email
  }
}

function getSingleQueryValue(value: unknown): string | undefined {
  if (typeof value === 'string') return value
  if (Array.isArray(value)) {
    const firstString = value.find((entry): entry is string => typeof entry === 'string')
    return firstString
  }
  return undefined
}

function normalizeRole(value: string | undefined): SignupRole | null {
  if (value === 'client') return 'client'
  if (value === 'shop_owner' || value === 'shop') return 'shop_owner'
  return null
}

function normalizeRedirect(value: string | undefined): string {
  if (!value || !value.startsWith('/')) return '/'
  if (value.startsWith('//') || value.startsWith('/auth')) return '/'
  return value
}

const requestedRole = computed(() => {
  const role = normalizeRole(getSingleQueryValue(route.query.role))
  if (role) return role
  return normalizeRole(getSingleQueryValue(route.query.type))
})

const requestedRedirect = computed(() => normalizeRedirect(getSingleQueryValue(route.query.redirect)))
const isRoleLocked = computed(() => Boolean(requestedRole.value))
const effectiveRole = computed<SignupRole>(() => requestedRole.value ?? form.role)
const hasBuyerHandoff = computed(() =>
  effectiveRole.value === 'client'
  && (
    pendingActionStore.action?.name === 'saveAndSend'
    || Boolean(calculatorDraftRecoveryStore.guestDraft)
  ),
)

watchEffect(() => {
  if (requestedRole.value) {
    form.role = requestedRole.value
  }
})

watchEffect(() => {
  if (hasBuyerHandoff.value) {
    hydrateFromPendingAction()
  }
})

const roleBadge = computed(() => effectiveRole.value === 'client' ? 'Client account' : 'Print shop account')
const lockedRoleLabel = computed(() => effectiveRole.value === 'client' ? 'Client signup' : 'Print shop signup')
const headline = computed(() => {
  if (hasBuyerHandoff.value) return 'Almost done - create your account so shops can reply.'
  return effectiveRole.value === 'client' ? 'Create your Printy account' : 'Create your Printy shop account'
})
const supportingCopy = computed(() => {
  if (hasBuyerHandoff.value) {
    return 'We\'ll save your job details so you do not have to type them again.'
  }
  if (effectiveRole.value === 'client') {
    return 'Save your print request, get shop replies, and compare prices without calling around.'
  }
  return 'Set up your Printy presence so buyers can find your shop, send real quote requests, and keep the conversation in one place.'
})
const reassuranceChips = computed(() => (
  effectiveRole.value === 'client'
    ? ['No payment required', 'Keep your quote history', 'Get replies from real shops']
    : ['No listing fee to start', 'Receive buyer requests', 'Keep your shop details organized']
))
const roleHint = computed(() => (
  effectiveRole.value === 'client'
    ? 'Best for buyers who want to save requests, compare shops, and track replies.'
    : 'Best for print shops that want to receive client requests and manage responses.'
))
const ctaLabel = computed(() => effectiveRole.value === 'client' ? 'Create account' : 'Create shop account')
const footerNote = computed(() => (
  hasBuyerHandoff.value
    ? 'After signup, we\'ll keep your saved request attached to this email address. You can verify your email and continue without starting over.'
    : 'We\'ll send a verification email before the account can sign in.'
))
const sideTitle = computed(() => (
  effectiveRole.value === 'client'
    ? 'Signup should move you forward, not make you repeat the job.'
    : 'Bring your shop into the same flow buyers already use to request quotes.'
))
const sideCopy = computed(() => (
  effectiveRole.value === 'client'
    ? 'Printy keeps the request trail clean: create the account, verify your email, and pick up from the same quote flow.'
    : 'Once your shop account is ready, Printy can route marketplace demand into your dashboard instead of scattered calls and chats.'
))
const sideSteps = computed(() => (
  effectiveRole.value === 'client'
    ? [
        { title: '1. Create the account', body: 'Use the same email you want shops to reply to.' },
        { title: '2. Verify your email', body: 'Printy sends a confirmation link immediately after signup.' },
        { title: '3. Continue the request', body: hasBuyerHandoff.value ? 'Your draft and selected shops stay attached to this flow.' : 'After verification, log in and continue from your dashboard.' },
      ]
    : [
        { title: '1. Create the account', body: 'Start with the shop owner email you want tied to Printy.' },
        { title: '2. Verify your email', body: 'Email verification protects the dashboard and future staff invites.' },
        { title: '3. Complete onboarding', body: 'After login, continue into the shop setup flow.' },
      ]
))
const loginLink = computed(() => ({
  path: '/auth/login',
  query: {
    ...(requestedRedirect.value ? { redirect: requestedRedirect.value } : {}),
    ...(effectiveRole.value ? { role: effectiveRole.value } : {}),
  },
}))

function validateField(field: SignupField) {
  const email = form.email.trim()

  if (field === 'firstName') {
    fieldErrors.firstName = form.firstName.trim() ? '' : 'Enter your first name.'
    return
  }

  if (field === 'lastName') {
    fieldErrors.lastName = form.lastName.trim() ? '' : 'Enter your last name.'
    return
  }

  if (field === 'email') {
    if (!email) {
      fieldErrors.email = 'Enter your email address.'
      return
    }
    fieldErrors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '' : 'Enter a valid email address.'
    return
  }

  if (field === 'password') {
    if (!form.password) {
      fieldErrors.password = 'Create a password.'
      return
    }
    fieldErrors.password = form.password.length >= 8 ? '' : 'Use at least 8 characters.'
    if (form.passwordConfirmation) {
      validateField('passwordConfirmation')
    }
    return
  }

  if (!form.passwordConfirmation) {
    fieldErrors.passwordConfirmation = 'Confirm your password.'
    return
  }
  fieldErrors.passwordConfirmation = form.passwordConfirmation === form.password
    ? ''
    : 'Passwords do not match.'
}

function validateForm() {
  const fields: SignupField[] = ['firstName', 'lastName', 'email', 'password', 'passwordConfirmation']
  fields.forEach(validateField)
  return !fields.some(field => fieldErrors[field])
}

async function handleSuccessfulSignup(email: string) {
  const loginResult = await authStore.login(email, form.password, true)

  if (loginResult.success) {
    await profileStore.fetchProfile().catch(() => {})

    if (authStore.normalizedRole === 'shop_owner' || authStore.normalizedRole === 'staff') {
      await shopStore.fetchMyShops().catch(() => {})
    }

    const redirectPath = resolvePostLoginRedirectPath(
      authStore.user,
      (shopStore.myShops?.length ?? 0) > 0,
      requestedRedirect.value,
    )
    notification.success('Your account is ready.', 'Signup complete')
    await router.push(redirectPath)
    return
  }

  if (loginResult.code === 'email_not_verified') {
    notification.info('Check your inbox to verify your email, then continue where you left off.', 'Verify your email')
    await router.push({
      path: '/auth/verify-email',
      query: {
        email,
        redirect: requestedRedirect.value,
        role: effectiveRole.value,
      },
    })
    return
  }

  notification.warning(loginResult.error ?? 'Your account was created, but we could not sign you in yet.', 'Account created')
  await router.push({
    path: '/auth/verify-email',
    query: {
      email,
      redirect: requestedRedirect.value,
      role: effectiveRole.value,
    },
  })
}

async function submitSignup() {
  apiError.value = ''

  if (!validateForm()) {
    apiError.value = 'Review the highlighted fields and try again.'
    return
  }

  isSubmitting.value = true

  const result = await authStore.signup({
    email: form.email.trim().toLowerCase(),
    password: form.password,
    first_name: form.firstName.trim(),
    last_name: form.lastName.trim(),
    role: effectiveRole.value,
  })

  isSubmitting.value = false

  if (!result.success) {
    apiError.value = result.error ?? 'We could not create your account right now.'
    const backendFieldErrors = result.fieldErrors ?? {}
    fieldErrors.firstName = backendFieldErrors.first_name ?? fieldErrors.firstName
    fieldErrors.lastName = backendFieldErrors.last_name ?? fieldErrors.lastName
    fieldErrors.email = backendFieldErrors.email ?? fieldErrors.email
    fieldErrors.password = backendFieldErrors.password ?? fieldErrors.password
    fieldErrors.passwordConfirmation = backendFieldErrors.password_confirmation ?? fieldErrors.passwordConfirmation
    notification.error(apiError.value, 'Signup failed')
    return
  }

  await handleSuccessfulSignup(form.email.trim().toLowerCase())
}
</script>
