<!-- Purpose: Minimal Nuxt error boundary page for restored frontend routes. -->
<template>
  <NuxtLayout name="default">
    <section class="flex min-h-screen items-center justify-center px-4 py-12">
      <BaseCard class="max-w-xl space-y-4 text-center">
        <BaseBadge tone="primary">Error {{ normalizedCode }}</BaseBadge>
        <h1 class="text-3xl font-semibold tracking-tight text-slate-950">Something interrupted this page.</h1>
        <p class="text-sm text-slate-600">
          {{ normalizedMessage }}
        </p>
        <div class="flex flex-wrap items-center justify-center gap-3">
          <BaseButton to="/" variant="primary">Back to homepage</BaseButton>
          <BaseButton variant="secondary" @click="handleError">Clear error</BaseButton>
        </div>
      </BaseCard>
    </section>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

import BaseBadge from '~/components/ui/BaseBadge.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseCard from '~/components/ui/BaseCard.vue'

const props = defineProps<{
  error: NuxtError
}>()

const normalizedCode = computed(() => props.error?.statusCode ?? 500)
const normalizedMessage = computed(() => props.error?.statusMessage || 'The restored frontend shell hit an unexpected issue.')
const handleError = () => clearError({ redirect: '/' })
</script>
