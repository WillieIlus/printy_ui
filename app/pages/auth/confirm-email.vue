<template>
  <div>
    <NuxtLayout
      name="auth"
      title="Confirming your email"
      subtitle="We're validating your verification link."
      back-to="/auth/login"
    >
      <div class="space-y-4">
        <UAlert
          v-if="status === 'pending'"
          color="info"
          icon="i-lucide-loader-circle"
          title="Confirming your email"
          description="Please wait a moment."
          class="rounded-lg"
        />
        <UAlert
          v-else-if="status === 'success'"
          color="success"
          icon="i-lucide-check-circle"
          title="Email verified"
          description="Your account is ready. You can sign in now."
          class="rounded-lg"
        />
        <UAlert
          v-else
          color="error"
          icon="i-lucide-alert-circle"
          title="Verification link failed"
          :description="error"
          class="rounded-lg"
        />
        <div class="flex flex-col gap-3">
          <UButton
            v-if="status === 'success'"
            to="/auth/login"
            color="primary"
            block
          >
            Continue to sign in
          </UButton>
          <UButton
            v-else
            :to="resendLink"
            color="primary"
            block
          >
            Go to verification help
          </UButton>
          <UButton
            variant="ghost"
            to="/auth/login"
            block
          >
            Back to sign in
          </UButton>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { verifyEmail } from '~/shared/api/auth'

definePageMeta({
  layout: false,
  middleware: 'guest',
})

const route = useRoute()
const router = useRouter()
const notification = useNotification()

const status = ref<'pending' | 'success' | 'error'>('pending')
const error = ref('Invalid or expired verification link. Request a new email and try again.')

const key = computed(() => {
  const value = route.query.key
  return typeof value === 'string' ? value.trim() : ''
})

const email = computed(() => {
  const value = route.query.email
  return typeof value === 'string' ? value.trim() : ''
})

const resendLink = computed(() => {
  if (!email.value) return '/auth/verify-email'
  return { path: '/auth/verify-email', query: { email: email.value } }
})

onMounted(async () => {
  if (!key.value) {
    status.value = 'error'
    error.value = 'Verification link is missing the confirmation key.'
    return
  }

  const result = await verifyEmail({ key: key.value })
  if (!result.success) {
    status.value = 'error'
    error.value = result.error ?? error.value
    notification.error(error.value)
    return
  }

  status.value = 'success'
  notification.success('Email verified. You can sign in now.')
  await router.replace({
    path: '/auth/login',
    query: email.value ? { verified: '1', email: email.value } : { verified: '1' },
  })
})
</script>
