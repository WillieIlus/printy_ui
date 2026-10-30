<template>
  <div class="relative">
    <!-- ── HERO: WHERE IS MY JOB? ── -->
    <section class="mx-auto w-full max-w-[980px] px-4 pt-8 sm:pt-12">
      <div class="text-center">
        <div class="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 font-mono2 text-[9.5px] uppercase tracking-[0.18em] text-[var(--sub)]">
          <BadgeCheck :size="11" style="color: var(--accent)" aria-hidden="true" />
          <span>Kenya's verified printing manager network</span>
          <span aria-hidden="true">·</span>
          <span>escrow on every order</span>
        </div>
        <h1 class="mt-3 font-disp text-[36px] font-bold leading-[1.02] tracking-tight sm:text-[54px]">
          Where's my job? <span style="color: var(--accent)">Never call again.</span>
        </h1>
        <p class="mx-auto mt-3 max-w-[46ch] text-[15px] leading-relaxed text-[var(--sub)]">
          Live stage and time left on every print job.
        </p>
      </div>

      <!-- Job-code box: above the fold, no login. -->
      <form class="code-box" novalidate @submit.prevent="trackJob">
        <label for="home-job-code" class="code-box__label">Job code</label>
        <div class="code-box__row">
          <input
            id="home-job-code"
            v-model="jobCode"
            type="text"
            name="job-code"
            placeholder="e.g. QR-2026-1042"
            autocomplete="off"
            autocapitalize="characters"
            spellcheck="false"
            class="code-box__input"
          >
          <button type="submit" class="code-box__button" :disabled="!jobCode.trim()">
            <PackageSearch :size="15" aria-hidden="true" /> Track job
          </button>
        </div>
        <p class="code-box__hint">No login needed. Your code is on your order confirmation.</p>
      </form>

      <!-- Demo, clearly labelled. -->
      <div class="demo">
        <div class="demo__head">
          <span class="demo__badge">Sample</span>
          <span class="demo__title">Sample job</span>
          <span class="demo__note">Demo — not a real order</span>
        </div>

        <SampleJobTicket ref="demo" />

        <div class="demo__questions">
          <button type="button" class="demo__question" @click="jumpTo('printing')">
            Started printing? <span>Printing</span>
          </button>
          <button type="button" class="demo__question" @click="jumpTo('finishing')">
            Being laminated? <span>Finishing</span>
          </button>
          <button type="button" class="demo__question" @click="jumpTo('out_for_delivery')">
            Finished? Out for delivery? <span>Out for delivery</span>
          </button>
        </div>

        <p class="demo__note-line">
          Pay, and your job appears at the top of your dashboard. No code needed.
        </p>
      </div>

      <div class="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        <span v-for="[Icon, label] in trustRow" :key="label" class="inline-flex items-center gap-1.5 font-mono2 text-[9.5px] uppercase tracking-[0.14em] text-[var(--sub)]">
          <component :is="Icon" :size="12" style="color: var(--accent)" aria-hidden="true" /> {{ label }}
        </span>
      </div>

      <!-- ── FAIR-PRICE GUARD ── -->
      <div class="mt-6 flex items-start gap-3 rounded-2xl border px-4 py-3.5 sm:px-5" style="border-color: var(--line); background: color-mix(in srgb, var(--panel) 70%, transparent)">
        <Gauge :size="16" class="mt-[2px] shrink-0" style="color: var(--accent)" aria-hidden="true" />
        <p class="text-[13px] leading-relaxed text-[var(--sub)]">
          <span class="font-semibold text-[var(--ink)]">You're protected by a fair-price cap:</span>
          There's a hard cap on what a manager can charge for your job size. They can adjust spoilage, paper or markup,
          but you won't pay more than that cap.
        </p>
      </div>
    </section>

    <!-- ── CALCULATOR ── -->
    <section class="mx-auto w-full max-w-[940px] px-4 pt-12 sm:pt-16">
      <div class="mb-4 text-center">
        <div class="flex items-center justify-center gap-2 font-mono2 text-[10px] uppercase tracking-[0.22em] text-[var(--sub)]">
          <Calculator :size="11" style="color: var(--accent)" aria-hidden="true" /> Instant price
        </div>
        <h2 class="mt-2 font-disp text-[26px] font-bold tracking-tight sm:text-[32px]">Plan your print job</h2>
        <p class="mx-auto mt-2 max-w-[48ch] text-[13.5px] leading-relaxed text-[var(--sub)]">
          Tell us what you need and see a live price in seconds. No signup to start.
        </p>
      </div>

      <div class="rounded-[2rem] border p-4 sm:p-6" style="border-color: var(--line); background: color-mix(in srgb, var(--panel) 62%, transparent)">
        <CalculatorView
          embedded
          stacked
          compact
          cta-label="Get a quote"
          @unlock="goSignUp('buyer')"
        />
      </div>
    </section>

    <!-- ── TRACK A JOB ── -->
    <RevealOnScroll as="section" class="mx-auto w-full max-w-[1180px] px-4 pt-14">
      <div class="flex flex-wrap items-center gap-6 rounded-[2rem] border p-6 sm:p-8" style="border-color: var(--line); background: var(--panel)">
        <div class="min-w-[260px] flex-1">
          <div class="flex items-center gap-2 font-mono2 text-[10px] uppercase tracking-[0.22em] text-[var(--sub)]">
            <PackageSearch :size="12" style="color: var(--accent)" aria-hidden="true" /> no login needed
          </div>
          <h2 class="mt-2 font-disp text-[28px] font-bold leading-tight tracking-tight sm:text-[34px]">Already ordered? Track it.</h2>
          <p class="mt-3 max-w-[48ch] text-[14px] leading-relaxed text-[var(--sub)]">
            Enter the job code from your confirmation to see exactly where your job is — the stage it's at, who has it,
            and what happens next.
          </p>
          <NuxtLink to="/track" class="press-key mt-5 inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 font-mono2 text-[12px] font-bold uppercase tracking-[0.16em] text-white" style="background: var(--accent)">
            Track my job <ArrowRight :size="15" aria-hidden="true" />
          </NuxtLink>
        </div>

        <div class="w-full max-w-[330px] rounded-2xl border p-4" style="border-color: var(--line); background: var(--panel2)">
          <div class="flex items-center justify-between">
            <span class="font-mono2 text-[10px] font-semibold tracking-[0.14em]" style="color: var(--accent)">in production</span>
            <span class="rounded-full px-2 py-[3px] font-mono2 text-[8.5px] uppercase tracking-[0.14em]" style="background: var(--panel); color: var(--sub)">Sample</span>
          </div>
          <div class="mt-2.5 font-disp text-[14px] font-bold leading-tight">Sample job · estimate confirmed</div>
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
              <div class="truncate font-disp text-[12px] font-semibold">Your artwork check</div>
              <div class="font-mono2 text-[8.5px] uppercase tracking-[0.12em] text-[var(--sub)]">sample state · 2h 15m left</div>
            </div>
          </div>
        </div>
      </div>
    </RevealOnScroll>

    <!-- ── FINAL CTA ── -->
    <RevealOnScroll as="section" class="mx-auto w-full max-w-[1180px] px-4 py-16">
      <div class="relative overflow-hidden rounded-[2rem] border p-8 text-center sm:p-12" style="border-color: var(--accent); background: color-mix(in srgb, var(--accent) 8%, transparent)">
        <div class="halftone pointer-events-none absolute inset-0 opacity-40" style="--dot: color-mix(in srgb, var(--accent) 26%, transparent)" />
        <div class="relative">
          <h2 class="font-disp text-[30px] font-bold leading-tight tracking-tight sm:text-[38px]">Get your quote in seconds.</h2>
          <p class="mx-auto mt-3 max-w-[46ch] text-[14px] leading-relaxed text-[var(--sub)]">
            Tell us what you need. You'll see clear prices, pick a verified printing manager if you'd like, and track
            every step along the way.
          </p>
          <div class="mt-6 flex flex-wrap justify-center gap-2.5">
            <NuxtLink to="/sign-up" class="press-key inline-flex items-center gap-2 rounded-2xl px-7 py-3.5 font-mono2 text-[12px] font-bold uppercase tracking-[0.16em] text-white" style="background: var(--accent)">
              Get started <ArrowRight :size="15" aria-hidden="true" />
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
import { ref } from 'vue'
import { ArrowRight, BadgeCheck, Calculator, Gauge, Lock, PackageSearch, ShieldCheck } from 'lucide-vue-next'
import type { Component } from 'vue'
import type { SignupMode } from '~/shared/workbench/modes'
import SampleJobTicket from '~/components/workbench/marketing/SampleJobTicket.vue'

