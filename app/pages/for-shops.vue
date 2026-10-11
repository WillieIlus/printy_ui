<template>
  <div>
    <PageHero
      eyebrow="for print shops & presses"
      :icon="Factory"
      title="Own the presses.
Fill them with matched jobs."
      lead="Your shop's real rate card decides the price — so jobs you can actually run land in front of you, resolved and ready for the floor. You accept, print, finish, QC and get paid on delivery."
    />

    <Section kicker="Matching" title="Tell the network what you can run">
      <div class="flex flex-wrap gap-2">
        <span
          v-for="cap in PRINTER_CAPS"
          :key="cap"
          class="rounded-full border px-4 py-2 font-mono2 text-[11px] uppercase tracking-[0.12em]"
          style="border-color: var(--line); background: var(--panel); color: var(--accent)"
        >{{ cap }}</span>
      </div>
    </Section>

    <Section kicker="How you get paid" title="Set a rate card. Match. Print. Get paid.">
      <div class="grid gap-3 sm:grid-cols-3">
        <div v-for="[t, b] in flow" :key="t" class="rounded-2xl border p-5" style="border-color: var(--line); background: var(--panel)">
          <ML>{{ t }}</ML>
          <p class="mt-2 text-[13px] leading-relaxed text-[var(--sub)]">{{ b }}</p>
        </div>
      </div>
    </Section>

    <Section kicker="On the floor" title="What the job page gives you">
      <div class="grid gap-4 md:grid-cols-3">
        <div v-for="[icon, title, body] in floor" :key="title" class="rounded-2xl border p-5" style="border-color: var(--line); background: var(--panel)">
          <component :is="icon" :size="18" style="color: var(--accent)" />
          <h3 class="mt-3 font-disp text-[15.5px] font-bold tracking-tight">{{ title }}</h3>
          <p class="mt-1.5 text-[12.5px] leading-relaxed text-[var(--sub)]">{{ body }}</p>
        </div>
      </div>
    </Section>

    <CtaBand title="Put your shop on the network." body="Create a printer account, set your rate card and start receiving jobs matched to your exact capabilities. Free to join.">
      <NuxtLink to="/sign-up?mode=printer" class="press-key rounded-2xl bg-white px-7 py-3.5 font-mono2 text-[12px] font-bold uppercase tracking-[0.16em]" style="color: var(--accent)">
        Create printer account
      </NuxtLink>
    </CtaBand>
  </div>
</template>

<script setup lang="ts">
import { CheckCheck, Factory, Layers, Wallet } from 'lucide-vue-next'
import type { Component } from 'vue'
import { PRINTER_CAPS } from '~/shared/workbench/modes'

const flow: Array<[string, string]> = [
  ['Set your rate card', 'Paper, machine, finishing — the same numbers that set the client\'s price decide whether a job is worth your floor time.'],
  ['Get matched jobs', 'Jobs arrive resolved with imposition, spoilage and QC already handled. Accept, or let it go to the next best shop.'],
  ['Get paid on delivery', 'The client pays into custody at approval. You deliver, they confirm, and the payout lands.'],
]

const floor: Array<[Component, string, string]> = [
  [Layers, 'The full spec', 'Sizes, stock, bleed, imposition count, spoilage policy and the exact sheet run — nothing to re-derive on the floor.'],
  [CheckCheck, 'One large next action', 'Accept → print → finish → QC. The job page leads with exactly the one thing you must do next.'],
  [Wallet, 'Guaranteed payout', 'Your margin is built into the client price and released from custody the moment delivery is confirmed.'],
]
</script>