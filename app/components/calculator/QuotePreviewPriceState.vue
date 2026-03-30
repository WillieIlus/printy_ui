<template>
  <section class="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
    <div
      v-if="piecesPerSheet || sheetsRequired"
      class="grid gap-3 sm:grid-cols-2"
    >
      <div class="rounded-xl border border-flamingo-200 bg-white p-4 shadow-sm">
        <p class="text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-slate-500">
          Pcs per sheet
        </p>
        <p class="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
          {{ piecesPerSheet || 'â€”' }}
        </p>
      </div>
      <div class="rounded-xl border border-flamingo-200 bg-white p-4 shadow-sm">
        <p class="text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-slate-500">
          Sheets required
        </p>
        <p class="mt-2 text-2xl font-extrabold tracking-tight text-flamingo-600">
          {{ sheetsRequired || 'â€”' }}
        </p>
      </div>
    </div>

    <div class="space-y-2">
      <div class="flex items-center justify-between gap-3 text-sm">
        <span class="text-slate-500">Print subtotal</span>
        <strong class="text-slate-900">{{ printSubtotal }}</strong>
      </div>
      <div class="flex items-center justify-between gap-3 text-sm">
        <span class="text-slate-500">Finishing total</span>
        <strong class="text-slate-900">{{ finishingTotal }}</strong>
      </div>
      <div class="flex items-center justify-between gap-3 text-sm">
        <span class="text-slate-500">Per-unit price</span>
        <strong class="text-slate-900">{{ perUnit }}</strong>
      </div>
    </div>

    <div class="border-t border-slate-200 pt-3">
      <p class="text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-slate-500">
        Estimated total
      </p>
      <p class="mt-1 text-3xl font-extrabold tracking-tight text-flamingo-600">
        {{ total }}
      </p>
      <p class="mt-1 text-sm text-slate-500">
        {{ helper }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  printSubtotal: string
  finishingTotal: string
  total: string
  perUnit: string
  helper: string
  piecesPerSheet?: string
  sheetsRequired?: string
}>()
</script>
