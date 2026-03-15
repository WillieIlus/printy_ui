<template>
  <div class="grid grid-cols-2 gap-8 sm:grid-cols-4">
    <div>
      <h4 class="mb-4 font-semibold text-white">Products</h4>
      <ul class="space-y-3 text-sm text-gray-300">
        <li v-for="link in productLinks" :key="link.to">
          <NuxtLink :to="link.to" class="transition-colors hover:text-white">
            {{ link.label }}
          </NuxtLink>
        </li>
      </ul>
    </div>
    <div>
      <h4 class="mb-4 font-semibold text-white">Locations</h4>
      <ul class="space-y-3 text-sm text-gray-300">
        <li v-for="link in locationLinks" :key="link.to">
          <NuxtLink :to="link.to" class="transition-colors hover:text-white">
            {{ link.label }}
          </NuxtLink>
        </li>
      </ul>
    </div>
    <div>
      <h4 class="mb-4 font-semibold text-white">Shops</h4>
      <ul class="space-y-3 text-sm text-gray-300">
        <li v-for="link in shopLinks" :key="link.to">
          <NuxtLink :to="link.to" class="transition-colors hover:text-white">
            {{ link.label }}
          </NuxtLink>
        </li>
      </ul>
    </div>
    <div>
      <h4 class="mb-4 font-semibold text-white">Legal</h4>
      <ul class="space-y-3 text-sm text-gray-300">
        <li v-for="link in legalLinks" :key="link.to">
          <NuxtLink :to="link.to" class="transition-colors hover:text-white">
            {{ link.label }}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
interface FooterLink {
  to: string
  label: string
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
</script>
