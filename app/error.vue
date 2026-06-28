<!-- Purpose: Minimal Nuxt error boundary page for restored frontend routes. -->


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

<template>
  <main class="min-h-screen bg-slate-50 px-6 py-16 text-slate-900">
    <section class="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <p class="text-sm font-semibold uppercase tracking-[0.2em] text-[#e13515]">
        Error {{ normalizedCode }}
      </p>
      <h1 class="mt-3 text-3xl font-bold tracking-tight">
        {{ normalizedMessage }}
      </h1>
      <p class="mt-4 text-sm leading-6 text-slate-600">
        The route could not be rendered. Return home and try the workflow again.
      </p>
      <div class="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          class="rounded-lg bg-[#e13515] px-4 py-2 text-sm font-semibold text-white shadow-[0_18px_36px_-22px_rgba(225,53,21,0.9)]"
          @click="handleError"
        >
          Go home
        </button>
        <NuxtLink
          v-if="showSignupAction"
          :to="shopSignupLink"
          class="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
        >
          Shop signup
        </NuxtLink>
      </div>
    </section>
  </main>
</template>
