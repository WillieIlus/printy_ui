<script setup lang="ts">
import ReferenceSignupForm from '~/components/auth/ReferenceSignupForm.vue'

definePageMeta({ layout: 'auth' })
</script>

<template>
  <ReferenceSignupForm
    role="printshop"
    badge="Print Shop Account"
    title="Create print shop account"
    description="Join Printy to receive jobs and manage production."
    accent-class="text-emerald-700"
    accent-bg="bg-emerald-50"
    accent-border="border border-emerald-200"
    button-class="inline-flex items-center justify-center gap-2 font-semibold transition-colors bg-emerald-600 border border-emerald-600 text-white shadow-[0_18px_36px_-22px_rgba(5,150,105,0.9)] hover:bg-emerald-700 hover:border-emerald-700 px-7 py-3.5 text-base rounded-xl w-full disabled:opacity-50 disabled:cursor-not-allowed"
    include-business
  />
</template>
