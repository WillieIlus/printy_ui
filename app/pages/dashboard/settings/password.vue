<script setup lang="ts">
definePageMeta({ layout: 'dashboard-client' })

const auth = useAuthStore()
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const error = ref('')
const saved = ref(false)

async function handleSubmit() {
  error.value = ''
  saved.value = false
  if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
    error.value = 'Please fill in all fields'
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }
  if (newPassword.value.length < 8) {
    error.value = 'Password must be at least 8 characters'
    return
  }
  await auth.changePassword(currentPassword.value, newPassword.value)
  saved.value = true
}
</script>

<template>
  <div class="mx-auto max-w-3xl space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-slate-900">Change password</h1>
      <p class="mt-1 text-sm text-slate-500">Use a strong password with at least 8 characters.</p>
    </div>

    <DashboardSectionCard title="Password">
      <form class="space-y-5" @submit.prevent="handleSubmit">
        <div v-if="error" class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">{{ error }}</div>
        <div v-if="saved" class="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] text-emerald-700">Password changed successfully.</div>
        <div>
          <label class="text-[13px] font-semibold text-[#344054]">Current password</label>
          <input v-model="currentPassword" type="password" class="mt-1.5 w-full rounded-lg shadow-sm outline-none transition focus:outline-none focus:ring-2 py-2.5 text-[13.5px] bg-white border border-[#d0d5dd] text-[#101828] placeholder-[#98a2b3] focus:ring-[#e13515] focus:border-[#e13515] px-3.5">
        </div>
        <div>
          <label class="text-[13px] font-semibold text-[#344054]">New password</label>
          <input v-model="newPassword" type="password" class="mt-1.5 w-full rounded-lg shadow-sm outline-none transition focus:outline-none focus:ring-2 py-2.5 text-[13.5px] bg-white border border-[#d0d5dd] text-[#101828] placeholder-[#98a2b3] focus:ring-[#e13515] focus:border-[#e13515] px-3.5">
        </div>
        <div>
          <label class="text-[13px] font-semibold text-[#344054]">Confirm new password</label>
          <input v-model="confirmPassword" type="password" class="mt-1.5 w-full rounded-lg shadow-sm outline-none transition focus:outline-none focus:ring-2 py-2.5 text-[13.5px] bg-white border border-[#d0d5dd] text-[#101828] placeholder-[#98a2b3] focus:ring-[#e13515] focus:border-[#e13515] px-3.5">
        </div>
        <button type="submit" class="inline-flex items-center justify-center gap-2 font-semibold transition-colors bg-[#e13515] border border-[#e13515] text-white shadow-[0_18px_36px_-22px_rgba(225,53,21,0.9)] hover:bg-[#b82c10] hover:border-[#b82c10] px-7 py-3.5 text-base rounded-xl w-full disabled:opacity-50 disabled:cursor-not-allowed">
          Change password
        </button>
      </form>
    </DashboardSectionCard>
  </div>
</template>
