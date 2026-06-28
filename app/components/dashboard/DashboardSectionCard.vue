<script setup lang="ts">
import { cn } from '~/utils/cn'

const props = withDefaults(defineProps<{
  title?: string
  description?: string
  className?: string
  noPadding?: boolean
}>(), {
  title: '',
  description: '',
  className: '',
  noPadding: false,
})
</script>

<template>
  <div :class="cn('rounded-2xl border border-slate-200 bg-white shadow-sm', props.className)">
    <div v-if="title || $slots.headerAction" class="flex items-center justify-between border-b border-slate-100 px-6 py-4">
      <div>
        <h3 v-if="title" class="text-base font-semibold text-slate-900">{{ title }}</h3>
        <p v-if="description" class="mt-0.5 text-sm text-slate-500">{{ description }}</p>
      </div>
      <slot name="headerAction" />
    </div>
    <div :class="cn({ 'p-6': !noPadding })">
      <slot />
    </div>
  </div>
</template>
