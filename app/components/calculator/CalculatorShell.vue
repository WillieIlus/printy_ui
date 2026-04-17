<template>
  <section :id="anchorId" class="calculator-shell dark overflow-hidden rounded-[1.35rem] border border-white/10 bg-mirage-950 text-white shadow-[0_20px_48px_rgba(0,0,0,0.22)]">
    <div
      class="grid min-w-0 gap-4"
      :class="layout === 'split'
        ? 'lg:grid-cols-[minmax(0,1.38fr)_minmax(18rem,0.82fr)] lg:gap-5'
        : 'grid-cols-1'"
    >
      <div class="min-w-0 space-y-4">
        <slot name="header" />
        <slot name="form" />
      </div>
      <div
        class="min-w-0"
        :class="layout === 'split'
          ? 'lg:border-l lg:border-white/10 lg:pl-5'
          : 'border-t border-white/10 pt-4'"
      >
        <slot name="preview" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  anchorId?: string
  layout?: 'split' | 'stack'
}>()
</script>

<style scoped>
.calculator-shell {
  background:
    radial-gradient(circle at top right, rgb(240 82 36 / 0.18), transparent 18rem),
    radial-gradient(circle at bottom left, rgb(48 89 153 / 0.18), transparent 20rem),
    linear-gradient(180deg, #132032 0%, #101828 100%);
  padding: 1rem;
}

@media (min-width: 640px) {
  .calculator-shell {
    padding: 1.25rem;
  }
}
</style>
