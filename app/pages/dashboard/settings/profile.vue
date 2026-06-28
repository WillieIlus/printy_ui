<script setup lang="ts">
definePageMeta({ layout: 'dashboard-client' })

const auth = useAuthStore()
const firstName = ref((auth.user as any)?.firstName || '')
const lastName = ref((auth.user as any)?.lastName || '')
const email = ref(auth.user?.email || '')
const phone = ref((auth.user as any)?.phone || '')
const saved = ref(false)

async function handleSubmit() {
  await auth.updateProfile({ firstName: firstName.value, lastName: lastName.value, phone: phone.value })
  saved.value = true
}
</script>

<template>
  <div class="mx-auto max-w-3xl space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-slate-900">Profile</h1>
      <p class="mt-1 text-sm text-slate-500">Update your personal account details.</p>
    </div>

    <DashboardSectionCard title="Personal information">
      <form class="space-y-5" @submit.prevent="handleSubmit">
        <div v-if="saved" class="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] text-emerald-700">
          Profile updated successfully.
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label class="text-[13px] font-semibold text-[#344054]">First name</label>
            <input v-model="firstName" type="text" class="mt-1.5 w-full rounded-lg shadow-sm outline-none transition focus:outline-none focus:ring-2 py-2.5 text-[13.5px] bg-white border border-[#d0d5dd] text-[#101828] placeholder-[#98a2b3] focus:ring-[#e13515] focus:border-[#e13515] px-3.5">
          </div>
          <div>
            <label class="text-[13px] font-semibold text-[#344054]">Last name</label>
            <input v-model="lastName" type="text" class="mt-1.5 w-full rounded-lg shadow-sm outline-none transition focus:outline-none focus:ring-2 py-2.5 text-[13.5px] bg-white border border-[#d0d5dd] text-[#101828] placeholder-[#98a2b3] focus:ring-[#e13515] focus:border-[#e13515] px-3.5">
          </div>
        </div>
        <div>
          <label class="text-[13px] font-semibold text-[#344054]">Email address</label>
          <input v-model="email" type="email" disabled class="mt-1.5 w-full rounded-lg py-2.5 text-[13.5px] bg-[#f9fafb] border border-[#d0d5dd] text-[#667085] px-3.5 cursor-not-allowed">
        </div>
        <div>
          <label class="text-[13px] font-semibold text-[#344054]">Phone number</label>
          <input v-model="phone" type="tel" class="mt-1.5 w-full rounded-lg shadow-sm outline-none transition focus:outline-none focus:ring-2 py-2.5 text-[13.5px] bg-white border border-[#d0d5dd] text-[#101828] placeholder-[#98a2b3] focus:ring-[#e13515] focus:border-[#e13515] px-3.5">
        </div>
        <button type="submit" class="inline-flex items-center justify-center gap-2 font-semibold transition-colors bg-[#e13515] border border-[#e13515] text-white shadow-[0_18px_36px_-22px_rgba(225,53,21,0.9)] hover:bg-[#b82c10] hover:border-[#b82c10] px-7 py-3.5 text-base rounded-xl w-full disabled:opacity-50 disabled:cursor-not-allowed">
          Save changes
        </button>
      </form>
    </DashboardSectionCard>
  </div>
</template>
