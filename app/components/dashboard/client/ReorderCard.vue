<template>
  <article class="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.05)]">
    <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">Reorder</p>
    <h3 class="mt-2 text-base font-semibold text-slate-950">Reuse the managed job as a template</h3>
    <p class="mt-4 text-sm leading-6 text-slate-500">
      Repeat runs should start from the saved managed specification instead of restarting a shop-comparison flow.
    </p>
    <NuxtLink
      to="/"
      class="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#101828] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-900"
    >
      <Icon name="lucide:rotate-cw" class="size-4" />
      Start reorder request
    </NuxtLink>
  </article>
</template>

<script setup lang="ts">
</script>
