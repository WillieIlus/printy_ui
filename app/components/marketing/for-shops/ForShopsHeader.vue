<!-- Purpose: Dedicated navigation header for the shop-owner marketing page. -->
<template>
  <header class="sticky top-0 z-50 border-b border-[#f2d3c8] bg-[#fffaf7]/95 backdrop-blur">
    <div class="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 md:px-6 lg:flex-row lg:items-center lg:justify-between">
      <NuxtLink to="/" class="flex items-center gap-3 text-[#101828] transition-opacity hover:opacity-90" aria-label="Printy home">
        <div class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl bg-[#e13515] shadow-[0_12px_28px_-18px_rgba(225,53,21,0.8)]">
          <img
            src="/assets/logo-mark/light/printy-logo-mark-01.svg"
            alt=""
            class="h-full w-full object-cover"
          >
        </div>
        <img
          src="/assets/word-mark/dark/printy-word-mark-03.svg"
          alt="Printy"
          class="h-5 w-auto"
        >
      </NuxtLink>

      <nav class="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-2">
        <div class="flex flex-wrap items-center gap-2 text-sm font-medium text-[#667085]">
          <a
            v-for="item in navItems"
            :key="item.href"
            :href="item.href"
            class="rounded-full px-3 py-2 transition hover:bg-white hover:text-[#101828]"
          >
            {{ item.label }}
          </a>
        </div>

        <div class="flex flex-wrap items-center gap-2 lg:justify-end">
          <BaseButton to="/auth/login" variant="ghost" size="sm" class="text-[#101828]">
            Log in
          </BaseButton>
          <BaseButton to="#join-early" variant="primary" size="sm" class="bg-[#e13515] hover:bg-[#bd2d12] focus-visible:outline-[#e13515]">
            Join early shops
          </BaseButton>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import BaseButton from '~/components/ui/BaseButton.vue'

const navItems = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Benefits', href: '#benefits' },
  { label: 'FAQ', href: '#faq' },
]
</script>
