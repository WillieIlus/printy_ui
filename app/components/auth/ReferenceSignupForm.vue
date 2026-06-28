<script setup lang="ts">
import type { UserRole } from '~/types/auth'

const props = defineProps<{
  role: UserRole
  badge: string
  title: string
  description: string
  accentClass: string
  accentBg: string
  accentBorder: string
  buttonClass: string
  includeBusiness?: boolean
}>()

const auth = useAuthStore()
const formData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  businessName: '',
  businessLocation: '',
})
const showPassword = ref(false)
const agreedToTerms = ref(false)
const error = ref('')

async function handleSubmit() {
  error.value = ''
  if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
    error.value = 'Please fill in all required fields'
    return
  }
  if (props.includeBusiness && (!formData.businessName || !formData.businessLocation)) {
    error.value = 'Please fill in your business details'
    return
  }
  if (formData.password !== formData.confirmPassword) {
    error.value = 'Passwords do not match'
    return
  }
  if (formData.password.length < 8) {
    error.value = 'Password must be at least 8 characters'
    return
  }
  if (!agreedToTerms.value) {
    error.value = 'Please agree to the terms and conditions'
    return
  }
  try {
    await auth.signUp({ ...formData, role: props.role })
  } catch {
    error.value = 'Something went wrong. Please try again.'
  }
}
</script>

