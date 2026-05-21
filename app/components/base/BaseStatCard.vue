<template>
  <BaseCard :variant="surface === 'dark' ? 'dark' : 'dashboard'" padding="md" radius="xl" :class="cardClass" :style="cardStyle">
    <div class="flex items-center justify-between mb-3">
      <div :class="iconClasses">
        <slot name="icon">
          <span v-if="icon" v-html="icon"></span>
        </slot>
      </div>
      <slot name="badge">
        <span v-if="badge && badgeClass" class="rounded-full border px-2 py-0.5 text-xs font-semibold" :class="badgeClass">{{ badge }}</span>
        <BaseBadge v-else-if="badge" :variant="badgeVariant" size="sm">{{ badge }}</BaseBadge>
      </slot>
    </div>
    <p :class="valueClasses">{{ value }}</p>
    <p :class="labelClasses">{{ label }}</p>
    <p v-if="meta" :class="metaClasses">{{ meta }}</p>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseBadge from '~/components/base/BaseBadge.vue'
import BaseCard from '~/components/base/BaseCard.vue'

const props = withDefaults(defineProps<{
  label: string
  value: string | number
  meta?: string
  badge?: string
  badgeVariant?: 'default' | 'orange' | 'dark' | 'green' | 'red' | 'yellow' | 'blue' | 'gray' | 'verified' | 'pending' | 'accepted' | 'rejected' | 'active' | 'completed'
  accent?: 'orange' | 'amber' | 'green' | 'blue' | 'slate'
  surface?: 'default' | 'dark'
  icon?: string
  cardClass?: string
  cardStyle?: string
  iconClass?: string
  valueClass?: string
  labelClass?: string
  metaClass?: string
  badgeClass?: string
}>(), {
  meta: '',
  badge: '',
  badgeVariant: 'default',
  accent: 'orange',
  surface: 'default',
  icon: '',
  cardClass: '',
  cardStyle: '',
  iconClass: '',
  valueClass: '',
  labelClass: '',
  metaClass: '',
  badgeClass: '',
})

const iconClassMap = {
  orange: 'bg-[#fdf1ee] text-[#e13515]',
  amber: 'bg-amber-50 text-amber-500',
  green: 'bg-green-50 text-green-500',
  blue: 'bg-blue-50 text-blue-500',
  slate: 'bg-slate-100 text-slate-500',
} as const

const iconClasses = computed(() => [
  'flex h-9 w-9 items-center justify-center rounded-xl',
  props.iconClass || (props.surface === 'dark' ? 'bg-white/10 text-white' : iconClassMap[props.accent]),
])

const valueClasses = computed(() => props.valueClass || (props.surface === 'dark' ? 'text-3xl font-extrabold text-white' : 'text-3xl font-extrabold text-slate-900'))
const labelClasses = computed(() => props.labelClass || (props.surface === 'dark' ? 'mt-0.5 text-sm font-medium text-slate-400' : 'mt-0.5 text-sm font-medium text-slate-500'))
const metaClasses = computed(() => props.metaClass || 'mt-2 text-xs text-slate-400')
</script>
