<template>
  <div class="softui-card overflow-hidden rounded-lg">
    <button
      type="button"
      :aria-expanded="open"
      :aria-label="`${open ? 'Collapse' : 'Expand'} ${title} section`"
      class="flex w-full items-center justify-between bg-transparent px-4 py-3 text-left transition-colors hover:bg-white/3 sm:px-5"
      @click="open = !open"
    >
      <span class="text-sm font-semibold tracking-[0.01em] text-[var(--p-text)] sm:text-[0.95rem]">{{ title }}</span>
      <UIcon
        :name="open ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
        class="h-5 w-5 text-[var(--p-text-muted)]"
      />
    </button>
    <div v-show="open" class="border-t border-white/6 px-4 pb-4 pt-4 sm:px-5 sm:pb-5">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title: string
    defaultOpen?: boolean
  }>(),
  { defaultOpen: true }
)

const open = ref(props.defaultOpen)
</script>
