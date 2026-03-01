<template>
  <VeeForm v-slot="{ meta }" :validation-schema="loginSchema" @submit="onSubmit">
    <div class="space-y-4">
      <UAlert
        v-if="authStore.error"
        color="error"
        icon="i-lucide-alert-circle"
        :title="authStore.error"
        class="rounded-lg"
        close
        @update:open="(open) => { if (!open) authStore.error = null }"
      />
      <UAlert
        v-if="emailNotVerified"
        color="warning"
        icon="i-lucide-mail-question"
        title="Please verify your email before signing in."
        description="We sent a verification code to your email. Enter it to activate your account."
        class="rounded-lg"
      />
      <div v-if="emailNotVerified" class="flex justify-center">
        <UButton
          size="sm"
          color="primary"
          :to="verifyEmailLink"
        >
          Verify email
        </UButton>
      </div>
      <FormsFormInput
        name="email"
        label="Email"
        type="email"
        placeholder="Enter your email"
        icon="i-lucide-mail"
      />
      <FormsFormInput
        name="password"
        label="Password"
        type="password"
        placeholder="Enter your password"
        icon="i-lucide-lock"
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
      <UButton
        type="submit"
        color="primary"
        block
        :loading="loading"
        :disabled="!meta.valid || loading || isRateLimited"
      >
        <ClientOnly>
          {{ isRateLimited ? `Please wait ${Math.ceil((authStore.rateLimitUntil - now) / 1000)}s...` : 'Sign In' }}
          <template #fallback>Sign In</template>
        </ClientOnly>
      </UButton>
      <p class="text-center text-sm text-gray-600 dark:text-gray-400">
        Don't have an account?
        <NuxtLink to="/auth/signup" class="text-primary-600 hover:underline font-medium dark:text-primary-400">Sign up</NuxtLink>
      </p>
    </div>
  </VeeForm>
</template>

<script setup lang="ts">
import { object, string } from 'yup'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const { login, loading } = useAuth()
const notification = useNotification()
const rememberMe = ref(true)
const now = ref(Date.now())
onMounted(() => {
  rememberMe.value = authStore.rememberMe
  const tick = setInterval(() => { now.value = Date.now() }, 1000)
  onUnmounted(() => clearInterval(tick))
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
  emailNotVerified.value = false
  unverifiedEmail.value = ''
  const result = await login(email, password, rememberMe.value)
  if (!result.success) {
    const r = result as { code?: string; email?: string }
    if (r.code === 'email_not_verified') {
      emailNotVerified.value = true
      unverifiedEmail.value = r.email ?? email
    } else {
      notification.error(result.error || 'Login failed')
    }
  }
}
</script>
