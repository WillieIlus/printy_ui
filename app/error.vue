<!-- Purpose: Minimal Nuxt error boundary page for restored frontend routes. -->
<template>
  <NuxtLayout name="default">
    <section class="flex min-h-screen items-center justify-center px-4 py-12">
      <UiCard class="max-w-xl space-y-4 text-center">
        <UiBadge tone="warning">Error {{ normalizedCode }}</UiBadge>
        <h1 class="text-3xl font-semibold tracking-tight text-slate-950">Something interrupted this page.</h1>
        <p class="text-sm text-slate-600">
          {{ normalizedMessage }}
        </p>
        <div class="flex flex-wrap items-center justify-center gap-3">
          <UiButton to="/" variant="primary">Back to homepage</UiButton>
          <UiButton v-if="showSignupAction" :to="shopSignupLink" variant="secondary">Go to signup</UiButton>
          <UiButton variant="secondary" @click="handleError">Clear error</UiButton>
        </div>
      </UiCard>
    </section>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

import { buildShopOwnerSignupRoute } from '~/shared/routes'

const props = defineProps<{
  error: NuxtError
}>()

const normalizedCode = computed(() => props.error?.statusCode ?? 500)
const normalizedMessage = computed(() => props.error?.statusMessage || 'The restored frontend shell hit an unexpected issue.')
const shopSignupLink = buildShopOwnerSignupRoute()
const showSignupAction = computed(() => normalizedCode.value === 401 || normalizedCode.value === 403 || normalizedCode.value === 404)
const handleError = () => clearError({ redirect: '/' })
</script>
