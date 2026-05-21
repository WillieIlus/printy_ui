<template>
  <div class="min-h-screen bg-[#f2f4f7] font-sans antialiased text-[#101828]">
    <header class="sticky top-0 z-30 border-b border-[#e4e7ec] bg-white shadow-sm">
      <div class="mx-auto flex max-w-4xl items-center justify-between gap-4 px-5 py-3.5">
        <NuxtLink to="/" class="flex shrink-0 items-center gap-2">
          <div class="flex h-7 w-7 items-center justify-center rounded-md bg-[#e13515]">
            <svg class="h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <rect x="3" y="3" width="7" height="7" rx="1.2" />
              <rect x="14" y="3" width="7" height="7" rx="1.2" />
              <rect x="3" y="14" width="7" height="7" rx="1.2" />
              <rect x="14" y="14" width="7" height="7" rx="1.2" />
            </svg>
          </div>
          <span class="text-[17px] font-bold tracking-tight text-[#101828]">Printy</span>
        </NuxtLink>

        <div class="hidden items-center gap-2 sm:flex">
          <svg class="h-3.5 w-3.5 text-[#667085]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          <span class="text-[12.5px] font-medium text-[#667085]">Secure job tracking</span>
        </div>

        <NuxtLink to="/auth/login" class="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[#d0d5dd] px-3.5 py-1.5 text-[13px] font-semibold text-[#344054] transition-colors hover:bg-[#f9fafb]">
          <svg class="h-3.5 w-3.5 text-[#667085]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
          Sign in
        </NuxtLink>
      </div>
    </header>

    <main class="px-4 py-8 md:px-6 md:py-10">
      <div class="mx-auto max-w-4xl">
        <slot />
      </div>
    </main>

    <footer class="mx-auto mt-2 max-w-4xl px-5 py-8">
      <div class="flex flex-col items-center justify-between gap-3 sm:flex-row">
        <div class="flex items-center gap-2">
          <div class="flex h-5 w-5 items-center justify-center rounded bg-[#e13515]">
            <svg class="h-2.5 w-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <rect x="3" y="3" width="7" height="7" rx="1.2" />
              <rect x="14" y="3" width="7" height="7" rx="1.2" />
              <rect x="3" y="14" width="7" height="7" rx="1.2" />
              <rect x="14" y="14" width="7" height="7" rx="1.2" />
            </svg>
          </div>
          <span class="text-[13px] font-semibold text-[#667085]">Printy</span>
          <span class="text-[#d0d5dd]">&middot;</span>
          <span class="text-[12px] text-[#98a2b3]">&copy; 2026</span>
        </div>
        <div class="flex items-center gap-4">
          <NuxtLink to="/" class="text-[12px] text-[#98a2b3] transition-colors hover:text-[#667085]">Privacy</NuxtLink>
          <span class="text-[#d0d5dd]">&middot;</span>
          <NuxtLink to="/" class="text-[12px] text-[#98a2b3] transition-colors hover:text-[#667085]">Terms</NuxtLink>
          <span class="text-[#d0d5dd]">&middot;</span>
          <NuxtLink to="/track-job" class="text-[12px] text-[#98a2b3] transition-colors hover:text-[#667085]">Help</NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
</script>
