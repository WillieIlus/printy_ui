<template>
  <div class="min-h-screen bg-[var(--p-bg)] text-[var(--p-text)]">
    <HomeTopBar />

    <main class="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 md:px-6 md:py-16">
      <section class="grid gap-8 rounded-[2rem] border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-[0_30px_80px_-56px_rgba(15,23,42,0.45)] md:p-8 lg:grid-cols-[minmax(0,1.15fr)_360px]">
        <div class="space-y-5">
          <BaseBadge tone="primary">For partners</BaseBadge>
          <div class="space-y-3">
            <h1 class="text-4xl font-semibold tracking-tight md:text-5xl">
              Create quotes, manage clients, track production, and earn margin without fronting cash.
            </h1>
            <p class="max-w-3xl text-base leading-7 text-[var(--p-text-muted)]">
              Partner accounts are built for designers, print agents, resellers, agencies, sourcing teams, and hybrid printers who need a cleaner way to manage client work through production.
            </p>
          </div>

          <div class="grid gap-3 sm:grid-cols-2">
            <div class="rounded-[1.5rem] border border-[var(--p-border)] bg-[var(--p-bg-soft)] p-4">
              <p class="text-sm font-semibold">Client relationships</p>
              <p class="mt-1 text-sm leading-6 text-[var(--p-text-muted)]">Keep every request tied to the right client, brief, and follow-up path.</p>
            </div>
            <div class="rounded-[1.5rem] border border-[var(--p-border)] bg-[var(--p-bg-soft)] p-4">
              <p class="text-sm font-semibold">Quote builder</p>
              <p class="mt-1 text-sm leading-6 text-[var(--p-text-muted)]">Start from a verified estimate, add your margin, and send a client-ready quote fast.</p>
            </div>
            <div class="rounded-[1.5rem] border border-[var(--p-border)] bg-[var(--p-bg-soft)] p-4">
              <p class="text-sm font-semibold">Payment secured</p>
              <p class="mt-1 text-sm leading-6 text-[var(--p-text-muted)]">Know when payment is pending, confirmed, and moving toward completion-based release.</p>
            </div>
            <div class="rounded-[1.5rem] border border-[var(--p-border)] bg-[var(--p-bg-soft)] p-4">
              <p class="text-sm font-semibold">Production tracking</p>
              <p class="mt-1 text-sm leading-6 text-[var(--p-text-muted)]">Track proofs, production movement, and delivery status without losing the client relationship.</p>
            </div>
          </div>
        </div>

        <aside class="rounded-[1.75rem] border border-[var(--p-border)] bg-[var(--p-bg-soft)] p-6">
          <p class="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--p-primary)]">Partner entry</p>
          <h2 class="mt-3 text-2xl font-semibold tracking-tight">Start with the workspace built for coordination.</h2>
          <p class="mt-3 text-sm leading-6 text-[var(--p-text-muted)]">
            Create a partner-enabled account now, or sign in if you already manage client jobs through Printy.
          </p>

          <div class="mt-6 flex flex-col gap-3">
            <BaseButton :to="buildPartnerSignupRoute()" variant="primary" size="lg">
              Become a Printy Partner
            </BaseButton>
            <BaseButton :to="partnerLoginLink" variant="outline" size="lg">
              Sign in to partner workspace
            </BaseButton>
          </div>
        </aside>
      </section>
    </main>

    <MinimalFooter />
  </div>
</template>

<script setup lang="ts">
import HomeTopBar from '~/components/organisms/marketing/HomeTopBar.vue'
import MinimalFooter from '~/components/marketing/home/MinimalFooter.vue'
import BaseBadge from '~/components/ui/BaseBadge.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import { ROUTES, buildPartnerSignupRoute } from '~/shared/routes'

useSeoMeta({
  title: 'For Partners - Printy',
  description: 'Create a partner account to manage client quote requests, production updates, and repeat print jobs.',
  ogTitle: 'For Partners - Printy',
  ogDescription: 'Create a partner account to manage client quote requests, production updates, and repeat print jobs.',
})

const partnerLoginLink = {
  path: ROUTES.shopLogin,
  query: {
    role: 'partner',
    next: ROUTES.partnerWorkspace,
  },
}
</script>
