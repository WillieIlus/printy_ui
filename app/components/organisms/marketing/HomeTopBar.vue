<!-- Purpose: Marketing site top bar – logo, nav links, and auth CTAs. Sticks on scroll. -->
<template>
  <header
    :class="[
      'sticky top-0 z-50 transition-all w-full border-b backdrop-blur-md',
      scrolled
        ? 'border-[var(--p-border)] bg-[var(--p-surface)]/95 shadow-sm'
        : 'border-transparent bg-[var(--p-bg)]/80',
    ]"
  >
    <div class="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-4 md:px-6">
      <NuxtLink to="/" class="flex items-center gap-2.5 transition-opacity hover:opacity-90" aria-label="Printy home">
        <div class="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-[#e13515] sm:h-9 sm:w-9">
          <ClientOnly>
            <img
              :src="isDark
                ? '/assets/logo-mark/dark/printy-logo-mark-01.svg'
                : '/assets/logo-mark/light/printy-logo-mark-01.svg'"
              alt=""
              class="h-full w-full object-cover"
            />
            <template #fallback>
              <img src="/assets/logo-mark/light/printy-logo-mark-01.svg" alt="" class="h-full w-full object-cover" />
            </template>
          </ClientOnly>
        </div>
        <ClientOnly>
          <img
            :src="isDark
              ? '/assets/word-mark/light/printy-word-mark-03.svg'
              : '/assets/word-mark/dark/printy-word-mark-03.svg'"
            alt="Printy"
            class="hidden h-4 w-auto sm:block sm:h-5"
          />
          <template #fallback>
            <img src="/assets/word-mark/dark/printy-word-mark-03.svg" alt="Printy" class="hidden h-4 w-auto sm:block sm:h-5" />
          </template>
        </ClientOnly>
      </NuxtLink>

      <nav class="hidden items-center gap-8 lg:flex">
        <slot name="nav">
          <NuxtLink
            :to="ROUTES.home"
            class="text-sm font-medium text-[var(--p-text-muted)] transition-colors hover:text-[var(--p-primary)]"
          >
            Get Quote
          </NuxtLink>
          <NuxtLink
            :to="ROUTES.trackJob"
            class="text-sm font-medium text-[var(--p-text-muted)] transition-colors hover:text-[var(--p-primary)]"
          >
            Track Job
          </NuxtLink>
          <NuxtLink
            :to="ROUTES.forPartners"
            class="text-sm font-medium text-[var(--p-text-muted)] transition-colors hover:text-[var(--p-primary)]"
          >
            For Partners
          </NuxtLink>
          <NuxtLink
            :to="ROUTES.forShops"
            class="text-sm font-medium text-[var(--p-text-muted)] transition-colors hover:text-[var(--p-primary)]"
          >
            For Production Shops
          </NuxtLink>
        </slot>
      </nav>

      <div class="flex items-center gap-2 sm:gap-4">
        <div class="hidden md:block">
          <ThemeModeToggle />
        </div>
        <div class="flex items-center gap-1.5 sm:gap-2">
          <slot name="actions">
            <BaseButton :to="ROUTES.shopLogin" variant="ghost" size="sm" class="px-2 sm:px-3">Sign in</BaseButton>
            <BaseButton :to="buildClientSignupRoute()" variant="primary" size="sm" class="px-3 font-medium sm:px-4">
              <span class="hidden sm:inline">Create account</span>
              <span class="sm:hidden">Join</span>
            </BaseButton>
          </slot>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import ThemeModeToggle from '~/components/molecules/ThemeModeToggle.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import { ROUTES, buildClientSignupRoute } from '~/shared/routes'

const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')
const scrolled = ref(false)

onMounted(() => {
  const handler = () => { scrolled.value = window.scrollY > 8 }
  window.addEventListener('scroll', handler, { passive: true })
  onUnmounted(() => window.removeEventListener('scroll', handler))
})
</script>
