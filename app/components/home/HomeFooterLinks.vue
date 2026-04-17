<template>
  <div class="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-10">

    <!-- Products -->
    <div>
      <h5 class="mb-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600">
        Products
      </h5>
      <ul class="space-y-2.5">
        <li v-for="link in productLinks" :key="link.to">
          <NuxtLink :to="link.to" class="text-[13px] text-slate-400 transition-colors hover:text-white">
            {{ link.label }}
          </NuxtLink>
        </li>
      </ul>
    </div>

    <!-- Locations -->
    <div>
      <h5 class="mb-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600">
        Locations
      </h5>
      <ul class="space-y-2.5">
        <li v-for="link in locationLinks" :key="link.to">
          <NuxtLink :to="link.to" class="text-[13px] text-slate-400 transition-colors hover:text-white">
            {{ link.label }}
          </NuxtLink>
        </li>
      </ul>
    </div>

    <!-- Platform — spans full width on mobile to avoid an orphaned single column -->
    <div class="col-span-2 sm:col-span-1">
      <h5 class="mb-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600">
        Platform
      </h5>
      <ul class="space-y-2.5">
        <li v-for="link in platformLinks" :key="link.to">
          <NuxtLink :to="link.to" class="text-[13px] text-slate-400 transition-colors hover:text-white">
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
  { to: '/gallery', label: 'Products' },
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

const platformLinks: FooterLink[] = [
  { to: '/shops', label: 'Browse shops' },
  { to: '/auth/signup?role=shop_owner', label: 'Add your shop' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/#process', label: 'Engineered for precision' },
  { to: '/help', label: 'Help' },
]
</script>
