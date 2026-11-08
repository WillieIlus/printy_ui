<template>
  <ChangePasswordView />
</template>

<script setup lang="ts">
definePageMeta({ layout: 'design-auth', middleware: 'auth' })

useHead({ title: 'Printy - Change Password' })
</script>