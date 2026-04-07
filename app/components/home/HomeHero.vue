<template>
  <section
    id="top"
    ref="heroSectionRef"
    class="relative left-1/2 w-screen max-w-none -translate-x-1/2 overflow-hidden bg-[#08111f] py-16 text-white sm:py-24"
  >
    <div class="pointer-events-none absolute inset-0">
      <div
        class="absolute inset-0 will-change-transform"
        :style="parallaxStyles[0]"
      >
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(27,46,86,0.42),transparent_34%),linear-gradient(180deg,#0b1424_0%,#08111f_52%,#09101d_100%)]" />
      </div>

      <div
        class="absolute inset-0 opacity-40 will-change-transform max-md:hidden"
        :style="parallaxStyles[1]"
      >
        <svg viewBox="0 0 1600 760" class="h-full w-full" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <pattern id="hero-grid" width="44" height="44" patternUnits="userSpaceOnUse">
              <path d="M44 0 H0 V44" fill="none" stroke="rgba(148,163,184,0.08)" stroke-width="1" />
            </pattern>
          </defs>
          <rect width="1600" height="760" fill="url(#hero-grid)" />
          <path d="M90 470 C320 380 420 520 635 438 S1025 326 1285 392 S1450 470 1520 430" fill="none" stroke="rgba(251,146,60,0.12)" stroke-width="2" stroke-dasharray="4 12" stroke-linecap="round" />
          <path d="M122 214 C258 170 390 252 540 210 S850 146 1010 202 S1290 250 1478 186" fill="none" stroke="rgba(68,103,178,0.1)" stroke-width="1.6" stroke-dasharray="2 10" stroke-linecap="round" />
        </svg>
      </div>

      <div
        class="absolute right-[8%] top-[14%] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(68,103,178,0.2)_0%,rgba(68,103,178,0.08)_34%,transparent_72%)] blur-3xl will-change-transform"
        :style="parallaxStyles[2]"
      />
      <div
        class="absolute left-1/2 top-[22%] h-[24rem] w-[24rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(251,146,60,0.09)_0%,rgba(251,146,60,0.04)_30%,transparent_72%)] blur-3xl will-change-transform"
        :style="parallaxStyles[3]"
      />
      <div
        class="absolute bottom-[-8rem] left-[18%] h-[18rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(244,114,182,0.08)_0%,rgba(244,114,182,0.03)_34%,transparent_76%)] blur-3xl will-change-transform"
        :style="parallaxStyles[4]"
      />
    </div>

    <div class="relative mx-auto max-w-[92rem] px-4 sm:px-6 lg:px-8">
      <div class="lg:grid lg:grid-cols-[minmax(0,0.68fr)_minmax(0,1.32fr)] lg:items-start lg:gap-10 xl:gap-14">
        <div class="max-w-xl self-start lg:max-w-[31rem] lg:pr-2 xl:max-w-[33rem]">
          <div class="mb-7 rounded-[1.35rem] border border-white/10 bg-slate-950/26 p-3 shadow-[0_18px_40px_rgba(0,0,0,0.14)] backdrop-blur-xl">
            <div class="px-2 pb-2">
              <p class="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-flamingo-400/90">
                Solve the common print buying friction first
              </p>
            </div>

            <div class="-mx-1 overflow-x-auto pb-1">
              <div class="min-w-[42rem] px-1 sm:min-w-0">
                <div class="relative flex items-center justify-between gap-3 sm:gap-2 lg:gap-3">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 820 92"
                    class="pointer-events-none absolute inset-x-0 top-1/2 hidden h-16 w-full -translate-y-1/2 sm:block"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="hero-flow-line" x1="0%" x2="100%" y1="0%" y2="0%">
                        <stop offset="0%" stop-color="rgba(148,163,184,0.18)" />
                        <stop offset="45%" stop-color="rgba(251,146,60,0.18)" />
                        <stop offset="100%" stop-color="rgba(251,146,60,0.32)" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M42 46 H210 C250 46 252 26 292 26 H362 C402 26 404 58 444 58 H514 C554 58 556 34 596 34 H778"
                      fill="none"
                      stroke="url(#hero-flow-line)"
                      stroke-width="1.4"
                      stroke-linecap="round"
                      stroke-dasharray="4 8"
                    />
                    <path
                      d="M760 30 L778 34 L760 38"
                      fill="none"
                      stroke="rgba(251,146,60,0.42)"
                      stroke-width="1.4"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>

                  <article
                    v-for="item in flowItems"
                    :key="item.label"
                    class="group relative flex min-w-[9rem] flex-1 items-center gap-2.5 rounded-xl px-2 py-2 sm:min-w-0"
                  >
                    <div
                      class="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors"
                      :class="item.kind === 'solution'
                        ? 'border-flamingo-400/30 bg-flamingo-500/12 text-flamingo-300 group-hover:border-flamingo-300/40 group-hover:bg-flamingo-500/16'
                        : 'border-white/10 bg-white/[0.04] text-slate-400 group-hover:border-white/16 group-hover:text-slate-300'"
                    >
                      <span
                        class="absolute inset-1 rounded-full"
                        :class="item.kind === 'solution' ? 'bg-flamingo-500/6' : 'bg-transparent'"
                      />
                      <UIcon :name="item.icon" class="relative h-3.5 w-3.5" />
                    </div>

                    <div class="min-w-0">
                      <p
                        class="truncate text-[0.68rem] font-semibold uppercase tracking-[0.14em]"
                        :class="item.kind === 'solution' ? 'text-white' : 'text-slate-500'"
                      >
                        {{ item.label }}
                      </p>
                    </div>

                    <div
                      v-if="item.kind === 'problem'"
                      class="hidden shrink-0 items-center gap-1 text-flamingo-300/75 sm:flex"
                    >
                      <span class="h-px w-4 bg-flamingo-400/25" />
                      <UIcon name="i-lucide-arrow-right" class="h-3 w-3" />
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </div>

          <div class="mb-7 overflow-hidden rounded-2xl border border-white/10 shadow-[0_18px_48px_rgba(0,0,0,0.32)]">
            <img
              src="/hero-illustration.png"
              alt="Handling print quotes: chaos vs. technology — from confusion to clarity"
              class="w-full object-cover"
              loading="eager"
              decoding="async"
            />
          </div>

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
import { computed, onBeforeUnmount, onMounted } from 'vue'

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

const heroSectionRef = ref<HTMLElement | null>(null)
const parallaxOffsets = ref([0, 0, 0, 0, 0])

const parallaxStyles = computed(() =>
  parallaxOffsets.value.map((offset) => ({
    transform: `translate3d(0, ${offset.toFixed(2)}px, 0)`,
  }))
)

let animationFrameId: number | null = null
let mediaQuery: MediaQueryList | null = null
let isReducedMotion = false
let motionFactor = 1

function updateMotionPreferences() {
  isReducedMotion = mediaQuery?.matches ?? false

  if (typeof window === 'undefined') {
    motionFactor = 1
    return
  }

  if (window.innerWidth < 640) {
    motionFactor = 0.16
    return
  }

  if (window.innerWidth < 1024) {
    motionFactor = 0.38
    return
  }

  motionFactor = 1
}

function updateParallax() {
  animationFrameId = null

  if (typeof window === 'undefined' || !heroSectionRef.value) {
    return
  }

  if (isReducedMotion) {
    parallaxOffsets.value = [0, 0, 0, 0, 0]
    return
  }

  const rect = heroSectionRef.value.getBoundingClientRect()
  const viewportHeight = Math.max(window.innerHeight, 1)
  const progress = Math.min(Math.max(-rect.top / viewportHeight, -0.2), 1.15)
  const distances = [8, 18, 26, 34, 24]

  parallaxOffsets.value = distances.map((distance) => progress * distance * motionFactor)
}

function queueParallaxUpdate() {
  if (animationFrameId !== null) return
  animationFrameId = window.requestAnimationFrame(updateParallax)
}

function handleMediaPreferenceChange() {
  updateMotionPreferences()
  queueParallaxUpdate()
}

onMounted(() => {
  if (typeof window === 'undefined') return

  mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  updateMotionPreferences()
  updateParallax()

  window.addEventListener('scroll', queueParallaxUpdate, { passive: true })
  window.addEventListener('resize', handleMediaPreferenceChange, { passive: true })
  mediaQuery.addEventListener?.('change', handleMediaPreferenceChange)
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', queueParallaxUpdate)
    window.removeEventListener('resize', handleMediaPreferenceChange)
  }

  mediaQuery?.removeEventListener?.('change', handleMediaPreferenceChange)

  if (animationFrameId !== null && typeof window !== 'undefined') {
    window.cancelAnimationFrame(animationFrameId)
  }
})

const flowItems = [
  {
    label: 'Guessing',
    icon: 'i-lucide-receipt',
    kind: 'problem',
  },
  {
    label: 'Instant',
    icon: 'i-lucide-zap',
    kind: 'solution',
  },
  {
    label: 'Waiting',
    icon: 'i-lucide-clock-3',
    kind: 'problem',
  },
  {
    label: 'Compare',
    icon: 'i-lucide-store',
    kind: 'solution',
  },
  {
    label: 'Confused',
    icon: 'i-lucide-sliders-horizontal',
    kind: 'problem',
  },
  {
    label: 'Guided',
    icon: 'i-lucide-compass',
    kind: 'solution',
  },
  {
    label: 'Messy',
    icon: 'i-lucide-file-text',
    kind: 'problem',
  },
  {
    label: 'Clear',
    icon: 'i-lucide-send',
    kind: 'solution',
  },
] as const

</script>
