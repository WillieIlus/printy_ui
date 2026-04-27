<!-- Purpose: Search input molecule with leading icon and optional clear button. -->
<template>
  <div class="relative flex items-center" :class="block ? 'w-full' : 'inline-flex'">
    <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--p-text-muted)]">
      <BaseSpinner v-if="loading" size="sm" color="muted" />
      <Icon v-else name="lucide:search" class="size-4" />
    </div>
    <input
      :value="modelValue"
      type="search"
      :placeholder="placeholder"
      class="w-full rounded-[var(--radius-control)] border border-[var(--p-border)] bg-[var(--p-surface)] py-2.5 pl-9 pr-9 text-sm text-[var(--p-text)] placeholder:text-[var(--p-text-muted)] transition-colors focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @keydown.enter.prevent="$emit('search', modelValue)"
    />
    <button
      v-if="modelValue"
      type="button"
      class="absolute inset-y-0 right-0 flex items-center pr-3 text-[var(--p-text-muted)] hover:text-[var(--p-text)]"
      @click="$emit('update:modelValue', ''); $emit('clear')"
    >
      <Icon name="lucide:x" class="size-4" />
    </button>
  </div>
</template>

<script setup lang="ts">
import BaseSpinner from '~/components/atoms/BaseSpinner.vue'

withDefaults(defineProps<{
  modelValue?: string
  placeholder?: string
  loading?: boolean
  block?: boolean
}>(), {
  placeholder: 'Search…',
  block: true,
})

defineEmits<{
  'update:modelValue': [value: string]
  search: [value: string | undefined]
  clear: []
}>()
</script>
