<!-- Purpose: Shared site footer — logo, nav links, copyright. -->
<template>
  <footer class="bg-gray-900 border-t border-gray-800 py-8">
    <div class="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <NuxtLink to="/" class="flex items-center gap-2 transition-opacity hover:opacity-90">
        <div class="flex h-7 w-7 items-center justify-center overflow-hidden rounded-lg bg-[#e13515]">
          <img src="/assets/logo-mark/light/printy-logo-mark-01.svg" alt="" class="h-full w-full object-cover" />
        </div>
        <img src="/assets/word-mark/light/printy-word-mark-03.svg" alt="Printy" class="h-4 w-auto" />
        <span class="text-gray-500 text-sm ml-1">Built for Kenyan print shops.</span>
      </NuxtLink>
      <div class="flex gap-5 text-sm text-gray-500">
        <NuxtLink to="/for-shops" class="hover:text-white transition-colors">For shop owners</NuxtLink>
        <NuxtLink to="/auth/login" class="hover:text-white transition-colors">Login</NuxtLink>
      </div>
      <p class="text-gray-600 text-xs">© 2026 Printy. All rights reserved.</p>
    </div>
  </footer>
</template>