<template>
  <div class="mb-6">
    <div :class="['inline-flex items-center gap-2 rounded-full px-3 py-1 mb-3', accentBg, accentBorder]">
      <span :class="['w-1.5 h-1.5 rounded-full', accentClass.replace('text-', 'bg-')]" />
      <span :class="['text-[11px] font-semibold uppercase tracking-[0.08em]', accentClass]">{{ badge }}</span>
    </div>
    <h2 class="text-[1.65rem] font-extrabold text-[#101828] tracking-tight mb-1.5">{{ title }}</h2>
    <p class="text-[14px] text-[#667085]">{{ description }}</p>
  </div>

  <form class="space-y-4" @submit.prevent="handleSubmit">
    <div v-if="error" class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">{{ error }}</div>

    <div class="grid grid-cols-2 gap-3">
      <div>
        <div class="mb-1.5"><span class="text-[13px] font-semibold text-[#344054]">First name</span></div>
        <input v-model="formData.firstName" type="text" placeholder="Alex" class="w-full rounded-lg shadow-sm outline-none transition focus:outline-none focus:ring-2 py-2.5 text-[13.5px] bg-white border border-[#d0d5dd] text-[#101828] placeholder-[#98a2b3] focus:ring-[#e13515] focus:border-[#e13515] px-3.5">
      </div>
      <div>
        <div class="mb-1.5"><span class="text-[13px] font-semibold text-[#344054]">Last name</span></div>
        <input v-model="formData.lastName" type="text" placeholder="Mwangi" class="w-full rounded-lg shadow-sm outline-none transition focus:outline-none focus:ring-2 py-2.5 text-[13.5px] bg-white border border-[#d0d5dd] text-[#101828] placeholder-[#98a2b3] focus:ring-[#e13515] focus:border-[#e13515] px-3.5">
      </div>
    </div>

    <div>
      <div class="mb-1.5"><span class="text-[13px] font-semibold text-[#344054]">Email address</span></div>
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="w-4 h-4 text-[#98a2b3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
        </div>
        <input v-model="formData.email" type="email" placeholder="you@company.com" class="w-full rounded-lg shadow-sm outline-none transition focus:outline-none focus:ring-2 py-2.5 text-[13.5px] bg-white border border-[#d0d5dd] text-[#101828] placeholder-[#98a2b3] focus:ring-[#e13515] focus:border-[#e13515] pl-9 pr-3.5">
      </div>
    </div>

    <div>
      <div class="mb-1.5"><span class="text-[13px] font-semibold text-[#344054]">Phone number</span><span class="text-[12px] text-[#98a2b3] ml-1">(optional)</span></div>
      <input v-model="formData.phone" type="tel" placeholder="+254 7XX XXX XXX" class="w-full rounded-lg shadow-sm outline-none transition focus:outline-none focus:ring-2 py-2.5 text-[13.5px] bg-white border border-[#d0d5dd] text-[#101828] placeholder-[#98a2b3] focus:ring-[#e13515] focus:border-[#e13515] px-3.5">
    </div>

    <div v-if="includeBusiness" class="grid grid-cols-1 gap-3">
      <div>
        <div class="mb-1.5"><span class="text-[13px] font-semibold text-[#344054]">Business name</span></div>
        <input v-model="formData.businessName" type="text" placeholder="PrintHub Nairobi" class="w-full rounded-lg shadow-sm outline-none transition focus:outline-none focus:ring-2 py-2.5 text-[13.5px] bg-white border border-[#d0d5dd] text-[#101828] placeholder-[#98a2b3] focus:ring-[#e13515] focus:border-[#e13515] px-3.5">
      </div>
      <div>
        <div class="mb-1.5"><span class="text-[13px] font-semibold text-[#344054]">Business location</span></div>
        <input v-model="formData.businessLocation" type="text" placeholder="Nairobi CBD" class="w-full rounded-lg shadow-sm outline-none transition focus:outline-none focus:ring-2 py-2.5 text-[13.5px] bg-white border border-[#d0d5dd] text-[#101828] placeholder-[#98a2b3] focus:ring-[#e13515] focus:border-[#e13515] px-3.5">
      </div>
    </div>

    <div>
      <div class="mb-1.5"><span class="text-[13px] font-semibold text-[#344054]">Password</span></div>
      <div class="relative">
        <input v-model="formData.password" :type="showPassword ? 'text' : 'password'" placeholder="Min. 8 characters" class="w-full rounded-lg shadow-sm outline-none transition focus:outline-none focus:ring-2 py-2.5 text-[13.5px] bg-white border border-[#d0d5dd] text-[#101828] placeholder-[#98a2b3] focus:ring-[#e13515] focus:border-[#e13515] pl-9 pr-10">
        <button type="button" class="absolute inset-y-0 right-0 pr-3 flex items-center text-[#98a2b3] hover:text-[#667085] transition-colors" @click="showPassword = !showPassword">
          <svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
        </button>
      </div>
    </div>

    <div>
      <div class="mb-1.5"><span class="text-[13px] font-semibold text-[#344054]">Confirm password</span></div>
      <input v-model="formData.confirmPassword" type="password" placeholder="Re-enter your password" class="w-full rounded-lg shadow-sm outline-none transition focus:outline-none focus:ring-2 py-2.5 text-[13.5px] bg-white border border-[#d0d5dd] text-[#101828] placeholder-[#98a2b3] focus:ring-[#e13515] focus:border-[#e13515] px-3.5">
    </div>

    <div class="flex items-start gap-2.5 pt-0.5">
      <input v-model="agreedToTerms" type="checkbox" class="mt-0.5 w-4 h-4 rounded border border-[#d0d5dd] text-[#e13515] accent-[#e13515] cursor-pointer">
      <span class="text-[13px] text-[#344054]">I agree to the <a href="#" class="font-semibold text-[#e13515] hover:text-[#b82c10] underline underline-offset-2">Terms of Service</a> and <a href="#" class="font-semibold text-[#e13515] hover:text-[#b82c10] underline underline-offset-2">Privacy Policy</a></span>
    </div>

    <button type="submit" :disabled="auth.isLoading" :class="buttonClass">
      {{ auth.isLoading ? 'Creating account...' : 'Create account' }}
    </button>
  </form>

  <p class="mt-6 text-center text-[13px] text-[#667085]">
    Already have an account?
    <NuxtLink to="/auth/login" class="font-semibold text-[#e13515] hover:text-[#b82c10] transition-colors underline underline-offset-2">Sign in</NuxtLink>
  </p>
</template>
