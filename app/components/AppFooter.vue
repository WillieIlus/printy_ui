<!-- AppFooter.vue — Products, Locations, Shops, Legal -->
<template>
  <footer class="bg-[#101828] py-12 text-gray-300 sm:py-16" style="font-family: var(--font-body);">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mb-10">
        <HomeFooterLinks />
      </div>

      <div class="flex flex-col items-center justify-between gap-4 border-t border-gray-700 pt-8 sm:flex-row">
        <div class="flex items-center gap-3">
          <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg overflow-hidden" style="background: #e13515;">
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
