<template>
  <div>
    <NuxtLayout name="auth" title="Forgot password?" subtitle="Enter your email and we'll send a reset link." back-to="/auth/login">
      <AuthForgotPasswordForm />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  middleware: 'guest',
})
</script>
