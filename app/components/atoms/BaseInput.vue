<!-- Purpose: Generic text input atom – no label or validation; compose inside FormField for those. -->
<template>
  <div class="relative flex items-center" :class="block ? 'w-full' : 'inline-flex'">
    <div
      v-if="$slots.prefix"
      class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--p-text-muted)]"
    >
      <slot name="prefix" />
    </div>
    <input
      v-bind="$attrs"
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="[
        'w-full rounded-[var(--radius-control)] border bg-[var(--p-surface)] text-[var(--p-text)] placeholder:text-[var(--p-text-muted)] transition-colors focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60',
        'disabled:bg-[var(--p-bg-soft)] disabled:text-[var(--p-text-muted)] disabled:placeholder:text-[var(--p-text-soft)]',
        sizes[size],
        error
          ? 'border-[var(--p-error)] focus:border-[var(--p-error)] focus:ring-[color:var(--p-error-soft)]'
          : 'border-[var(--p-border)] focus:border-[var(--p-primary)] focus:ring-[color:var(--p-primary-soft)]',
        $slots.prefix ? 'pl-9' : '',
        $slots.suffix ? 'pr-9' : '',
      ]"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <div
      v-if="$slots.suffix"
      class="absolute inset-y-0 right-0 flex items-center pr-3 text-[var(--p-text-muted)]"
    >
      <slot name="suffix" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  modelValue?: string | number
  type?: string
  placeholder?: string
  disabled?: boolean
  error?: boolean | string
  size?: 'sm' | 'md' | 'lg'
  block?: boolean
}>(), {
  type: 'text',
  size: 'md',
  block: true,
})

defineEmits<{ 'update:modelValue': [value: string] }>()

const sizes: Record<string, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-3.5 py-2.5 text-sm',
  lg: 'px-4 py-3 text-base',
}
</script>
