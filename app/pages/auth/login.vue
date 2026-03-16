<template>
  <div class="min-h-screen flex flex-col bg-[var(--p-bg)] text-[var(--p-text)]">
    <div class="shrink-0 flex items-center justify-between px-4 py-3 border-b border-[var(--p-border)] bg-[var(--p-surface)]">
      <NuxtLink
        to="/"
        class="inline-flex items-center gap-2 text-sm font-medium text-[var(--p-text-muted)] hover:text-[var(--p-text)] transition-colors"
      >
        <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
        Back
      </NuxtLink>
      <ThemeCycleButton />
    </div>

    <div class="flex-1 flex flex-col lg:flex-row lg:min-h-0">
      <!-- Main form area (50%) -->
      <div class="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12 lg:w-1/2 lg:min-w-0">
        <div class="w-full max-w-md">
          <div class="text-center mb-8">
            <NuxtLink to="/" class="inline-flex items-center gap-3 group">
              <span class="grid h-12 w-12 place-items-center rounded-xl shadow-lg transition-transform group-hover:scale-105 overflow-hidden shrink-0" style="background: #e13515;">
                <CommonPrintyLogoMark img-class="h-7 w-7" />
              </span>
              <CommonPrintyWordmark img-class="h-6 w-auto max-w-[100px]" />
            </NuxtLink>
          </div>

          <div class="text-center mb-8">
            <h1 class="text-2xl font-bold text-[var(--p-text)] sm:text-3xl">
              Welcome back to your print workspace
            </h1>
            <p class="mt-2 text-sm text-[var(--p-text-muted)]">
              Continue pricing jobs, sending quotes, and managing your print shop.
            </p>
          </div>

          <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] shadow-sm p-6 sm:p-8">
            <AuthLoginForm />
          </div>

          <p class="mt-6 text-center text-sm text-[var(--p-text-muted)]">
            Don't have an account?
            <NuxtLink to="/auth/signup" class="text-flamingo-600 hover:underline font-medium dark:text-flamingo-400">Create your workspace</NuxtLink>
          </p>
        </div>
      </div>

      <!-- Side panel: what you're returning to (50%, blue background) -->
      <aside class="hidden lg:flex lg:w-1/2 lg:min-w-0 shrink-0 flex-col justify-center bg-[#1e3a5f] text-white p-8 xl:p-12">
        <h2 class="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-8">
          Back to your print shop
        </h2>
        <p class="text-lg text-white/80 mb-10 leading-relaxed">
          Pick up where you left off—your quote requests, pricing, and jobs are waiting.
        </p>
        <ul class="space-y-6">
          <li class="flex gap-4">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
              <UIcon name="i-lucide-calculator" class="w-6 h-6" />
            </div>
            <div>
              <p class="text-lg font-bold">Faster quoting</p>
              <p class="text-base text-white/80 mt-0.5">Price jobs in seconds, not back-and-forth.</p>
            </div>
          </li>
          <li class="flex gap-4">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
              <UIcon name="i-lucide-receipt" class="w-6 h-6" />
            </div>
            <div>
              <p class="text-lg font-bold">Clear pricing</p>
              <p class="text-base text-white/80 mt-0.5">Material, print, finishing—all itemized.</p>
            </div>
          </li>
          <li class="flex gap-4">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
              <UIcon name="i-lucide-clipboard-list" class="w-6 h-6" />
            </div>
            <div>
              <p class="text-lg font-bold">Quote management</p>
              <p class="text-base text-white/80 mt-0.5">Track requests and respond from one place.</p>
            </div>
          </li>
          <li class="flex gap-4">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
              <UIcon name="i-lucide-store" class="w-6 h-6" />
            </div>
            <div>
              <p class="text-lg font-bold">Your public shop page</p>
              <p class="text-base text-white/80 mt-0.5">Where customers find you and request quotes.</p>
            </div>
          </li>
        </ul>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  middleware: 'guest',
})
</script>
