<template>
  <div>
    <PageHero
      eyebrow="about printy"
      :icon="Sparkles"
      title="Printing shouldn't be
a black box."
      lead="Printy exists because the hardest part of commercial print isn't the printing — it's the not knowing. Not knowing the real price. Not knowing if the job started. Not knowing who to chase when it's late."
    />

    <!-- story -->
    <Section kicker="The problem we started with">
      <div class="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div class="space-y-4 text-[14px] leading-relaxed text-[var(--sub)]">
          <p>
            Ask three print shops for the same job and you'll get three prices, three lead times, and no explanation of
            how any of them were calculated. Approve the artwork and the job disappears — into a WhatsApp thread, into
            someone's head, into a press queue you can't see.
          </p>
          <p>
            We thought the fix was a better quoting form. It wasn't. The real fix was making the entire production
            workflow visible to everyone who touches it — the client who paid, the manager who coordinates, and the
            printer who runs the press — while showing each of them only what they actually need.
          </p>
          <p class="font-semibold text-[var(--ink)]">
            One job. One workflow. Different views. That single idea is the whole product.
          </p>
        </div>

        <div class="rounded-3xl border p-6" style="border-color: var(--line); background: var(--panel)">
          <ML>What makes us different</ML>
          <div class="mt-4 space-y-4">
            <div v-for="[Icon, t, b] in differentiators" :key="t" class="flex gap-3">
              <component :is="Icon" :size="16" class="mt-0.5 shrink-0" style="color: var(--accent)" />
              <div>
                <div class="font-disp text-[13.5px] font-bold">{{ t }}</div>
                <div class="mt-0.5 text-[12px] leading-snug text-[var(--sub)]">{{ b }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>

    <!-- principles -->
    <Section kicker="What we believe" title="Four principles we don't bend">
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card v-for="(c, i) in principles" :key="c.title" v-bind="c" :index="i" />
      </div>
    </Section>

    <!-- network -->
    <Section kicker="The network" title="Real shops, verified, on one platform">
      <div class="grid gap-6 lg:grid-cols-2">
        <div class="rounded-3xl border p-6" style="border-color: var(--line); background: var(--panel)">
          <ML>Print managers</ML>
          <p class="mt-2 text-[12.5px] leading-relaxed text-[var(--sub)]">
            Independent coordinators who take your brief, choose the right press and own the deadline. Every estimate
            on Printy is the median of their real production options.
          </p>
          <ul class="mt-4 space-y-2.5">
            <li v-for="b in managerPillars" :key="b" class="flex items-center gap-2.5 text-[12.5px]">
              <CheckCheck :size="14" style="color: var(--accent)" /> {{ b }}
            </li>
          </ul>
        </div>

        <div class="rounded-3xl border p-6" style="border-color: var(--line); background: var(--panel)">
          <ML>Vetted shops & rate cards</ML>
          <p class="mt-2 text-[12.5px] leading-relaxed text-[var(--sub)]">
            Print shops join after an offline check. Their live rate cards drive the calculator, so the price you see
            comes from the network — never a local guess.
          </p>
          <ul class="mt-4 space-y-2.5">
            <li v-for="b in shopPillars" :key="b" class="flex items-center gap-2.5 text-[12.5px]">
              <CheckCheck :size="14" style="color: var(--accent)" /> {{ b }}
            </li>
          </ul>
        </div>
      </div>
    </Section>

    <CtaBand
      title="See it working on a real job."
      body="Price a job in about thirty seconds, or track an existing one and watch the workflow move."
    >
      <NuxtLink to="/sign-up" class="press-key rounded-2xl bg-white px-7 py-3.5 font-mono2 text-[12px] font-bold uppercase tracking-[0.16em]" style="color: var(--accent)">
        Create a free account
      </NuxtLink>
      <NuxtLink to="/track" class="press-key rounded-2xl border px-7 py-3.5 font-mono2 text-[12px] font-bold uppercase tracking-[0.16em]" style="border-color: rgba(255, 255, 255, 0.45); color: var(--accentInk)">
        Track a job
      </NuxtLink>
    </CtaBand>
  </div>
</template>

<script setup lang="ts">
import {
  Building2, CheckCheck, Eye, Factory, HeartHandshake, Layers, ShieldCheck, Sparkles, Target,
} from 'lucide-vue-next'
import type { Component } from 'vue'

const managerPillars = [
  'Confirm the exact figure before you pay',
  'Own the deadline from artwork to delivery',
  'Give you one clear point of contact',
]
const shopPillars = [
  'Join after an offline verification check',
  'Price every estimate through their live rate card',
  'Carry a tracked SLA and quality history',
]

const differentiators: Array<[Component, string, string]> = [
  [Target, 'We price from the network', 'Your estimate is the median of live production options from real shops — not a guess with a margin on top.'],
  [Eye, 'We show the whole chain', 'Every stage has a named owner and a running clock.'],
  [ShieldCheck, 'We hold the money', 'Funds sit in custody until the client confirms delivery.'],
]

const principles: Array<{ icon: Component; title: string; body: string }> = [
  { icon: Layers, title: 'Transparency by default', body: "Every quote shows its press sheet, pieces per sheet, sheet count and spoilage warnings. If we can't explain a number, the backend doesn't produce it." },
  { icon: HeartHandshake, title: 'Nobody carries risk alone', body: "Clients don't pay for work they haven't seen. Printers don't print for clients who might not pay." },
  { icon: Factory, title: 'Respect the shop floor', body: 'Printers get big buttons, clear specs and honest deadlines — not admin work disguised as software.' },
  { icon: Building2, title: 'Built for Kenyan print', body: 'KES pricing, M-Pesa custody, Nairobi logistics and the real sheet sizes local presses actually run.' },
]
</script>