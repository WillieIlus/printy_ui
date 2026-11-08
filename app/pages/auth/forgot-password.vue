<template>
  <ForgotPasswordView />
</template>

<script setup lang="ts">
definePageMeta({ layout: 'design-auth', middleware: 'guest' })

useHead({ title: 'Printy - Forgot Password' })
</script>