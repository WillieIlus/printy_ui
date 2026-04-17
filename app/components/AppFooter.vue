<template>
  <footer class="relative overflow-hidden border-t border-white/8 bg-[#08111f] py-14 text-slate-400 sm:py-16">
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(31,53,96,0.22),transparent_40%)]" />

    <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

      <!-- Main grid: brand block + link columns -->
      <div class="grid gap-12 lg:grid-cols-[260px_1fr] lg:gap-16">

        <!-- Brand block -->
        <div>
          <NuxtLink to="/" class="inline-flex items-center gap-2.5">
            <div class="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-flamingo-600">
              <CommonPrintyLogoMark img-class="h-[18px] w-[18px]" />
            </div>
            <CommonPrintyWordmark dark-only img-class="h-[15px]" />
          </NuxtLink>

          <p class="mt-4 max-w-[220px] text-[13px] leading-6 text-slate-500">
            Kenya's print shop marketplace. Know your cost before calling any shop.
          </p>

          <div class="mt-6 flex items-center gap-2">
            <a
              v-for="link in socialLinks"
              :key="link.href"
              :href="link.href"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="link.label"
              class="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-slate-500 transition-colors hover:border-white/20 hover:text-white"
            >
              <UIcon :name="link.icon" class="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        <!-- Link columns -->
        <HomeFooterLinks />
      </div>

      <!-- Bottom bar -->
      <div class="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/8 pt-6 sm:flex-row">
        <p class="text-xs text-slate-600">
          &copy; <ClientOnly>{{ new Date().getFullYear() }}<template #fallback>2025</template></ClientOnly> Printy
        </p>
        <div class="flex items-center gap-5">
          <NuxtLink to="/privacy" class="text-xs text-slate-600 transition-colors hover:text-slate-300">Privacy</NuxtLink>
          <NuxtLink to="/terms" class="text-xs text-slate-600 transition-colors hover:text-slate-300">Terms</NuxtLink>
        </div>
      </div>

    </div>
  </footer>
</template>

<script setup lang="ts">
const socialLinks = [
  { href: 'https://facebook.com/printy', label: 'Facebook', icon: 'i-simple-icons-facebook' },
  { href: 'https://instagram.com/printy', label: 'Instagram', icon: 'i-simple-icons-instagram' },
  { href: 'https://linkedin.com/in/printy', label: 'LinkedIn', icon: 'i-simple-icons-linkedin' },
]
</script>
