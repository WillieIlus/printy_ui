<template>
  <span class="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold" :class="toneClass">
    <Icon :name="iconName" class="size-3.5" />
    {{ headline }}
  </span>
</template>

<script setup lang="ts">
import { paymentStatusHeadline, paymentTone, workflowToneClass } from '~/utils/workflowUi'

const props = defineProps<{
  status?: string | null
}>()

const headline = computed(() => paymentStatusHeadline(props.status))
const toneClass = computed(() => workflowToneClass(paymentTone(props.status)))
const iconName = computed(() => {
  if (headline.value === 'Payment confirmed') return 'lucide:badge-check'
  if (headline.value === 'Settlement ready') return 'lucide:wallet-cards'
  if (headline.value === 'STK sent') return 'lucide:smartphone'
  return 'lucide:badge-dollar-sign'
})
</script>
