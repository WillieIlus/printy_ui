<template>
  <div :class="classes">
    <div v-if="$slots.icon || icon" class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white">
      <slot name="icon">
        <span v-if="icon" class="text-slate-500" v-html="icon"></span>
      </slot>
    </div>
    <p class="text-sm font-semibold text-slate-700">{{ title }}</p>
    <p v-if="description" class="mt-1 text-xs text-slate-400">{{ description }}</p>
    <div v-if="$slots.action || actionLabel" class="mt-4">
      <slot name="action">
        <BaseButton v-if="actionTo" :to="actionTo" variant="secondary" size="sm" :disabled="actionDisabled">{{ actionLabel }}</BaseButton>
      </slot>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import BaseButton from '~/components/base/BaseButton.vue'
import { PRINTY_EMPTY_STATE } from '~/constants/design'

const props = withDefaults(defineProps<{
  title: string
  description?: string
  icon?: string
  actionLabel?: string
  actionTo?: string
  actionDisabled?: boolean
  variant?: 'default' | 'soft'
}>(), {
  description: '',
  icon: '',
  actionLabel: '',
  actionTo: '',
  actionDisabled: false,
  variant: 'default',
})

const classes = computed(() => [
  PRINTY_EMPTY_STATE.card,
  props.variant === 'soft' ? 'bg-white' : '',
])
</script>
