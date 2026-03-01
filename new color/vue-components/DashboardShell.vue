<!-- DashboardShell.vue — Main dashboard layout -->
<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <!-- Top Navbar -->
    <AppNavbar :is-logged-in="true" :user-name="userName" :user-initials="userInitials" />

    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <!-- Page Header -->
      <div class="mb-8 rounded-2xl border border-gray-100 bg-white/70 p-6 shadow-sm ring-1 ring-gray-100/60 backdrop-blur">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              <slot name="title">Dashboard</slot>
            </h1>
            <p class="mt-1 text-sm text-gray-500">
              <slot name="subtitle">Welcome back! Here's an overview of your print shops.</slot>
            </p>
          </div>

          <div class="flex items-center gap-3">
            <slot name="actions" />
          </div>
        </div>
      </div>

      <!-- Stats Cards Row -->
      <div v-if="showStats" class="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm ring-1 ring-gray-100/50 transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          <!-- subtle hover glow -->
          <div class="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
            <div class="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-flamingo-100/60 blur-2xl"></div>
            <div class="absolute -left-10 -bottom-10 h-20 w-20 rounded-full bg-gray-100/60 blur-2xl"></div>
          </div>

          <div class="relative flex items-center justify-between">
            <div
              class="flex h-11 w-11 items-center justify-center rounded-2xl ring-1 ring-inset"
              :class="stat.bgColor || 'bg-flamingo-50 ring-flamingo-100'"
            >
              <component
                :is="stat.iconComponent"
                v-if="stat.iconComponent"
                class="h-5 w-5"
                :class="stat.iconColor || 'text-flamingo-600'"
              />
              <svg
                v-else
                class="h-5 w-5"
                :class="stat.iconColor || 'text-flamingo-600'"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" :d="stat.icon" />
              </svg>
            </div>

            <span
              v-if="stat.trend"
              class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset"
              :class="stat.trendUp
                ? 'bg-green-50 text-green-700 ring-green-200'
                : 'bg-red-50 text-red-700 ring-red-200'"
            >
              <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  :d="stat.trendUp
                    ? 'M5 10l7-7m0 0l7 7m-7-7v18'
                    : 'M19 14l-7 7m0 0l-7-7m7 7V3'"
                />
              </svg>
              {{ stat.trend }}
            </span>
          </div>

          <div class="relative mt-3">
            <div class="text-2xl font-bold text-gray-900">{{ stat.value }}</div>
            <div class="mt-0.5 text-sm text-gray-500">{{ stat.label }}</div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
interface StatItem {
  label: string
  value: string
  icon: string
  bgColor?: string
  iconColor?: string
  trend?: string
  trendUp?: boolean
  iconComponent?: any
}

withDefaults(
  defineProps<{
    userName?: string
    userInitials?: string
    showStats?: boolean
    stats?: StatItem[]
  }>(),
  {
    userName: 'John D.',
    userInitials: 'JD',
    showStats: true,
    stats: () => [
      {
        label: 'Active Shops',
        value: '3',
        icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
        bgColor: 'bg-flamingo-50 ring-flamingo-100',
        iconColor: 'text-flamingo-600',
        trend: '+1',
        trendUp: true,
      },
      {
        label: 'Quotes This Month',
        value: '47',
        icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
        bgColor: 'bg-blue-50 ring-blue-100',
        iconColor: 'text-blue-600',
        trend: '+12%',
        trendUp: true,
      },
      {
        label: 'Total Revenue',
        value: 'KES 284K',
        icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
        bgColor: 'bg-green-50 ring-green-100',
        iconColor: 'text-green-600',
        trend: '+8%',
        trendUp: true,
      },
      {
        label: 'Templates',
        value: '12',
        icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z',
        bgColor: 'bg-purple-50 ring-purple-100',
        iconColor: 'text-purple-600',
      },
    ],
  }
)
</script>
