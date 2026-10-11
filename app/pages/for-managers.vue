<template>
  <div>
    <PageHero
      eyebrow="for print managers"
      :icon="Radar"
      title="Run every job
from one desk."
      lead="Printy keeps every job you manage on one SLA-tracked board — who has the ball, how long they've held it, what's late and what needs you to act. You assign printers, confirm quotes and resolve disputes without chasing people on WhatsApp."
    />

    <Section kicker="One board, every job" title="What your desk gains">
      <div class="grid gap-4 md:grid-cols-3">
        <div v-for="[icon, title, body] in gains" :key="title" class="rounded-2xl border p-5" style="border-color: var(--line); background: var(--panel)">
          <component :is="icon" :size="18" style="color: var(--accent)" />
          <h3 class="mt-3 font-disp text-[15.5px] font-bold tracking-tight">{{ title }}</h3>
          <p class="mt-1.5 text-[12.5px] leading-relaxed text-[var(--sub)]">{{ body }}</p>
        </div>
      </div>
    </Section>

    <Section kicker="Who does what" title="Your role at a glance">
      <div class="grid gap-4 md:grid-cols-2">
        <div v-for="[title, items] in role" :key="title" class="rounded-2xl border p-6" style="border-color: var(--line); background: var(--panel)">
          <h3 class="font-disp text-[16px] font-bold tracking-tight" style="color: var(--accent)">{{ title }}</h3>
          <ul class="mt-3 space-y-2">
            <li v-for="item in items" :key="item" class="flex items-start gap-2 text-[12.5px] leading-snug text-[var(--sub)]">
              <Check :size="13" class="mt-0.5 shrink-0" style="color: var(--accent)" /> {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </Section>

    <Section kicker="Money" title="How you confirm a quote">
      <div class="grid gap-3 sm:grid-cols-3">
        <div v-for="[t, b] in confirmation" :key="t" class="rounded-2xl border p-5" style="border-color: var(--line); background: var(--panel)">
          <ML>{{ t }}</ML>
          <p class="mt-2 text-[13px] leading-relaxed text-[var(--sub)]">{{ b }}</p>
        </div>
      </div>
    </Section>

    <CtaBand title="Bring your desk to Printy." body="A manager account is free. No card, no commitment — just one clean board for every job you coordinate.">
      <NuxtLink to="/sign-up?mode=manager" class="press-key rounded-2xl bg-white px-7 py-3.5 font-mono2 text-[12px] font-bold uppercase tracking-[0.16em]" style="color: var(--accent)">
        Create manager account
      </NuxtLink>
    </CtaBand>
  </div>
</template>

<script setup lang="ts">
import { Check, CreditCard, Gauge, Radar, ShieldCheck, Users2 } from 'lucide-vue-next'
import type { Component } from 'vue'

const gains: Array<[Component, string, string]> = [
  [Gauge, 'SLA & risk board', 'Every job shows its owner, the running clock and anything approaching a breach — before it becomes a problem.'],
  [Users2, 'Printer assignment', 'Match each job to a verified press with the right kit, or let the network auto-assign to the best available shop.'],
  [ShieldCheck, 'Dispute handling', 'Freeze funds, flag a job to admin and route a reprint or refund while the money stays in custody.'],
]

const role: Array<[string, string[]]> = [
  [
    'Confirm quotes from live rate cards',
    ['Check the production maths against the shop\'s actual rates', 'Approve or negotiate before the job moves to artwork', 'Keep custody dates and delivery SLAs on every line'],
  ],
  [
    'Keep clients in the loop',
    ['One link, zero status-chasing — the client watches the same timeline you do', 'Flag exactly what needs their approval and when', 'Escalate late prints before the deadline slips'],
  ],
]

const confirmation: Array<[string, string]> = [
  ['1 · They price', 'The client builds a spec and the system prices it against live production options — you confirm it, not re-invent it.'],
  ['2 · You confirm', 'Check the sheet maths and per-piece cost against the shop rate card, then confirm the figure.'],
  ['3 · They pay into custody', 'Funds sit with Printy and release to the printer only after the client confirms delivery.'],
]
</script>