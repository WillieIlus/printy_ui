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
        :class="isOpen ? 'border-b border-white/10 pb-4 sm:pb-5' : ''"
      >
        <div>
          <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-flamingo-300">
            Live calculator
          </p>
          <p v-if="isOpen" class="mt-1.5 max-w-md text-sm leading-6 text-slate-300">
            Use the same backend-driven pricing flow here, then continue into live shop matches.
          </p>
          <p v-else class="mt-1 text-sm text-slate-400">
            Expand to calculate your print price instantly.
          </p>
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
              :name="isOpen ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
              class="h-4 w-4"
            />
          </button>
        </div>
      </div>

      <!--
        Calculator body.

        v-show (not v-if) keeps the component mounted so all internal state
        (field values, backend results, matched shops) is preserved across
        collapse/expand cycles.

        Capturing click, input, and change events here marks the user as
        having meaningfully engaged, which prevents any further auto-collapsing
        driven by scroll position. The toggle button is a sibling of this div
        (not a descendant), so its clicks are never captured here.
      -->
      <div
        v-show="isOpen"
        class="p-4 pt-4 sm:p-5 sm:pt-5"
        @click.capture="onCalculatorInteract"
        @input.capture="onCalculatorInteract"
        @change.capture="onCalculatorInteract"
      >
        <QuotesPublicCalculator
          anchor-id="hero-calculator"
          mode="marketplace"
          :compact="true"
          title=""
          description=""
          eyebrow=""
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue'

/**
 * Whether the calculator body is currently visible.
 * Starts open; may be auto-collapsed by scroll for passive visitors,
 * or toggled manually by the user.
 */
const isOpen = ref(true)

/**
 * Set to true the first time the user clicks, types, or changes any field
 * inside the calculator body. Once set, scroll-driven auto-collapse is
 * permanently disabled for this page visit.
 */
const hasInteracted = ref(false)

/**
 * Set to true when the user explicitly clicks the collapse button.
 * Prevents the scroll-up auto-reopen for users who chose to hide the
 * calculator while it is still above the Products fold.
 * Cleared whenever the user manually expands the calculator.
 */
const userCollapsed = ref(false)

/** Called by capture listeners on any user action inside the calculator. */
function onCalculatorInteract() {
  hasInteracted.value = true
}

function toggleCollapse() {
  if (isOpen.value) {
    // User is explicitly hiding the calculator.
    userCollapsed.value = true
    isOpen.value = false
  }
  else {
    // User is explicitly reopening — treat as an interaction so
    // scroll won't auto-collapse again.
    userCollapsed.value = false
    hasInteracted.value = true
    isOpen.value = true
  }
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

      // User has meaningfully engaged — never auto-collapse.
      if (hasInteracted.value) return

      if (entry.isIntersecting) {
        // Products section scrolled into view.
        // Auto-collapse for passive visitors; clear any stale manual flag
        // so that scrolling back up to the hero will auto-reopen.
        userCollapsed.value = false
        isOpen.value = false
      }
      else {
        // Products section scrolled out of view (user scrolled back up).
        // Only auto-reopen if the user did not manually collapse first.
        if (userCollapsed.value) return
        isOpen.value = true
      }
    },
    { threshold: 0.1 },
  )

  observer.observe(galleryEl)
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>
