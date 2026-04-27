<template>
  <AuthShell>
    <div class="space-y-3">
      <BaseBadge :tone="hasBuyerHandoff ? 'primary' : 'neutral'">
        {{ roleBadge }}
      </BaseBadge>
      <div class="space-y-1.5">
        <h1 class="text-3xl font-semibold tracking-tight text-[var(--p-text)] md:text-4xl">
          {{ headline }}
        </h1>
        <p class="text-sm leading-6 text-[var(--p-text-muted)]">
          {{ supportingCopy }}
        </p>
      </div>
    </div>

    <form class="space-y-4" novalidate @submit.prevent="submitSignup">
      <div
        v-if="apiError"
        class="rounded-2xl border border-[var(--p-error)]/30 bg-[var(--p-error-soft)] px-4 py-3 text-sm"
      >
        <p class="font-semibold text-[var(--p-error)]">We couldn't create your account yet.</p>
        <p class="mt-0.5 text-[var(--p-text)]">{{ apiError }}</p>
      </div>

      <div v-if="!isRoleLocked" class="space-y-2">
        <p class="text-sm font-medium text-[var(--p-text)]">
          Account type
        </p>
        <div class="grid gap-2">
          <button
            v-for="opt in roleOptions"
            :key="opt.value"
            type="button"
            class="relative rounded-2xl border-2 px-4 py-3.5 text-left transition-all duration-150"
            :class="form.role === opt.value
              ? 'border-[var(--p-primary)] bg-[color:color-mix(in_srgb,var(--p-primary)_6%,transparent)]'
              : 'border-[var(--p-border)] hover:border-[var(--p-primary)]/40 hover:bg-[var(--p-bg-soft)]'"
            @click="form.role = opt.value"
          >
            <span
              v-if="form.role === opt.value"
              class="absolute right-3.5 top-3.5 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--p-primary)] text-white"
              aria-hidden="true"
            >
              <svg class="h-3 w-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="1.5 6 4.5 9 10.5 3" />
              </svg>
            </span>
            <p class="pr-7 text-sm font-semibold text-[var(--p-text)]">{{ opt.label }}</p>
            <p class="mt-0.5 text-xs leading-5 text-[var(--p-text-muted)]">{{ opt.description }}</p>
          </button>
        </div>
      </div>

      <div
        v-else
        class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-bg-soft)] px-4 py-3 text-sm text-[var(--p-text)]"
      >
        <p class="font-semibold">{{ lockedRoleLabel }}</p>
        <p class="mt-0.5 text-[var(--p-text-muted)]">{{ roleHint }}</p>
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

      <label class="flex cursor-pointer select-none items-start gap-3">
        <input
          v-model="form.acceptTerms"
          type="checkbox"
          class="mt-0.5 h-4 w-4 flex-shrink-0 rounded border-[var(--p-border)] accent-[var(--p-primary)]"
          @change="validateField('acceptTerms')"
        >
        <span class="text-sm leading-5 text-[var(--p-text-muted)]">
          I agree to the
          <a href="/terms" class="font-semibold text-[var(--p-primary)] hover:underline">Terms of Service</a>
          and
          <a href="/privacy" class="font-semibold text-[var(--p-primary)] hover:underline">Privacy Policy</a>.
        </span>
      </label>
      <p v-if="fieldErrors.acceptTerms" class="text-xs text-[var(--p-error)]">
        {{ fieldErrors.acceptTerms }}
      </p>

      <BaseButton type="submit" block size="lg" :loading="isSubmitting">
        {{ isSubmitting ? 'Creating your account…' : ctaLabel }}
      </BaseButton>

      <p class="text-xs leading-5 text-[var(--p-text-muted)]">
        {{ footerNote }}
      </p>
    </form>

    <div class="flex flex-wrap gap-2">
      <span
        v-for="chip in trustChips"
        :key="chip"
        class="inline-flex items-center rounded-full border border-[var(--p-border)] bg-[var(--p-bg-soft)] px-3 py-1 text-xs font-medium text-[var(--p-text-muted)]"
      >
        {{ chip }}
      </span>
    </div>

    <p class="text-sm text-[var(--p-text-muted)]">
      Already have an account?
      <NuxtLink :to="loginLink" class="font-semibold text-[var(--p-primary)] hover:underline">
        Log in
      </NuxtLink>
    </p>

    <template #panel>
      <div class="space-y-4">
        <BaseBadge tone="dark">{{ panelContent.badge }}</BaseBadge>
        <div class="space-y-2">
          <h2 class="text-3xl font-semibold tracking-tight text-[var(--p-text-on-dark)]">
            {{ panelContent.headline }}
          </h2>
          <p class="max-w-lg text-sm leading-6 text-[var(--p-text-on-dark-muted)]">
            {{ panelContent.supporting }}
          </p>
        </div>
      </div>
      <div class="grid gap-3">
        <div
          v-for="item in panelContent.benefits"
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
import { useCalculatorDraftRecoveryStore } from '~/stores/calculatorDraftRecovery'
import { usePendingActionStore } from '~/stores/pendingAction'
import { useProfileStore } from '~/stores/profile'
import { useShopStore } from '~/stores/shop'

