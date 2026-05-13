<template>
  <article class="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.05)]">
    <div class="flex items-center justify-between gap-3">
      <div>
        <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">Proof operations</p>
        <h3 class="mt-2 text-base font-semibold text-slate-950">Upload and action proofs</h3>
      </div>
      <ProofStatusBadge :status="primaryProofStatus" />
    </div>

    <p class="mt-4 text-sm leading-6 text-slate-500">
      Upload proofs here so client review, revisions, and print-ready approval all stay in one place.
    </p>

    <div class="mt-5 flex flex-wrap items-center gap-3">
      <input
        class="max-w-[220px] text-sm text-slate-500"
        type="file"
        accept=".pdf,.png,.jpg,.jpeg,.ai,.psd"
        @change="$emit('proof-selected', $event)"
      >
      <button
        type="button"
        class="inline-flex items-center justify-center rounded-xl bg-[#101828] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="uploading || !canUpload"
        @click="$emit('upload-proof')"
      >
        <Icon v-if="uploading" name="lucide:loader-2" class="mr-2 size-4 animate-spin" />
        {{ uploading ? 'Uploading proof...' : 'Upload proof' }}
      </button>
    </div>
  </article>
</template>

<script setup lang="ts">
import ProofStatusBadge from '~/components/workflow/ProofStatusBadge.vue'

withDefaults(defineProps<{
  primaryProofStatus?: string | null
  uploading?: boolean
  canUpload?: boolean
}>(), {
  primaryProofStatus: 'proof_uploaded',
  uploading: false,
  canUpload: false,
})

defineEmits<{
  (e: 'proof-selected', event: Event): void
  (e: 'upload-proof'): void
}>()
</script>
