<template>
  <div class="relative">
    <!-- ── THE CALCULATOR IS THE HEADLINE ── -->
    <section class="mx-auto w-full max-w-[940px] px-4 pt-10 sm:pt-14">
      <div class="text-center">
        <div class="flex items-center justify-center gap-2 font-mono2 text-[10px] uppercase tracking-[0.22em] text-[var(--sub)]">
          <Calculator :size="11" style="color: var(--accent)" /> Kenya's print production platform
        </div>
        <h1 class="mt-3 font-disp text-[38px] font-bold leading-[1.03] tracking-tight sm:text-[52px]">
          What do you need printed?
        </h1>
        <p class="mx-auto mt-4 max-w-[52ch] text-[15px] leading-relaxed text-[var(--sub)]">
          Set your spec and get a live, median market price in seconds — with the exact press sheet, spoilage policy and per-piece maths shown.
        </p>
      </div>

      <div class="mt-8 rounded-[2rem] border p-4 sm:p-6" style="border-color: var(--line); background: color-mix(in srgb, var(--panel) 62%, transparent)">
        <CalculatorView
          embedded
          locked
          stacked
          compact
          show-manager-cards
          cta-label="Show me prices"
          @unlock="goSignUp('buyer')"
        />
      </div>

      <div class="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        <span v-for="[Icon, label] in trustRow" :key="label" class="inline-flex items-center gap-1.5 font-mono2 text-[9.5px] uppercase tracking-[0.14em] text-[var(--sub)]">
          <component :is="Icon" :size="12" style="color: var(--accent)" /> {{ label }}
        </span>
      </div>
    </section>

    <!-- ── TRACK A JOB ── -->
    <RevealOnScroll as="section" class="mx-auto w-full max-w-[1180px] px-4 pt-16">
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
    </RevealOnScroll>

    <!-- ── ONE TESTIMONIAL LINE ── -->
    <RevealOnScroll as="section" class="mx-auto w-full max-w-[1180px] px-4 pt-16">
      <figure class="mx-auto max-w-[760px] text-center">
        <Quote :size="18" style="color: var(--accent)" />
        <blockquote class="mt-4 font-disp text-[22px] font-bold leading-snug tracking-tight sm:text-[26px]">
          “They quoted my cards to the sheet, held the money in custody, and the shop delivered two days early. That had never happened before.”
        </blockquote>
        <figcaption class="mt-4 font-mono2 text-[10px] uppercase tracking-[0.18em] text-[var(--sub)]">
          Director, <span style="color: var(--accent)">Studio North</span>
        </figcaption>
      </figure>
    </RevealOnScroll>

    <!-- ── FINAL CTA ── -->
    <RevealOnScroll as="section" class="mx-auto w-full max-w-[1180px] px-4 py-16">
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
    </RevealOnScroll>
  </div>
</template>

<script setup lang="ts">
import { ArrowRight, BadgeCheck, Calculator, Quote, PackageSearch, ShieldCheck, Timer } from 'lucide-vue-next'
import type { Component } from 'vue'
import type { SignupMode } from '~/shared/workbench/modes'

function goSignUp(mode?: SignupMode) {
  return navigateTo(mode ? `/sign-up?mode=${mode}` : '/sign-up')
}

const trustRow: Array<[Component, string]> = [
  [ShieldCheck, 'Escrow on every job'],
  [Timer, 'SLA-tracked handoffs'],
  [BadgeCheck, 'Verified printing managers'],
]
</script>