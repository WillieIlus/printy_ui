<template>
  <VeeField v-slot="{ field, errors }" :name="name" :label="label">
    <div>
      <label
        :for="name"
        :class="formLabelClass"
      >
        {{ label }}
        <span v-if="required" class="text-flamingo-500">*</span>
      </label>
      <textarea
        v-bind="field"
        :id="name"
        :placeholder="placeholder"
        :rows="rows"
        :disabled="disabled"
        :aria-invalid="errors.length ? 'true' : 'false'"
        :class="[nativeTextareaClass, errors.length ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : '']"
      />
      <p v-if="helper && !errors.length" :class="formHelperClass">
        {{ helper }}
      </p>
      <div class="mt-1 min-h-[1.25rem]">
        <p v-if="errors.length" :class="formErrorClass">
          <UIcon name="i-lucide-alert-circle" class="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{{ errors[0] }}</span>
        </p>
      </div>
    </div>
  </VeeField>
</template>

<script setup lang="ts">
import { formErrorClass, formHelperClass, formLabelClass, nativeTextareaClass } from '~/utils/formUi'

withDefaults(
  defineProps<{
    name: string
    label: string
    placeholder?: string
    rows?: number
    disabled?: boolean
    required?: boolean
    helper?: string
  }>(),
  {
    placeholder: '',
    rows: 4,
    helper: undefined,
  }
)
</script>
