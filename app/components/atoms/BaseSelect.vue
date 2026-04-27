<!-- Purpose: Generic native select atom with design-token styling. -->
<template>
  <div class="relative" :class="block ? 'w-full' : 'inline-block'">
    <select
      v-bind="$attrs"
      :value="modelValue"
      :disabled="disabled"
      :class="[
        'w-full appearance-none rounded-[var(--radius-control)] border bg-[var(--p-surface)] text-[var(--p-text)] transition-colors focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-[var(--p-bg-soft)] disabled:text-[var(--p-text-muted)] pr-9',
        sizes[size],
        error
          ? 'border-[var(--p-error)] focus:border-[var(--p-error)] focus:ring-[color:var(--p-error-soft)]'
          : 'border-[var(--p-border)] focus:border-[var(--p-primary)] focus:ring-[color:var(--p-primary-soft)]',
      ]"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option v-if="placeholder" value="" disabled :selected="!modelValue">
        {{ placeholder }}
      </option>
      <option v-for="opt in options" :key="String(opt.value)" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-[var(--p-text-muted)]">
      <Icon name="lucide:chevron-down" class="size-4" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  modelValue?: string | number
  options?: { label: string; value: string | number }[]
  placeholder?: string
  disabled?: boolean
  error?: boolean | string
  size?: 'sm' | 'md' | 'lg'
  block?: boolean
}>(), {
  size: 'md',
  block: true,
  options: () => [],
})

defineEmits<{ 'update:modelValue': [value: string] }>()

const sizes: Record<string, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-3.5 py-2.5 text-sm',
  lg: 'px-4 py-3 text-base',
}
</script>
