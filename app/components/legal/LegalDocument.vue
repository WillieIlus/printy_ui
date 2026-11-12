<script setup lang="ts">
import type { LegalSection } from '~/shared/legal/content'
import { LEGAL_CONTACT_EMAIL, LEGAL_UPDATED, LEGAL_VERSION } from '~/shared/legal/content'
import LegalBreadcrumbs from '~/components/legal/LegalBreadcrumbs.vue'

const props = withDefaults(defineProps<{
  title: string
  eyebrow: string
  intro: string
  sections: LegalSection[]
  plainWords: readonly string[]
  currentLabel: string
}>(), {
  currentLabel: '',
})

const tocLabel = (section: LegalSection) => `${section.number}. ${section.title}`
</script>

<template>
  <main id="top" class="mx-auto w-full max-w-6xl px-5 pb-20 pt-8 sm:px-8 sm:pt-10">
    <LegalBreadcrumbs :current="props.currentLabel || props.title" />

    <header class="mt-6 max-w-3xl">
      <p class="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-brand">{{ props.eyebrow }}</p>
      <h1 class="mt-3 text-[34px] leading-[1.03] font-bold tracking-tight text-ink text-balance sm:text-[46px]">
        {{ props.title }}
      </h1>
      <p class="mt-4 text-[14.5px] leading-relaxed text-ink-2">{{ props.intro }}</p>
      <p class="mt-5 inline-flex flex-wrap items-center gap-2 rounded-full border border-line bg-card px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.12em] text-ink-3">
        <span>Version {{ LEGAL_VERSION }}</span>
        <span aria-hidden="true">·</span>
        <span>Last updated {{ LEGAL_UPDATED }}</span>
      </p>
    </header>

    <section aria-label="In plain words" class="mt-8 max-w-3xl rounded-2xl border border-brand-deep bg-brand-deep p-6 text-paper shadow-card sm:p-7">
      <h2 class="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-paper/60">In plain words</h2>
      <ul class="mt-4 space-y-3">
        <li v-for="line in props.plainWords" :key="line" class="flex gap-3 text-[14px] leading-relaxed">
          <span aria-hidden="true" class="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
          <span>{{ line }}</span>
        </li>
      </ul>
    </section>

    <div class="mt-10 grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-14">
      <aside class="lg:sticky lg:top-24 lg:self-start">
        <details class="rounded-2xl border border-line bg-card p-4 lg:hidden">
          <summary class="cursor-pointer list-none font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink">
            On this page
          </summary>
          <ol class="mt-3 space-y-2">
            <li v-for="section in props.sections" :key="section.id">
              <a :href="`#${section.id}`" class="block text-[12.5px] leading-snug text-ink-2 hover:text-brand">{{ tocLabel(section) }}</a>
            </li>
          </ol>
        </details>

        <nav aria-label="Table of contents" class="hidden lg:block">
          <p class="font-mono text-[9.5px] font-semibold uppercase tracking-[0.14em] text-ink-3">On this page</p>
          <ol class="mt-3 space-y-1.5 border-l border-line">
            <li v-for="section in props.sections" :key="section.id">
              <a
                :href="`#${section.id}`"
                class="-ml-px block border-l border-transparent py-1 pl-3 text-[12px] leading-snug text-ink-3 transition-colors hover:border-brand hover:text-ink"
              >
                {{ tocLabel(section) }}
              </a>
            </li>
          </ol>
        </nav>
      </aside>

      <article class="min-w-0 max-w-[68ch]">
        <section
          v-for="(section, index) in props.sections"
          :id="section.id"
          :key="section.id"
          class="scroll-mt-24"
          :class="index > 0 ? 'mt-9 border-t border-line pt-9' : ''"
          :aria-labelledby="`${section.id}-heading`"
        >
          <h2 :id="`${section.id}-heading`" class="text-[20px] leading-tight font-bold tracking-tight text-ink">
            {{ section.number }}. {{ section.title }}
          </h2>

          <div class="mt-4 space-y-4">
            <template v-for="(block, blockIndex) in section.blocks" :key="blockIndex">
              <p v-if="block.kind === 'p'" class="text-[14.5px] leading-relaxed text-ink-2">{{ block.text }}</p>

              <ul v-else-if="block.kind === 'bullets'" class="space-y-2.5">
                <li v-for="item in block.items" :key="item" class="flex gap-2.5 text-[14.5px] leading-relaxed text-ink-2">
                  <span aria-hidden="true" class="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand/70" />
                  <span>{{ item }}</span>
                </li>
              </ul>

              <div v-else class="overflow-x-auto rounded-2xl border border-line bg-card">
                <table class="w-full min-w-[540px] border-collapse text-left text-[13px]">
                  <thead>
                    <tr class="border-b border-line bg-paper-2/70">
                      <th v-for="cell in block.head" :key="cell" scope="col" class="px-4 py-3 font-semibold text-ink">{{ cell }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, rowIndex) in block.rows" :key="rowIndex" class="border-b border-line/70 last:border-0">
                      <td v-for="(cell, cellIndex) in row" :key="cellIndex" class="px-4 py-3 align-top leading-relaxed text-ink-2">{{ cell }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </template>
          </div>
        </section>

        <div class="mt-12 rounded-2xl border border-line bg-paper-2 p-6">
          <h2 class="text-[16px] font-bold tracking-tight text-ink">Questions about this document?</h2>
          <p class="mt-2 text-[13.5px] leading-relaxed text-ink-2">
            Email
            <a :href="`mailto:${LEGAL_CONTACT_EMAIL}`" class="font-medium text-brand underline underline-offset-4">{{ LEGAL_CONTACT_EMAIL }}</a>.
            For how the product works, see the
            <NuxtLink to="/help" class="font-medium text-brand underline underline-offset-4">Help page</NuxtLink>.
          </p>
          <div class="mt-4 flex flex-wrap gap-3 text-[12.5px] font-medium">
            <NuxtLink to="/terms" class="text-brand underline underline-offset-4">Terms</NuxtLink>
            <NuxtLink to="/privacy" class="text-brand underline underline-offset-4">Privacy Notice</NuxtLink>
            <NuxtLink to="/help" class="text-brand underline underline-offset-4">Help</NuxtLink>
          </div>
        </div>

        <p class="mt-8">
          <a href="#top" class="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-3 hover:text-brand">Back to top</a>
        </p>
      </article>
    </div>
  </main>
</template>
