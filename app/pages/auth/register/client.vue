<script setup lang="ts">
import ReferenceSignupForm from '~/components/auth/ReferenceSignupForm.vue'

definePageMeta({ layout: 'auth' })
</script>

<template>
  <ReferenceSignupForm
    role="client"
    badge="Client Account"
    title="Create your account"
    description="Get started with Printy to manage all your printing needs."
    accent-class="text-[#e13515]"
    accent-bg="bg-[#fdf1ee]"
    accent-border="border border-[#fcd5cc]"
    button-class="inline-flex items-center justify-center gap-2 font-semibold transition-colors bg-[#e13515] border border-[#e13515] text-white shadow-[0_18px_36px_-22px_rgba(225,53,21,0.9)] hover:bg-[#b82c10] hover:border-[#b82c10] px-7 py-3.5 text-base rounded-xl w-full disabled:opacity-50 disabled:cursor-not-allowed"
  />
</template>