const jobCode = ref('')
const demo = ref<{ jumpTo: (stageKey: string) => void } | null>(null)

function trackJob() {
  const code = jobCode.value.trim()
  if (!code) return
  return navigateTo(`/track/${encodeURIComponent(code)}`)
}

function jumpTo(stageKey: string) {
  demo.value?.jumpTo(stageKey)
}

function goSignUp(mode?: SignupMode) {
  return navigateTo(mode ? `/sign-up?mode=${mode}` : '/sign-up')
}

const trustRow: Array<[Component, string]> = [
  [ShieldCheck, 'Your money stays safe in escrow'],
  [Lock, 'Price lock — what you see is what you pay'],
  [Gauge, 'Fair-price cap on every job'],
  [BadgeCheck, 'Verified printing managers'],
]
</script>

<style scoped>
.code-box {
  margin: 18px auto 0;
  max-width: 520px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: var(--panel);
  padding: 12px;
  text-align: left;
}

.code-box__label {
  display: block;
  margin-bottom: 5px;
  font-family: var(--font-mono2, ui-monospace, monospace);
  font-size: 8.5px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--sub);
}

.code-box__row {
  display: flex;
  gap: 8px;
}

.code-box__input {
  min-width: 0;
  flex: 1;
  border: 1px solid var(--line);
  border-radius: 11px;
  background: var(--panel2);
  padding: 10px 12px;
  font-family: var(--font-mono2, ui-monospace, monospace);
  font-size: 14px;
  letter-spacing: 0.04em;
  color: var(--ink);
  outline: none;
}

