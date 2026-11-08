<script setup lang="ts">
import DesignWordmark from '../layout/Wordmark.vue'
</script>

<template>
  <div class="design-root design-auth-root flex min-h-screen flex-col bg-paper text-ink">
    <header class="border-b border-line bg-paper/90">
      <div class="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-4 sm:px-8">
        <DesignWordmark />
        <NuxtLink
          to="/"
          class="font-mono text-[10px] tracking-[0.14em] text-ink-3 uppercase transition-colors hover:text-brand"
        >
          Back to printy.ke
        </NuxtLink>
      </div>
    </header>

    <main class="paper-noise relative flex-1">
      <slot />
    </main>

    <footer class="border-t border-line bg-paper-2/50">
      <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-5 py-4 font-mono text-[10px] tracking-[0.14em] text-ink-3 uppercase sm:px-8">
        <span>Secure JWT session</span>
        <span>Escrow-protected jobs - Nairobi</span>
      </div>
    </footer>
  </div>
</template>
