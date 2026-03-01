<template>
  <div>
    <NuxtLayout
      name="auth"
      title="Verify your email"
      subtitle="We sent a 6-digit code to your email. Enter it below."
      back-to="/auth/login"
    >
    <VeeForm v-slot="{ meta }" :validation-schema="verifySchema" @submit="onSubmit">
      <div class="space-y-4">
        <UAlert
          v-if="error"
          color="error"
          icon="i-lucide-alert-circle"
          :title="error"
          class="rounded-lg"
          close
          @update:open="(open) => { if (!open) error = null }"
        />
        <UAlert
          v-if="success"
          color="success"
          icon="i-lucide-check-circle"
          title="Email verified! Redirecting to login..."
          class="rounded-lg"
        />
        <FormsFormInput
          v-if="!email"
          name="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          icon="i-lucide-mail"
        />
        <template v-else>
          <VeeField name="email" :model-value="email" type="hidden" />
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <div class="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-gray-600 dark:text-gray-400">
              <UIcon name="i-lucide-mail" class="h-4 w-4 shrink-0" />
              {{ email }}
            </div>
          </div>
        </template>
        <FormsFormInput
          name="code"
          label="Verification code"
          type="text"
          placeholder="000000"
          icon="i-lucide-key-round"
          maxlength="6"
          inputmode="numeric"
          autocomplete="one-time-code"
          class="font-mono text-lg tracking-widest"
        />
        <UButton
          type="submit"
          color="primary"
          block
          :loading="loading"
          :disabled="!meta.valid || loading || !!success"
        >
          Verify Email
        </UButton>
        <div class="flex items-center justify-center gap-2">
          <span class="text-sm text-gray-600 dark:text-gray-400">Didn't receive the code?</span>
          <UButton
            variant="link"
            size="sm"
            :disabled="resendCooldown > 0"
            @click="onResend"
          >
            {{ resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code' }}
          </UButton>
        </div>
        <p class="text-center text-sm text-gray-600 dark:text-gray-400">
          <NuxtLink to="/auth/login" class="text-primary-600 hover:underline font-medium dark:text-primary-400">
            Back to sign in
          </NuxtLink>
        </p>
      </div>
    </VeeForm>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { object, string } from 'yup'
import { verifyEmail, resendVerification } from '~/shared/api/auth'

definePageMeta({
  layout: false,
  middleware: 'guest',
})

const route = useRoute()
const router = useRouter()
const notification = useNotification()

const email = computed(() => {
  const e = route.query.email
  return typeof e === 'string' ? e : ''
})

const loading = ref(false)
const error = ref<string | null>(null)
const success = ref(false)
const resendCooldown = ref(0)

const RESEND_COOLDOWN_SEC = 30
let cooldownInterval: ReturnType<typeof setInterval> | null = null

const verifySchema = object({
  email: string().email('Invalid email').required('Email is required'),
  code: string()
    .length(6, 'Code must be 6 digits')
    .matches(/^\d{6}$/, 'Code must be 6 digits')
    .required('Verification code is required'),
})

function startResendCooldown() {
  resendCooldown.value = RESEND_COOLDOWN_SEC
  if (cooldownInterval) clearInterval(cooldownInterval)
  cooldownInterval = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0 && cooldownInterval) {
      clearInterval(cooldownInterval)
      cooldownInterval = null
    }
  }, 1000)
}

async function onSubmit(values: Record<string, unknown>) {
  const e = (values.email as string) || email.value
  const code = values.code as string
  if (!e) {
    error.value = 'Email is required'
    return
  }
  loading.value = true
  error.value = null
  try {
    const result = await verifyEmail({ email: e, code })
    if (result.success) {
      success.value = true
      notification.success('Email verified! You can now sign in.')
      await router.push({ path: '/auth/login', query: { verified: '1', email: e } })
    } else {
      error.value = result.error ?? 'Verification failed'
      notification.error(result.error ?? 'Verification failed')
    }
  } finally {
    loading.value = false
  }
}

async function onResend() {
  if (!email.value || resendCooldown.value > 0) return
  loading.value = true
  error.value = null
  try {
    const result = await resendVerification({ email: email.value })
    if (result.success) {
      notification.success('Verification code sent! Check your email.')
      startResendCooldown()
    } else {
      error.value = result.error ?? 'Failed to resend'
      notification.error(result.error ?? 'Failed to resend verification code')
    }
  } finally {
    loading.value = false
  }
}

onUnmounted(() => {
  if (cooldownInterval) clearInterval(cooldownInterval)
})
</script>
