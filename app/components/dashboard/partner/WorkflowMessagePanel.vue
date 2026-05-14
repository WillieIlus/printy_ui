<template>
  <article class="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.05)]">
    <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">Messages</p>
    <h3 class="mt-2 text-base font-semibold text-slate-950">Separated communication layers</h3>
    <p class="mt-4 text-sm leading-6 text-slate-500">
      Keep client updates clear while Printy coordinates production communication and job progress.
    </p>
    <div class="mt-5 grid gap-3 md:grid-cols-2">
      <div class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
        <div class="flex items-center justify-between gap-3">
          <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Client conversations</p>
          <span class="rounded-full bg-slate-200 px-2.5 py-1 text-[10px] font-semibold text-slate-700">Relationship-safe</span>
        </div>
        <p class="mt-3 text-sm font-semibold text-slate-950">Client-facing updates stay with the partner.</p>
        <p class="mt-2 text-sm leading-6 text-slate-500">Use this layer for quote follow-up, delivery promises, and commercial updates without exposing production internals.</p>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
        <div class="flex items-center justify-between gap-3">
          <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Production shop conversations</p>
          <span class="rounded-full bg-sky-100 px-2.5 py-1 text-[10px] font-semibold text-sky-700">Managed coordination</span>
        </div>
        <p class="mt-3 text-sm font-semibold text-slate-950">Printy handles production-side coordination.</p>
        <p class="mt-2 text-sm leading-6 text-slate-500">Shop communication, assignment status, and issue handling stay inside managed workflow channels so direct unmanaged exposure does not become the default.</p>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
</script>
