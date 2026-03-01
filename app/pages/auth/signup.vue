<template>
  <div>
    <NuxtLayout name="auth" title="Create your account" subtitle="Start your journey with Printy today.">
      <AuthSignupForm />
      <template #footer>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Already have an account? <NuxtLink to="/auth/login" class="text-primary-600 hover:underline font-medium dark:text-primary-400">Sign in</NuxtLink>
        </p>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  middleware: 'guest',
})
</script>
