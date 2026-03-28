<template>
  <section
    id="top"
    class="relative left-1/2 w-screen max-w-none -translate-x-1/2 overflow-hidden bg-[#08111f] py-16 sm:py-24"
  >
    <div class="pointer-events-none absolute inset-0">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(27,46,86,0.42),transparent_34%),linear-gradient(180deg,#0b1424_0%,#08111f_52%,#09101d_100%)]" />
      <div class="absolute right-[8%] top-[14%] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(68,103,178,0.2)_0%,rgba(68,103,178,0.08)_34%,transparent_72%)] blur-3xl" />
      <div class="absolute left-1/2 top-[22%] h-[24rem] w-[24rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(251,146,60,0.09)_0%,rgba(251,146,60,0.04)_30%,transparent_72%)] blur-3xl" />
      <div class="absolute bottom-[-8rem] left-[18%] h-[18rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(244,114,182,0.08)_0%,rgba(244,114,182,0.03)_34%,transparent_76%)] blur-3xl" />
    </div>

    <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="lg:grid lg:grid-cols-[1fr_3fr] lg:items-center lg:gap-12">
        <div class="max-w-xl self-center">
          <h1
            class="max-w-[12ch] text-[clamp(2.55rem,9vw,3.95rem)] font-extrabold leading-[0.94] tracking-[-0.045em] text-[var(--p-text)] sm:max-w-[12.1ch] sm:text-[clamp(3.2rem,6.5vw,4.55rem)] lg:max-w-[12.3ch] lg:text-[clamp(3.8rem,5.5vw,5.05rem)]"
          >
            <template v-if="heroHeadline.leading">
              <span class="block max-w-full">{{ heroHeadline.leading }}</span>
              <span
                class="mt-2.5 block w-[100%] max-w-[8.4ch] text-[1em] font-black leading-[0.92] tracking-[-0.06em] text-flamingo-500 sm:mt-3 sm:max-w-[8.8ch]"
              >
                {{ heroHeadline.trailing }}
              </span>
            </template>
            <template v-else>
              {{ props.headline }}
            </template>
          </h1>
          <p class="mt-5 text-lg leading-relaxed text-[var(--p-text-dim)]">
            {{ props.subheadline }}
          </p>
          <div class="mt-8 flex flex-col sm:flex-row gap-4">
            <NuxtLink
              :to="props.primaryCtaTo"
              class="btn-primary cta-button inline-flex items-center justify-center rounded-xl px-6 py-3.5 text-sm font-bold shadow-lg transition-colors"
            >
              {{ props.primaryCtaLabel }}
              <UIcon name="i-lucide-chevron-right" class="ml-2 w-4 h-4" />
            </NuxtLink>
            <NuxtLink
              :to="props.secondaryCtaTo"
              class="cta-button inline-flex items-center justify-center rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] px-6 py-3.5 text-sm font-bold text-[var(--p-text)] transition-colors backdrop-blur-sm hover:bg-[var(--p-surface-sunken)]"
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
