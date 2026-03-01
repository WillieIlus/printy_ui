<template>
  <VeeField v-slot="{ field, errors }" :name="name" :label="label">
    <div>
      <label
        :for="name"
        class="mb-1.5 block text-sm font-medium text-gray-700"
      >
        {{ label }}
        <span v-if="required" class="text-flamingo-500">*</span>
      </label>
      <UTextarea
        v-bind="field"
        :id="name"
        :placeholder="placeholder"
        :rows="rows"
        :disabled="disabled"
        :color="errors.length ? 'error' : undefined"
        :ui="{
          base: errors.length
            ? 'w-full rounded-xl border border-red-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-red-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 disabled:cursor-not-allowed disabled:opacity-50'
            : 'w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-flamingo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-flamingo-500/20 disabled:cursor-not-allowed disabled:opacity-50',
        }"
      />
      <p v-if="helper && !errors.length" class="mt-1 text-xs text-gray-500 dark:text-gray-400">
        {{ helper }}
      </p>
      <div class="mt-1 min-h-[1.25rem]">
        <p v-if="errors.length" class="flex items-center gap-1 text-xs text-red-500">
          <UIcon name="i-lucide-alert-circle" class="h-3.5 w-3.5 shrink-0" />
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
    rows?: number
    disabled?: boolean
    required?: boolean
    helper?: string
  }>(),
  { rows: 4 }
)
</script>

<style scoped>
:deep(textarea) {
  background-color: transparent;
}
</style>