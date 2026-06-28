<script setup lang="ts">
definePageMeta({ layout: 'auth' })

const auth = useAuthStore()
const route = useRoute()
const token = computed(() => String(route.query.token || ''))
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const error = ref('')
const success = ref(false)

async function handleSubmit() {
  error.value = ''
  if (!password.value || !confirmPassword.value) {
    error.value = 'Please fill in all fields'
    return
  }
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }
  if (password.value.length < 8) {
    error.value = 'Password must be at least 8 characters'
    return
  }
  try {
    await auth.resetPassword(token.value, password.value)
    success.value = true
  } catch {
    error.value = 'Something went wrong. Please try again.'
  }
}
</script>

<template>
  <div v-if="!token" class="text-center py-4">
    <div class="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
      <svg class="h-7 w-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
    <h2 class="text-[1.65rem] font-extrabold text-[#101828] tracking-tight mb-2">Invalid link</h2>
    <p class="text-[14px] text-[#667085] mb-6">This password reset link is invalid or has expired.</p>
    <NuxtLink to="/auth/forgot-password" class="inline-flex items-center justify-center gap-2 font-semibold transition-colors bg-[#e13515] border border-[#e13515] text-white shadow-[0_18px_36px_-22px_rgba(225,53,21,0.9)] hover:bg-[#b82c10] hover:border-[#b82c10] px-7 py-3.5 text-base rounded-xl w-full">
      Request new link
    </NuxtLink>
  </div>

  <div v-else-if="success" class="text-center py-4">
    <div class="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
      <svg class="h-7 w-7 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    </div>
    <h2 class="text-[1.65rem] font-extrabold text-[#101828] tracking-tight mb-2">Password reset!</h2>
    <p class="text-[14px] text-[#667085] mb-6">Your password has been successfully reset. You can now sign in with your new password.</p>
    <NuxtLink to="/auth/login" class="inline-flex items-center justify-center gap-2 font-semibold transition-colors bg-[#e13515] border border-[#e13515] text-white shadow-[0_18px_36px_-22px_rgba(225,53,21,0.9)] hover:bg-[#b82c10] hover:border-[#b82c10] px-7 py-3.5 text-base rounded-xl w-full">
      Sign in
    </NuxtLink>
  </div>

  <template v-else>
    <div class="mb-6">
      <h2 class="text-[1.65rem] font-extrabold text-[#101828] tracking-tight mb-1.5">Reset your password</h2>
      <p class="text-[14px] text-[#667085]">Choose a strong password with at least 8 characters.</p>
    </div>

    <form class="space-y-5" @submit.prevent="handleSubmit">
      <div v-if="error" class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">{{ error }}</div>
      <div>
        <div class="mb-1.5">
          <span class="text-[13px] font-semibold text-[#344054]">New password</span>
        </div>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="w-4 h-4 text-[#98a2b3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
          <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="Min. 8 characters" class="w-full rounded-lg shadow-sm outline-none transition focus:outline-none focus:ring-2 py-2.5 text-[13.5px] bg-white border border-[#d0d5dd] text-[#101828] placeholder-[#98a2b3] focus:ring-[#e13515] focus:border-[#e13515] pl-9 pr-10">
          <button type="button" class="absolute inset-y-0 right-0 pr-3 flex items-center text-[#98a2b3] hover:text-[#667085] transition-colors" @click="showPassword = !showPassword">
            <svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </div>
      </div>
      <div>
        <div class="mb-1.5">
          <span class="text-[13px] font-semibold text-[#344054]">Confirm new password</span>
        </div>
        <input v-model="confirmPassword" type="password" placeholder="Re-enter your password" class="w-full rounded-lg shadow-sm outline-none transition focus:outline-none focus:ring-2 py-2.5 text-[13.5px] bg-white border border-[#d0d5dd] text-[#101828] placeholder-[#98a2b3] focus:ring-[#e13515] focus:border-[#e13515] px-3.5">
      </div>
      <button type="submit" :disabled="auth.isLoading" class="inline-flex items-center justify-center gap-2 font-semibold transition-colors bg-[#e13515] border border-[#e13515] text-white shadow-[0_18px_36px_-22px_rgba(225,53,21,0.9)] hover:bg-[#b82c10] hover:border-[#b82c10] px-7 py-3.5 text-base rounded-xl w-full disabled:opacity-50 disabled:cursor-not-allowed">
        {{ auth.isLoading ? 'Resetting...' : 'Reset password' }}
      </button>
    </form>
  </template>
</template>
