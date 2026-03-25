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
      <div class="lg:grid lg:grid-cols-2 lg:items-center lg:gap-12">
        <div class="max-w-xl self-center">
          <h1
            class="max-w-[11.25ch] text-[clamp(3.35rem,12vw,4.9rem)] font-extrabold leading-[0.92] tracking-[-0.05em] text-white sm:max-w-[11.6ch] sm:text-[clamp(4.35rem,8vw,6rem)] lg:max-w-[11.8ch] lg:text-[clamp(5.35rem,7vw,7rem)]"
          >
            <template v-if="heroHeadline.leading">
              <span class="block max-w-full">{{ heroHeadline.leading }}</span>
              <span
                class="mt-2.5 block w-full max-w-full text-[0.99em] font-black leading-[0.9] tracking-[-0.06em] text-flamingo-500 sm:mt-3"
              >
                {{ heroHeadline.trailing }}
              </span>
            </template>
            <template v-else>
              {{ props.headline }}
            </template>
          </h1>
          <p class="mt-5 text-lg leading-relaxed text-gray-300">
            {{ props.subheadline }}
          </p>
          <div class="mt-8 flex flex-col sm:flex-row gap-4">
            <NuxtLink
              :to="props.primaryCtaTo"
              class="btn-primary cta-button inline-flex items-center justify-center rounded-xl bg-white/95 px-6 py-3.5 text-sm font-bold text-[#101828] shadow-lg transition-colors hover:bg-white"
            >
              {{ props.primaryCtaLabel }}
              <UIcon name="i-lucide-chevron-right" class="ml-2 w-4 h-4" />
            </NuxtLink>
            <NuxtLink
              :to="props.secondaryCtaTo"
              class="cta-button inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/5 px-6 py-3.5 text-sm font-bold text-white transition-colors backdrop-blur-sm hover:bg-white/10"
            >
              {{ props.secondaryCtaLabel }}
            </NuxtLink>
          </div>
        </div>

        <div class="mt-12 lg:mt-0 lg:self-center">
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
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    headline?: string
    subheadline?: string
    primaryCtaTo?: string
    primaryCtaLabel?: string
    secondaryCtaTo?: string
    secondaryCtaLabel?: string
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

const heroHeadline = computed(() => {
  const match = props.headline.match(/^(.*)\s+(in seconds)$/i)
  if (!match) {
    return {
      leading: '',
      trailing: '',
    }
  }

  return {
    leading: match[1],
    trailing: 'in Seconds',
  }
})

</script>
