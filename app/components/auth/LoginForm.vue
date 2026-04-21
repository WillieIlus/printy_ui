<template>
  <VeeForm v-slot="{ meta }" :validation-schema="loginSchema" @submit="onSubmit">
    <div class="space-y-4">
      <UAlert
        v-if="errorMessage"
        color="error"
        icon="i-lucide-alert-circle"
        title="Could not sign you in"
        :description="errorMessage"
        class="rounded-lg"
      />
      <UAlert
        v-if="emailNotVerified"
        color="warning"
        icon="i-lucide-mail-question"
        title="Please verify your email before signing in."
        description="We sent a verification link to your email. Open it to activate your account."
        class="rounded-lg"
      />
      <div v-if="emailNotVerified" class="flex justify-center">
        <UButton
          size="sm"
          color="primary"
          class="bg-flamingo-500 hover:bg-flamingo-600 text-white rounded-xl"
          :to="verifyEmailLink"
        >
          Verify email
        </UButton>
      </div>
      <FormsFormInput
        name="email"
        label="Email"
        type="email"
        autocomplete="email"
        placeholder="Enter your email"
        icon="i-lucide-mail"
        required
      />
      <FormsFormInput
        name="password"
        label="Password"
        type="password"
        autocomplete="current-password"
        placeholder="Enter your password"
        icon="i-lucide-lock"
        required
      />
      <div class="flex items-center justify-between">
        <label class="flex items-center gap-2">
          <UCheckbox v-model="rememberMe" />
          <span class="text-sm text-gray-600 dark:text-gray-400">Remember me</span>
        </label>
        <NuxtLink to="/auth/forgot-password" class="text-sm text-primary-600 hover:underline dark:text-primary-400">
          Forgot password?
        </NuxtLink>
      </div>
      <DashboardLoadingButton
        type="submit"
        color="primary"
        block
        class="bg-flamingo-500 hover:bg-flamingo-600 text-white rounded-xl"
        :loading="loading"
        :disabled="!meta.valid || loading || isRateLimited"
      >
        <ClientOnly>
          {{ isRateLimited ? `Please wait ${Math.ceil((authStore.rateLimitUntil - now) / 1000)}s...` : 'Open my workspace' }}
          <template #fallback>Open my workspace</template>
        </ClientOnly>
      </DashboardLoadingButton>
    </div>
  </VeeForm>
</template>

<script setup lang="ts">
import { object, string } from 'yup'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const { login, loading } = useAuth()
const feedback = useSubmissionFeedback()
const errorMessage = feedback.errorMessage
const rememberMe = ref(true)
const now = ref(Date.now())
let tick: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  rememberMe.value = authStore.rememberMe
  tick = setInterval(() => { now.value = Date.now() }, 1000)
})

onUnmounted(() => {
  if (tick) clearInterval(tick)
})

const isRateLimited = computed(() => authStore.rateLimitUntil > now.value)

const loginSchema = object({
  email: string().email('Invalid email').required('Email is required'),
  password: string().min(8, 'Password must be at least 8 characters').required('Password is required'),
})

const emailNotVerified = ref(false)
const unverifiedEmail = ref('')

const verifyEmailLink = computed(() => {
  if (!unverifiedEmail.value) return '/auth/verify-email'
  return { path: '/auth/verify-email', query: { email: unverifiedEmail.value } }
})

async function onSubmit(values: Record<string, unknown>) {
  const { email, password } = values as { email: string; password: string }
  feedback.reset()
  authStore.error = null
  emailNotVerified.value = false
  unverifiedEmail.value = ''
  const result = await login(email, password, rememberMe.value)
  if (!result.success) {
    const r = result as { code?: string; email?: string }
    if (r.code === 'email_not_verified') {
      emailNotVerified.value = true
      unverifiedEmail.value = r.email ?? email
    } else {
      feedback.setError(result.error || "We're having trouble signing you in right now.", 'Could not sign you in', false)
    }
  }
}
</script>
