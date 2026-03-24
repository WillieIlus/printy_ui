<template>
  <VeeField v-slot="{ field, errors }" :name="name" :label="label">
    <div>
      <label
        :for="name"
        class="mb-1.5 block text-sm font-semibold text-[var(--p-text-dim)]"
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
        class="w-full rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] px-4 py-3 text-[0.95rem] leading-6 text-[var(--p-text)] placeholder-[var(--p-text-muted)] transition-all hover:border-[var(--p-text-muted)] focus:border-flamingo-500 focus:bg-[var(--p-surface)] focus:outline-none focus:ring-2 focus:ring-flamingo-500/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--p-surface-sunken)]"
        :class="errors.length ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''"
      />
      <p v-if="helper && !errors.length" class="mt-1 text-xs leading-5 text-[var(--p-text-muted)]">
        {{ helper }}
      </p>
      <div class="mt-1 min-h-[1.25rem]">
        <p v-if="errors.length" class="flex items-start gap-1 text-xs leading-5 text-red-500">
          <UIcon name="i-lucide-alert-circle" class="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{{ errors[0] }}</span>
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
