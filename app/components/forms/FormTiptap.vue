<template>
  <VeeField v-slot="{ field, errors }" :name="name" :label="label">
    <div>
      <label
        v-if="!hideLabel"
        :for="name"
        class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {{ label }}
        <span v-if="required" class="text-flamingo-500">*</span>
      </label>
      <UEditor
        :model-value="field.value"
        :placeholder="placeholder"
        content-type="html"
        :image="false"
        :mention="false"
        class="w-full min-h-[120px] rounded-xl border bg-gray-50 px-4 py-3 text-sm transition-all focus-within:border-flamingo-500 focus-within:bg-white focus-within:outline-none focus-within:ring-2 focus-within:ring-flamingo-500/20"
        :class="[
          errors.length
            ? 'border-red-300 focus-within:border-red-500 focus-within:ring-red-500/20'
            : 'border-gray-200 dark:border-gray-700',
        ]"
        @update:model-value="field.setValue($event)"
      />
      <div class="mt-1 h-5">
        <p v-if="errors.length" class="flex items-center gap-1 text-xs text-red-500">
          <UIcon name="i-lucide-alert-circle" class="h-3.5 w-3.5 flex-shrink-0" />
          {{ errors[0] }}
        </p>
      </div>
    </div>
  </VeeField>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    name: string
    label: string
    placeholder?: string
    hideLabel?: boolean
    required?: boolean
  }>(),
  { placeholder: '', hideLabel: false, required: false }
)
</script>
