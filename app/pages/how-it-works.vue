<template>
  <div>
    <PageHero
      eyebrow="how printy works"
      :icon="Workflow"
      title="Ten stages.
One visible workflow."
      lead="Every Printy job moves through the same ten stages. At each one there is exactly one owner, one required action and one running clock — so a job can never quietly stall."
    />

    <!-- the workflow -->
    <Section kicker="The workflow" title="What happens, in order">
      <div class="rounded-3xl border p-5 sm:p-7" style="border-color: var(--line); background: var(--panel)">
        <div v-for="(s, i) in STAGES" :key="s.key" class="flex gap-4">
          <div class="flex w-[30px] shrink-0 flex-col items-center">
            <span
              class="flex h-[30px] w-[30px] items-center justify-center rounded-full font-mono2 text-[11px] font-bold"
              style="background: color-mix(in srgb, var(--accent) 12%, transparent); color: var(--accent)"
            >
              {{ i + 1 }}
            </span>
            <span v-if="i < STAGES.length - 1" class="w-[2px] flex-1" style="background: var(--line)" />
          </div>
          <div class="min-w-0 flex-1 pb-6">
            <div class="flex flex-wrap items-center gap-2">
              <h3 class="font-disp text-[16px] font-bold tracking-tight">{{ s.label }}</h3>
              <span class="rounded-full px-2 py-[3px] font-mono2 text-[9px] uppercase tracking-[0.14em]" style="background: var(--panel2); color: var(--accent)">
                {{ stageCopy[s.key].who }} acts
              </span>
              <span v-if="s.sla > 0" class="font-mono2 text-[9px] uppercase tracking-[0.12em] text-[var(--sub)]">SLA {{ s.sla }}h</span>
            </div>
            <p class="mt-1 max-w-[62ch] text-[13px] leading-relaxed text-[var(--sub)]">{{ stageCopy[s.key].what }}</p>
          </div>
        </div>
      </div>
    </Section>

    <!-- three views -->
    <Section kicker="Same job, different screens" title="What each person sees">
      <div class="grid gap-4 md:grid-cols-3">
        <div
          v-for="r in views"
          :key="r.id"
          class="rounded-2xl border p-5"
          style="border-color: var(--line); background: var(--panel)"
        >
          <div class="flex h-10 w-10 items-center justify-center rounded-xl" :style="{ background: `color-mix(in srgb, ${accentOf(r.id)} 14%, transparent)` }">
            <component :is="r.icon" :size="18" :style="{ color: accentOf(r.id) }" />
          </div>
          <h3 class="mt-3 font-disp text-[16px] font-bold tracking-tight" :style="{ color: accentOf(r.id) }">{{ r.name }}</h3>
          <ul class="mt-3 space-y-1.5">
            <li v-for="s in r.sees" :key="s" class="flex items-start gap-2 text-[12.5px] leading-snug text-[var(--sub)]">
              <Check :size="13" class="mt-0.5 shrink-0" :style="{ color: accentOf(r.id) }" /> {{ s }}
            </li>
          </ul>
        </div>
      </div>
    </Section>

    <!-- custody -->
    <Section kicker="Money" title="How payment actually flows">
      <div class="grid gap-3 sm:grid-cols-3">
        <div v-for="[t, b] in custody" :key="t" class="rounded-2xl border p-5" style="border-color: var(--line); background: var(--panel)">
          <ML>{{ t }}</ML>
          <p class="mt-2 text-[13px] leading-relaxed text-[var(--sub)]">{{ b }}</p>
        </div>
      </div>
    </Section>

    <Section kicker="Questions" title="Common questions">
      <Faq :items="commonQuestions" />
    </Section>

    <CtaBand
      title="Try it on your next job."
      body="Build a spec, see the imposition, and send it to verified Nairobi presses."
    >
      <NuxtLink to="/" class="press-key rounded-2xl bg-white px-7 py-3.5 font-mono2 text-[12px] font-bold uppercase tracking-[0.16em]" style="color: var(--accent)">
        Open the calculator
      </NuxtLink>
    </CtaBand>
  </div>
</template>

<script setup lang="ts">
import { Check, Factory, Radar, ShoppingBag, Workflow } from 'lucide-vue-next'
import type { Component } from 'vue'
import type { Role, StageKey } from '~/shared/workflow/printy'
import { ROLE_META, STAGES } from '~/shared/workflow/printy'

const stageCopy: Record<StageKey, { who: string; what: string }> = {
  quote: { who: 'Client', what: 'Build the spec and get an exact price from live rate cards.' },
  artwork: { who: 'Studio', what: 'Artwork is imposed, bled and colour-profiled for press.' },
  approval: { who: 'Client', what: 'Review the proof and approve — or send it back for changes.' },
  payment: { who: 'Client', what: 'Pay by M-Pesa into Printy Custody. Nothing leaves until delivery.' },
  production: { who: 'Print Manager', what: 'The job is matched to a verified press with the right kit.' },
  printing: { who: 'Printer', what: 'Plates mounted, make-ready signed off, the run goes on press.' },
  finishing: { who: 'Printer', what: 'Cutting, folding, lamination, binding — whatever the spec needs.' },
  qc: { who: 'Printer', what: 'Sampling and colour measurement before anything is wrapped.' },
  delivery: { who: 'Courier', what: 'Collected, delivered and signed for at your address.' },
  completed: { who: 'Custody', what: 'You confirm delivery and the printer is paid out.' },
}

const views: Array<{ id: Role; icon: Component; name: string; sees: string[] }> = [
  { id: 'buyer', icon: ShoppingBag, name: 'Client', sees: ['Current stage & ETA', 'Whether you must act', 'Approve artwork, pay, confirm', 'Nothing operational or noisy'] },
  { id: 'manager', icon: Radar, name: 'Print Manager', sees: ['Every job needing attention', 'Who has the ball, for how long', 'SLA breaches and risk', 'Assign printers, resolve disputes'] },
  { id: 'printer', icon: Factory, name: 'Printer', sees: ['Incoming job requests', 'Full spec and deadline', 'One large next action', 'Accept → print → finish → QC'] },
]

function accentOf(id: Role) {
  return ROLE_META[id].theme.accent
}

const custody: Array<[string, string]> = [
  ['1 · You pay', "Your M-Pesa payment goes into Printy Custody after you approve the proof — not to the printer."],
  ['2 · We hold', 'The printer can see the funds are secured, so they start production with confidence.'],
  ['3 · We release', 'You confirm delivery and only then is the printer paid. Disputes freeze the funds.'],
]

const commonQuestions: [string, string][] = [
  ['How is the price calculated?', 'We lay your artwork out on a real press sheet, count how many copies fit including 3mm bleed, add the press spoilage policy (2 set-up sheets plus 10%), then apply the shop\'s paper, printing and finishing rates. Digital and offset are compared and the cheaper method wins.'],
  ['Why do I need an account to see prices?', 'Prices come from live shop rate cards. We show the full production maths to everyone — sheet counts, spoilage, machine — but the actual figures are reserved for account holders so rate cards aren\'t scraped. Signing up is free and takes under a minute.'],
  ['What if the quality is wrong?', 'Raise a dispute from the job page. The funds stay frozen in custody, the job is flagged to your manager and admin, and it\'s resolved as a reprint or refund before anyone is paid.'],
  ['Can I use my own printer?', 'Yes. If your usual shop is on Printy you can route jobs directly to them and still get the workflow, custody and tracking.'],
  ['Do you handle design?', 'You can upload a print-ready PDF, ask us to fix an existing file\'s bleed and colour, or have the studio design it from your brief.'],
]
</script>