<template>
  <div class="dark">
    <div
      class="rounded-3xl border border-white/10 bg-slate-900/82 shadow-[0_32px_80px_rgba(0,0,0,0.42)] backdrop-blur-xl"
    >
      <!--
        Card header — always visible.
        Clicking the chevron button collapses/expands.
        The header itself is NOT an interaction trigger so accidental
        scroll-driven collapses are not mis-attributed to the user.
      -->
      <div
        class="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between sm:p-5"
      >
        <div>
          <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-flamingo-300">
            Live calculator
          </p>
          <Transition name="calc-subtitle" mode="out-in">
            <p v-if="isOpen" key="open" class="mt-1.5 max-w-md text-sm leading-6 text-slate-300">
              Use the same backend-driven pricing flow here, then continue into live shop matches.
            </p>
            <p v-else key="closed" class="mt-1 text-sm text-slate-400">
              Expand to calculate your print price instantly.
            </p>
          </Transition>
        </div>

        <div class="flex shrink-0 items-center gap-2">
          <div
            class="hidden shrink-0 items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-medium text-slate-300 sm:flex"
          >
            <UIcon name="i-lucide-scan-search" class="h-3.5 w-3.5 text-flamingo-300" />
            Backend-driven fields
          </div>

          <button
            type="button"
            class="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
            :aria-label="isOpen ? 'Collapse calculator' : 'Expand calculator'"
            @click="toggleCollapse"
          >
            <UIcon
              name="i-lucide-chevron-down"
              class="h-4 w-4 transition-transform duration-200 ease-in-out"
              :class="{ 'rotate-180': isOpen }"
            />
          </button>
        </div>
      </div>

      <!-- Separator: always in DOM so it can fade rather than pop in/out -->
      <div
        class="border-b border-white/10 transition-opacity duration-200 ease-in-out"
        :class="isOpen ? 'opacity-100' : 'opacity-0'"
        aria-hidden="true"
      />

      <!--
        Calculator body.

        v-show (not v-if) keeps the component mounted so all internal state
        (field values, backend results, matched shops) is preserved across
        collapse/expand cycles.
      -->
      <Transition
        name="calc-body"
        @before-enter="onBeforeEnter"
        @enter="onEnter"
        @after-enter="onAfterEnter"
        @before-leave="onBeforeLeave"
        @leave="onLeave"
        @after-leave="onAfterLeave"
      >
        <div
          v-show="isOpen"
          class="transform-gpu"
        >
          <div class="p-4 pt-4 sm:p-5 sm:pt-5">
            <QuotesPublicCalculator
              anchor-id="hero-calculator"
              mode="marketplace"
              :compact="true"
              title=""
              description=""
              eyebrow=""
              @modified="handleCalculatorModified"
            />
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue'

const CALC_PANEL_EASING = 'cubic-bezier(0.22, 1, 0.36, 1)'
const CALC_ENTER_DURATION = 280
const CALC_LEAVE_DURATION = 220

/**
 * Whether the calculator body is currently visible.
 * Starts open; may be auto-collapsed by scroll for passive visitors,
 * or toggled manually by the user.
 */
const isOpen = ref(true)

/**
 * Set to true when the user explicitly clicks the collapse button.
 * Prevents the scroll-up auto-reopen for users who chose to hide the
 * calculator while it is still above the Products fold.
 * Cleared whenever the user manually expands the calculator.
 */
const userCollapsed = ref(false)
const userModified = ref(false)

function toggleCollapse() {
  if (isOpen.value) {
    // User is explicitly hiding the calculator.
    userCollapsed.value = true
    isOpen.value = false
  }
  else {
    // User is explicitly reopening the calculator.
    userCollapsed.value = false
    isOpen.value = true
  }
}

function handleCalculatorModified() {
  userModified.value = true
}

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function resetTransitionStyles(element: Element) {
  const el = element as HTMLElement
  el.style.height = ''
  el.style.opacity = ''
  el.style.transform = ''
  el.style.overflow = ''
  el.style.pointerEvents = ''
  el.style.willChange = ''
  el.style.transition = ''
}

function onBeforeEnter(element: Element) {
  const el = element as HTMLElement

  if (prefersReducedMotion()) {
    resetTransitionStyles(el)
    return
  }

  el.style.height = '0px'
  el.style.opacity = '0'
  el.style.transform = 'translateY(10px) scale(0.995)'
  el.style.overflow = 'hidden'
  el.style.pointerEvents = 'none'
  el.style.willChange = 'height, opacity, transform'
}

