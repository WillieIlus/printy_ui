<template>
  <section
    id="top"
    class="relative overflow-hidden bg-[#101828] py-16 sm:py-24 w-screen max-w-none left-1/2 -translate-x-1/2"
  >
    <div class="absolute inset-0 opacity-20">
      <div class="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" />
      <div class="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000" />
      <div class="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000" />
    </div>

    <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start">
        <div class="max-w-xl">
          <h1 class="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {{ headline }}
          </h1>
          <p class="mt-5 text-lg text-gray-300 leading-relaxed">
            {{ subheadline }}
          </p>
          <div class="mt-8 flex flex-col sm:flex-row gap-4">
            <NuxtLink
              :to="primaryCtaTo"
              class="btn-primary inline-flex items-center justify-center rounded-xl bg-white/95 px-6 py-3.5 text-sm font-bold text-[#101828] hover:bg-white transition-colors shadow-lg"
            >
              {{ primaryCtaLabel }}
              <UIcon name="i-lucide-chevron-right" class="ml-2 w-4 h-4" />
            </NuxtLink>
            <NuxtLink
              :to="secondaryCtaTo"
              class="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/5 px-6 py-3.5 text-sm font-bold text-white hover:bg-white/10 transition-colors backdrop-blur-sm"
            >
              {{ secondaryCtaLabel }}
            </NuxtLink>
          </div>
        </div>

        <div class="mt-12 lg:mt-0">
          <slot name="demo">
            <ClientOnly>
              <HomeHeroDemo />
              <template #fallback>
                <div class="mt-12 lg:mt-0 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl h-48" />
              </template>
            </ClientOnly>
          </slot>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import HomeHeroDemo from '~/components/home/HomeHeroDemo.vue'

withDefaults(
  defineProps<{
    headline: string
    subheadline: string
    primaryCtaTo: string
    primaryCtaLabel: string
    secondaryCtaTo: string
    secondaryCtaLabel: string
  }>(),
  {
    headline: 'Get print prices in seconds',
    subheadline: 'Find nearby print shops, configure your job, and see clear estimates fast. Business cards, flyers, brochures—no confusion.',
    primaryCtaTo: '/shops',
    primaryCtaLabel: 'Find a print shop',
    secondaryCtaTo: '/#demo',
    secondaryCtaLabel: 'Try live pricing',
  },
)
</script>
