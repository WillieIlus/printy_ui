<template>
  <section class="border-t border-[var(--p-border)] bg-[var(--p-surface)] py-16 sm:py-24">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-2xl text-center">
        <span class="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-flamingo-500">
          Why Printy
        </span>
        <h2 class="mt-3 text-3xl font-bold tracking-tight text-[var(--p-text)] sm:text-4xl">
          Solve the common print buying friction first
        </h2>
        <p class="mt-3 text-base leading-7 text-[var(--p-text)]">
          Printy removes the parts of buying print that usually waste time before a shop can even respond.
        </p>
      </div>

      <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <article
          v-for="feature in features"
          :key="feature.solution"
          class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-bg)] p-6 shadow-sm"
        >
          <div :class="iconShellClass">
            <UIcon :name="feature.icon" class="h-5 w-5" />
          </div>
          <p class="mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--p-text)]">
            {{ feature.problem }}
          </p>
          <h3 class="mt-2 text-lg font-semibold text-[var(--p-text)]">
            {{ feature.solution }}
          </h3>
          <p class="mt-2 text-sm leading-6 text-[var(--p-text)]">
            {{ feature.body }}
          </p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const features = [
  {
    problem: 'Guessing print prices',
    solution: 'Get instant pricing',
    body: 'See estimated cost as you configure quantity, paper, and finishing instead of waiting for a callback.',
    icon: 'i-lucide-zap',
  },
  {
    problem: 'Waiting for quotes',
    solution: 'Compare shops faster',
    body: 'Browse nearby print shops and move into the right option quickly when you already know the job basics.',
    icon: 'i-lucide-store',
  },
  {
    problem: 'Confusing specifications',
    solution: 'Use guided configuration',
    body: 'Choose the product, size, quantity, and extras in a flow that is easier to follow than manual quote chats.',
    icon: 'i-lucide-sliders-horizontal',
  },
  {
    problem: 'Messy quote requests',
    solution: 'Send cleaner briefs',
    body: 'Shops receive clearer job details, which makes follow-up and revisions quicker for both sides.',
    icon: 'i-lucide-send',
  },
]

const iconShellClass = 'flex h-11 w-11 items-center justify-center rounded-xl border border-flamingo-400/30 bg-slate-950 text-flamingo-500 shadow-[0_10px_24px_rgba(8,17,31,0.24)]'
</script>
