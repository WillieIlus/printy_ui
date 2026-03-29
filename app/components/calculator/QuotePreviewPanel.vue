<template>
  <div class="calculator-preview-light rounded-lg border border-slate-200 bg-white p-4 text-slate-900 shadow-md sm:p-5">
    <slot />
  </div>
</template>

<style scoped>
.calculator-preview-light {
  color-scheme: light;
  box-shadow:
    0 10px 18px -14px rgb(15 23 42 / 0.18),
    0 4px 8px -6px rgb(15 23 42 / 0.12);
}
</style>
