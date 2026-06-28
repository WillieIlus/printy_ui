<script setup lang="ts">
definePageMeta({ layout: 'auth' })

const auth = useAuthStore()
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const remember = ref(false)
const error = ref('')

async function handleSubmit() {
  error.value = ''
  if (!email.value || !password.value) {
    error.value = 'Please fill in all fields'
    return
  }
  try {
    await auth.signIn(email.value, password.value, remember.value)
  } catch {
    error.value = 'Invalid email or password'
  }
}
</script>

<template>
  <div class="mb-6">
    <h2 class="text-[1.65rem] font-extrabold text-[#101828] tracking-tight mb-1.5">Welcome back</h2>
    <p class="text-[14px] text-[#667085]">Sign in to continue to your workspace.</p>
  </div>

  <form class="space-y-5" @submit.prevent="handleSubmit">
    <div v-if="error" class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
      {{ error }}
    </div>

    <div>
      <div class="mb-1.5 flex items-center gap-1.5">
        <span class="text-[13px] font-semibold text-[#344054]">Email address</span>
      </div>
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="w-4 h-4 text-[#98a2b3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <input v-model="email" type="email" placeholder="you@company.com" autocomplete="email" class="w-full rounded-lg shadow-sm outline-none transition focus:outline-none focus:ring-2 py-2.5 text-[13.5px] bg-white border border-[#d0d5dd] text-[#101828] placeholder-[#98a2b3] focus:ring-[#e13515] focus:border-[#e13515] pl-9 pr-3.5">
      </div>
    </div>

    <div>
      <div class="flex items-center justify-between mb-1.5">
        <label class="text-[13px] font-semibold text-[#344054]">Password</label>
        <NuxtLink to="/auth/forgot-password" class="text-[12px] font-semibold text-[#e13515] hover:text-[#b82c10] transition-colors">Forgot password?</NuxtLink>
      </div>
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="w-4 h-4 text-[#98a2b3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
        </div>
        <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="Enter your password" autocomplete="current-password" class="w-full rounded-lg shadow-sm outline-none transition focus:outline-none focus:ring-2 py-2.5 text-[13.5px] bg-white border border-[#d0d5dd] text-[#101828] placeholder-[#98a2b3] focus:ring-[#e13515] focus:border-[#e13515] pl-9 pr-10">
        <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
          <button type="button" class="text-[#98a2b3] hover:text-[#667085] cursor-pointer transition-colors" @click="showPassword = !showPassword">
            <svg v-if="showPassword" class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
            <svg v-else class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-2.5 pt-0.5">
      <input id="remember" v-model="remember" type="checkbox" class="w-4 h-4 rounded border border-[#d0d5dd] text-[#e13515] accent-[#e13515] cursor-pointer">
      <label for="remember" class="text-[13px] text-[#344054] cursor-pointer select-none">Keep me signed in for 30 days</label>
    </div>

    <button type="submit" :disabled="auth.isLoading" class="inline-flex items-center justify-center gap-2 font-semibold transition-colors bg-[#e13515] border border-[#e13515] text-white shadow-[0_18px_36px_-22px_rgba(225,53,21,0.9)] hover:bg-[#b82c10] hover:border-[#b82c10] px-7 py-3.5 text-base rounded-xl w-full disabled:opacity-50 disabled:cursor-not-allowed">
      <svg v-if="auth.isLoading" class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      {{ auth.isLoading ? 'Signing in...' : 'Sign in' }}
    </button>
  </form>

  <p class="mt-6 text-center text-[13px] text-[#667085]">
    New to Printy?
    <NuxtLink to="/auth/register/client" class="font-semibold text-[#e13515] hover:text-[#b82c10] transition-colors underline underline-offset-2">Create an account</NuxtLink>
  </p>

  <div class="mt-6 flex items-center gap-2.5 bg-[#f9fafb] border border-[#e4e7ec] rounded-lg px-4 py-3">
    <svg class="w-4 h-4 text-[#667085] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
    <p class="text-[12px] text-[#667085] leading-snug">
      Your workspace is protected with <span class="font-semibold text-[#344054]">secure authentication.</span>
    </p>
  </div>
</template>
