<!-- AppFooter.vue — Products, Locations, Shops, Legal -->
<template>
  <footer class="relative overflow-hidden bg-[#101828] py-12 text-gray-300 sm:py-16" style="font-family: var(--font-body);">
    <div class="pointer-events-none absolute inset-0 opacity-70">
      <div class="absolute left-[8%] top-10 h-2 w-2 rounded-full bg-flamingo-500/70" />
      <div class="absolute left-[18%] top-24 h-1.5 w-1.5 rounded-full bg-flamingo-400/60" />
      <div class="absolute left-[72%] top-16 h-2 w-2 rounded-full bg-flamingo-500/55" />
      <div class="absolute right-[12%] top-28 h-1.5 w-1.5 rounded-full bg-flamingo-300/55" />
      <div class="absolute bottom-20 left-[14%] h-1.5 w-1.5 rounded-full bg-flamingo-500/50" />
      <div class="absolute bottom-12 left-[48%] h-2 w-2 rounded-full bg-flamingo-400/45" />
      <div class="absolute bottom-24 right-[22%] h-1.5 w-1.5 rounded-full bg-flamingo-500/55" />
      <div class="absolute bottom-10 right-[8%] h-2 w-2 rounded-full bg-flamingo-400/40" />
    </div>

    <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mb-10">
        <HomeFooterLinks />
      </div>

      <div class="flex flex-col items-center justify-between gap-4 border-t border-gray-700 pt-8 sm:flex-row">
        <div class="flex items-center gap-3">
          <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg overflow-hidden bg-flamingo-600">
            <CommonPrintyLogoMark img-class="h-4 w-4" />
          </div>
          <span class="text-sm">© <ClientOnly>{{ new Date().getFullYear() }}<template #fallback>2025</template></ClientOnly> Printy</span>
        </div>
        <div class="flex items-center gap-6 text-sm">
          <NuxtLink to="/privacy" class="transition-colors hover:text-white">Privacy</NuxtLink>
          <NuxtLink to="/terms" class="transition-colors hover:text-white">Terms</NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>
