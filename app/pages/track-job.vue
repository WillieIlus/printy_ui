<template>
  <div class="min-h-screen bg-[var(--p-bg)] text-[var(--p-text)]">
    <HomeTopBar />

    <main class="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-12 md:px-6 md:py-16">
      <section class="rounded-[2rem] border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-[0_30px_80px_-56px_rgba(15,23,42,0.45)] md:p-8">
        <BaseBadge tone="primary">Track Job</BaseBadge>
        <div class="mt-4 space-y-3">
          <h1 class="text-4xl font-semibold tracking-tight md:text-5xl">
            Sign in to follow your print job.
          </h1>
          <p class="max-w-3xl text-base leading-7 text-[var(--p-text-muted)]">
            Client accounts keep your active jobs, proofs, files, and delivery updates in one place so you do not have to track status across separate chats.
          </p>
        </div>

        <div class="mt-8 grid gap-4 md:grid-cols-3">
          <div class="rounded-[1.5rem] border border-[var(--p-border)] bg-[var(--p-bg-soft)] p-4">
            <p class="text-sm font-semibold">Proof review</p>
            <p class="mt-1 text-sm leading-6 text-[var(--p-text-muted)]">Check what needs approval before production starts.</p>
          </div>
          <div class="rounded-[1.5rem] border border-[var(--p-border)] bg-[var(--p-bg-soft)] p-4">
            <p class="text-sm font-semibold">Job progress</p>
            <p class="mt-1 text-sm leading-6 text-[var(--p-text-muted)]">See where your order is in the production flow.</p>
          </div>
          <div class="rounded-[1.5rem] border border-[var(--p-border)] bg-[var(--p-bg-soft)] p-4">
            <p class="text-sm font-semibold">Files and delivery</p>
            <p class="mt-1 text-sm leading-6 text-[var(--p-text-muted)]">Keep source files, status notes, and delivery details together.</p>
          </div>
        </div>

        <div class="mt-8 flex flex-col gap-3 sm:flex-row">
          <BaseButton :to="loginLink" variant="primary" size="lg">
            Sign in to track job
          </BaseButton>
          <BaseButton :to="buildClientSignupRoute(ROUTES.clientJobs)" variant="outline" size="lg">
            Create client account
          </BaseButton>
        </div>
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
import { ROUTES, buildClientSignupRoute } from '~/shared/routes'

useSeoMeta({
  title: 'Track Job - Printy',
  description: 'Sign in to your client workspace to review proofs, files, and live print job progress.',
  ogTitle: 'Track Job - Printy',
  ogDescription: 'Sign in to your client workspace to review proofs, files, and live print job progress.',
})

const loginLink = {
  path: ROUTES.shopLogin,
  query: {
    role: 'client',
    next: ROUTES.clientJobs,
  },
}
</script>
