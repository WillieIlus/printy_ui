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
            <NuxtLink to="/" class="inline-flex items-center gap-3.5 group">
              <span class="grid h-12 w-12 place-items-center rounded-xl shadow-lg transition-transform group-hover:scale-105 overflow-hidden shrink-0" style="background: var(--color-primary-600);">
                <CommonPrintyLogoMark img-class="h-7 w-7" />
              </span>
              <span class="flex items-center">
                <CommonPrintyWordmark img-class="h-7 w-auto max-w-[132px]" />
              </span>
            </NuxtLink>
          </div>

          <div class="text-center mb-8">
            <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Create account</p>
            <h1 v-if="route.query.role === 'shop_owner'" class="mt-2 text-2xl font-bold text-[var(--p-text)] sm:text-3xl">
              Open your print shop on Printy
            </h1>
            <h1 v-else-if="route.query.role === 'client'" class="mt-2 text-2xl font-bold text-[var(--p-text)] sm:text-3xl">
              Create a free client account
            </h1>
            <h1 v-else class="mt-2 text-2xl font-bold text-[var(--p-text)] sm:text-3xl">
              Choose how to use Printy
            </h1>
            <p v-if="route.query.role === 'shop_owner'" class="mt-2 text-sm text-[var(--p-text-muted)]">
              Get discovered by customers looking for print services. Manage products, pricing, and quote requests in one place.
            </p>
            <p v-else-if="route.query.role === 'client'" class="mt-2 text-sm text-[var(--p-text-muted)]">
              Save your request, send it to print shops, and track responses. Continue where you left off.
            </p>
            <p v-else class="mt-2 text-sm text-[var(--p-text-muted)]">
              Create an account as a client, staff member, shop owner, or start now and create your shop later.
            </p>
          </div>

          <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] shadow-sm p-6 sm:p-8">
            <AuthSignupForm />
          </div>

          <p class="mt-6 text-center text-sm text-[var(--p-text-muted)]">
            Already have an account?
            <NuxtLink to="/auth/login" class="text-flamingo-600 hover:underline font-medium dark:text-flamingo-400">Sign in</NuxtLink>
          </p>

          <div v-if="route.query.role === 'client'" class="mt-4 pt-4 border-t border-[var(--p-border)] text-center">
            <p class="text-sm text-[var(--p-text-muted)]">
              I own a print shop.
              <NuxtLink to="/auth/signup?role=shop_owner" class="text-flamingo-600 hover:underline font-medium dark:text-flamingo-400">Open my shop</NuxtLink>
            </p>
          </div>
        </div>
      </div>

      <!-- Side panel: value props (50%, blue background) -->
      <aside class="hidden lg:flex lg:w-1/2 lg:min-w-0 shrink-0 flex-col justify-center bg-[var(--p-surface-sunken)] text-[var(--p-text)] p-8 xl:p-12">
        <h2 class="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-8">
          What you get with Printy
        </h2>
        <ul class="space-y-8">
          <li class="flex gap-5">
            <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[var(--p-text)]/10 text-[var(--p-text)]">
              <UIcon name="i-lucide-zap" class="w-7 h-7" />
            </div>
            <div>
              <p class="text-xl font-bold sm:text-2xl">Faster print calculations</p>
              <p class="text-lg text-[var(--p-text-muted)] mt-1 leading-relaxed">See estimated prices as you configure—no manual math.</p>
            </div>
          </li>
          <li class="flex gap-5">
            <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[var(--p-text)]/10 text-[var(--p-text)]">
              <UIcon name="i-lucide-shield-check" class="w-7 h-7" />
            </div>
            <div>
              <p class="text-xl font-bold sm:text-2xl">Fewer pricing mistakes</p>
              <p class="text-lg text-[var(--p-text-muted)] mt-1 leading-relaxed">Structured quotes reduce errors and rework.</p>
            </div>
          </li>
          <li class="flex gap-5">
            <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[var(--p-text)]/10 text-[var(--p-text)]">
              <UIcon name="i-lucide-clipboard-list" class="w-7 h-7" />
            </div>
            <div>
              <p class="text-xl font-bold sm:text-2xl">Organized quote workflow</p>
              <p class="text-lg text-[var(--p-text-muted)] mt-1 leading-relaxed">Track requests and respond from one place.</p>
            </div>
          </li>
          <li class="flex gap-5">
            <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[var(--p-text)]/10 text-[var(--p-text)]">
              <UIcon name="i-lucide-store" class="w-7 h-7" />
            </div>
            <div>
              <p class="text-xl font-bold sm:text-2xl">Professional public shop presence</p>
              <p class="text-lg text-[var(--p-text-muted)] mt-1 leading-relaxed">A clean page where customers find you and request quotes.</p>
            </div>
          </li>
        </ul>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

definePageMeta({
  layout: false,
  middleware: 'guest',
})
</script>
