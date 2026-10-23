<template>
  <section
    v-if="isManager"
    data-test="manager-margin-panel"
    class="rounded-2xl border p-4"
    :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }"
  >
    <ML>Your margin</ML>
    <p class="mt-1 text-[11.5px] leading-snug text-[var(--sub)]">
      Printer's quote, your markup and the Printy fee. Every figure below is returned by the server — nothing is
      added up in the browser.
    </p>

    <div class="mt-3 flex flex-wrap items-end gap-3">
      <label class="block">
        <span class="font-mono2 text-[9px] uppercase tracking-[0.12em] text-[var(--sub)]">Markup %</span>
        <input
          v-model="markupProxy"
          type="number"
          min="0"
          step="0.01"
          inputmode="decimal"
          data-test="margin-markup-input"
          class="mt-1 w-[110px] rounded-xl border px-3 py-2 text-[13px] outline-none focus:border-[var(--accent)]"
          :style="fieldStyle"
        />
      </label>
      <button
        type="button"
        class="press-key inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 font-mono2 text-[9.5px] font-bold uppercase tracking-[0.12em] disabled:opacity-50"
        :style="{ background: 'var(--accent)', color: 'var(--accentInk)' }"
        :disabled="disabled || calculating"
        data-test="margin-calculate"
        @click="emit('calculate')"
      >
        <Loader2 v-if="calculating" :size="12" class="animate-spin" />
        <Calculator v-else :size="12" />
        Calculate
      </button>
    </div>

    <div class="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
      <div v-for="row in rows" :key="row.key" :data-test="`margin-row-${row.key}`">
        <div class="font-mono2 text-[8.5px] uppercase tracking-[0.12em] text-[var(--sub)]">{{ row.label }}</div>
        <div
          class="text-[14px] font-semibold"
          :data-test="`margin-value-${row.key}`"
          :style="{ color: row.strong ? 'var(--accent)' : 'var(--ink)' }"
        >
          {{ row.value }}
        </div>
      </div>
    </div>

    <p v-if="!breakdown" data-test="margin-hint" class="mt-3 text-[11.5px] leading-snug text-[var(--sub)]">
      Pick a printer option and press Calculate to fill these in.
    </p>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Calculator, Loader2 } from 'lucide-vue-next'
import { marginRows } from '~/shared/margin'
import type { ManagerPricingBreakdown } from '~/shared/types'

const props = withDefaults(
  defineProps<{
    modelValue?: string | number
    breakdown?: ManagerPricingBreakdown | null
    calculating?: boolean
    disabled?: boolean
    currency?: string
  }>(),
  {
    modelValue: '',
    breakdown: null,
    calculating: false,
    disabled: false,
    currency: 'KES',
  },
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'calculate'): void
}>()

const { protoRole } = useProtoTheme()
// Item 4 — the margin panel is manager-only, whatever page mounts it.
const isManager = computed(() => protoRole.value === 'manager')

const fieldStyle = { borderColor: 'var(--line)', background: 'var(--panel2)', color: 'var(--ink)' }

const markupProxy = computed({
  get: () => String(props.modelValue ?? ''),
  set: (value: string) => emit('update:modelValue', value),
})

const rows = computed(() => marginRows(props.breakdown, props.currency))
</script>
