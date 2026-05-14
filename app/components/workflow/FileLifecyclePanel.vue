<template>
  <article class="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-[0_12px_34px_rgba(15,23,42,0.05)]">
    <div class="flex items-center justify-between gap-3">
      <div>
        <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">{{ eyebrow }}</p>
        <h3 class="mt-2 text-base font-semibold text-slate-950">{{ title }}</h3>
      </div>
      <span class="text-xs font-semibold text-slate-500">{{ files.length }} item{{ files.length === 1 ? '' : 's' }}</span>
    </div>

    <div v-if="files.length" class="mt-5 space-y-3">
      <slot />
      <article
        v-for="file in files"
        :key="file.id"
        class="rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
      >
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div class="space-y-1">
            <p class="text-sm font-semibold text-slate-950">{{ file.original_filename || 'Job file' }}</p>
            <div class="flex flex-wrap items-center gap-2">
              <ProofStatusBadge v-if="['proof', 'print_ready'].includes(String(file.file_type ?? ''))" :status="file.status" />
              <span v-else class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{{ humanizeWorkflowValue(file.file_type) }}</span>
              <span class="text-sm text-slate-500">v{{ file.version || 1 }}</span>
            </div>
          </div>
          <a
            v-if="file.download_url"
            :href="file.download_url"
            target="_blank"
            rel="noreferrer"
            class="text-sm font-semibold text-[var(--p-primary)] underline-offset-2 hover:underline"
          >
            Open file
          </a>
        </div>
        <p v-if="file.notes" class="mt-3 text-sm leading-6 text-slate-500">{{ file.notes }}</p>
        <div v-if="$slots.actions" class="mt-4">
          <slot name="actions" :file="file" />
        </div>
      </article>
    </div>

    <div v-else class="mt-5 rounded-2xl border border-dashed border-slate-200 px-5 py-10 text-center">
      <p class="text-sm font-semibold text-slate-950">{{ emptyTitle }}</p>
      <p class="mt-2 text-sm text-slate-500">{{ emptyCopy }}</p>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { JobFileRecord } from '~/stores/workflowSpine'
import ProofStatusBadge from '~/components/workflow/ProofStatusBadge.vue'
import { humanizeWorkflowValue } from '~/utils/workflowUi'

withDefaults(defineProps<{
  files: JobFileRecord[]
  eyebrow?: string
  title?: string
  emptyTitle?: string
  emptyCopy?: string
}>(), {
  eyebrow: 'Files',
  title: 'Job files',
  emptyTitle: 'No files yet',
  emptyCopy: 'Artwork, proofs, and print-ready files will appear here.',
})
</script>
