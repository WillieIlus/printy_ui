<template>
  <div>
    <section class="mx-auto w-full max-w-6xl px-5 pt-12 sm:px-8 sm:pt-16">
      <div class="max-w-[60ch]">
        <DesignSectionLabel index="AB" tone="brand">
          <Sparkles :size="12" class="mr-1 inline" /> About printy
        </DesignSectionLabel>
        <h1 class="mt-3 text-[38px] leading-[1.03] font-bold tracking-tight text-ink sm:text-[52px]" style="white-space: pre-line">
          Printing shouldn't be
a black box.
        </h1>
        <p class="mt-4 text-[15px] leading-relaxed text-ink-2">
          Printy exists because the hardest part of commercial print isn't the printing — it's the not knowing. Not knowing the real price. Not knowing if the job started. Not knowing who to chase when it's late.
        </p>
      </div>
      <div class="mt-10 h-px w-full bg-line" />
    </section>

    <!-- story -->
    <section class="mx-auto w-full max-w-6xl px-5 pt-12 sm:px-8">
      <DesignSectionLabel index="01" tone="brand">The problem we started with</DesignSectionLabel>
      <div class="mt-6 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div class="space-y-4 text-[14px] leading-relaxed text-ink-2">
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
          <p class="font-semibold text-ink">
            One job. One workflow. Different views. That single idea is the whole product.
          </p>
        </div>

        <DesignCard class="p-6" tone="paper">
          <span class="font-mono text-[10px] tracking-[0.2em] text-ink-3 uppercase">What makes us different</span>
          <div class="mt-4 space-y-4">
            <div v-for="[Icon, t, b] in differentiators" :key="t" class="flex gap-3">
              <component :is="Icon" :size="16" class="mt-0.5 shrink-0 text-brand" />
              <div>
                <div class="text-[13.5px] font-bold text-ink">{{ t }}</div>
                <div class="mt-0.5 text-[12px] leading-snug text-ink-2">{{ b }}</div>
              </div>
            </div>
          </div>
        </DesignCard>
      </div>
    </section>

    <!-- principles -->
    <section class="mx-auto w-full max-w-6xl px-5 pt-12 sm:px-8">
      <DesignSectionLabel index="02" tone="brand">What we believe</DesignSectionLabel>
      <h2 class="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">Four principles we don't bend</h2>
      <div class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <DesignCard v-for="(principle, i) in principles" :key="principle.title" class="p-5">
          <div class="flex items-center justify-between">
            <component :is="principle.icon" :size="20" class="text-brand" />
            <span class="font-mono text-[10px] tracking-[0.14em] text-ink-3">{{ String(i + 1).padStart(2, '0') }}</span>
          </div>
          <h3 class="mt-4 text-[14px] font-bold tracking-tight text-ink">{{ principle.title }}</h3>
          <p class="mt-2 text-[12.5px] leading-relaxed text-ink-2">{{ principle.body }}</p>
        </DesignCard>
      </div>
    </section>

    <!-- network -->
    <section class="mx-auto w-full max-w-6xl px-5 pt-12 sm:px-8">
      <DesignSectionLabel index="03" tone="brand">The network</DesignSectionLabel>
      <h2 class="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">Real shops, verified, on one platform</h2>
      <div class="mt-6 grid gap-6 lg:grid-cols-2">
        <DesignCard class="p-6">
          <span class="font-mono text-[10px] tracking-[0.2em] text-ink-3 uppercase">Print managers</span>
          <p class="mt-2 text-[12.5px] leading-relaxed text-ink-2">
            Independent coordinators who take your brief, choose the right press and own the deadline. Every estimate
            on Printy is the median of their real production options.
          </p>
          <ul class="mt-4 space-y-2.5">
            <li v-for="b in managerPillars" :key="b" class="flex items-center gap-2.5 text-[12.5px] text-ink-2">
              <CheckCheck :size="14" class="text-brand" /> {{ b }}
            </li>
          </ul>
        </DesignCard>

        <DesignCard class="p-6">
          <span class="font-mono text-[10px] tracking-[0.2em] text-ink-3 uppercase">Vetted shops &amp; rate cards</span>
          <p class="mt-2 text-[12.5px] leading-relaxed text-ink-2">
            Print shops join after an offline check. Their live rate cards drive the calculator, so the price you see
            comes from the network — never a local guess.
          </p>
          <ul class="mt-4 space-y-2.5">
            <li v-for="b in shopPillars" :key="b" class="flex items-center gap-2.5 text-[12.5px] text-ink-2">
              <CheckCheck :size="14" class="text-brand" /> {{ b }}
            </li>
          </ul>
        </DesignCard>
      </div>
    </section>

    <section class="px-5 pt-14 pb-20 sm:px-8">
      <div class="paper-noise relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-brand-deep px-6 py-16 text-center sm:px-12">
        <p class="font-mono text-[10.5px] tracking-[0.2em] text-brand-bright uppercase">Instant price — Escrow — Live tracking</p>
        <h2 class="mx-auto mt-4 max-w-2xl text-4xl leading-[1.02] font-bold tracking-tight text-paper sm:text-5xl">
          See it working on a real job.
        </h2>
        <p class="mx-auto mt-4 max-w-xl text-[16px] leading-relaxed text-paper/70">
          Price a job in about thirty seconds, or track an existing one and watch the workflow move.
        </p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <NuxtLink to="/sign-up" class="rounded-xl bg-paper px-7 py-3.5 text-[14px] font-semibold text-brand-deep transition-colors hover:bg-white">
            Create a free account
          </NuxtLink>
          <NuxtLink to="/track" class="rounded-xl border border-paper/30 px-7 py-3.5 text-[14px] font-semibold text-paper transition-colors hover:border-paper hover:bg-paper/10">
            Track a job
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import {
  Building2, CheckCheck, Eye, Factory, HeartHandshake, Layers, ShieldCheck, Sparkles, Target,
} from 'lucide-vue-next'
import type { Component } from 'vue'
import DesignCard from '~/components/design/ui/Card.vue'
import DesignSectionLabel from '~/components/design/ui/SectionLabel.vue'

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

definePageMeta({ layout: 'design-public', role: 'client' })
</script>