.code-box__input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 15%, transparent);
}

.code-box__button {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  gap: 6px;
  border-radius: 11px;
  background: var(--accent);
  padding: 10px 16px;
  font-family: var(--font-mono2, ui-monospace, monospace);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accentInk);
}

.code-box__button:disabled {
  opacity: 0.5;
}

.code-box__hint {
  margin-top: 6px;
  font-size: 10.5px;
  color: var(--sub);
}

.demo {
  margin-top: 16px;
  border: 1px dashed color-mix(in srgb, var(--accent) 30%, var(--line));
  border-radius: 22px;
  background: color-mix(in srgb, var(--panel2) 55%, transparent);
  padding: 12px;
  text-align: left;
}

.demo__head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 8px;
  padding: 2px 4px 8px;
}

.demo__badge {
  border-radius: 999px;
  border: 1px solid var(--line);
  background: var(--panel);
  padding: 3px 8px;
  font-family: var(--font-mono2, ui-monospace, monospace);
  font-size: 8.5px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--sub);
}

.demo__title {
  font-family: var(--font-mono2, ui-monospace, monospace);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--accent);
}

.demo__note {
  font-size: 10.5px;
  color: var(--sub);
}

.demo__questions {
  display: grid;
  gap: 6px;
  margin-top: 10px;
  padding: 0 4px;
}

.demo__question {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  border-radius: 10px;
  padding: 7px 9px;
  text-align: left;
  font-size: 12px;
  color: var(--ink);
  transition: background 0.15s;
}

.demo__question:hover {
  background: var(--panel);
}

.demo__question span {
  flex-shrink: 0;
  font-family: var(--font-mono2, ui-monospace, monospace);
  font-size: 8.5px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent);
}

.demo__note-line {
  margin-top: 8px;
  padding: 8px 4px 2px;
  border-top: 1px solid var(--line);
  font-size: 11.5px;
  color: var(--sub);
}

@media (min-width: 640px) {
  .demo__questions {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .demo__question {
    flex-direction: column;
    gap: 3px;
  }
}
</style>
