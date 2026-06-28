<template>
  <div :class="classes" role="alert">
    <div v-if="$slots.icon" class="shrink-0">
      <slot name="icon" />
    </div>
    <div class="min-w-0 flex-1">
      <p v-if="title" class="text-sm font-bold">{{ title }}</p>
      <div :class="bodyClass">
        <slot>
          {{ message }}
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  variant?: 'default' | 'success' | 'warning' | 'error' | 'dark'
  title?: string
  message?: string
}>(), {
  variant: 'default',
  title: '',
  message: '',
})

const variantMap = {
  default: 'border-slate-200 bg-white text-slate-700',
  success: 'border-green-200 bg-green-50 text-green-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-700',
  error: 'border-red-200 bg-red-50 text-red-700',
  dark: 'border-white/10 bg-[#101828] text-slate-300',
} as const

const classes = computed(() => [
  'flex items-start gap-3 rounded-2xl border px-5 py-4',
  variantMap[props.variant],
])

const bodyClass = computed(() => props.title ? 'mt-1 text-sm' : 'text-sm')
</script>
