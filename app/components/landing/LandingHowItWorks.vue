<template>
  <section class="py-16 sm:py-24 bg-[var(--p-bg)]">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h2 class="text-2xl font-bold text-[var(--p-text)] sm:text-3xl text-center">
        How it works
      </h2>
      <p class="mt-2 text-[var(--p-text-muted)] text-center max-w-xl mx-auto">
        Three simple steps to get your printing quote.
      </p>
      <div class="mt-12 grid gap-8 sm:grid-cols-3">
        <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 text-center">
          <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-flamingo-100 dark:bg-flamingo-900/30 text-flamingo-600 dark:text-flamingo-400">
            <UIcon name="i-lucide-search" class="w-6 h-6" />
          </div>
          <h3 class="mt-4 font-semibold text-[var(--p-text)]">1. Browse</h3>
          <p class="mt-2 text-sm text-[var(--p-text-muted)]">
            Choose from templates or browse print shops. Pick your product type and options.
          </p>
        </div>
        <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 text-center">
          <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-flamingo-100 dark:bg-flamingo-900/30 text-flamingo-600 dark:text-flamingo-400">
            <UIcon name="i-lucide-calculator" class="w-6 h-6" />
          </div>
          <h3 class="mt-4 font-semibold text-[var(--p-text)]">2. Get a quote</h3>
          <p class="mt-2 text-sm text-[var(--p-text-muted)]">
            See instant pricing. Add to your quote draft and tweak quantity, paper, finishing.
          </p>
        </div>
        <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 text-center">
          <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-flamingo-100 dark:bg-flamingo-900/30 text-flamingo-600 dark:text-flamingo-400">
            <UIcon name="i-lucide-send" class="w-6 h-6" />
          </div>
          <h3 class="mt-4 font-semibold text-[var(--p-text)]">3. Request and receive</h3>
          <p class="mt-2 text-sm text-[var(--p-text-muted)]">
            Submit your quote request. Shops respond with final pricing and delivery details.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
