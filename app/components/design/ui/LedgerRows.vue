<script setup lang="ts">
import { cx } from '../../../utils/design/cx'
import type { LedgerRow } from '../../../types/design/ledger-row'

const props = withDefaults(defineProps<{
  rows: LedgerRow[]
  tone?: 'card' | 'ink'
}>(), {
  tone: 'card',
})

function valueTone(t?: LedgerRow['tone']) {
  if (t === 'brand') return 'text-brand'
  if (t === 'green') return 'text-green'
  if (t === 'amber') return 'text-amber'
  return props.tone === 'ink' ? 'text-paper' : 'text-ink'
}
</script>

<template>
  <dl class="flex flex-col">
    <div
      v-for="row in props.rows"
      :key="row.label"
      :class="cx('flex items-baseline justify-between gap-4 border-b py-2.5 last:border-b-0', props.tone === 'ink' ? 'border-paper/10' : 'border-line/70')"
    >
      <dt class="flex flex-col">
        <span :class="cx('text-[13px]', row.strong && 'font-semibold', props.tone === 'ink' ? 'text-paper' : 'text-ink')">{{ row.label }}</span>
        <span v-if="row.hint" :class="cx('text-[11px]', props.tone === 'ink' ? 'text-paper/50' : 'text-ink-3')">{{ row.hint }}</span>
      </dt>
      <dd :class="cx('tabular font-mono text-sm font-semibold whitespace-nowrap', row.strong && 'text-base', valueTone(row.tone))">{{ row.value }}</dd>
    </div>
  </dl>
</template>
