<template>
  <section
    ref="sectionEl"
    id="process"
    class="how-it-works-section relative left-1/2 w-screen max-w-none -translate-x-1/2 scroll-mt-20 py-24 text-white sm:py-32"
  >
    <div class="how-it-works-media" :style="mediaTransformStyle" aria-hidden="true" />
    <div class="how-it-works-overlay" />
    <div class="how-it-works-glow" />

    <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-2xl text-center">
        <span class="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-flamingo-400">
          Engineered for precision
        </span>
        <h2 class="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          The process redefined
        </h2>
        <p class="mt-4 text-sm leading-7 text-slate-200 sm:text-base">
          Printy handles the production logic, pricing structure, and request clarity so buyers move with confidence and shops receive better-scoped work.
        </p>
      </div>

      <div ref="stepsGridEl" class="mt-14 grid gap-6 lg:grid-cols-[1.15fr_0.85fr_0.85fr]">
        <article
          class="step-card rounded-[1.85rem] border border-white/14 bg-white/92 p-1.5 shadow-[0_28px_70px_rgba(0,0,0,0.28)] backdrop-blur-xl"
          :class="isMounted && !stepsVisible ? 'opacity-0 translate-y-6' : ''"
        >
          <div class="h-full rounded-[1.45rem] border border-slate-200/80 bg-white p-8 sm:p-9">
            <div class="flex items-start justify-between gap-4">
              <div>
                <span class="inline-flex rounded-full bg-slate-950 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                  Step 1
                </span>
                <h3 class="mt-5 text-2xl font-bold tracking-tight text-slate-950">{{ steps[0].title }}</h3>
                <p class="mt-3 max-w-md text-sm leading-6 text-slate-700">{{ steps[0].body }}</p>
              </div>
              <div :class="iconShellClass">
                <UIcon :name="steps[0].icon" class="h-7 w-7 text-flamingo-400" />
              </div>
            </div>

            <div class="mt-8 grid grid-cols-3 gap-4">
              <div
                v-for="size in sizes"
                :key="size.label"
                class="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center shadow-sm"
              >
                <div
                  class="mx-auto mb-4 border-2 border-slate-300/70 bg-white"
                  :class="size.previewClass"
                />
                <p class="text-sm font-semibold text-slate-900">{{ size.label }}</p>
                <p class="mt-1 text-xs text-slate-600">{{ size.caption }}</p>
              </div>
            </div>
          </div>
        </article>

        <article
          v-for="(step, i) in steps.slice(1)"
          :key="step.number"
          class="step-card rounded-[1.85rem] border border-white/12 bg-slate-950/60 p-1.5 shadow-[0_24px_60px_rgba(0,0,0,0.26)] backdrop-blur-xl"
          :class="isMounted && !stepsVisible ? 'opacity-0 translate-y-6' : ''"
          :style="{ transitionDelay: `${(i + 1) * 120}ms` }"
        >
          <div class="flex h-full flex-col rounded-[1.45rem] border border-white/10 bg-slate-950/68 p-8 sm:p-9">
            <div :class="iconShellClass">
              <UIcon :name="step.icon" class="h-7 w-7 text-flamingo-400" />
            </div>
            <span class="mt-6 text-[11px] font-semibold uppercase tracking-[0.12em] text-flamingo-400">
              Step {{ step.number }}
            </span>
            <h3 class="mt-3 text-2xl font-bold tracking-tight text-white">{{ step.title }}</h3>
            <p class="mt-3 text-sm leading-6 text-slate-200">{{ step.body }}</p>
            <div class="mt-6 flex flex-wrap gap-2">
              <span
                v-for="tag in step.tags"
                :key="tag"
                class="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-100"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const howItWorksImage = 'https://images.pexels.com/photos/15496531/pexels-photo-15496531.jpeg'

const sectionEl = ref<HTMLElement | null>(null)
const stepsGridEl = ref<HTMLElement | null>(null)
const parallaxOffset = ref(0)
const isMounted = ref(false)
const stepsVisible = ref(false)
const isParallaxActive = ref(false)

const mediaTransformStyle = computed(() => ({
  backgroundImage: `url("${howItWorksImage}")`,
  transform: `translate3d(0, ${parallaxOffset.value}px, 0) scale(1.06)`,
}))

const steps = [
  {
    number: 1,
    title: 'Complex print logic, translated instantly',
    body: 'Start from a real product, then let Printy translate size, quantity, and production constraints into something buyers can act on.',
    icon: 'i-lucide-layout-panel-top',
    tags: ['Product-led', 'Production logic'],
  },
  {
    number: 2,
    title: 'Precision before the quote chase',
    body: 'See pricing intelligence, nearby shop matches, and clearer production signals before the usual back-and-forth starts.',
    icon: 'i-lucide-scale-3d',
    tags: ['Pricing signals', 'Shop matching'],
  },
  {
    number: 3,
    title: 'Cleaner requests in, better jobs out',
    body: 'Send a more structured request, reduce ambiguity for the shop, and move into production with more confidence and less friction.',
    icon: 'i-lucide-send',
    tags: ['Clarity', 'Confidence'],
  },
]

