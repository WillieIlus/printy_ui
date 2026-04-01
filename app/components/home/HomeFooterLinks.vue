<template>
  <div class="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
    <div>
      <h4 class="mb-4 font-semibold text-flamingo-500">Products</h4>
      <ul class="space-y-3 text-sm text-slate-200">
        <li v-for="link in productLinks" :key="link.to">
          <NuxtLink :to="link.to" class="transition-colors hover:text-white">
            {{ link.label }}
          </NuxtLink>
        </li>
      </ul>
    </div>
    <div>
      <h4 class="mb-4 font-semibold text-flamingo-500">Locations</h4>
      <ul class="space-y-3 text-sm text-slate-200">
        <li v-for="link in locationLinks" :key="link.to">
          <NuxtLink :to="link.to" class="transition-colors hover:text-white">
            {{ link.label }}
          </NuxtLink>
        </li>
      </ul>
    </div>
    <div>
      <h4 class="mb-4 font-semibold text-flamingo-500">Shops</h4>
      <ul class="space-y-3 text-sm text-slate-200">
        <li v-for="link in shopLinks" :key="link.to">
          <NuxtLink :to="link.to" class="transition-colors hover:text-white">
            {{ link.label }}
          </NuxtLink>
        </li>
      </ul>
    </div>
    <div>
      <h4 class="mb-4 font-semibold text-flamingo-500">Legal</h4>
      <ul class="space-y-3 text-sm text-slate-200">
        <li v-for="link in legalLinks" :key="link.to">
          <NuxtLink :to="link.to" class="transition-colors hover:text-white">
            {{ link.label }}
          </NuxtLink>
        </li>
      </ul>
    </div>
    <div>
      <h4 class="mb-4 font-semibold text-flamingo-500">Social</h4>
      <div class="flex flex-wrap gap-3">
        <a
          v-for="link in socialLinks"
          :key="link.href"
          :href="link.href"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/16 bg-slate-950/72 text-white transition-colors hover:border-flamingo-400/50 hover:bg-slate-900 hover:text-white"
          :aria-label="link.label"
          :title="link.label"
        >
          <UIcon :name="link.icon" class="h-4 w-4" />
        </a>
      </div>
      <p class="mt-4 text-sm leading-6 text-slate-200">
        Follow Printy for product inspiration, shop updates, and new quote workflow releases.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface FooterLink {
  to: string
  label: string
}

interface SocialLink {
  href: string
  label: string
  icon: string
}

const productLinks: FooterLink[] = [
  { to: '/products', label: 'All products' },
  { to: '/products/business-cards', label: 'Business cards' },
  { to: '/products/flyers', label: 'Flyers' },
  { to: '/products/brochures', label: 'Brochures' },
  { to: '/products/stickers', label: 'Stickers' },
  { to: '/products/banners', label: 'Banners' },
  { to: '/gallery', label: 'Gallery' },
]

const locationLinks: FooterLink[] = [
  { to: '/locations', label: 'All locations' },
  { to: '/locations/nairobi', label: 'Nairobi' },
  { to: '/locations/westlands', label: 'Westlands' },
  { to: '/locations/kilimani', label: 'Kilimani' },
  { to: '/locations/cbd', label: 'CBD' },
  { to: '/locations/mombasa', label: 'Mombasa' },
  { to: '/locations/kisumu', label: 'Kisumu' },
]

const shopLinks: FooterLink[] = [
  { to: '/shops', label: 'Browse shops' },
  { to: '/auth/signup', label: 'Add your shop' },
  { to: '/#how-it-works', label: 'How it works' },
  { to: '/help', label: 'Help' },
]

const legalLinks: FooterLink[] = [
  { to: '/terms', label: 'Terms of Service' },
  { to: '/privacy', label: 'Privacy Policy' },
]

const socialLinks: SocialLink[] = [
  { href: 'https://facebook.com/printy', label: 'Facebook', icon: 'i-simple-icons-facebook' },
  { href: 'https://instagram.com/printy', label: 'Instagram', icon: 'i-simple-icons-instagram' },
  { href: 'https://linkedin.com/in/printy', label: 'LinkedIn', icon: 'i-simple-icons-linkedin' },
]
</script>
