<template>
  <div>
    <NuxtLayout
      name="auth"
      title="Verify your email"
      subtitle="Check your inbox and click the verification link we sent."
      back-to="/auth/login"
    >
      <div class="space-y-4">
        <UAlert
          v-if="error"
          color="error"
          icon="i-lucide-alert-circle"
          title="We couldn't send another email"
          :description="error"
          class="rounded-lg"
          close
          @update:open="(open) => { if (!open) error = null }"
        />
        <UAlert
          v-if="resent"
          color="success"
          icon="i-lucide-check-circle"
          title="Verification email sent"
          description="If the address exists and is still unverified, we've sent a fresh verification link."
          class="rounded-lg"
        />
        <div class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-4 py-4">
          <p class="text-sm font-medium text-[var(--p-text)]">
            {{ email ? 'Verification email address' : 'Verification email' }}
          </p>
          <p class="mt-1 text-sm text-[var(--p-text-muted)]">
            {{ email || 'Open the email account you used to sign up and click the verification link.' }}
          </p>
        </div>
        <div class="rounded-xl border border-sky-200 bg-sky-50 px-4 py-4 text-sm text-sky-900 dark:border-sky-900/60 dark:bg-sky-950/40 dark:text-sky-100">
          The link opens a confirmation page in Printy. After that, you can sign in normally.
        </div>
        <UButton
          type="button"
          color="primary"
          block
          :loading="loading"
          :disabled="!email || loading || resendCooldown > 0"
          @click="onResend"
        >
          {{ resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend verification email' }}
        </UButton>
        <p class="text-center text-sm text-gray-600 dark:text-gray-400">
          Already verified?
          <NuxtLink to="/auth/login" class="text-primary-600 hover:underline font-medium dark:text-primary-400">
            Sign in
          </NuxtLink>
        </p>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { resendVerification } from '~/shared/api/auth'

definePageMeta({
  layout: false,
  middleware: 'guest',
})

const route = useRoute()
const notification = useNotification()

const email = computed(() => {
  const value = route.query.email
  return typeof value === 'string' ? value.trim() : ''
})

const loading = ref(false)
const error = ref<string | null>(null)
const resent = ref(false)
const resendCooldown = ref(0)

const RESEND_COOLDOWN_SEC = 30
let cooldownInterval: ReturnType<typeof setInterval> | null = null

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

async function onResend() {
  if (!email.value || resendCooldown.value > 0) return

  loading.value = true
  error.value = null
  resent.value = false

  try {
    const result = await resendVerification({ email: email.value })
    if (result.success) {
      resent.value = true
      startResendCooldown()
      notification.success('If the account is pending verification, a new email has been sent.')
      return
    }

    error.value = result.error ?? 'We could not resend the verification email.'
    notification.error(error.value)
  } finally {
    loading.value = false
  }
}

onUnmounted(() => {
  if (cooldownInterval) clearInterval(cooldownInterval)
})
</script>
