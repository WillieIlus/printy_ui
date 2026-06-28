<script setup lang="ts">
definePageMeta({ layout: 'auth' })

const auth = useAuthStore()
const email = ref('')
const error = ref('')
const sent = ref(false)

async function handleSubmit() {
  error.value = ''
  if (!email.value) {
    error.value = 'Please enter your email address'
    return
  }
  try {
    await auth.forgotPassword(email.value)
    sent.value = true
  } catch {
    error.value = 'Something went wrong. Please try again.'
  }
}
</script>

<template>
  <div v-if="sent" class="text-center py-4">
    <div class="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
      <svg class="h-7 w-7 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    </div>
    <h2 class="text-[1.65rem] font-extrabold text-[#101828] tracking-tight mb-2">Check your email</h2>
    <p class="text-[14px] text-[#667085] mb-1">We sent a password reset link to</p>
    <p class="text-[14px] font-semibold text-[#101828] mb-4">{{ email }}</p>
    <p class="text-[13px] text-[#667085] mb-6">Click the link in the email to reset your password. The link will expire in 1 hour.</p>
    <div class="space-y-3">
      <button class="inline-flex items-center justify-center gap-2 font-semibold transition-colors border border-[#d0d5dd] bg-white text-[#344054] hover:bg-[#f9fafb] px-7 py-3 text-[14px] rounded-xl w-full" @click="sent = false">
        Try a different email
      </button>
      <NuxtLink to="/auth/login" class="inline-flex items-center justify-center gap-2 font-semibold transition-colors bg-[#e13515] border border-[#e13515] text-white shadow-[0_18px_36px_-22px_rgba(225,53,21,0.9)] hover:bg-[#b82c10] hover:border-[#b82c10] px-7 py-3 text-[14px] rounded-xl w-full">
        Back to sign in
      </NuxtLink>
    </div>
    <p class="mt-6 text-[13px] text-[#98a2b3]">
      Didn't receive the email? Check your spam folder or
      <button class="font-semibold text-[#e13515] hover:text-[#b82c10] underline underline-offset-2" @click="auth.forgotPassword(email)">resend</button>
    </p>
  </div>

  <template v-else>
    <div class="mb-6">
      <h2 class="text-[1.65rem] font-extrabold text-[#101828] tracking-tight mb-1.5">Forgot password?</h2>
      <p class="text-[14px] text-[#667085]">No worries. Enter your email and we'll send you a reset link.</p>
    </div>

    <form class="space-y-5" @submit.prevent="handleSubmit">
      <div v-if="error" class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">{{ error }}</div>
      <div>
        <div class="mb-1.5">
          <span class="text-[13px] font-semibold text-[#344054]">Email address</span>
        </div>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="w-4 h-4 text-[#98a2b3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <input v-model="email" type="email" placeholder="you@company.com" class="w-full rounded-lg shadow-sm outline-none transition focus:outline-none focus:ring-2 py-2.5 text-[13.5px] bg-white border border-[#d0d5dd] text-[#101828] placeholder-[#98a2b3] focus:ring-[#e13515] focus:border-[#e13515] pl-9 pr-3.5">
        </div>
      </div>
      <button type="submit" :disabled="auth.isLoading" class="inline-flex items-center justify-center gap-2 font-semibold transition-colors bg-[#e13515] border border-[#e13515] text-white shadow-[0_18px_36px_-22px_rgba(225,53,21,0.9)] hover:bg-[#b82c10] hover:border-[#b82c10] px-7 py-3.5 text-base rounded-xl w-full disabled:opacity-50 disabled:cursor-not-allowed">
        {{ auth.isLoading ? 'Sending...' : 'Send reset link' }}
      </button>
    </form>
    <p class="mt-6 text-center text-[13px] text-[#667085]">
      Remember your password?
      <NuxtLink to="/auth/login" class="font-semibold text-[#e13515] hover:text-[#b82c10] transition-colors underline underline-offset-2">Sign in</NuxtLink>
    </p>
  </template>
</template>
