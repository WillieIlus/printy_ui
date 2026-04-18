<script setup lang="ts">
import { resolvePostLoginRedirectPath } from '~/composables/useAuth'
import { useAuthStore } from '~/stores/auth'
import { useShopStore } from '~/stores/shop'
import { safeLogError } from '~/utils/safeLog'

const route = useRoute()
const authStore = useAuthStore()
const shopStore = useShopStore()

const pageState = ref<'loading' | 'ready' | 'error'>('loading')
const initError = ref<string | null>(null)

const isLoading = computed(() => pageState.value === 'loading')
const isReady = computed(() => pageState.value === 'ready')
const hasInitError = computed(() => pageState.value === 'error')

async function prepareLoginPage() {
  pageState.value = 'loading'
  initError.value = null

  try {
    if (import.meta.client && !authStore.initialized) {
      await authStore.initialize()
    }

    if (authStore.isAuthenticated) {
      if (!authStore.user) {
        await authStore.fetchMe()
      }

      if ((authStore.isShopOwner || authStore.isStaffRole) && !shopStore.myShopsLoaded) {
        await shopStore.fetchMyShops()
      }

      if (authStore.isAuthenticated && authStore.user) {
        const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : null
        const path = resolvePostLoginRedirectPath(
          authStore.user,
          (shopStore.myShops?.length ?? 0) > 0,
          redirect,
        )

        if (path !== route.fullPath) {
          await navigateTo(path, { replace: true })
          return
        }
      }
    }

    pageState.value = 'ready'
  } catch (err) {
    safeLogError(err, 'auth.login-page')
    initError.value = 'We could not load sign in right now. Please try again.'
    pageState.value = 'error'
  }
}

definePageMeta({
  layout: false,
  middleware: 'guest',
})

onMounted(() => {
  void prepareLoginPage()
})
</script>

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
            <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Already have an account?</p>
            <h1 v-if="route.query.role === 'client'" class="mt-2 text-2xl font-bold text-[var(--p-text)] sm:text-3xl">
              Sign in to continue as client
            </h1>
            <h1 v-else class="mt-2 text-2xl font-bold text-[var(--p-text)] sm:text-3xl">
              Sign in
            </h1>
            <p v-if="route.query.role === 'client'" class="mt-2 text-sm text-[var(--p-text-muted)]">
              Sign in to save your request, send it to print shops, and track responses.
            </p>
            <p v-else class="mt-2 text-sm text-[var(--p-text-muted)]">
              Sign in to continue with your existing Printy account.
            </p>
          </div>

          <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] shadow-sm p-6 sm:p-8">
            <CommonPageLoadingState
              v-if="isLoading"
              title="Loading sign in"
              subtitle="Preparing your secure login screen."
            />

            <div
              v-else-if="hasInitError"
              class="flex min-h-[25rem] flex-col items-center justify-center gap-4 text-center"
            >
              <div class="flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-700/70 bg-[rgb(94_25_36)] shadow-[0_18px_34px_-24px_rgba(244,63,94,0.42)]">
                <UIcon name="i-lucide-octagon-alert" class="h-7 w-7 text-rose-300" />
              </div>
              <div class="space-y-1">
                <p class="text-sm font-semibold text-[var(--p-text)]">Sign in is unavailable</p>
                <p class="text-sm text-[var(--p-text-muted)]">{{ initError }}</p>
              </div>
              <UButton
                color="primary"
                class="rounded-xl bg-flamingo-500 text-white hover:bg-flamingo-600"
                @click="prepareLoginPage"
              >
                Try again
              </UButton>
            </div>

            <AuthLoginForm v-else-if="isReady" />
          </div>

          <p class="mt-6 text-center text-sm text-[var(--p-text-muted)]">
            Need a new account?
            <NuxtLink :to="{ path: '/auth/signup', query: route.query }" class="text-flamingo-600 hover:underline font-medium dark:text-flamingo-400">Create one here</NuxtLink>
          </p>

          <div v-if="route.query.role === 'client'" class="mt-4 pt-4 border-t border-[var(--p-border)] text-center">
            <p class="text-sm text-[var(--p-text-muted)]">
              I own a print shop.
              <NuxtLink to="/auth/signup?role=shop_owner" class="text-flamingo-600 hover:underline font-medium dark:text-flamingo-400">Open my shop</NuxtLink>
            </p>
          </div>
        </div>
      </div>

      <aside class="hidden lg:flex lg:w-1/2 lg:min-w-0 shrink-0 flex-col justify-center bg-[var(--p-surface-sunken)] text-[var(--p-text)] p-8 xl:p-12">
        <h2 class="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-8">
          Sign in to continue
        </h2>
        <p class="text-lg text-[var(--p-text-muted)] mb-10 leading-relaxed">
          Existing accounts land in the right workspace after login. New role and shop-start choices now happen during account creation.
        </p>
        <ul class="space-y-6">
          <li class="flex gap-4">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--p-text)]/10 text-[var(--p-text)]">
              <UIcon name="i-lucide-calculator" class="w-6 h-6" />
            </div>
            <div>
              <p class="text-lg font-bold">Preview pricing quickly</p>
              <p class="text-base text-[var(--p-text-muted)] mt-0.5">Open the calculator, check totals, and move forward without guesswork.</p>
            </div>
          </li>
          <li class="flex gap-4">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--p-text)]/10 text-[var(--p-text)]">
              <UIcon name="i-lucide-receipt" class="w-6 h-6" />
            </div>
            <div>
              <p class="text-lg font-bold">Land in the right place</p>
              <p class="text-base text-[var(--p-text-muted)] mt-0.5">Clients go to drafts, staff go to their workspace, and shop owners keep their dashboard flow.</p>
            </div>
          </li>
          <li class="flex gap-4">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--p-text)]/10 text-[var(--p-text)]">
              <UIcon name="i-lucide-clipboard-list" class="w-6 h-6" />
            </div>
            <div>
              <p class="text-lg font-bold">Handle quotes clearly</p>
              <p class="text-base text-[var(--p-text-muted)] mt-0.5">Track pending, modified, accepted, and rejected work from one sign-in.</p>
            </div>
          </li>
          <li class="flex gap-4">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--p-text)]/10 text-[var(--p-text)]">
              <UIcon name="i-lucide-store" class="w-6 h-6" />
            </div>
            <div>
              <p class="text-lg font-bold">Keep shop setup intact</p>
              <p class="text-base text-[var(--p-text-muted)] mt-0.5">Shop owners without a shop still continue through the correct setup path after sign-in.</p>
            </div>
          </li>
        </ul>
      </aside>
    </div>
  </div>
</template>
