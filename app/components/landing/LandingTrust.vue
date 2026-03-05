<template>
  <section class="py-16 sm:py-24 bg-[var(--p-surface)] border-t border-[var(--p-border)]">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h2 class="text-2xl font-bold text-[var(--p-text)] sm:text-3xl text-center">
        Trust & support
      </h2>
      <p class="mt-2 text-[var(--p-text-muted)] text-center max-w-xl mx-auto">
        We're here to help. Reach out anytime.
      </p>

      <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <a
          href="tel:+254700000000"
          class="flex items-center gap-4 rounded-xl border border-[var(--p-border)] bg-[var(--p-bg)] p-4 transition-colors hover:border-flamingo-300 dark:hover:border-flamingo-700"
        >
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-flamingo-100 dark:bg-flamingo-900/30">
            <UIcon name="i-lucide-phone" class="w-5 h-5 text-flamingo-600 dark:text-flamingo-400" />
          </div>
          <div>
            <p class="font-medium text-[var(--p-text)]">Phone</p>
            <p class="text-sm text-[var(--p-text-muted)]">+254 700 000 000</p>
          </div>
        </a>
        <div class="flex items-center gap-4 rounded-xl border border-[var(--p-border)] bg-[var(--p-bg)] p-4">
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-flamingo-100 dark:bg-flamingo-900/30">
            <UIcon name="i-lucide-map-pin" class="w-5 h-5 text-flamingo-600 dark:text-flamingo-400" />
          </div>
          <div>
            <p class="font-medium text-[var(--p-text)]">Location</p>
            <p class="text-sm text-[var(--p-text-muted)]">Nairobi, Kenya</p>
          </div>
        </div>
        <div class="flex items-center gap-4 rounded-xl border border-[var(--p-border)] bg-[var(--p-bg)] p-4">
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-flamingo-100 dark:bg-flamingo-900/30">
            <UIcon name="i-lucide-truck" class="w-5 h-5 text-flamingo-600 dark:text-flamingo-400" />
          </div>
          <div>
            <p class="font-medium text-[var(--p-text)]">Delivery</p>
            <p class="text-sm text-[var(--p-text-muted)]">Nairobi & nationwide</p>
          </div>
        </div>
        <NuxtLink
          to="/help"
          class="flex items-center gap-4 rounded-xl border border-[var(--p-border)] bg-[var(--p-bg)] p-4 transition-colors hover:border-flamingo-300 dark:hover:border-flamingo-700"
        >
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-flamingo-100 dark:bg-flamingo-900/30">
            <UIcon name="i-lucide-help-circle" class="w-5 h-5 text-flamingo-600 dark:text-flamingo-400" />
          </div>
          <div>
            <p class="font-medium text-[var(--p-text)]">Help</p>
            <p class="text-sm text-[var(--p-text-muted)]">FAQs & support</p>
          </div>
        </NuxtLink>
      </div>

      <!-- Testimonials placeholder -->
      <div class="mt-16 rounded-2xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-8 text-center">
        <UIcon name="i-lucide-quote" class="mx-auto h-10 w-10 text-[var(--p-text-muted)]" />
        <p class="mt-4 text-[var(--p-text-muted)] italic max-w-2xl mx-auto">
          Testimonials coming soon. Trusted by print shops across Kenya.
        </p>
      </div>
    </div>
  </section>
</template>
