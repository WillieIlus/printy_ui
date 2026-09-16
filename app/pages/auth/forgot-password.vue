<template>
  <ForgotPasswordView />
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default', middleware: 'guest' })

useHead({ title: 'Printy - Forgot Password' })
</script>