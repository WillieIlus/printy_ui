<script setup lang="ts">
/**
 * Manager price adjustment, kept on the canonical job card.
 *
 * The jobs list is a queue: it shows stage, owner and the next action and links
 * here. Every decision that changes a job (dispatch, artwork, delivery,
 * adjustment) is performed on the card so the audit trail has one home.
 */
import { computed, ref } from 'vue'
import { Check, Eye, Loader2 } from 'lucide-vue-next'
import DesignAlert from '~/components/design/ui/Alert.vue'
import { useManagerStore } from '~/stores/manager'
import type { JobOverrideRequest, JobOverrideResult } from '~/shared/types'

const props = defineProps<{ jobId: number }>()

const m = useManagerStore()

const field = ref('spoilage')
const value = ref('')
const previewResult = ref<JobOverrideResult | null>(null)
const error = ref('')
const note = ref('')
const previewing = ref(false)
const saving = ref(false)

const placeholder = computed(() => {
  switch (field.value) {
    case 'markup':
      return 'e.g. 250 (KES)'
    case 'paper_substitution':
      return 'e.g. Silk 300gsm'
    case 'sheet_count':
      return 'e.g. 12 (sheets billed)'
    default:
      return 'e.g. 3 (sheets added)'
  }
})

function resetPreview() {
  previewResult.value = null
  error.value = ''
  note.value = ''
}

function buildPayload(): JobOverrideRequest | null {
  error.value = ''
  const raw = value.value.trim()
  if (!raw) {
    error.value = 'Enter a value for the adjustment.'
    return null
  }
  if (field.value === 'markup') {
    const amount = Number(raw)
    if (!Number.isFinite(amount)) {
      error.value = 'Margin must be a number in KES.'
      return null
    }
    return { field: field.value, new_value: { amount } }
  }
  if (field.value === 'sheet_count') {
    const sheets = Number(raw)
    if (!Number.isInteger(sheets) || sheets < 0) {
      error.value = 'Sheet count must be a whole number of sheets.'
      return null
    }
    return { field: field.value, new_value: { sheets_billed: sheets } }
  }
  if (field.value === 'spoilage') {
    const sheets = Number(raw)
    if (!Number.isInteger(sheets) || sheets < 0) {
      error.value = 'Spoilage must be a whole number of sheets.'
      return null
    }
    return { field: field.value, new_value: { waste_sheets_added: sheets } }
  }
  return { field: 'paper_substitution', new_value: { label: raw } }
}

async function preview() {
  const payload = buildPayload()
  if (!payload) return
  previewing.value = true
  note.value = ''
  const result = await m.previewJobOverride(props.jobId, payload)
  previewing.value = false
  if (!result) {
    error.value = m.error || "We couldn't preview that adjustment."
    return
  }
  previewResult.value = result
}

async function save() {
  const payload = buildPayload()
  if (!payload) return
  saving.value = true
  const result = await m.saveJobOverride(props.jobId, payload)
  saving.value = false
  if (!result) {
    error.value = m.error || "We couldn't save that adjustment."
    return
  }
  note.value = 'Adjustment recorded on the job.'
  if (result.manager) previewResult.value = result
}

function money(value: unknown) {
  const n = Number(value)
  return Number.isFinite(n) ? formatKSh(n, 2) : '—'
}
</script>

<template>
  <section class="rounded-3xl border border-line bg-card p-5 shadow-card">
    <p class="font-mono text-[10px] font-semibold tracking-[0.14em] text-ink-2 uppercase">Adjust this job</p>
    <p class="mt-1 text-[12.5px] leading-relaxed text-ink-2">
      Adjust spoilage, paper, margin or sheet count. Preview the buyer-facing price impact before saving; the
      adjustment is recorded on the job.
    </p>
    <div class="mt-3 flex flex-wrap items-end gap-2">
      <label class="flex flex-col gap-1">
        <span class="font-mono text-[9px] tracking-[0.12em] text-ink-3 uppercase">Field</span>
        <select
          v-model="field"
          class="rounded-xl border border-line bg-card px-2 py-1.5 text-[12px] text-ink"
          @change="resetPreview()"
        >
          <option value="spoilage">Spoilage</option>
          <option value="paper_substitution">Paper</option>
          <option value="markup">Margin</option>
          <option value="sheet_count">Sheet count</option>
        </select>
      </label>
      <label class="flex flex-col gap-1">
        <span class="font-mono text-[9px] tracking-[0.12em] text-ink-3 uppercase">Value</span>
        <input
          v-model="value"
          :placeholder="placeholder"
          class="w-[160px] rounded-xl border border-line bg-card px-2 py-1.5 text-[12px] text-ink"
          @input="resetPreview()"
        >
      </label>
      <button
        class="inline-flex items-center gap-2 rounded-xl border border-line-strong bg-card px-4 py-2 font-mono text-[10px] font-bold tracking-[0.12em] text-ink uppercase transition-colors hover:border-brand hover:text-brand disabled:opacity-40"
        :disabled="m.saving || previewing"
        @click="preview()"
      >
        <Loader2 v-if="previewing" :size="11" class="animate-spin" />
        <Eye v-else :size="11" />
        Preview impact
      </button>
      <button
        class="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 font-mono text-[10px] font-bold tracking-[0.12em] text-white uppercase transition-colors hover:bg-brand-deep disabled:opacity-40"
        :disabled="m.saving || saving || !previewResult"
        @click="save()"
      >
        <Loader2 v-if="saving" :size="11" class="animate-spin" />
        <Check v-else :size="11" />
        Save adjustment
      </button>
    </div>
    <div v-if="previewResult" class="mt-3 flex flex-wrap items-center gap-2 text-[12px]">
      <span class="text-ink-2">Buyer price</span>
      <span class="font-semibold text-ink">{{ money(previewResult.buyer_price_impact.old_total) }}</span>
      <span class="text-ink-2">→</span>
      <span class="font-semibold" :style="{ color: previewResult.buyer_price_impact.changed ? 'var(--accent)' : 'var(--ink)' }">
        {{ money(previewResult.buyer_price_impact.new_total) }}
      </span>
      <span
        class="rounded-full px-2 py-[2px] font-mono text-[9px] tracking-[0.12em] uppercase"
        :style="previewResult.buyer_price_impact.changed ? { background: 'rgba(245,166,35,.16)', color: '#B45309' } : { background: 'var(--panel)', color: 'var(--sub)' }"
      >
        {{ previewResult.buyer_price_impact.changed ? 'buyer price changes' : 'no buyer price change' }}
      </span>
    </div>
    <DesignAlert v-if="error" tone="error" class="mt-3">
      {{ error }}
    </DesignAlert>
    <DesignAlert v-if="note" tone="success" class="mt-3">
      {{ note }}
    </DesignAlert>
  </section>
</template>
