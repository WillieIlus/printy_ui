<!-- AppFooter.vue — Site footer with Printy branding (Mirage-950) -->
<template>
  <footer class="bg-[#101828] py-12 text-gray-300 sm:py-16" style="font-family: var(--font-body);">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mb-12 grid grid-cols-2 gap-8 md:grid-cols-4">
        <!-- Brand -->
        <div class="col-span-2 md:col-span-1">
          <div class="mb-4 flex items-center gap-3">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl overflow-hidden" style="background: #e13515;">
              <CommonPrintyLogoMark img-class="h-6 w-6" />
            </div>
            <CommonPrintyWordmark img-class="h-6 w-auto max-w-[120px]" dark-only />
          </div>
          <p class="text-sm leading-relaxed">
            Your Price, Instantly. The intelligent quoting and pricing engine for modern print shops. Not a marketplace — a pricing brain.
          </p>
        </div>

        <!-- Product -->
        <div>
          <h4 class="mb-4 font-semibold text-white">Product</h4>
          <ul class="space-y-3 text-sm">
            <li><NuxtLink to="/shops" class="transition-colors hover:text-white">Shops</NuxtLink></li>
            <li><NuxtLink to="/quote-draft" class="transition-colors hover:text-white">Your Quote</NuxtLink></li>
            <li><NuxtLink to="/quotes" class="transition-colors hover:text-white">My Quotes</NuxtLink></li>
            <li><NuxtLink to="/me/favorites" class="transition-colors hover:text-white">Saved Shops</NuxtLink></li>
            <li><NuxtLink to="/gallery" class="transition-colors hover:text-white">Templates</NuxtLink></li>
          </ul>
        </div>

        <!-- Company -->
        <div>
          <h4 class="mb-4 font-semibold text-white">Company</h4>
          <ul class="space-y-3 text-sm">
            <li><NuxtLink to="/about" class="transition-colors hover:text-white">About</NuxtLink></li>
            <li><NuxtLink to="/#problem" class="transition-colors hover:text-white">Problem</NuxtLink></li>
            <li><NuxtLink to="/#models" class="transition-colors hover:text-white">Pricing Models</NuxtLink></li>
            <li><NuxtLink to="/terms" class="transition-colors hover:text-white">Terms of Service</NuxtLink></li>
            <li><NuxtLink to="/privacy" class="transition-colors hover:text-white">Privacy Policy</NuxtLink></li>
          </ul>
        </div>

        <!-- Support -->
        <div>
          <h4 class="mb-4 font-semibold text-white">Support</h4>
          <ul class="space-y-3 text-sm">
            <li><NuxtLink to="/help" class="transition-colors hover:text-white">Help Center</NuxtLink></li>
            <li><NuxtLink to="/dashboard" class="transition-colors hover:text-white">Dashboard</NuxtLink></li>
          </ul>
        </div>
      </div>

      <div class="flex flex-col items-center justify-between gap-4 border-t border-gray-700 pt-8 sm:flex-row">
        <p class="text-sm">© <ClientOnly>{{ new Date().getFullYear() }}<template #fallback>2025</template></ClientOnly> Printy. All rights reserved.</p>
        <div class="flex items-center gap-6 text-sm">
          <NuxtLink to="/privacy" class="transition-colors hover:text-white">Privacy Policy</NuxtLink>
          <NuxtLink to="/terms" class="transition-colors hover:text-white">Terms of Service</NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>
