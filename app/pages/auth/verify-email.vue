<template>
  <section class="relative overflow-hidden bg-[var(--p-bg)]">
    <div class="absolute inset-x-0 top-0 -z-10 h-80 bg-[radial-gradient(circle_at_top,_rgba(225,53,21,0.16),_transparent_42%)]" />
    <div class="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-10 md:px-6">
      <BaseCard class="w-full space-y-6">
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
          <BaseBadge tone="primary">Check your email</BaseBadge>
          <h1 class="text-3xl font-semibold tracking-tight text-[var(--p-text)]">Confirm your email to continue.</h1>
          <p class="max-w-2xl text-sm leading-6 text-[var(--p-text-muted)]">
            We sent a verification link to <span class="font-semibold text-[var(--p-text)]">{{ emailLabel }}</span>.
            Once you confirm it, sign in and Printy will continue from the same account flow.
          </p>
        </div>

        <div class="grid gap-3 sm:grid-cols-3">
          <div class="rounded-[1.5rem] border border-[var(--p-border)] bg-[var(--p-bg-soft)] px-4 py-4">
            <p class="text-sm font-semibold text-[var(--p-text)]">No payment required</p>
            <p class="mt-1 text-sm text-[var(--p-text-muted)]">This step only confirms the email address.</p>
          </div>
          <div class="rounded-[1.5rem] border border-[var(--p-border)] bg-[var(--p-bg-soft)] px-4 py-4">
            <p class="text-sm font-semibold text-[var(--p-text)]">Your flow is preserved</p>
            <p class="mt-1 text-sm text-[var(--p-text-muted)]">Saved quote details and pending actions stay attached to this signup.</p>
          </div>
          <div class="rounded-[1.5rem] border border-[var(--p-border)] bg-[var(--p-bg-soft)] px-4 py-4">
            <p class="text-sm font-semibold text-[var(--p-text)]">Link missing?</p>
            <p class="mt-1 text-sm text-[var(--p-text-muted)]">Check spam first, then resend below.</p>
          </div>
        </div>

        <div v-if="feedbackMessage" :class="feedbackClass" class="rounded-2xl px-4 py-3 text-sm">
          {{ feedbackMessage }}
        </div>

        <div class="flex flex-col gap-3 sm:flex-row">
          <BaseButton :loading="isResending" @click="resendEmail">
            Resend verification email
          </BaseButton>
          <BaseButton variant="outline" :to="loginLink">
            Go to login
          </BaseButton>
          <BaseButton variant="ghost" to="/">
            Back to homepage
          </BaseButton>
        </div>
      </BaseCard>
    </div>
  </section>
</template>

<script setup lang="ts">
import BaseBadge from '~/components/ui/BaseBadge.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseCard from '~/components/ui/BaseCard.vue'
import { usePrintyToast } from '~/composables/usePrintyToast'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  middleware: ['guest'],
})

const authStore = useAuthStore()
const toast = usePrintyToast()
const route = useRoute()
const isResending = ref(false)
const feedbackMessage = ref('')
const feedbackTone = ref<'success' | 'error' | 'info'>('info')

function getSingleQueryValue(value: unknown): string | undefined {
  if (typeof value === 'string') return value
  if (Array.isArray(value)) {
    const firstString = value.find((entry): entry is string => typeof entry === 'string')
    return firstString
  }
  return undefined
}

const email = computed(() => getSingleQueryValue(route.query.email) ?? '')
const redirect = computed(() => getSingleQueryValue(route.query.redirect) ?? '/')
const role = computed(() => getSingleQueryValue(route.query.role) ?? 'client')
const emailLabel = computed(() => email.value || 'your inbox')
const loginLink = computed(() => ({
  path: '/auth/login',
  query: {
    ...(redirect.value ? { redirect: redirect.value } : {}),
    ...(role.value ? { role: role.value } : {}),
  },
}))
const feedbackClass = computed(() => {
  if (feedbackTone.value === 'success') return 'border border-[var(--p-success)]/20 bg-[var(--p-success-soft)] text-[var(--p-text)]'
  if (feedbackTone.value === 'error') return 'border border-[var(--p-error)]/20 bg-[var(--p-error-soft)] text-[var(--p-text)]'
  return 'border border-[var(--p-border)] bg-[var(--p-bg-soft)] text-[var(--p-text)]'
})

async function resendEmail() {
  if (!email.value) {
    feedbackTone.value = 'error'
    feedbackMessage.value = 'We need the signup email address before we can resend the verification email.'
    return
  }

  isResending.value = true
  const result = await authStore.resendVerificationEmail(email.value)
  isResending.value = false

  if (!result.success) {
    feedbackTone.value = 'error'
    feedbackMessage.value = result.error ?? 'We could not resend the verification email right now.'
    toast.error('Resend failed', feedbackMessage.value, { context: 'auth' })
    return
  }

  feedbackTone.value = 'success'
  feedbackMessage.value = result.message ?? 'If that address exists and is unverified, a new confirmation email has been sent.'
  toast.success('Verification email sent', feedbackMessage.value, { context: 'auth' })
}
</script>
