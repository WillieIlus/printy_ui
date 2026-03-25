<template>
  <div class="overflow-hidden rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)]">
    <button
      type="button"
      :aria-expanded="open"
      :aria-label="`${open ? 'Collapse' : 'Expand'} ${title} section`"
      class="flex w-full items-center justify-between bg-[var(--p-surface-container-low)] px-4 py-3 text-left transition-colors hover:bg-[var(--p-surface-container)]"
      @click="open = !open"
    >
      <span class="font-semibold text-[var(--p-text)]">{{ title }}</span>
      <UIcon
        :name="open ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
        class="h-5 w-5 text-[var(--p-text-muted)]"
      />
    </button>
    <div v-show="open" class="border-t border-[var(--p-border)] p-4">
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
