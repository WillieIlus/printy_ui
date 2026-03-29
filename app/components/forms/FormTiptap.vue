<template>
  <VeeField v-slot="{ field, errors }" :name="name" :label="label">
    <div>
      <label
        v-if="!hideLabel"
        :for="name"
        class="mb-1 block text-sm font-semibold leading-5 text-[var(--p-text-dim)]"
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
        class="w-full min-h-[120px] rounded-md border bg-[var(--p-surface)] px-4 py-2.5 text-sm leading-6 text-[var(--p-text)] transition-all focus-within:border-flamingo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-flamingo-500/12"
        :class="[
          errors.length
            ? 'border-red-300 bg-red-50/80 dark:border-red-800 dark:bg-red-950/30 focus-within:border-red-500 focus-within:ring-red-500/12'
            : 'border-[var(--p-border)]',
        ]"
        @update:model-value="field.setValue($event)"
      />
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
    hideLabel?: boolean
    required?: boolean
  }>(),
  { placeholder: '', hideLabel: false, required: false }
)
</script>
