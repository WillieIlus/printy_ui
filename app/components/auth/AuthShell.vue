<template>
  <div class="relative overflow-hidden bg-[var(--p-bg)]">
    <div
      class="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[28rem]"
      style="background:radial-gradient(circle at top left,rgba(225,53,21,0.18),transparent 45%),radial-gradient(circle at top right,rgba(255,184,0,0.18),transparent 36%)"
    />
    <div class="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-10 md:px-6">
      <div class="grid w-full gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <BaseCard class="space-y-6">
          <NuxtLink
            to="/"
            aria-label="Go to Printy homepage"
            class="inline-flex items-center gap-3 rounded-full px-1 py-1 transition-opacity hover:opacity-90"
          >
            <span class="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#e13515]">
              <img
                src="/assets/logo-mark/light/printy-logo-mark-01.svg"
                alt=""
                class="h-full w-full object-cover"
              >
            </span>
            <img
              src="/assets/word-mark/dark/printy-word-mark-03.svg"
              alt="Printy"
              class="h-5 w-auto"
            >
          </NuxtLink>
          <slot />
        </BaseCard>

        <BaseCard tone="dark" class="flex flex-col justify-between gap-8">
          <slot name="panel" />
        </BaseCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseCard from '~/components/ui/BaseCard.vue'
</script>
