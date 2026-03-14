<!-- AppFooter.vue — Site footer with Printy branding (Mirage-950) -->
<template>
  <footer class="bg-[#101828] py-12 text-gray-300 sm:py-16" style="font-family: var(--font-body);">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mb-12 grid grid-cols-2 gap-8 md:grid-cols-5">
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

        <!-- Products -->
        <div>
          <h4 class="mb-4 font-semibold text-white">Products</h4>
          <ul class="space-y-3 text-sm">
            <li><NuxtLink to="/shops" class="transition-colors hover:text-white">Shops</NuxtLink></li>
            <li><NuxtLink to="/products" class="transition-colors hover:text-white">All products</NuxtLink></li>
            <li><NuxtLink to="/products/business-cards" class="transition-colors hover:text-white">Business Cards</NuxtLink></li>
            <li><NuxtLink to="/products/flyers" class="transition-colors hover:text-white">Flyers</NuxtLink></li>
            <li><NuxtLink to="/products/posters" class="transition-colors hover:text-white">Posters</NuxtLink></li>
            <li><NuxtLink to="/gallery" class="transition-colors hover:text-white">Templates</NuxtLink></li>
          </ul>
        </div>

        <!-- Locations -->
        <div>
          <h4 class="mb-4 font-semibold text-white">Locations</h4>
          <ul class="space-y-3 text-sm">
            <li><NuxtLink to="/locations" class="transition-colors hover:text-white">All locations</NuxtLink></li>
            <li><NuxtLink to="/locations/nairobi" class="transition-colors hover:text-white">Nairobi</NuxtLink></li>
            <li><NuxtLink to="/locations/mombasa" class="transition-colors hover:text-white">Mombasa</NuxtLink></li>
            <li><NuxtLink to="/locations/westlands" class="transition-colors hover:text-white">Westlands</NuxtLink></li>
            <li><NuxtLink to="/locations/kilimani" class="transition-colors hover:text-white">Kilimani</NuxtLink></li>
          </ul>
        </div>

        <!-- Company -->
        <div>
          <h4 class="mb-4 font-semibold text-white">Company</h4>
          <ul class="space-y-3 text-sm">
            <li><NuxtLink to="/about" class="transition-colors hover:text-white">About</NuxtLink></li>
            <li><NuxtLink to="/#how-it-works" class="transition-colors hover:text-white">How it works</NuxtLink></li>
            <li><NuxtLink to="/#models" class="transition-colors hover:text-white">Pricing demo</NuxtLink></li>
            <li><NuxtLink to="/terms" class="transition-colors hover:text-white">Terms of Service</NuxtLink></li>
            <li><NuxtLink to="/privacy" class="transition-colors hover:text-white">Privacy Policy</NuxtLink></li>
          </ul>
        </div>

        <!-- Support -->
        <div>
          <h4 class="mb-4 font-semibold text-white">Support</h4>
          <ul class="space-y-3 text-sm">
            <li><NuxtLink to="/help" class="transition-colors hover:text-white">Help Center</NuxtLink></li>
            <li><NuxtLink to="/quote-draft" class="transition-colors hover:text-white">Your Quote</NuxtLink></li>
            <li><NuxtLink to="/quotes" class="transition-colors hover:text-white">My Quotes</NuxtLink></li>
            <li><NuxtLink to="/me/favorites" class="transition-colors hover:text-white">Saved Shops</NuxtLink></li>
            <li><NuxtLink to="/dashboard" class="transition-colors hover:text-white">Dashboard</NuxtLink></li>
          </ul>
        </div>
      </div>

      <!-- Popular searches (location + product) -->
      <div class="mb-8 flex flex-wrap gap-3 border-t border-gray-700 pt-8">
        <span class="w-full text-xs font-medium text-gray-500 sm:w-auto">Popular:</span>
        <NuxtLink to="/locations/nairobi/products/business-cards" class="text-sm transition-colors hover:text-white">Business cards Nairobi</NuxtLink>
        <NuxtLink to="/locations/nairobi/products/flyers" class="text-sm transition-colors hover:text-white">Flyers Nairobi</NuxtLink>
        <NuxtLink to="/locations/nairobi/products/posters" class="text-sm transition-colors hover:text-white">Posters Nairobi</NuxtLink>
        <NuxtLink to="/locations/mombasa/products/business-cards" class="text-sm transition-colors hover:text-white">Business cards Mombasa</NuxtLink>
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
