<template>
  <SignUpView />
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'guest' })

useHead({ title: 'Printy - Sign Up' })
</script>