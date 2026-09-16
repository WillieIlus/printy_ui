<script setup lang="ts">
import { computed } from 'vue'
import type { NuxtError } from '#app'
import { ArrowLeft, Calculator, Home, PackageSearch, Workflow } from 'lucide-vue-next'
import type { RoleTheme } from '~/shared/workflow/printy'
import { PUBLIC_THEME } from '~/shared/workflow/printy'

const props = defineProps<{ error: NuxtError }>()

const theme: RoleTheme = PUBLIC_THEME
const themeCss = computed(() => ({
  '--bg': theme.bg,
  '--panel': theme.panel,
  '--panel2': theme.panel2,
  '--ink': theme.ink,
  '--sub': theme.sub,
  '--line': theme.line,
  '--accent': theme.accent,
  '--accentInk': theme.accentInk,
  '--glow': theme.glow,
  background: 'var(--bg)',
  color: 'var(--ink)',
}))

const code = computed(() => String(props.error?.statusCode || 404))
const pathname = computed(() => {
  try {
    const route = useRoute()
    return route.path || '/'
  }
  catch {
    return '/'
  }
})

const shortcutCards = [
  { to: '/', icon: Calculator, t: 'Price a job', b: 'Exact quote in about 30 seconds.' },
  { to: '/track', icon: PackageSearch, t: 'Track a job', b: 'See exactly where your order is.' },
  { to: '/how-it-works', icon: Workflow, t: 'How it works', b: 'The ten stages, explained.' },
]

function goBack() {
  if (window.history.length > 1) {
    window.history.back()
    return
  }
  return clearError({ redirect: '/' })
}
</script>

<template>
  <div class="min-h-screen" :style="themeCss">
    <div class="mat-grid pointer-events-none fixed inset-0 opacity-[0.55]" style="--line: rgba(27, 21, 16, 0.05)" />

    <div class="mx-auto flex w-full max-w-[900px] flex-col items-center px-4 pb-24 pt-16 text-center sm:pt-24">
      <!-- misregistered 404 -- a printing joke -->
      <div class="relative select-none">
        <span
          class="absolute inset-0 translate-x-[6px] translate-y-[4px] font-disp text-[110px] font-bold leading-none tracking-tight sm:text-[170px]"
          style="color: #22d3ee; opacity: 0.5; mix-blend-mode: multiply"
        >
          {{ code }}
        </span>
        <span
          class="absolute inset-0 -translate-x-[6px] -translate-y-[3px] font-disp text-[110px] font-bold leading-none tracking-tight sm:text-[170px]"
          style="color: #fb4d6d; opacity: 0.45; mix-blend-mode: multiply"
        >
          {{ code }}
        </span>
        <span class="relative font-disp text-[110px] font-bold leading-none tracking-tight sm:text-[170px]" style="color: var(--ink)">
          {{ code }}
        </span>
      </div>

      <div>
        <ML class="mt-6">registration out of alignment</ML>
        <h1 class="mt-3 font-disp text-[30px] font-bold leading-tight tracking-tight sm:text-[38px]">
          This page didn't make it to press.
        </h1>
        <p class="mx-auto mt-3 max-w-[46ch] text-[14px] leading-relaxed text-[var(--sub)]">
          We couldn't find <span class="font-mono2 text-[13px] text-[var(--ink)]">{{ pathname }}</span>.
          It may have been moved, or the link may be mistyped.
        </p>
      </div>

      <div class="mt-7 flex flex-wrap justify-center gap-2.5">
        <button
          class="press-key inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 font-mono2 text-[12px] font-bold uppercase tracking-[0.16em]"
          style="background: var(--accent); color: var(--accentInk)"
          @click="clearError({ redirect: '/' })"
        >
          <Home :size="15" /> Back to home
        </button>
        <button
          class="press-key inline-flex items-center gap-2 rounded-2xl border px-6 py-3.5 font-mono2 text-[12px] font-bold uppercase tracking-[0.16em]"
          style="border-color: var(--line)"
          @click="goBack"
        >
          <ArrowLeft :size="15" /> Go back
        </button>
      </div>

      <div class="mt-12 grid w-full gap-3 sm:grid-cols-3">
        <NuxtLink
          v-for="c in shortcutCards"
          :key="c.t"
          :to="c.to"
          class="press-key rounded-2xl border p-5 text-left transition-transform hover:-translate-y-0.5"
          style="border-color: var(--line); background: var(--panel)"
        >
          <component :is="c.icon" :size="17" style="color: var(--accent)" />
          <div class="mt-2.5 font-disp text-[14px] font-bold">{{ c.t }}</div>
          <div class="mt-1 text-[11.5px] leading-snug text-[var(--sub)]">{{ c.b }}</div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>