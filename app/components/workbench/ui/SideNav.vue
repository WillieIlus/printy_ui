<template>
  <nav
    v-if="items.length"
    data-test="side-nav"
    aria-label="Dashboard sections"
    class="shrink-0 lg:sticky lg:top-24 lg:w-[196px] lg:self-start"
  >
    <button
      type="button"
      class="press-key flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 font-mono2 text-[9.5px] font-semibold uppercase tracking-[0.16em] lg:hidden"
      :style="{ borderColor: 'var(--line)', background: 'var(--panel)', color: 'var(--sub)' }"
      :aria-expanded="open"
      aria-controls="side-nav-items"
      data-test="side-nav-toggle"
      @click="open = !open"
    >
      <Menu :size="13" />
      Sections
      <span class="ml-auto truncate text-[var(--accent)]">{{ currentLabel }}</span>
      <ChevronDown
        :size="13"
        :style="open ? { transform: 'rotate(180deg)' } : {}"
        aria-hidden="true"
      />
    </button>

    <ul
      id="side-nav-items"
      :class="open ? 'mt-2 grid gap-1' : 'mt-2 hidden gap-1 lg:grid'"
      data-test="side-nav-list"
    >
      <li v-for="item in items" :key="item.key">
        <NuxtLink
          :to="item.to"
          :data-test="`side-nav-${item.key}`"
          :data-active="isActive(item.to) ? 'true' : 'false'"
          :aria-current="isActive(item.to) ? 'page' : undefined"
          class="press-key flex items-center gap-2.5 rounded-xl border px-3 py-2.5 font-mono2 text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors"
          :style="linkStyle(item.to)"
          @click="open = false"
        >
          <component :is="item.icon" :size="14" class="shrink-0" />
          <span class="truncate">{{ item.label }}</span>
          <span
            v-if="badgeForItem(item.key) > 0"
            class="rounded-full px-1.5 py-0.5 font-mono2 text-[7px] font-semibold uppercase tracking-[0.08em]"
            :style="{ background: 'var(--accent)', color: 'var(--accentInk)' }"
          >
            {{ badgeForItem(item.key) }}
          </span>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ChevronDown, Menu } from 'lucide-vue-next'
import { isSideNavActive, sideNavForRole, getNavBadge } from '~/shared/nav-sections'

const route = useRoute()
const { protoRole } = useProtoTheme()

const open = ref(false)
const items = computed(() => sideNavForRole(protoRole.value))

const currentLabel = computed(() => {
  const active = items.value.find((item) => isSideNavActive(route.path, item.to))
  return active?.label ?? items.value[0]?.label ?? ''
})

function isActive(to: string): boolean {
  return isSideNavActive(route.path, to)
}

function linkStyle(to: string) {
  if (isActive(to)) {
    return {
      borderColor: 'var(--accent)',
      background: 'color-mix(in srgb, var(--accent) 12%, transparent)',
      color: 'var(--accent)',
    }
  }
  return { borderColor: 'transparent', background: 'transparent', color: 'var(--sub)' }
}

function badgeForItem(itemKey: string): number {
  return getNavBadge(protoRole.value, itemKey)
}

watch(
  () => route.path,
  () => {
    open.value = false
  },
)
</script>
