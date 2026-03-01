<!-- AppFooter.vue — Site footer with flamingo branding -->
<template>
  <footer class="bg-gray-900 py-12 text-gray-400 sm:py-16">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mb-12 grid grid-cols-2 gap-8 md:grid-cols-4">
        <!-- Brand -->
        <div class="col-span-2 md:col-span-1">
          <div class="mb-4 flex items-center gap-2">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-flamingo-500 to-flamingo-700">
              <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
            </div>
            <span class="text-xl font-bold text-white">Printy</span>
          </div>
          <p class="text-sm leading-relaxed">
            The intelligent quoting and pricing engine for modern print shops. Not a marketplace — a pricing brain.
          </p>
        </div>

        <!-- Product -->
        <div>
          <h4 class="mb-4 font-semibold text-white">Product</h4>
          <ul class="space-y-3 text-sm">
            <li><NuxtLink to="/dashboard" class="transition-colors hover:text-white">Dashboard</NuxtLink></li>
            <li><NuxtLink to="/shops" class="transition-colors hover:text-white">Shops</NuxtLink></li>
            <li><NuxtLink to="/templates" class="transition-colors hover:text-white">Templates</NuxtLink></li>
            <li><NuxtLink to="/quotes" class="transition-colors hover:text-white">Quotes</NuxtLink></li>
          </ul>
        </div>

        <!-- Company -->
        <div>
          <h4 class="mb-4 font-semibold text-white">Company</h4>
          <ul class="space-y-3 text-sm">
            <li><a href="#" class="transition-colors hover:text-white">About</a></li>
            <li><a href="#" class="transition-colors hover:text-white">Blog</a></li>
            <li><a href="#" class="transition-colors hover:text-white">Careers</a></li>
            <li><a href="#" class="transition-colors hover:text-white">Contact</a></li>
          </ul>
        </div>

        <!-- Support -->
        <div>
          <h4 class="mb-4 font-semibold text-white">Support</h4>
          <ul class="space-y-3 text-sm">
            <li><a href="#" class="transition-colors hover:text-white">Help Center</a></li>
            <li><a href="#" class="transition-colors hover:text-white">Documentation</a></li>
            <li><a href="#" class="transition-colors hover:text-white">API Reference</a></li>
            <li><a href="#" class="transition-colors hover:text-white">FAQ</a></li>
          </ul>
        </div>
      </div>

      <div class="flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-8 sm:flex-row">
        <p class="text-sm">© 2024 <span class="font-semibold text-white">Printy</span>. All rights reserved.</p>
        <div class="flex items-center gap-6 text-sm">
          <a href="#" class="transition-colors hover:text-white">Privacy Policy</a>
          <a href="#" class="transition-colors hover:text-white">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
</template>
