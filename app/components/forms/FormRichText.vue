<template>
  <VeeField v-slot="{ field, errors }" :name="name" :label="label">
    <div>
      <label
        :for="name"
        class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {{ label }}
        <span v-if="required" class="text-flamingo-500">*</span>
      </label>
      <EditorRichTextEditor
        :model-value="field.value"
        :placeholder="placeholder"
        :disabled="disabled"
        @update:model-value="field.handleChange"
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
    disabled?: boolean
    required?: boolean
  }>(),
  { placeholder: '' }
)
</script>
