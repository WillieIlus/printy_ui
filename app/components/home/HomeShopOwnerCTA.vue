<template>
  <section class="relative overflow-hidden bg-[#08111f] py-14 sm:py-16">
    <div class="pointer-events-none absolute left-1/2 top-0 h-72 w-[36rem] -translate-x-1/2 bg-[radial-gradient(circle,rgba(247,115,68,0.13)_0%,transparent_70%)] blur-3xl" />

    <div class="relative mx-auto max-w-2xl px-4 text-center sm:px-6">
      <h2 class="text-2xl font-bold tracking-tight text-white sm:text-3xl">
        See the cost before calling any shop
      </h2>
      <p class="mt-3 text-base leading-7 text-slate-300">
        Configure a job in seconds, compare nearby print shops, and send a cleaner request without the usual back-and-forth.
      </p>

      <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <NuxtLink
          :to="primaryCtaTo"
          class="inline-flex items-center gap-2 rounded-full bg-flamingo-500 px-6 py-3.5 text-sm font-bold text-white shadow-[0_14px_32px_rgba(247,115,68,0.28)] transition-all hover:-translate-y-px hover:bg-flamingo-400"
        >
          {{ primaryCtaLabel }}
          <UIcon name="i-lucide-chevron-right" class="h-4 w-4" />
        </NuxtLink>
        <NuxtLink
          :to="secondaryCtaTo"
          class="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/[0.05] px-6 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/[0.1]"
        >
          {{ secondaryCtaLabel }}
          <UIcon name="i-lucide-store" class="h-4 w-4" />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    primaryCtaTo?: string
    primaryCtaLabel?: string
    secondaryCtaTo?: string
    secondaryCtaLabel?: string
  }>(),
  {
    primaryCtaTo: '/#hero-calculator',
    primaryCtaLabel: 'Try live pricing',
    secondaryCtaTo: '/shops',
    secondaryCtaLabel: 'Browse shops',
  },
)
</script>
