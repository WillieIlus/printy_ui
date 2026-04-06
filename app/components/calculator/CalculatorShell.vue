<template>
  <section :id="anchorId" class="calculator-shell dark overflow-hidden rounded-xl border border-white/10 bg-mirage-950 text-white shadow-lg">
    <div class="grid gap-5 lg:grid-cols-[minmax(0,1.42fr)_minmax(19rem,0.78fr)] lg:gap-6">
      <div class="min-w-0 space-y-5">
        <slot name="header" />
        <slot name="form" />
      </div>
      <div class="min-w-0 lg:border-l lg:border-white/10 lg:pl-6">
        <slot name="preview" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  anchorId?: string
}>()
</script>

<style scoped>
.calculator-shell {
  background:
    radial-gradient(circle at top right, rgb(240 82 36 / 0.18), transparent 18rem),
    radial-gradient(circle at bottom left, rgb(48 89 153 / 0.18), transparent 20rem),
    linear-gradient(180deg, #132032 0%, #101828 100%);
  padding: 1.25rem;
}

@media (min-width: 640px) {
  .calculator-shell {
    padding: 1.5rem;
  }
}
</style>
