<script setup lang="ts">
import { computed } from 'vue'
import { cx } from '~/utils/design/cx'
import { CUSTODY_META } from '~/shared/admin-nav'
import type { Custody } from '~/shared/workflow/printy'

const props = defineProps<{ custody: Custody }>()

const TONES: Record<Custody, string> = {
  awaiting: 'border-amber/45 bg-amber-soft text-amber',
  held: 'border-brand/35 bg-mint text-brand-deep',
  released: 'border-green/40 bg-green-soft text-green',
}

const label = computed(() => CUSTODY_META[props.custody].label)
</script>

<template>
  <span :class="cx('inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[9.5px] font-semibold tracking-[0.08em] uppercase whitespace-nowrap', TONES[props.custody])">
    {{ label }}
  </span>
</template>
