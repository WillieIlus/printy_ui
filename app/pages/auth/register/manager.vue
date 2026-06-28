<script setup lang="ts">
import ReferenceSignupForm from '~/components/auth/ReferenceSignupForm.vue'

definePageMeta({ layout: 'auth' })
</script>

<template>
  <ReferenceSignupForm
    role="manager"
    badge="Manager Account"
    title="Create manager account"
    description="Manage quotes, clients, and print production workflows."
    accent-class="text-blue-700"
    accent-bg="bg-blue-50"
    accent-border="border border-blue-200"
    button-class="inline-flex items-center justify-center gap-2 font-semibold transition-colors bg-blue-600 border border-blue-600 text-white shadow-[0_18px_36px_-22px_rgba(37,99,235,0.9)] hover:bg-blue-700 hover:border-blue-700 px-7 py-3.5 text-base rounded-xl w-full disabled:opacity-50 disabled:cursor-not-allowed"
  />
</template>
