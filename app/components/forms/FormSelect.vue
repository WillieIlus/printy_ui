<template>
  <VeeField :name="name" v-slot="{ value, errors }">
  <div>
    <label
      v-if="!hideLabel"
      :for="name"
      class="mb-1.5 block text-sm font-medium text-gray-700"
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
      :content="contentProps"
      :create-item="createItem"
      :name="name"
      class="w-full"
      :ui="{
        base: errors?.length
          ? 'w-full rounded-xl border border-red-300 bg-gray-50 py-3 text-sm text-gray-900 transition-all focus:border-red-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 disabled:cursor-not-allowed disabled:opacity-50'
          : 'w-full rounded-xl border border-gray-200 bg-gray-50 py-3 text-sm text-gray-900 transition-all focus:border-flamingo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-flamingo-500/20 disabled:cursor-not-allowed disabled:opacity-50',
        rounded: 'rounded-xl',
        padding: 'px-4',
      }"
      @update:model-value="onUpdate"
      @create="onCreate"
    />
    <div class="mt-1 h-5">
      <p v-if="errors?.length" class="flex items-center gap-1 text-xs text-red-500">
        <UIcon name="i-lucide-alert-circle" class="h-3.5 w-3.5 flex-shrink-0" />
        {{ errors[0] }}
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
  { portal: true, createItem: false }
)

const emit = defineEmits<{
  create: [value: string]
}>()

const { setValue } = useField<string | number>(() => props.name)

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

const contentProps = computed(() =>
  props.portal ? { class: 'z-[100000]' } : {}
)
</script>
