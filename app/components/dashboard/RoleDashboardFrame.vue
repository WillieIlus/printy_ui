<template>
  <div class="bg-slate-50 text-slate-800 antialiased font-sans min-h-screen flex flex-col">
    <DashboardTopbar tone="light">
      <button
        type="button"
        class="inline-flex lg:hidden items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-600 shadow-sm"
        aria-label="Toggle dashboard navigation"
        :aria-expanded="mobileNavOpen ? 'true' : 'false'"
        @click="mobileNavOpen = !mobileNavOpen"
      >
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      <PrintyLogo variant="full" size="md" to="/" />

      <div class="hidden lg:flex items-center gap-2 ml-4 text-sm text-slate-400">
        <span>{{ breadcrumbRoot }}</span>
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span class="text-slate-700 font-medium">{{ title }}</span>
      </div>

      <div class="hidden lg:flex items-center gap-3 ml-auto">
        <div class="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
          {{ badge }}
        </div>
        <div class="flex items-center gap-2.5 pl-3 border-l border-slate-200">
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style="background:#101828;">{{ initials }}</div>
          <div class="text-sm">
            <p class="font-semibold text-slate-800 leading-none">{{ name }}</p>
            <p class="text-slate-400 text-xs mt-0.5">{{ subtitle }}</p>
          </div>
          <button type="button" class="flex items-center" @click="$emit('logout')">
            <svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    </DashboardTopbar>

    <div class="flex flex-1 overflow-hidden">
      <Transition
        enter-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <button
          v-if="mobileNavOpen"
          type="button"
          class="fixed inset-0 z-30 bg-slate-950/35 lg:hidden"
          aria-label="Close dashboard navigation"
          @click="mobileNavOpen = false"
        />
      </Transition>

      <DashboardSidebar
        tone="light"
        class="relative z-40"
        :class="mobileNavOpen ? 'flex' : 'hidden'"
      >
        <nav class="flex-1 px-3 py-5 space-y-0.5">
          <p class="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Workspace</p>
          <NuxtLink
            v-for="item in navItems"
            :key="item.label"
            :to="item.disabled ? undefined : item.to"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
            :class="item.disabled
              ? 'cursor-not-allowed bg-slate-50 text-slate-300'
              : item.active
                ? 'bg-[#fdf1ee] text-[#e13515] font-semibold'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'"
            :aria-disabled="item.disabled ? 'true' : undefined"
            @click="handleNavClick(item.disabled)"
          >
            <span v-if="item.icon" v-html="item.icon"></span>
            {{ item.label }}
          </NuxtLink>
        </nav>

        <div class="p-4 border-t border-slate-100">
          <div class="bg-slate-50 rounded-xl p-3">
            <p class="text-xs font-bold text-slate-700 mb-0.5">{{ supportTitle }}</p>
            <p class="text-xs text-slate-400 leading-relaxed">{{ supportCopy }}</p>
            <NuxtLink :to="supportTo" class="mt-2.5 w-full inline-flex items-center justify-center text-xs font-bold text-white py-2 rounded-lg transition-colors" style="background:#e13515;" @click="mobileNavOpen = false">
              {{ supportAction }}
            </NuxtLink>
          </div>
        </div>
      </DashboardSidebar>

      <main class="relative z-0 min-w-0 flex-1 overflow-y-auto">
        <div class="max-w-7xl mx-auto px-4 lg:px-8 py-7 space-y-7">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import DashboardSidebar from '~/components/layout/DashboardSidebar.vue'
import DashboardTopbar from '~/components/layout/DashboardTopbar.vue'
import PrintyLogo from '~/components/printy/PrintyLogo.vue'

defineEmits<{
  logout: []
}>()

defineProps<{
  title: string
  badge: string
  name: string
  initials: string
  subtitle: string
  breadcrumbRoot: string
  navItems: Array<{ label: string, to: string, active?: boolean, icon?: string, disabled?: boolean }>
  supportTitle: string
  supportCopy: string
  supportAction: string
  supportTo: string
}>()

const mobileNavOpen = ref(false)

function handleNavClick(disabled?: boolean) {
  if (disabled) {
    return
  }
  mobileNavOpen.value = false
}
</script>
