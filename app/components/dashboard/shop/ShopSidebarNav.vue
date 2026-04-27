<!-- Purpose: Left navigation for print shop dashboard routes. -->
<template>
  <div class="space-y-6">
    <div class="space-y-2">
      <p class="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Shop operations</p>
      <h2 class="text-2xl font-semibold tracking-tight text-white">Printy Shop</h2>
      <p class="text-sm text-slate-300">Manage requests, setup progress, pricing, and profile details.</p>
    </div>
    <nav class="space-y-2">
      <NuxtLink
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        class="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10"
        active-class="bg-white/12 text-white ring-1 ring-white/10"
      >
        {{ item.label }}
      </NuxtLink>
    </nav>
  </div>
</template>

<script setup lang="ts">
const items = [
  { label: 'Overview', to: '/dashboard/shop' },
  { label: 'Requests', to: '/dashboard/shop/requests' },
  { label: 'Setup', to: '/dashboard/shop/setup' },
  { label: 'Pricing', to: '/dashboard/shop/pricing' },
  { label: 'Materials', to: '/dashboard/shop/materials' },
  { label: 'Finishing', to: '/dashboard/shop/finishing' },
  { label: 'Products', to: '/dashboard/shop/products' },
  { label: 'Profile', to: '/dashboard/shop/profile' },
]
</script>
