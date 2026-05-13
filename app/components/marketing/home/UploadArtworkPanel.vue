<template>
  <article class="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.05)]">
    <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">Artwork handoff</p>
    <h3 class="mt-2 text-lg font-semibold tracking-tight text-slate-950">Upload artwork for exact confirmation</h3>
    <p class="mt-4 text-sm leading-6 text-slate-500">
      {{ hasArtwork ? 'Artwork is already attached to this estimate. Printy can move directly into review and confirmation.' : 'Attach artwork in the calculator to move from an estimate into an exact quote without repeating the brief.' }}
    </p>
    <div class="mt-5 rounded-2xl border border-dashed border-[var(--p-primary)]/30 bg-[var(--p-primary)]/5 p-4">
      <p class="text-sm font-semibold text-slate-950">{{ hasArtwork ? artworkLabel || 'Artwork attached' : 'Artwork not attached yet' }}</p>
      <p class="mt-2 text-sm text-slate-500">PDF, AI, PSD, PNG, and JPG files are supported.</p>
      <button
        type="button"
        class="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#101828] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-900"
        @click="$emit('jump-to-calculator')"
      >
        <Icon name="lucide:upload" class="size-4" />
        {{ hasArtwork ? 'Review calculator setup' : 'Upload artwork now' }}
      </button>
    </div>
  </article>
</template>

<script setup lang="ts">
defineEmits<{
  (e: 'jump-to-calculator'): void
}>()

defineProps<{
  hasArtwork: boolean
  artworkLabel?: string | null
}>()
</script>