type SignupRole = 'client' | 'shop_owner' | 'decide_later'
type SignupField = 'firstName' | 'lastName' | 'email' | 'password' | 'passwordConfirmation' | 'acceptTerms'

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

const roleOptions: { value: SignupRole; label: string; description: string }[] = [
  {
    value: 'client',
    label: 'Client account',
    description: 'Send requests, compare shop replies, and save quote history.',
  },
  {
    value: 'shop_owner',
    label: 'Print shop owner',
    description: 'List your shop, add rate cards, and receive cleaner requests.',
  },
  {
    value: 'decide_later',
    label: "I'll decide later",
    description: 'Start simple. Choose a workspace after signup.',
  },
]

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  passwordConfirmation: '',
  role: 'client' as SignupRole,
  acceptTerms: false,
})

const fieldErrors = reactive<Record<SignupField, string>>({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  passwordConfirmation: '',
  acceptTerms: '',
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
  if (Array.isArray(value)) return value.find((entry): entry is string => typeof entry === 'string')
  return undefined
}

function normalizeQueryRole(value: string | undefined): 'client' | 'shop_owner' | null {
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
  const role = normalizeQueryRole(getSingleQueryValue(route.query.role))
  if (role) return role
  return normalizeQueryRole(getSingleQueryValue(route.query.type))
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

const roleBadge = computed(() => {
  if (hasBuyerHandoff.value) return 'Buyer handoff in progress'
  if (effectiveRole.value === 'shop_owner') return 'Print shop owner'
  if (effectiveRole.value === 'decide_later') return 'Getting started'
  return 'Client account'
})

const lockedRoleLabel = computed(() =>
  effectiveRole.value === 'shop_owner' ? 'Print shop owner signup' : 'Client signup',
)

const roleHint = computed(() => (
  effectiveRole.value === 'shop_owner'
    ? 'Best for print shops that want to receive client requests and manage responses.'
    : 'Best for buyers who want to save requests, compare shops, and track replies.'
))

const headline = computed(() => {
  if (hasBuyerHandoff.value) return 'Almost done — create your account so shops can reply.'
  return 'Create your Printy account'
})

const supportingCopy = computed(() => {
  if (hasBuyerHandoff.value) {
    return "We'll save your job details so you do not have to type them again."
  }
  return 'Start as a client, printshop owner, or decide later. You can switch paths as your work grows.'
})

const ctaLabel = computed(() => {
  if (effectiveRole.value === 'shop_owner') return 'Create shop account'
  if (effectiveRole.value === 'decide_later') return 'Create account'
  return 'Create my account'
})

const footerNote = computed(() => (
  hasBuyerHandoff.value
    ? "After signup, we'll keep your saved request attached to this email address. You can verify your email and continue without starting over."
    : "We'll send a verification email before the account can sign in."
))

const trustChips = computed(() => {
  if (effectiveRole.value === 'shop_owner') {
    return ['No listing fee to start', 'You can change this later', 'We only ask for what is needed']
  }
  return ['No payment required', 'You can change this later', 'We only ask for what is needed']
})

const panelContent = computed(() => {
  if (effectiveRole.value === 'shop_owner') {
    return {
      badge: 'Print shop',
      headline: 'Turn your printshop into a quote-ready workspace',
      supporting: 'Add papers, pricing, and finishing so Printy can send cleaner requests.',
      benefits: [
        { title: 'List your shop', body: 'Create a public presence buyers can trust.' },
        { title: 'Add your rate card', body: 'Papers, pricing, and finishing help Printy match real jobs.' },
        { title: 'Receive cleaner requests', body: 'Buyers send structured specs instead of scattered WhatsApp messages.' },
        { title: 'Respond faster', body: 'Use saved setup data to quote with less back-and-forth.' },
      ],
    }
  }
  if (effectiveRole.value === 'decide_later') {
    return {
      badge: 'Getting started',
      headline: 'Start simple. Choose your path later.',
      supporting: 'Create one account now and move into the right workspace when ready.',
      benefits: [
        { title: 'Explore Printy', body: 'Use the calculator and save quote drafts.' },
        { title: 'Switch later', body: 'Become a client or printshop owner when you are ready.' },
        { title: 'Keep your work', body: 'Your saved requests stay with your account.' },
        { title: 'No pressure', body: 'Start with the basics and complete setup later.' },
      ],
    }
  }
  return {
    badge: 'For clients',
    headline: 'Get print prices without chasing shops',
    supporting: 'Save your request once, then compare replies from matching print shops.',
    benefits: [
      { title: 'Request once', body: 'Send one clean job brief instead of calling around.' },
      { title: 'Compare replies', body: 'See price, turnaround, and what each shop needs to confirm.' },
      { title: 'Keep quote history', body: 'Reuse past specs for business cards, flyers, booklets, and more.' },
      { title: 'No payment required', body: 'Shops confirm before anything is final.' },
    ],
  }
})

const loginLink = computed(() => ({
  path: '/auth/login',
  query: {
    ...(requestedRedirect.value ? { redirect: requestedRedirect.value } : {}),
    ...(effectiveRole.value && effectiveRole.value !== 'decide_later' ? { role: effectiveRole.value } : {}),
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
    if (!email) { fieldErrors.email = 'Enter your email address.'; return }
    fieldErrors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '' : 'Enter a valid email address.'
    return
  }
  if (field === 'password') {
    if (!form.password) { fieldErrors.password = 'Create a password.'; return }
    fieldErrors.password = form.password.length >= 8 ? '' : 'Use at least 8 characters.'
    if (form.passwordConfirmation) validateField('passwordConfirmation')
    return
  }
  if (field === 'passwordConfirmation') {
    if (!form.passwordConfirmation) { fieldErrors.passwordConfirmation = 'Confirm your password.'; return }
    fieldErrors.passwordConfirmation = form.passwordConfirmation === form.password ? '' : 'Passwords do not match.'
    return
  }
  if (field === 'acceptTerms') {
    fieldErrors.acceptTerms = form.acceptTerms ? '' : 'Please accept the terms to continue.'
  }
}

function validateForm() {
  const fields: SignupField[] = ['firstName', 'lastName', 'email', 'password', 'passwordConfirmation', 'acceptTerms']
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
        ...(effectiveRole.value !== 'decide_later' ? { role: effectiveRole.value } : {}),
      },
    })
    return
  }

  notification.warning(
    loginResult.error ?? 'Your account was created, but we could not sign you in yet.',
    'Account created',
  )
  await router.push({
    path: '/auth/verify-email',
    query: {
      email,
      redirect: requestedRedirect.value,
      ...(effectiveRole.value !== 'decide_later' ? { role: effectiveRole.value } : {}),
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

  try {
    const backendRole = effectiveRole.value === 'decide_later' ? undefined : effectiveRole.value

    const result = await authStore.signup({
      email: form.email.trim().toLowerCase(),
      password: form.password,
      first_name: form.firstName.trim(),
      last_name: form.lastName.trim(),
      ...(backendRole !== undefined ? { role: backendRole } : {}),
    })

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
  finally {
    isSubmitting.value = false
  }
}
</script>
