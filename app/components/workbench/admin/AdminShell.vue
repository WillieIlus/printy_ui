<template>
  <div class="mx-auto w-full max-w-[1280px] px-4 pb-24 pt-6 sm:px-6">
    <div class="flex flex-wrap items-center gap-x-4 gap-y-3 border-b pb-3" :style="{ borderColor: 'var(--line)' }">
      <button
        type="button"
        class="press-key inline-flex items-center gap-2 rounded-full border px-3 py-2 font-mono2 text-[9.5px] font-semibold uppercase tracking-[0.14em] lg:hidden"
        :style="{ borderColor: 'var(--line)', color: 'var(--sub)' }"
        aria-label="Open admin navigation"
        @click="navOpen = true"
      >
        <Menu :size="14" /> Sections
      </button>

      <Breadcrumbs :items="crumbs" />

      <div class="ml-auto flex items-center gap-2">
        <span
          class="hidden items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono2 text-[9px] uppercase tracking-[0.14em] text-[var(--sub)] sm:inline-flex"
          :style="{ borderColor: 'var(--line)' }"
        >
          <span class="h-1.5 w-1.5 animate-pulse rounded-full" style="background: #2FBF71" />
          live · {{ counts.shops }} shops · {{ counts.managed_jobs }} jobs
        </span>
        <button
          type="button"
          class="press-key inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono2 text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--sub)] disabled:opacity-50"
          :style="{ borderColor: 'var(--line)' }"
          :disabled="busy"
          @click="refresh()"
        >
          <Loader2 v-if="busy" :size="11" class="animate-spin" />
          <RefreshCw v-else :size="11" />
          refresh
        </button>
      </div>
    </div>

    <p v-if="loadError" class="mt-4 rounded-xl border px-4 py-3 text-[12px]" :style="{ borderColor: 'rgba(200,30,68,.45)', background: 'rgba(200,30,68,.1)', color: '#C81E44' }">
      {{ loadError }}
    </p>

    <div class="lg:grid lg:grid-cols-[222px_minmax(0,1fr)] lg:gap-9">
      <AdminSidebar :open="navOpen" :groups="groups" :is-active="isActive" @close="navOpen = false" />

      <div class="min-w-0 pt-6 lg:pt-7">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { Loader2, Menu, RefreshCw } from 'lucide-vue-next'

const route = useRoute()
const navOpen = ref(false)
const { admins, groups, crumbs, busy, loadError, isActive, refresh, hydrate, counts } = useAdminNav()

onMounted(() => {
  hydrate()
})

watch(
  () => route.path,
  () => {
    navOpen.value = false
    admins.clearFocus()
  },
)
</script>