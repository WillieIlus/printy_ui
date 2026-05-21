<template>
  <AuthShell mode="reset">
    <template #side>
      <div class="inline-flex items-center gap-2 bg-[#1d2939] border border-[#2d3f55] rounded-full px-3.5 py-1.5 mb-8">
        <span class="w-1.5 h-1.5 rounded-full bg-[#e13515]"></span>
        <span class="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#667085]">Password recovery</span>
      </div>

      <h1 class="text-[2.4rem] xl:text-[2.75rem] font-extrabold text-white leading-[1.15] tracking-tight mb-5">
        Recover access<br>
        without losing<br>
        <span class="text-[#e13515]">your workflow.</span>
      </h1>

      <p class="text-[#98a2b3] text-[15px] leading-relaxed mb-10 max-w-sm">
        Request a secure reset link to get back to quotes, artwork reviews, payment tracking, and delivery updates.
      </p>

      <ul class="space-y-3.5">
        <li v-for="item in checklist" :key="item" class="flex items-center gap-3.5">
          <div class="w-5 h-5 rounded-full bg-[#e13515] flex items-center justify-center shrink-0">
            <svg class="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5"><path d="M5 13l4 4L19 7" /></svg>
          </div>
          <span class="text-[14px] text-[#d0d5dd]">{{ item }}</span>
        </li>
      </ul>
    </template>

    <div class="w-full max-w-[520px]">
      <div class="flex items-center gap-2 mb-7 lg:hidden">
        <PrintyLogo variant="full" size="md" to="/" />
      </div>

      <BaseCard variant="elevated" padding="xl" radius="xl">
        <div class="mb-7">
          <h2 class="text-[1.55rem] font-extrabold text-[#101828] tracking-tight mb-1.5">Forgot your password?</h2>
          <p class="text-[14px] text-[#667085]">Enter your email and we&apos;ll send reset instructions if the account exists.</p>
        </div>

        <div
          v-if="statusMessage"
          class="rounded-lg border px-4 py-3 mb-5"
          :class="status === 'success' ? 'border-[#abefc6] bg-[#ecfdf3]' : 'border-[#fda29b] bg-[#fef3f2]'"
        >
          <p class="text-[12px] font-semibold mb-1" :class="status === 'success' ? 'text-[#067647]' : 'text-[#b42318]'">
            {{ status === 'success' ? 'Reset email sent' : 'Reset request failed' }}
          </p>
          <p class="text-[12px] leading-snug" :class="status === 'success' ? 'text-[#067647]' : 'text-[#b42318]'">
            {{ statusMessage }}
          </p>
        </div>

        <form class="space-y-4" @submit.prevent="submit">
          <BaseInput
            v-model="email"
            type="email"
            label="Email address"
            placeholder="you@company.com"
            autocomplete="email"
            :disabled="loading"
            :error="fieldErrors.email"
            variant="auth"
            :icon-left="emailIcon"
          />

          <div class="flex flex-col sm:flex-row gap-3">
            <BaseButton type="submit" variant="primary" size="lg" :disabled="loading" :loading="loading">
              {{ loading ? 'Sending instructions' : 'Send reset instructions' }}
            </BaseButton>
            <BaseButton type="button" variant="secondary" size="lg" @click="navigateTo('/auth/login')">
              Back to sign in
            </BaseButton>
          </div>
        </form>
      </BaseCard>

      <div class="mt-6 flex items-center justify-center gap-5">
        <NuxtLink to="/" class="text-[12px] text-[#98a2b3] hover:text-[#667085] transition-colors">Privacy</NuxtLink>
        <span class="text-[#d0d5dd]">&middot;</span>
        <NuxtLink to="/" class="text-[12px] text-[#98a2b3] hover:text-[#667085] transition-colors">Terms</NuxtLink>
        <span class="text-[#d0d5dd]">&middot;</span>
        <NuxtLink to="/auth/login" class="text-[12px] text-[#98a2b3] hover:text-[#667085] transition-colors">Sign in</NuxtLink>
        <span class="text-[#d0d5dd]">&middot;</span>
        <span class="text-[12px] text-[#98a2b3]">&copy; {{ currentYear }} Printy</span>
      </div>
    </div>
  </AuthShell>
</template>

<script setup lang="ts">
import AuthShell from '~/components/layout/AuthShell.vue'
import BaseButton from '~/components/base/BaseButton.vue'
import BaseCard from '~/components/base/BaseCard.vue'
import BaseInput from '~/components/base/BaseInput.vue'
import PrintyLogo from '~/components/printy/PrintyLogo.vue'
import { getApiErrorDetail, getApiErrorMessage } from '~/shared/api'

definePageMeta({ layout: false })

useHead({
  title: 'Printy - Forgot Password',
})

const auth = useAuthStore()
const currentYear = new Date().getFullYear()
const email = ref('')
const loading = ref(false)
const status = ref<'success' | 'error'>('success')
const statusMessage = ref('')
const fieldErrors = ref<Record<string, string>>({})

const emailIcon = '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>'
const checklist = [
  'Uses the same secure auth shell as sign in',
  'Does not reveal whether an account exists',
  'Sends you to the frontend reset page from the email',
]

async function submit() {
  loading.value = true
  statusMessage.value = ''
  fieldErrors.value = {}

  if (!email.value.trim()) {
    fieldErrors.value.email = 'Email address is required.'
    loading.value = false
    return
  }

  try {
    await auth.forgotPassword(email.value.trim())
    status.value = 'success'
    statusMessage.value = "If an account exists for this email, we've sent password reset instructions."
  } catch (error: unknown) {
    status.value = 'error'
    fieldErrors.value = normalizeApiFieldErrors(error)
    statusMessage.value = resolveForgotPasswordErrorMessage(error)
  } finally {
    loading.value = false
  }
}

function resolveForgotPasswordErrorMessage(error: unknown) {
  const detail = String(getApiErrorDetail(error) || '').toLowerCase()
  if (detail.includes('server')) {
    return "We could not reach Printy's server. Please check that the API is running and try again."
  }
  return getApiErrorMessage(error, 'Printy could not send reset instructions.')
}

function normalizeApiFieldErrors(error: unknown) {
  const data = typeof error === 'object' && error && 'data' in error ? (error as { data?: Record<string, unknown> }).data : undefined
  if (!data) {
    return {}
  }

  const next: Record<string, string> = {}
  const emailError = data.email
  if (Array.isArray(emailError)) {
    next.email = emailError.map((item) => String(item)).join(' ')
  } else if (typeof emailError === 'string') {
    next.email = emailError
  }
  return next
}
</script>
