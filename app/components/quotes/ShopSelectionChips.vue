<template>
  <div class="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface)] p-3">
    <div class="flex flex-wrap gap-2">
      <button
        v-for="shop in shops"
        :key="shop.slug"
        type="button"
        class="rounded-md border px-3 py-2 text-sm font-medium transition-colors"
        :class="selectedSlugs.includes(shop.slug)
          ? 'border-flamingo-400 bg-flamingo-500/12 text-[var(--p-text)]'
          : 'border-[var(--p-border)] bg-[var(--p-surface-sunken)] text-[var(--p-text-muted)] hover:border-flamingo-300 hover:text-[var(--p-text)]'"
        @click="$emit('toggle', shop.slug)"
      >
        {{ shop.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  shops: Array<{ slug: string; label: string }>
  selectedSlugs: string[]
}>()

defineEmits<{
  toggle: [slug: string]
}>()
</script>
