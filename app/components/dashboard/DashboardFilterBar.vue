<template>
  <div class="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 md:flex-row md:items-center md:justify-between">
    <div class="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
      <BaseInput
        v-if="searchModel !== undefined"
        :model-value="searchModel"
        :placeholder="searchPlaceholder"
        variant="dashboard"
        class="md:max-w-xs"
        @update:model-value="$emit('update:searchModel', String($event))"
      />
      <div class="flex flex-1 flex-wrap gap-3">
        <template v-for="filter in filters" :key="filter.key">
          <BaseSelect
            v-if="filter.type === 'select'"
            :model-value="filter.modelValue"
            :options="filter.options || []"
            :placeholder="filter.placeholder"
            variant="dashboard"
            class="min-w-[10rem]"
            @update:model-value="$emit('update:filter', { key: filter.key, value: $event })"
          />
        </template>
        <slot />
      </div>
    </div>
    <div v-if="$slots.actions" class="flex flex-wrap items-center gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseInput from '~/components/base/BaseInput.vue'
import BaseSelect from '~/components/base/BaseSelect.vue'

defineProps<{
  searchModel?: string
  searchPlaceholder?: string
  filters?: Array<{
    key: string
    type: 'select'
    modelValue?: string | number | null
    placeholder?: string
    options?: Array<string | { label: string; value: string | number }>
  }>
}>()

defineEmits<{
  'update:searchModel': [value: string]
  'update:filter': [payload: { key: string, value: string | number }]
}>()
</script>
