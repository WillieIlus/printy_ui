<template>
  <div class="min-h-screen bg-[#f2f4f7] font-sans antialiased text-[#101828]">
    <PublicHeader />

    <main class="px-4 py-8 md:px-6 md:py-10">
      <div class="mx-auto max-w-4xl">
        <slot />
      </div>
    </main>

    <PublicFooter />
  </div>
</template>

<script setup lang="ts">
import PublicFooter from '~/components/marketing/PublicFooter.vue'
import PublicHeader from '~/components/marketing/PublicHeader.vue'
</script>
