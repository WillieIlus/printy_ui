<template>
  <AuthShell mode="reset">
    <template #side>
      <div class="inline-flex items-center gap-2 bg-[#1d2939] border border-[#2d3f55] rounded-full px-3.5 py-1.5 mb-8">
        <span class="w-1.5 h-1.5 rounded-full bg-[#e13515]"></span>
        <span class="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#667085]">Set a new password</span>
      </div>

      <h1 class="text-[2.4rem] xl:text-[2.75rem] font-extrabold text-white leading-[1.15] tracking-tight mb-5">
        Create a new<br>
        password and get<br>
        <span class="text-[#e13515]">back to work.</span>
      </h1>

      <p class="text-[#98a2b3] text-[15px] leading-relaxed mb-10 max-w-sm">
        Use the secure reset link from your email to restore access to your Printy workspace.
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
          <h2 class="text-[1.55rem] font-extrabold text-[#101828] tracking-tight mb-1.5">Reset your password</h2>
          <p class="text-[14px] text-[#667085]">Choose a strong password for your account.</p>
        </div>

        <div
          v-if="statusMessage"
          class="rounded-lg border px-4 py-3 mb-5"
          :class="status === 'success' ? 'border-[#abefc6] bg-[#ecfdf3]' : 'border-[#fda29b] bg-[#fef3f2]'"
        >
          <p class="text-[12px] font-semibold mb-1" :class="status === 'success' ? 'text-[#067647]' : 'text-[#b42318]'">
            {{ status === 'success' ? 'Password updated' : 'Password reset failed' }}
          </p>
          <p class="text-[12px] leading-snug" :class="status === 'success' ? 'text-[#067647]' : 'text-[#b42318]'">
            {{ statusMessage }}
          </p>
        </div>

        <form class="space-y-4" @submit.prevent="submit">
          <BaseInput
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            label="New password"
            placeholder="Min. 8 characters"
            autocomplete="new-password"
            :disabled="loading || successComplete"
            :error="fieldErrors.password"
            variant="auth"
            :icon-left="lockIcon"
          >
            <template #right>
              <button type="button" class="text-[#98a2b3] hover:text-[#667085] transition-colors" :disabled="loading || successComplete" @click="showPassword = !showPassword">
                <svg class="w-[17px] h-[17px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </template>
          </BaseInput>

          <BaseInput
            v-model="confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            label="Confirm new password"
            placeholder="Repeat your new password"
            autocomplete="new-password"
            :disabled="loading || successComplete"
            :error="fieldErrors.confirmPassword"
            variant="auth"
            :icon-left="lockIcon"
          >
            <template #right>
              <button type="button" class="text-[#98a2b3] hover:text-[#667085] transition-colors" :disabled="loading || successComplete" @click="showConfirmPassword = !showConfirmPassword">
                <svg class="w-[17px] h-[17px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </template>
          </BaseInput>

          <div class="flex flex-col sm:flex-row gap-3">
            <BaseButton type="submit" variant="primary" size="lg" :disabled="loading || successComplete" :loading="loading">
              {{ loading ? 'Updating password' : 'Reset password' }}
            </BaseButton>
            <BaseButton type="button" variant="secondary" size="lg" @click="navigateTo('/auth/login')">
              Go to sign in
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
  title: 'Printy - Reset Password',
})

const auth = useAuthStore()
const route = useRoute()
const currentYear = new Date().getFullYear()
const loading = ref(false)
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const status = ref<'success' | 'error'>('error')
const statusMessage = ref('')
const fieldErrors = ref<Record<string, string>>({})

const lockIcon = '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>'
const checklist = [
  'Accepts reset keys from the email link',
  'Uses the same auth card and messaging style',
  'Returns you to sign in after a successful reset',
]

const successComplete = computed(() => status.value === 'success')

async function submit() {
  fieldErrors.value = {}
  statusMessage.value = ''

  const key = resolveResetKey()
  if (!key) {
    status.value = 'error'
    statusMessage.value = 'This reset link is missing or invalid. Request a new password reset email and try again.'
    return
  }

  if (!password.value) {
    fieldErrors.value.password = 'New password is required.'
  } else if (password.value.length < 8) {
    fieldErrors.value.password = 'Password must be at least 8 characters.'
  }

  if (!confirmPassword.value) {
    fieldErrors.value.confirmPassword = 'Confirm your new password.'
  } else if (password.value !== confirmPassword.value) {
    fieldErrors.value.confirmPassword = 'Passwords do not match.'
  }

  if (Object.keys(fieldErrors.value).length > 0) {
    return
  }

  loading.value = true
  try {
    const result = await auth.resetPassword({ key, password: password.value })
    status.value = 'success'
    statusMessage.value = `${result.detail} You can now sign in with your new password.`
    window.setTimeout(() => {
      navigateTo('/auth/login')
    }, 1800)
  } catch (error: unknown) {
    status.value = 'error'
    statusMessage.value = resolveResetPasswordErrorMessage(error)
  } finally {
    loading.value = false
  }
}

function resolveResetKey() {
  const key = typeof route.query.key === 'string' ? route.query.key.trim() : ''
  if (key) {
    return key
  }

  const token = typeof route.query.token === 'string' ? route.query.token.trim() : ''
  if (token.includes('-')) {
    return token
  }

  const uid = typeof route.query.uid === 'string' ? route.query.uid.trim() : ''
  if (uid && token) {
    return `${uid}-${token}`
  }

  return ''
}

function resolveResetPasswordErrorMessage(error: unknown) {
  const detail = String(getApiErrorDetail(error) || '').toLowerCase()
  if (detail.includes('server')) {
    return "We could not reach Printy's server. Please check that the API is running and try again."
  }
  if (detail.includes('expired') || detail.includes('invalid')) {
    return 'This reset link is invalid or expired. Request a fresh password reset email and try again.'
  }
  return getApiErrorMessage(error, 'Printy could not reset this password.')
}
</script>
