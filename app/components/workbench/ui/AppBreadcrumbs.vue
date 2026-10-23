<template>
  <nav aria-label="Breadcrumb" class="min-w-0" data-test="app-breadcrumbs">
    <ol class="flex flex-wrap items-center gap-x-1.5 gap-y-1">
      <li v-for="(crumb, idx) in crumbs" :key="`${crumb.label}-${idx}`" class="flex items-center gap-1.5">
        <ChevronRight
          v-if="idx > 0"
          :size="11"
          class="shrink-0 text-[var(--sub)] opacity-60"
          aria-hidden="true"
        />
        <NuxtLink
          v-if="crumb.to"
          :to="crumb.to"
          class="font-mono2 text-[9.5px] uppercase tracking-[0.18em] text-[var(--sub)] transition-colors hover:text-[var(--accent)]"
        >
          {{ crumb.label }}
        </NuxtLink>
        <span
          v-else
          aria-current="page"
          class="truncate font-mono2 text-[9.5px] font-semibold uppercase tracking-[0.18em] text-[var(--ink)]"
          data-test="breadcrumb-current"
        >
          {{ crumb.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'
import { BREADCRUMB_LEAF_KEY, buildBreadcrumbs } from '~/shared/breadcrumbs'
import { protoHomeRoute } from '~/shared/workspace'

const route = useRoute()
const { protoRole } = useProtoTheme()
const leaf = useState<string>(BREADCRUMB_LEAF_KEY, () => '')

const crumbs = computed(() =>
  buildBreadcrumbs({
    home: protoHomeRoute(protoRole.value),
    homeLabel: 'Dashboard',
    path: route.path,
    meta: route.meta as Record<string, unknown>,
    leaf: leaf.value,
  }),
)
</script>
