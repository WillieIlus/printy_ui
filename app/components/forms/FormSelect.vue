<template>
  <VeeField v-slot="{ value, errors }" :name="name">
    <div>
      <label
        v-if="!hideLabel"
        :for="name"
        class="mb-1.5 block text-sm font-semibold text-[var(--p-text-dim)]"
      >
        {{ label }}
        <span v-if="required" class="text-flamingo-500">*</span>
      </label>
      <USelectMenu
        :model-value="value"
        :items="options"
        :placeholder="placeholder"
        :disabled="disabled"
        value-key="value"
        :color="errors?.length ? 'error' : undefined"
        :portal="portal"
        :create-item="createItem"
        :name="name"
        class="w-full"
        :ui="getSelectUi(Boolean(errors?.length))"
        @update:model-value="onUpdate"
        @create="onCreate"
      />
      <p v-if="helper && !errors?.length" class="mt-1 text-xs leading-5 text-[var(--p-text-muted)]">
        {{ helper }}
      </p>
      <div class="mt-1 min-h-[1.25rem]">
        <p v-if="errors?.length" class="flex items-start gap-1 text-xs leading-5 text-red-500">
          <UIcon name="i-lucide-alert-circle" class="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{{ errors[0] }}</span>
        </p>
      </div>
    </div>
  </VeeField>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate'

const props = withDefaults(
  defineProps<{
    name: string
    label: string
    options: Array<{ label: string; value: string | number }>
    placeholder?: string
    disabled?: boolean
    required?: boolean
    hideLabel?: boolean
    helper?: string
    /** Portal target for dropdown (e.g. "body" when inside a modal) */
    portal?: string | boolean
    /** Allow creating new items when not in list (Django-style). Pass true or { when: 'always' } */
    createItem?: boolean | 'always' | { when?: 'empty' | 'always'; position?: 'top' | 'bottom' }
    /** When createItem is used: format raw input to the value to set (e.g. "Custom Type" -> "CUSTOM_TYPE") */
    formatCreateValue?: (raw: string) => string | number
  }>(),
  {
    placeholder: '',
    helper: undefined,
    portal: true,
    createItem: false,
    formatCreateValue: undefined,
  }
)

const emit = defineEmits<{
  create: [value: string]
}>()

const { setValue } = useField<string | number>(() => props.name)

function onUpdate(v: unknown) {
  setValue(normalize(v))
}

function onCreate(v: string) {
  const val = props.formatCreateValue ? props.formatCreateValue(v) : v
  if (val !== '' && val != null) setValue(val)
  emit('create', v)
}

function normalize(v: unknown): string | number {
  if (v == null) return ''
  if (typeof v === 'string' || typeof v === 'number') return v
  if (typeof v === 'object' && v !== null && 'value' in v) return (v as { value: unknown }).value as string | number
  return String(v)
}

function getSelectUi(hasError: boolean) {
  return {
    base: [
      'w-full rounded-xl border bg-[var(--p-surface)] transition-all',
      hasError
        ? 'border-red-400 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/20'
        : 'border-[var(--p-border)] hover:border-[var(--p-text-muted)] focus-within:border-flamingo-500 focus-within:ring-2 focus-within:ring-flamingo-500/20',
      'disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-[var(--p-surface-sunken)]',
    ],
    trigger: 'flex min-w-0 flex-1 items-center gap-2 py-3 text-[0.95rem] leading-6 text-[var(--p-text)]',
    value: 'min-w-0 flex-1 truncate text-[var(--p-text)]',
    placeholder: 'min-w-0 flex-1 truncate text-[var(--p-text-muted)]',
    trailingIcon: 'ml-auto shrink-0 text-[var(--p-text-muted)]',
    leadingIcon: 'shrink-0 text-[var(--p-text-muted)]',
    content: 'border border-[var(--p-border)] bg-[var(--p-surface-raised)] text-[var(--p-text)] shadow-lg backdrop-blur-xl',
    item: 'text-[var(--p-text)] data-highlighted:not-data-disabled:before:bg-[var(--p-surface-sunken)] data-highlighted:not-data-disabled:text-[var(--p-text)]',
    itemLabel: 'truncate',
    itemDescription: 'text-[var(--p-text-muted)]',
    empty: 'px-3 py-2 text-sm text-[var(--p-text-muted)]',
  }
}
</script>
