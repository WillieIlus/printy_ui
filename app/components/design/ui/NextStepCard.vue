<script setup lang="ts">
import { ArrowRight, Clock3, ShieldCheck } from 'lucide-vue-next'
import { resolveComponent } from 'vue'
import { cx } from '../../../utils/design/cx'

export type NextStepTone = 'brand' | 'amber' | 'green' | 'ink'

const props = withDefaults(defineProps<{
  title: string
  body?: string
  actionLabel?: string
  to?: string | null
  tone?: NextStepTone
  ownerRole?: 'buyer' | 'manager' | 'printer' | string
  overdue?: string
  dueLabel?: string | null
  disabled?: boolean
  isMine?: boolean
}>(), {
  to: null,
  tone: 'brand',
  ownerRole: '',
  overdue: 'none',
  disabled: false,
  isMine: false,
})

const emit = defineEmits<{ (e: 'click'): void }>()

const toneClasses: Record<NextStepTone, string> = {
  brand: 'border-brand/40 bg-mint/40 text-brand-deep',
  amber: 'border-amber/45 bg-amber-soft text-amber',
  green: 'border-green/45 bg-green-soft text-green',
  ink: 'border-line bg-card text-ink',
}

const overdueClasses: Record<string, string> = {
  warn: 'ring-1 ring-amber/40',
  late: 'ring-2 ring-red/40',
  none: '',
}

const roleLabel = computed(() => {
  if (!props.isMine) return 'Status'
  if (props.ownerRole === 'buyer') return 'Your move'
  if (props.ownerRole === 'manager') return 'Manager action'
  if (props.ownerRole === 'printer') return 'Printer action'
  return 'Next step'
})

// A card that has nowhere to go (the read-only public tracker) must not be a
// dead button. Desks always pass isMine, so their card stays tappable.
const NuxtLinkComponent = resolveComponent('NuxtLink')
const isLink = computed(() => Boolean(props.to))
const isButton = computed(() => !props.to && props.isMine)
const rootTag = computed(() => {
  if (isLink.value) return NuxtLinkComponent
  return isButton.value ? 'button' : 'div'
})
</script>

<template>
  <component
    :is="rootTag"
    :to="isLink ? props.to : undefined"
    :type="isButton ? 'button' : undefined"
    :disabled="isButton && props.disabled ? true : undefined"
    :aria-disabled="isButton && props.disabled ? 'true' : undefined"
    class="block w-full rounded-2xl border p-5 text-left shadow-card transition-all hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 disabled:cursor-not-allowed disabled:opacity-50"
    :class="[toneClasses[props.tone], overdueClasses[props.overdue]]"
    data-test="next-step-card"
    @click="isButton ? emit('click') : undefined"
  >
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div class="max-w-[62ch]">
        <p class="font-mono text-[10px] font-semibold uppercase tracking-[0.14em]">
          {{ roleLabel }}
          <span v-if="props.dueLabel" class="ml-2 text-ink-3">· {{ props.dueLabel }}</span>
        </p>
        <p class="mt-1 text-base font-bold tracking-tight">{{ props.title }}</p>
        <p v-if="props.body" class="mt-1 text-[12.5px] leading-relaxed text-ink-2">{{ props.body }}</p>
      </div>
      <span
        v-if="props.actionLabel && props.isMine"
        class="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-xl bg-brand px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-brand-deep"
      >
        {{ props.actionLabel }} <ArrowRight :size="13" aria-hidden="true" />
      </span>
    </div>
  </component>
</template>
