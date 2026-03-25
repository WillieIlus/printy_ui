<template>
  <VeeField v-slot="{ field, errors }" :name="name" :label="label">
    <div>
      <label
        :for="name"
        class="mb-1.5 block text-[0.95rem] font-semibold leading-6 text-[var(--p-text-dim)]"
      >
        {{ label }}
        <span v-if="required" class="text-flamingo-500">*</span>
      </label>
      <div
        class="rounded-xl border-2 bg-[var(--p-surface)] transition-all"
        :class="errors.length
          ? 'border-red-500 bg-red-50 dark:bg-red-950/30 ring-2 ring-red-500/30'
          : 'border-[var(--p-border)]'"
      >
        <EditorRichTextEditor
          :model-value="field.value ?? ''"
          :placeholder="placeholder"
          :disabled="disabled"
          @update:model-value="field.handleChange"
        />
      </div>
      <div class="mt-1 h-5">
        <p v-if="errors.length" class="flex items-center gap-1 text-[0.8125rem] leading-5 text-red-500">
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
