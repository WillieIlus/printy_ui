<template>
  <SignInView />
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'guest' })

useHead({ title: 'Printy - Sign In' })
</script>