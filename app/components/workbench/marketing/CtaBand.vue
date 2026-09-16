<script setup lang="ts">
defineProps<{ title: string; body: string }>()
</script>

<template>
  <section class="mx-auto w-full max-w-[1180px] px-4 py-16">
    <div class="cta-in relative overflow-hidden rounded-[2rem] p-8 text-center sm:p-12" style="background: var(--accent)">
      <div class="halftone pointer-events-none absolute inset-0 opacity-25" style="--dot: rgba(0, 0, 0, 0.35)" />
      <div class="relative">
        <h2 class="font-disp text-[28px] font-bold leading-tight tracking-tight sm:text-[36px]" style="color: var(--accentInk)">
          {{ title }}
        </h2>
        <p class="mx-auto mt-3 max-w-[48ch] text-[14px] leading-relaxed" style="color: var(--accentInk); opacity: 0.85">
          {{ body }}
        </p>
        <div class="mt-6 flex flex-wrap justify-center gap-2.5"><slot /></div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes printy-cta-in {
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
.cta-in {
  animation: printy-cta-in 0.5s ease both;
}
</style>