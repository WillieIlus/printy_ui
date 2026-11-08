<template>
  <SignInView />
</template>

<script setup lang="ts">
definePageMeta({ layout: 'design-auth', middleware: 'guest' })

useHead({ title: 'Printy - Sign In' })
</script>