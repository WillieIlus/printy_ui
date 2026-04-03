<template>
  <section
    id="top"
    class="relative left-1/2 w-screen max-w-none -translate-x-1/2 overflow-hidden bg-[#08111f] py-16 text-white sm:py-24"
  >
    <div class="pointer-events-none absolute inset-0">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(27,46,86,0.42),transparent_34%),linear-gradient(180deg,#0b1424_0%,#08111f_52%,#09101d_100%)]" />
      <div class="absolute right-[8%] top-[14%] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(68,103,178,0.2)_0%,rgba(68,103,178,0.08)_34%,transparent_72%)] blur-3xl" />
      <div class="absolute left-1/2 top-[22%] h-[24rem] w-[24rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(251,146,60,0.09)_0%,rgba(251,146,60,0.04)_30%,transparent_72%)] blur-3xl" />
      <div class="absolute bottom-[-8rem] left-[18%] h-[18rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(244,114,182,0.08)_0%,rgba(244,114,182,0.03)_34%,transparent_76%)] blur-3xl" />
    </div>

    <div class="relative mx-auto max-w-[92rem] px-4 sm:px-6 lg:px-8">
      <div class="lg:grid lg:grid-cols-[minmax(0,0.68fr)_minmax(0,1.32fr)] lg:items-start lg:gap-10 xl:gap-14">
        <div class="max-w-xl self-start lg:max-w-[31rem] lg:pr-2 xl:max-w-[33rem]">
          <h1
            class="max-w-[14ch] text-[clamp(1.75rem,5.8vw,2.6rem)] font-bold leading-[0.94] tracking-[-0.04em] text-white drop-shadow-[0_18px_40px_rgba(0,0,0,0.28)] sm:max-w-[16ch] sm:text-[clamp(2rem,4.4vw,2.95rem)] lg:max-w-[15ch] lg:text-[clamp(2.3rem,3.2vw,3.2rem)]"
          >
            <template v-if="heroHeadline.leading">
              <span class="block max-w-full whitespace-nowrap">{{ heroHeadline.leading }}</span>
              <span
                class="mt-2 block w-full text-[1.24em] font-extrabold leading-[0.9] tracking-[-0.055em] text-flamingo-500 drop-shadow-[0_12px_28px_rgba(0,0,0,0.22)] sm:mt-2.5"
              >
                {{ heroHeadline.trailing }}
              </span>
            </template>
            <template v-else>
              {{ props.headline }}
            </template>
          </h1>
          <p class="mt-5 max-w-xl text-[1rem] leading-7 text-slate-300 sm:text-[1.03rem]">
            {{ props.subheadline }}
          </p>
          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <NuxtLink
              :to="props.primaryCtaTo"
              class="cta-button inline-flex items-center justify-center rounded-xl bg-flamingo-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-flamingo-500/25 transition-colors hover:bg-flamingo-400 hover:shadow-flamingo-500/35"
            >
              {{ props.primaryCtaLabel }}
              <UIcon name="i-lucide-chevron-right" class="ml-2 w-4 h-4" />
            </NuxtLink>
            <NuxtLink
              :to="props.secondaryCtaTo"
              class="cta-button inline-flex items-center justify-center rounded-xl border border-white/20 bg-slate-900/60 px-6 py-3.5 text-sm font-bold text-white transition-colors backdrop-blur-sm hover:bg-slate-800/72"
            >
              {{ props.secondaryCtaLabel }}
            </NuxtLink>
          </div>
        </div>

        <div class="mt-12 min-w-0 lg:mt-0 lg:self-start">
          <slot name="demo">
            <ClientOnly>
              <HomeHeroDemo />
              <template #fallback>
                <div class="mt-12 h-48 rounded-2xl border border-white/12 bg-slate-950/72 p-6 backdrop-blur-xl lg:mt-0" />
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