const sizes = [
  { label: 'Standard', caption: 'Classic card format', previewClass: 'h-10 w-16 rounded-sm' },
  { label: 'Rounded', caption: 'Modern edge', previewClass: 'h-10 w-16 rounded-lg' },
  { label: 'Square', caption: 'Compact impact', previewClass: 'h-12 w-12 rounded-sm' },
]

const iconShellClass = 'flex h-14 w-14 items-center justify-center rounded-xl border border-flamingo-400/30 bg-slate-950 shadow-[0_14px_34px_rgba(8,17,31,0.3)]'

let rafId = 0
let queuedFrame = false
let cleanupScroll: (() => void) | null = null
let cleanupObs: (() => void) | null = null
let cleanupParallaxObs: (() => void) | null = null

function updateParallax() {
  if (!sectionEl.value) return
  if (window.innerWidth < 1024 || !isParallaxActive.value) {
    parallaxOffset.value = 0
    return
  }
  const rect = sectionEl.value.getBoundingClientRect()
  const viewportHeight = window.innerHeight || 1
  const progress = (viewportHeight - rect.top) / (viewportHeight + rect.height)
  const clamped = Math.max(0, Math.min(1, progress))
  parallaxOffset.value = (clamped - 0.5) * 18
}

function queueParallaxUpdate() {
  if (queuedFrame) return
  queuedFrame = true
  rafId = requestAnimationFrame(() => {
    queuedFrame = false
    updateParallax()
  })
}

onMounted(() => {
  isMounted.value = true
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!prefersReduced) {
    if (sectionEl.value && typeof IntersectionObserver !== 'undefined') {
      const obs = new IntersectionObserver(([entry]) => {
        isParallaxActive.value = entry.isIntersecting
        if (!entry.isIntersecting) {
          parallaxOffset.value = 0
          return
        }
        queueParallaxUpdate()
      }, { threshold: 0, rootMargin: '20% 0px 20% 0px' })
      obs.observe(sectionEl.value)
      cleanupParallaxObs = () => obs.disconnect()
    }
    else {
      isParallaxActive.value = true
    }

    const onScroll = () => {
      if (!isParallaxActive.value) return
      queueParallaxUpdate()
    }
    const onResize = () => queueParallaxUpdate()

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })
    queueParallaxUpdate()
    cleanupScroll = () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(rafId)
      queuedFrame = false
    }
  }
  else {
    parallaxOffset.value = 0
  }

  if (stepsGridEl.value && typeof IntersectionObserver !== 'undefined' && !prefersReduced) {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        stepsVisible.value = true
        obs.disconnect()
      }
    }, { threshold: 0.1 })
    obs.observe(stepsGridEl.value)
    cleanupObs = () => obs.disconnect()
  }
  else {
    stepsVisible.value = true
  }
})

onUnmounted(() => {
  cleanupScroll?.()
  cleanupObs?.()
  cleanupParallaxObs?.()
})
</script>

<style scoped>
.how-it-works-section {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  background-color: #08111f;
}

.how-it-works-media {
  position: absolute;
  inset: -3rem 0;
  z-index: -3;
  background-position: center 42%;
  background-size: cover;
  background-repeat: no-repeat;
  will-change: transform;
  pointer-events: none;
  transform-origin: center center;
}

.how-it-works-overlay {
  position: absolute;
  inset: 0;
  z-index: -2;
  background:
    linear-gradient(180deg, rgb(4 10 20 / 0.48) 0%, rgb(5 11 20 / 0.56) 26%, rgb(6 11 19 / 0.66) 56%, rgb(7 12 20 / 0.76) 100%);
}

.how-it-works-glow {
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(circle at 18% 18%, rgb(247 91 28 / 0.16), transparent 24rem),
    radial-gradient(circle at 84% 74%, rgb(247 91 28 / 0.08), transparent 22rem);
}

@media (min-width: 1024px) {
  .how-it-works-media {
    inset: -3.5rem 0;
    background-size: 112% auto;
  }
}

@media (max-width: 1023px), (prefers-reduced-motion: reduce) {
  .how-it-works-media {
    inset: 0;
    background-position: center 38%;
    background-size: cover;
    transform: none !important;
    will-change: auto;
  }
}

.step-card {
  transition: opacity 0.7s ease-out, transform 0.7s ease-out;
}

@media (prefers-reduced-motion: reduce) {
  .step-card {
    transition: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
</style>
