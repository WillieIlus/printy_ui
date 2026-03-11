<template>
  <div class="min-h-screen bg-amber-50/80 dark:bg-stone-950 flex flex-col">
    <!-- Header -->
    <header class="sticky top-0 z-30 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200 dark:border-stone-800">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between gap-4">
          <NuxtLink to="/" class="flex items-center gap-3 no-underline">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <PackageIcon class="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-stone-800 dark:text-stone-100">Printy</h1>
              <p class="text-xs text-stone-500 dark:text-stone-400">Print Shop Quoting</p>
            </div>
          </NuxtLink>

          <button
            @click="drawerOpen = true"
            class="relative inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-medium text-sm transition-colors shadow-md shadow-amber-500/20"
          >
            <ShoppingCartIcon class="h-5 w-5" />
            <span class="hidden sm:inline">Quote Draft</span>
            <span
              v-if="quoteStore.itemCount > 0"
              class="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center ring-2 ring-white dark:ring-stone-900"
            >
              {{ quoteStore.itemCount }}
            </span>
          </button>
        </div>
      </div>
    </header>

    <!-- Main -->
    <main class="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t border-stone-200 dark:border-stone-800 bg-white/60 dark:bg-stone-900/60 backdrop-blur-sm mt-auto">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-sm text-stone-500 dark:text-stone-400">
          © 2025 Printy — Print Shop Quoting Platform
        </p>
        <div class="flex gap-4 text-sm text-stone-400 dark:text-stone-500">
          <span class="hover:text-stone-600 dark:hover:text-stone-300 cursor-pointer">About</span>
          <span class="hover:text-stone-600 dark:hover:text-stone-300 cursor-pointer">Help</span>
          <span class="hover:text-stone-600 dark:hover:text-stone-300 cursor-pointer">Contact</span>
        </div>
      </div>
    </footer>

    <!-- Quote Drawer -->
    <QuoteDrawer v-model="drawerOpen" />
  </div>
</template>

<script setup lang="ts">
import { Package as PackageIcon, ShoppingCart as ShoppingCartIcon } from 'lucide-vue-next'
import { useQuoteStore } from '~/stores/quote'

const quoteStore = useQuoteStore()
const drawerOpen = ref(false)
</script>
