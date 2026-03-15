<template>
  <section class="py-16 sm:py-24 bg-[#101828] text-white">
    <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
      <h2 class="text-2xl font-extrabold tracking-tight sm:text-3xl">
        {{ headline }}
      </h2>
      <p class="mt-4 text-lg text-gray-300">
        {{ body }}
      </p>
      <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <NuxtLink
          :to="primaryCtaTo"
          class="btn-primary inline-flex items-center justify-center rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-[#101828] hover:bg-gray-100 transition-colors shadow-lg"
        >
          {{ primaryCtaLabel }}
        </NuxtLink>
        <NuxtLink
          :to="secondaryCtaTo"
          class="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/5 px-6 py-3.5 text-sm font-bold text-white hover:bg-white/10 transition-colors"
        >
          {{ secondaryCtaLabel }}
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    headline?: string
    body?: string
    primaryCtaTo?: string
    primaryCtaLabel?: string
    secondaryCtaTo?: string
    secondaryCtaLabel?: string
  }>(),
  {
    headline: 'Run a print shop?',
    body: 'Join Printy to get more quote requests and respond faster. Set your pricing once—generate accurate quotes every time.',
    primaryCtaTo: '/auth/signup',
    primaryCtaLabel: 'Create your shop',
    secondaryCtaTo: '/help',
    secondaryCtaLabel: 'Learn how it works',
  },
)
</script>
