<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { getIcon } from '~/utils/design/icon-registry'
import { useAdminNav } from '~/composables/useAdminNav'

/**
 * Admin workspace frame. Replaces the legacy AdminShell chrome with the design
 * shell supplied by design-workspace, while preserving the old shell's
 * behaviour: hydrate the admin/workflow stores, refresh on demand, clear the
 * drill-down focus on navigation and show the existing load error.
 */
const route = useRoute()
const { admins, crumbs, counts, busy, loadError, refresh, hydrate } = useAdminNav()

const spinner = getIcon('Loader2')
const refreshIcon = getIcon('RotateCcw')

onMounted(() => {
  hydrate()
})

watch(
  () => route.path,
  () => {
    admins.clearFocus()
  },
)
</script>

<template>
  <div data-test="admin-frame" class="flex flex-col gap-6">
    <div class="flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-line pb-3">
      <nav aria-label="Breadcrumb" class="flex flex-wrap items-center gap-1.5 font-mono text-[9.5px] tracking-[0.12em] text-ink-3 uppercase">
        <template v-for="(crumb, index) in crumbs" :key="`${crumb.label}-${index}`">
          <span v-if="index > 0" aria-hidden="true" class="text-line-strong">/</span>
          <NuxtLink v-if="crumb.to" :to="crumb.to" class="transition-colors hover:text-brand">{{ crumb.label }}</NuxtLink>
          <span v-else class="text-ink-2">{{ crumb.label }}</span>
        </template>
      </nav>

      <div class="ml-auto flex items-center gap-2">
        <span class="hidden items-center gap-1.5 rounded-full border border-line bg-card px-3 py-1.5 font-mono text-[9px] tracking-[0.12em] text-ink-3 uppercase sm:inline-flex">
          <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-ontrack" />
          live · {{ counts.shops }} shops · {{ counts.managed_jobs }} jobs
        </span>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-xl border border-line bg-card px-3 py-1.5 font-mono text-[9.5px] font-semibold tracking-[0.12em] text-ink-2 uppercase transition-colors hover:border-line-strong hover:text-brand disabled:opacity-50"
          :disabled="busy"
          @click="refresh()"
        >
          <component :is="busy ? spinner : refreshIcon" :class="busy ? 'h-3 w-3 animate-spin' : 'h-3 w-3'" :stroke-width="2" />
          refresh
        </button>
      </div>
    </div>

    <p v-if="loadError" class="rounded-xl border border-red/40 bg-red-soft px-4 py-3 text-[12.5px] text-red">
      {{ loadError }}
    </p>

    <slot />
  </div>
</template>
