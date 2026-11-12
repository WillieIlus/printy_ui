<script setup lang="ts">
import { computed, ref } from 'vue'
import { Search } from 'lucide-vue-next'
import { HELP_GROUPS, LEGAL_CONTACT_EMAIL, LEGAL_UPDATED, LEGAL_VERSION } from '~/shared/legal/content'
import LegalBreadcrumbs from '~/components/legal/LegalBreadcrumbs.vue'

const query = ref('')

const normalizedQuery = computed(() => query.value.trim().toLowerCase())

const filteredGroups = computed(() => {
  const term = normalizedQuery.value
  if (!term) return HELP_GROUPS

  return HELP_GROUPS
    .map((group) => ({
      ...group,
      items: group.items.filter((item) =>
        `${item.question} ${item.answer} ${group.title}`.toLowerCase().includes(term),
      ),
    }))
    .filter((group) => group.items.length > 0)
})

const matchCount = computed(() =>
  filteredGroups.value.reduce((total, group) => total + group.items.length, 0),
)
</script>

<template>
  <main id="top" class="mx-auto w-full max-w-5xl px-5 pb-20 pt-8 sm:px-8 sm:pt-10">
    <LegalBreadcrumbs current="Help" />

    <header class="mt-6 max-w-2xl">
      <p class="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-brand">Answers, fast</p>
      <h1 class="mt-3 text-[34px] leading-[1.03] font-bold tracking-tight text-ink text-balance sm:text-[46px]">
        How can we help?
      </h1>
      <p class="mt-4 text-[14.5px] leading-relaxed text-ink-2">
        Short answers about quotes, artwork, paying, tracking and the people who do the work. Search below or browse by topic.
      </p>
      <p class="mt-5 inline-flex flex-wrap items-center gap-2 rounded-full border border-line bg-card px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.12em] text-ink-3">
        <span>Version {{ LEGAL_VERSION }}</span>
        <span aria-hidden="true">·</span>
        <span>Last updated {{ LEGAL_UPDATED }}</span>
      </p>
    </header>

    <div class="mt-8 max-w-2xl">
      <label for="help-search" class="sr-only">Search help</label>
      <div class="relative">
        <Search :size="16" class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-3" aria-hidden="true" />
        <input
          id="help-search"
          v-model="query"
          type="search"
          autocomplete="off"
          placeholder="Search help, e.g. artwork, M-Pesa, late"
          class="w-full rounded-2xl border border-line bg-card py-3.5 pl-11 pr-4 text-[14px] text-ink shadow-card outline-none transition-colors placeholder:text-ink-3 focus:border-brand"
        >
      </div>
      <p class="mt-2 min-h-4 font-mono text-[9.5px] uppercase tracking-[0.1em] text-ink-3" aria-live="polite">
        <template v-if="normalizedQuery">{{ matchCount }} {{ matchCount === 1 ? 'answer' : 'answers' }}</template>
      </p>
    </div>

    <nav v-if="!normalizedQuery" aria-label="Help topics" class="mt-5 flex flex-wrap gap-2">
      <a
        v-for="group in HELP_GROUPS"
        :key="group.id"
        :href="`#${group.id}`"
        class="rounded-full border border-line bg-card px-3 py-1.5 font-mono text-[10px] font-medium tracking-[0.04em] text-ink-2 transition-colors hover:border-brand hover:text-brand"
      >
        {{ group.title }}
      </a>
    </nav>

    <div v-if="filteredGroups.length" class="mt-10 space-y-10">
      <section v-for="group in filteredGroups" :id="group.id" :key="group.id" class="scroll-mt-24">
        <h2 class="text-[18px] font-bold tracking-tight text-ink">{{ group.title }}</h2>
        <div class="mt-3 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-card shadow-card">
          <details v-for="item in group.items" :key="item.question" class="group px-5 py-4 sm:px-6">
            <summary class="flex cursor-pointer list-none items-center justify-between gap-4 text-[14px] font-semibold leading-snug text-ink">
              <span>{{ item.question }}</span>
              <span aria-hidden="true" class="relative h-4 w-4 shrink-0 text-ink-3">
                <span class="absolute left-1/2 top-1/2 h-px w-3 -translate-x-1/2 -translate-y-1/2 bg-current" />
                <span class="absolute left-1/2 top-1/2 h-3 w-px -translate-x-1/2 -translate-y-1/2 bg-current transition-transform group-open:rotate-90 group-open:opacity-0" />
              </span>
            </summary>
            <p class="mt-3 max-w-[70ch] pr-6 text-[13.5px] leading-relaxed text-ink-2">{{ item.answer }}</p>
          </details>
        </div>
      </section>
    </div>

    <div v-else class="mt-10 rounded-2xl border border-line bg-card p-8 text-center shadow-card">
      <p class="text-[15px] font-semibold text-ink">No answer matched “{{ query.trim() }}”.</p>
      <p class="mt-2 text-[13.5px] text-ink-2">
        Try a shorter word, or email
        <a :href="`mailto:${LEGAL_CONTACT_EMAIL}`" class="font-medium text-brand underline underline-offset-4">{{ LEGAL_CONTACT_EMAIL }}</a>.
      </p>
    </div>

    <section class="mt-12 rounded-2xl border border-brand-deep bg-brand-deep p-6 text-paper shadow-card sm:p-7">
      <h2 class="text-[18px] font-bold tracking-tight">Still stuck?</h2>
      <p class="mt-2 max-w-[60ch] text-[13.5px] leading-relaxed text-paper/75">
        Email us with your job code and what you expected to happen. A person reads it.
      </p>
      <a
        :href="`mailto:${LEGAL_CONTACT_EMAIL}`"
        class="mt-4 inline-flex rounded-full bg-paper px-4 py-2 font-mono text-[10.5px] font-semibold uppercase tracking-[0.12em] text-brand-deep"
      >
        {{ LEGAL_CONTACT_EMAIL }}
      </a>
      <div class="mt-4 flex flex-wrap gap-3 text-[12.5px] font-medium">
        <NuxtLink to="/terms" class="text-paper underline underline-offset-4">Terms</NuxtLink>
        <NuxtLink to="/privacy" class="text-paper underline underline-offset-4">Privacy Notice</NuxtLink>
      </div>
    </section>
  </main>
</template>
