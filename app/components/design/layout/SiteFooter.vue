<script setup lang="ts">
import { computed } from 'vue'
import { DESIGN_FOOTER, DESIGN_MARKETING_NAV, type DesignNavItem } from '../../../utils/design/nav'

const props = withDefaults(defineProps<{
  marketingLinks?: DesignNavItem[]
}>(), {
  marketingLinks: () => DESIGN_MARKETING_NAV,
})

const legalLinks = [
  { href: '/legal#terms', label: DESIGN_FOOTER.terms },
  { href: '/legal#privacy', label: DESIGN_FOOTER.privacy },
  { href: '/legal#help', label: DESIGN_FOOTER.help },
] as const
const marketingLinks = computed(() => props.marketingLinks.filter((item) => !item.omit))
</script>

<template>
  <footer class="border-t border-line">
    <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-5 gap-y-1 px-5 py-3.5 sm:px-8">
      <nav aria-label="Legal" class="flex items-center gap-2.5">
        <span v-for="(link, i) in legalLinks" :key="link.href" class="flex items-center gap-2.5">
          <span v-if="i > 0" aria-hidden="true" class="text-[10px] text-ink-3">·</span>
          <NuxtLink :to="link.href" class="font-mono text-[10.5px] font-medium tracking-[0.1em] text-ink-3 uppercase transition-colors hover:text-ink">
            {{ link.label }}
          </NuxtLink>
        </span>
      </nav>
      <nav v-if="marketingLinks.length > 0" aria-label="Explore" class="flex items-center gap-2.5">
        <span v-for="(link, i) in marketingLinks" :key="link.href" class="flex items-center gap-2.5">
          <span v-if="i > 0" aria-hidden="true" class="text-[10px] text-ink-3">·</span>
          <NuxtLink :to="link.href" class="font-mono text-[10.5px] font-medium tracking-[0.1em] text-ink-3 uppercase transition-colors hover:text-ink">
            {{ link.label }}
          </NuxtLink>
        </span>
      </nav>
      <p class="font-mono text-[10.5px] tracking-[0.06em] text-ink-3">{{ DESIGN_FOOTER.copyright }}</p>
    </div>
  </footer>
</template>
