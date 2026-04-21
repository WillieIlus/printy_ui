<template>
  <VeeForm v-slot="{ meta }" :validation-schema="signupSchema" @submit="onSubmit">
    <div class="space-y-4">
      <UAlert
        v-if="errorMessage"
        color="error"
        icon="i-lucide-alert-circle"
        title="Could not create account"
        :description="errorMessage"
        class="rounded-lg"
      />
      <UAlert
        v-if="successMessage"
        color="success"
        icon="i-lucide-check-circle"
        title="Account created"
        :description="successMessage"
        class="rounded-lg"
      />
      <div class="space-y-3">
        <div>
          <p class="text-sm font-semibold text-[var(--p-text)]">How will you use Printy?</p>
          <p class="mt-1 text-sm text-[var(--p-text-muted)]">
            You can create an account without a shop. Shop setup starts later only if you choose the shop owner path.
          </p>
        </div>
        <div class="grid gap-3">
          <button
            v-for="option in startOptions"
            :key="option.key"
            type="button"
            class="rounded-xl border px-4 py-3 text-left transition-colors"
            :class="selectedStartKey === option.key
              ? 'border-flamingo-400 bg-flamingo-50/70 dark:border-flamingo-500 dark:bg-flamingo-950/30'
              : 'border-[var(--p-border)] bg-[var(--p-surface-sunken)] hover:border-flamingo-300/60'"
            @click="selectedStartKey = option.key"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-sm font-semibold text-[var(--p-text)]">{{ option.label }}</p>
                <p class="mt-1 text-sm text-[var(--p-text-muted)]">{{ option.description }}</p>
              </div>
              <UIcon
                :name="selectedStartKey === option.key ? 'i-lucide-check-circle-2' : 'i-lucide-circle'"
                class="mt-0.5 h-5 w-5 shrink-0"
                :class="selectedStartKey === option.key ? 'text-flamingo-500' : 'text-[var(--p-text-muted)]'"
              />
            </div>
          </button>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <FormsFormInput name="first_name" label="First Name" autocomplete="given-name" placeholder="John" icon="i-lucide-user" required />
        <FormsFormInput name="last_name" label="Last Name" autocomplete="family-name" placeholder="Doe" icon="i-lucide-user" required />
      </div>
      <FormsFormInput name="email" label="Email" type="email" autocomplete="email" placeholder="john@example.com" icon="i-lucide-mail" required />
      <FormsFormInput name="password" label="Password" type="password" autocomplete="new-password" placeholder="Create a password" icon="i-lucide-lock" required />
      <FormsFormInput name="password_confirm" label="Confirm Password" type="password" autocomplete="new-password" placeholder="Confirm your password" icon="i-lucide-lock" required />
      <label
        class="flex items-start gap-3 rounded-xl border-2 px-4 py-3 transition-all cursor-pointer select-none"
        :class="agreeTerms
          ? 'border-flamingo-500 bg-flamingo-50 dark:bg-flamingo-950/30 dark:border-flamingo-500'
          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 hover:border-gray-400 dark:hover:border-gray-500'"
      >
        <UCheckbox
          v-model="agreeTerms"
          color="primary"
          class="mt-0.5 shrink-0 size-5"
        />
        <span class="text-sm text-gray-700 dark:text-gray-300">
          I agree to the <NuxtLink to="/terms" class="text-flamingo-600 hover:underline dark:text-flamingo-400 font-medium">Terms of Service</NuxtLink>
          and <NuxtLink to="/privacy" class="text-flamingo-600 hover:underline dark:text-flamingo-400 font-medium">Privacy Policy</NuxtLink>
        </span>
      </label>
      <DashboardInlineError :message="submitAttempted && !agreeTerms ? 'You must accept the terms to continue.' : null" />
      <DashboardLoadingButton type="submit" color="primary" block class="bg-flamingo-500 hover:bg-flamingo-600 text-white rounded-xl" :loading="loading" :disabled="!meta.valid || !agreeTerms">
        Create Account
      </DashboardLoadingButton>
      <p class="text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?
        <NuxtLink to="/auth/login" class="text-primary-600 hover:underline font-medium dark:text-primary-400">Sign in</NuxtLink>
      </p>
    </div>
  </VeeForm>
</template>

<script setup lang="ts">
import { object, string, ref as yupRef } from 'yup'
import { useAuthStore } from '~/stores/auth'
import type { SignupCredentials } from '~/shared/types'

const authStore = useAuthStore()
const { signup, loading } = useAuth()
const feedback = useSubmissionFeedback()
const errorMessage = feedback.errorMessage
const successMessage = feedback.successMessage
const route = useRoute()
const agreeTerms = ref(false)
const submitAttempted = ref(false)

const queryRole = route.query.role as string
const defaultKey = (queryRole === 'shop_owner' || queryRole === 'client' || queryRole === 'staff')
  ? queryRole as 'client' | 'staff' | 'shop_owner'
  : 'client'

const selectedStartKey = ref<'client' | 'staff' | 'shop_owner' | 'create_shop_later'>(defaultKey)

const startOptions = [
  {
    key: 'client' as const,
    role: 'client' as const,
    label: 'Client account',
    description: 'Send requests, track replies, and receive quotes.',
  },
  {
    key: 'shop_owner' as const,
    role: 'shop_owner' as const,
    label: 'Print shop owner',
    description: 'List your shop, manage products and pricing.',
  },
]

// Add staff only if explicitly requested or already selected
if (queryRole === 'staff' || selectedStartKey.value === 'staff') {
  startOptions.push({
    key: 'staff' as const,
    role: 'staff' as const,
    label: 'Staff account',
    description: 'Work for an existing print shop.',
  })
}

// Add "later" only if no specific role requested
if (!queryRole) {
  startOptions.push({
    key: 'create_shop_later' as const,
    role: 'client' as const,
    label: "I'll decide later",
    description: 'Start with a client account and upgrade later.',
  })
}

const signupSchema = object({
  first_name: string().required('First name is required'),
  last_name: string().required('Last name is required'),
  email: string().email('Invalid email').required('Email is required'),
  password: string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain an uppercase letter')
    .matches(/[0-9]/, 'Password must contain a number')
    .required('Password is required'),
  password_confirm: string()
    .oneOf([yupRef('password')], 'Passwords must match')
    .required('Please confirm your password'),
})

async function onSubmit(values: Record<string, unknown>) {
  submitAttempted.value = true
  feedback.reset()
  authStore.error = null
  if (!agreeTerms.value) {
    feedback.setError('You must accept the terms to continue.', 'Validation', false)
    return
  }
  const selectedRole = startOptions.find(option => option.key === selectedStartKey.value)?.role ?? 'client'
  const result = await signup({
    ...(values as Omit<SignupCredentials, 'role'>),
    role: selectedRole,
  })
  if (!result.success) {
    const r = result as { error?: string; fieldErrors?: Record<string, string[]> }
    const fields: Record<string, string> = {}
    for (const [k, v] of Object.entries(r.fieldErrors ?? {})) {
      fields[k] = Array.isArray(v) ? v.join(', ') : String(v)
    }
    feedback.setError(r.error || 'We could not create your account right now.', 'Could not create account', false, fields)
  } else {
    feedback.setSuccess((result as { message?: string }).message ?? 'Account created. Check your email for a verification link.', 'Account created', false)
  }
}
</script>
