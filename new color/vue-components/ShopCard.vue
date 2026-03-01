<!-- ShopCard.vue — Dashboard shop card (flamingo design system) -->
<template>
  <div
    class="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:border-flamingo-200 hover:shadow-lg"
  >
    <!-- Header -->
    <div class="relative px-6 py-5 bg-gradient-to-r" :class="headerGradient">
      <!-- subtle shine -->
      <div class="pointer-events-none absolute inset-0 opacity-20">
        <div class="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/30 blur-2xl"></div>
        <div class="absolute -left-10 -bottom-10 h-28 w-28 rounded-full bg-white/20 blur-2xl"></div>
      </div>

      <div class="relative flex items-start justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
            <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>

          <div class="min-w-0">
            <h3 class="truncate text-lg font-bold text-white">
              {{ shop.name }}
            </h3>
            <p class="truncate text-sm text-white/80">
              {{ shop.location }}
            </p>
          </div>
        </div>

        <!-- Status -->
        <span
          class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset"
          :class="
            shop.active
              ? 'bg-green-400/20 text-green-100 ring-green-300/30'
              : 'bg-gray-400/20 text-gray-100 ring-white/15'
          "
        >
          <span class="h-1.5 w-1.5 rounded-full" :class="shop.active ? 'bg-green-300' : 'bg-gray-300'"></span>
          {{ shop.active ? 'Active' : 'Inactive' }}
        </span>
      </div>
    </div>

    <!-- Body -->
    <div class="px-6 py-5">
      <!-- Capabilities -->
      <div class="mb-4 flex flex-wrap gap-2">
        <span
          v-for="cap in shop.capabilities"
          :key="cap"
          class="rounded-full bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-200"
        >
          {{ cap }}
        </span>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-3 gap-3">
        <div class="rounded-xl bg-gray-50 p-3 text-center ring-1 ring-inset ring-gray-100">
          <div class="text-lg font-bold text-gray-900">{{ shop.machines }}</div>
          <div class="text-[11px] font-medium text-gray-500">Machines</div>
        </div>
        <div class="rounded-xl bg-gray-50 p-3 text-center ring-1 ring-inset ring-gray-100">
          <div class="text-lg font-bold text-gray-900">{{ shop.materials }}</div>
          <div class="text-[11px] font-medium text-gray-500">Materials</div>
        </div>
        <div class="rounded-xl bg-gray-50 p-3 text-center ring-1 ring-inset ring-gray-100">
          <div class="text-lg font-bold text-gray-900">{{ shop.templates }}</div>
          <div class="text-[11px] font-medium text-gray-500">Templates</div>
        </div>
      </div>

      <!-- Recent activity -->
      <div class="mt-4 flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5">
        <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="truncate text-xs text-gray-500">
          Last quote: <span class="font-medium text-gray-700">{{ shop.lastQuote }}</span>
        </span>
      </div>
    </div>

    <!-- Footer -->
    <div class="flex border-t border-gray-100">
      <NuxtLink
        :to="`/shops/${shop.id}`"
        class="flex flex-1 items-center justify-center gap-2 py-3.5 text-sm font-semibold text-flamingo-600 transition-colors hover:bg-flamingo-50"
      >
        View Details
        <svg class="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </NuxtLink>

      <div class="w-px bg-gray-100"></div>

      <NuxtLink
        :to="`/quotes/new?shop=${shop.id}`"
        class="flex flex-1 items-center justify-center gap-2 py-3.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        New Quote
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Shop {
  id: string | number
  name: string
  location: string
  active: boolean
  capabilities: string[]
  machines: number
  materials: number
  templates: number
  lastQuote: string
}

withDefaults(
  defineProps<{
    shop: Shop
    headerGradient?: string
  }>(),
  {
    headerGradient: 'from-flamingo-500 to-flamingo-700',
  }
)
</script>
