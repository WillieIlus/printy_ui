<script setup lang="ts">
definePageMeta({ layout: 'auth' })

const auth = useAuthStore()
const route = useRoute()
const token = computed(() => String(route.query.token || ''))
const verified = ref(false)
const resent = ref(false)
const error = ref('')

async function handleVerify() {
  if (!token.value) {
    return
  }
  try {
    await auth.verifyEmail(token.value)
    verified.value = true
  } catch {
    error.value = 'Verification link is invalid or has expired'
  }
}

async function handleResend() {
  try {
    await auth.resendVerification()
    resent.value = true
  } catch {
    error.value = 'Failed to resend verification email'
  }
}

watch(token, () => {
  handleVerify()
}, { immediate: true })
</script>

<template>
  <div v-if="token && verified" class="text-center py-4">
    <div class="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
      <svg class="h-7 w-7 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    </div>
    <h2 class="text-[1.65rem] font-extrabold text-[#101828] tracking-tight mb-2">Email verified!</h2>
    <p class="text-[14px] text-[#667085] mb-6">Your email has been successfully verified. You can now access all features.</p>
    <NuxtLink to="/dashboard/client" class="inline-flex items-center justify-center gap-2 font-semibold transition-colors bg-[#e13515] border border-[#e13515] text-white shadow-[0_18px_36px_-22px_rgba(225,53,21,0.9)] hover:bg-[#b82c10] hover:border-[#b82c10] px-7 py-3.5 text-base rounded-xl w-full">
      Go to dashboard
    </NuxtLink>
  </div>

  <div v-else-if="token && error" class="text-center py-4">
    <div class="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
      <svg class="h-7 w-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
    <h2 class="text-[1.65rem] font-extrabold text-[#101828] tracking-tight mb-2">Verification failed</h2>
    <p class="text-[14px] text-[#667085] mb-6">{{ error }}</p>
    <div class="space-y-3">
      <button :disabled="auth.isLoading" class="inline-flex items-center justify-center gap-2 font-semibold transition-colors bg-[#e13515] border border-[#e13515] text-white shadow-[0_18px_36px_-22px_rgba(225,53,21,0.9)] hover:bg-[#b82c10] hover:border-[#b82c10] px-7 py-3 text-[14px] rounded-xl w-full disabled:opacity-50" @click="handleResend">
        Resend verification email
      </button>
      <NuxtLink to="/auth/login" class="inline-flex items-center justify-center gap-2 font-semibold transition-colors border border-[#d0d5dd] bg-white text-[#344054] hover:bg-[#f9fafb] px-7 py-3 text-[14px] rounded-xl w-full">
        Back to sign in
      </NuxtLink>
    </div>
  </div>

  <div v-else-if="token" class="text-center py-8">
    <div class="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#fdf1ee]">
      <svg class="h-7 w-7 animate-spin text-[#e13515]" viewBox="0 0 24 24" fill="none">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>
    <h2 class="text-[1.65rem] font-extrabold text-[#101828] tracking-tight mb-2">Verifying your email...</h2>
    <p class="text-[14px] text-[#667085]">Please wait while we verify your email address.</p>
  </div>

  <div v-else class="text-center py-4">
    <div class="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#fdf1ee]">
      <svg class="h-7 w-7 text-[#e13515]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    </div>
    <h2 class="text-[1.65rem] font-extrabold text-[#101828] tracking-tight mb-2">Verify your email</h2>
    <p class="text-[14px] text-[#667085] mb-1">We sent a verification link to</p>
    <p class="text-[14px] font-semibold text-[#101828] mb-4">{{ auth.user?.email || 'your email' }}</p>
    <p class="text-[13px] text-[#667085] mb-6">Click the link in the email to verify your account.</p>
    <div v-if="resent" class="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] text-emerald-700">Verification email sent! Check your inbox.</div>
    <div class="space-y-3">
      <button :disabled="auth.isLoading || resent" class="inline-flex items-center justify-center gap-2 font-semibold transition-colors border border-[#d0d5dd] bg-white text-[#344054] hover:bg-[#f9fafb] px-7 py-3 text-[14px] rounded-xl w-full disabled:opacity-50" @click="handleResend">
        {{ auth.isLoading ? 'Sending...' : 'Resend verification email' }}
      </button>
      <NuxtLink to="/auth/login" class="inline-flex items-center justify-center gap-2 font-semibold transition-colors bg-[#e13515] border border-[#e13515] text-white shadow-[0_18px_36px_-22px_rgba(225,53,21,0.9)] hover:bg-[#b82c10] hover:border-[#b82c10] px-7 py-3 text-[14px] rounded-xl w-full">
        Back to sign in
      </NuxtLink>
    </div>
    <p class="mt-6 text-[13px] text-[#98a2b3]">
      Wrong email?
      <NuxtLink to="/auth/register/client" class="font-semibold text-[#e13515] hover:text-[#b82c10] underline underline-offset-2">Sign up again</NuxtLink>
    </p>
  </div>
</template>
