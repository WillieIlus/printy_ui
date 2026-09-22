<template>
  <div class="relative">
    <!-- ── HERO ── -->
    <section class="mx-auto w-full max-w-[1180px] px-4 pt-12 sm:pt-16">
      <div class="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <div class="flex items-center gap-2 font-mono2 text-[10px] uppercase tracking-[0.22em] text-[var(--sub)]">
            <Sparkles :size="11" style="color: var(--accent)" /> Kenya's print production platform
          </div>
          <h1 class="mt-3 font-disp text-[40px] font-bold leading-[1.02] tracking-tight sm:text-[56px]">
            Print, priced
            <span class="block" style="color: var(--accent)">to the exact sheet.</span>
          </h1>
          <p class="mt-4 max-w-[48ch] text-[15px] leading-relaxed text-[var(--sub)]">
            Printy prices your job against live production options — the median of real shops, not a local guess.
            Then one workflow carries it from quote to delivery, so you always know who has the ball.
          </p>

          <div class="mt-7 flex flex-wrap gap-2.5">
            <NuxtLink to="/sign-up" class="press-key inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 font-mono2 text-[12px] font-bold uppercase tracking-[0.16em] text-white" style="background: var(--accent); box-shadow: 0 14px 34px -14px var(--glow)">
              Get started free <ArrowRight :size="15" />
            </NuxtLink>
            <NuxtLink to="/sign-in" class="press-key inline-flex items-center gap-2 rounded-2xl border px-6 py-3.5 font-mono2 text-[12px] font-bold uppercase tracking-[0.16em]" style="border-color: var(--line)">
              Sign in
            </NuxtLink>
            <NuxtLink to="/track" class="press-key inline-flex items-center gap-2 rounded-2xl px-5 py-3.5 font-mono2 text-[12px] font-bold uppercase tracking-[0.16em]" style="color: var(--accent)">
              <PackageSearch :size="15" /> Track a job
            </NuxtLink>
          </div>

          <div class="mt-6 flex flex-wrap gap-x-6 gap-y-2">
            <span v-for="[Icon, label] in trustRow" :key="label" class="inline-flex items-center gap-1.5 font-mono2 text-[9.5px] uppercase tracking-[0.14em] text-[var(--sub)]">
              <component :is="Icon" :size="12" style="color: var(--accent)" /> {{ label }}
            </span>
          </div>
        </div>

        <!-- workflow rail preview -->
        <div class="rounded-3xl border p-5 shadow-[0_16px_60px_-30px_rgba(27,23,16,.5)]" style="border-color: var(--line); background: var(--panel)">
          <div class="flex items-center justify-between">
            <ML>One job · one workflow</ML>
            <span class="font-mono2 text-[9px] uppercase tracking-[0.14em]" style="color: var(--accent)">live</span>
          </div>
          <div class="mt-4 space-y-1.5">
            <div v-for="(s, i) in STAGES" :key="s.key" class="flex items-center gap-3 rounded-xl px-3 py-2" :style="{ background: i === 5 ? 'color-mix(in srgb, var(--accent) 9%, transparent)' : 'transparent' }">
              <span
                class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                :style="{
                  background: done(i) ? 'var(--accent)' : 'transparent',
                  boxShadow: done(i) ? 'none' : `inset 0 0 0 1.5px ${i === 5 ? 'var(--accent)' : 'var(--line)'}`,
                }"
              >
                <CheckCheck v-if="done(i)" :size="10" class="text-white" />
                <span v-if="i === 5" class="ball-ping h-1.5 w-1.5 rounded-full" style="background: var(--accent)" />
              </span>
              <span class="font-disp text-[13px] font-semibold" :style="{ color: done(i) || i === 5 ? 'var(--ink)' : 'var(--sub)' }">{{ s.label }}</span>
              <span v-if="i === 5" class="ml-auto rounded-full px-2 py-[2px] font-mono2 text-[8.5px] uppercase tracking-[0.14em] text-white" style="background: var(--accent)">ball here</span>
              <span v-if="done(i)" class="ml-auto font-mono2 text-[9px] uppercase tracking-[0.1em] text-[var(--sub)]">done</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── THREE MODES ── -->
    <section class="mx-auto w-full max-w-[1180px] px-4 pt-20">
      <div class="text-center">
        <ML>Three ways to use Printy</ML>
        <h2 class="mt-2 font-disp text-[30px] font-bold tracking-tight sm:text-[36px]">Same job. Different view.</h2>
        <p class="mx-auto mt-3 max-w-[54ch] text-[14px] leading-relaxed text-[var(--sub)]">
          Buyers get reassurance. Managers get control. Printers get production. Everyone is looking at one live workflow.
        </p>
      </div>

      <div class="mt-8 grid gap-4 md:grid-cols-3">
        <div
          v-for="m in MODES"
          :key="m.id"
          class="group flex flex-col rounded-3xl border p-6 transition-transform hover:-translate-y-1"
          style="border-color: var(--line); background: var(--panel)"
        >
          <div class="flex h-11 w-11 items-center justify-center rounded-2xl" :style="{ background: `color-mix(in srgb, ${modeAccent(m.id)} 12%, transparent)` }">
            <component :is="modeIcon(m.id)" :size="20" :style="{ color: modeAccent(m.id) }" />
          </div>
          <div class="mt-4 font-mono2 text-[9px] uppercase tracking-[0.2em]" :style="{ color: modeAccent(m.id) }">{{ m.tagline }}</div>
          <h3 class="mt-1 font-disp text-[19px] font-bold tracking-tight">{{ m.label }}</h3>
          <p class="mt-2 text-[13px] leading-relaxed text-[var(--sub)]">{{ m.blurb }}</p>
          <ul class="mt-4 space-y-1.5">
            <li v-for="b in m.bullets" :key="b" class="flex items-center gap-2 text-[12.5px] text-[var(--sub)]">
              <CheckCheck :size="13" :style="{ color: modeAccent(m.id) }" /> {{ b }}
            </li>
          </ul>
          <div class="mt-auto space-y-1.5 pt-5">
            <NuxtLink :to="`/sign-up?mode=${m.id}`" class="press-key inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 font-mono2 text-[10.5px] font-bold uppercase tracking-[0.14em] text-white" :style="{ background: modeAccent(m.id) }">
              {{ m.cta }} <ArrowRight :size="13" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- ── LIVE CALCULATOR (price locked) ── -->
    <section id="calculator" class="mx-auto w-full max-w-[1180px] px-4 pt-20">
      <div class="rounded-[2rem] border p-5 sm:p-8" style="border-color: var(--line); background: color-mix(in srgb, var(--panel) 60%, transparent)">
        <div class="flex flex-wrap items-end justify-between gap-4">
          <div class="max-w-[46ch]">
            <div class="flex items-center gap-2 font-mono2 text-[10px] uppercase tracking-[0.22em] text-[var(--sub)]">
              <Calculator :size="11" style="color: var(--accent)" /> try it right now
            </div>
            <h2 class="mt-2 font-disp text-[30px] font-bold leading-tight tracking-tight sm:text-[36px]">Build your job. Watch the estimate move.</h2>
            <p class="mt-3 text-[14px] leading-relaxed text-[var(--sub)]">
              The calculator is fully live — change product, quantity, paper and finishing and the median price updates from real production options.
              <span class="font-semibold text-[var(--ink)]"> Prices unlock the moment you create a free account.</span>
            </p>
          </div>
          <div class="flex items-center gap-2 rounded-2xl border px-4 py-3" style="border-color: var(--accent); background: color-mix(in srgb, var(--accent) 8%, transparent)">
            <Lock :size="15" style="color: var(--accent)" />
            <div>
              <div class="font-disp text-[13px] font-bold" style="color: var(--accent)">Prices hidden</div>
              <NuxtLink to="/sign-up" class="font-mono2 text-[9.5px] uppercase tracking-[0.12em] text-[var(--sub)] underline underline-offset-2">unlock free →</NuxtLink>
            </div>
          </div>
        </div>

        <div class="mt-6 border-t pt-6" style="border-color: var(--line)">
          <CalculatorView embedded locked @unlock="goSignUp('buyer')" />
        </div>
      </div>
    </section>

    <!-- ── TRACK A JOB ── -->
    <section class="mx-auto w-full max-w-[1180px] px-4 pt-20">
      <div class="flex flex-wrap items-center gap-6 rounded-[2rem] border p-6 sm:p-8" style="border-color: var(--line); background: var(--panel)">
        <div class="min-w-[260px] flex-1">
          <div class="flex items-center gap-2 font-mono2 text-[10px] uppercase tracking-[0.22em] text-[var(--sub)]">
            <PackageSearch :size="12" style="color: var(--accent)" /> no login needed
          </div>
          <h2 class="mt-2 font-disp text-[28px] font-bold leading-tight tracking-tight sm:text-[34px]">Already ordered? Track it.</h2>
          <p class="mt-3 max-w-[48ch] text-[14px] leading-relaxed text-[var(--sub)]">
            Enter your job code and watch the whole workflow — every completed stage, who is holding it right now,
            how long they've had it, and exactly what happens next.
          </p>
          <NuxtLink to="/track" class="press-key mt-5 inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 font-mono2 text-[12px] font-bold uppercase tracking-[0.16em] text-white" style="background: var(--accent)">
            Track my job <ArrowRight :size="15" />
          </NuxtLink>
        </div>

        <!-- mini preview -->
        <div class="w-full max-w-[330px] rounded-2xl border p-4" style="border-color: var(--line); background: var(--panel2)">
          <div class="flex items-center justify-between">
            <span class="font-mono2 text-[10px] font-semibold tracking-[0.14em]" style="color: var(--accent)">in production</span>
            <span class="rounded-full px-2 py-[3px] font-mono2 text-[8.5px] uppercase tracking-[0.14em]" style="background: rgba(47,191,113,.16); color: #0E7A45">on track</span>
          </div>
          <div class="mt-2.5 font-disp text-[14px] font-bold leading-tight">A real job · estimate confirmed</div>
          <div class="mt-3 flex items-center gap-[3px]">
            <span
              v-for="i in 10"
              :key="i"
              class="h-[6px] flex-1 rounded-full"
              :style="{
                background: i - 1 < 5 ? 'var(--accent)' : i - 1 === 5 ? '#2FBF71' : 'var(--line)',
                boxShadow: i - 1 === 5 ? '0 0 8px #2FBF71' : 'none',
              }"
            />
          </div>
          <div class="mt-3 flex items-center gap-2 rounded-xl bg-[var(--panel)] px-3 py-2.5">
            <span class="ball-ping h-2 w-2 shrink-0 rounded-full" style="background: #2FBF71" />
            <div class="min-w-0">
              <div class="truncate font-disp text-[12px] font-semibold">Verified printing manager</div>
              <div class="font-mono2 text-[8.5px] uppercase tracking-[0.12em] text-[var(--sub)]">holds it now · SLA 2h</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── WHY UNLOCK ── -->
    <section class="mx-auto w-full max-w-[1180px] px-4 pt-20">
      <div class="grid gap-4 md:grid-cols-3">
        <div v-for="[Icon, title, body] in whyUnlock" :key="title" class="rounded-2xl border p-5" style="border-color: var(--line); background: var(--panel)">
          <component :is="Icon" :size="18" style="color: var(--accent)" />
          <h3 class="mt-3 font-disp text-[15px] font-bold tracking-tight">{{ title }}</h3>
          <p class="mt-1.5 text-[12.5px] leading-relaxed text-[var(--sub)]">{{ body }}</p>
        </div>
      </div>
    </section>

    <!-- ── FINAL CTA ── -->
    <section class="mx-auto w-full max-w-[1180px] px-4 py-20">
      <div class="relative overflow-hidden rounded-[2rem] border p-8 text-center sm:p-12" style="border-color: var(--accent); background: color-mix(in srgb, var(--accent) 8%, transparent)">
        <div class="halftone pointer-events-none absolute inset-0 opacity-40" style="--dot: color-mix(in srgb, var(--accent) 26%, transparent)" />
        <div class="relative">
          <h2 class="font-disp text-[30px] font-bold leading-tight tracking-tight sm:text-[38px]">Your quote is already calculated.</h2>
          <p class="mx-auto mt-3 max-w-[46ch] text-[14px] leading-relaxed text-[var(--sub)]">
            Create a free account to reveal it, have a verified printing manager price it, and watch your job move through one clear workflow.
          </p>
          <div class="mt-6 flex flex-wrap justify-center gap-2.5">
            <NuxtLink to="/sign-up" class="press-key inline-flex items-center gap-2 rounded-2xl px-7 py-3.5 font-mono2 text-[12px] font-bold uppercase tracking-[0.16em] text-white" style="background: var(--accent)">
              Unlock my price <ArrowRight :size="15" />
            </NuxtLink>
            <NuxtLink to="/sign-in" class="press-key inline-flex items-center gap-2 rounded-2xl border px-7 py-3.5 font-mono2 text-[12px] font-bold uppercase tracking-[0.16em]" style="border-color: var(--line); background: var(--panel)">
              I already have an account
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowRight, BadgeCheck, Calculator, CheckCheck, Eye, Factory, Lock, PackageSearch, Radar,
  ShieldCheck, ShoppingBag, Sparkles, Timer, Wallet,
} from 'lucide-vue-next'
import type { Component } from 'vue'
import { MODES, type SignupMode } from '~/shared/workbench/modes'
import type { Role } from '~/shared/workflow/printy'
import { ROLE_META, STAGES } from '~/shared/workflow/printy'

function goSignUp(mode?: SignupMode) {
  return navigateTo(mode ? `/sign-up?mode=${mode}` : '/sign-up')
}

const MODE_ICONS: Record<SignupMode, Component> = {
  buyer: ShoppingBag,
  manager: Radar,
  printer: Factory,
}
function modeIcon(id: SignupMode) {
  return MODE_ICONS[id]
}
function modeAccent(id: SignupMode) {
  return ROLE_META[id as Role].theme.accent
}

const trustRow: Array<[Component, string]> = [
  [ShieldCheck, 'Escrow on every job'],
  [Timer, 'SLA-tracked handoffs'],
  [BadgeCheck, 'Verified printing managers'],
]

const whyUnlock: Array<[Component, string, string]> = [
  [Eye, 'See the exact figure', 'Not a range, not \'contact us\'. The real total with per-piece price and delivery.'],
  [Wallet, 'Pay into custody', 'Your money is held by Printy and only released to the printer once you confirm delivery.'],
  [Radar, 'Track who has the ball', 'Every stage shows the owner, their SLA clock and what happens next.'],
]

function done(i: number) {
  return i < 5
}
</script>