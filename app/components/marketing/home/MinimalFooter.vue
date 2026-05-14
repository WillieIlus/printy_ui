<template>
  <footer class="border-t border-gray-800 bg-gray-900 py-8">
    <div class="mx-auto flex max-w-5xl flex-col gap-4 px-4 md:flex-row md:items-center md:justify-between">
      <NuxtLink to="/" class="flex items-center gap-2 transition-opacity hover:opacity-90">
        <div class="flex h-7 w-7 items-center justify-center overflow-hidden rounded-lg bg-[#e13515]">
          <img src="/assets/logo-mark/light/printy-logo-mark-01.svg" alt="" class="h-full w-full object-cover" />
        </div>
        <img src="/assets/word-mark/light/printy-word-mark-03.svg" alt="Printy" class="h-4 w-auto" />
        <span class="ml-1 text-sm text-gray-500">Print work, clearer.</span>
      </NuxtLink>

      <div class="flex flex-wrap gap-5 text-sm text-gray-500">
        <NuxtLink :to="ROUTES.home" class="transition-colors hover:text-white">Get Quote</NuxtLink>
        <NuxtLink :to="ROUTES.trackJob" class="transition-colors hover:text-white">Track Job</NuxtLink>
        <NuxtLink :to="ROUTES.forPartners" class="transition-colors hover:text-white">For Partners</NuxtLink>
        <NuxtLink :to="ROUTES.forShops" class="transition-colors hover:text-white">For Production Shops</NuxtLink>
        <NuxtLink :to="ROUTES.shopLogin" class="transition-colors hover:text-white">Sign in</NuxtLink>
        <NuxtLink :to="buildClientSignupRoute()" class="transition-colors hover:text-white">Create account</NuxtLink>
      </div>

      <p class="text-xs text-gray-600">&copy; {{ currentYear }} Printy. All rights reserved.</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ROUTES, buildClientSignupRoute } from '~/shared/routes'

const currentYear = new Date().getFullYear()
</script>
