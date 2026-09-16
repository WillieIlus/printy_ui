<template>
  <ChangePasswordView />
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default', middleware: 'auth' })

useHead({ title: 'Printy - Change Password' })
</script>