function onEnter(element: Element, done: () => void) {
  const el = element as HTMLElement

  if (prefersReducedMotion()) {
    resetTransitionStyles(el)
    done()
    return
  }

  const targetHeight = `${el.scrollHeight}px`
  void el.offsetHeight
  el.style.transition = [
    `height ${CALC_ENTER_DURATION}ms ${CALC_PANEL_EASING}`,
    `opacity ${CALC_ENTER_DURATION}ms ${CALC_PANEL_EASING}`,
    `transform ${CALC_ENTER_DURATION}ms ${CALC_PANEL_EASING}`,
  ].join(', ')
  el.style.height = targetHeight
  el.style.opacity = '1'
  el.style.transform = 'translateY(0) scale(1)'

  window.setTimeout(done, CALC_ENTER_DURATION)
}

function onAfterEnter(element: Element) {
  resetTransitionStyles(element)
}

function onBeforeLeave(element: Element) {
  const el = element as HTMLElement

  if (prefersReducedMotion()) {
    resetTransitionStyles(el)
    return
  }

  el.style.height = `${el.scrollHeight}px`
  el.style.opacity = '1'
  el.style.transform = 'translateY(0) scale(1)'
  el.style.overflow = 'hidden'
  el.style.pointerEvents = 'none'
  el.style.willChange = 'height, opacity, transform'
}

function onLeave(element: Element, done: () => void) {
  const el = element as HTMLElement

  if (prefersReducedMotion()) {
    resetTransitionStyles(el)
    done()
    return
  }

  void el.offsetHeight
  el.style.transition = [
    `height ${CALC_LEAVE_DURATION}ms ${CALC_PANEL_EASING}`,
    `opacity ${CALC_LEAVE_DURATION}ms ease-in`,
    `transform ${CALC_LEAVE_DURATION}ms ease-in`,
  ].join(', ')
  el.style.height = '0px'
  el.style.opacity = '0'
  el.style.transform = 'translateY(-6px) scale(0.995)'

  window.setTimeout(done, CALC_LEAVE_DURATION)
}

function onAfterLeave(element: Element) {
  resetTransitionStyles(element)
}

/**
 * Programmatically expand the calculator and bring it into focus.
 * Called externally by the hero "Start pricing" button via a template ref.
 */
function expand() {
  isOpen.value = true
  userCollapsed.value = false
  // After the v-show renders the body, scroll it into view and focus the
  // first interactive field so the user can start typing immediately.
  nextTick(() => {
    const container = document.getElementById('hero-calculator')
    container?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    setTimeout(() => {
      const firstField = container?.querySelector<HTMLElement>(
        'input[type="text"]:not([disabled]):not([readonly]), input[type="number"]:not([disabled]):not([readonly])',
      )
      firstField?.focus()
    }, 300)
  })
}

// Expose expand() so HomeHero can call it through a template ref.
defineExpose({ expand })


let observer: IntersectionObserver | null = null

onMounted(() => {
  const galleryEl = document.getElementById('gallery')
  if (!galleryEl || typeof IntersectionObserver === 'undefined') return

  /**
   * The IntersectionObserver fires once asynchronously right after
   * observer.observe() with the element's current state. We must skip that
   * initial fire so the calculator does not collapse on page load when the
   * products section happens to be partially in view (e.g., browser scroll
   * restoration, short viewport, slow CSS paint).
   * Auto-collapse should only ever respond to the user actively scrolling.
   */
  let initialized = false

  observer = new IntersectionObserver(
    ([entry]) => {
      if (!initialized) {
        initialized = true
        return
      }

      if (userModified.value) {
        return
      }

      const hasReachedProductsFold = entry.isIntersecting && entry.intersectionRatio >= 0.5

      if (hasReachedProductsFold) {
        // Products section is about halfway in view.
        // Auto-collapse for passive visitors; clear any stale manual flag
        // so that scrolling back up to the hero will auto-reopen.
        userCollapsed.value = false
        isOpen.value = false
      }
      else {
        // Products section is less than halfway in view (user scrolled back up).
        // Only auto-reopen if the user did not manually collapse first.
        if (userCollapsed.value) return
        isOpen.value = true
      }
    },
    { threshold: [0, 0.5, 1] },
  )

  observer.observe(galleryEl)
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<style scoped>
.calc-subtitle-enter-active,
.calc-subtitle-leave-active {
  transition: opacity 100ms ease;
}
.calc-subtitle-enter-from,
.calc-subtitle-leave-to {
  opacity: 0;
}
</style>
